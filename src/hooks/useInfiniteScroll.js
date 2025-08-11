import { useEffect, useRef } from "react";

export const useInfiniteScroll = (callback, options = {}) => {
  const { offset = 50, debounceDelay = 200 } = options;

  const debounceTimeoutRef = useRef(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const handleScroll = () => {
      if (debounceTimeoutRef.current) return;

      debounceTimeoutRef.current = setTimeout(() => {
        const scrollPosition = window.innerHeight + window.scrollY;
        const threshold = document.body.offsetHeight - offset;
        const nearBottom = scrollPosition >= threshold;

        if (nearBottom) callbackRef.current();

        debounceTimeoutRef.current = null;
      }, debounceDelay);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(debounceTimeoutRef.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [offset, debounceDelay]);
};
