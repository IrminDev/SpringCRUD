package com.github.irmindev.crud.mapper;

import java.util.List;

import com.github.irmindev.crud.model.dto.BookDTO;
import com.github.irmindev.crud.model.entity.Book;

public class BookMapper {
    public static BookDTO toDto(Book book){
        if (book == null) {
            return null;
        }
        return new BookDTO(book.getId(), book.getTitle(), book.getAuthor(), book.getGenre());
    }
    
    public static List<BookDTO> toDtoList(List<Book> books){
        if (books == null) {
            return null;
        }
        return books.stream().map(BookMapper::toDto).toList();
    }
}
