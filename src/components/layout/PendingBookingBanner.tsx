import {
   useMutation,
   useQuery,
   useQueryClient,
   type QueryClient,
   type UseMutationResult,
   type UseQueryResult,
} from '@tanstack/react-query';
import { Clock, Ticket } from 'lucide-react';
import { useEffect, useState, type ReactElement } from 'react';
import { Link, useLocation, type Location } from 'react-router-dom';
import { cancelPendingBooking, getPendingBooking } from '@/api/booking/bookingApi';
import Button from '@/components/ui/Button';
import { buttonClasses } from '@/lib/common/buttonStyles';
import { mySeatHoldKey, pendingBookingKey, showtimeSeatMapKey } from '@/lib/booking/bookingQueryKeys';
import { getPaymentPath, getSeatSelectionPath } from '@/lib/booking/bookingPaths';
import { formatCountdown } from '@/lib/booking/seatSelection';
import { useHoldCountdown } from '@/lib/booking/useHoldCountdown';
import { formatDisplayDate, toVietnamDate, toVietnamTimeOfDay } from '@/lib/common/vietnamTime';
import { useAuthStore } from '@/stores/useAuthStore';
import type { BookingDetail, BookingSeat } from '@/types/booking/bookingDetail';
import type { User, UserRole } from '@/types/auth/auth';

const BOOKING_FLOW_PATH_PATTERN: RegExp = /^\/movies\/[^/]+\/booking\/\d+(\/|$)/;
const PAYMENT_PATH_PREFIX: string = '/payment/';
const OPERATOR_ROLES: UserRole[] = ['ROLE_STAFF', 'ROLE_MANAGER', 'ROLE_ADMIN'];

function isBookingFlowPath(pathname: string): boolean {
   return BOOKING_FLOW_PATH_PATTERN.test(pathname) || pathname.startsWith(PAYMENT_PATH_PREFIX);
}

function isOperator(user: User): boolean {
   return user.roles.some((userRole) => OPERATOR_ROLES.includes(userRole));
}

function getContinuePath(pendingBooking: BookingDetail): string {
   const { movieSlug, showtimeId } = pendingBooking.showtime;
   return pendingBooking.fnbLines.length > 0
      ? getPaymentPath(movieSlug, showtimeId)
      : getSeatSelectionPath(movieSlug, showtimeId);
}

export function PendingBookingBanner(): ReactElement | null {
   const location: Location = useLocation();
   const queryClient: QueryClient = useQueryClient();
   const user: User | null = useAuthStore((authState) => authState.user);
   const isAuthenticated: boolean = useAuthStore((authState) => authState.isAuthenticated);
   const [confirmingPathname, setConfirmingPathname] = useState<string | null>(null);
   const isConfirmingCancel: boolean = confirmingPathname === location.pathname;
   const isEligible: boolean = isAuthenticated && user !== null && !isOperator(user);
   const isQueryEnabled: boolean = isEligible && !isBookingFlowPath(location.pathname);

   const pendingBookingQuery: UseQueryResult<BookingDetail | null> = useQuery<BookingDetail | null>({
      queryKey: pendingBookingKey(),
      queryFn: getPendingBooking,
      enabled: isQueryEnabled,
      staleTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
   });
   const pendingBooking: BookingDetail | null = pendingBookingQuery.data ?? null;
   const remainingSeconds: number | null = useHoldCountdown(
      pendingBooking?.expiresAt ?? null,
      pendingBooking?.serverTime ?? null,
      pendingBookingQuery.dataUpdatedAt,
   );

   const cancelMutation: UseMutationResult<void, unknown, void> = useMutation<void, unknown, void>({
      mutationFn: cancelPendingBooking,
      onSettled(): void {
         setConfirmingPathname(null);
         if (pendingBooking !== null) {
            void queryClient.invalidateQueries({ queryKey: mySeatHoldKey(pendingBooking.showtime.showtimeId) });
            void queryClient.invalidateQueries({ queryKey: showtimeSeatMapKey(pendingBooking.showtime.showtimeId) });
         }
         void queryClient.invalidateQueries({ queryKey: pendingBookingKey() });
      },
   });

   useEffect((): void => {
      if (remainingSeconds === 0) {
         void queryClient.invalidateQueries({ queryKey: pendingBookingKey() });
      }
   }, [remainingSeconds, queryClient]);

   if (!isQueryEnabled || pendingBooking === null || remainingSeconds === null || remainingSeconds <= 0) {
      return null;
   }

   const seatLabels: string = pendingBooking.seats.map((bookingSeat: BookingSeat) => bookingSeat.label).join(', ');
   const { showtime } = pendingBooking;

   function handleCancelClick(): void {
      if (!isConfirmingCancel) {
         setConfirmingPathname(location.pathname);
         return;
      }
      cancelMutation.mutate();
   }

   function handleKeepClick(): void {
      setConfirmingPathname(null);
   }

   return (
      <div role="status" className="border-b border-brand-200 bg-brand-50">
         <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
               <Ticket className="mt-0.5 size-5 shrink-0 text-brand-700" aria-hidden="true" />
               <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-ink-900">
                     Bạn đang giữ ghế phim {showtime.movieTitle}
                  </p>
                  <p className="text-xs font-medium text-ink-600">
                     {showtime.cinemaName ?? ''} · {toVietnamTimeOfDay(showtime.startTime)}{' '}
                     {formatDisplayDate(toVietnamDate(showtime.startTime))} · Ghế {seatLabels}
                  </p>
               </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
               <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-extrabold tabular-nums text-brand-800 ring-1 ring-brand-200">
                  <Clock className="size-3.5" aria-hidden="true" />
                  Còn {formatCountdown(remainingSeconds)}
               </span>
               {isConfirmingCancel ? (
                  <>
                     <Button size="sm" isLoading={cancelMutation.isPending} onClick={handleCancelClick}>
                        Xác nhận hủy
                     </Button>
                     <Button size="sm" variant="secondary" onClick={handleKeepClick}>
                        Giữ ghế
                     </Button>
                  </>
               ) : (
                  <>
                     <Link
                        to={getContinuePath(pendingBooking)}
                        className={buttonClasses('primary', 'sm', false, undefined)}
                     >
                        Tiếp tục đặt vé
                     </Link>
                     <Button size="sm" variant="secondary" onClick={handleCancelClick}>
                        Hủy giữ ghế
                     </Button>
                  </>
               )}
            </div>
         </div>
      </div>
   );
}

export default PendingBookingBanner;
