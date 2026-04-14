import React, { useState } from 'react';
import { SupportHero, SupportMainContent, SupportSidebar } from '../features/support';

export const ScreenSupport = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14">
      <SupportHero />

      <section className="mt-6 sm:mt-8 grid grid-cols-1 xl:grid-cols-12 gap-6">
        <SupportMainContent query={query} setQuery={setQuery} />
        <SupportSidebar />
      </section>
    </div>
  );
};
