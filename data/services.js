// Services shown on the site. Texts live in locales/*.js under services.items.<id>.
// Set `verified: true` once the owner confirms the company really offers the service;
// the "To be confirmed" badge then disappears (see SITE.showVerificationBadges).
// `accent` picks the card's visual identity (a pattern variant in ServiceGlyph).

export const SERVICES = [
  { id: 'shell', verified: false, accent: 'blocks' },
  { id: 'concrete', verified: false, accent: 'rebar' },
  { id: 'masonry', verified: false, accent: 'bricks' },
  { id: 'residential', verified: false, accent: 'house' },
  { id: 'commercial', verified: false, accent: 'storefront' },
  { id: 'renovation', verified: false, accent: 'renovate' },
  { id: 'finishing', verified: false, accent: 'trowel' },
  { id: 'coordination', verified: false, accent: 'crane' },
];
