import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, FileText, CheckCircle2, Send, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// CPF validation algorithm
const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF[9])) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF[10])) return false;
  
  return true;
};

const formSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  email: z.string().email("Email inválido").max(255),
  telefone: z.string().min(10, "Telefone inválido").max(20),
  cpf: z.string()
    .min(11, "CPF inválido")
    .max(14)
    .refine((val) => validateCPF(val), { message: "CPF inválido" }),
  endereco: z.string().min(10, "Endereço deve ser completo").max(200),
  apartamento: z.string().min(1, "Informe o número do apartamento").max(10),
  formaPagamento: z.string().min(1, "Selecione uma forma de pagamento"),
});

type FormData = z.infer<typeof formSchema>;

const FORMAS_PAGAMENTO = [
  { value: "R$ 8310,00 - A Vista", label: "À Vista (PIX) - R$ 8.310,00" },
  { value: "R$ 8749,00 - Entrada PIX (R$ 4374,50) + Saldo Parcelado até 6x", label: "Parcelado - R$ 8.749,00 (R$ 4.374,50 PIX + 6x R$ 729,09)" },
];

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

  const submitToServer = async (data: FormData & { website?: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: response, error } = await supabase.functions.invoke('submit-contract', {
        body: {
          ...data,
          website: (document.getElementById('website') as HTMLInputElement)?.value || ''
        }
      });

      if (error) {
        return { success: false, error: error.message || 'Erro ao enviar dados' };
      }

      if (response?.error) {
        return { success: false, error: response.error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro de conexão. Por favor, tente novamente.' };
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    const result = await submitToServer(data);
    
    if (result.success) {
      toast.success("Dados enviados com sucesso!", {
        description: "Suas informações foram salvas. Você receberá contato em breve.",
      });
      setIsSuccess(true);
    } else {
      toast.error("Erro ao enviar dados", {
        description: result.error || "Por favor, verifique os dados e tente novamente.",
      });
    }
    
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
            {/* Honeypot field - hidden from users, bots will fill it */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            
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

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="formaPagamento" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Forma de Pagamento
                </Label>
                <div className="space-y-3">
                  {FORMAS_PAGAMENTO.map((opcao) => (
                    <label
                      key={opcao.value}
                      className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <input
                        type="radio"
                        value={opcao.value}
                        {...register("formaPagamento")}
                        className="w-4 h-4 text-primary accent-primary"
                      />
                      <span className="text-sm">{opcao.label}</span>
                    </label>
                  ))}
                </div>
                {errors.formaPagamento && (
                  <p className="text-destructive text-sm">{errors.formaPagamento.message}</p>
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
              <p className="text-center text-sm text-muted-foreground mt-4">
                Seus dados serão salvos e você receberá contato em breve
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
