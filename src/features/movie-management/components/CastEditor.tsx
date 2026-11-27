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
         {castDrafts.map((castDraft) => (
            <div
               key={castDraft.key}
               className="grid grid-cols-1 gap-3 rounded-2xl border border-ink-100 p-4 @md:grid-cols-2 @2xl:grid-cols-[1.4fr_1fr_1fr_auto] @2xl:items-end"
            >
               <div className="@md:col-span-2 @2xl:col-span-1">
                  <SelectField
                     id={`cast-person-${castDraft.key}`}
                     label="Nghệ sĩ"
                     value={castDraft.personId}
                     onChange={(personId) => updateCastDraft(castDraft.key, { personId })}
                     options={personSelectOptions}
                     placeholder="Chọn nghệ sĩ..."
                  />
               </div>
               <SelectField
                  id={`cast-role-${castDraft.key}`}
                  label="Vai trò"
                  value={castDraft.roleType}
                  onChange={(roleType) => changeRoleType(castDraft.key, roleType)}
                  options={CAST_ROLE_OPTIONS}
               />
               <TextField
                  id={`cast-character-${castDraft.key}`}
                  label="Tên nhân vật"
                  value={castDraft.characterName}
                  onChange={(characterName) => updateCastDraft(castDraft.key, { characterName })}
                  maxLength={150}
                  disabled={castDraft.roleType !== 'ACTOR'}
                  placeholder={castDraft.roleType === 'ACTOR' ? undefined : 'Chỉ dành cho diễn viên'}
                  optional
               />
               <Button
                  variant="ghost"
                  className="justify-self-end px-3 @md:col-span-2 @2xl:col-span-1"
                  aria-label="Gỡ nghệ sĩ khỏi phim"
                  icon={<Trash2 className="size-4" aria-hidden="true" />}
                  onClick={() => removeCastDraft(castDraft.key)}
               />
            </div>
         ))}
         <Button variant="secondary" icon={<Plus className="size-4" aria-hidden="true" />} onClick={addCastDraft}>
            Thêm nghệ sĩ
         </Button>
      </div>
   );
}

export default CastEditor;
