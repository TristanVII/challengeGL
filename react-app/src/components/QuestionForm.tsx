import { useState } from "react";
import { GearIcon, TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProcessedGraphNode } from "@/utils/buildGraph";

interface QuestionFormProps {
  onAskQuestion: (
    question: string,
    parentId: string | null,
  ) => Promise<Response>;
  currentNode: ProcessedGraphNode | null;
  isVisible: boolean;
  onClick: () => void;
  apiKey: string;
  onSetApiKey: (apiKey: string) => void;
  onhandleSuccesfullResponse: (params: {
    question: string;
    answer: string;
    node_id: string;
    parent_id: string | null;
  }) => void;
}

export function QuestionForm({
  onAskQuestion,
  currentNode,
  isVisible,
  onClick,
  apiKey,
  onSetApiKey,
  onhandleSuccesfullResponse,
}: QuestionFormProps) {
  const [question, setQuestion] = useState("");
  const [newApiKey, setNewApiKey] = useState(apiKey);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      console.log(question, currentNode);
      onAskQuestion(question, currentNode ? currentNode._id : null)
        .then((res) => res.json())
        .then((res) => onhandleSuccesfullResponse(res));
      setQuestion("");
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newApiKey.trim()) {
      onSetApiKey(newApiKey);
      setNewApiKey("");
      setShowApiKeyForm(false); // Hide the form after updating
    }
  };

  const onDeleteQuestion = (questionId?: string) => {
    if (!questionId) {
      return;
    }
    fetch(`http://127.0.0.1:8000/question/${questionId}`, { method: "DELETE" })
      .then(() => {
        console.log("question deleted");
        // toast
      })
      .catch(() => {
        console.error("Failed to delete question");
        // toast error
      });
  };

  if (!isVisible) return null;

  return (
    <Card className="w-full max-w-md absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm">
      <CardHeader className="relative flex flex-row items-center justify-between p-4">
        {/* Right Icon (Close Button) */}
        <button
          className="absolute top-0 left-0 pt-1 pl-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={onClick}
        >
          ✕
        </button>

        {/* Center Content: Title */}
        <div className="flex items-center justify-center flex-1 space-x-2">
          {/* Gear Icon */}
          <GearIcon
            className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={() => setShowApiKeyForm(!showApiKeyForm)}
          />
          {/* Title */}
          <CardTitle>
            {currentNode
              ? "Ask a follow-up question"
              : "Create a new Node by asking a question"}
          </CardTitle>
          <button
            className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={() => onDeleteQuestion(currentNode?._id)}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {showApiKeyForm ? (
          <form
            onSubmit={handleApiKeySubmit}
            className="flex flex-col space-y-4"
          >
            <Input
              type="text"
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
            <Button type="submit">Set API Key</Button>
          </form>
        ) : currentNode ? (
          <div className="mb-4">
            <h3 className="font-semibold">Current Question:</h3>
            <p>{currentNode.question}</p>
            <h3 className="font-semibold mt-2">Answer:</h3>
            <p>{currentNode.answer}</p>
          </div>
        ) : null}
        {!showApiKeyForm && (
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <Input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here"
            />
            <Button type="submit">Ask</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
