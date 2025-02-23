package com.github.irmindev.crud.model.response;

import com.github.irmindev.crud.model.dto.UserDTO;
import com.github.irmindev.crud.model.exception.AlreadyUsedEmailException;

public sealed abstract class UserCreateResponse permits
    UserCreateResponse.Success,
    UserCreateResponse.AlreadyUsedEmailResponse
{
    
    private final String message;

    public UserCreateResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public static final class Success extends UserCreateResponse {
        private final UserDTO user;
        private final String token;
        
        public Success(UserDTO user, String token) {
            super("User created successfully");
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

    public static final class AlreadyUsedEmailResponse extends UserCreateResponse {
        public AlreadyUsedEmailResponse(AlreadyUsedEmailException e) {
            super(e.getMessage());
        }

        public AlreadyUsedEmailResponse(String message) {
            super(message);
        }
    }
}
