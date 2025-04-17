package com.github.irmindev.crud.model.response;

import java.util.List;

public abstract sealed class GetFavoriteGenresResponse permits
        GetFavoriteGenresResponse.Success,
        GetFavoriteGenresResponse.Failure 
{
    private String message;

    public GetFavoriteGenresResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public static final class Success extends GetFavoriteGenresResponse {
        private final List<String> genres;

        public Success(String message, List<String> genres) {
            super(message);
            this.genres = genres;
        }

        public List<String> getGenres() {
            return genres;
        }
    }

    public static final class Failure extends GetFavoriteGenresResponse {
        private final String error;

        public Failure(String message, String error) {
            super(message);
            this.error = error;
        }

        public String getError() {
            return error;
        }
    }    
}
