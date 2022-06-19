import {API_KEY, BASE_PATH} from "./confiig";


export interface IMovie {
    id: number;
    adult: boolean;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;

    genre_ids: number[]
    original_language: string;
    original_title: string;
    popularity: number;
    release_date: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    runtime: number;
}

export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    }
    results: IMovie[];
    page: number;
    total_pages: number;
    total_results: number;
}

export interface IGetLatestMovieResult {
    id: string;
    title: string;
    backdrop_path: string;
    imdb_id: string;
    vote_average: number;
    vote_count: number;
}

export enum movieSearchType {
    TOP_RATED='top_rated',
    NOW_PLAYING='now_playing',
    LATEST='latest',
    UPCOMING='upcoming'

}
export function getMovies(searchType: movieSearchType) {
    return fetch(`${BASE_PATH}/movie/${searchType}?api_key=${API_KEY}&language=en-US&page=1&region=kr`)
        .then(response => response.json())
}

export function getMovie(movieId: string) {
    return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=en-US`)
        .then(response => response.json())
}

export function getImage() {
    fetch(`${BASE_PATH}`)

}

