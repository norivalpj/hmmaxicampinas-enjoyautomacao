import { Hero } from "@/components/Hero";
import { Equipamentos } from "@/components/Equipamentos";
import { Recursos } from "@/components/Recursos";
import { CondicoesPagamento } from "@/components/CondicoesPagamento";
import { FormContrato } from "@/components/FormContrato";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Equipamentos />
      <Recursos />
      <CondicoesPagamento />
      <FormContrato />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
