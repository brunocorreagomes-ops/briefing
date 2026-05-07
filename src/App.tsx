/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, ChevronLeft, Check, Send, Instagram, Music, 
  MapPin, Globe, Phone, Mail, User, BookOpen, Star, 
  Target, PencilLine, Info, HelpCircle 
} from 'lucide-react';

interface FormData {
  nome: string;
  crp: string;
  whatsapp: string;
  email: string;
  cidade: string;
  endereco: string;
  apresentacao: string;
  diferencial: string;
  nao_quero: string;
  dominio_val: string;
  dominio_sugestao: string;
  mensagem_whatsapp: string;
  instagram: string;
  tiktok: string;
  sobre_existente: string;
  frases_site: string;
  observacoes_site: string;
  observacoes_gerais: string;
  modalidades: string[];
  publico: string[];
  temas: string[];
  fotos_consultorio: string[];
}

const initialData: FormData = {
  nome: '',
  crp: '',
  whatsapp: '',
  email: '',
  cidade: '',
  endereco: '',
  apresentacao: '',
  diferencial: '',
  nao_quero: '',
  dominio_val: '',
  dominio_sugestao: '',
  mensagem_whatsapp: '',
  instagram: '',
  tiktok: '',
  sobre_existente: '',
  frases_site: '',
  observacoes_site: '',
  observacoes_gerais: '',
  modalidades: [],
  publico: [],
  temas: [],
  fotos_consultorio: [],
};

const STEPS = [
  { id: 1, title: 'Identificação', icon: User },
  { id: 2, title: 'Sua Prática', icon: BookOpen },
  { id: 3, title: 'Preferências', icon: Star },
  { id: 4, title: 'Presença Digital', icon: Globe },
  { id: 5, title: 'Conteúdo do Site', icon: PencilLine },
];

const MODALIDADE_OPTIONS = ['Presencial', 'Online'];
const PUBLICO_OPTIONS = ['Crianças', 'Adolescentes', 'Adultos', 'Idosos', 'Casais', 'Famílias', 'Grupos'];
const TEMA_OPTIONS = ['Ansiedade', 'Depressão', 'Relacionamentos', 'Luto', 'Carreira', 'Autoconhecimento', 'Trauma', 'Maternidade', 'Infância'];
const FOTOS_OPTIONS = ['Sim, tenho fotos profissionais', 'Sim, tenho fotos amadoras', 'Não tenho fotos ainda', 'Vou providenciar'];

