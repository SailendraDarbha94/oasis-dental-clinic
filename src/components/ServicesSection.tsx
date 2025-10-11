export default function ServicesSection() {
  const services = [
    {
      icon: "🦷",
      title: "General Dentistry",
      description: "Comprehensive oral health care including cleanings, fillings, and preventive treatments.",
      features: ["Regular Checkups", "Cleanings", "Fillings", "Root Canals"]
    },
    {
      icon: "✨",
      title: "Cosmetic Dentistry",
      description: "Transform your smile with our advanced cosmetic dental procedures.",
      features: ["Teeth Whitening", "Veneers", "Bonding", "Smile Makeovers"]
    },
    {
      icon: "🔧",
      title: "Orthodontics",
      description: "Straighten your teeth with traditional braces or modern clear aligners.",
      features: ["Traditional Braces", "Clear Aligners", "Retainers", "Bite Correction"]
    },
    {
      icon: "🏥",
      title: "Oral Surgery",
      description: "Expert surgical procedures performed with precision and care.",
      features: ["Tooth Extractions", "Wisdom Teeth", "Implants", "Bone Grafting"]
    },
    {
      icon: "🚨",
      title: "Emergency Care",
      description: "Immediate dental care when you need it most, available 24/7.",
      features: ["Pain Relief", "Urgent Repairs", "Trauma Care", "Same-Day Service"]
    },
    {
      icon: "👶",
      title: "Pediatric Dentistry",
      description: "Specialized dental care for children in a fun, friendly environment.",
      features: ["Child-Friendly Care", "Preventive Treatments", "Education", "Sedation Options"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Comprehensive Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From routine cleanings to complex procedures, we offer a full range of dental services 
            to keep your smile healthy and beautiful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                    <span className="text-teal-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="mt-4 text-teal-600 hover:text-teal-700 font-medium text-sm">
                Learn More →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}