import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import PillarsSection from "@/components/landing/PillarsSection";
import IndexShowcase from "@/components/landing/IndexShowcase";
import CorrectionSection from "@/components/landing/CorrectionSection";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-14">
        <HeroSection />
        <PillarsSection />
        <IndexShowcase />
        <CorrectionSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
