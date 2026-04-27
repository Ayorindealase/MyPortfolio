import type { Metadata } from 'next';
import { Oxanium, IBM_Plex_Mono, DM_Sans } from 'next/font/google';
import './globals.css';
import { Nav } from '@/components/hud/Nav';
import { Ticker } from '@/components/hud/Ticker';
import { ParticleField } from '@/components/hud/ParticleField';
import { ChatPanel } from '@/components/hud/ChatPanel';
import { BootWrapper } from '@/components/hud/BootWrapper';
import { prisma } from '@/lib/prisma';

const oxanium = Oxanium({
  subsets: ['latin'],
  variable: '--font-oxanium',
  weight: ['200', '300', '400', '500', '600', '700'],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  weight: ['300', '400', '500', '600'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500'],
});

export const metadata: Metadata = {
  title: 'Ayorinde Alase — AI Scientist | PhD Candidate | CTO',
  description: 'Portfolio of Ayorinde Alase — AI Scientist, PhD Candidate at University of Arkansas at Little Rock, and CTO of Kairos Nexus Global.',
  openGraph: {
    title: 'Ayorinde Alase — AI Scientist | PhD Candidate | CTO',
    description: 'AI research, publications, and technical leadership at the intersection of machine learning and biomechanics.',
    type: 'website',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const allTickerItems = await prisma.tickerItem.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' },
  });
  type TickerItemRecord = Awaited<ReturnType<typeof prisma.tickerItem.findMany>>[number];
  const tickerItems = allTickerItems.filter(
    (item: TickerItemRecord) => !item.text.toUpperCase().includes('MT SCHOLAR')
  );

  return (
    <html lang="en" className={`${oxanium.variable} ${ibmPlexMono.variable} ${dmSans.variable}`}>
      <body>
        <ParticleField />
        <BootWrapper />
        <Nav />
        <main className="relative z-10 pt-16 pb-10 min-h-screen">
          {children}
        </main>
        <Ticker items={tickerItems} />
        <ChatPanel />
      </body>
    </html>
  );
}
