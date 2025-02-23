package com.github.irmindev.crud.model.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.github.irmindev.crud.model.response.UserUpdateResponse;

import io.jsonwebtoken.ExpiredJwtException;

@RestControllerAdvice
public class ExpiredJwtExceptionHandler {
    
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<UserUpdateResponse.InvalidTokenResponse> handle(ExpiredJwtException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new UserUpdateResponse.InvalidTokenResponse("Token expired"));
    }
}
