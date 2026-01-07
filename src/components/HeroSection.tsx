"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HeroSection() {

  const router = useRouter();

  return (
    <section id="home" className="bg-gradient-to-br from-teal-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Your Smile is Our
              <span className="text-teal-600"> Priority</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Experience exceptional dental care in a comfortable, modern environment. 
              Our team of experienced professionals is dedicated to maintaining your oral health and creating beautiful smiles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => router.push('/appointment')} className="bg-teal-600 hover:cursor-pointer hover:bg-teal-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg">
                Book Your Appointment
              </button>
              <button className="border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="text-center">
                <div className="text-6xl mb-4">😊</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Happy Patients</h3>
                <p className="text-gray-600">Over 10,000 satisfied patients and counting!</p>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-teal-100 rounded-full p-4">
              <Image 
                src="/oasis-logo.png" 
                alt="Oasis Dental Clinic Logo" 
                width={48} 
                height={48}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}