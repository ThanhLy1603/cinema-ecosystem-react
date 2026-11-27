import { Building2 } from 'lucide-react';
import type { ReactElement } from 'react';
import { useLocation, type Location } from 'react-router-dom';
import PageOutlet from '@/components/common/PageOutlet';
import { useAuthStore } from '@/stores/useAuthStore';
import type { User } from '@/types/auth/auth';
import AdminSidebar from './AdminSidebar';
import ConsoleShell from './ConsoleShell';
import UserMenu from './UserMenu';

interface RouteTitleRule {
   prefix: string;
   title: string;
}

const ADMIN_TITLE_RULES: RouteTitleRule[] = [
   { prefix: '/admin/users', title: 'Quản lý người dùng' },
   { prefix: '/admin/cinemas', title: 'Cụm rạp và phòng chiếu' },
   { prefix: '/admin/movies/genres', title: 'Thể loại phim' },
   { prefix: '/admin/movies/persons', title: 'Nghệ sĩ và ekip' },
   { prefix: '/admin/movies', title: 'Quản lý phim' },
   { prefix: '/admin/showtimes', title: 'Suất chiếu' },
   { prefix: '/admin/price-rules', title: 'Cấu hình giá vé' },
   { prefix: '/admin/fnb', title: 'Đồ ăn và nước' },
   { prefix: '/admin/operations/history', title: 'Lịch sử vận hành' },
   { prefix: '/admin/operations/revenue', title: 'Báo cáo doanh thu' },
   { prefix: '/admin/operations/exceptions', title: 'Xử lý ngoại lệ' },
   { prefix: '/admin/promotions', title: 'Khuyến mãi' },
   { prefix: '/admin/community', title: 'Cộng đồng và blog' },
];

function getAdminPageTitle(pathname: string): string {
   const normalizedPathname: string = pathname.replace(/\/+$/, '');
   const routeTitleRule: RouteTitleRule | undefined = ADMIN_TITLE_RULES.find((rule) =>
      normalizedPathname.startsWith(rule.prefix),
   );
   return routeTitleRule ? routeTitleRule.title : 'Tổng quan quản trị';
}

export function AdminLayout(): ReactElement {
   const user: User | null = useAuthStore((authState) => authState.user);
   const location: Location = useLocation();

   return (
      <ConsoleShell
         renderSidebar={(consoleDrawerActions) => <AdminSidebar user={user} {...consoleDrawerActions} />}
         headerIcon={Building2}
         sectionName="Quản trị"
         pageTitle={getAdminPageTitle(location.pathname)}
         menuLabel="Mở menu quản trị"
         headerActions={user && <UserMenu user={user} />}
      >
         <PageOutlet />
      </ConsoleShell>
   );
}

export default AdminLayout;
