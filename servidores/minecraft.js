/**
 * BeeHost - Lógica do Servidor Minecraft
 * Aqui fica tudo que configura o Minecraft e evita travamentos.
 */

export const VERSOES_MINECRAFT = [
  { versao: '1.20.4', recomendada: true, descricao: 'Mais estável e com menos lag' },
  { versao: '1.21.1', recomendada: false, descricao: 'Versão mais nova' },
  { versao: '1.16.5', recomendada: false, descricao: 'Clássica para mods' },
];

/**
 * Cria o arquivo de configuração básica do servidor (server.properties)
 */
export function criarConfiguracaoServidor(opcoes = {}) {
  const {
    porta = 25565,
    mensagemDoServidor = '§6§lBeeHost §8» §fServidor de Minecraft',
    limiteJogadores = 20,
    modoPirataLiberado = true,
  } = opcoes;

  return `server-port=${porta}
online-mode=${!modoPirataLiberado}
enable-rcon=false
motd=${mensagemDoServidor}
max-players=${limiteJogadores}
view-distance=8
simulation-distance=6
network-compression-threshold=256
spawn-protection=0
difficulty=easy
gamemode=survival
pvp=true
`;
}

/**
 * Calcula a memória certa para o servidor não travar
 */
export function calcularMemoria(ramEmMegabytes = 2048) {
  const minimo = Math.max(384, Math.floor(ramEmMegabytes * 0.5));
  const maximo = Math.floor(ramEmMegabytes * 0.85);

  return [
    `-Xms${minimo}M`,
    `-Xmx${maximo}M`,
    '-XX:+UseG1GC',
    '-XX:+ParallelRefProcEnabled',
    '-XX:MaxGCPauseMillis=200',
  ];
}
