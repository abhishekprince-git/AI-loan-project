import React from 'react';
import { historyRows, pendingTasks, statusCards, DashboardHero, ApplicationStatusSection, ApplicationHistorySection, DashboardSidebarPanels } from '../features/dashboard';

export const ScreenDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
      <DashboardHero />

      <section className="mt-6 sm:mt-8 grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <ApplicationStatusSection statusCards={statusCards} />
          <ApplicationHistorySection historyRows={historyRows} />
        </div>
        <DashboardSidebarPanels pendingTasks={pendingTasks} />
      </section>
    </div>
  );
};
