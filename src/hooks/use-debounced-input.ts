import { useState, useEffect, useRef } from "react";

function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const handlerRef = useRef<number>();

  useEffect(() => {
    if (handlerRef.current) clearTimeout(handlerRef.current);

    handlerRef.current = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (handlerRef.current) clearTimeout(handlerRef.current);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounceValue;
