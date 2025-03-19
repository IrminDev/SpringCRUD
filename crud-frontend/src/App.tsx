import React from 'react';
import Header from './components/index/Header';
import Home from './components/index/Home';
import Footer from './components/index/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Home />
      </main>
      <Footer />
    </div>
  );
};

export default App;