import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiBook, FiTrendingUp, FiStar } from 'react-icons/fi';
import BookCard from '../BookCard';
import { Book } from '../../model/Book';

const Home: React.FC = () => {
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data - replace with API call in a real application
  useEffect(() => {
    // Simulating API fetch
    const mockBooks: Book[] = [
      {
        id: '1',
        title: 'The Midnight Library',
        author: 'Matt Haig',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/81GMhoYBwcL.jpg',
        rating: 4.5,
        genre: 'Fiction'
      },
      {
        id: '2',
        title: 'Atomic Habits',
        author: 'James Clear',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/81wgcld4wxL.jpg',
        rating: 4.8,
        genre: 'Self-Help'
      },
      {
        id: '3',
        title: 'Project Hail Mary',
        author: 'Andy Weir',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/91uwocAMtSL.jpg',
        rating: 4.7,
        genre: 'Sci-Fi'
      },
      {
        id: '4',
        title: 'Educated',
        author: 'Tara Westover',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/81XR45UdQyL.jpg',
        rating: 4.6,
        genre: 'Memoir'
      },
      {
        id: '5',
        title: 'Klara and the Sun',
        author: 'Kazuo Ishiguro',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/81c+3fHPGlL.jpg',
        rating: 4.3,
        genre: 'Fiction'
      },
      {
        id: '6',
        title: 'The Four Winds',
        author: 'Kristin Hannah',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/91SiLDgJwfL.jpg',
        rating: 4.4,
        genre: 'Historical Fiction'
      }
    ];
    
    setTrendingBooks(mockBooks);
  }, []);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                Discover Your Next Favorite Book
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Personalized recommendations based on your reading preferences.
              Explore thousands of titles and find your perfect read.
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                placeholder="Search by title, author, or genre..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition duration-200 ease-in-out">
                Search
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="hidden lg:block absolute top-1/4 right-10">
          <motion.div 
            className="h-32 w-32 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 opacity-30 blur-xl"
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
            className="h-24 w-24 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 opacity-30 blur-xl"
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
      
      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          
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
                className="flex flex-col items-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="bg-indigo-100 p-3 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Trending Books Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Now</h2>
          <p className="text-gray-600 mb-8">Popular books our readers are enjoying this week</p>
          
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
            <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors duration-300 shadow-md hover:shadow-lg">
              Browse More Books
            </button>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-indigo-200 mb-8">Get weekly reading recommendations and updates on new releases.</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
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