import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import WhatIsSteam from "@/components/sections/WhatIsSteam";
import Mission from "@/components/sections/Mission";
import Team from "@/components/sections/Team";
import Programs from "@/components/sections/Programs";
import Collaborators from "@/components/sections/Collaborators";
import ImpulsaLandingSection from "@/components/sections/ImpulsaLandingSection";
import Blog from "@/components/sections/Blog";
import Footer from "@/components/sections/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <WhatIsSteam />
        <Mission />
        <Team />
        <Programs />
        <Collaborators />
        <ImpulsaLandingSection />
        <Blog />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
