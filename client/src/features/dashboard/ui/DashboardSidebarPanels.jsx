import React from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  Calendar,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileText,
  TrendingUp,
  Wallet
} from 'lucide-react';

export const DashboardSidebarPanels = ({ pendingTasks }) => (
  <div className="xl:col-span-4 space-y-6">
    <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10">
      <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-5">Portfolio Snapshot</h4>
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Wallet size={18} />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-bold uppercase">Outstanding EMI</p>
            <p className="text-lg font-bold text-on-surface">INR 21,240/mo</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <CircleDollarSign size={18} />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-bold uppercase">Total Disbursed</p>
            <p className="text-lg font-bold text-on-surface">INR 2,00,000</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-bold uppercase">Credit Trend</p>
            <p className="text-lg font-bold text-on-surface">+34 pts this quarter</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
      <h4 className="text-sm font-bold text-primary mb-4">Required Actions</h4>
      <ul className="space-y-3">
        {pendingTasks.map((task, idx) => (
          <li key={idx} className="p-3 rounded-xl bg-white/70 border border-primary/10">
            <div className="flex items-start gap-2">
              {task.severity === 'high' && <AlertTriangle size={14} className="text-amber-600 mt-0.5" />}
              {task.severity === 'medium' && <Clock3 size={14} className="text-primary mt-0.5" />}
              {task.severity === 'low' && <CheckCircle2 size={14} className="text-green-600 mt-0.5" />}
              <span className="text-xs text-primary/90 leading-relaxed">{task.label}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>

    <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10">
      <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Quick Actions</h4>
      <div className="grid grid-cols-1 gap-3">
        <button className="h-11 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/10 text-sm font-semibold text-on-surface inline-flex items-center justify-between hover:border-primary/25 transition-all">
          Upload Documents
          <FileText size={16} className="text-primary" />
        </button>
        <button className="h-11 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/10 text-sm font-semibold text-on-surface inline-flex items-center justify-between hover:border-primary/25 transition-all">
          View Payment Calendar
          <Calendar size={16} className="text-primary" />
        </button>
        <button className="h-11 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/10 text-sm font-semibold text-on-surface inline-flex items-center justify-between hover:border-primary/25 transition-all">
          Get Status Alerts
          <Bell size={16} className="text-primary" />
        </button>
      </div>
      <div className="mt-5 pt-4 border-t border-outline-variant/10 flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
        <BadgeCheck size={14} className="text-green-600" />
        Last sync: Today, 4:18 PM
      </div>
    </div>
  </div>
);
