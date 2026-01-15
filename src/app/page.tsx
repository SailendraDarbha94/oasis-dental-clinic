import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import AboutSection from '@/components/AboutSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Holy Grail Layout: Content Area */}
        <div className="flex-1 flex">
          {/* Sidebar - Hidden on mobile, visible on desktop */}
          {/* <div className="hidden lg:block w-80 flex-shrink-0">
            <Sidebar />
          </div> */}
          
          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            <HeroSection />
            <ServicesSection />
            <AboutSection />
            <TestimonialsSection />
            {/* <ContactSection /> */}
          </main>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
