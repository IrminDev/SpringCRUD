import React from 'react';
import { FiBook, FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo Section */}
          <div className="col-span-1">
            <div className="flex items-center">
              <FiBook className="h-8 w-8 mr-2 text-indigo-400" />
              <span className="text-xl font-bold text-white">BookNexus</span>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Discover your next favorite read with personalized book recommendations.
            </p>
            <div className="flex space-x-4 mt-6">
              {[FiTwitter, FiInstagram, FiGithub].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Links Sections */}
          {[
            {
              title: "Explore",
              links: ["Top Books", "New Releases", "Genres", "Authors", "Book Clubs"]
            },
            {
              title: "Account",
              links: ["Sign Up", "Log In", "Your Profile", "Reading List", "Settings"]
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Blog", "Press", "Contact Us", "Privacy Policy"]
            }
          ].map((section, index) => (
            <div key={index} className="col-span-1">
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-indigo-300 text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© 2025 BookNexus. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300">Terms of Service</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;