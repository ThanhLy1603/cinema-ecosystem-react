import { useEffect, useRef, useState, type RefObject } from 'react';

const VISIBILITY_THRESHOLD: number = 0;
const PRELOAD_MARGIN: string = '0px 0px 80px 0px';

export function useInView<ElementType extends Element>(): [RefObject<ElementType | null>, boolean] {
   const elementRef = useRef<ElementType | null>(null);
   const [isInView, setIsInView] = useState<boolean>(() => typeof IntersectionObserver === 'undefined');

   useEffect((): (() => void) | undefined => {
      const element: ElementType | null = elementRef.current;
      if (element === null || typeof IntersectionObserver === 'undefined') {
         return undefined;
      }

      let intersectionObserver: IntersectionObserver | null = null;

      function stopWatching(): void {
         intersectionObserver?.disconnect();
         window.removeEventListener('scroll', handlePositionCheck);
         window.removeEventListener('resize', handlePositionCheck);
         window.removeEventListener('touchmove', handlePositionCheck);
      }

      function reveal(): void {
         setIsInView(true);
         stopWatching();
      }

      function handlePositionCheck(): void {
         const elementTop: number = element!.getBoundingClientRect().top;
         if (elementTop < window.innerHeight) {
            reveal();
         }
      }

      function handleIntersection(entries: IntersectionObserverEntry[]): void {
         if (entries.some((entry) => entry.isIntersecting)) {
            reveal();
         }
      }

      intersectionObserver = new IntersectionObserver(handleIntersection, {
         threshold: VISIBILITY_THRESHOLD,
         rootMargin: PRELOAD_MARGIN,
      });
      intersectionObserver.observe(element);

      window.addEventListener('scroll', handlePositionCheck, { passive: true });
      window.addEventListener('resize', handlePositionCheck, { passive: true });
      window.addEventListener('touchmove', handlePositionCheck, { passive: true });
      handlePositionCheck();

      return stopWatching;
   }, []);

   return [elementRef, isInView];
}
