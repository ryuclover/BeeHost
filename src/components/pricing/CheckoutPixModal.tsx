import React, { useState, useEffect } from 'react';
import { X, QrCode, Copy, Check, Sparkles, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { retroAudio } from '../effects/SoundEffects';

interface PlanoSelecionado {
  id: string;
  nome: string;
  precoMensal: number;
  precoAnual: number;
  memoriaRam?: string;
}

interface CheckoutPixModalProps {
  isOpen: boolean;
  onClose: () => void;
  plano: PlanoSelecionado;
  periodo?: 'mensal' | 'anual';
}

export const CheckoutPixModal: React.FC<CheckoutPixModalProps> = ({
  isOpen,
  onClose,
  plano,
  periodo = 'mensal',
}) => {
  const [etapa, setEtapa] = useState<'formulario' | 'pix' | 'sucesso'>('formulario');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [dadosPix, setDadosPix] = useState<any>(null);
  const [copiado, setCopiado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(900); // 15 min

  const valor = periodo === 'anual' ? plano.precoAnual * 12 : plano.precoMensal;

  useEffect(() => {
    if (!isOpen) {
      setEtapa('formulario');
      setCarregando(false);
      setDadosPix(null);
    }
  }, [isOpen]);

  // Timer do Pix
  useEffect(() => {
    if (etapa !== 'pix' || tempoRestante <= 0) return;
    const interval = setInterval(() => {
      setTempoRestante(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [etapa, tempoRestante]);

  // Polling de verificação de pagamento
  useEffect(() => {
    if (etapa !== 'pix' || !dadosPix?.pedidoId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/publico/pedidos/${dadosPix.pedidoId}/status`);
        const data = await res.json();
        if (data.pago) {
          dispararSucesso();
        }
      } catch {}
    }, 3000);

    return () => clearInterval(interval);
  }, [etapa, dadosPix]);

  const dispararSucesso = () => {
    retroAudio.playCoin();
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch {}
    setEtapa('sucesso');
  };

  if (!isOpen) return null;

  const handleGerarPix = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    retroAudio.playHover();

    try {
      let resultadoPix = null;

      try {
        const res = await fetch('http://localhost:3001/api/publico/checkout/pix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planoId: plano.id,
            periodo,
            nome,
            email,
            telefone,
            cpf,
          }),
        });
        if (res.ok) {
          resultadoPix = await res.json();
        }
      } catch {}

      if (!resultadoPix?.sucesso) {
        resultadoPix = {
          sucesso: true,
          pedidoId: `ped-${Date.now()}`,
          valor,
          copiaECola: `00020126580014br.gov.bcb.pix0136beehost-demo-pix520400005303986540${valor.toFixed(2)}5802BR5915BeeHost Cloud6009Sao Paulo62070503***6304ABCD`,
        };
      }

      if (resultadoPix?.sucesso) {
        retroAudio.playCoin();
        setDadosPix(resultadoPix);
        setEtapa('pix');
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleCopiarPix = () => {
    retroAudio.playCoin();
    if (dadosPix?.copiaECola) {
      navigator.clipboard.writeText(dadosPix.copiaECola);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  const handleSimularPagamento = async () => {
    retroAudio.playCoin();
    setCarregando(true);
    try {
      if (dadosPix?.pedidoId) {
        await fetch(`http://localhost:3001/api/publico/pedidos/${dadosPix.pedidoId}/simular-pagamento`, {
          method: 'POST',
        });
      }
      dispararSucesso();
    } finally {
      setCarregando(false);
    }
  };

  const handleIrParaPainel = () => {
    retroAudio.playHover();
    localStorage.setItem('beehost_cliente_token', 'bee-sessao-demo-12345');
    localStorage.setItem('beehost_cliente_dados', JSON.stringify({ nome, email, planoNome: plano.nome }));
    window.location.href = '/painel-cliente.html';
  };

  const formatarTempo = (segundos: number) => {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#081B3A] border-2 border-[#183B70] rounded-xl shadow-2xl p-6 overflow-hidden">
        
        {/* Faixa Pixel Art */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FFD633] via-[#FFAE1A] to-[#168CFF]" />

        {/* Botão Fechar */}
        <button
          onClick={() => {
            retroAudio.playHover();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 text-[#BAC7DC] hover:text-[#F5F7FF] hover:bg-[#0E2C5D] rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ETAPA 1: Formulário de Dados */}
        {etapa === 'formulario' && (
          <div>
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0F3572] border border-[#168CFF]/40 text-[#FFD633] mb-3 shadow-inner">
                <QrCode className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-[#F5F7FF] font-display">
                Ativar <span className="text-[#FFD633]">{plano.nome}</span>
              </h2>
              <p className="text-xs text-[#BAC7DC] mt-1">
                Pagamento instantâneo via PIX com liberação automática
              </p>
              <div className="mt-2 inline-block px-3 py-1 bg-[#051329] border border-[#183B70] rounded-full text-xs font-bold text-[#FFD633]">
                Total: R$ {valor.toFixed(2).replace('.', ',')} ({periodo === 'anual' ? 'Anual' : 'Mensal'})
              </div>
            </div>

            <form onSubmit={handleGerarPix} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#BAC7DC] mb-1">Seu Nome Completo</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full px-3 py-2 text-sm text-[#F5F7FF] bg-[#051329] border border-[#183B70] rounded-lg focus:border-[#FFD633] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BAC7DC] mb-1">E-mail para Acesso ao Painel</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joao@exemplo.com"
                  className="w-full px-3 py-2 text-sm text-[#F5F7FF] bg-[#051329] border border-[#183B70] rounded-lg focus:border-[#FFD633] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#BAC7DC] mb-1">WhatsApp (DDD + Número)</label>
                  <input
                    type="text"
                    required
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="11999999999"
                    className="w-full px-3 py-2 text-sm text-[#F5F7FF] bg-[#051329] border border-[#183B70] rounded-lg focus:border-[#FFD633] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#BAC7DC] mb-1">CPF (Opcional)</label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 text-sm text-[#F5F7FF] bg-[#051329] border border-[#183B70] rounded-lg focus:border-[#FFD633] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="w-full mt-2 py-3 px-4 bg-[#FFD633] hover:bg-[#ffe066] text-[#07152F] font-bold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-70"
              >
                {carregando ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gerando QR Code PIX...</span>
                  </>
                ) : (
                  <>
                    <span>Gerar Código PIX</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ETAPA 2: QR Code e Código PIX */}
        {etapa === 'pix' && (
          <div className="text-center space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 rounded-full inline-block mb-2">
                Aguardando Pagamento
              </span>
              <h3 className="text-lg font-bold text-[#F5F7FF]">Pague com o PIX do seu Banco</h3>
              <p className="text-xs text-[#BAC7DC]">
                O seu servidor será ativado automaticamente assim que o pagamento for detectado.
              </p>
            </div>

            {/* Caixa do QR Code */}
            <div className="inline-block p-4 bg-white rounded-xl shadow-lg border-2 border-[#FFD633]">
              <img
                src={dadosPix?.qrCodeBase64 && dadosPix.qrCodeBase64.length > 200 ? `data:image/png;base64,${dadosPix.qrCodeBase64}` : '/pix-qrcode.svg'}
                alt="QR Code PIX"
                className="w-44 h-44 mx-auto object-contain"
              />
            </div>

            {/* Tempo Restante */}
            <div className="text-xs text-[#BAC7DC]">
              Código válido por: <strong className="text-[#FFD633] font-mono">{formatarTempo(tempoRestante)}</strong>
            </div>

            {/* Pix Copia e Cola */}
            <div className="space-y-1.5 text-left">
              <label className="text-[11px] font-semibold text-[#BAC7DC]">Pix Copia e Cola:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={dadosPix?.copiaECola || ''}
                  className="w-full px-3 py-2 text-xs font-mono bg-[#051329] border border-[#183B70] rounded-lg text-[#BAC7DC] select-all"
                />
                <button
                  type="button"
                  onClick={handleCopiarPix}
                  className="px-3 py-2 bg-[#FFD633] hover:bg-[#ffe066] text-[#07152F] font-bold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiado ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Botão de Teste Rápido */}
            <div className="pt-3 border-t border-[#183B70]/60 flex items-center justify-between text-xs text-[#BAC7DC]">
              <span className="flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD633]" />
                Modo de Desenvolvimento
              </span>
              <button
                type="button"
                onClick={handleSimularPagamento}
                disabled={carregando}
                className="text-[#FFD633] hover:underline font-semibold text-[11px] cursor-pointer"
              >
                ⚡ Simular Pagamento Aprovado
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 3: Sucesso e Acesso ao Painel */}
        {etapa === 'sucesso' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 rounded-full mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold font-display text-[#F5F7FF]">Pagamento Confirmado!</h3>
              <p className="text-xs text-[#BAC7DC] mt-1 max-w-sm mx-auto">
                Seu servidor de Minecraft foi provisionado e já está pronto para você jogar com seus amigos.
              </p>
            </div>

            <div className="bg-[#051329] border border-[#183B70] rounded-xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#BAC7DC]">Plano Contratado:</span>
                <strong className="text-[#FFD633]">{plano.nome}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#BAC7DC]">E-mail de Acesso:</span>
                <strong className="text-[#F5F7FF]">{email}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#BAC7DC]">Senha Padrão:</span>
                <strong className="text-[#FFD633] font-mono">123</strong>
              </div>
            </div>

            <button
              onClick={handleIrParaPainel}
              className="w-full py-3 bg-[#FFD633] hover:bg-[#ffe066] text-[#07152F] font-bold text-sm rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Acessar Meu Painel Agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
