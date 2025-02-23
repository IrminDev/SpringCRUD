package com.github.irmindev.crud.model.exception;

public class AlreadyUsedEmailException extends RuntimeException {
    
    public AlreadyUsedEmailException() {
        super("Email already in use");
    }
    
}
