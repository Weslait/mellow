
// services/movieService.js
require('dotenv').config();
const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

class MovieService {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: TMDB_BASE_URL,
            params: { api_key: TMDB_API_KEY, language: 'fr-FR' }
        });
    }

    // Découvrir films avec filtres
    async discoverMovies(filters = {}) {
        try {
            const params = {
                sort_by: 'popularity.desc',
                page: 1,
                ...filters
            };
            
            const response = await this.axiosInstance.get('/discover/movie', { params });
            return {
                success: true,
                movies: response.data.results.map(movie => this.formatMovie(movie)),
                total_results: response.data.total_results
            };
        } catch (error) {
            console.error('Erreur discover movies:', error.message);
            return { success: false, message: 'Erreur API' };
        }
    }

    // Découvrir séries avec filtres
    async discoverTV(filters = {}) {
        try {
            const params = {
                sort_by: 'popularity.desc',
                page: 1,
                ...filters
            };
            
            const response = await this.axiosInstance.get('/discover/tv', { params });
            return {
                success: true,
                series: response.data.results.map(series => this.formatTV(series)),
                total_results: response.data.total_results
            };
        } catch (error) {
            console.error('Erreur discover TV:', error.message);
            return { success: false, message: 'Erreur API' };
        }
    }

    // Détails film
    async getMovieDetails(id) {
        try {
            const response = await this.axiosInstance.get(`/movie/${id}`, {
                params: { append_to_response: 'credits,videos,similar' }
            });
            return { success: true, movie: this.formatMovieDetails(response.data) };
        } catch (error) {
            console.error('Erreur détails film:', error.message);
            return { success: false, message: 'Film non trouvé' };
        }
    }

    // Détails série
    async getTVDetails(id) {
        try {
            const response = await this.axiosInstance.get(`/tv/${id}`, {
                params: { append_to_response: 'credits,videos,similar' }
            });
            return { success: true, series: this.formatTVDetails(response.data) };
        } catch (error) {
            console.error('Erreur détails série:', error.message);
            return { success: false, message: 'Série non trouvée' };
        }
    }

    // Liste des genres (pour ton frontend)
    async getGenres() {
        try {
            const [movieGenres, tvGenres] = await Promise.all([
                this.axiosInstance.get('/genre/movie/list'),
                this.axiosInstance.get('/genre/tv/list')
            ]);
            
            return {
                success: true,
                movie_genres: movieGenres.data.genres,
                tv_genres: tvGenres.data.genres
            };
        } catch (error) {
            console.error('Erreur genres:', error.message);
            return { success: false, message: 'Erreur API' };
        }
    }

    // Formatter les données
    formatMovie(movie) {
        return {
            id: movie.id,
            title: movie.title,
            original_title: movie.original_title,
            overview: movie.overview,
            poster_path: movie.poster_path ? TMDB_IMAGE_BASE + movie.poster_path : null,
            backdrop_path: movie.backdrop_path ? TMDB_IMAGE_BASE + movie.backdrop_path : null,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            vote_count: movie.vote_count,
            genre_ids: movie.genre_ids,
            media_type: 'movie'
        };
    }

    formatTV(series) {
        return {
            id: series.id,
            name: series.name,
            original_name: series.original_name,
            overview: series.overview,
            poster_path: series.poster_path ? TMDB_IMAGE_BASE + series.poster_path : null,
            backdrop_path: series.backdrop_path ? TMDB_IMAGE_BASE + series.backdrop_path : null,
            first_air_date: series.first_air_date,
            vote_average: series.vote_average,
            vote_count: series.vote_count,
            genre_ids: series.genre_ids,
            media_type: 'tv'
        };
    }

    formatMovieDetails(movie) {
        return {
            ...this.formatMovie(movie),
            runtime: movie.runtime,
            budget: movie.budget,
            revenue: movie.revenue,
            genres: movie.genres,
            production_companies: movie.production_companies,
            credits: movie.credits,
            videos: movie.videos,
            similar: movie.similar?.results?.map(m => this.formatMovie(m)) || []
        };
    }

    formatTVDetails(series) {
        return {
            ...this.formatTV(series),
            number_of_seasons: series.number_of_seasons,
            number_of_episodes: series.number_of_episodes,
            episode_run_time: series.episode_run_time,
            genres: series.genres,
            networks: series.networks,
            credits: series.credits,
            videos: series.videos,
            similar: series.similar?.results?.map(s => this.formatTV(s)) || []
        };
    }
}

module.exports = new MovieService();