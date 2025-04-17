package com.github.irmindev.crud.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.github.irmindev.crud.model.entity.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
        /**
     * Finds the distinct genres of books favorited by a specific user, identified by their ID.
     *
     * @param userId The ID of the user whose favorite book genres are to be retrieved.
     * @return A list of distinct genre strings. Returns an empty list if the user has no favorites or no user found.
     */
    @Query("SELECT DISTINCT b.genre FROM User u JOIN u.favoriteBooks b WHERE u.id = :userId")
    List<String> findDistinctFavoriteGenresByUserId(@Param("userId") Long userId);

    // Return a List with their favorite authors
    /**
     * Finds the distinct authors of books favorited by a specific user, identified by their ID.
     *
     * @param userId The ID of the user whose favorite book authors are to be retrieved.
     * @return A list of distinct author strings. Returns an empty list if the user has no favorites or no user found.
     */
    @Query("SELECT DISTINCT b.author FROM User u JOIN u.favoriteBooks b WHERE u.id = :userId")
    List<String> findDistinctFavoriteAuthorsByUserId(@Param("userId") Long userId);
}
