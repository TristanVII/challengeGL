"use client";

import { useEffect, useState } from "react";
import {
  buildGraph,
  ProcessedGraphNode,
  findNodeById,
  getPathToNode,
} from "@/utils/buildGraph";
import { GraphVisualization } from "@/components/GraphVisualization";
import { QuestionForm } from "@/components/QuestionForm";
import { FloatingQuestionIcon } from "@/components/floatingQuestionIcon";
import {
  checkLocalStorageKey,
  setLocalStorageKeyValue,
} from "@/utils/localStorage";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { formatQuestionResponse } from "@/utils/data";

const LOCAL_STORAGE_KEY = "treeGPT_API_KEY";

// This would typically come from an API or database
// const mockData = [
//   {
//     id: "root1",
//     question: "What is the meaning of life?",
//     answer:
//       "The meaning of life is subjective and can vary for each individual.",
//     children: ["philosophy", "science"],
//     owner: "person",
//   },
//   {
//     id: "root2",
//     question: "What is the nature of reality?",
//     answer:
//       "The nature of reality is a complex philosophical and scientific question with various interpretations.",
//     children: ["metaphysics"],
//     owner: "person",
//   },
//   {
//     id: "philosophy",
//     question: "How do philosophers approach this question?",
//     answer:
//       "Philosophers have debated this question for centuries, offering various perspectives.",
//     children: ["existentialism"],
//     parent: "root1",
//     owner: "person",
//   },
//   {
//     id: "science",
//     question: "What does science say about the meaning of life?",
//     answer:
//       "Science focuses on understanding life rather than prescribing meaning to it.",
//     children: ["biology"],
//     parent: "root1",
//     owner: "person",
//   },
//   {
//     id: "existentialism",
//     question: "What is the existentialist view on the meaning of life?",
//     answer:
//       "Existentialists believe that individuals create their own meaning in life.",
//     children: [],
//     parent: "philosophy",
//     owner: "person",
//   },
//   {
//     id: "biology",
//     question: "How does biology define life?",
//     answer:
//       "Biology defines life as a characteristic of organisms that maintain homeostasis, are composed of cells, undergo metabolism, can grow, adapt to their environment, respond to stimuli, and reproduce.",
//     children: [],
//     parent: "science",
//     owner: "person",
//   },
//   {
//     id: "metaphysics",
//     question: "What is metaphysics?",
//     answer:
//       "Metaphysics is a branch of philosophy that examines the fundamental nature of reality, including the relationship between mind and matter, substance and attribute, and possibility and actuality.",
//     children: [],
//     parent: "root2",
//     owner: "person",
//   },
// ];

export default function Home() {
  const [roots, setRoots] = useState<ProcessedGraphNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [isQuestionFormVisible, setIsQuestionFormVisible] = useState(false);
  const [API_KEY, setApiKey] = useState(
    checkLocalStorageKey(LOCAL_STORAGE_KEY),
  );

  useEffect(() => {
    async function fetchQuestions() {
      const fpPromise = FingerprintJS.load();
      const fp = await fpPromise;
      const id = (await fp.get()).visitorId;
      setUserId(id);
      console.log("visitor ID: ", id);
      const res = await fetch(`http://127.0.0.1:8000/questions?id=${id}`);
      if (!res.ok) {
        return;
      }
      const response = await res.json();
      const data = JSON.parse(response);
      setRoots(buildGraph(data.map(formatQuestionResponse)));
    }
    fetchQuestions();
  }, []);

  const onSetApiKey = (apiKey: string): void => {
    setApiKey(apiKey);
    setLocalStorageKeyValue(LOCAL_STORAGE_KEY, apiKey);
  };

  const handleNodeClick = (nodeId: string | null) => {
    // unselect node
    if (!nodeId) {
      setSelectedNodeId(null);
      setHighlightedPath([]);
      return;
    }

    setSelectedNodeId(nodeId);
    const path = roots.reduce((acc, root) => {
      const nodePath = getPathToNode(root, nodeId);
      return nodePath.length > 0 ? nodePath : acc;
    }, []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setHighlightedPath(path as any);
  };

  const handleAskQuestion = (
    question: string,
    parentId: string | null,
  ): Promise<Response> => {
    const request = new Request("http://127.0.0.1:8000/question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        question: question,
        question_parent_id: parentId ?? "",
        model: "", // TODO
        key: "",
      }),
    });

    return fetch(request);
  };

  const handleSuccesfullResponse = (params: {
    question: string;
    answer: string;
    node_id: string;
    parent_id: string | null;
  }) => {
    const { question, answer, node_id, parent_id } = params;
    const newNode: ProcessedGraphNode = {
      _id: node_id,
      question,
      answer,
      children: [],
      childNodes: [],
      parent: parent_id,
    };

    if (parent_id) {
      const updatedRoots = roots.map((root) => {
        const updatedRoot = { ...root };
        const parentNode = findNodeById(updatedRoot, parent_id);
        if (parentNode) {
          parentNode.childNodes.push(newNode);
        }
        return updatedRoot;
      });
      setRoots(updatedRoots);
    } else {
      setRoots([...roots, newNode]);
    }

    setSelectedNodeId(newNode._id);
    setHighlightedPath([newNode._id]);
  };
  const toggleQuestionForm = () => setIsQuestionFormVisible((prev) => !prev);

  const selectedNode = selectedNodeId
    ? roots.reduce(
        (acc, root) => acc || findNodeById(root, selectedNodeId),
        null as ProcessedGraphNode | null,
      )
    : null;

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <GraphVisualization
        roots={roots}
        onNodeClick={handleNodeClick}
        highlightedPath={highlightedPath}
      />
      <QuestionForm
        onAskQuestion={handleAskQuestion}
        currentNode={selectedNode}
        isVisible={isQuestionFormVisible}
        onClick={toggleQuestionForm}
        apiKey={API_KEY}
        onSetApiKey={onSetApiKey}
        onhandleSuccesfullResponse={handleSuccesfullResponse}
      />
      {}
      <FloatingQuestionIcon
        onClick={toggleQuestionForm}
        hidden={isQuestionFormVisible}
      />
    </main>
  );
}
