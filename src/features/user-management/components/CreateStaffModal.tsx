import {
   useMutation,
   useQueryClient,
   type QueryClient,
   type UseMutationResult,
   type UseQueryResult,
} from '@tanstack/react-query';
import { Mail, Phone, User as UserIcon, UserPlus } from 'lucide-react';
import { useState, type FormEvent, type ReactElement } from 'react';
import Modal from '@/components/common/Modal';
import { createStaff } from '@/api/auth/staffApi';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import SelectField, { type SelectOption } from '@/components/ui/SelectField';
import TextField from '@/components/ui/TextField';
import { getErrorCode, getErrorMessage } from '@/lib/common/apiError';
import { getRoleLabel } from '@/lib/auth/roleLabels';
import { validateEmail, validateFullName, validateNewPassword, validatePhone } from '@/lib/auth/validation';
import { useAuthStore } from '@/stores/useAuthStore';
import type { CreateStaffRequest, StaffPosition, StaffResponse, StaffRole } from '@/types/auth/staff';
import type { CinemaOption } from '@/types/cinema/cinema';
import BranchPicker from './BranchPicker';
import { useCinemaOptions } from '../hooks/useCinemaOptions';
import { STAFF_POSITION_OPTIONS } from '../utils/labels';
import { ADMIN_USER_LIST_KEY } from '../utils/queryKeys';
import {
   emptyToNull,
   validateBranchSelection,
   validateEmployeeCode,
   validateRequiredSelection,
} from '../utils/validation';

interface CreateStaffFieldErrors {
   email?: string;
   password?: string;
   fullName?: string;
   phone?: string;
   employeeCode?: string;
   role?: string;
   position?: string;
   branches?: string;
}

const ADMIN_ROLE_OPTIONS: SelectOption[] = [
   { value: 'ROLE_STAFF', label: getRoleLabel('ROLE_STAFF') },
   { value: 'ROLE_MANAGER', label: getRoleLabel('ROLE_MANAGER') },
];
const MANAGER_ROLE_OPTIONS: SelectOption[] = [{ value: 'ROLE_STAFF', label: getRoleLabel('ROLE_STAFF') }];

function hasFieldErrors(fieldErrors: CreateStaffFieldErrors): boolean {
   return Object.values(fieldErrors).some((message) => message !== undefined);
}

interface CreateStaffModalProps {
   onClose: () => void;
   onCreated: (fullName: string) => void;
}

