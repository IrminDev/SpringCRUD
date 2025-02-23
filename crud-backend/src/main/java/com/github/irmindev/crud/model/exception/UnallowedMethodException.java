package com.github.irmindev.crud.model.exception;

public class UnallowedMethodException extends RuntimeException {
    
    public UnallowedMethodException() {
        super("Unallowed method");
    }
    
    public UnallowedMethodException(String message) {
        super(message);
    }
}
