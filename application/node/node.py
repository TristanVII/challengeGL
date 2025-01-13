# NOT USED ANYMORE
class Node:
    def __init__(self, val, parent, id) -> None:
        if not id:
            raise Exception('Node missing id')
        self.parent = parent
        self.id = id 
        self.val = val
        self.children = []

    def add_node(self, node):
        self.children.append(node)

    def get_question_for_node(self):
        '''
        query redis to get the {self.id}::question
        '''
        pass

    def get_answer_for_node(self):
        '''
        query redis to get the {self.id}::answer
        '''
        pass

    def set_question_for_node(self):
        '''
        query redis to get the {self.id}::question
        '''
        pass

    def set_answer_for_node(self):
        '''
        query redis to get the {self.id}::answer
        '''
        pass

