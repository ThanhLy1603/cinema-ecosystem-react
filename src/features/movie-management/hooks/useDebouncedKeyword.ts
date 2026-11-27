import { useEffect, useEffectEvent, useState } from 'react';

const KEYWORD_DEBOUNCE_MS: number = 350;

export interface DebouncedKeyword {
   typedKeyword: string;
   setTypedKeyword: (typedKeyword: string) => void;
   applyKeyword: () => void;
}

export function useDebouncedKeyword(appliedKeyword: string, onApply: (keyword: string) => void): DebouncedKeyword {
   const [typedKeyword, setTypedKeyword] = useState<string>(appliedKeyword);
   const [syncedKeyword, setSyncedKeyword] = useState<string>(appliedKeyword);

   if (appliedKeyword !== syncedKeyword) {
      setSyncedKeyword(appliedKeyword);
      if (appliedKeyword !== typedKeyword.trim()) {
         setTypedKeyword(appliedKeyword);
      }
   }

   function applyKeyword(): void {
      const nextKeyword: string = typedKeyword.trim();
      if (nextKeyword !== appliedKeyword) {
         onApply(nextKeyword);
      }
   }

   const applyLatestKeyword: () => void = useEffectEvent(applyKeyword);

   useEffect((): (() => void) => {
      const timeoutId: ReturnType<typeof setTimeout> = setTimeout(
         (): void => applyLatestKeyword(),
         KEYWORD_DEBOUNCE_MS,
      );
      return (): void => clearTimeout(timeoutId);
   }, [typedKeyword]);

   return { typedKeyword, setTypedKeyword, applyKeyword };
}
