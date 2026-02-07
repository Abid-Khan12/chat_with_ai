import Features from "@/components/tailark-elements/features-1";
import FooterSection from "@/components/tailark-elements/footer";
import HeroSection from "@/components/tailark-elements/hero-section";
import Pricing from "@/components/tailark-elements/pricing";

const HomePage = () => {
  return (
    <>
      <main className="pb-10 flex flex-col md:gap-36 gap-18">
        <HeroSection />
        <Features />
        <Pricing />
      </main>
      <FooterSection />
    </>
  );
};

export default HomePage;
