export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-teal-600 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Schedule Your Visit?
          </h2>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto">
            Contact us today to book your appointment or learn more about our services. 
            We're here to help you achieve your best smile!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6">Feedback</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="(+91) 123-4567"
                />
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium mb-2">
                  Service Availed
                </label>
                <select
                  id="service"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="" className="text-gray-800">Select a service</option>
                  <option value="consultation" className="text-gray-800">Consultation</option>
                  <option value="general" className="text-gray-800">General Dentistry</option>
                  <option value="cosmetic" className="text-gray-800">Cosmetic Dentistry</option>
                  <option value="orthodontics" className="text-gray-800">Orthodontics</option>
                  <option value="surgery" className="text-gray-800">Oral Surgery</option>
                  <option value="emergency" className="text-gray-800">Emergency Care</option>
                  <option value="pediatric" className="text-gray-800">Pediatric Dentistry</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Tell us about your dental needs or any questions you have..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-4">📍</span>
                  <div>
                    <h4 className="font-semibold mb-1 text-xl">Address</h4>
                    <p className="text-teal-100 font-bold">
                      Oasis Dental/Aesthetic Clinic<br />
                      A Sector<br />
                      Papum Pare <br />
                      Arunachal Pradesh <br />
                      India - 791110
                    </p>
                    <p className="text-teal-300">Landmark : Near Success Point</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-4">📞</span>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <p className="text-teal-100">9108980207</p>
                    {/* <p className="text-sm text-teal-200">Emergency: (555) 911-CARE</p> */}
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-4">📧</span>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-teal-300">info@oasisdental.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-4">🕒</span>
                  <div>
                    <h4 className="font-semibold mb-1">Office Hours</h4>
                    <div className="text-teal-100 text-sm space-y-1">
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
              <ul className="space-y-3 text-teal-100">
                <li className="flex items-center">
                  <span className="text-white mr-2">✓</span>
                  State-of-the-art equipment
                </li>
                <li className="flex items-center">
                  <span className="text-white mr-2">✓</span>
                  Experienced, caring staff
                </li>
                <li className="flex items-center">
                  <span className="text-white mr-2">✓</span>
                  Flexible scheduling
                </li>
                <li className="flex items-center">
                  <span className="text-white mr-2">✓</span>
                  Most insurance accepted
                </li>
                <li className="flex items-center">
                  <span className="text-white mr-2">✓</span>
                  Emergency care available
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}