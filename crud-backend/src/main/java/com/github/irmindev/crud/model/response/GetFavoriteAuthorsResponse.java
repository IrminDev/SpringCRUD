package com.github.irmindev.crud.model.response;

import java.util.List;

public abstract sealed class GetFavoriteAuthorsResponse permits
        GetFavoriteAuthorsResponse.Success,
        GetFavoriteAuthorsResponse.Failure
{
    private String message;

    public GetFavoriteAuthorsResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public static final class Success extends GetFavoriteAuthorsResponse {
        private final List<String> authors;

        public Success(String message, List<String> authors) {
            super(message);
            this.authors = authors;
        }

        public List<String> getAuthors() {
            return authors;
        }
    }

    public static final class Failure extends GetFavoriteAuthorsResponse {
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
