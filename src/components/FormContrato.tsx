import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, FileText, CheckCircle2, Send, MessageCircle } from "lucide-react";

const formSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  email: z.string().email("Email inválido").max(255),
  telefone: z.string().min(10, "Telefone inválido").max(20),
  cpf: z.string().min(11, "CPF inválido").max(14),
  endereco: z.string().min(10, "Endereço deve ser completo").max(200),
  apartamento: z.string().min(1, "Informe o número do apartamento").max(10),
});

type FormData = z.infer<typeof formSchema>;

// Google Forms configuration
const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSesrhOYxL_shRrO122LPj60suy2VEIOQcyXWVZGMP0IDGtSxg/formResponse";
const GOOGLE_FORM_FIELDS = {
  nome: "entry.623372429",
  email: "entry.1092955177", 
  telefone: "entry.1960896618",
  cpf: "entry.133944556",
  endereco: "entry.193817474",
  apartamento: "entry.553914424",
};

export const FormContrato = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1.$2");
  };

  const sendToGoogleForms = async (data: FormData) => {
    const formData = new FormData();
    formData.append(GOOGLE_FORM_FIELDS.nome, data.nome);
    formData.append(GOOGLE_FORM_FIELDS.email, data.email);
    formData.append(GOOGLE_FORM_FIELDS.telefone, data.telefone);
    formData.append(GOOGLE_FORM_FIELDS.cpf, data.cpf);
    formData.append(GOOGLE_FORM_FIELDS.endereco, data.endereco);
    formData.append(GOOGLE_FORM_FIELDS.apartamento, data.apartamento);

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });
      return true;
    } catch (error) {
      console.error("Erro ao enviar para Google Forms:", error);
      return false;
    }
  };

  const notifyViaWhatsApp = (data: FormData) => {
    const message = `🔔 *NOVO CADASTRO RECEBIDO*

👤 Cliente: ${data.nome}
🏢 Apartamento: ${data.apartamento}

_Verifique o Google Forms para detalhes completos._`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "5519982748275";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
  };

  const sendViaEmail = (data: FormData) => {
    const subject = `Novo Contrato - Automação Residencial - ${data.nome}`;
    const body = `NOVO CONTRATO - AUTOMAÇÃO RESIDENCIAL

Dados do Cliente:
- Nome: ${data.nome}
- Email: ${data.email}
- Telefone: ${data.telefone}
- CPF: ${data.cpf}
- Endereço: ${data.endereco}
- Apartamento: ${data.apartamento}

---
Enviado via Landing Page HM Maxi Campinas`;

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    window.open(`mailto:contato@enjoyautomacao.com.br?subject=${encodedSubject}&body=${encodedBody}`, "_blank");
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    // Envia para Google Forms
    await sendToGoogleForms(data);
    
    // Envia por email
    sendViaEmail(data);
    
    // Notifica por WhatsApp (apenas notificação)
    notifyViaWhatsApp(data);
    
    console.log("Dados do contrato:", data);
    
    toast.success("Dados enviados com sucesso!", {
      description: "Suas informações foram salvas no Google Forms e enviadas por Email.",
    });
    
    setIsSuccess(true);
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <section id="contrato" className="py-20 px-4">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-premium rounded-2xl p-8 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-4">Cadastro Realizado!</h3>
            <p className="text-muted-foreground mb-6">
              Seus dados foram salvos com sucesso. 
              Em breve entraremos em contato para finalizar seu contrato!
            </p>
            <Button
              onClick={() => {
                setIsSuccess(false);
                reset();
              }}
              variant="outline"
            >
              Fazer novo cadastro
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contrato" className="py-20 px-4 relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
            Contratação
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Garanta sua{" "}
            <span className="gradient-text">automação</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Preencha seus dados e entraremos em contato para finalizar seu contrato
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="card-premium rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Nome Completo
                </Label>
                <Input
                  id="nome"
                  placeholder="Seu nome completo"
                  {...register("nome")}
                  className="bg-secondary/50 border-border/50 focus:border-primary"
                />
                {errors.nome && (
                  <p className="text-destructive text-sm">{errors.nome.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register("email")}
                  className="bg-secondary/50 border-border/50 focus:border-primary"
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Telefone
                </Label>
                <Input
                  id="telefone"
                  placeholder="(19) 98274.8275"
                  {...register("telefone")}
                  onChange={(e) => {
                    e.target.value = formatPhone(e.target.value);
                  }}
                  maxLength={15}
                  className="bg-secondary/50 border-border/50 focus:border-primary"
                />
                {errors.telefone && (
                  <p className="text-destructive text-sm">{errors.telefone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf" className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  CPF
                </Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  {...register("cpf")}
                  onChange={(e) => {
                    e.target.value = formatCPF(e.target.value);
                  }}
                  maxLength={14}
                  className="bg-secondary/50 border-border/50 focus:border-primary"
                />
                {errors.cpf && (
                  <p className="text-destructive text-sm">{errors.cpf.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="endereco" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Endereço Completo
                </Label>
                <Input
                  id="endereco"
                  placeholder="Rua, número, bairro, cidade - UF"
                  {...register("endereco")}
                  className="bg-secondary/50 border-border/50 focus:border-primary"
                />
                {errors.endereco && (
                  <p className="text-destructive text-sm">{errors.endereco.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="apartamento" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Nº do Apartamento (HM Maxi)
                </Label>
                <Input
                  id="apartamento"
                  placeholder="Ex: 101"
                  {...register("apartamento")}
                  className="bg-secondary/50 border-border/50 focus:border-primary"
                />
                {errors.apartamento && (
                  <p className="text-destructive text-sm">{errors.apartamento.message}</p>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-border/50">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg button-glow"
              >
                <Send className="w-5 h-5 mr-2" />
                {isSubmitting ? "Enviando..." : "Enviar Dados"}
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Seus dados serão salvos e você receberá contato em breve
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};