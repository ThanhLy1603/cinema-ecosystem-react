import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useNavigate, type NavigateFunction } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

export function useFinishSignOut(): () => void {
   const queryClient: QueryClient = useQueryClient();
   const navigate: NavigateFunction = useNavigate();
   const clearSession: () => void = useAuthStore((authState) => authState.logout);

   return function finishSignOut(): void {
      clearSession();
      queryClient.clear();
      navigate('/', { replace: true });
   };
}
