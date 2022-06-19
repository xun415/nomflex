import {API_KEY, BASE_PATH} from "./confiig";


export interface ISearchResult<T> {
    page: number;
    results: T[];
    total_result: number;
    total_pages: number;
}

export interface ITvSearched {
    id : number;
    backdrop_path: string;
    overview: string;
    popularity: number;
    vote_count: number;
    vote_average: number;
    poster_path: string;

    first_air_date: string;
    original_language: string;
    name: string;
    original_name: string;
}

export interface IMovieSearched {
    id: number;
    backdrop_path: string;
    overview: string;
    popularity: number;
    vote_count: number;
    vote_average: number;
    poster_path: string;

    adult: boolean;
    release_date: string;
    original_title: string;
    original_language: string;
    title: string;
    video: boolean;
}

export function searchMovies(query: string) {
    return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${query}&language=en-US&page=1&region=kr`)
        .then(response => response.json())
}


export function searchTvs(query: string) {
    return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${query}&language=en-US&page=1&region=kr`)
        .then(response => response.json())
}