package com.github.irmindev.crud.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.github.irmindev.crud.mapper.UserMapper;
import com.github.irmindev.crud.model.dto.UserDTO;
import com.github.irmindev.crud.model.entity.User;
import com.github.irmindev.crud.model.enums.Role;
import com.github.irmindev.crud.model.exception.AlreadyUsedEmailException;
import com.github.irmindev.crud.model.exception.EntityNotFoundException;
import com.github.irmindev.crud.model.request.UserChange;
import com.github.irmindev.crud.model.request.UserCreate;
import com.github.irmindev.crud.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(10);

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDTO getUserByEmail(String email) {
        return UserMapper.toDTO(userRepository.findByEmail(email));
    }

    public UserDTO getUserById(Long id) {
        return UserMapper.toDTO(userRepository.findById(id).orElse(null));
    }

    public UserDTO createUser(UserCreate userCreate) throws AlreadyUsedEmailException {
        User user = new User();
        String hashedPassword = bCryptPasswordEncoder.encode(userCreate.getPassword());
        user.setName(userCreate.getName());
        user.setEmail(userCreate.getEmail());
        user.setPassword(hashedPassword);
        user.setRole(Role.USER);
        if(userRepository.findByEmail(userCreate.getEmail()) != null) {
            throw new AlreadyUsedEmailException();
        }

        return UserMapper.toDTO(userRepository.save(user));
    }

    public UserDTO updateUser(Long id, UserChange userCreate) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new EntityNotFoundException();
        }
        User userWithSameEmail = userRepository.findByEmail(userCreate.getEmail());
        if (userWithSameEmail != null && !userWithSameEmail.getId().equals(id)) {
            throw new AlreadyUsedEmailException();
        }
        user.setName(userCreate.getName());
        user.setEmail(userCreate.getEmail());
        return UserMapper.toDTO(userRepository.save(user));
    }

    public void deleteUser(Long id) throws EntityNotFoundException {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new EntityNotFoundException();
        }
        userRepository.deleteById(id);
    }

    public UserDTO login(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user == null || !bCryptPasswordEncoder.matches(password, user.getPassword())) {
            return null;
        }
        return UserMapper.toDTO(user);
    }

    public List<UserDTO> getAllUsers() {
        return UserMapper.toDTO(userRepository.findAll());
    }
}
