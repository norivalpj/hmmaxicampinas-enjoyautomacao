import { motion } from "framer-motion";
import { Package, Lightbulb, Tv } from "lucide-react";
import gateway from "@/assets/gateway.png";
import irControl from "@/assets/ir-control.png";
import switch6 from "@/assets/switch-6-buttons.jpg";
import switch2 from "@/assets/switch-2-buttons-white.jpg";
import switch1 from "@/assets/switch-1-button-silver.jpg";

const equipamentos = [
  {
    icon: Package,
    nome: "Central de Automação",
    descricao: "Gateway Zigbee para controle centralizado de todos os dispositivos",
    quantidade: "1 unidade",
    image: gateway,
  },
  {
    icon: Lightbulb,
    nome: "Interruptor Premium 4x4 - 6 teclas",
    descricao: "Para a entrada do apartamento",
    quantidade: "1 unidade",
    image: switch6,
  },
  {
    icon: Lightbulb,
    nome: "Interruptor Premium 4x2 - 2 teclas",
    descricao: "Para o corredor",
    quantidade: "1 unidade",
    image: switch2,
  },
  {
    icon: Lightbulb,
    nome: "Interruptor Premium 4x2 - 1 tecla",
    descricao: "Para quartos, banheiros e sacada",
    quantidade: "10 unidades",
    image: switch1,
  },
  {
    icon: Tv,
    nome: "Controle IR/RF",
    descricao: "Para ar condicionado e TVs (3 quartos e sala)",
    quantidade: "4 unidades",
    image: irControl,
  },
];

export const Equipamentos = () => {
  return (
    <section id="equipamentos" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
            Equipamentos Inclusos
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Tudo que você precisa para uma{" "}
            <span className="gradient-text">casa inteligente</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Equipamentos premium de última geração para transformar seu apartamento
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipamentos.map((item, index) => (
            <motion.div
              key={item.nome}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="card-premium rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="aspect-square relative mb-6 rounded-xl overflow-hidden bg-secondary/50">
                <img
                  src={item.image}
                  alt={item.nome}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary">{item.quantidade}</span>
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{item.nome}</h3>
              <p className="text-muted-foreground text-sm">{item.descricao}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
