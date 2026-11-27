const MOVIE_LIST_PATH: string = '/admin/movies';

export interface MovieListReturnState {
   movieListSearch: string;
}

function isMovieListReturnState(locationState: unknown): locationState is MovieListReturnState {
   return (
      typeof locationState === 'object' &&
      locationState !== null &&
      'movieListSearch' in locationState &&
      typeof locationState.movieListSearch === 'string'
   );
}

export function getMovieListPath(locationState: unknown): string {
   return isMovieListReturnState(locationState)
      ? `${MOVIE_LIST_PATH}${locationState.movieListSearch}`
      : MOVIE_LIST_PATH;
}
