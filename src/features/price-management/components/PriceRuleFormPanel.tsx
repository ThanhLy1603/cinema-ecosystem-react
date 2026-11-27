import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useState, type FormEvent, type ReactElement } from 'react';
import { createPriceRule, updatePriceRule } from '@/api/showtime/pricingApi';
import Modal from '@/components/common/Modal';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import SelectField from '@/components/ui/SelectField';
import TextField from '@/components/ui/TextField';
import { getErrorMessage, getFieldErrors } from '@/lib/common/apiError';
import {
   PRICE_DAY_TYPE_OPTIONS,
   PRICE_RULE_TYPE_DESCRIPTIONS,
   PRICE_RULE_TYPE_OPTIONS,
   SCREEN_TYPE_OPTIONS,
} from '@/lib/showtime/priceLabels';
import type { PriceRule, PriceRuleRequest, PriceRuleType } from '@/types/showtime/pricing';
import {
   buildEmptyFormValues,
   buildFormValuesFromRule,
   buildPriceRuleRequest,
   hasFormErrors,
   validatePriceRuleForm,
   type PriceRuleFormErrors,
   type PriceRuleFormValues,
} from '../utils/validation';

export type PriceRulePanelState = { mode: 'create'; ruleType: PriceRuleType } | { mode: 'edit'; priceRule: PriceRule };

interface PriceRuleFormPanelProps {
   panelState: PriceRulePanelState;
   onSaved: (message: string) => void;
   onClose: () => void;
}

function buildInitialValues(panelState: PriceRulePanelState): PriceRuleFormValues {
   return panelState.mode === 'create'
      ? buildEmptyFormValues(panelState.ruleType)
      : buildFormValuesFromRule(panelState.priceRule);
}

