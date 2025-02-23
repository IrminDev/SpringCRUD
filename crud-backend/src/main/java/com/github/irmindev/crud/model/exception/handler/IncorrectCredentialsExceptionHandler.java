package com.github.irmindev.crud.model.exception.handler;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.github.irmindev.crud.model.exception.IncorrectCredentialsException;
import com.github.irmindev.crud.model.response.UserLoginResponse;

@RestControllerAdvice
public class IncorrectCredentialsExceptionHandler {
    
    @ExceptionHandler(IncorrectCredentialsException.class)
    public ResponseEntity<UserLoginResponse.Failure> handle(IncorrectCredentialsException e) {
        return ResponseEntity.badRequest().body(new UserLoginResponse.Failure(e));
    }
}
