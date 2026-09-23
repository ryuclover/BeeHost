import { ArrowRight, Check } from 'lucide-react';
import { useLocale } from '../i18n/useLocale';

/** Original pixel scenes explain the choices, rather than decorate the text. */
function AdventureScene({ resources = false }: { resources?: boolean }) {
  const { t } = useLocale();
  return <div className={`adventure-scene ${resources ? 'scene-resources' : 'scene-worlds'}`} aria-hidden="true">
    <svg viewBox="0 0 400 280" fill="none" shapeRendering="crispEdges" focusable="false">
      <path fill="#28394a" d="M32 48h4v4h-4zM346 30h4v4h-4zM302 218h4v4h-4zM70 210h4v4h-4zM184 22h4v4h-4z" />
      <path fill="#b8ac78" d="M326 65h4v8h8v4h-8v8h-4v-8h-8v-4h8zM58 123h4v4h4v4h-4v4h-4v-4h-4v-4h4z" />
      <path fill="#243a3b" d="M48 218h304v8H48zM82 226h240v8H82zM116 234h176v8H116z" />
      {resources ? <>
        <path fill="#293c4e" d="M84 196h232v22H84zM102 218h192v16H102zM128 234h140v12H128z" />
        <path fill="#5a7890" d="M84 196h232v8H84z" />
        <path fill="#101923" d="M144 42h108v158H144z" />
        <path fill="#b7b391" d="M152 48h92v6h-92z" />
        <path fill="#405568" d="M152 54h92v140h-92z" />
        <path fill="#202e3f" d="M160 62h76v32h-76zM160 104h76v32h-76zM160 146h76v32h-76z" />
        <path fill="#94c5a0" d="M170 74h8v8h-8zM170 116h8v8h-8zM170 158h8v8h-8z" />
        <path fill="#7690a0" d="M190 74h36v4h-36zM190 82h28v4h-28zM190 116h36v4h-36zM190 124h28v4h-28zM190 158h36v4h-36zM190 166h28v4h-28z" />
        <path fill="#e4c777" d="M178 188h42v6h-42z" />
        <path fill="#534766" d="M90 148h34v44H90zM268 130h38v62h-38z" />
        <path fill="#a799c4" d="M90 148h34v8H90zM268 130h38v8h-38z" />
        <use href="/pixel-world.svg#crystals" x="258" y="76" width="55" height="55" />
        <use href="/pixel-world.svg#lantern" x="83" y="98" width="46" height="50" />
        <image href="/bee-pixel.svg" x="264" y="30" width="65" height="60" />
      </> : <>
        <path stroke="#6c7a6b" strokeWidth="3" strokeDasharray="4 8" d="M94 178h34v-24h43m61 0h44v-34h22" />
        <path fill="#547454" d="M36 168h94v12H36zM150 150h108v12H150zM280 128h92v12h-92z" />
        <path fill="#6e5142" d="M44 180h78v12H44zM54 192h56v14H54zM70 206h24v10H70zM158 162h92v16h-92zM174 178h60v16h-60zM192 194h24v12h-24zM288 140h76v14h-76zM302 154h48v14h-48zM318 168h18v12h-18z" />
        <path fill="#8fb475" d="M40 168h38v4H40zM154 150h52v4h-52zM284 128h38v4h-38z" />
        <use href="/pixel-world.svg#terraria" x="40" y="96" width="82" height="76" />
        <image href="/minecraft-block.svg" x="155" y="54" width="98" height="98" />
        <use href="/pixel-world.svg#v-rising" x="284" y="46" width="84" height="84" />
        <use href="/pixel-world.svg#mushrooms" x="113" y="197" width="43" height="43" />
        <use href="/pixel-world.svg#sprig" x="246" y="190" width="42" height="48" />
        <image href="/bee-pixel.svg" x="67" y="28" width="58" height="53" />
      </>}
    </svg>
    <span className="scene-label">{resources ? t("Recursos claros. Escolhas suas.") : t("Muitos mundos. A sua próxima história.")}</span>
  </div>;
}

export function AdventureStory() {
  const { t, withLocale } = useLocale();
  return <section className="adventure-story" id="how-it-works" aria-labelledby="adventure-title">
    <div className="story-intro"><span className="eyebrow">{t("Uma hospedagem com espírito de aventura")}</span><h2 id="adventure-title">{t("A parte difícil deveria ser")}<br />{' '}<span>{t("escolher o próximo jogo.")}</span></h2><p>{t("Da primeira ideia à configuração, cada escolha tem seu lugar.")}</p></div>
    <article className="story-chapter">
      <AdventureScene />
      <div className="chapter-copy"><span className="eyebrow">{t("01 · Um mundo para chamar de seu")}</span><h3>{t("Comece pela aventura.")}<br />{' '}{t("A configuração vem depois.")}</h3><p>{t("Uma vila no Minecraft, uma expedição em Valheim ou um novo mundo em Terraria. Escolha o que anima seu grupo e leve essa escolha até o seu plano.")}</p><ul><li><Check size={17} />{t("Encontre o jogo pelo nome ou pela categoria.")}</li><li><Check size={17} />{t("Veja uma sugestão inicial de recursos.")}</li></ul><a className="text-link" href="#games">{t("Encontrar o mundo do meu grupo")}<ArrowRight size={17} /></a></div>
    </article>
    <article className="story-chapter chapter-reverse">
      <AdventureScene resources />
      <div className="chapter-copy"><span className="eyebrow">{t("02 · Sem enigmas nas especificações")}</span><h3>{t("Menos adivinhação.")}<br />{' '}{t("Mais clareza para escolher.")}</h3><p>{t("Memória para o mundo, espaço para os arquivos e o preço completo à vista. Compare os planos sabendo o que muda em cada um.")}</p><ul><li><Check size={17} />{t("Compare RAM, processamento e armazenamento.")}</li><li><Check size={17} />{t("Confira o total mensal ou anual antes de salvar.")}</li></ul><a className="text-link" href="#plans">{t("Comparar meus planos")}<ArrowRight size={17} /></a></div>
    </article>
    <div className="story-footnote"><img src="/bee-pixel.svg" alt="" width="38" height="35" /><p><strong>{t("Sem pressa de decidir.")}</strong> {t("Salve sua configuração e retome depois pela")} <a href={withLocale("/support.html")}>{t("Central de ajuda")}</a>.</p></div>
  </section>;
}

