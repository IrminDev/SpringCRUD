package com.github.irmindev.crud.model.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.github.irmindev.crud.model.exception.EntityNotFoundException;
import com.github.irmindev.crud.model.response.UserUpdateResponse;

@RestControllerAdvice
public class EnitityNotFoundExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<UserUpdateResponse.UserNotFoundResponse> handle(EntityNotFoundException e) {
        return ResponseEntity.status(HttpStatus.GONE).body(new UserUpdateResponse.UserNotFoundResponse(e));       
    }
}
