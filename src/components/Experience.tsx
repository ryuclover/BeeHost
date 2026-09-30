import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Cpu, Gamepad2, HardDrive, HelpCircle, Menu, Search, Server, Settings2, ShieldCheck, Users, X } from 'lucide-react';
import { PLANS, type Plan } from '../data/plans';
import { GAMES, FAQ } from '../data/catalog';
import { PixelBackdrop, PixelSprite, SectionScenery } from './PixelScenery';
import { AdventureStory } from './AdventureStory';
import { CheckoutPixModal } from './pricing/CheckoutPixModal';
import { LocaleProvider } from '../i18n/LocaleProvider';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';
import { useLocale } from '../i18n/useLocale';
import { localeTag, translate } from '../i18n/core';

type Page = 'home' | 'games' | 'plans' | 'features' | 'community' | 'support';
const descriptions = ['Para começar pequeno', 'Para reunir os amigos', 'Para mundos com mais possibilidades', 'Para projetos mais exigentes'];
const links: { page: Page; label: string; href: string }[] = [
  { page: 'games', label: 'Jogos', href: '/games.html' },
  { page: 'plans', label: 'Planos', href: '/plans.html' },
  { page: 'features', label: 'Como funciona', href: '/features.html' },
  { page: 'support', label: 'Ajuda', href: '/support.html' },
  { page: 'support', label: 'Área do Cliente', href: '/painel-cliente.html' },
];

function Wordmark() {
  return <span className="wordmark"><span>Bee</span><span className="wordmark-honey">host</span></span>;
}

function Brand() {
  const { t, withLocale } = useLocale();
  return <a className="brand" href={withLocale("/")} aria-label={t("Beehost, início")}><img className="brand-bee" src="/bee-pixel.svg" alt="" width="44" height="40" /><Wordmark /></a>;
}

export function Experience({ page = 'home' }: { page?: Page }) {
  return <LocaleProvider><ExperienceContent page={page} /></LocaleProvider>;
}