const LabelWithTooltip = ({ label, tooltip }: { label: string; tooltip: string }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="flex items-center gap-2 mb-2">
      <label className="text-xs uppercase tracking-widest text-brand-ink/60 font-medium">{label}</label>
      <div 
        className="relative flex items-center"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
      >
        <HelpCircle className="w-3.5 h-3.5 text-brand-olive/40 cursor-help hover:text-brand-olive transition-colors" />
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              className="absolute left-6 z-50 w-64 p-3 bg-brand-ink text-white text-[11px] rounded-xl shadow-xl leading-relaxed cursor-default pointer-events-none"
            >
              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-brand-ink rotate-45" />
              {tooltip}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleChip = (category: keyof FormData, value: string) => {
    setFormData(prev => {
      const current = prev[category] as string[];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(v => v !== value) };
      }
      return { ...prev, [category]: [...current, value] };
    });
  };

  const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSend = {
      ...formData,
      modalidades: formData.modalidades.join(', '),
      publico: formData.publico.join(', '),
      temas: formData.temas.join(', '),
      fotos_consultorio: formData.fotos_consultorio.join(', '),
      _subject: 'Novo briefing - Ryna Psicóloga',
    };

    try {
      const response = await fetch('https://formspree.io/f/xdabddoa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setIsSuccess(true); 
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md bg-white p-12 rounded-[40px] shadow-sm border border-brand-olive/10"
        >
          <div className="w-16 h-16 bg-brand-olive text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-serif mb-4">Briefing Enviado</h2>
          <p className="text-brand-ink/60 mb-8 font-light">
            Obrigada por compartilhar suas informações. Entrarei em contato em breve para darmos os próximos passos no seu projeto.
          </p>
          <button 
            onClick={() => { setStep(1); setFormData(initialData); setIsSuccess(false); }}
            className="text-brand-olive font-medium hover:underline flex items-center justify-center mx-auto gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Voltar ao início
          </button>
        </motion.div>
      </div>
    );
  }

  const StepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <LabelWithTooltip label="Nome Completo" tooltip="Como você gostaria que seu nome aparecesse na vitrine do site." />
              <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} className="form-input" placeholder="Seu nome" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <LabelWithTooltip label="CRP" tooltip="Seu registro profissional ativo para fins de identificação obrigatória no site." />
                <input type="text" name="crp" value={formData.crp} onChange={handleInputChange} className="form-input" placeholder="00/0000" />
              </div>
              <div>
                <LabelWithTooltip label="WhatsApp" tooltip="O número que será vinculado aos botões de contato direto do site." />
                <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="form-input" placeholder="(00) 00000-0000" />
              </div>
            </div>
            <div>
              <LabelWithTooltip label="E-mail" tooltip="Para envio de materiais e comunicações oficiais do projeto." />
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" placeholder="seuemail@exemplo.com" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <LabelWithTooltip label="Cidade / Estado" tooltip="A cidade principal de atuação para buscas regionais." />
                <input type="text" name="cidade" value={formData.cidade} onChange={handleInputChange} className="form-input" placeholder="Cidade - UF" />
              </div>
              <div>
                <LabelWithTooltip label="Endereço Completo" tooltip="Será exibido no rodapé ou página de contato se você atender presencialmente." />
                <input type="text" name="endereco" value={formData.endereco} onChange={handleInputChange} className="form-input" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <section>
              <LabelWithTooltip label="Modalidades de Atendimento" tooltip="Isso ajudará a definir as seções de serviço do site." />
              <div className="flex flex-wrap gap-3">
                {MODALIDADE_OPTIONS.map(opt => (
                  <button key={opt} type="button" onClick={() => toggleChip('modalidades', opt)} className={`chip ${formData.modalidades.includes(opt) ? 'chip-selected' : ''}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </section>
            <section>
              <LabelWithTooltip label="Público Atendido" tooltip="Selecione todos que compõem sua base atual ou desejada de pacientes." />
              <div className="flex flex-wrap gap-3">
                {PUBLICO_OPTIONS.map(opt => (
                  <button key={opt} type="button" onClick={() => toggleChip('publico', opt)} className={`chip ${formData.publico.includes(opt) ? 'chip-selected' : ''}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </section>
            <section>
              <LabelWithTooltip label="Principais Temas / Especialidades" tooltip="Estes temas serão as palavras-chave para seu público te encontrar." />
              <div className="flex flex-wrap gap-3">
                {TEMA_OPTIONS.map(opt => (
                  <button key={opt} type="button" onClick={() => toggleChip('temas', opt)} className={`chip ${formData.temas.includes(opt) ? 'chip-selected' : ''}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </section>
            <div>
              <LabelWithTooltip label="Como você se apresenta?" tooltip="Sua biografia escrita em primeira ou terceira pessoa. Pense no tom de voz." />
              <textarea name="apresentacao" value={formData.apresentacao} onChange={handleInputChange} className="form-input min-h-[120px]" placeholder="Conte um pouco sobre sua trajetória..." />
            </div>
            <div>
              <LabelWithTooltip label="Qual o seu diferencial?" tooltip="O que faz as pessoas escolherem você em vez de outro profissional? Ex: abordagem humanizada, especialização rara." />
              <textarea name="diferencial" value={formData.diferencial} onChange={handleInputChange} className="form-input min-h-[100px]" placeholder="O que torna seu atendimento único?" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div>
              <LabelWithTooltip label="O que você definitivamente NÃO quer?" tooltip="Ex: Não gosto de tons vivos, não quero fotos de cérebro, prefiro algo minimalista." />
              <textarea name="nao_quero" value={formData.nao_quero} onChange={handleInputChange} className="form-input min-h-[100px]" placeholder="Cores, estilos ou elementos que você não gosta..." />
            </div>
            <section>
              <LabelWithTooltip label="Fotos do Consultório / Profissionais" tooltip="A qualidade visual do site depende muito das imagens. Saber o que temos ajuda no layout." />
              <div className="flex flex-wrap gap-3">
                {FOTOS_OPTIONS.map(opt => (
                  <button key={opt} type="button" onClick={() => toggleChip('fotos_consultorio', opt)} className={`chip ${formData.fotos_consultorio.includes(opt) ? 'chip-selected' : ''}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </section>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <LabelWithTooltip label="Já possui domínio (URL)?" tooltip="Se você já comprou um endereço (ex: rynahayashi.com.br)." />
                <input type="text" name="dominio_val" value={formData.dominio_val} onChange={handleInputChange} className="form-input" placeholder="www.exemplo.com.br" />
              </div>
              <div>
                <LabelWithTooltip label="Sugestão de Domínio" tooltip="Caso não tenha, qual nome gostaria de registrar?" />
                <input type="text" name="dominio_sugestao" value={formData.dominio_sugestao} onChange={handleInputChange} className="form-input" placeholder="Sua sugestão..." />
              </div>
            </div>
            <div>
              <LabelWithTooltip label="Mensagem padrão WhatsApp" tooltip="A frase que aparecerá no celular do paciente quando ele clicar no botão do site." />
              <textarea name="mensagem_whatsapp" value={formData.mensagem_whatsapp} onChange={handleInputChange} className="form-input" placeholder="Ex: Olá, gostaria de agendar uma consulta." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <LabelWithTooltip label="Instagram" tooltip="Apenas o nome de usuário (ex: ryna_psico)." />
                <div className="flex items-center">
                  <span className="text-brand-ink/40 mr-2">@</span>
                  <input type="text" name="instagram" value={formData.instagram} onChange={handleInputChange} className="form-input" placeholder="seuperfil" />
                </div>
              </div>
              <div className="relative">
                <LabelWithTooltip label="TikTok" tooltip="Opcional. Se tiver conteúdo profissional na plataforma." />
                <div className="flex items-center">
                  <span className="text-brand-ink/40 mr-2">@</span>
                  <input type="text" name="tiktok" value={formData.tiktok} onChange={handleInputChange} className="form-input" placeholder="seuperfil" />
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div>
              <LabelWithTooltip label="Textos já existem?" tooltip="Se você já escreveu sobre você em blogs, PDFs ou outras redes." />
              <textarea name="sobre_existente" value={formData.sobre_existente} onChange={handleInputChange} className="form-input" placeholder="Links, PDFs ou redes sociais..." />
            </div>
            <div>
              <LabelWithTooltip label="Frases ou citações" tooltip="Aquela frase que resume seu pensamento ou abordagem clínica." />
              <textarea name="frases_site" value={formData.frases_site} onChange={handleInputChange} className="form-input" />
            </div>
            <div>
              <LabelWithTooltip label="Observações de Design" tooltip="Ex: Gostaria de uma seção de blog futura, ou um botão flutuante específico." />
              <textarea name="observacoes_site" value={formData.observacoes_site} onChange={handleInputChange} className="form-input" />
            </div>
            <div>
              <LabelWithTooltip label="Observações Gerais" tooltip="Qualquer outra coisa que você considere importante para o projeto." />
              <textarea name="observacoes_gerais" value={formData.observacoes_gerais} onChange={handleInputChange} className="form-input" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-0.5 w-8 bg-brand-olive opacity-30"></div>
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-brand-olive">Processo Criativo</span>
            <div className="h-0.5 w-8 bg-brand-olive opacity-30"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-brand-ink mb-2">Briefing</h1>
          <p className="text-brand-ink/40 italic font-serif text-xl border-t border-brand-ink/10 pt-4 inline-block px-12">Ryna Hayashi Psicóloga</p>
        </motion.div>
      </header>

      {/* Progress Bar Container */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <div className="flex justify-between items-center relative gap-4">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-brand-ink/10 -z-10 -translate-y-1/2"></div>
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex flex-col items-center gap-3">
              <button
                onClick={() => idx + 1 <= step && setStep(s.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border ${
                  step === s.id 
                    ? 'bg-brand-olive border-brand-olive text-white shadow-lg shadow-brand-olive/20' 
                    : idx + 1 < step 
                      ? 'bg-brand-olive text-white border-brand-olive' 
                      : 'bg-white border-brand-ink/10 text-brand-ink/40'
                }`}
              >
                {idx + 1 < step ? <Check className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
              </button>
              <span className={`text-[10px] uppercase tracking-widest hidden md:block ${step === s.id ? 'text-brand-olive font-bold' : 'text-brand-ink/40'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <main className="max-w-4xl mx-auto px-6">
        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-brand-olive/5 relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-warm/50 rounded-bl-[100%] pointer-events-none"></div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="mb-8">
                <span className="text-[10px] text-brand-olive font-bold uppercase tracking-widest block mb-1">Passo {step} de 5</span>
                <h2 className="text-3xl font-serif">{STEPS[step - 1].title}</h2>
              </div>
              
              <StepContent />

              <div className="mt-12 pt-8 border-t border-brand-ink/5 flex justify-between items-center">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 text-brand-ink/60 hover:text-brand-ink transition-colors font-medium px-4 py-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> Anterior
                  </button>
                ) : (
                  <div></div>
                )}

                {step < STEPS.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-brand-olive text-white px-8 py-3 rounded-full hover:shadow-xl transition-all duration-300 font-medium tracking-wide group"
                  >
                    Próximo <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-brand-olive text-white px-10 py-4 rounded-full hover:shadow-xl transition-all duration-300 font-bold tracking-widest uppercase text-sm disabled:opacity-50 group"
                  >
                    {isSubmitting ? 'Enviando...' : (
                      <>
                        Enviar Briefing <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </form>
      </main>

      {/* Footer Info */}
      <footer className="max-w-4xl mx-auto px-6 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-brand-ink/30 text-xs uppercase tracking-widest">
        <span>© 2026 Ryna Hayashi · Psicóloga</span>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-brand-olive transition-colors flex items-center gap-1"><Instagram className="w-3 h-3" /> Instagram</a>
          <a href="#" className="hover:text-brand-olive transition-colors flex items-center gap-1"><Mail className="w-3 h-3" /> Contato</a>
        </div>
      </footer>
    </div>
  );
}
