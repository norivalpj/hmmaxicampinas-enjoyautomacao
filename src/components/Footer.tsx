import { motion } from "framer-motion";
import { Phone, Mail, Instagram } from "lucide-react";
import logo from "@/assets/logo.png";

const contatos = [
  {
    icon: Phone,
    label: "Telefone",
    value: "(19) 98274.8275",
    href: "tel:+5519982748275",
  },
  {
    icon: Mail,
    label: "Email",
    value: "contato@enjoyautomacao.com.br",
    href: "mailto:contato@enjoyautomacao.com.br",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@enjoy.automacao",
    href: "https://instagram.com/enjoy.automacao",
  },
];

export const Footer = () => {
  return (
    <footer className="py-16 px-4 border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img src={logo} alt="Enjoy Automação" className="h-16 mb-6" />
            <p className="text-muted-foreground max-w-md">
              Conforto, segurança e economia para seu dia a dia. 
              Transformamos sua casa em um ambiente inteligente e conectado.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3 className="font-display text-xl font-semibold mb-6">Entre em Contato</h3>
            <div className="space-y-4">
              {contatos.map((contato) => (
                <a
                  key={contato.label}
                  href={contato.href}
                  target={contato.href.startsWith("http") ? "_blank" : undefined}
                  rel={contato.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <contato.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{contato.label}</p>
                    <p className="font-medium text-foreground">{contato.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Enjoy Automação. Todos os direitos reservados.</p>
          <p className="mt-2">Proposta exclusiva para HM Maxi Campinas</p>
        </div>
      </div>
    </footer>
  );
};
