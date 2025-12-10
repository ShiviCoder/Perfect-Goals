import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import VissionMission from "../../components/VissionMission";
import Services from "../../components/Services";
import Testimonials from "../../components/Testimonials";
import CTASection from "../../components/CTASection";
import Footer from '../../components/Footer'
export default function Home() {
  console.log("Loaded: Home");

  return (
    
    <div>
      
      <Navbar />
      <Hero />
      <VissionMission />
      <Services />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}