import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiBook, FiTrendingUp, FiStar } from 'react-icons/fi';
import { Book } from '../../model/Book';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  darkMode: boolean;
}

const Home: React.FC<HomeProps> = ({ darkMode }) => {
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Mock data for trending books - replace with API call in a real application
  useEffect(() => {
    // Simulating API fetch for trending books
    const mockBooks: Book[] = [
      {
        id: '1',
        title: 'The Midnight Library',
        author: 'Matt Haig',
        coverImage: 'https://covers.openlibrary.org/b/id/10388450-M.jpg',
        rating: 4.5,
        genre: 'Fiction'
      },
      {
        id: '2',
        title: 'Atomic Habits',
        author: 'James Clear',
        coverImage: 'https://covers.openlibrary.org/b/id/8479576-M.jpg',
        rating: 4.8,
        genre: 'Self-Help'
      },
      {
        id: '3',
        title: 'Project Hail Mary',
        author: 'Andy Weir',
        coverImage: 'https://covers.openlibrary.org/b/id/10802961-M.jpg',
        rating: 4.7,
        genre: 'Sci-Fi'
      },
      {
        id: '4',
        title: 'Educated',
        author: 'Tara Westover',
        coverImage: 'https://covers.openlibrary.org/b/id/8740833-M.jpg',
        rating: 4.6,
        genre: 'Memoir'
      },
      {
        id: '5',
        title: 'Klara and the Sun',
        author: 'Kazuo Ishiguro',
        coverImage: 'https://covers.openlibrary.org/b/id/10543595-M.jpg',
        rating: 4.3,
        genre: 'Fiction'
      },
      {
        id: '6',
        title: 'The Four Winds',
        author: 'Kristin Hannah',
        coverImage: 'https://covers.openlibrary.org/b/id/10387238-M.jpg',
        rating: 4.4,
        genre: 'Historical Fiction'
      }
    ];
    
    setTrendingBooks(mockBooks);
  }, []);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // BookCard component (internal to avoid needing to create a separate file)
  const BookCard = ({ book }: { book: Book }) => {
    return (
      <div className="group cursor-pointer" onClick={() => navigate(`/book/${book.id}`)}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover:shadow-xl">
          <img 
            src={book.coverImage}
            alt={`${book.title} cover`}
            className="h-full w-full object-cover object-center transform transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/placeholder-cover.jpg'; // Fallback image
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <div className="flex items-center mb-1">
              <FiStar className="text-yellow-400 mr-1" />
              <span className="text-white text-sm">{book.rating.toFixed(1)}</span>
            </div>
            <p className="text-white text-sm font-medium">{book.genre}</p>
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
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode 
        ? 'bg-gradient-to-b from-slate-900 to-slate-800' 
        : 'bg-gradient-to-b from-indigo-50 to-white'
    }`}>
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                Discover Your Next Favorite Book
              </span>
            </h1>
            <p className={`text-xl max-w-3xl mx-auto mb-10 ${
              darkMode ? 'text-slate-300' : 'text-gray-600'
            }`}>
              Personalized recommendations based on your reading preferences.
              Explore thousands of titles and find your perfect read.
            </p>
            
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className={`block w-full pl-10 pr-24 py-3 border rounded-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  darkMode 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' 
                    : 'border-gray-300 text-gray-900'
                }`}
                placeholder="Search by title, author, or genre..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button 
                type="submit"
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-white px-4 py-2 rounded-full transition duration-200 ease-in-out ${
                  darkMode 
                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Search
              </button>
            </form>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="hidden lg:block absolute top-1/4 right-10">
          <motion.div 
            className={`h-32 w-32 rounded-full opacity-30 blur-xl ${
              darkMode 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-700' 
                : 'bg-gradient-to-r from-pink-400 to-purple-500'
            }`}
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0.3, 0.2, 0.3] 
            }}
            transition={{ 
              repeat: Infinity,
              duration: 5,
            }}
          />
        </div>
        <div className="hidden lg:block absolute bottom-1/4 left-10">
          <motion.div 
            className={`h-24 w-24 rounded-full opacity-30 blur-xl ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                : 'bg-gradient-to-r from-indigo-400 to-cyan-400'
            }`}
            animate={{ 
              scale: [1, 1.1, 1], 
              opacity: [0.3, 0.2, 0.3] 
            }}
            transition={{ 
              repeat: Infinity,
              duration: 4, 
              delay: 1 
            }}
          />
        </div>
      </section>
      
      {/* Rest of the component remains the same */}
      {/* Features Section */}
      <section className={`py-12 transition-colors duration-500 ${
        darkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-center mb-12 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiBook className="h-8 w-8 text-indigo-500" />,
                title: "Track Your Reading",
                description: "Keep a log of books you've read and want to read. Build your personal library."
              },
              {
                icon: <FiTrendingUp className="h-8 w-8 text-indigo-500" />,
                title: "Get Recommendations",
                description: "Our AI analyzes your preferences to suggest books you'll love."
              },
              {
                icon: <FiStar className="h-8 w-8 text-indigo-500" />,
                title: "Rate & Review",
                description: "Share your thoughts and see what others think about your favorite titles."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`flex flex-col items-center p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 ${
                  darkMode 
                    ? 'bg-slate-700' 
                    : 'bg-gray-50'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className={`p-3 rounded-full mb-4 ${
                  darkMode ? 'bg-slate-600' : 'bg-indigo-100'
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-medium mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>{feature.title}</h3>
                <p className={`text-center ${
                  darkMode ? 'text-slate-300' : 'text-gray-600'
                }`}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Trending Books Section */}
      <section className={`py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
        darkMode 
          ? 'bg-gradient-to-b from-slate-800 to-slate-900' 
          : 'bg-gradient-to-b from-white to-indigo-50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>Trending Now</h2>
          <p className={`mb-8 ${
            darkMode ? 'text-slate-400' : 'text-gray-600'
          }`}>Popular books our readers are enjoying this week</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {trendingBooks.map((book, index) => (
              <motion.div 
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button 
              onClick={() => navigate('/search?trending=true')}
              className={`px-6 py-3 text-white font-medium rounded-full transition-colors duration-300 shadow-md hover:shadow-lg ${
                darkMode 
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
              }`}
            >
              Browse More Books
            </button>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className={`py-16 px-4 sm:px-6 lg:px-8 ${
        darkMode ? 'bg-indigo-900' : 'bg-indigo-800'
      }`}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-indigo-200 mb-8">Get weekly reading recommendations and updates on new releases.</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className={`flex-grow px-4 py-3 rounded-full focus:outline-none focus:ring-2 ${
                darkMode 
                  ? 'bg-indigo-800 text-white border border-indigo-700 placeholder-indigo-300 focus:ring-indigo-400' 
                  : 'focus:ring-indigo-300'
              }`}
            />
            <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-full hover:opacity-90 transition-opacity duration-300 shadow-md">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;