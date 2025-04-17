package com.github.irmindev.crud.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.irmindev.crud.mapper.BookMapper;
import com.github.irmindev.crud.model.dto.BookDTO;
import com.github.irmindev.crud.model.entity.Book;
import com.github.irmindev.crud.model.entity.User;
import com.github.irmindev.crud.model.exception.EntityNotFoundException;
import com.github.irmindev.crud.repository.BookRepository;
import com.github.irmindev.crud.repository.UserRepository;

@Service
public class BookService {
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Autowired
    public BookService(BookRepository bookRepository, UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    public List<String> getFavoriteGenres(Long id) {
        return bookRepository.findDistinctFavoriteGenresByUserId(id);
    }

    public List<String> getFavoriteAuthors(Long id) {
        return bookRepository.findDistinctFavoriteAuthorsByUserId(id);
    }

    public BookDTO addFavoriteBook(Long userId, BookDTO bookDTO) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if(bookRepository.findById(bookDTO.getId()).isPresent()) {
                user.addFavoriteBook(bookRepository.findById(bookDTO.getId()).get());
                return BookMapper.toDto(bookRepository.findById(bookDTO.getId()).get());
            } else {
                Book book = new Book();
                book.setId(bookDTO.getId());
                book.setTitle(bookDTO.getTitle());
                book.setAuthor(bookDTO.getAuthor());
                book.setGenre(bookDTO.getGenre());
                Book savedBook = bookRepository.save(book);
                user.addFavoriteBook(savedBook);
                userRepository.save(user);
                return BookMapper.toDto(savedBook);
            }
        } else {
            throw new EntityNotFoundException("User not found with id: " + userId);
        }
    }

    public List<BookDTO> getFavoriteBooks(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return BookMapper.toDtoList(user.getFavoriteBooks());
        } else {
            throw new EntityNotFoundException("User not found with id: " + userId);
        }
    }

    public BookDTO removeFavoriteBook(Long userId, Long bookId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));
            user.getFavoriteBooks().remove(book);
            userRepository.save(user);
            return BookMapper.toDto(book);
        } else {
            throw new EntityNotFoundException("User not found with id: " + userId);
        }
    }
}
