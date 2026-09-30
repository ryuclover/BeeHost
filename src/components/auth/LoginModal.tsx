import React, { useState } from 'react';
import { X, KeyRound, Mail, ArrowRight, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { retroAudio } from '../effects/SoundEffects';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (dadosCliente: any) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePreencherDemo = () => {
    retroAudio.playBlip(600);
    setEmail('demo@beehost.com');
    setSenha('123');
    setErro(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    retroAudio.playHover();

    try {
      // Tenta autenticar na API
      let respostaOk = false;
      let dados: any = null;

      try {
        const res = await fetch('http://localhost:3001/api/cliente/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha }),
        });
        dados = await res.json();
        respostaOk = res.ok && dados.sucesso;
      } catch {
        // Fallback local se backend offline
        if (email.toLowerCase().trim() === 'demo@beehost.com' && senha === '123') {
          respostaOk = true;
          dados = {
            token: 'bee-sessao-demo-12345',
            cliente: {
              nome: 'João Jogador',
              email: 'demo@beehost.com',
              planoNome: 'Abelha da Galera (4 GB RAM)',
            },
          };
        }
      }

      if (respostaOk && dados) {
        retroAudio.playCoin();
        localStorage.setItem('beehost_cliente_token', dados.token || 'bee-sessao-demo-12345');
        localStorage.setItem('beehost_cliente_dados', JSON.stringify(dados.cliente || { nome: 'João Jogador' }));

        if (onLoginSuccess) {
          onLoginSuccess(dados.cliente);
        } else {
          window.location.href = '/painel-cliente.html';
        }
      } else {
        retroAudio.playBlip(200, 'sawtooth');
        setErro(dados?.mensagem || 'E-mail ou senha incorretos. Tente preencher com a conta demo.');
      }
    } catch {
      retroAudio.playBlip(200, 'sawtooth');
      setErro('Falha na conexão com o servidor. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#081B3A] border-2 border-[#183B70] rounded-xl shadow-2xl p-6 overflow-hidden">
        
        {/* Faixa Pixel Art Decorativa */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FFD633] via-[#FFAE1A] to-[#168CFF]" />

        {/* Botão Fechar */}
        <button
          onClick={() => {
            retroAudio.playHover();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 text-[#BAC7DC] hover:text-[#F5F7FF] hover:bg-[#0E2C5D] rounded-lg transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0F3572] border border-[#168CFF]/40 text-[#FFD633] mb-3 shadow-inner">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#F5F7FF] tracking-wide font-display">
            Área do Cliente <span className="text-[#FFD633]">BeeHost</span>
          </h2>
          <p className="text-xs text-[#BAC7DC] mt-1">
            Entre para gerenciar seu servidor, ver o IP e acompanhar o status
          </p>
        </div>

        {/* Erro */}
        {erro && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-500/50 rounded-lg text-xs text-red-200">
            {erro}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#BAC7DC] mb-1.5">
              E-mail de Cadastro
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8EAD]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full pl-9 pr-3 py-2 text-sm text-[#F5F7FF] bg-[#051329] border border-[#183B70] rounded-lg focus:outline-none focus:border-[#FFD633] focus:ring-1 focus:ring-[#FFD633] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#BAC7DC] mb-1.5 flex justify-between items-center">
              <span>Senha de Acesso</span>
              <span className="text-[10px] text-[#7A8EAD]">Enviada na ativação</span>
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8EAD]" />
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm text-[#F5F7FF] bg-[#051329] border border-[#183B70] rounded-lg focus:outline-none focus:border-[#FFD633] focus:ring-1 focus:ring-[#FFD633] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full py-2.5 px-4 bg-[#FFD633] hover:bg-[#ffe066] text-[#07152F] font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-70"
          >
            {carregando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <span>Acessar Meu Servidor</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Atalho Demo */}
        <div className="mt-5 pt-4 border-t border-[#183B70]/60 flex items-center justify-between text-xs text-[#BAC7DC]">
          <span className="flex items-center gap-1 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD633]" />
            Quer testar o painel agora?
          </span>
          <button
            type="button"
            onClick={handlePreencherDemo}
            className="text-[#FFD633] hover:underline font-semibold text-[11px] cursor-pointer"
          >
            Preencher Demo (1-Clique)
          </button>
        </div>

      </div>
    </div>
  );
};
