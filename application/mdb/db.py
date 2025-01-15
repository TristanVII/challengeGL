from collections import deque
from bson.objectid import ObjectId
import pymongo
from abc import ABC, abstractmethod

from pymongo.synchronous.collection import Collection

class MdbCollection(ABC):
    def __init__(self, collection: Collection):
        self.collection = collection

    def get_from_id(self, id):
        return self.collection.find_one({'_id': ObjectId(id)})

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

    def get_all(self, user_id):
        return list(self.collection.find({'user_id': user_id}))


class QuestionBank(MdbCollection):
    def __init__(self, collection):
        super().__init__(collection)

    def push(self, obj):
        try:
            result = self.collection.insert_one(obj)
            result_id = result.inserted_id
            if result_id and obj['parent_id']:
                try:
                    self._push_child(obj['parent_id'], result_id)
                except Exception as e:
                        print("ERROR PUSHING CHILD", e)
                return result_id
        except Exception as e:
            print("ERROR PUSHING QUESTION", e)
            return None



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
