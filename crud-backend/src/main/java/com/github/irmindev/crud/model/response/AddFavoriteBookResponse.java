package com.github.irmindev.crud.model.response;

import com.github.irmindev.crud.model.dto.BookDTO;

public abstract sealed class AddFavoriteBookResponse permits
        AddFavoriteBookResponse.Success,
        AddFavoriteBookResponse.Failure {
    private String message;

    public AddFavoriteBookResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public static final class Success extends AddFavoriteBookResponse {
        private final BookDTO book;

        public Success(String message, BookDTO book) {
            super(message);
            this.book = book;
        }

        public BookDTO getBook() {
            return book;
        }
    }

    public static final class Failure extends AddFavoriteBookResponse {
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
