export const ADMIN_MOVIE_LIST_KEY: readonly string[] = ['admin-movies', 'list'];
export const ADMIN_GENRES_KEY: readonly string[] = ['admin-movies', 'genres'];
export const ADMIN_PERSONS_KEY: readonly string[] = ['admin-movies', 'persons'];
export const MOVIE_MEDIA_TARGETS_KEY: readonly string[] = ['admin-movies', 'media-targets'];
export const PERSON_OPTIONS_KEY: readonly string[] = ['admin-movies', 'person-options'];

export function adminMovieDetailKey(movieId: number): readonly (string | number)[] {
   return ['admin-movies', 'detail', movieId];
}
