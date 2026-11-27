import type { ReactElement } from 'react';
import { getPrimaryRoleLabel } from '@/lib/auth/roleLabels';
import { STAFF_NAV_ITEMS } from '@/lib/staff/staffNavItems';
import type { User } from '@/types/auth/auth';
import ConsoleSidebar, { type ConsoleNavItem } from './ConsoleSidebar';

interface StaffSidebarProps {
   user: User | null;
   onNavigate?: () => void;
   onClose?: () => void;
}

const STAFF_CONSOLE_NAV_ITEMS: ConsoleNavItem[] = STAFF_NAV_ITEMS.map((staffNavItem) => ({
   label: staffNavItem.label,
   to: staffNavItem.to,
   icon: staffNavItem.icon,
   end: staffNavItem.end,
   badge: staffNavItem.isReady ? undefined : 'Sắp có',
}));

export function StaffSidebar({ user, onNavigate, onClose }: StaffSidebarProps): ReactElement {
   return (
      <ConsoleSidebar
         homePath="/staff"
         sectionLabel="Công việc tại rạp"
         navigationLabel="Điều hướng nhân viên"
         consoleNavItems={STAFF_CONSOLE_NAV_ITEMS}
         roleLabel={user ? getPrimaryRoleLabel(user) : 'Nhân viên rạp'}
         scopeLabel="Phạm vi: Theo chi nhánh được gán"
         onNavigate={onNavigate}
         onClose={onClose}
      />
   );
}

export default StaffSidebar;
