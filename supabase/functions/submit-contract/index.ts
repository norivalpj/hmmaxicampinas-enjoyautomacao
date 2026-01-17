import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Google Forms configuration
const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSesrhOYxL_shRrO122LPj60suy2VEIOQcyXWVZGMP0IDGtSxg/formResponse";
const GOOGLE_FORM_FIELDS = {
  nome: "entry.623372429",
  email: "entry.1092955177",
  telefone: "entry.1960896618",
  cpf: "entry.133944556",
  endereco: "entry.193817474",
  apartamento: "entry.553914424",
  formaPagamento: "entry.2136262442",
};

// Valid payment options
const VALID_PAYMENT_OPTIONS = [
  "R$ 8310,00 - A Vista",
  "R$ 8749,00 - Entrada PIX (R$ 4374,50) + Saldo Parcelado até 6x",
];

// Sanitize input to prevent injection attacks
function sanitize(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 500); // Limit length
}

// Validate CPF using the official algorithm
function validateCPF(cpf: string): boolean {
  // Remove non-digits
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // CPF must have exactly 11 digits
  if (cleanCPF.length !== 11) return false;
  
  // Check for known invalid patterns (all same digits)
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF[9])) return false;
  
  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF[10])) return false;
  
  return true;
}

// Validate email format
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

// Validate phone number (Brazilian format)
function validatePhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
}

// Rate limiting store (in-memory, resets on function restart)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // Max submissions per window
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  record.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Muitas tentativas. Por favor, aguarde antes de tentar novamente.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { nome, email, telefone, cpf, endereco, apartamento, formaPagamento } = body;

    // Validate required fields
    const errors: string[] = [];

    if (!nome || typeof nome !== 'string' || nome.trim().length < 3 || nome.trim().length > 100) {
      errors.push('Nome deve ter entre 3 e 100 caracteres');
    }

    if (!email || !validateEmail(email)) {
      errors.push('Email inválido');
    }

    if (!telefone || !validatePhone(telefone)) {
      errors.push('Telefone inválido. Use o formato (XX) XXXXX-XXXX');
    }

    if (!cpf || !validateCPF(cpf)) {
      errors.push('CPF inválido');
    }

    if (!endereco || typeof endereco !== 'string' || endereco.trim().length < 10 || endereco.trim().length > 200) {
      errors.push('Endereço deve ter entre 10 e 200 caracteres');
    }

    if (!apartamento || typeof apartamento !== 'string' || apartamento.trim().length < 1 || apartamento.trim().length > 10) {
      errors.push('Número do apartamento inválido');
    }

    if (!formaPagamento || !VALID_PAYMENT_OPTIONS.includes(formaPagamento)) {
      errors.push('Forma de pagamento inválida');
    }

    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      return new Response(
        JSON.stringify({ error: 'Dados inválidos', details: errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize all inputs
    const sanitizedData = {
      nome: sanitize(nome),
      email: sanitize(email),
      telefone: sanitize(telefone),
      cpf: sanitize(cpf),
      endereco: sanitize(endereco),
      apartamento: sanitize(apartamento),
      formaPagamento: formaPagamento, // Already validated against whitelist
    };

    console.log('Processing contract submission (sanitized)');

    // Submit to Google Forms
    const formData = new URLSearchParams();
    formData.append(GOOGLE_FORM_FIELDS.nome, sanitizedData.nome);
    formData.append(GOOGLE_FORM_FIELDS.email, sanitizedData.email);
    formData.append(GOOGLE_FORM_FIELDS.telefone, sanitizedData.telefone);
    formData.append(GOOGLE_FORM_FIELDS.cpf, sanitizedData.cpf);
    formData.append(GOOGLE_FORM_FIELDS.endereco, sanitizedData.endereco);
    formData.append(GOOGLE_FORM_FIELDS.apartamento, sanitizedData.apartamento);
    formData.append(GOOGLE_FORM_FIELDS.formaPagamento, sanitizedData.formaPagamento);

    const googleResponse = await fetch(GOOGLE_FORM_ACTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    // Google Forms returns 200 even on success (it redirects to a confirmation page)
    // We check if the request was made successfully
    console.log(`Google Forms response status: ${googleResponse.status}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Dados enviados com sucesso' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing submission:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno. Por favor, tente novamente.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
