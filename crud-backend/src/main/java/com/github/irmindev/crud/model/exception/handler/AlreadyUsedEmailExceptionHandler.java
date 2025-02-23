package com.github.irmindev.crud.model.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.github.irmindev.crud.model.exception.AlreadyUsedEmailException;
import com.github.irmindev.crud.model.response.UserUpdateResponse;

@RestControllerAdvice
public class AlreadyUsedEmailExceptionHandler {
    
    @ExceptionHandler(AlreadyUsedEmailException.class)
    public ResponseEntity<UserUpdateResponse.AlreadyUsedEmailResponse> handle(AlreadyUsedEmailException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new UserUpdateResponse.AlreadyUsedEmailResponse(e));
    }
}