function ExperienceContent({ page }: { page: Page }) {
  const { t, withLocale, money, locale } = useLocale();
  useEffect(() => {
    const titles: Record<Page, string> = { home: 'Seu mundo. Seus amigos.', games: 'Escolha seu jogo', plans: 'Compare os planos', features: 'Como funciona', community: 'Jogue em comunidade', support: 'Central de ajuda' };
    document.title = `Beehost | ${translate(locale, titles[page])}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', translate(locale, 'Encontre seu jogo, compare planos de hospedagem e escolha a configuração para jogar com seus amigos na Beehost.'));
  }, [locale, page]);
  const params = new URLSearchParams(window.location.search);
  const initialGame = GAMES.find(g => g.id === params.get('game'))?.id ?? '';
  const [game, setGame] = useState(initialGame);
  const [annual, setAnnual] = useState(params.get('billing') === 'annual');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [menu, setMenu] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPixModal, setShowPixModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const selectedGame = GAMES.find(g => g.id === game);
  const filtered = GAMES.filter(g => `${g.name} ${g.category} ${t(g.category)}`.toLocaleLowerCase(localeTag(locale)).includes(query.trim().toLocaleLowerCase(localeTag(locale))) && (category === 'Todos' || g.category === category));

  useEffect(() => {
    if (!selectedPlan || showPixModal) {
      if (dialog.current?.open) dialog.current.close();
      return;
    }
    const el = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    el?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { el?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, [selectedPlan, showPixModal]);

  useEffect(() => {
    if (saved) dialog.current?.querySelector<HTMLElement>('#config-title')?.focus();
  }, [saved]);

  function saveConfiguration() {
    try {
      localStorage.setItem('beehost-configuration', JSON.stringify({ game, plan: selectedPlan?.id, billing: annual ? 'annual' : 'monthly' }));
      setSaved(true);
    } catch { setStorageError(true); }
  }
  function restoreConfiguration() {
    try {
      const raw = localStorage.getItem('beehost-configuration');
      if (!raw) { setStorageError(true); return; }
      const config = JSON.parse(raw);
      const plan = PLANS.find(p => p.id === config.plan);
      if (!plan || !GAMES.some(g => g.id === config.game)) { setStorageError(true); return; }
      setGame(config.game); setAnnual(config.billing === 'annual'); setSelectedPlan(plan); setSaved(false); setStorageError(false);
    } catch { setStorageError(true); }
  }

  const visibleGames = page === 'home' && category === 'Todos' && !query ? filtered.slice(0, 4) : filtered;
  const catalog = <section className="section" id="games" aria-labelledby="games-heading"><SectionScenery />
    <div className="section-heading"><div><span className="eyebrow">{t("O próximo mundo é de vocês")}</span><h2 id="games-heading">{t("Qual vai ser o jogo de hoje?")}</h2><p>{t("Escolha seu jogo. A gente ajuda com o próximo passo.")}</p></div>{page === 'home' && <a className="text-link" href={withLocale("/games.html")}>{t("Explorar jogos")} <ArrowUpRight size={17} /></a>}</div>
    <div className="catalog-tools"><div className="filters" aria-label={t("Filtrar por categoria")}>{['Todos', 'Sobrevivência', 'Aventura', 'Sandbox'].map(c => <button key={c} aria-pressed={c === category} onClick={() => setCategory(c)}>{t(c)}</button>)}</div><label className="search"><Search size={18} /><span className="sr-only">{t("Buscar jogo")}</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t("Buscar um jogo...")} type="search" /></label></div>
    <p className="sr-only" role="status" aria-live="polite">{visibleGames.length === 1 ? t("1 jogo encontrado.") : t("{count} jogos encontrados.", { count: visibleGames.length })}</p><div className="game-grid">{visibleGames.map(g => <a href={withLocale(`/plans.html?game=${g.id}`)} className={`game-card ${g.color}`} key={g.id}><div className="game-art" aria-hidden="true"><span className="game-symbol">{g.id === 'minecraft' ? <img src="/minecraft-block.svg" alt="" width="96" height="96" /> : <PixelSprite name={g.id} />}</span><span className="terrain terrain-back" /><span className="terrain terrain-front" /></div><div className="game-copy"><span className="game-category">{g.category}</span><h3>{g.name}<ArrowUpRight size={19} /></h3><p>{t(g.description)}</p><span className="game-price">{t("Plano sugerido:")} <strong>{money(PLANS[g.plan]?.monthlyPrice ?? 19.9)}</strong> {t("/mês")}</span></div></a>)}</div>
    {filtered.length === 0 && <div className="empty" role="status"><Search size={28} /><h3>{t("Nenhum jogo encontrado")}</h3><p>{t("Tente outro nome ou veja todas as categorias.")}</p><button className="button secondary" onClick={() => { setQuery(''); setCategory('Todos'); }}>{t("Limpar filtros")}</button></div>}
    <p className="section-note">{t("Não encontrou seu jogo?")} <a href={withLocale("/support.html")}>{t("Veja como escolher sua configuração")} <ArrowRight size={14} /></a></p>
  </section>;

  const pricing = <section className="section pricing-section" id="plans" aria-labelledby="plans-heading"><SectionScenery variant="cave" />
    <div className="section-heading"><div><span className="eyebrow">{t("Espaço para cada aventura")}</span><h2 id="plans-heading">{t("Seu grupo. Seu ritmo. Seu plano.")}</h2><p>{t("Compare os recursos e escolha com tranquilidade. Valores em dólar americano.")}</p></div><div className="billing" aria-label={t("Período de cobrança")}><button aria-pressed={!annual} onClick={() => setAnnual(false)}>{t("Mensal")}</button><button aria-pressed={annual} onClick={() => setAnnual(true)}>{t("Anual")} <span>{t("≈20% menos")}</span></button></div></div>
    {page === 'plans' && <div className="game-selection"><Gamepad2 size={23} /><label htmlFor="plan-game">{t("Seu jogo")}<select id="plan-game" value={game} onChange={e => { setGame(e.target.value); const url = new URL(window.location.href); if (e.target.value) url.searchParams.set('game', e.target.value); else url.searchParams.delete('game'); window.history.replaceState(null, '', url); }}><option value="">{t("Escolha um jogo")}</option>{GAMES.map(g => <option value={g.id} key={g.id}>{g.name}</option>)}</select></label><p>{selectedGame && PLANS[selectedGame.plan] ? t("O {plan} é um ponto de partida para {game}. Ajuste conforme seu mundo e seus mods.", { plan: PLANS[selectedGame.plan].name, game: selectedGame.name }) : t("Escolha um jogo para ver uma sugestão inicial de plano.")}</p></div>}
    <div className="plan-grid">{PLANS.map((plan, index) => { const recommended = selectedGame ? selectedGame.plan === index : index === 1; return <article className={`plan-card ${recommended ? 'recommended' : ''}`} key={plan.id}>{recommended && <span className="plan-badge">{selectedGame ? t("Sugestão para {game}", { game: selectedGame.name }) : t("Para jogar com os amigos")}</span>}<div className="plan-top"><span className="plan-icon"><Server size={20} /></span><h3>{plan.name}</h3><p>{t(descriptions[index])}</p></div><div className="price">{money(annual ? plan.yearlyPrice : plan.monthlyPrice)}<span>{t("/mês")}</span></div><p className="billing-detail">{annual ? t("{price} cobrados por ano", { price: money(Math.round(plan.yearlyPrice * 1200) / 100) }) : t("Cobrança mensal")}</p><button className={`button ${recommended ? 'primary' : 'secondary'}`} onClick={() => { setSelectedPlan(plan); setSaved(false); setStorageError(false); }}>{t("Escolher {plan}", { plan: plan.name })}<ArrowRight size={16} /></button><ul className="plan-specs"><li><Cpu size={16} /><strong>{plan.ram}</strong></li><li><HardDrive size={16} />{plan.storage}</li><li><Check size={16} />{plan.cpu.replace(' Extreme', '')}</li></ul></article>; })}</div>
    <p className="section-note"><HelpCircle size={16} /> {t("RAM é a memória disponível para seu mundo, jogadores e mods.")} <a href={withLocale("/support.html")}>{t("Entenda como escolher")}</a></p>
  </section>;

  const steps = <section className="section" id="how-it-works"><SectionScenery variant="camp" /><div className="section-heading"><div><span className="eyebrow">{t("Menos configuração, mais diversão")}</span><h2>{t("Da ideia ao seu próximo mundo.")}</h2><p>{t("Uma escolha de cada vez, sem precisar entender de infraestrutura.")}</p></div></div><div className="steps-grid">{[
    { icon: Gamepad2, title: t("Encontre seu jogo"), text: t("Comece pelo que vocês querem jogar, não por uma lista de especificações.") },
    { icon: Settings2, title: t("Escolha seu espaço"), text: t("Compare memória, armazenamento e preço. O total fica visível desde o início.") },
    { icon: Users, title: t("Revise com calma"), text: t("Confira o jogo e o plano e salve sua configuração para retomar depois.") },
  ].map((step, i) => <article key={step.title}><div className="step-line"><step.icon size={23} /><span>0{i + 1}</span></div><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></section>;
  const faq = <section className="section faq-section" id="faq"><div><span className="eyebrow">{t("Pode perguntar")}</span><h2>{t("Vamos simplificar")}<br />{' '}{t("as dúvidas também.")}</h2><p>{t("O que você precisa saber")}<br />{' '}{t("antes de escolher.")}</p></div><div className="faq-list">{FAQ.map(([title, answer]) => <details key={title}><summary>{t(title)}<ChevronDown size={19} /></summary><p>{t(answer)}</p></details>)}</div></section>;

  return <div className={`site ${page === 'home' ? 'home-experience' : ''}`}><PixelBackdrop /><a className="skip-link" href="#main">{t("Pular para o conteúdo")}</a><header className="site-header"><div className="container header-inner"><Brand /><nav aria-label={t("Navegação principal")} className={menu ? 'nav open' : 'nav'}>{links.map(link => <a aria-current={page === link.page ? 'page' : undefined} key={link.href} href={withLocale(link.href)}>{t(link.label)}</a>)}</nav><LanguageSwitcher /><a className="button primary header-cta" href={withLocale("/games.html")}>{t("Montar meu servidor")}<ArrowRight size={16} /></a><button className="menu-button" aria-expanded={menu} aria-label={menu ? t("Fechar menu") : t("Abrir menu")} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button></div></header>
    <main id="main" className="container">
      {page === 'home' && <><section className="hero-panel"><div className="hero-landscape" aria-hidden="true" /><div className="hero-copy"><span className="hero-tag"><span />{t("Bons jogos começam com boa companhia")}</span><div className="hero-brand" aria-label="Beehost"><img src="/bee-pixel.svg" alt="" width="72" height="66" /><Wordmark /></div><h1>{t("Seu mundo. Seus amigos.")}<br />{' '}<em>{t("O resto é com a gente.")}</em></h1><p>{t("Um lugar para construir, explorar e jogar juntos.")}<br className="desktop-break" /> {t("Encontre o servidor certo para a sua próxima aventura.")}</p><div className="hero-actions"><a className="button primary" href={withLocale("/games.html")}>{t("Encontrar meu jogo")}<ArrowRight size={18} /></a><a className="button hero-secondary" href="#plans">{t("Comparar planos")}</a></div><span className="hero-footnote">{t("Planos a partir de")} <strong>{money(4.99)}{t("/mês")}</strong> {t("· Valores em USD")}</span></div><div className="scene-caption"><span className="scene-icon"><img src="/bee-pixel.svg" alt="" width="38" height="35" /></span><div><strong>{t("O próximo capítulo é de vocês.")}</strong><span>{t("Escolham o mundo. Reúnam o grupo.")}</span></div></div></section><div className="benefit-strip"><span><Gamepad2 />{t("Seu jogo, seu espaço")}</span><span><Settings2 />{t("Escolhas sem complicação")}</span><span><ShieldCheck />{t("Preço claro desde o início")}</span><a href={withLocale("/features.html")}>{t("Conheça a experiência")}<ArrowUpRight size={16} /></a></div><nav className="chapter-nav" aria-label={t("Explore esta página")}><span className="chapter-nav-label">{t("Sua próxima aventura")}</span><a href="#games">{t("Jogos")}</a><a href="#how-it-works">{t("Como funciona")}</a><a href="#plans">{t("Planos")}</a><a href="#faq">{t("Dúvidas")}</a></nav>{catalog}<AdventureStory />{pricing}{faq}</>}
      {page === 'games' && <><div className="page-intro"><span className="eyebrow">{t("Encontre sua próxima aventura")}</span><h1>{t("O mundo é melhor")}<br />{' '}{t("quando a gente joga junto.")}</h1><p>{t("Busque pelo nome ou explore por categoria. Sua escolha segue com você até o plano.")}</p></div>{catalog}</>}
      {page === 'plans' && <><div className="page-intro compact"><span className="eyebrow">{t("01 Jogo")} <ArrowRight size={13} /> <b>{t("02 Plano")}</b> <ArrowRight size={13} /> {t("03 Revisão")}</span><h1>{t("Um plano que combina com vocês.")}</h1><p>{t("Sem adivinhação: veja os recursos e o valor total antes de escolher.")}</p></div>{pricing}{faq}</>}
      {page === 'features' && <><div className="page-intro"><span className="eyebrow">{t("Como funciona")}</span><h1>{t("Você cuida da aventura.")}<br />{' '}{t("A escolha fica simples.")}</h1><p>{t("Um caminho curto do seu jogo favorito à configuração que faz sentido para o grupo.")}</p></div>{steps}<section className="resource-panel"><div><span className="eyebrow">{t("Entenda o que está escolhendo")}</span><h2>{t("Especificações com significado.")}</h2><p>{t("Mais recursos nem sempre são necessários. Comece pelo tamanho do seu projeto.")}</p></div><div>{[[t("Memória RAM"), t("Mantém o mundo e suas atividades em funcionamento. Mais mods e jogadores podem aumentar o consumo.")], [t("Armazenamento NVMe"), t("É o espaço para os arquivos do jogo, seus mundos e demais dados.")], [t("Processamento (vCPU)"), t("Executa as tarefas do servidor. A necessidade varia conforme o jogo e a atividade do mundo.")]].map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>{faq}</>}
      {page === 'community' && <><div className="page-intro"><span className="eyebrow">{t("Jogar é compartilhar")}</span><h1>{t("O melhor do seu mundo")}<br />{' '}{t("é quem está nele.")}</h1><p>{t("Planejem o jogo e os recursos juntos, antes de começar a aventura.")}</p></div>{steps}{catalog}</>}
      {page === 'support' && <><div className="page-intro"><span className="eyebrow">{t("Central de ajuda")}</span><h1>{t("Em qual parte podemos ajudar?")}</h1><p>{t("Encontre respostas sobre jogos, recursos e valores, sem sair do seu caminho.")}</p></div><div className="help-grid"><a href={withLocale("/games.html")}><Gamepad2 /><h3>{t("Escolher um jogo")}</h3><p>{t("Explore as opções do catálogo.")}</p><ArrowRight /></a><a href={withLocale("/features.html")}><Cpu /><h3>{t("Entender os recursos")}</h3><p>{t("Saiba o que RAM, vCPU e NVMe significam.")}</p><ArrowRight /></a><a href={withLocale("/plans.html")}><Server /><h3>{t("Comparar os planos")}</h3><p>{t("Confira os valores mensais e anuais.")}</p><ArrowRight /></a></div>{faq}<section className="saved-panel"><div><h2>{t("Já salvou uma configuração?")}</h2><p>{t("Retome o jogo e o plano salvos neste navegador.")}</p></div><button className="button secondary" onClick={restoreConfiguration}>{t("Retomar configuração")}<ArrowRight size={17} /></button>{storageError && !selectedPlan && <p className="form-message" role="status">{t("Não foi possível recuperar uma configuração.")} <a href={withLocale("/games.html")}>{t("Comece escolhendo seu jogo.")}</a></p>}</section></>}
      <section className="closing-cta"><div><span className="eyebrow">{t("Bora reunir o grupo?")}</span><h2>{t("A próxima aventura começa aqui.")}</h2></div><a className="button primary" href={withLocale("/games.html")}>{t("Escolher meu jogo")}<ArrowRight size={18} /></a></section>
    </main><footer className="site-footer"><div className="container footer-inner"><div><Brand /><p>{t("Um lugar para jogar juntos.")}</p></div><nav aria-label={t("Navegação do rodapé")}><a href={withLocale("/games.html")}>{t("Jogos")}</a><a href={withLocale("/plans.html")}>{t("Planos")}</a><a href={withLocale("/community.html")}>{t("Comunidade")}</a><a href={withLocale("/support.html")}>{t("Ajuda")}</a></nav><span>© {new Date().getFullYear()} Beehost</span></div></footer>
    {selectedPlan && <dialog ref={dialog} className="config-dialog" aria-labelledby="config-title" onCancel={() => setSelectedPlan(null)} onClick={e => { if (e.target === e.currentTarget) { const rect = e.currentTarget.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) setSelectedPlan(null); } }}><button className="dialog-close" aria-label={t("Fechar revisão")} onClick={() => setSelectedPlan(null)}><X size={21} /></button><span className="eyebrow">{saved ? t("Tudo anotado") : t("03 · Revisão da configuração")}</span><h2 id="config-title" tabIndex={-1}>{saved ? t("Sua aventura pode esperar.") : t("Tudo do seu jeito?")}</h2>{saved ? <><div className="saved-icon"><Check size={30} /></div><p role="status">{t("Configuração salva neste navegador. Você pode retomá-la na página de ajuda.")}</p><p className="notice">{t("Nenhum servidor foi criado e nenhuma cobrança foi feita.")}</p><button className="button primary full" onClick={() => setSelectedPlan(null)}>{t("Continuar explorando")}</button></> : <><p>{t("Confira sua escolha antes de salvar.")}</p><label className="field-label" htmlFor="checkout-game">{t("Jogo")}<select id="checkout-game" value={game} onChange={e => setGame(e.target.value)}><option value="">{t("Selecione seu jogo")}</option>{GAMES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select></label><dl className="summary"><div><dt>{t("Plano")}</dt><dd>{selectedPlan.name}</dd></div><div><dt>{t("Memória")}</dt><dd>{selectedPlan.ram}</dd></div><div><dt>{t("Armazenamento")}</dt><dd>{selectedPlan.storage}</dd></div><div><dt>{t("Período")}</dt><dd>{annual ? t("Anual · 12 meses") : t("Mensal")}</dd></div><div className="summary-total"><dt>{annual ? t("Total anual") : t("Total mensal")}</dt><dd>{money(annual ? Math.round(selectedPlan.yearlyPrice * 1200) / 100 : selectedPlan.monthlyPrice)}<small>{t("em dólar americano (USD)")}</small></dd></div></dl><p className="notice">{t("A contratação ainda não está disponível. Por enquanto, você pode salvar esta configuração para consultar depois.")}</p>{selectedGame && PLANS.indexOf(selectedPlan) < selectedGame.plan && <p className="notice">{t("Este plano está abaixo da sugestão inicial para {game}. Confira os requisitos do jogo e dos mods antes de contratar.", { game: selectedGame.name })}</p>}<button disabled={!game} className="button primary full" style={{ marginBottom: '8px' }} onClick={() => setShowPixModal(true)}>{t("Pagar com PIX e Ativar")}<ArrowRight size={17} /></button><button disabled={!game} className="button secondary full" onClick={saveConfiguration}>{t("Salvar configuração")}<ArrowRight size={17} /></button>{!game && <p className="field-hint">{t("Escolha um jogo para salvar a configuração.")}</p>}{storageError && <p role="alert" className="form-message">{t("Não foi possível salvar. O armazenamento do navegador pode estar bloqueado. Tente novamente.")}</p>}<button className="back-button" onClick={() => setSelectedPlan(null)}>{t("Voltar")}</button></>}</dialog>}
    {selectedPlan && <CheckoutPixModal isOpen={showPixModal} onClose={() => { setShowPixModal(false); setSelectedPlan(null); }} plano={{ id: selectedPlan.id, nome: selectedPlan.name, precoMensal: selectedPlan.monthlyPrice, precoAnual: selectedPlan.yearlyPrice, memoriaRam: selectedPlan.ram }} periodo={annual ? 'anual' : 'mensal'} />}
  </div>;
}







