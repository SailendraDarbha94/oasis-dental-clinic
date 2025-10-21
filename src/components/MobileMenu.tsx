'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden text-gray-700 hover:text-teal-600 p-2"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMenu}></div>
          <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center text-xl font-bold text-teal-600">
                <Image 
                  src="/oasis-logo.png" 
                  alt="Oasis Dental Clinic Logo" 
                  width={28} 
                  height={28}
                  className="object-contain mr-2"
                />
                Oasis Dental
              </div>
              <button
                onClick={closeMenu}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-4">
              <div className="space-y-4">
                <Link 
                  href="#home" 
                  className="block py-2 text-gray-700 hover:text-teal-600 transition-colors"
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <Link 
                  href="#services" 
                  className="block py-2 text-gray-700 hover:text-teal-600 transition-colors"
                  onClick={closeMenu}
                >
                  Services
                </Link>
                <Link 
                  href="#about" 
                  className="block py-2 text-gray-700 hover:text-teal-600 transition-colors"
                  onClick={closeMenu}
                >
                  About
                </Link>
                <Link 
                  href="#contact" 
                  className="block py-2 text-gray-700 hover:text-teal-600 transition-colors"
                  onClick={closeMenu}
                >
                  Contact
                </Link>
                <button 
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors mt-4"
                  onClick={closeMenu}
                >
                  Book Appointment
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}