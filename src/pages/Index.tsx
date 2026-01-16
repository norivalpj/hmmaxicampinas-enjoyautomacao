import { Hero } from "@/components/Hero";
import { Equipamentos } from "@/components/Equipamentos";
import { Recursos } from "@/components/Recursos";
import { FormContrato } from "@/components/FormContrato";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Equipamentos />
      <Recursos />
      <FormContrato />
      <Footer />
    </div>
  );
};

export default Index;
