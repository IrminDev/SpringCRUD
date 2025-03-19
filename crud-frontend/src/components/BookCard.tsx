import React from 'react';
import { FiStar } from 'react-icons/fi';
import { Book } from '../model/Book';

type BookCardProps = {
  book: Book;
};

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover:shadow-xl">
        <img 
          src={book.coverImage} 
          alt={`${book.title} cover`}
          className="h-full w-full object-cover object-center transform transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex items-center mb-1">
            <FiStar className="text-yellow-400 mr-1" />
            <span className="text-white text-sm">{book.rating.toFixed(1)}</span>
          </div>
          <p className="text-white text-sm font-medium">{book.genre}</p>
        </div>
      </div>
      <h3 className="mt-3 text-sm font-medium text-gray-900 truncate">{book.title}</h3>
      <p className="text-sm text-gray-500">{book.author}</p>
    </div>
  );
};

export default BookCard;