package com.github.irmindev.crud.model.response;

import com.github.irmindev.crud.model.dto.UserDTO;
import com.github.irmindev.crud.model.exception.AlreadyUsedEmailException;
import com.github.irmindev.crud.model.exception.EntityNotFoundException;
import com.github.irmindev.crud.model.exception.InvalidTokenException;
import com.github.irmindev.crud.model.exception.UnallowedMethodException;

public sealed abstract class UserUpdateResponse permits 
    UserUpdateResponse.Success, 
    UserUpdateResponse.AlreadyUsedEmailResponse,
    UserUpdateResponse.UserNotFoundResponse,
    UserUpdateResponse.InvalidTokenResponse,
    UserUpdateResponse.UnallowedMethodResponse,
    UserUpdateResponse.Error
{
    
    private final String message;

    public UserUpdateResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public static final class Success extends UserUpdateResponse {
        private final UserDTO user;
        
        public Success(UserDTO user) {
            super("User updated successfully");
            this.user = user;
        }

        public UserDTO getUser() {
            return user;
        }
    }

    public static final class AlreadyUsedEmailResponse extends UserUpdateResponse {
        public AlreadyUsedEmailResponse(AlreadyUsedEmailException e) {
            super(e.getMessage());
        }

        public AlreadyUsedEmailResponse() {
            super("Email already in use");
        }

        public AlreadyUsedEmailResponse(String message) {
            super(message);
        }
    }

    public static final class UserNotFoundResponse extends UserUpdateResponse {
        public UserNotFoundResponse(EntityNotFoundException e) {
            super(e.getMessage());
        }

        public UserNotFoundResponse() {
            super("User not found");
        }

        public UserNotFoundResponse(String message) {
            super(message);
        }
    }

    public static final class Error extends UserUpdateResponse {
        public Error() {
            super("An error occurred while updating the user");
        }
    }

    public static final class InvalidTokenResponse extends UserUpdateResponse {
        public InvalidTokenResponse() {
            super("Invalid token");
        }

        public InvalidTokenResponse(String message) {
            super(message);
        }

        public InvalidTokenResponse(InvalidTokenException e) {
            super(e.getMessage());
        }
    }

    public static final class UnallowedMethodResponse extends UserUpdateResponse {
        public UnallowedMethodResponse() {
            super("The id in the token does not match the requested id");
        }

        public UnallowedMethodResponse(String message) {
            super(message);
        }

        public UnallowedMethodResponse(UnallowedMethodException e) {
            super(e.getMessage());
        }
    }
}