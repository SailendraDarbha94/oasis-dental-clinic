import Image from 'next/image';

export default function Footer() {
  return (
    <footer id='contact' className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Clinic Info */}
          <div>
            <div className="flex items-center text-xl font-bold text-teal-400 mb-4">
              <Image
                src="/oasis-logo.png"
                alt="Oasis Dental Clinic Logo"
                width={28}
                height={28}
                className="object-contain mr-2"
              />
              Oasis Dental
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Your comfort and oral health are our top priorities. We provide comprehensive dental care in a welcoming environment.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <span className="sr-only">Facebook</span>
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <span className="sr-only">Instagram</span>
                📷
              </a>
            </div>
          </div>

          {/* Services */}
          <div className='text-center'>
            <h3 className="text-lg font-semibold mb-4">Pages</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
              <li><a href="/admin/login" className="hover:text-teal-400 transition-colors">Admin Login</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className=''>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center">
                <p className="">
                  Oasis Dental/Aesthetic Clinic<br />
                  A Sector<br />
                  Papum Pare <br />
                  Arunachal Pradesh <br />
                  India - 791110
                </p>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📞</span>
                <span>(+91) 9108980207</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📧</span>
                <span>info@oasisdental.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          {/* <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="text-sm text-gray-300 mb-4">
              Subscribe to our newsletter for dental tips and appointment reminders.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <button className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div> */}
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Oasis Dental Clinic. All rights reserved. | <a href="/privacy">Privacy Policy</a> | <a href="/terms-of-service">Terms of Service</a></p>
        </div>
      </div>
    </footer>
  );
}