export function PriceRuleFormPanel({ panelState, onSaved, onClose }: PriceRuleFormPanelProps): ReactElement {
   const [priceRuleFormValues, setPriceRuleFormValues] = useState<PriceRuleFormValues>(() =>
      buildInitialValues(panelState),
   );
   const [priceRuleFormErrors, setPriceRuleFormErrors] = useState<PriceRuleFormErrors>({});
   const editingPriceRule: PriceRule | null = panelState.mode === 'edit' ? panelState.priceRule : null;
   const isHoliday: boolean = priceRuleFormValues.ruleType === 'DAY_TYPE' && priceRuleFormValues.dayType === 'HOLIDAY';

   const saveMutation: UseMutationResult<PriceRule, unknown, PriceRuleRequest> = useMutation<
      PriceRule,
      unknown,
      PriceRuleRequest
   >({
      mutationFn: (priceRuleRequest) =>
         editingPriceRule ? updatePriceRule(editingPriceRule.id, priceRuleRequest) : createPriceRule(priceRuleRequest),
      onSuccess: () => onSaved(editingPriceRule ? 'Đã cập nhật quy tắc giá' : 'Đã thêm quy tắc giá'),
      onError: (error) => setPriceRuleFormErrors(getFieldErrors(error) as PriceRuleFormErrors),
   });

   function updateField(fieldName: keyof PriceRuleFormValues, fieldValue: string): void {
      setPriceRuleFormValues({ ...priceRuleFormValues, [fieldName]: fieldValue });
      setPriceRuleFormErrors({ ...priceRuleFormErrors, [fieldName]: undefined });
   }

   function handleSubmit(formEvent: FormEvent<HTMLFormElement>): void {
      formEvent.preventDefault();
      const nextPriceRuleFormErrors: PriceRuleFormErrors = validatePriceRuleForm(priceRuleFormValues);
      setPriceRuleFormErrors(nextPriceRuleFormErrors);
      const priceRuleRequest: PriceRuleRequest | null = buildPriceRuleRequest(priceRuleFormValues);
      if (hasFormErrors(nextPriceRuleFormErrors) || priceRuleRequest === null) {
         return;
      }
      saveMutation.mutate(priceRuleRequest);
   }

   return (
      <Modal title={editingPriceRule ? 'Sửa quy tắc giá' : 'Thêm quy tắc giá'} onClose={onClose} isFlush>
         <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
               {saveMutation.isError && Object.keys(priceRuleFormErrors).length === 0 && (
                  <Alert variant="error">{getErrorMessage(saveMutation.error)}</Alert>
               )}

               <SelectField
                  id="price-rule-type"
                  label="Loại phụ thu"
                  value={priceRuleFormValues.ruleType}
                  onChange={(ruleType) => updateField('ruleType', ruleType)}
                  options={PRICE_RULE_TYPE_OPTIONS}
                  error={priceRuleFormErrors.ruleType}
                  placeholder="Chọn loại phụ thu"
               />
               {priceRuleFormValues.ruleType !== '' && (
                  <p className="-mt-2 text-sm text-ink-500">
                     {PRICE_RULE_TYPE_DESCRIPTIONS[priceRuleFormValues.ruleType as PriceRuleType]}
                  </p>
               )}
               <TextField
                  id="price-rule-name"
                  label="Tên quy tắc"
                  value={priceRuleFormValues.ruleName}
                  onChange={(ruleName) => updateField('ruleName', ruleName)}
                  error={priceRuleFormErrors.ruleName}
                  placeholder="Vd. Phụ thu suất đêm"
                  maxLength={150}
               />
               <TextField
                  id="price-rule-amount"
                  label="Mức phụ thu mỗi vé (VNĐ)"
                  value={priceRuleFormValues.surchargeAmount}
                  onChange={(surchargeAmount) => updateField('surchargeAmount', surchargeAmount)}
                  error={priceRuleFormErrors.surchargeAmount}
                  placeholder="10000"
               />

               {priceRuleFormValues.ruleType === 'TIME_SLOT' && (
                  <div className="space-y-2">
                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                           id="price-rule-time-from"
                           label="Từ giờ"
                           type="time"
                           value={priceRuleFormValues.timeFrom}
                           onChange={(timeFrom) => updateField('timeFrom', timeFrom)}
                           error={priceRuleFormErrors.timeFrom}
                        />
                        <TextField
                           id="price-rule-time-to"
                           label="Đến giờ"
                           type="time"
                           value={priceRuleFormValues.timeTo}
                           onChange={(timeTo) => updateField('timeTo', timeTo)}
                           error={priceRuleFormErrors.timeTo}
                        />
                     </div>
                     <p className="text-sm text-ink-500">
                        Tính theo giờ bắt đầu suất chiếu. Giờ kết thúc nhỏ hơn giờ bắt đầu nghĩa là khung giờ qua nửa
                        đêm (vd. 22:00 → 04:00).
                     </p>
                  </div>
               )}
               {priceRuleFormValues.ruleType === 'DAY_TYPE' && (
                  <SelectField
                     id="price-rule-day-type"
                     label="Loại ngày"
                     value={priceRuleFormValues.dayType}
                     onChange={(dayType) => updateField('dayType', dayType)}
                     options={PRICE_DAY_TYPE_OPTIONS}
                     error={priceRuleFormErrors.dayType}
                     placeholder="Chọn loại ngày"
                  />
               )}
               {priceRuleFormValues.ruleType === 'SCREEN_TYPE' && (
                  <SelectField
                     id="price-rule-screen-type"
                     label="Loại phòng chiếu"
                     value={priceRuleFormValues.screenType}
                     onChange={(screenType) => updateField('screenType', screenType)}
                     options={SCREEN_TYPE_OPTIONS}
                     error={priceRuleFormErrors.screenType}
                     placeholder="Chọn loại phòng"
                  />
               )}

               {priceRuleFormValues.ruleType !== '' && (
                  <div className="space-y-2">
                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                           id="price-rule-valid-from"
                           label={isHoliday ? 'Áp dụng từ ngày' : 'Hiệu lực từ ngày'}
                           type="date"
                           value={priceRuleFormValues.validFrom}
                           onChange={(validFrom) => updateField('validFrom', validFrom)}
                           error={priceRuleFormErrors.validFrom}
                           optional={!isHoliday}
                        />
                        <TextField
                           id="price-rule-valid-to"
                           label={isHoliday ? 'Đến ngày' : 'Hiệu lực đến ngày'}
                           type="date"
                           value={priceRuleFormValues.validTo}
                           onChange={(validTo) => updateField('validTo', validTo)}
                           error={priceRuleFormErrors.validTo}
                           optional={!isHoliday}
                        />
                     </div>
                     <p className="text-sm text-ink-500">
                        {isHoliday
                           ? 'Ngày lễ thay thế phụ thu cuối tuần trong các ngày áp dụng, không cộng dồn.'
                           : 'Để trống nếu quy tắc áp dụng quanh năm.'}
                     </p>
                  </div>
               )}
            </div>

            <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-ink-100 px-5 py-4">
               <Button variant="secondary" onClick={onClose}>
                  Hủy
               </Button>
               <Button
                  type="submit"
                  isLoading={saveMutation.isPending}
                  icon={<Save className="size-4" aria-hidden="true" />}
               >
                  {editingPriceRule ? 'Lưu thay đổi' : 'Thêm quy tắc'}
               </Button>
            </footer>
         </form>
      </Modal>
   );
}

export default PriceRuleFormPanel;
