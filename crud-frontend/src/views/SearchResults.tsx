import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import coverPlaceholder from '../assets/cover.jpg';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiBook, FiStar, FiChevronDown, FiChevronUp, FiLoader } from 'react-icons/fi';
import bookService, { BookSearchResult } from '../services/book.service';
import { Book } from '../model/Book';

interface SearchResultsProps {
  darkMode: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ darkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [searchResults, setSearchResults] = useState<BookSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    subject: ''
  });

  // Fetch search results based on the query parameter
  useEffect(() => {
    if (!query) return;
    
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await bookService.searchBooks(query, 1);
        setSearchResults(results);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLoadMore = async () => {
    if (!searchResults || loading) return;
    
    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const moreResults = await bookService.searchBooks(query, nextPage);
      
      setSearchResults({
        ...moreResults,
        books: [...searchResults.books, ...moreResults.books]
      });
      setCurrentPage(nextPage);
    } catch (err) {
      console.error(err);
      setError('Failed to load more results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    try {
      const results = await bookService.searchBooksByFilter(filters, 1);
      setSearchResults(results);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError('Failed to apply filters. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const BookCard = ({ book }: { book: Book }) => {
    return (
      <div 
        className="group cursor-pointer" 
        onClick={() => navigate(`/book/${book.id}`)}
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover:shadow-xl">
          <img 
            src={book.coverImage} 
            alt={`${book.title} cover`}
            className="h-full w-full object-cover object-center transform transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = coverPlaceholder;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
            {book.genre && (
              <p className="text-white text-sm font-medium">{book.genre}</p>
            )}
            {book.publishYear && (
              <p className="text-white text-xs">{book.publishYear}</p>
            )}
          </div>
        </div>
        <h3 className={`mt-3 text-sm font-medium truncate ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {book.title}
        </h3>
        <p className={`text-sm ${
          darkMode ? 'text-slate-400' : 'text-gray-500'
        }`}>
          {book.author}
        </p>
      </div>
    );
  };

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-500 ${
      darkMode 
        ? 'bg-slate-900'
        : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {query ? `Search Results for "${query}"` : 'Book Search'}
          </h1>
          
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className={`block w-full pl-10 pr-20 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                darkMode 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' 
                  : 'border-gray-300 text-gray-900'
              }`}
              placeholder="Search by title, author, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition duration-200"
            >
              Search
            </button>
          </form>
          
          <div className="mt-4">
            <button
              className={`flex items-center text-sm font-medium ${
                darkMode ? 'text-indigo-400' : 'text-indigo-600'
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
              {showFilters ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
            </button>
            
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`mt-4 p-4 rounded-lg ${
                  darkMode ? 'bg-slate-800' : 'bg-white shadow-md'
                }`}
              >
                <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={filters.title}
                      onChange={handleFilterChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        darkMode 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={filters.author}
                      onChange={handleFilterChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        darkMode 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      Subject/Genre
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={filters.subject}
                      onChange={handleFilterChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        darkMode 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div className="md:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
        
        {error && (
          <div className={`p-4 mb-6 rounded-md ${
            darkMode ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-700'
          }`}>
            {error}
          </div>
        )}
        
        {loading && !searchResults && (
          <div className="flex justify-center items-center py-12">
            <FiLoader className={`animate-spin h-8 w-8 ${
              darkMode ? 'text-indigo-400' : 'text-indigo-600'
            }`} />
          </div>
        )}
        
        {searchResults && searchResults.books.length === 0 && (
          <div className={`text-center py-12 ${
            darkMode ? 'text-slate-400' : 'text-gray-600'
          }`}>
            <FiBook className="mx-auto h-12 w-12 mb-3 opacity-50" />
            <h3 className="text-xl font-medium mb-2">No books found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
        
        {searchResults && searchResults.books.length > 0 && (
          <>
            <div className={`text-sm mb-4 ${
              darkMode ? 'text-slate-400' : 'text-gray-600' 
            }`}>
              Found {searchResults.total.toLocaleString()} results
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {searchResults.books.map((book) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <BookCard book={book} />
                </motion.div>
              ))}
            </div>
            
            {searchResults.hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className={`px-5 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-70 ${
                    loading ? 'cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <FiLoader className="animate-spin mr-2" />
                      Loading...
                    </span>
                  ) : 'Load More Results'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;