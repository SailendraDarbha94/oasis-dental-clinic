export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Happy Patient",
      image: "👩",
      rating: 5,
      text: "Dr. Johnson and her team are absolutely amazing! They made my dental anxiety disappear with their gentle approach and professional care. Highly recommend!"
    },
    {
      name: "Mike Chen",
      role: "Regular Patient",
      image: "👨",
      rating: 5,
      text: "I've been coming here for 3 years now. The staff is friendly, the facility is modern, and they always fit me into their schedule when I need emergency care."
    },
    {
      name: "Emily Rodriguez",
      role: "Cosmetic Patient",
      image: "👩",
      rating: 5,
      text: "Got my teeth whitened here and the results are incredible! The process was comfortable and the staff explained everything thoroughly. Love my new smile!"
    }
  ];

  return (
    <section className="py-20 bg-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Patients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what some of our satisfied patients 
            have to say about their experience at Oasis Dental Clinic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">{testimonial.image}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              
              <p className="text-gray-700 italic">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-md">
            <span className="text-2xl mr-3">🏆</span>
            <div className="text-left">
              <div className="font-semibold text-gray-900">4.9/5 Rating</div>
              <div className="text-sm text-gray-600">Based on 500+ reviews</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}