/** @jsxImportSource react */
import { motion } from 'framer-motion';
import { Clock, Ear, HeartHandshake } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Principle = {
  icon: LucideIcon;
  label: string;
  body: string;
};

const PRINCIPLES: Principle[] = [
  {
    icon: Ear,
    label: 'Aandacht',
    body: 'Echt luisteren naar wat een jongere of een gezin op dat moment nodig heeft. Zonder aannames vooraf.',
  },
  {
    icon: HeartHandshake,
    label: 'Betrokkenheid',
    body: 'Naast mensen staan, niet erboven. Werken vanuit gelijkwaardigheid en vertrouwen.',
  },
  {
    icon: Clock,
    label: 'Continuïteit',
    body: 'Aanwezig blijven, ook als trajecten lang of ingewikkeld worden. De relatie als basis.',
  },
];

export default function Werkwijze() {
  return (
    <section
      id="werkwijze"
      className="relative bg-card/50 px-6 py-20 md:px-12 md:py-24 lg:px-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 space-y-3 text-center">
          <span
            className="inline-block -rotate-2 text-[20px] text-accent"
            style={{ fontFamily: 'var(--font-script)' }}
          >
            Drie dingen
          </span>
          <h2 className="font-serif text-[34px] leading-[1.1] tracking-[-0.01em] md:text-[44px]">
            Wat voor mij <span className="italic text-accent">centraal staat</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {PRINCIPLES.map(({ icon: Icon, label, body }, idx) => (
            <motion.article
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="overflow-hidden rounded-[2rem] border border-rule bg-card shadow-lg"
            >
              <div className="flex h-32 items-center justify-center bg-accent/8">
                <Icon size={44} className="text-accent" strokeWidth={1.5} />
              </div>
              <div className="space-y-3 p-7 text-center">
                <h3 className="font-serif text-[24px] leading-[1.2]">{label}</h3>
                <p className="text-[16px] leading-[1.6] text-ink-muted">{body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
