export default function Sidebar() {
  return (
    <aside className="bg-gray-50 p-6 min-h-screen">
      <div className="space-y-6">
        {/* Quick Contact */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-800 mb-3">Quick Contact</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="mr-2">📞</span>
              <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📧</span>
              <span>info@oasisdental.com</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📍</span>
              <span>123 Health St, City</span>
            </div>
          </div>
        </div>

        {/* Office Hours */}
        <div className="bg-white p-4 rounded-lg shadow-md">
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
          <p className="text-sm text-red-600">
            For dental emergencies outside office hours, call our emergency line:
          </p>
          <p className="font-semibold text-red-800 mt-1">(555) 911-CARE</p>
        </div>

        {/* Insurance */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-800 mb-3">Insurance Accepted</h3>
          <div className="text-sm text-gray-600">
            <ul className="space-y-1">
              <li>• Delta Dental</li>
              <li>• Blue Cross Blue Shield</li>
              <li>• Aetna</li>
              <li>• Cigna</li>
              <li>• MetLife</li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}