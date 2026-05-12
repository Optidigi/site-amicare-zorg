/** @jsxImportSource react */
import { motion } from 'framer-motion';

export default function OverMij() {
  return (
    <section
      id="over"
      className="px-6 py-20 md:px-12 md:py-24 lg:px-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center"
      >
        <span
          className="inline-block -rotate-2 text-[20px] text-accent"
          style={{ fontFamily: 'var(--font-script)' }}
        >
          Over mij
        </span>
        <h2 className="mt-3 font-serif text-[34px] leading-[1.1] tracking-[-0.01em] md:text-[44px]">
          Het vak waar mijn <span className="italic text-accent">hart ligt</span>.
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mx-auto mt-10 max-w-prose space-y-6 text-[17px] leading-[1.6] text-ink/90 md:text-[18px]"
      >
        <p>
          Tegelijk blijf ik mijzelf graag ontwikkelen, en sta ik open voor nieuwe
          uitdagingen en opdrachten binnen het werkveld.
        </p>
        <p>
          Naast mijn werk ben ik moeder, en geniet ik van het drukke, gezellige
          gezinsleven. De combinatie van werk en gezin maakt mijn dagen dynamisch
          {' '}&mdash; en waardevol.
        </p>
      </motion.div>
    </section>
  );
}
