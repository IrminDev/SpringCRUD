package com.github.irmindev.crud.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.irmindev.crud.model.dto.BookDTO;
import com.github.irmindev.crud.model.response.AddFavoriteBookResponse;
import com.github.irmindev.crud.model.response.GetFavoriteAuthorsResponse;
import com.github.irmindev.crud.model.response.GetFavoriteBooksResponse;
import com.github.irmindev.crud.model.response.GetFavoriteGenresResponse;
import com.github.irmindev.crud.service.BookService;
import com.github.irmindev.crud.service.JWTService;

@RestController
@RequestMapping("/api/books")
public class BookController {
    private final BookService bookService;
    private final JWTService jwtService;

    @Autowired
    public BookController(BookService bookService, JWTService jwtService) {
        this.bookService = bookService;
        this.jwtService = jwtService;
    }

    @PostMapping("/favorite")
    public ResponseEntity<AddFavoriteBookResponse> addFavoriteBook(
        @RequestBody BookDTO book,
        @RequestHeader("Authorization") String token
    ) {
        token = token.substring(7);
        Long userId = jwtService.extractClaim(token, claims -> claims.get("id", Long.class));

        if (userId != null) {
            BookDTO addedBook = bookService.addFavoriteBook(userId, book);
            return ResponseEntity.ok(new AddFavoriteBookResponse.Success("Book added to favorites", addedBook));
        } else {
            return ResponseEntity.status(401).body(new AddFavoriteBookResponse.Failure("Unauthorized", "Invalid token"));
        }
    }

    @GetMapping("/favorite/genres")
    public ResponseEntity<GetFavoriteGenresResponse> getFavoriteGenres(
        @RequestHeader("Authorization") String token
    ) {
        token = token.substring(7);
        Long userId = jwtService.extractClaim(token, claims -> claims.get("id", Long.class));

        if (userId != null) {
            return ResponseEntity.ok(new GetFavoriteGenresResponse.Success("Favorite genres retrieved", bookService.getFavoriteGenres(userId)));
        } else {
            return ResponseEntity.status(401).body(new GetFavoriteGenresResponse.Failure("Unauthorized", "Invalid token"));
        }
    }

    @GetMapping("/favorite/authors")
    public ResponseEntity<GetFavoriteAuthorsResponse> getFavoriteAuthors(
        @RequestHeader("Authorization") String token
    ) {
        token = token.substring(7);
        Long userId = jwtService.extractClaim(token, claims -> claims.get("id", Long.class));

        if (userId != null) {
            return ResponseEntity.ok(new GetFavoriteAuthorsResponse.Success("Favorite authors retrieved", bookService.getFavoriteAuthors(userId)));
        } else {
            return ResponseEntity.status(401).body(new GetFavoriteAuthorsResponse.Failure("Unauthorized", "Invalid token"));
        }
    }

    @DeleteMapping("/favorite")
    public ResponseEntity<AddFavoriteBookResponse> removeFavoriteBook(
        @RequestBody BookDTO book,
        @RequestHeader("Authorization") String token
    ) {
        token = token.substring(7);
        Long userId = jwtService.extractClaim(token, claims -> claims.get("id", Long.class));

        if (userId != null) {
            BookDTO removedBook = bookService.removeFavoriteBook(userId, book.getId());
            return ResponseEntity.ok(new AddFavoriteBookResponse.Success("Book removed from favorites", removedBook));
        } else {
            return ResponseEntity.status(401).body(new AddFavoriteBookResponse.Failure("Unauthorized", "Invalid token"));
        }
    }

    @GetMapping("/favorite")
    public ResponseEntity<GetFavoriteBooksResponse> getFavoriteBooks(
        @RequestHeader("Authorization") String token
    ) {
        token = token.substring(7);
        Long userId = jwtService.extractClaim(token, claims -> claims.get("id", Long.class));

        if (userId != null) {
            return ResponseEntity.ok(new GetFavoriteBooksResponse.Success("Favorite books retrieved", bookService.getFavoriteBooks(userId)));
        } else {
            return ResponseEntity.status(401).body(new GetFavoriteBooksResponse.Failure("Unauthorized", "Invalid token"));
        }
    }

    
}
