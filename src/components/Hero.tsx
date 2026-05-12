/** @jsxImportSource react */
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const PILLS = ['— Roermond e.o.', '— Persoonlijke aanpak'] as const;

interface Props {
  toysSrc: string;
}

export default function Hero({ toysSrc }: Props) {
  return (
    <section
      id="top"
      className="relative flex min-h-[90vh] flex-col items-center overflow-hidden px-6 py-12 md:flex-row md:px-12 lg:px-24"
    >
      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[10%] -top-[10%] -z-10 h-[500px] w-[500px] rounded-full bg-accent/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[10%] -right-[5%] -z-10 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl"
      />

      {/* Left column */}
      <div className="relative z-10 w-full space-y-7 md:w-1/2">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block -rotate-2 text-[22px] text-accent"
          style={{ fontFamily: 'var(--font-script)' }}
        >
          Voor jongeren en gezinnen
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-serif text-[44px] font-normal leading-[1.05] tracking-[-0.01em] md:text-[60px] lg:text-[76px]"
          style={{ maxWidth: '14ch' }}
        >
          Jeugdzorg met{' '}
          <span className="relative inline-block whitespace-nowrap italic text-accent">
            hart
            <svg
              aria-hidden="true"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
              className="absolute -bottom-1 left-0 -z-10 h-3 w-full text-accent/40"
            >
              <path
                d="M0 5 Q 50 10 100 5"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>{' '}
          en toewijding.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-md text-[17px] leading-[1.6] text-ink-muted md:text-[18px]"
        >
          Al jarenlang werk ik met toewijding in de jeugdzorg. Dit is het vak dat ik
          ken &mdash; waar mijn hart ligt, en waar ik mij dagelijks voor inzet.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-2 pt-2"
        >
          {PILLS.map((label, idx) => (
            <motion.span
              key={label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + idx * 0.08, duration: 0.4 }}
              className="rounded-full border border-rule bg-secondary/40 px-3 py-1.5 text-[12px] font-medium text-ink-muted"
            >
              {label}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Right column */}
      <div className="relative mt-14 w-full md:mt-0 md:w-1/2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative z-10"
        >
          <img
            src={toysSrc}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="aspect-[4/5] w-full rotate-0 transform rounded-[3rem] object-cover shadow-2xl md:aspect-[4/3] md:rotate-3"
          />

          {/* Floating card A — pull quote, bottom-left */}
          <motion.figure
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute -bottom-8 -left-2 max-w-[230px] rounded-2xl border border-rule bg-card p-4 shadow-lg md:-bottom-10 md:-left-8 md:p-5"
          >
            <span
              aria-hidden="true"
              className="mr-1 align-top text-3xl leading-none italic text-accent"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              &ldquo;
            </span>
            <blockquote className="inline font-serif text-[17px] italic leading-[1.35] text-ink md:text-[19px]">
              Écht verschil maken voor jongeren en gezinnen.
            </blockquote>
          </motion.figure>

          {/* Floating card B — location, top-right */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -top-6 -right-2 flex max-w-[200px] items-center gap-3 rounded-2xl border border-rule bg-card p-3 shadow-lg md:-top-8 md:-right-8 md:p-4"
          >
            <span className="rounded-full bg-accent/10 p-2 text-accent">
              <MapPin size={18} />
            </span>
            <div className="text-[12px] leading-tight">
              <p className="font-serif text-[14px] italic text-ink">Roermond e.o.</p>
              <p className="text-ink-muted">Limburg-Noord</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
