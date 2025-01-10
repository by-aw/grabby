"use client";

import { useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize with initial value during SSR
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Once mounted, get the value from localStorage
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsedItem = JSON.parse(item);
        if (JSON.stringify(parsedItem) !== JSON.stringify(storedValue)) {
          setStoredValue(parsedItem);
        }
      }
    } catch (error) {}
  }, [key, initialValue]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {}
  };

  return [storedValue, setValue] as const;
}
