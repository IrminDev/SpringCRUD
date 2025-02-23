package com.github.irmindev.crud.mapper;

import java.util.List;

import com.github.irmindev.crud.model.dto.UserDTO;
import com.github.irmindev.crud.model.entity.User;

public class UserMapper {
    public static UserDTO toDTO(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public static List<UserDTO> toDTO(List<User> users) {
        return users.stream().map(UserMapper::toDTO).toList();
    }
}
