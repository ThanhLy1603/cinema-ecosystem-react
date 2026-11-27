import { MessagesSquare, Tag } from 'lucide-react';
import { lazy, Suspense, type ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ComingSoonPage from '@/components/common/ComingSoonPage';
import ForbiddenPage from '@/components/common/ForbiddenPage';
import MainLayout from '@/components/layout/MainLayout';
import FullPageSpinner from '@/components/common/FullPageSpinner';
import { STAFF_NAV_ITEMS, type StaffNavItem } from '@/lib/staff/staffNavItems';
import GuestRoute from '@/features/auth/guards/GuestRoute';
import ProtectedRoute from '@/features/auth/guards/ProtectedRoute';
import HomePage from '@/features/home/pages/HomePage';

const AdminLayout = lazy(() => import('@/components/layout/AdminLayout'));
const StaffLayout = lazy(() => import('@/components/layout/StaffLayout'));
const AuthLayout = lazy(() => import('@/components/layout/AuthLayout'));
const AboutPage = lazy(() => import('@/features/about/pages/AboutPage'));
const AdminDashboardPage = lazy(() => import('@/features/admin/pages/AdminDashboardPage'));
const CheckInPage = lazy(() => import('@/features/staff/pages/CheckInPage'));
const FnbPickupPage = lazy(() => import('@/features/staff/pages/FnbPickupPage'));
const StaffDashboardPage = lazy(() => import('@/features/staff/pages/StaffDashboardPage'));
const FnbSalesPage = lazy(() => import('@/features/staff/pages/FnbSalesPage'));
const ShiftPage = lazy(() => import('@/features/staff/pages/ShiftPage'));
const TicketSalesPage = lazy(() => import('@/features/staff/pages/TicketSalesPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const ProfilePage = lazy(() => import('@/features/auth/pages/ProfilePage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('@/features/auth/pages/VerifyEmailPage'));
const CinemaCreatePage = lazy(() => import('@/features/cinema-management/pages/CinemaCreatePage'));
const CinemaDetailPage = lazy(() => import('@/features/cinema-management/pages/CinemaDetailPage'));
const CinemaManagementPage = lazy(() => import('@/features/cinema-management/pages/CinemaManagementPage'));
const FacilityManagementPage = lazy(() => import('@/features/cinema-management/pages/FacilityManagementPage'));
const SeatMapEditorPage = lazy(() => import('@/features/cinema-management/pages/SeatMapEditorPage'));
const FnbSelectionPage = lazy(() => import('@/features/booking/pages/FnbSelectionPage'));
const MyTicketsPage = lazy(() => import('@/features/tickets/pages/MyTicketsPage'));
const PaymentPage = lazy(() => import('@/features/booking/pages/PaymentPage'));
const PaymentResultPage = lazy(() => import('@/features/booking/pages/PaymentResultPage'));
const PaymentSimulatorPage = lazy(() => import('@/features/booking/pages/PaymentSimulatorPage'));
const SeatSelectionPage = lazy(() => import('@/features/booking/pages/SeatSelectionPage'));
const MovieShowtimeSelectionPage = lazy(() => import('@/features/booking/pages/MovieShowtimeSelectionPage'));
const CinemaListPage = lazy(() => import('@/features/cinemas/pages/CinemaListPage'));
const CinemaPublicPage = lazy(() => import('@/features/cinemas/pages/CinemaPublicPage'));
const FnbMenuPage = lazy(() => import('@/features/fnb/pages/FnbMenuPage'));
const BookingExceptionPage = lazy(() => import('@/features/operations-management/pages/BookingExceptionPage'));
const OperationsHistoryPage = lazy(() => import('@/features/operations-management/pages/OperationsHistoryPage'));
const RevenueReportPage = lazy(() => import('@/features/operations-management/pages/RevenueReportPage'));
const FnbManagementPage = lazy(() => import('@/features/fnb-management/pages/FnbManagementPage'));
const GenreManagementPage = lazy(() => import('@/features/movie-management/pages/GenreManagementPage'));
const MovieManagementPage = lazy(() => import('@/features/movie-management/pages/MovieManagementPage'));
const PersonManagementPage = lazy(() => import('@/features/movie-management/pages/PersonManagementPage'));
const MovieDetailPage = lazy(() => import('@/features/movies/pages/MovieDetailPage'));
const MovieListPage = lazy(() => import('@/features/movies/pages/MovieListPage'));
const PriceRuleManagementPage = lazy(() => import('@/features/price-management/pages/PriceRuleManagementPage'));
const ShowtimeManagementPage = lazy(() => import('@/features/showtime-management/pages/ShowtimeManagementPage'));
const CreateStaffPage = lazy(() => import('@/features/user-management/pages/CreateStaffPage'));
const UserDetailPage = lazy(() => import('@/features/user-management/pages/UserDetailPage'));
const UserManagementPage = lazy(() => import('@/features/user-management/pages/UserManagementPage'));

function renderStaffComingSoonRoute(staffNavItem: StaffNavItem): ReactElement {
   return (
      <Route
         key={staffNavItem.to}
         path={staffNavItem.to.replace('/staff/', '')}
         element={
            <ComingSoonPage
               title={staffNavItem.label}
               description={staffNavItem.description}
               icon={staffNavItem.icon}
               backTo="/staff"
               backLabel="Về trang nhân viên"
            />
         }
      />
   );
}

export function AppRoutes(): ReactElement {
   return (
      <Suspense fallback={<FullPageSpinner />}>
         <Routes>
            <Route element={<GuestRoute />}>
               <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
               </Route>
            </Route>

            <Route element={<AuthLayout />}>
               <Route path="/forgot-password" element={<ForgotPasswordPage />} />
               <Route path="/reset-password" element={<ResetPasswordPage />} />
               <Route path="/verify-email" element={<VerifyEmailPage />} />
            </Route>

            <Route element={<MainLayout />}>
               <Route path="/" element={<HomePage />} />
               <Route path="/movies" element={<MovieListPage />} />
               <Route path="/movies/:movieSlug" element={<MovieDetailPage />} />
               <Route path="/movies/:movieSlug/booking" element={<MovieShowtimeSelectionPage />} />
               <Route path="/fnb" element={<FnbMenuPage />} />
               <Route path="/about" element={<AboutPage />} />
               <Route path="/cinemas" element={<CinemaListPage />} />
               <Route path="/cinemas/:slug" element={<CinemaPublicPage />} />
               <Route
                  path="/promotions"
                  element={
                     <ComingSoonPage
                        title="Khuyến mãi"
                        description="Ưu đãi giảm giá và chương trình tích điểm thành viên sắp được cập nhật."
                        icon={Tag}
                     />
                  }
               />
               <Route
                  path="/community"
                  element={
                     <ComingSoonPage
                        title="Cộng đồng và Blog"
                        description="Nơi chia sẻ đánh giá phim và bài viết điện ảnh đang được xây dựng."
                        icon={MessagesSquare}
                     />
                  }
               />
               <Route element={<ProtectedRoute />}>
                  <Route path="/movies/:movieSlug/booking/:showtimeId/seats" element={<SeatSelectionPage />} />
                  <Route path="/movies/:movieSlug/booking/:showtimeId/fnb" element={<FnbSelectionPage />} />
                  <Route path="/movies/:movieSlug/booking/:showtimeId/payment" element={<PaymentPage />} />
                  <Route path="/payment/result" element={<PaymentResultPage />} />
                  <Route path="/payment/simulator" element={<PaymentSimulatorPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/tickets" element={<MyTicketsPage />} />
               </Route>
               <Route path="/forbidden" element={<ForbiddenPage />} />
               <Route path="*" element={<Navigate to="/" replace />} />
            </Route>

            <Route element={<ProtectedRoute roles={['ROLE_STAFF', 'ROLE_MANAGER', 'ROLE_ADMIN']} />}>
               <Route path="/staff" element={<StaffLayout />}>
                  <Route index element={<StaffDashboardPage />} />
                  <Route path="check-in" element={<CheckInPage />} />
                  <Route path="fnb-pickup" element={<FnbPickupPage />} />
                  <Route path="ticket-sales" element={<TicketSalesPage />} />
                  <Route path="fnb-sales" element={<FnbSalesPage />} />
                  <Route path="shifts" element={<ShiftPage />} />
                  {STAFF_NAV_ITEMS.filter((staffNavItem) => !staffNavItem.end && !staffNavItem.isReady).map(
                     renderStaffComingSoonRoute,
                  )}
               </Route>
            </Route>

            <Route element={<ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_MANAGER']} />}>
               <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="users" element={<UserManagementPage />} />
                  <Route path="users/new" element={<CreateStaffPage />} />
                  <Route path="users/:userId" element={<UserDetailPage />} />
                  <Route path="cinemas" element={<CinemaManagementPage />} />
                  <Route path="cinemas/new" element={<CinemaCreatePage />} />
                  <Route path="cinemas/facilities" element={<FacilityManagementPage />} />
                  <Route path="cinemas/:cinemaId" element={<CinemaDetailPage />} />
                  <Route path="halls/:hallId/seat-map" element={<SeatMapEditorPage />} />
                  <Route path="movies" element={<MovieManagementPage />} />
                  <Route path="movies/genres" element={<GenreManagementPage />} />
                  <Route path="movies/persons" element={<PersonManagementPage />} />
                  <Route path="fnb" element={<FnbManagementPage />} />
                  <Route path="showtimes" element={<ShowtimeManagementPage />} />
                  <Route path="price-rules" element={<PriceRuleManagementPage />} />
                  <Route path="operations/history" element={<OperationsHistoryPage />} />
                  <Route path="operations/revenue" element={<RevenueReportPage />} />
                  <Route path="operations/exceptions" element={<BookingExceptionPage />} />
                  <Route
                     path="promotions"
                     element={
                        <ComingSoonPage
                           title="Quản lý khuyến mãi và bắp nước"
                           description="Chương trình khuyến mãi theo hạng thành viên và danh mục bắp nước sẽ được cập nhật tại đây."
                           icon={Tag}
                           backTo="/admin"
                           backLabel="Về trang quản trị"
                        />
                     }
                  />
                  <Route
                     path="community"
                     element={
                        <ComingSoonPage
                           title="Quản lý cộng đồng và blog"
                           description="Soạn bài viết điện ảnh và kiểm duyệt bình luận, đánh giá sẽ sớm có mặt."
                           icon={MessagesSquare}
                           backTo="/admin"
                           backLabel="Về trang quản trị"
                        />
                     }
                  />
                  <Route path="*" element={<Navigate to="/admin" replace />} />
               </Route>
            </Route>
         </Routes>
      </Suspense>
   );
}

export default AppRoutes;
