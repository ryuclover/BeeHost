# Beehost

Frontend React + TypeScript + Vite, em português, com seis entradas HTML.

## Executar

- `npm install`
- `npm run dev -- --host 127.0.0.1`
- `npm run build` para verificar tipos e gerar `dist`.
- `npm run lint` para análise estática.

## Experiência

A página inicial apresenta o catálogo e a comparação de planos. Escolher um jogo abre `/plans.html?game=<id>`, preservando a seleção. Os cartões mostram valores em USD e, no período anual, o total dos 12 meses. A revisão usa um diálogo nativo, com Escape, foco contido e retorno ao elemento de origem.

O visitante pode salvar uma configuração no armazenamento local do navegador e recuperá-la pela Central de ajuda. Não há backend, autenticação, pagamento, envio de tickets ou provisionamento. A interface não simula sucesso desses serviços.

## Organização

- `src/components/Experience.tsx`: experiência compartilhada, navegação e estados interativos.
- `src/pages/`: entradas das seis páginas.
- `src/data/catalog.ts`: catálogo, sugestões iniciais e perguntas frequentes.
- `src/data/plans.ts`: valores e especificações existentes.
- `src/index.css`: estilos e adaptações para telas menores, teclado e movimento reduzido.

Os componentes anteriores permanecem no projeto, mas não são usados pelas páginas atuais. O lint ainda reporta dois avisos de imutabilidade no antigo Header.

## Antes de disponibilizar contratação

Validar catálogo, compatibilidade e dimensionamento de cada jogo com a infraestrutura real; confirmar valores e políticas comerciais; integrar conta, pagamento, suporte e provisionamento. As sugestões de plano são apenas referências iniciais e não garantias de capacidade.

## Verificação manual

- Busca por nome, filtros e recuperação do estado sem resultados.
- Seleção de jogo mantida ao chegar aos planos.
- Alternância mensal/anual e total da revisão (Explorer anual: US$ 95,88).
- Salvamento e recuperação da configuração em outra página.
- Navegação móvel e páginas sem transbordamento horizontal em 320 px.
- Revisão visual em desktop e 390 px; fechamento do diálogo por Escape.

## Idiomas (PT / EN)

As seis páginas usam o mesmo provedor de idioma e as traduções em `src/i18n/en.json`. Português é o texto-base. O seletor no cabeçalho traduz conteúdo, acessibilidade, título, descrição e formatação de valores sem reiniciar o estado da página.

Ordem de seleção: `?lang=pt` ou `?lang=en` em um link explícito; escolha manual salva em `localStorage`; primeiro idioma PT/EN na lista de preferências do navegador; inglês como alternativa. Não é usada geolocalização, consulta de IP ou serviço de tradução externo. Os links internos carregam o idioma, preservando a escolha na navegação mesmo se o armazenamento estiver bloqueado. Nesse caso, a preferência não persiste em uma nova visita sem o parâmetro de idioma.

Preços continuam em USD: traduzir a página não converte a moeda. `npm test` valida resolução do idioma, links, interpolação, valores e cobertura de tradução. Os testes utilizam o suporte a TypeScript do Node 22.18+.
