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
        return result_id



    def _push_child(self,id, child):
        result = self.collection.update_one(
            {"_id": id},
            {"$push": {"children": child}}
        )
        if result.modified_count > 0:
            print("Document updated successfully!")
        else:
            print("No document was updated.")


class MongoDB:
    def __init__(self, client) -> None:
        self.client = pymongo.MongoClient(client)
        self.db = self.client["treeGPT"]


    def get_question_bank(self) -> QuestionBank:
        collection = self.db['question_bank']
        return QuestionBank(collection)
