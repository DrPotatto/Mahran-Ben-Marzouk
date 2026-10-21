// Central, owner-editable company facts.
// Only information supplied by the owner is listed here. Everything else
// (phone, e-mail, registrations, history, statistics) is intentionally absent
// until it is verified. Contact channels can be set here OR through the
// NEXT_PUBLIC_* environment variables (see .env.example).

export const SITE = {
  name: 'Entreprise BTP 7DCONSTRUCTION',
  shortName: '7DCONSTRUCTION',
  owner: 'Mahran Ben Marzouk',
  city: 'Tebourba',
  // Approximate geographic coordinates of Tebourba (display only).
  coordinates: { lat: 36.8333, lon: 9.8333 },

  // Leave empty until verified. Environment variables take precedence.
  contact: {
    whatsappNumber: '',
    email: '',
    phoneDisplay: '',
  },

  // Small "to be confirmed" tags on services / process content that the
  // owner has not yet validated. Set to false once everything is verified.
  showVerificationBadges: true,
};
