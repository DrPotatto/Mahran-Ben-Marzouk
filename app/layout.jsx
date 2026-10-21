import './globals.css';
import AppProvider from '../components/AppProvider';
import { dictionaries } from '../locales/index.js';

const fr = dictionaries.fr;

export const metadata = {
  title: fr.meta.title,
  description: fr.meta.description,
  applicationName: '7DCONSTRUCTION',
  authors: [{ name: 'Entreprise BTP 7DCONSTRUCTION' }],
  icons: { icon: '/icons/icon.svg' },
  openGraph: {
    title: fr.meta.title,
    description: fr.meta.description,
    locale: 'fr_TN',
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#090B0E',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

// French is the default language. AppProvider updates <html lang/dir> on the client
// when the visitor switches to Arabic (RTL) or English.
export default function RootLayout({ children }) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
