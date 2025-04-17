package com.github.irmindev.crud.model.response;

import java.util.List;

import com.github.irmindev.crud.model.dto.BookDTO;

public abstract sealed class GetFavoriteBooksResponse permits
    GetFavoriteBooksResponse.Success,
    GetFavoriteBooksResponse.Failure
{
    private String message;

    public GetFavoriteBooksResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public static final class Success extends GetFavoriteBooksResponse {
        private final List<BookDTO> books;

        public Success(String message, List<BookDTO> books) {
            super(message);
            this.books = books;
        }

        public List<BookDTO> getBooks() {
            return books;
        }
    }

    public static final class Failure extends GetFavoriteBooksResponse {
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
