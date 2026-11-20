/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { ChecklistSection } from './components/ChecklistSection';
import { ExpensesSection } from './components/ExpensesSection';
import { FeaturesSection } from './components/FeaturesSection';
import { HeroSection } from './components/HeroSection';
import { ItinerarySection } from './components/ItinerarySection';
import { Navbar, NAV_ITEMS } from './components/Navbar';
import { SdgsSection } from './components/SdgsSection';
import { SpotsAndGallerySection } from './components/SpotsAndGallerySection';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [highlightedSdgCode, setHighlightedSdgCode] = useState<string | null>(null);

  const handleNavigate = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSelectDayAndScroll = useCallback(
    (dayNumber: number) => {
      setSelectedDayNumber(dayNumber);
      handleNavigate('itinerary');
    },
    [handleNavigate]
  );

  const handleNavigateToSdg = useCallback(
    (sdgCode: string) => {
      setHighlightedSdgCode(`${sdgCode}-${Date.now()}`);
      handleNavigate('sdgs');
    },
    [handleNavigate]
  );

  // Track active section while scrolling
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id);

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF8] text-slate-900">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="flex-1">
        <HeroSection onNavigate={handleNavigate} />

        <FeaturesSection onSelectDayAndScroll={handleSelectDayAndScroll} />

        <ItinerarySection
          selectedDayNumber={selectedDayNumber}
          onSelectDay={setSelectedDayNumber}
          onNavigateToSdg={handleNavigateToSdg}
        />

        <SpotsAndGallerySection onSelectDayAndScroll={handleSelectDayAndScroll} />

        <SdgsSection
          highlightedSdgCode={highlightedSdgCode ? highlightedSdgCode.split('-')[0] : null}
          onSelectDayAndScroll={handleSelectDayAndScroll}
        />

        <ChecklistSection />

        <ExpensesSection />

        <AboutSection onNavigate={handleNavigate} />
      </main>
    </div>
  );
}
