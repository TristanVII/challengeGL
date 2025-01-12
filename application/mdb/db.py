from collections import deque
from bson.objectid import ObjectId
import pymongo
from abc import ABC, abstractmethod

from pymongo.synchronous.collection import Collection

# client = pymongo.MongoClient("mongodb://localhost:27017/")
# client = pymongo.MongoClient("mongodb+srv://<username>:<password>@cluster0.mongodb.net/test?retryWrites=true&w=majority")

 # {
 #    _id: ObjectId('677796c3efa93568bb4ac408'),
 #    question: '2The question is...',
 #    answer: '2The answer is...',
 #    children: [],
 #    parent: ''
 #  }

class MdbCollection(ABC):
    def __init__(self, collection: Collection):
        self.collection = collection

    def get_from_id(self, id):
        return self.collection.find_one({'_id': ObjectId(id)})

    # TODO: DELETE NEEDS TO ALSO DELETE ALL CHILDREN
    def delete_from_id(self, id):
        all_children = []
        node = self.get_from_id(id)
        print("DELETING NODE", node)
        q = deque([node])
        while q:
            child = q.popleft()
            if child and 'children' in child:
                for x in child['children']:
                    q.append(self.get_from_id(x))
                    all_children.append(x)

        for child in all_children:
            print(f"deleting child {child}")
            self.collection.delete_one({'_id': ObjectId(child)})
        deleted =  self.collection.delete_one({'_id': ObjectId(id)})
        return deleted.acknowledged

    def get_all(self):
        return list(self.collection.find())


class QuestionBank(MdbCollection):
    def __init__(self, collection):
        super().__init__(collection)

    def push(self, obj):
        result = self.collection.insert_one(obj)
        result_id = result.inserted_id
        if result_id:
            try:
                self._push_child(obj['parent'], result_id)
            except Exception as e:
                print("ERROR PUSHING CHILD", e)
        return result_id



    def _push_child(self,id, child):
        result = self.collection.update_one(
            {"_id": ObjectId(id)},
            {"$push": {"children": child}}
        )
        if result.modified_count > 0:
            print("Document updated successfully!")
        else:
            print("No document was updated.")


class FeedbackBank(MdbCollection):
    def __init__(self, collection):
        super().__init__(collection)

    def push(self, obj):
        print("PUSHING FEEDBACK", obj)
        result = self.collection.insert_one(obj)
        return result.inserted_id


class MongoDB:
    def __init__(self, client) -> None:
        self.client = pymongo.MongoClient(client)
        self.db = self.client["treeGPT"]


    def get_question_bank(self) -> QuestionBank:
        collection = self.db['question_bank']
        return QuestionBank(collection)

    def get_feedback_bank(self) -> FeedbackBank:
        collection = self.db['feedback_bank']
        return FeedbackBank(collection)
