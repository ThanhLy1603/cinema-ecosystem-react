import { Save } from 'lucide-react';
import { useState, type FormEvent, type ReactElement } from 'react';
import SectionCard from '@/components/common/SectionCard';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import SelectField from '@/components/ui/SelectField';
import TextAreaField from '@/components/ui/TextAreaField';
import TextField from '@/components/ui/TextField';
import MediaUploadField from '@/components/common/MediaUploadField';
import { createMediaFieldState, getMediaUrlToValidate } from '@/lib/media/mediaField';
import { useDeferredUpload, type DeferredUpload } from '@/lib/media/useDeferredUpload';
import type { MediaFieldState } from '@/types/media/media';
import { emptyToNull } from '@/lib/common/formValidation';
import { AGE_RATING_OPTIONS, MOVIE_STATUS_OPTIONS } from '@/lib/movie/movieLabels';
import type {
   AgeRating,
   CastRoleType,
   Genre,
   MovieDetail,
   MovieRequest,
   MovieStatus,
   PersonOption,
} from '@/types/movie/movie';
import {
   hasMovieFieldErrors,
   validateMovieForm,
   type MovieFieldErrors,
   type MovieFormValues,
} from '../utils/validation';
import CastEditor, { type CastDraft } from './CastEditor';
import GenrePicker from './GenrePicker';

interface MovieFormProps {
   initialMovie?: MovieDetail;
   genres: Genre[];
   personOptions: PersonOption[];
   isSubmitting: boolean;
   submitLabel: string;
   errorMessage?: string;
   successMessage?: string;
   serverFieldErrors?: Record<string, string>;
   onSubmit: (movieRequest: MovieRequest) => void;
}

function toCastDrafts(movieDetail: MovieDetail | undefined): CastDraft[] {
   return (movieDetail?.casts ?? []).map((movieCast, index) => ({
      key: index + 1,
      personId: String(movieCast.personId),
      roleType: movieCast.roleType,
      characterName: movieCast.roleType === 'ACTOR' ? (movieCast.characterName ?? '') : '',
   }));
}

