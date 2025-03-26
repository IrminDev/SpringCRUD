import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import coverPlaceholder from '../assets/cover.jpg';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiLoader, FiAlertTriangle, FiBookmark, FiStar, FiBook, FiHeart } from 'react-icons/fi';
import bookService from '../services/book.service';
import { Book } from '../model/Book';

interface BookDetailProps {
  darkMode: boolean;
}

const BookDetail: React.FC<BookDetailProps> = ({ darkMode }) => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const bookData = await bookService.getBookDetails(id);
        setBook(bookData);
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to load book details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookDetails();
  }, [id]);
  
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
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center transition-colors">
                    <FiBookmark className="mr-2" />
                    Add to Reading List
                  </button>
                  <button className={`p-2 rounded-md transition-colors ${
                    darkMode 
                      ? 'hover:bg-slate-700 text-indigo-400' 
                      : 'hover:bg-gray-100 text-indigo-600'
                  }`}>
                    <FiHeart className="h-5 w-5" />
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
        
        {/* Similar Books Section - Placeholder */}
        <div className="mt-12">
          <h2 className={`text-2xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>Similar Books</h2>
          <div className={`p-8 text-center rounded-xl ${
            darkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <FiBook className={`mx-auto h-12 w-12 mb-4 opacity-50 ${
              darkMode ? 'text-slate-500' : 'text-gray-400'
            }`} />
            <p className={`${
              darkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Similar book recommendations coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;