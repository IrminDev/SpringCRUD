package com.github.irmindev.crud.model.response;

import com.github.irmindev.crud.model.dto.UserDTO;
import com.github.irmindev.crud.model.exception.IncorrectCredentialsException;

public sealed class UserLoginResponse permits
    UserLoginResponse.Success,
    UserLoginResponse.Failure
{
    private String message;

    public UserLoginResponse() {
    
    }

    public UserLoginResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public static final class Success extends UserLoginResponse {
        private final UserDTO user;
        private final String token;

        public Success(UserDTO user, String token) {
            super("User logged in successfully");
            this.user = user;
            this.token = token;
        }

        public UserDTO getUser() {
            return user;
        }

        public String getToken() {
            return token;
        }
    }

    public static final class Failure extends UserLoginResponse {
        public Failure(IncorrectCredentialsException e) {
            super(e.getMessage());
        }

        public Failure(String message) {
            super(message);
        }
    }
}
