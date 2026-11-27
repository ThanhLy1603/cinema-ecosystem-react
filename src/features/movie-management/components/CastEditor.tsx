import { Plus, Trash2 } from 'lucide-react';
import type { ReactElement } from 'react';
import Button from '@/components/ui/Button';
import SelectField, { type SelectOption } from '@/components/ui/SelectField';
import TextField from '@/components/ui/TextField';
import { CAST_ROLE_OPTIONS } from '@/lib/movie/movieLabels';
import type { PersonOption } from '@/types/movie/movie';

export interface CastDraft {
   key: number;
   personId: string;
   roleType: string;
   characterName: string;
}

interface CastEditorProps {
   castDrafts: CastDraft[];
   personOptions: PersonOption[];
   onChange: (castDrafts: CastDraft[]) => void;
}

const CELL_CLASSES: string = 'block @max-lg:border-0! @max-lg:p-0! @lg:table-cell @lg:px-2 @lg:align-top';
const NARROW_LABEL_CLASSES: string = 'mb-1 block text-xs font-semibold text-ink-700 @lg:hidden';

export function CastEditor({ castDrafts, personOptions, onChange }: CastEditorProps): ReactElement {
   const personSelectOptions: SelectOption[] = personOptions.map((personOption) => ({
      value: String(personOption.id),
      label: personOption.name,
   }));

   function updateCastDraft(castKey: number, changes: Partial<CastDraft>): void {
      onChange(castDrafts.map((castDraft) => (castDraft.key === castKey ? { ...castDraft, ...changes } : castDraft)));
   }

   function changeRoleType(castKey: number, roleType: string): void {
      const shouldClearCharacterName: boolean = roleType !== '' && roleType !== 'ACTOR';
      updateCastDraft(castKey, shouldClearCharacterName ? { roleType, characterName: '' } : { roleType });
   }

   function removeCastDraft(castKey: number): void {
      onChange(castDrafts.filter((castDraft) => castDraft.key !== castKey));
   }

   function addCastDraft(): void {
      const nextKey: number = castDrafts.reduce((maxKey, castDraft) => Math.max(maxKey, castDraft.key), 0) + 1;
      onChange([...castDrafts, { key: nextKey, personId: '', roleType: 'ACTOR', characterName: '' }]);
   }

   return (
      <div className="@container space-y-3">
         {castDrafts.length === 0 && <p className="text-sm text-ink-500">Chưa có đạo diễn hoặc diễn viên nào.</p>}
         {castDrafts.length > 0 && (
            <table
               aria-label="Đạo diễn và diễn viên"
               className="block w-full border-collapse text-sm @lg:table @lg:table-fixed"
            >
               <thead className="hidden @lg:table-header-group">
                  <tr>
                     <th scope="col" className="w-[38%] px-2 py-2.5 font-semibold">
                        Nghệ sĩ
                     </th>
                     <th scope="col" className="w-[28%] px-2 py-2.5 font-semibold">
                        Vai trò
                     </th>
                     <th scope="col" className="px-2 py-2.5 font-semibold">
                        Tên nhân vật
                     </th>
                     <th scope="col" className="w-14 px-2 py-2.5">
                        <span className="sr-only">Thao tác</span>
                     </th>
                  </tr>
               </thead>
               <tbody className="block space-y-3 @lg:table-row-group">
                  {castDrafts.map((castDraft) => (
                     <tr
                        key={castDraft.key}
                        className="grid grid-cols-1 gap-3 rounded-lg border border-ink-200 p-3 @lg:table-row @lg:p-0"
                     >
                        <td className={CELL_CLASSES}>
                           <div className="text-left">
                              <span aria-hidden="true" className={NARROW_LABEL_CLASSES}>
                                 Nghệ sĩ
                              </span>
                              <SelectField
                                 id={`cast-person-${castDraft.key}`}
                                 label="Nghệ sĩ"
                                 hideLabel
                                 value={castDraft.personId}
                                 onChange={(personId) => updateCastDraft(castDraft.key, { personId })}
                                 options={personSelectOptions}
                                 placeholder="Chọn nghệ sĩ..."
                              />
                           </div>
                        </td>
                        <td className={CELL_CLASSES}>
                           <div className="text-left">
                              <span aria-hidden="true" className={NARROW_LABEL_CLASSES}>
                                 Vai trò
                              </span>
                              <SelectField
                                 id={`cast-role-${castDraft.key}`}
                                 label="Vai trò"
                                 hideLabel
                                 value={castDraft.roleType}
                                 onChange={(roleType) => changeRoleType(castDraft.key, roleType)}
                                 options={CAST_ROLE_OPTIONS}
                              />
                           </div>
                        </td>
                        <td className={CELL_CLASSES}>
                           <div className="text-left">
                              <span aria-hidden="true" className={NARROW_LABEL_CLASSES}>
                                 Tên nhân vật
                              </span>
                              <TextField
                                 id={`cast-character-${castDraft.key}`}
                                 expandable
                                 label="Tên nhân vật"
                                 hideLabel
                                 value={castDraft.characterName}
                                 onChange={(characterName) => updateCastDraft(castDraft.key, { characterName })}
                                 maxLength={150}
                                 disabled={castDraft.roleType !== 'ACTOR'}
                                 placeholder={castDraft.roleType === 'ACTOR' ? 'Không bắt buộc' : 'Không áp dụng'}
                              />
                           </div>
                        </td>
                        <td className={`${CELL_CLASSES} justify-self-end`}>
                           <Button
                              variant="ghost"
                              className="px-3"
                              aria-label="Gỡ nghệ sĩ khỏi phim"
                              title="Gỡ nghệ sĩ khỏi phim"
                              icon={<Trash2 className="size-4" aria-hidden="true" />}
                              onClick={() => removeCastDraft(castDraft.key)}
                           />
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         )}
         <Button variant="secondary" icon={<Plus className="size-4" aria-hidden="true" />} onClick={addCastDraft}>
            Thêm nghệ sĩ
         </Button>
      </div>
   );
}

export default CastEditor;
