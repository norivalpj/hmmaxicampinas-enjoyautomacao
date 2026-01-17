import { motion } from "framer-motion";
import { CreditCard, Percent, Banknote, Gift, Sparkles } from "lucide-react";

export const CondicoesPagamento = () => {
  const condicoes = [
    {
      icon: Percent,
      titulo: "À Vista (PIX)",
      valor: "R$ 8.310,00",
      descricao: "5% de desconto",
      destaque: true,
    },
    {
      icon: CreditCard,
      titulo: "Parcelado",
      valor: "R$ 8.749,00",
      descricao: "R$ 4.374,50 (PIX) + 6x de R$ 729,09",
      destaque: false,
    },
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Brinde Alexa - Destaque Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-2 border-primary/50 p-8 md:p-12">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30">
                  <Gift className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground" />
                </div>
              </div>
              
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                  <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                    Brinde Exclusivo
                  </span>
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                </div>
                
                <h3 className="font-display text-2xl md:text-4xl font-bold mb-3">
                  Ganhe uma{" "}
                  <span className="gradient-text">Amazon Echo Dot</span>
                </h3>
                
                <p className="text-lg md:text-xl text-muted-foreground mb-2">
                  Geração mais recente • Smart Speaker com Alexa
                </p>
                
                <p className="text-muted-foreground">
                  Som vibrante e potente • Wi-Fi e Bluetooth integrados
                </p>
                
                <p className="text-sm text-muted-foreground/70 mt-4 italic">
                  * Cor sujeita à disponibilidade
                </p>
              </div>
              
              <div className="hidden lg:block flex-shrink-0">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                    <span className="font-display text-2xl font-bold text-primary">GRÁTIS</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Título Condições de Pagamento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
            Pagamento Facilitado
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Condições de{" "}
            <span className="gradient-text">Pagamento</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Escolha a melhor forma de pagamento para você
          </p>
        </motion.div>

        {/* Cards de Condições */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {condicoes.map((condicao, index) => (
            <motion.div
              key={condicao.titulo}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`relative rounded-2xl p-6 text-center ${
                condicao.destaque
                  ? "bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/50"
                  : "card-premium"
              }`}
            >
              {condicao.destaque && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-primary-foreground text-xs font-semibold">
                  MELHOR OPÇÃO
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                condicao.destaque
                  ? "bg-primary/20"
                  : "bg-secondary"
              }`}>
                <condicao.icon className={`w-8 h-8 text-primary`} />
              </div>
              
              <h3 className="font-display text-xl font-bold mb-2">
                {condicao.titulo}
              </h3>
              
              <p className="text-2xl font-bold text-primary mb-2">
                {condicao.valor}
              </p>
              
              <p className="text-muted-foreground text-sm">
                {condicao.descricao}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
