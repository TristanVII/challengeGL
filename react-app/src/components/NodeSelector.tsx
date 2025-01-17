import { NodeSelectorInterface, Category, NodeItem } from "../nodes/types";
import { useState } from "react";
import {
  getFavoriteNodesLocalStorage,
  setFavoriteNodesLocalStorage,
} from "../utils/localStorage";

interface NodeSelectorProps {
  allNodes: NodeSelectorInterface;
  removeDebugNode: () => void;
}

// This component is the node selector: it handles the expansion and contraction of the node selector
export function NodeSelector({ allNodes, removeDebugNode }: NodeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [favoriteNodesIds, setFavoriteNodesIds] = useState<Set<string>>(
    new Set(getFavoriteNodesLocalStorage())
  );
  const categoryNames = [...allNodes.categories.map((cat) => cat.name), "All"];
  const [selectedTab, setSelectedTab] = useState("All");

  // Filter function for nodes
  const filterNodes = (category: Category) => {
    const searchLower = searchTerm.toLowerCase();
    return category.nodes.filter((node) =>
      node.name.toLowerCase().includes(searchLower)
    );
  };

  // Filter function for categories
  const filterCategories = () => {
    return allNodes.categories.filter(
      (cat) =>
        (selectedTab === "All" || cat.name === selectedTab) &&
        (searchTerm === "" ||
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          // Check if any nodes in the category match the search
          cat.nodes.some((node) =>
            node.name.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    );
  };

  // Handle close with transition
  const handleClose = () => {
    setIsTransitioning(true);
    setIsExpanded(false);
  };

  // Because transition looks ugly on open
  // Handle open without transition
  const handleOpen = () => {
    setIsTransitioning(false);
    setIsExpanded(true);
  };

  const handleToggleFavorite = (node: NodeItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteNodes = new Set(favoriteNodesIds);
    if (newFavoriteNodes.has(node.nodeId)) {
      newFavoriteNodes.delete(node.nodeId);
    } else {
      newFavoriteNodes.add(node.nodeId);
    }
    setFavoriteNodesIds(newFavoriteNodes);
    setFavoriteNodesLocalStorage(Array.from(newFavoriteNodes));
  };

  return (
    <div
      className={`${
        isTransitioning ? "transition-all duration-300 ease-in-out" : ""
      } ${
        isExpanded
          ? "w-[400px] bg-white rounded-xl p-4 h-[75vh]"
          : "w-12 h-12 bg-pink-500 rounded-full"
      } flex flex-col relative`}
    >
      {isExpanded ? (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-700">
              Node Selector
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>

          {/* Search Bar - Fixed at top */}
          <div className="relative mb-4 flex-shrink-0">
            <input
              type="text"
              placeholder="Search"
              className="w-full py-2 pl-5 pr-4 border rounded-lg bg-gray-50 focus:outline-pink-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tabs - Fixed below search */}
          <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
            {categoryNames.map((name) => (
              <button
                key={name}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedTab === name
                    ? "bg-gray-400 text-gray-100"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setSelectedTab(name)}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Scrollable Categories */}
          <div className="space-y-4 overflow-y-auto flex-grow">
            {filterCategories().map((category) => {
              let filteredNodes = filterNodes(category);
              if (category.name === "Favorite") {
                filteredNodes = filteredNodes.filter((node) =>
                  favoriteNodesIds.has(node.nodeId)
                );
              }

              return (
                <div key={category.name} className="border rounded-xl p-4">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <p className="text-sm text-gray-500">
                        {category.description}
                      </p>
                    </div>
                    {/* count */}
                    <span className="text-sm text-gray-400">
                      {filteredNodes.length}
                    </span>
                  </div>

                  {/* Category Items */}
                  <div className="grid grid-cols-2 gap-2">
                    {filteredNodes.length > 0 ? (
                      filteredNodes.map((node) => (
                        <button
                          key={node.name}
                          onClick={node.func}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left text-sm group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-pink-500">🍥</span>
                            <span>{node.name}</span>
                          </div>
                          <div
                            onClick={(e) => handleToggleFavorite(node, e)}
                            className="text-gray-400 hover:text-yellow-400 transition-colors"
                          >
                            {favoriteNodesIds.has(node.nodeId) ? (
                              <span className="text-yellow-400">★</span>
                            ) : (
                              <span className="opacity-0 group-hover:opacity-100">
                                ☆
                              </span>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 col-span-2">
                        No matching nodes found
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        // Minimized view
        <button
          onClick={handleOpen}
          className="w-full h-full flex items-center justify-center text-white text-2xl font-bold hover:bg-pink-600 rounded-full transition-colors"
        >
          +
        </button>
      )}
    </div>
  );
}
