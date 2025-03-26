import axios from "axios";
import { Book } from "../model/Book";

interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  subject?: string[];
}

interface OpenLibraryResponse {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: OpenLibraryDoc[];
}

export interface BookSearchResult {
  books: Book[];
  total: number;
  page: number;
  hasMore: boolean;
}

async function searchBooks(query: string, page: number = 1): Promise<BookSearchResult> {
  try {
    const limit = 12; // Books per page
    const offset = (page - 1) * limit;
    
    const response = await axios.get<OpenLibraryResponse>(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&fields=key,title,author_name,cover_i,first_publish_year,subject`
    );
    
    const { docs, numFound } = response.data;
    
    // Transform Open Library format to our Book model
    const books: Book[] = docs.map(doc => ({
      id: doc.key.replace('/works/', ''),
      title: doc.title,
      author: doc.author_name ? doc.author_name[0] : 'Unknown Author',
      coverImage: doc.cover_i 
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : '/placeholder-cover.jpg', // Make sure to add a placeholder image in your public folder
      rating: 0, // Open Library doesn't provide ratings
      genre: doc.subject && doc.subject.length > 0 ? doc.subject[0] : 'Unknown',
      publishYear: doc.first_publish_year || null
    }));
    
    return {
      books,
      total: numFound,
      page,
      hasMore: numFound > offset + limit
    };
  } catch (error) {
    console.error("Error searching books:", error);
    throw error;
  }
}

async function searchBooksByFilter(filters: { 
  title?: string;
  author?: string;
  subject?: string;
}, page: number = 1): Promise<BookSearchResult> {
  try {
    const limit = 12; // Books per page
    const offset = (page - 1) * limit;
    
    let queryParts = [];
    if (filters.title) queryParts.push(`title:${encodeURIComponent(filters.title)}`);
    if (filters.author) queryParts.push(`author:${encodeURIComponent(filters.author)}`);
    if (filters.subject) queryParts.push(`subject:${encodeURIComponent(filters.subject)}`);
    
    const queryString = queryParts.join('+');
    
    const response = await axios.get<OpenLibraryResponse>(
      `https://openlibrary.org/search.json?q=${queryString}&limit=${limit}&offset=${offset}&fields=key,title,author_name,cover_i,first_publish_year,subject`
    );
    
    const { docs, numFound } = response.data;
    
    // Transform Open Library format to our Book model
    const books: Book[] = docs.map(doc => ({
      id: doc.key.replace('/works/', ''),
      title: doc.title,
      author: doc.author_name ? doc.author_name[0] : 'Unknown Author',
      coverImage: doc.cover_i 
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : '/placeholder-cover.jpg',
      rating: 0,
      genre: doc.subject && doc.subject.length > 0 ? doc.subject[0] : 'Unknown',
      publishYear: doc.first_publish_year || null
    }));
    
    return {
      books,
      total: numFound,
      page,
      hasMore: numFound > offset + limit
    };
  } catch (error) {
    console.error("Error searching books with filters:", error);
    throw error;
  }
}

async function getBookDetails(bookId: string): Promise<Book> {
  try {
    const response = await axios.get(`https://openlibrary.org/works/${bookId}.json`);
    const data = response.data;
    
    // Get author information
    let author = 'Unknown Author';
    if (data.authors && data.authors[0]?.author) {
      const authorKey = data.authors[0].author.key;
      const authorResponse = await axios.get(`https://openlibrary.org${authorKey}.json`);
      author = authorResponse.data.name;
    }
    
    // Get cover image
    let coverImage = '/placeholder-cover.jpg';
    if (data.covers && data.covers.length > 0) {
      coverImage = `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`;
    }
    
    return {
      id: bookId,
      title: data.title,
      author,
      coverImage,
      rating: 0,
      genre: data.subjects && data.subjects.length > 0 ? data.subjects[0] : 'Unknown',
      publishYear: data.first_publish_year || null,
      description: data.description?.value || data.description || 'No description available'
    };
  } catch (error) {
    console.error("Error getting book details:", error);
    throw error;
  }
}

export default {
  searchBooks,
  searchBooksByFilter,
  getBookDetails
};