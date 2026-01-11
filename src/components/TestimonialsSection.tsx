export default function TestimonialsSection() {
  const testimonials = [

    {
      name: "Maidyamsai Tailu",
      role: "Regular Patient",
      image: "👩",
      rating: 5,
      text: "Neat and clean place..Friendly staffs and a very well experienced Dentists ❤️ I’ve done my braces there and the price is also very affordable ❤️"
    },
    {
      name: "Vishal Mohanty",
      role: "Happy Patient",
      image: "👨",
      rating: 5,
      text: "Highly recommend this dental clinic! The staff is friendly, the atmosphere is calm and welcoming, and the doctors are incredibly professional. The people run the clinic with genuine care and attention to detail, you can tell that comfort and hygiene are a top priority. Whether it’s a routine check-up or a more detailed procedure, you’re in safe hands here!"
    },
    {
      name: "Onia Toko",
      role: "Cosmetic Patient",
      image: "👩",
      rating: 5,
      text: "The service was very good and the staff was very helpful, please visit the clinic, I had the best experience"
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
                  {/* <p className="text-gray-600 text-sm">{testimonial.role}</p> */}
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
              <div className="font-semibold text-gray-900">4.5/5 Rating</div>
              <div className="text-sm text-gray-600">Based on 10+ reviews</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}