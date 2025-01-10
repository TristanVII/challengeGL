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
