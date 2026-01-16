import { motion } from "framer-motion";
import { Palette, Smartphone, Zap, Lightbulb, Wifi, RotateCcw, Volume2, Layers } from "lucide-react";
import switchScenes from "@/assets/switch-scenes.jpg";

const recursos = [
  {
    icon: Palette,
    titulo: "3 Cores Disponíveis",
    descricao: "Escolha entre Branco, Prata ou Preto para combinar com seu ambiente",
  },
  {
    icon: Smartphone,
    titulo: "Configuração via App",
    descricao: "Cada tecla pode acionar iluminação e cenas, tudo configurável pelo aplicativo",
  },
  {
    icon: Lightbulb,
    titulo: "LED Indicador",
    descricao: "Ponto iluminado branco quando desligado e laranja quando ligado, com opção de dimerização",
  },
  {
    icon: Layers,
    titulo: "Cenas Personalizadas",
    descricao: "Configure cenas para ligar TV, ar condicionado, lâmpadas e muito mais de uma só vez",
  },
  {
    icon: Volume2,
    titulo: "Click Suave",
    descricao: "Botões de acionamento com toque suave e silencioso",
  },
  {
    icon: Wifi,
    titulo: "Rede Zigbee",
    descricao: "Acionamento em paralelo com outros módulos pela rede Zigbee",
  },
  {
    icon: Zap,
    titulo: "Paralelo Virtual",
    descricao: "Funciona localmente de forma instantânea, sem depender de internet",
  },
  {
    icon: RotateCcw,
    titulo: "Retorno de Energia",
    descricao: "Configure para ligar, desligar ou lembrar do último estado após queda de energia",
  },
];

export const Recursos = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
              Recursos dos Interruptores
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Tecnologia{" "}
              <span className="gradient-text">Premium</span>{" "}
              em cada detalhe
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Interruptores inteligentes com acabamento sofisticado e funcionalidades avançadas 
              para proporcionar conforto e praticidade no seu dia a dia.
            </p>

            <div className="relative aspect-video rounded-2xl overflow-hidden card-premium">
              <img
                src={switchScenes}
                alt="Interruptor com cenas"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-sm text-muted-foreground">Exemplo de cenas personalizadas</p>
                <p className="font-display text-lg font-semibold">Desligar • Conforto • Cinema</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {recursos.map((recurso, index) => (
              <motion.div
                key={recurso.titulo}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/30"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <recurso.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{recurso.titulo}</h3>
                <p className="text-sm text-muted-foreground">{recurso.descricao}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Extras info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 p-6 rounded-2xl bg-primary/5 border border-primary/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold mb-2">Botões Extras Inclusos</h3>
              <p className="text-muted-foreground">
                Cada interruptor acompanha 6 botões extras com ponto iluminado nos dois lados, 
                ideais para quando for usado com cenas. A gravação de ícones e textos pode ser 
                feita na superfície do botão (valor à parte).
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
