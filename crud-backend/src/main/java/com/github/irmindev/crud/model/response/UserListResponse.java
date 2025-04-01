package com.github.irmindev.crud.model.response;

import java.util.List;

import org.springframework.data.domain.Page;

import com.github.irmindev.crud.model.dto.UserDTO;
import com.github.irmindev.crud.model.exception.InvalidTokenException;
import com.github.irmindev.crud.model.exception.UnallowedMethodException;

public sealed class UserListResponse permits
    UserListResponse.Success,
    UserListResponse.UnallowedMethodResponse,
    UserListResponse.InvalidTokenResponse,
    UserListResponse.SuccessIndividual
{
    private String message;

    public UserListResponse(String message) {
        this.message = message;
    }
    
    public String getMessage() {
        return message;
    }


    public static final class Success extends UserListResponse {
        private final Page<UserDTO> users;

        public Success(Page<UserDTO> users) {
            super("Success");
            this.users = users;
        }

        public Page<UserDTO> getUsers() {
            return users;
        }
    }

    public static final class SuccessIndividual extends UserListResponse {
        private final UserDTO user;

        public SuccessIndividual(UserDTO user) {
            super("Success");
            this.user = user;
        }

        public UserDTO getUser() {
            return user;
        }
    }

    public static final class UnallowedMethodResponse extends UserListResponse {
        public UnallowedMethodResponse(UnallowedMethodException e) {
            super(e.getMessage());
        }

        public UnallowedMethodResponse(String message) {
            super(message);
        }
    }

    public static final class InvalidTokenResponse extends UserListResponse {
        public InvalidTokenResponse(InvalidTokenException e) {
            super(e.getMessage());
        }

        public InvalidTokenResponse(String message) {
            super(message);
        }
    }
}
