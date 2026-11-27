import { useSearchParams, type SetURLSearchParams } from 'react-router-dom';

export interface ModalParams {
   getText: (name: string) => string | null;
   getId: (name: string) => number | null;
   openModal: (name: string, value: string | number) => void;
   closeModal: (...names: string[]) => void;
}

export function useModalParams(): ModalParams {
   const [searchParams, setSearchParams]: [URLSearchParams, SetURLSearchParams] = useSearchParams();

   function updateParams(change: (urlSearchParams: URLSearchParams) => void): void {
      setSearchParams(
         (previousSearchParams) => {
            const nextSearchParams: URLSearchParams = new URLSearchParams(previousSearchParams);
            change(nextSearchParams);
            return nextSearchParams;
         },
         { replace: true },
      );
   }

   return {
      getText(name: string): string | null {
         return searchParams.get(name);
      },
      getId(name: string): number | null {
         const id: number = Number(searchParams.get(name));
         return Number.isInteger(id) && id > 0 ? id : null;
      },
      openModal(name: string, value: string | number): void {
         updateParams((urlSearchParams) => urlSearchParams.set(name, String(value)));
      },
      closeModal(...names: string[]): void {
         updateParams((urlSearchParams): void => {
            for (const name of names) {
               urlSearchParams.delete(name);
            }
         });
      },
   };
}
