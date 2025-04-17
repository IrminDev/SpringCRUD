import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import coverPlaceholder from '../assets/cover.jpg';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiLoader, FiAlertTriangle, FiBookmark, FiHeart, FiBook, FiUser, FiCheck } from 'react-icons/fi';
import bookService from '../services/book.service';
import favoriteService from '../services/favorite.service';
import { Book } from '../model/Book';
import FavoriteRequest from '../model/request/FavoriteRequest';
import User from '../model/User';
import ErrorResponse from '../model/response/ErrorResponse';

interface BookDetailProps {
  darkMode: boolean;
}

const BookDetail: React.FC<BookDetailProps> = ({ darkMode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [similarBooksLoading, setSimilarBooksLoading] = useState(false);
  const [favoriteActionMessage, setFavoriteActionMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  // Check if user is logged in
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (userJson && storedToken) {
      setUser(JSON.parse(userJson));
      setToken(storedToken);
    }
  }, []);
  
  // Fetch book details
  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const bookData = await bookService.getBookDetails(id);
        setBook(bookData);
        
        // Check if this book is in user's favorites
        if (token) {
          checkIfFavorite(bookData);
        }
        
        // Fetch similar books by genre
        fetchSimilarBooks(bookData.genre);
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to load book details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookDetails();
  }, [id, token]);
  
  // Check if the book is already in user's favorites
  const checkIfFavorite = async (bookData: Book) => {
    if (!token || !user) return;
    
    try {
      const favoritesResponse = await favoriteService.getFavorites(token);
      const favorites = favoritesResponse.books || [];
      
      // Convert external ID to consistent format for comparison
      const bookIdFormatted = String(bookData.id).replace('/works/', '');
      const isFav = favorites.some(fav => 
        String(fav.id) === bookIdFormatted || 
        fav.title.toLowerCase() === bookData.title.toLowerCase()
      );
      
      setIsFavorite(isFav);
    } catch (err) {
      console.error('Error checking favorites:', err);
    }
  };
  
  // Fetch similar books by genre
  const fetchSimilarBooks = async (genre: string) => {
    if (!genre || genre === 'Unknown') return;
    
    setSimilarBooksLoading(true);
    try {
      const result = await bookService.searchBooksByFilter({ subject: genre }, 1);
      // Filter out the current book and limit to 5
      const filtered = result.books
        .filter(b => b.id !== id)
        .slice(0, 5);
      
      setSimilarBooks(filtered);
    } catch (err) {
      console.error('Error fetching similar books:', err);
    } finally {
      setSimilarBooksLoading(false);
    }
  };
  
  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!book || !token || !user) {
      navigate('/sign-in');
      return;
    }
    
    setFavoriteLoading(true);
    setFavoriteActionMessage(null);
    
    try {
      const favoriteRequest: FavoriteRequest = {
        id: parseInt(book.id.replace('/works/', '')) || Math.floor(Math.random() * 1000000), // Fallback random ID if needed
        title: book.title,
        author: book.author,
        genre: book.genre || 'Unknown'
      };
      
      if (isFavorite) {
        // Remove from favorites
        await favoriteService.removeFromFavorites(favoriteRequest, token);
        setIsFavorite(false);
        setFavoriteActionMessage({
          type: 'success',
          message: 'Book removed from favorites'
        });
      } else {
        // Add to favorites
        await favoriteService.addToFavorites(favoriteRequest, token);
        setIsFavorite(true);
        setFavoriteActionMessage({
          type: 'success',
          message: 'Book added to favorites'
        });
      }
    } catch (err) {
      const error = err as ErrorResponse;
      setFavoriteActionMessage({
        type: 'error',
        message: error.message || 'Failed to update favorites'
      });
      console.error('Error updating favorites:', err);
    } finally {
      setFavoriteLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setFavoriteActionMessage(null);
      }, 3000);
    }
  };
  
  if (loading) {
    return (
      <div className={`min-h-screen pt-20 flex justify-center items-center transition-colors duration-500 ${
        darkMode ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        <FiLoader className={`animate-spin h-8 w-8 ${
          darkMode ? 'text-indigo-400' : 'text-indigo-600'
        }`} />
      </div>
    );
  }
  
  if (error || !book) {
    return (
      <div className={`min-h-screen pt-20 px-4 transition-colors duration-500 ${
        darkMode ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-3xl mx-auto py-16 text-center">
          <FiAlertTriangle className={`mx-auto h-12 w-12 mb-4 ${
            darkMode ? 'text-red-400' : 'text-red-500'
          }`} />
          <h1 className={`text-2xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Error Loading Book
          </h1>
          <p className={`mb-8 ${
            darkMode ? 'text-slate-300' : 'text-gray-600'
          }`}>
            {error || 'Book not found. It may have been removed or is unavailable.'}
          </p>
          <Link to="/search" className={`inline-flex items-center px-4 py-2 rounded-md ${
            darkMode 
              ? 'bg-indigo-700 hover:bg-indigo-600 text-white' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}>
            <FiArrowLeft className="mr-2" />
            Back to Search
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen pt-20 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
      darkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto py-8">
        <Link to="/search" className={`inline-flex items-center mb-8 ${
          darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
        }`}>
          <FiArrowLeft className="mr-2" />
          Back to Search
        </Link>
        
        {/* Favorite Action Message */}
        {favoriteActionMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-4 p-3 rounded-md text-sm flex items-center ${
              favoriteActionMessage.type === 'success'
                ? (darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800')
                : (darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800')
            }`}
          >
            {favoriteActionMessage.type === 'success' ? <FiCheck className="mr-2" /> : <FiAlertTriangle className="mr-2" />}
            {favoriteActionMessage.message}
          </motion.div>
        )}
        
        <div className={`rounded-xl overflow-hidden shadow-lg ${
          darkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className="md:flex">
            {/* Book Cover */}
            <div className="md:flex-shrink-0 md:w-1/3 lg:w-1/4">
              <div className="aspect-[2/3] relative overflow-hidden">
                <img 
                  src={book.coverImage}
                  alt={`${book.title} cover`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = coverPlaceholder;
                  }}
                />
              </div>
            </div>
            
            {/* Book Details */}
            <div className="p-6 md:p-8 md:flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {book.genre && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {book.genre}
                    </span>
                  )}
                  {book.publishYear && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      darkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {book.publishYear}
                    </span>
                  )}
                </div>
                
                <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>{book.title}</h1>
                
                <h2 className={`text-lg mb-6 ${
                  darkMode ? 'text-slate-300' : 'text-gray-600'
                }`}>by <span className="font-medium">{book.author}</span></h2>
                
                <div className="flex space-x-4 mb-8">
                  {!user ? (
                    <Link 
                      to="/sign-in" 
                      className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                        darkMode 
                          ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      <FiUser className="mr-2" />
                      Sign in to add favorites
                    </Link>
                  ) : (
                    <button 
                      onClick={toggleFavorite}
                      disabled={favoriteLoading}
                      className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                        favoriteLoading 
                          ? (darkMode ? 'bg-slate-600 text-slate-300' : 'bg-gray-300 text-gray-600')
                          : isFavorite
                            ? (darkMode ? 'bg-pink-800 hover:bg-pink-900 text-white' : 'bg-pink-600 hover:bg-pink-700 text-white')
                            : (darkMode ? 'bg-indigo-700 hover:bg-indigo-800 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white')
                      }`}
                    >
                      {favoriteLoading ? (
                        <FiLoader className="animate-spin mr-2" />
                      ) : (
                        <FiHeart className={`mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                      )}
                      {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                  )}
                  
                  <button className={`p-2 rounded-md transition-colors ${
                    darkMode 
                      ? 'hover:bg-slate-700 text-indigo-400' 
                      : 'hover:bg-gray-100 text-indigo-600'
                  }`}>
                    <FiBookmark className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mb-8">
                  <h3 className={`text-lg font-medium mb-3 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>Description</h3>
                  <p className={`text-base ${
                    darkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    {book.description || 'No description available for this book.'}
                  </p>
                </div>
                
                <div className="border-t pt-6 mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className={`text-sm font-medium mb-1 ${
                      darkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>Title</h4>
                    <p className={`${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{book.title}</p>
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium mb-1 ${
                      darkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>Author</h4>
                    <p className={`${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{book.author}</p>
                  </div>
                  {book.publishYear && (
                    <div>
                      <h4 className={`text-sm font-medium mb-1 ${
                        darkMode ? 'text-slate-400' : 'text-gray-500'
                      }`}>Published</h4>
                      <p className={`${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>{book.publishYear}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Similar Books Section */}
        <div className="mt-12">
          <h2 className={`text-2xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>Books in the same genre: {book.genre}</h2>
          
          {similarBooksLoading ? (
            <div className="flex justify-center py-12">
              <FiLoader className={`animate-spin h-8 w-8 ${
                darkMode ? 'text-indigo-400' : 'text-indigo-600'
              }`} />
            </div>
          ) : similarBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {similarBooks.map((similarBook) => (
                <motion.div
                  key={similarBook.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 ${
                    darkMode ? 'bg-slate-800' : 'bg-white'
                  }`}
                >
                  <Link to={`/book/${similarBook.id.replace('/works/', '')}`}>
                    <div className="aspect-[2/3] relative overflow-hidden">
                      <img 
                        src={similarBook.coverImage}
                        alt={`${similarBook.title} cover`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = coverPlaceholder;
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className={`font-bold text-sm mb-1 line-clamp-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>{similarBook.title}</h3>
                      <p className={`text-xs ${
                        darkMode ? 'text-slate-400' : 'text-gray-600'
                      }`}>{similarBook.author}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={`p-8 text-center rounded-xl ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}>
              <FiBook className={`mx-auto h-12 w-12 mb-4 opacity-50 ${
                darkMode ? 'text-slate-500' : 'text-gray-400'
              }`} />
              <p className={`${
                darkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>
                No similar books found in the "{book.genre}" genre.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;