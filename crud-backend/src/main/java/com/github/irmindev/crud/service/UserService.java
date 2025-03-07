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
import com.github.irmindev.crud.model.exception.IncorrectCredentialsException;
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

    public UserDTO getUserByEmail(String email) throws EntityNotFoundException {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException());
        return UserMapper.toDTO(user);
    }

    public UserDTO getUserById(Long id) throws EntityNotFoundException {
        return UserMapper.toDTO(userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException()));
    }

    public UserDTO createUser(UserCreate userCreate) throws AlreadyUsedEmailException {
        User user = new User();
        String hashedPassword = bCryptPasswordEncoder.encode(userCreate.getPassword());
        user.setName(userCreate.getName());
        user.setEmail(userCreate.getEmail());
        user.setPassword(hashedPassword);
        user.setRole(Role.USER);
        if(userRepository.findByEmail(userCreate.getEmail()).orElse(null) != null) {
            throw new AlreadyUsedEmailException();
        }

        return UserMapper.toDTO(userRepository.save(user));
    }

    public UserDTO updateUser(Long id, UserChange userCreate) throws EntityNotFoundException, AlreadyUsedEmailException {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new EntityNotFoundException();
        }
        User userWithSameEmail = userRepository.findByEmail(userCreate.getEmail()).orElseThrow(() -> new EntityNotFoundException());
        if (userWithSameEmail != null && !userWithSameEmail.getId().equals(id)) {
            throw new AlreadyUsedEmailException();
        }
        user.setName(userCreate.getName());
        user.setEmail(userCreate.getEmail());
        return UserMapper.toDTO(userRepository.save(user));
    }

    public void deleteUser(Long id) throws EntityNotFoundException {
        userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException());
        userRepository.deleteById(id);
    }

    public UserDTO login(String email, String password) throws EntityNotFoundException,
        IncorrectCredentialsException    
    {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException());
        if (!bCryptPasswordEncoder.matches(password, user.getPassword())) {
            throw new IncorrectCredentialsException();
        }
        return UserMapper.toDTO(user);
    }

    public List<UserDTO> getAllUsers() {
        return UserMapper.toDTO(userRepository.findAll());
    }
}
