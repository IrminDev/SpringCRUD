package com.github.irmindev.crud.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.irmindev.crud.model.dto.UserDTO;
import com.github.irmindev.crud.model.enums.Role;
import com.github.irmindev.crud.model.request.UserChange;
import com.github.irmindev.crud.model.request.UserCreate;
import com.github.irmindev.crud.model.request.UserLogin;
import com.github.irmindev.crud.model.response.UserCreateResponse;
import com.github.irmindev.crud.model.response.UserListResponse;
import com.github.irmindev.crud.model.response.UserLoginResponse;
import com.github.irmindev.crud.model.response.UserUpdateResponse;
import com.github.irmindev.crud.service.JWTService;
import com.github.irmindev.crud.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final JWTService jwtService;

    @Autowired
    public UserController(UserService userService, JWTService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserListResponse> getUser(@PathVariable Long id,
        @RequestHeader("Authorization") String token) {
        if(token == null) {
            return ResponseEntity.badRequest().body(new UserListResponse.InvalidTokenResponse("Invalid token"));
        }

        token = token.substring(7);

        if(jwtService.extractClaim(token, claims -> claims.get("id", Long.class)) == id
            || Role.valueOf(jwtService.extractClaim(token, claims -> claims.get("role", String.class))) == Role.ADMIN) {
            return ResponseEntity.ok().body(new UserListResponse.SuccessIndividual(userService.getUserById(id)));
        }
            
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new UserListResponse.UnallowedMethodResponse("The id in the token does not match the requested id"));
    }

    @PostMapping("/register")
    public ResponseEntity<UserCreateResponse> createUser(@RequestBody UserCreate userCreate) {
        UserDTO user = userService.createUser(userCreate);
        if (user == null) {
            return ResponseEntity.badRequest().body(new UserCreateResponse.AlreadyUsedEmailResponse("Email already in use"));
        }
        HashMap<String, Object> payload = new HashMap<>();
        payload.put("name", user.getName());
        payload.put("email", user.getEmail());
        payload.put("role", user.getRole());
        payload.put("id", user.getId());
        String token = jwtService.generateToken(payload, user.getEmail());
        return ResponseEntity.ok(new UserCreateResponse.Success(user, token));
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> login(@RequestBody UserLogin userLogin) {
        UserDTO user = userService.login(userLogin.getEmail(), userLogin.getPassword());
        if (user == null) {
            return ResponseEntity.badRequest().body(new UserLoginResponse.Failure("Incorrect credentials"));
        }
        HashMap<String, Object> payload = new HashMap<>();
        payload.put("name", user.getName());
        payload.put("email", user.getEmail());
        payload.put("role", user.getRole());
        payload.put("id", user.getId());

        return ResponseEntity.ok(
            new UserLoginResponse.Success(user, jwtService.generateToken(payload, user.getEmail()))
        );
    }

    @GetMapping("/all")
    public ResponseEntity<UserListResponse> getAllUsers(@RequestHeader("Authorization") String token) {
        if(token == null) {
            return ResponseEntity.badRequest().body(new UserListResponse.InvalidTokenResponse("Invalid token"));
        }
        
        token = token.substring(7);

        if(Role.valueOf(jwtService.extractClaim(token, claims -> claims.get("role", String.class))) != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new UserListResponse.UnallowedMethodResponse("Unauthorized"));
        }

        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(new UserListResponse.Success(users));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UserListResponse> deleteUser(@PathVariable Long id,
        @RequestHeader("Authorization") String token) {
        if(token == null) {
            return ResponseEntity.badRequest().body(new UserListResponse.InvalidTokenResponse("Invalid token"));
        }
        
        token = token.substring(7);

        if(Role.valueOf(jwtService.extractClaim(token, claims -> claims.get("role", String.class))) != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new UserListResponse.UnallowedMethodResponse("Unauthorized"));
        }

        userService.deleteUser(id);
        return ResponseEntity.ok(new UserListResponse("Success"));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserUpdateResponse> updateUser(@PathVariable Long id,
    @RequestBody UserChange userChange,
    @RequestHeader("Authorization") String token) {
        if(token == null) {
            return ResponseEntity.badRequest().body(new UserUpdateResponse.InvalidTokenResponse("Invalid token"));
        }
        
        token = token.substring(7);

        if(Role.valueOf(jwtService.extractClaim(token, claims -> claims.get("role", String.class))) != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new UserUpdateResponse.UnallowedMethodResponse("Unauthorized"));
        }

        UserDTO user = userService.updateUser(id, userChange);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.GONE).body(new UserUpdateResponse.UserNotFoundResponse("User not found"));
        }
        return ResponseEntity.ok(new UserUpdateResponse.Success(user));
    }
}
