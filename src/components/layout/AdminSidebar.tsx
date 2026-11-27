import {
   BadgeDollarSign,
   Building2,
   CalendarClock,
   ChartColumnBig,
   Clapperboard,
   History,
   LayoutDashboard,
   MessagesSquare,
   Popcorn,
   ShieldAlert,
   Tag,
   Users,
} from 'lucide-react';
import type { ReactElement } from 'react';
import { getPrimaryRoleLabel } from '@/lib/auth/roleLabels';
import type { User } from '@/types/auth/auth';
import ConsoleSidebar, { type ConsoleNavItem } from './ConsoleSidebar';

interface AdminSidebarProps {
   user: User | null;
   onNavigate?: () => void;
   onClose?: () => void;
}

const ADMIN_NAV_ITEMS: ConsoleNavItem[] = [
   { label: 'Tổng quan', to: '/admin', icon: LayoutDashboard, end: true },
   { label: 'Người dùng và nhân sự', to: '/admin/users', icon: Users },
   { label: 'Cụm rạp', to: '/admin/cinemas', icon: Building2 },
   { label: 'Phim', to: '/admin/movies', icon: Clapperboard },
   { label: 'Suất chiếu', to: '/admin/showtimes', icon: CalendarClock },
   { label: 'Giá vé', to: '/admin/price-rules', icon: BadgeDollarSign },
   { label: 'Đồ ăn và nước', to: '/admin/fnb', icon: Popcorn },
   { label: 'Lịch sử vận hành', to: '/admin/operations/history', icon: History },
   { label: 'Báo cáo doanh thu', to: '/admin/operations/revenue', icon: ChartColumnBig },
   { label: 'Xử lý ngoại lệ', to: '/admin/operations/exceptions', icon: ShieldAlert },
   { label: 'Khuyến mãi', to: '/admin/promotions', icon: Tag, badge: 'Sắp có' },
   { label: 'Cộng đồng và blog', to: '/admin/community', icon: MessagesSquare, badge: 'Sắp có' },
];

export function AdminSidebar({ user, onNavigate, onClose }: AdminSidebarProps): ReactElement {
   const isAdmin: boolean = Boolean(user?.roles.includes('ROLE_ADMIN'));

   return (
      <ConsoleSidebar
         homePath="/admin"
         sectionLabel="Quản lý hệ thống"
         navigationLabel="Điều hướng quản trị"
         consoleNavItems={ADMIN_NAV_ITEMS}
         roleLabel={user ? getPrimaryRoleLabel(user) : 'Quản trị'}
         scopeLabel={isAdmin ? 'Phạm vi: Toàn hệ thống' : 'Phạm vi: Theo chi nhánh phụ trách'}
         onNavigate={onNavigate}
         onClose={onClose}
      />
   );
}

export default AdminSidebar;
