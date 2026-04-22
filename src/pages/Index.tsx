import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Mission from "@/components/sections/Mission";
import Programs from "@/components/sections/Programs";
import Donations from "@/components/sections/Donations";
import Blog from "@/components/sections/Blog";
import Footer from "@/components/sections/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Mission />
        <Programs />
        <Donations />
        <Blog />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
