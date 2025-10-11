import Link from 'next/link';
import MobileMenu from './MobileMenu';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-teal-600">
              🦷 Oasis Dental
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="#home" className="text-gray-700 hover:text-teal-600 transition-colors">
              Home
            </Link>
            <Link href="#services" className="text-gray-700 hover:text-teal-600 transition-colors">
              Services
            </Link>
            <Link href="#about" className="text-gray-700 hover:text-teal-600 transition-colors">
              About
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-teal-600 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="hidden md:block">
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors">
              Book Appointment
            </button>
          </div>

          {/* Mobile menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}