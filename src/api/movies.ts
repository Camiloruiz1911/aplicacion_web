export interface Movie{
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    release_data: string;
    vota_avarge: number;
}

export interface MovieResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}