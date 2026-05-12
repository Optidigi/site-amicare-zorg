/** @jsxImportSource react */
import { motion } from 'framer-motion';

interface Props {
  bedroomSrc: string;
}

export default function WatTelt({ bedroomSrc }: Props) {
  return (
    <section
      id="wat-telt"
      className="relative isolate overflow-hidden bg-secondary/40 px-6 py-24 md:px-12 md:py-28"
    >
      {/* Backdrop image — low opacity */}
      <img
        aria-hidden="true"
        src={bedroomSrc}
        alt=""
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.12]"
      />
      {/* Cream gradient overlay to keep contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-bg/70 via-bg/50 to-bg/70"
      />
      {/* Soft accent blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[20%] -right-[10%] -z-10 h-[300px] w-[300px] rounded-full bg-accent/10 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-3xl text-center"
      >
        <span
          className="inline-block -rotate-2 text-[20px] text-accent"
          style={{ fontFamily: 'var(--font-script)' }}
        >
          Wat telt
        </span>

        <h3 className="mt-5 font-serif text-[32px] italic leading-[1.2] tracking-[-0.005em] text-ink md:text-[48px]">
          &ldquo;Vertrouwen ontstaat in de tijd, niet in &eacute;&eacute;n gesprek.&rdquo;
        </h3>

        <p className="mx-auto mt-7 max-w-prose text-[16px] leading-[1.7] text-ink-muted md:text-[17px]">
          Daarom werk ik graag in trajecten waar continuïteit en kleine stappen
          het echte werk doen &mdash; voor jongeren, voor gezinnen, en voor de
          mensen om hen heen.
        </p>
      </motion.div>
    </section>
  );
}
