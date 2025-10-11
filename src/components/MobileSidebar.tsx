'use client';

import { useState } from 'react';

export default function MobileSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="lg:hidden bg-gray-50 border-b">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
      >
        <span className="font-semibold text-gray-800">Quick Info & Contact</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Quick Contact */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Quick Contact</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="mr-2">📞</span>
                <a href="tel:5551234567" className="hover:text-teal-600">(555) 123-4567</a>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📧</span>
                <a href="mailto:info@oasisdental.com" className="hover:text-teal-600">info@oasisdental.com</a>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📍</span>
                <span>123 Health St, City</span>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Office Hours</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Mon - Fri:</span>
                <span>8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span>9:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </div>
            </div>
          </div>

          {/* Emergency Notice */}
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">Emergency Care</h3>
            <p className="text-sm text-red-600 mb-1">
              For dental emergencies outside office hours:
            </p>
            <a href="tel:555911CARE" className="font-semibold text-red-800 hover:text-red-900">
              (555) 911-CARE
            </a>
          </div>
        </div>
      )}
    </div>
  );
}