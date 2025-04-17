import axios from "axios";
import FavoriteRequest from "../model/request/FavoriteRequest";
import FavoriteResponse from "../model/response/book/FavoriteResponse";
import ErrorResponse from "../model/response/ErrorResponse";
import ListFavorites from "../model/response/book/ListFavorites";
import FavoriteGenresResponse from "../model/response/book/FavoriteGenresResponse";
import FavoriteAuthorsResponse from "../model/response/book/FavoriteAuthorsResponse";

const API_URL = import.meta.env.VITE_API_URL;

async function addToFavorites(favoriteRequest: FavoriteRequest, token: string): Promise<FavoriteResponse> {
    try {
        const response = await axios.post(`${API_URL}books/favorite`, favoriteRequest, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
        } else {
        throw {
            message: "An error occurred while adding to favorites"
        } as ErrorResponse;
        }
    }
}

async function removeFromFavorites(favoriteRequest: FavoriteRequest, token: string): Promise<FavoriteResponse> {
    try {
        const response = await axios.delete(`${API_URL}books/favorite`, { data: favoriteRequest });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        } else {
            throw {
                message: "An error occurred while removing from favorites"
            } as ErrorResponse;
        }
    }
}

async function getFavorites(token: string): Promise<ListFavorites> {
    try {
        const response = await axios.get(`${API_URL}books/favorite`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        } else {
            throw {
                message: "An error occurred while fetching favorites"
            } as ErrorResponse;
        }
    }    
}



async function getFavoriteAuthors(token: string): Promise<FavoriteAuthorsResponse> {
    try {
        const response = await axios.get(`${API_URL}books/favorite/authors`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        } else {
            throw {
                message: "An error occurred while fetching favorite authors"
            } as ErrorResponse;
        }
    }
}

async function getFavoriteGenres(token: string): Promise<FavoriteGenresResponse> {
    try {
        const response = await axios.get(`${API_URL}books/favorite/genres`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        } else {
            throw {
                message: "An error occurred while fetching favorite genres"
            } as ErrorResponse;
        }
    }
}

export default {
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    getFavoriteAuthors,
    getFavoriteGenres
}