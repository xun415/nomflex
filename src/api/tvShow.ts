import {API_KEY, BASE_PATH} from "./confiig";

export interface ITvShow {
    id: number;
    backdrop_path: string
    first_air_date: string;
    homepage: string;
    in_production :boolean;
    last_air_date: string;
    name: string;
    number_of_episodes: number;
    number_of_seasons: number;
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    status: string;
    type: string;
    vote_average: number;
    vote_count: number;
}

export interface IGetTvShowsResult {
    dates: {
        maximum: string;
        minimum: string;
    }
    results: ITvShow[];
    page: number;
    total_pages: number;
    total_results: number;
}

export enum ETvSearchType {
    POPULAR= 'popular',
    AIRING_TODAY= 'airing_today',
    TOP_RATED= 'top_rated',
    LATEST= 'latest'
}

export function getTvShows(searchType: ETvSearchType) {
    return fetch(`${BASE_PATH}/tv/${searchType}?api_key=${API_KEY}&language=en-US&page=1&region=kr`)
        .then(response => response.json())
}

export function getTvShow(tvId: string) {
    console.log('getTvShow tvId:', tvId)
    return fetch(`${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}&language=en-US&page=1&region=kr`)
        .then(response => response.json())
}