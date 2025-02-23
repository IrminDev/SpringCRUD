package com.github.irmindev.crud.model.exception.handler;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.github.irmindev.crud.model.exception.InvalidTokenException;
import com.github.irmindev.crud.model.response.UserListResponse;

@RestControllerAdvice
public class InvalidTokenExceptionHandler {
    
    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<UserListResponse.InvalidTokenResponse> handleInvalidTokenException(InvalidTokenException e) {
        return ResponseEntity.badRequest().body(new UserListResponse.InvalidTokenResponse(e));
    }
}
