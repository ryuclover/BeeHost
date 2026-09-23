/** Static, decorative SVG sprites: no motion, focus targets or pointer events. */
export function PixelSprite({ name, className = '' }: { name: string; className?: string }) {
  return <svg className={className} width="64" height="64" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><use href={`/pixel-world.svg#${name}`} /></svg>;
}

export function SectionScenery({ variant = 'forest' }: { variant?: 'forest' | 'cave' | 'camp' }) {
  const motifs = { forest: ['sprig', 'mushrooms'], cave: ['sparkle', 'crystals'], camp: ['sprig', 'lantern'] };
  return <div className={`section-scenery scenery-${variant}`} aria-hidden="true"><PixelSprite name={motifs[variant][0]} /><span className="pixel-trail" /><PixelSprite name={motifs[variant][1]} /></div>;
}

export function PixelBackdrop() {
  return <div className="pixel-backdrop" aria-hidden="true">
    <PixelSprite name="sprig" className="world-motif motif-one" />
    <PixelSprite name="sparkle" className="world-motif motif-two" />
    <PixelSprite name="mushrooms" className="world-motif motif-three" />
    <PixelSprite name="crystals" className="world-motif motif-four" />
    <PixelSprite name="lantern" className="world-motif motif-five" />
    <PixelSprite name="sprig" className="world-motif motif-six" />
  </div>;
}
