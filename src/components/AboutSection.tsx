export default function AboutSection() {
  const stats = [
    { number: "5+", label: "Years Experience" },
    { number: "100+", label: "Happy Patients" },
    { number: "3", label: "Expert Dentists" },
    { number: "24/7*365", label: "Expert Care" }
  ];

  const teamMembers = [
    {
      name: "Dr. Nani Monia",
      role: "Founder & General Dentist",
      image: "👩‍⚕️",
      description: ""
    },
    {
      name: "Dr. Farhan Khan",
      role: "Oral & Maxillofacial Surgeon",
      image: "👨‍⚕️",
      description: "Fellowship in Maxillofacial Trauma (Manipal Hospital)"
    },
    {
      name: "Dr. Taw Mepu",
      role: "Orthodontist",
      image: "👩‍⚕️",
      description: "Specialist in braces, aligners, and bite correction treatments."
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Introduction */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            About Oasis Dental Clinic
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
            Founded in 2025, Oasis Dental Clinic has been serving the community with exceptional
            dental care. Our state-of-the-art facility combines cutting-edge technology with
            a warm, welcoming atmosphere to ensure every patient receives the best possible care.
          </p>
        </div>
        <div className="flex flex-wrap justify-center mb-8">
          <div className="w-full lg:w-1/2 p-4">
            <img
              src="/toothSample.jpeg"
              alt="Dr. Nani Monia"
              className="w-full h-auto max-h-96 rounded-xl object-cover shadow-md"
            />
          </div>
          <div className="w-full lg:w-1/2 p-4">
            <img
              src="/little-girl-getting-treatment.jpeg"
              alt="Treatment image of the clinic"
              className="w-full h-auto max-h-96 rounded-xl object-cover shadow-md"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-teal-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission & Values */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 mb-4">
              To provide exceptional, personalized dental care in a comfortable environment
              while building lasting relationships with our patients and community.
            </p>
            <p className="text-gray-600">
              We believe that everyone deserves a healthy, beautiful smile, and we're
              committed to making that a reality for each of our patients.
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-teal-500 mr-2 mt-1">✓</span>
                <span><strong>Excellence:</strong> Delivering the highest quality dental care</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2 mt-1">✓</span>
                <span><strong>Compassion:</strong> Treating every patient with kindness and understanding</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2 mt-1">✓</span>
                <span><strong>Innovation:</strong> Using the latest technology and techniques</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2 mt-1">✓</span>
                <span><strong>Integrity:</strong> Honest, transparent communication always</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Team */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Meet Our Expert Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <div className="text-6xl mb-4">{member.image}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h4>
                <p className="text-teal-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}