export function CreateStaffModal({ onClose, onCreated }: CreateStaffModalProps): ReactElement {
   const queryClient: QueryClient = useQueryClient();
   const isAdmin: boolean = useAuthStore((authState) => authState.hasRole('ROLE_ADMIN'));
   const cinemaOptionsQuery: UseQueryResult<CinemaOption[]> = useCinemaOptions();
   const [email, setEmail] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   const [fullName, setFullName] = useState<string>('');
   const [phone, setPhone] = useState<string>('');
   const [role, setRole] = useState<string>('ROLE_STAFF');
   const [employeeCode, setEmployeeCode] = useState<string>('');
   const [position, setPosition] = useState<string>('TICKETING_STAFF');
   const [hiredAt, setHiredAt] = useState<string>('');
   const [selectedCinemaIds, setSelectedCinemaIds] = useState<number[]>([]);
   const [primaryCinemaId, setPrimaryCinemaId] = useState<number | null>(null);
   const [fieldErrors, setFieldErrors] = useState<CreateStaffFieldErrors>({});

   function handleCreated(): void {
      void queryClient.invalidateQueries({ queryKey: ADMIN_USER_LIST_KEY });
      onCreated(fullName.trim());
   }

   const createMutation: UseMutationResult<StaffResponse, unknown, CreateStaffRequest> = useMutation<
      StaffResponse,
      unknown,
      CreateStaffRequest
   >({
      mutationFn: createStaff,
      onSuccess: handleCreated,
   });

   const errorCode: string | null = createMutation.isError ? getErrorCode(createMutation.error) : null;
   const serverMessage: string = createMutation.isError ? getErrorMessage(createMutation.error) : '';
   const serverFieldErrors: CreateStaffFieldErrors = {
      email: errorCode === 'EMAIL_ALREADY_EXISTS' ? serverMessage : undefined,
      phone: errorCode === 'PHONE_ALREADY_EXISTS' ? serverMessage : undefined,
      employeeCode: errorCode === 'EMPLOYEE_CODE_ALREADY_EXISTS' ? serverMessage : undefined,
   };
   const isGeneralServerError: boolean = createMutation.isError && !hasFieldErrors(serverFieldErrors);

   function handleBranchChange(nextCinemaIds: number[], nextPrimaryCinemaId: number | null): void {
      setSelectedCinemaIds(nextCinemaIds);
      setPrimaryCinemaId(nextPrimaryCinemaId);
   }

   function handleSubmit(formEvent: FormEvent<HTMLFormElement>): void {
      formEvent.preventDefault();
      createMutation.reset();
      const nextFieldErrors: CreateStaffFieldErrors = {
         email: validateEmail(email),
         password: validateNewPassword(password),
         fullName: validateFullName(fullName),
         phone: validatePhone(phone),
         employeeCode: validateEmployeeCode(employeeCode),
         role: validateRequiredSelection(role, 'Vui lòng chọn role'),
         position: validateRequiredSelection(position, 'Vui lòng chọn chức danh'),
         branches: validateBranchSelection(selectedCinemaIds),
      };
      setFieldErrors(nextFieldErrors);
      if (hasFieldErrors(nextFieldErrors)) {
         return;
      }
      createMutation.mutate({
         email: email.trim(),
         password,
         fullName: fullName.trim(),
         phone: emptyToNull(phone),
         role: role as StaffRole,
         employeeCode: employeeCode.trim(),
         position: position as StaffPosition,
         hiredAt: emptyToNull(hiredAt),
         cinemaIds: selectedCinemaIds,
         primaryCinemaId,
      });
   }

   return (
      <Modal title="Thêm nhân viên" size="lg" isFlush isDismissDisabled={createMutation.isPending} onClose={onClose}>
         <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col" noValidate>
            <div className="relative min-h-0 flex-1 space-y-5 overflow-y-auto p-5 focus-visible:outline-none">
               <p className="text-sm text-ink-500">
                  Mật khẩu ban đầu do bạn đặt, nhân viên nhận email xác thực và nên đổi mật khẩu sau khi đăng nhập.
               </p>
               <TextField
                  id="staff-email"
                  label="Email"
                  type="email"
                  icon={Mail}
                  value={email}
                  onChange={setEmail}
                  error={fieldErrors.email ?? serverFieldErrors.email}
                  autoComplete="off"
               />
               <TextField
                  id="staff-password"
                  label="Mật khẩu ban đầu"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  error={fieldErrors.password}
                  autoComplete="new-password"
               />
               <TextField
                  id="staff-full-name"
                  label="Họ và tên"
                  icon={UserIcon}
                  value={fullName}
                  onChange={setFullName}
                  error={fieldErrors.fullName}
               />
               <TextField
                  id="staff-phone"
                  label="Số điện thoại"
                  type="tel"
                  icon={Phone}
                  value={phone}
                  onChange={setPhone}
                  optional
                  error={fieldErrors.phone ?? serverFieldErrors.phone}
               />
               <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <SelectField
                     id="staff-role"
                     label="Role"
                     value={role}
                     onChange={setRole}
                     options={isAdmin ? ADMIN_ROLE_OPTIONS : MANAGER_ROLE_OPTIONS}
                     error={fieldErrors.role}
                  />
                  <SelectField
                     id="staff-position"
                     label="Chức danh"
                     value={position}
                     onChange={setPosition}
                     options={STAFF_POSITION_OPTIONS}
                     error={fieldErrors.position}
                  />
               </div>
               <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <TextField
                     id="staff-employee-code"
                     label="Mã nhân viên"
                     value={employeeCode}
                     onChange={setEmployeeCode}
                     error={fieldErrors.employeeCode ?? serverFieldErrors.employeeCode}
                  />
                  <TextField
                     id="staff-hired-at"
                     label="Ngày vào làm"
                     type="date"
                     value={hiredAt}
                     onChange={setHiredAt}
                     optional
                  />
               </div>
               <div className="space-y-2">
                  <p className="text-sm font-semibold text-ink-800">Chi nhánh làm việc</p>
                  <BranchPicker
                     cinemaOptions={cinemaOptionsQuery.data ?? []}
                     selectedCinemaIds={selectedCinemaIds}
                     primaryCinemaId={primaryCinemaId}
                     onChange={handleBranchChange}
                     error={fieldErrors.branches}
                  />
               </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-ink-200 px-5 py-3 sm:flex-row sm:items-center">
               <div className="min-w-0 flex-1">
                  {isGeneralServerError && <Alert variant="error">{serverMessage}</Alert>}
               </div>
               <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  isLoading={createMutation.isPending}
                  icon={<UserPlus className="size-4" aria-hidden="true" />}
               >
                  Tạo tài khoản nhân viên
               </Button>
            </div>
         </form>
      </Modal>
   );
}

export default CreateStaffModal;
