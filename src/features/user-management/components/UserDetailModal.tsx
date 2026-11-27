import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import { getAdminUser } from '@/api/auth/adminUserApi';
import Modal from '@/components/common/Modal';
import UserAvatar from '@/components/common/UserAvatar';
import Alert from '@/components/ui/Alert';
import { getErrorMessage } from '@/lib/common/apiError';
import { getPrimaryRoleLabel } from '@/lib/auth/roleLabels';
import { useAuthStore } from '@/stores/useAuthStore';
import type { AdminUser } from '@/types/auth/admin';
import type { User } from '@/types/auth/auth';
import AuditLogCard from './AuditLogCard';
import DeleteUserCard from './DeleteUserCard';
import SectionCard from '@/components/common/SectionCard';
import StaffProfileForm from './StaffProfileForm';
import StatusBadge from './StatusBadge';
import UserBranchCard from './UserBranchCard';
import UserInfoForm from './UserInfoForm';
import UserRoleCard from './UserRoleCard';
import UserStatusCard from './UserStatusCard';
import { STAFF_POSITION_LABELS, STAFF_STATUS_LABELS } from '../utils/labels';
import { formatDateTime } from '../utils/format';
import { adminUserDetailKey } from '../utils/queryKeys';

interface UserDetailModalProps {
   userId: number;
   onClose: () => void;
}

export function UserDetailModal({ userId, onClose }: UserDetailModalProps): ReactElement {
   const currentUser: User | null = useAuthStore((authState) => authState.user);
   const isAdmin: boolean = useAuthStore((authState) => authState.hasRole('ROLE_ADMIN'));
   const userQuery: UseQueryResult<AdminUser> = useQuery<AdminUser>({
      queryKey: adminUserDetailKey(userId),
      queryFn: () => getAdminUser(userId),
   });

   function renderContent(): ReactElement {
      if (userQuery.isPending) {
         return <p className="py-10 text-center text-sm text-ink-500">Đang tải thông tin người dùng...</p>;
      }
      if (userQuery.isError) {
         return <Alert variant="error">{getErrorMessage(userQuery.error)}</Alert>;
      }

      const adminUser: AdminUser = userQuery.data;
      const isSelf: boolean = currentUser?.id === adminUser.id;
      const isStaffAccount: boolean =
         adminUser.roles.includes('ROLE_STAFF') || adminUser.roles.includes('ROLE_MANAGER');
      const isDeleted: boolean = adminUser.status === 'DELETED';

      return (
         <div className="space-y-5">
            <header className="flex flex-wrap items-center gap-5 rounded-lg bg-white p-5 shadow-card ring-1 ring-ink-200/80">
               <UserAvatar user={adminUser} className="size-20 text-xl" />
               <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-bold text-ink-900">{adminUser.fullName}</h3>
                  <p className="mt-1 truncate text-sm text-ink-500">{adminUser.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                     <span className="text-xs font-semibold text-brand-700">{getPrimaryRoleLabel(adminUser)}</span>
                     <StatusBadge userStatus={adminUser.status} />
                     {!adminUser.emailVerified && (
                        <span className="rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-semibold text-ink-800 ring-1 ring-accent-200">
                           Email chưa xác thực
                        </span>
                     )}
                  </div>
               </div>
               <dl className="grid gap-1 text-sm text-ink-600">
                  <div>
                     <dt className="inline text-ink-500">Đăng nhập gần nhất: </dt>
                     <dd className="inline font-semibold text-ink-900">{formatDateTime(adminUser.lastLoginAt)}</dd>
                  </div>
                  <div>
                     <dt className="inline text-ink-500">Ngày tạo: </dt>
                     <dd className="inline font-semibold text-ink-900">{formatDateTime(adminUser.createdAt)}</dd>
                  </div>
                  {adminUser.employeeCode && (
                     <div>
                        <dt className="inline text-ink-500">Nhân viên: </dt>
                        <dd className="inline font-semibold text-ink-900">
                           {adminUser.employeeCode}
                           {adminUser.position ? ` · ${STAFF_POSITION_LABELS[adminUser.position]}` : ''}
                           {adminUser.staffStatus ? ` · ${STAFF_STATUS_LABELS[adminUser.staffStatus]}` : ''}
                        </dd>
                     </div>
                  )}
                  {adminUser.branches.length > 0 && (
                     <div>
                        <dt className="inline text-ink-500">Chi nhánh: </dt>
                        <dd className="inline font-semibold text-ink-900">
                           {adminUser.branches
                              .map(
                                 (branchAssignment) =>
                                    `${branchAssignment.cinemaName ?? `#${branchAssignment.cinemaId}`}${
                                       branchAssignment.primary ? ' (chính)' : ''
                                    }`,
                              )
                              .join(', ')}
                        </dd>
                     </div>
                  )}
               </dl>
            </header>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
               <SectionCard title="Thông tin cá nhân">
                  <UserInfoForm key={adminUser.id} adminUser={adminUser} />
               </SectionCard>
               <SectionCard title="Trạng thái tài khoản">
                  <UserStatusCard adminUser={adminUser} isSelf={isSelf} />
               </SectionCard>
               {isAdmin && !isDeleted && (
                  <SectionCard title="Role">
                     <UserRoleCard
                        key={`${adminUser.id}-${adminUser.roles.join()}`}
                        adminUser={adminUser}
                        isSelf={isSelf}
                     />
                  </SectionCard>
               )}
               {isAdmin && !isDeleted && adminUser.employeeCode && isStaffAccount && (
                  <SectionCard title="Hồ sơ nhân viên">
                     <StaffProfileForm key={adminUser.id} adminUser={adminUser} />
                  </SectionCard>
               )}
               {isAdmin && !isDeleted && isStaffAccount && (
                  <SectionCard title="Chi nhánh làm việc" description="Chọn các chi nhánh và một chi nhánh chính.">
                     <UserBranchCard key={adminUser.id} adminUser={adminUser} />
                  </SectionCard>
               )}
               {isAdmin && (
                  <SectionCard title="Xóa tài khoản">
                     <DeleteUserCard adminUser={adminUser} isSelf={isSelf} onDeleted={onClose} />
                  </SectionCard>
               )}
            </div>

            {isAdmin && (
               <SectionCard title="Nhật ký thao tác">
                  <AuditLogCard userId={adminUser.id} />
               </SectionCard>
            )}
         </div>
      );
   }

   return (
      <Modal title="Chi tiết người dùng" size="wide" isFlush onClose={onClose}>
         <div className="relative min-h-0 flex-1 overflow-y-auto bg-ink-50 p-5 focus-visible:outline-none">
            {renderContent()}
         </div>
      </Modal>
   );
}

export default UserDetailModal;
