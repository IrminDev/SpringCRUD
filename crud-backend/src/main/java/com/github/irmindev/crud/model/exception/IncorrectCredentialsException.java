package com.github.irmindev.crud.model.exception;

public class IncorrectCredentialsException extends RuntimeException {
    public IncorrectCredentialsException() {
        super("Incorrect credentials");
    }
}
