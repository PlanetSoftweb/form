import { useEffect, RefObject } from 'react';

export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  handler: () => void,
  excludeRef?: RefObject<HTMLElement>
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      if (excludeRef?.current?.contains(event.target as Node)) {
        return;
      }

      handler();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler, excludeRef]);
};