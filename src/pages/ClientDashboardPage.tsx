import React, { useState, useEffect } from 'react';
import { 
  Server, Play, Square, RotateCw, Copy, Check, ExternalLink, 
  Users, Cpu, HardDrive, Shield, LogOut, Sparkles
} from 'lucide-react';
import { BeehostLogo } from '../components/brand/BeehostLogo';
import { retroAudio } from '../components/effects/SoundEffects';

interface DadosServidor {
  id: string;
  nome: string;
  planoNome: string;
  jogo: string;
  ipConexao: string;
  portaConexao: number;
  status: 'online' | 'offline' | 'reiniciando';
  jogadoresOnline: string;
  usoRam: string;
  usoCpu: string;
  craftyUrl: string;
  craftyUser?: string;
  craftyPass?: string;
  motd: string;
  whitelist: boolean;
  vencimento: string;
}

export const ClientDashboardPage: React.FC = () => {
  const [servidor, setServidor] = useState<DadosServidor>({
    id: 'cli-101',
    nome: 'João Jogador',
    planoNome: 'Abelha da Galera (4 GB RAM)',
    jogo: 'Minecraft PaperMC 1.20.4',
    ipConexao: 'jogar.beehost.qd.je',
    portaConexao: 38450,
    status: 'online',
    jogadoresOnline: '3 / 25',
    usoRam: '1.8 GB / 4.0 GB',
    usoCpu: '14%',
    craftyUrl: 'https://painel.beehost.qd.je:8443',
    craftyUser: 'joao_cliente',
    craftyPass: 'beeCrafty2026!',
    motd: 'Servidor do Joãozinho - Bem vindos!',
    whitelist: false,
    vencimento: '24/10/2026',
  });

  const [copiado, setCopiado] = useState(false);
  const [executandoAcao, setExecutandoAcao] = useState(false);
  const [mensagemAcao, setMensagemAcao] = useState<string | null>(null);
  const [novoMotd, setNovoMotd] = useState(servidor.motd);
  const [novaWhitelist, setNovaWhitelist] = useState(servidor.whitelist);
  const [salvandoConfig, setSalvandoConfig] = useState(false);

  // Carregar dados reais da API se logado
  useEffect(() => {
    const token = localStorage.getItem('beehost_cliente_token');
    if (!token) return;

    fetch('http://localhost:3001/api/cliente/servidor', {
      headers: { 'x-cliente-token': token },
    })
      .then(res => res.json())
      .then(data => {
        if (data.sucesso && data.servidor) {
          setServidor(data.servidor);
          setNovoMotd(data.servidor.motd || '');
          setNovaWhitelist(Boolean(data.servidor.whitelist));
        }
      })
      .catch(() => {});
  }, []);

  const handleCopiarIP = () => {
    retroAudio.playCoin();
    const endereco = `${servidor.ipConexao}:${servidor.portaConexao}`;
    navigator.clipboard.writeText(endereco);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleComando = async (acao: 'iniciar' | 'parar' | 'reiniciar') => {
    retroAudio.playHover();
    setExecutandoAcao(true);
    setMensagemAcao(null);

    const token = localStorage.getItem('beehost_cliente_token');

    try {
      if (token) {
        const res = await fetch('http://localhost:3001/api/cliente/servidor/comando', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-cliente-token': token,
          },
          body: JSON.stringify({ acao }),
        });
        const data = await res.json();
        if (data.sucesso) {
          setServidor(prev => ({ ...prev, status: data.novoStatus }));
          setMensagemAcao(`Comando ${acao} executado!`);
        }
      } else {
        // Modo local
        setServidor(prev => ({
          ...prev,
          status: acao === 'iniciar' ? 'online' : acao === 'parar' ? 'offline' : 'reiniciando',
        }));
        setMensagemAcao(`Comando ${acao} enviado!`);
      }
    } catch {
      setMensagemAcao('Falha ao comunicar com o servidor');
    } finally {
      setExecutandoAcao(false);
      setTimeout(() => setMensagemAcao(null), 3500);
    }
  };

  const handleSalvarConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    retroAudio.playCoin();
    setSalvandoConfig(true);

    const token = localStorage.getItem('beehost_cliente_token');
    try {
      if (token) {
        await fetch('http://localhost:3001/api/cliente/servidor/config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-cliente-token': token,
          },
          body: JSON.stringify({ motd: novoMotd, whitelist: novaWhitelist }),
        });
      }
      setServidor(prev => ({ ...prev, motd: novoMotd, whitelist: novaWhitelist }));
      setMensagemAcao('Configurações salvas com sucesso!');
    } finally {
      setSalvandoConfig(false);
      setTimeout(() => setMensagemAcao(null), 3000);
    }
  };

  const handleLogout = () => {
    retroAudio.playHover();
    localStorage.removeItem('beehost_cliente_token');
    localStorage.removeItem('beehost_cliente_dados');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#051329] text-[#F5F7FF] font-sans">
      {/* Topo / Navbar */}
      <header className="sticky top-0 z-30 bg-[#081B3A]/95 backdrop-blur-md border-b border-[#183B70]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center group cursor-pointer">
              <BeehostLogo size="md" showMascot={true} />
            </a>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-[11px] font-bold bg-[#FFD633]/20 border border-[#FFD633]/40 text-[#FFD633] rounded-md uppercase tracking-wider">
              Área do Cliente
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#BAC7DC] hidden md:inline">
              Olá, <strong className="text-[#F5F7FF]">{servidor.nome}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#BAC7DC] hover:text-[#F5F7FF] bg-[#091D3E] hover:bg-[#0E2C5D] border border-[#183B70] rounded-md transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Banner de Mensagem Temporária */}
        {mensagemAcao && (
          <div className="p-3 bg-[#0F3572] border border-[#FFD633]/40 text-[#FFD633] text-xs font-semibold rounded-lg flex items-center gap-2 animate-fade-in shadow-md">
            <Sparkles className="w-4 h-4" />
            <span>{mensagemAcao}</span>
          </div>
        )}

        {/* Card Principal: Servidor & IP de Conexão */}
        <div className="bg-[#081B3A] border-2 border-[#183B70] rounded-xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD633] to-[#168CFF]" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Esquerda: Identificação e Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-[#0F3572] border border-[#168CFF]/30 text-[#FFD633] rounded-lg">
                  <Server className="w-6 h-6" />
                </span>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-display tracking-wide text-[#F5F7FF]">
                    {servidor.nome}
                  </h1>
                  <p className="text-xs text-[#BAC7DC]">
                    {servidor.planoNome} • <span className="text-[#FFD633]">{servidor.jogo}</span>
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-[#BAC7DC]">Status do Servidor:</span>
                {servidor.status === 'online' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 border border-emerald-500/50 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE
                  </span>
                )}
                {servidor.status === 'offline' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 border border-red-500/50 text-red-400">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    OFFLINE
                  </span>
                )}
                {servidor.status === 'reiniciando' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-500/50 text-amber-400">
                    <RotateCw className="w-3 h-3 animate-spin text-amber-400" />
                    REINICIANDO
                  </span>
                )}
              </div>
            </div>

            {/* Centro / Direita: Endereço IP & Botão de Cópia */}
            <div className="bg-[#051329] border border-[#183B70] rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold text-[#BAC7DC] uppercase tracking-wider block mb-1">
                  Endereço para Jogar (Minecraft Java)
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-[#FFD633] select-all">
                  {servidor.ipConexao}:{servidor.portaConexao}
                </span>
              </div>

              <button
                onClick={handleCopiarIP}
                className="px-4 py-2 bg-[#FFD633] hover:bg-[#ffe066] text-[#07152F] font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
              >
                {copiado ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>IP Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar IP</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Botões de Ação Rápida */}
          <div className="mt-6 pt-5 border-t border-[#183B70]/70 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleComando('iniciar')}
              disabled={executandoAcao || servidor.status === 'online'}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Iniciar</span>
            </button>

            <button
              onClick={() => handleComando('reiniciar')}
              disabled={executandoAcao}
              className="px-4 py-2 bg-[#091D3E] hover:bg-[#0E2C5D] border border-[#183B70] disabled:opacity-40 text-[#BAC7DC] hover:text-[#F5F7FF] text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>

            <button
              onClick={() => handleComando('parar')}
              disabled={executandoAcao || servidor.status === 'offline'}
              className="px-4 py-2 bg-red-950/80 hover:bg-red-900 border border-red-800/60 disabled:opacity-40 text-red-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Parar</span>
            </button>

            {/* Botão de Destaque: Acesso ao Crafty Controller */}
            <a
              href={servidor.craftyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => retroAudio.playCoin()}
              className="ml-auto px-4 py-2 bg-[#168CFF] hover:bg-[#389eff] text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir Console Completo (Crafty)</span>
            </a>
          </div>

        </div>

        {/* Grid: Métricas e Configurações */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card: Jogadores */}
          <div className="bg-[#081B3A] border border-[#183B70] rounded-xl p-5 shadow-md flex items-center gap-4">
            <div className="p-3 bg-[#0F3572] text-[#FFD633] rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#BAC7DC] uppercase">Jogadores Online</span>
              <p className="text-xl font-bold text-[#F5F7FF] font-mono">{servidor.jogadoresOnline}</p>
            </div>
          </div>

          {/* Card: RAM */}
          <div className="bg-[#081B3A] border border-[#183B70] rounded-xl p-5 shadow-md flex items-center gap-4">
            <div className="p-3 bg-[#0F3572] text-[#168CFF] rounded-lg">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#BAC7DC] uppercase">Memória RAM</span>
              <p className="text-xl font-bold text-[#F5F7FF] font-mono">{servidor.usoRam}</p>
            </div>
          </div>

          {/* Card: CPU */}
          <div className="bg-[#081B3A] border border-[#183B70] rounded-xl p-5 shadow-md flex items-center gap-4">
            <div className="p-3 bg-[#0F3572] text-emerald-400 rounded-lg">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#BAC7DC] uppercase">Uso de Processador</span>
              <p className="text-xl font-bold text-[#F5F7FF] font-mono">{servidor.usoCpu}</p>
            </div>
          </div>

        </div>

        {/* Formulário de Configurações Rápidas */}
        <div className="bg-[#081B3A] border border-[#183B70] rounded-xl p-6 shadow-md">
          <h2 className="text-base font-bold text-[#F5F7FF] mb-4 flex items-center gap-2 font-display">
            <Shield className="w-4 h-4 text-[#FFD633]" />
            Configurações Básicas do Servidor
          </h2>

          <form onSubmit={handleSalvarConfig} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#BAC7DC] mb-1.5">
                Mensagem do Servidor (MOTD)
              </label>
              <input
                type="text"
                value={novoMotd}
                onChange={(e) => setNovoMotd(e.target.value)}
                placeholder="Ex: Servidor dos Amigos - Venham jogar!"
                className="w-full px-3.5 py-2 text-sm text-[#F5F7FF] bg-[#051329] border border-[#183B70] rounded-lg focus:outline-none focus:border-[#FFD633]"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="whitelist"
                checked={novaWhitelist}
                onChange={(e) => setNovaWhitelist(e.target.checked)}
                className="w-4 h-4 rounded border-[#183B70] text-[#FFD633] focus:ring-[#FFD633] bg-[#051329]"
              />
              <label htmlFor="whitelist" className="text-xs text-[#BAC7DC] font-medium cursor-pointer">
                Ativar Whitelist (Somente jogadores autorizados podem entrar)
              </label>
            </div>

            <button
              type="submit"
              disabled={salvandoConfig}
              className="py-2 px-5 bg-[#FFD633] hover:bg-[#ffe066] text-[#07152F] font-bold text-xs rounded-lg transition-all cursor-pointer"
            >
              {salvandoConfig ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>

      </main>
    </div>
  );
};
