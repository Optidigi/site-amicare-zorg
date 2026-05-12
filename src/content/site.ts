export type NAP = {
  legalName: string;
  displayName: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;          // ISO-3166-1 alpha-2
  phone: string;            // E.164 preferred
  email: string;
};

export type OpeningHours = {
  dayOfWeek: 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa' | 'Su';
  opens: string;            // 'HH:MM'
  closes: string;
};

export type SiteConfig = {
  brand: string;
  language: string;
  primaryDomain: string;
  aliases: string[];
  description: string;
  nap?: NAP;
  hours?: OpeningHours[];
  serviceArea?: string[];
  socials: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    x?: string;
  };
  nav: { label: string; href: string }[];
};

export const site: SiteConfig = {
  brand: 'Amicare-Zorg',
  language: 'nl',
  primaryDomain: 'ami-care.nl',
  aliases: [],
  description: 'Amicare-Zorg — werken in de jeugdzorg met hart en toewijding.',
  nap: {
    legalName: 'AMICARE ZORG',
    displayName: 'Amicare-Zorg',
    street: '',
    postalCode: '',
    city: 'Roermond',
    country: 'NL',
    phone: '',
    email: 'info@ami-care.nl',
  },
  serviceArea: ['Roermond e.o.', 'Limburg-Noord'],
  socials: {},
  nav: [
    { label: 'Werkwijze', href: '#werkwijze' },
    { label: 'Over', href: '#over' },
    { label: 'Wat telt', href: '#wat-telt' },
    { label: 'Contact', href: '#contact' },
  ],
};
