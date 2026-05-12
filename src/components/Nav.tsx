/** @jsxImportSource react */
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '#werkwijze', label: 'Werkwijze', id: 'werkwijze' },
  { href: '#over', label: 'Over', id: 'over' },
  { href: '#wat-telt', label: 'Wat telt', id: 'wat-telt' },
] as const;

const TRACKED_SECTIONS = ['top', 'werkwijze', 'over', 'wat-telt', 'contact'] as const;

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('top');

  useEffect(() => {
    const onScroll = () => {
      let current = 'top';
      for (const id of TRACKED_SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      aria-label="Hoofdnavigatie"
      className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-rule bg-bg/80 px-6 py-5 backdrop-blur-lg md:px-12 lg:px-20"
    >
      <a href="#top" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
        <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-accent" />
        <span className="font-sans text-[13px] font-medium uppercase tracking-[0.18em]">
          Amicare-Zorg
        </span>
      </a>

      {/* Desktop links */}
      <div className="hidden items-center gap-8 text-[13px] tracking-[0.04em] md:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className={`relative transition-colors ${
              activeSection === link.id ? 'text-ink' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {link.label}
            {activeSection === link.id && (
              <motion.span
                layoutId="navIndicator"
                aria-hidden="true"
                className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-accent"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </a>
        ))}
        <a
          href="#contact"
          className="rounded-full bg-accent px-5 py-2 text-[13px] font-medium text-bg shadow-sm transition-colors hover:bg-accent/90"
        >
          Contact
        </a>
      </div>

      {/* Mobile toggle */}
      <button
        type="button"
        aria-label={isOpen ? 'Menu sluiten' : 'Menu openen'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        className="rounded-full bg-accent/10 p-2 text-ink transition-colors hover:bg-accent/20 md:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-4 left-4 top-full z-50 mt-2 flex w-[calc(100%-2rem)] flex-col gap-5 rounded-2xl border border-rule bg-card p-6 shadow-2xl md:hidden"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.id}
                href={link.href}
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ delay: i * 0.06, duration: 0.2 }}
                className={`text-[15px] tracking-[0.04em] ${
                  activeSection === link.id ? 'text-ink font-medium' : 'text-ink-muted'
                }`}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: NAV_LINKS.length * 0.06 + 0.05, duration: 0.2 }}
              className="mt-2 inline-block rounded-full bg-accent px-5 py-3 text-center text-[14px] font-medium text-bg"
            >
              Contact
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
