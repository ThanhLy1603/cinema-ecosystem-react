import { MapPin, Ticket } from 'lucide-react';
import type { ReactElement } from 'react';
import { useLocation, type Location } from 'react-router-dom';
import PageOutlet from '@/components/common/PageOutlet';
import FullPageSpinner from '@/components/common/FullPageSpinner';
import Alert from '@/components/ui/Alert';
import SelectField, { type SelectOption } from '@/components/ui/SelectField';
import { STAFF_NAV_ITEMS, type StaffNavItem } from '@/lib/staff/staffNavItems';
import { useStaffBranch, type StaffBranchSelection } from '@/lib/staff/useStaffBranch';
import { useAuthStore } from '@/stores/useAuthStore';
import type { User } from '@/types/auth/auth';
import ConsoleShell from './ConsoleShell';
import StaffSidebar from './StaffSidebar';
import UserMenu from './UserMenu';

const DEFAULT_PAGE_TITLE: string = 'Tổng quan';

function getStaffPageTitle(pathname: string): string {
   const matchedNavItem: StaffNavItem | undefined = STAFF_NAV_ITEMS.filter((staffNavItem) => !staffNavItem.end).find(
      (staffNavItem) => pathname.startsWith(staffNavItem.to),
   );
   return matchedNavItem ? matchedNavItem.label : DEFAULT_PAGE_TITLE;
}

export function StaffLayout(): ReactElement {
   const user: User | null = useAuthStore((authState) => authState.user);
   const location: Location = useLocation();
   const staffBranchSelection: StaffBranchSelection = useStaffBranch();
   const branchOptions: SelectOption[] = staffBranchSelection.branches.map((branch) => ({
      value: String(branch.cinemaId),
      label: branch.cinemaName ?? `Chi nhánh ${branch.cinemaId}`,
   }));

   function handleBranchChange(cinemaId: string): void {
      if (cinemaId !== '') {
         staffBranchSelection.selectBranch(Number(cinemaId));
      }
   }

   function renderBranchControl(): ReactElement | null {
      if (staffBranchSelection.branches.length === 0) {
         return null;
      }
      if (staffBranchSelection.branches.length === 1) {
         return (
            <span className="hidden items-center gap-2 rounded-xl border border-ink-200 bg-ink-100 px-3 py-2 text-sm font-bold text-ink-800 sm:inline-flex">
               <MapPin className="size-4 text-brand-600" aria-hidden="true" />
               {branchOptions[0].label}
            </span>
         );
      }
      return (
         <div className="hidden w-64 sm:block">
            <SelectField
               id="staff-branch"
               label="Chi nhánh đang làm việc"
               hideLabel
               value={staffBranchSelection.currentBranch ? String(staffBranchSelection.currentBranch.cinemaId) : ''}
               onChange={handleBranchChange}
               options={branchOptions}
               placeholder="Chọn chi nhánh"
               triggerClassName="h-9 text-sm font-semibold"
               menuClassName="right-0 w-72"
            />
         </div>
      );
   }

   function renderMainContent(): ReactElement {
      if (staffBranchSelection.isLoading) {
         return <FullPageSpinner />;
      }
      if (staffBranchSelection.isError) {
         return <Alert variant="error">Không tải được thông tin chi nhánh. Vui lòng tải lại trang.</Alert>;
      }
      if (staffBranchSelection.branches.length === 0) {
         return (
            <Alert variant="info">
               Tài khoản của bạn chưa được gán chi nhánh nào. Vui lòng liên hệ quản lý để được phân công.
            </Alert>
         );
      }
      return <PageOutlet />;
   }

   return (
      <ConsoleShell
         renderSidebar={(consoleDrawerActions) => <StaffSidebar user={user} {...consoleDrawerActions} />}
         headerIcon={Ticket}
         sectionName="Nhân viên"
         pageTitle={getStaffPageTitle(location.pathname)}
         menuLabel="Mở menu nhân viên"
         headerActions={
            <>
               {renderBranchControl()}
               {user && <UserMenu user={user} />}
            </>
         }
      >
         {renderMainContent()}
      </ConsoleShell>
   );
}

export default StaffLayout;