export function MovieForm({
   initialMovie,
   genres,
   personOptions,
   isSubmitting,
   submitLabel,
   errorMessage,
   successMessage,
   serverFieldErrors = {},
   onSubmit,
}: MovieFormProps): ReactElement {
   const [title, setTitle] = useState<string>(initialMovie?.title ?? '');
   const [slug, setSlug] = useState<string>(initialMovie?.slug ?? '');
   const [originalTitle, setOriginalTitle] = useState<string>(initialMovie?.originalTitle ?? '');
   const [durationText, setDurationText] = useState<string>(
      initialMovie === undefined ? '' : String(initialMovie.durationMinutes),
   );
   const [releaseDate, setReleaseDate] = useState<string>(initialMovie?.releaseDate ?? '');
   const [endDate, setEndDate] = useState<string>(initialMovie?.endDate ?? '');
   const [rated, setRated] = useState<string>(initialMovie?.rated ?? '');
   const [status, setStatus] = useState<string>(initialMovie?.status ?? 'COMING_SOON');
   const [posterMedia, setPosterMedia] = useState<MediaFieldState>(createMediaFieldState(initialMovie?.posterUrl));
   const [bannerMedia, setBannerMedia] = useState<MediaFieldState>(createMediaFieldState(initialMovie?.bannerUrl));
   const [trailerMedia, setTrailerMedia] = useState<MediaFieldState>(createMediaFieldState(initialMovie?.trailerUrl));
   const deferredUpload: DeferredUpload = useDeferredUpload();
   const [description, setDescription] = useState<string>(initialMovie?.description ?? '');
   const [genreIds, setGenreIds] = useState<number[]>(initialMovie?.genres.map((genre) => genre.id) ?? []);
   const [castDrafts, setCastDrafts] = useState<CastDraft[]>(toCastDrafts(initialMovie));
   const [fieldErrors, setFieldErrors] = useState<MovieFieldErrors>({});
   const isBusy: boolean = isSubmitting || deferredUpload.isUploading;
   const isEditing: boolean = initialMovie !== undefined;
   const hasInvalidFields: boolean = hasMovieFieldErrors(fieldErrors) || Object.keys(serverFieldErrors).length > 0;

   async function handleSubmit(formEvent: FormEvent<HTMLFormElement>): Promise<void> {
      formEvent.preventDefault();
      const movieFormValues: MovieFormValues = {
         title,
         slug,
         originalTitle,
         durationText,
         releaseDate,
         endDate,
         rated,
         status,
         posterUrl: getMediaUrlToValidate(posterMedia),
         bannerUrl: getMediaUrlToValidate(bannerMedia),
         trailerUrl: getMediaUrlToValidate(trailerMedia),
         description,
         genreIds,
         castDraftValues: castDrafts,
      };
      const nextFieldErrors: MovieFieldErrors = validateMovieForm(movieFormValues);
      setFieldErrors(nextFieldErrors);
      if (hasMovieFieldErrors(nextFieldErrors)) {
         return;
      }
      const resolvedUrls: string[] | null = await deferredUpload.uploadPendingFiles([
         {
            label: 'poster',
            mediaFieldState: posterMedia,
            mediaPurpose: 'MOVIE_POSTER',
            onUploaded: (uploadedUrl) => setPosterMedia(createMediaFieldState(uploadedUrl)),
         },
         {
            label: 'banner',
            mediaFieldState: bannerMedia,
            mediaPurpose: 'MOVIE_BANNER',
            onUploaded: (uploadedUrl) => setBannerMedia(createMediaFieldState(uploadedUrl)),
         },
         {
            label: 'trailer',
            mediaFieldState: trailerMedia,
            mediaPurpose: 'MOVIE_TRAILER',
            onUploaded: (uploadedUrl) => setTrailerMedia(createMediaFieldState(uploadedUrl)),
         },
      ]);
      if (resolvedUrls === null) {
         return;
      }
      const [resolvedPosterUrl, resolvedBannerUrl, resolvedTrailerUrl]: string[] = resolvedUrls;
      onSubmit({
         title: title.trim(),
         slug: emptyToNull(slug),
         originalTitle: emptyToNull(originalTitle),
         durationMinutes: Number(durationText.trim()),
         releaseDate,
         endDate: endDate.length === 0 ? null : endDate,
         rated: rated as AgeRating,
         posterUrl: emptyToNull(resolvedPosterUrl),
         bannerUrl: emptyToNull(resolvedBannerUrl),
         trailerUrl: emptyToNull(resolvedTrailerUrl),
         description: emptyToNull(description),
         status: status as MovieStatus,
         genreIds,
         casts: castDrafts.map((castDraft) => ({
            personId: Number(castDraft.personId),
            roleType: castDraft.roleType as CastRoleType,
            characterName: castDraft.roleType === 'ACTOR' ? emptyToNull(castDraft.characterName) : null,
         })),
      });
   }

   return (
      <form
         onSubmit={handleSubmit}
         className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start"
         noValidate
      >
         <div className="min-w-0 space-y-5">
            <SectionCard
               title="Thông tin cơ bản"
               description={isEditing ? undefined : 'Nhãn độ tuổi là bắt buộc và hiển thị cho khách khi chọn phim.'}
            >
               <div className="@container">
                  <div className="grid grid-cols-1 gap-5 @lg:grid-cols-2">
                     <div className="@lg:col-span-2">
                        <TextField
                           id="movie-title"
                           label="Tên phim"
                           value={title}
                           onChange={setTitle}
                           maxLength={255}
                           error={fieldErrors.title ?? serverFieldErrors.title}
                        />
                     </div>
                     <div className="@lg:col-span-2">
                        <TextField
                           id="movie-slug"
                           label="Đường dẫn (slug)"
                           value={slug}
                           onChange={setSlug}
                           maxLength={200}
                           optional
                           placeholder="dao-pho-va-piano"
                           hint={
                              initialMovie === undefined
                                 ? 'Để trống để tự tạo từ tên phim. Trang phim sẽ có dạng /movies/<đường dẫn>.'
                                 : 'Đổi đường dẫn sẽ làm các liên kết cũ tới trang phim không còn truy cập được.'
                           }
                           error={fieldErrors.slug ?? serverFieldErrors.slug}
                        />
                     </div>
                     <div className="@lg:col-span-2">
                        <TextField
                           id="movie-original-title"
                           label="Tên gốc"
                           value={originalTitle}
                           onChange={setOriginalTitle}
                           maxLength={255}
                           optional
                           error={fieldErrors.originalTitle ?? serverFieldErrors.originalTitle}
                        />
                     </div>
                     <TextField
                        id="movie-duration"
                        label="Thời lượng (phút)"
                        value={durationText}
                        onChange={setDurationText}
                        placeholder="120"
                        error={fieldErrors.durationMinutes ?? serverFieldErrors.durationMinutes}
                     />
                     <SelectField
                        id="movie-rated"
                        label="Nhãn độ tuổi"
                        value={rated}
                        onChange={setRated}
                        options={AGE_RATING_OPTIONS}
                        error={fieldErrors.rated ?? serverFieldErrors.rated}
                     />
                     <TextField
                        id="movie-release-date"
                        label="Ngày khởi chiếu"
                        type="date"
                        value={releaseDate}
                        onChange={setReleaseDate}
                        error={fieldErrors.releaseDate ?? serverFieldErrors.releaseDate}
                     />
                     <TextField
                        id="movie-end-date"
                        label="Ngày kết thúc chiếu"
                        type="date"
                        value={endDate}
                        onChange={setEndDate}
                        optional
                        error={fieldErrors.endDate ?? serverFieldErrors.endDate}
                     />
                     <div className="@lg:col-span-2">
                        <TextAreaField
                           id="movie-description"
                           label="Nội dung phim"
                           value={description}
                           onChange={setDescription}
                           maxLength={5000}
                           optional
                           error={fieldErrors.description ?? serverFieldErrors.description}
                        />
                     </div>
                  </div>
               </div>
            </SectionCard>

            <SectionCard title="Thể loại">
               <div className="space-y-3">
                  <GenrePicker genres={genres} selectedGenreIds={genreIds} onChange={setGenreIds} />
                  {(fieldErrors.genreIds ?? serverFieldErrors.genreIds) && (
                     <p role="alert" className="text-[13px] font-medium text-danger-700">
                        {fieldErrors.genreIds ?? serverFieldErrors.genreIds}
                     </p>
                  )}
               </div>
            </SectionCard>

            <SectionCard title="Đạo diễn & diễn viên">
               <div className="space-y-3">
                  <CastEditor castDrafts={castDrafts} personOptions={personOptions} onChange={setCastDrafts} />
                  {fieldErrors.casts && (
                     <p role="alert" className="text-[13px] font-medium text-danger-700">
                        {fieldErrors.casts}
                     </p>
                  )}
               </div>
            </SectionCard>
         </div>

         <div className="flex min-w-0 flex-col gap-5 xl:sticky xl:top-20 xl:-m-1 xl:max-h-[calc(100dvh-5.5rem)] xl:overflow-y-auto xl:p-1">
            <div className="order-2 shrink-0 xl:order-1">
               <SectionCard title={isEditing ? 'Trạng thái & lưu thay đổi' : 'Trạng thái & tạo phim'}>
                  <div className="space-y-4">
                     <SelectField
                        id="movie-status"
                        label="Trạng thái"
                        value={status}
                        onChange={setStatus}
                        options={MOVIE_STATUS_OPTIONS}
                        error={fieldErrors.status ?? serverFieldErrors.status}
                     />
                     <Button
                        type="submit"
                        fullWidth
                        isLoading={isBusy}
                        icon={<Save className="size-4" aria-hidden="true" />}
                     >
                        {submitLabel}
                     </Button>
                     {deferredUpload.uploadMessage && (
                        <p role="status" className="text-sm font-medium text-ink-600">
                           {deferredUpload.uploadMessage}
                        </p>
                     )}
                     {hasInvalidFields && (
                        <Alert variant="error">Vui lòng kiểm tra lại các trường được đánh dấu lỗi.</Alert>
                     )}
                     {errorMessage && <Alert variant="error">{errorMessage}</Alert>}
                     {deferredUpload.uploadError && <Alert variant="error">{deferredUpload.uploadError}</Alert>}
                     {successMessage && !hasInvalidFields && <Alert variant="success">{successMessage}</Alert>}
                  </div>
               </SectionCard>
            </div>

            <div className="order-1 shrink-0 xl:order-2">
               <SectionCard title="Hình ảnh & trailer">
                  <div className="space-y-5">
                     <MediaUploadField
                        id="movie-poster-url"
                        label="Đường dẫn poster"
                        value={posterMedia}
                        onChange={setPosterMedia}
                        disabled={isBusy}
                        mediaPurpose="MOVIE_POSTER"
                        accept="image/jpeg,image/png,image/webp"
                        placeholder="https://... hoặc tải ảnh lên"
                        optional
                        error={fieldErrors.posterUrl ?? serverFieldErrors.posterUrl}
                     />
                     <MediaUploadField
                        id="movie-banner-url"
                        label="Đường dẫn banner"
                        value={bannerMedia}
                        onChange={setBannerMedia}
                        disabled={isBusy}
                        mediaPurpose="MOVIE_BANNER"
                        accept="image/jpeg,image/png,image/webp"
                        placeholder="https://... hoặc tải ảnh lên"
                        optional
                        error={fieldErrors.bannerUrl ?? serverFieldErrors.bannerUrl}
                     />
                     <MediaUploadField
                        id="movie-trailer-url"
                        label="Đường dẫn trailer"
                        value={trailerMedia}
                        onChange={setTrailerMedia}
                        disabled={isBusy}
                        mediaPurpose="MOVIE_TRAILER"
                        accept="video/mp4,video/webm,video/quicktime"
                        placeholder="Link YouTube hoặc tải video lên"
                        optional
                        error={fieldErrors.trailerUrl ?? serverFieldErrors.trailerUrl}
                     />
                  </div>
               </SectionCard>
            </div>
         </div>
      </form>
   );
}

export default MovieForm;
