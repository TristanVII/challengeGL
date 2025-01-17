const FAVORITE_NODES_KEY = "favoriteNodes";
export const checkLocalStorageKey = (keyToCheck: string) => {
  // Check if a specific key exists in localStorage
  const value = localStorage.getItem(keyToCheck);

  if (value !== null) {
    console.log(`Key "${keyToCheck}" exists with value:`, value);
  } else {
    console.log(`Key "${keyToCheck}" does not exist.`);
  }
  return value ? JSON.parse(value) : null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setLocalStorageKeyValue = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFavoriteNodesLocalStorage = (): string[] => {
  try {
    const storedValue = localStorage.getItem(FAVORITE_NODES_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);

    // Validate that we got an array of strings
    if (
      !Array.isArray(parsedValue) ||
      !parsedValue.every((item) => typeof item === "string")
    ) {
      console.warn("Invalid data format in localStorage for favorite nodes");
      return [];
    }

    console.log("favorite nodes", parsedValue);
    return parsedValue;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

export const setFavoriteNodesLocalStorage = (nodes: string[]): boolean => {
  try {
    // Validate input
    if (
      !Array.isArray(nodes) ||
      !nodes.every((item) => typeof item === "string")
    ) {
      throw new Error("Invalid input: expected array of strings");
    }

    console.log("setting favorite nodes", nodes);
    localStorage.setItem(FAVORITE_NODES_KEY, JSON.stringify(nodes));
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
};
