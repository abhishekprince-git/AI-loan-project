import React from 'react';
import {
  LayoutDashboard,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Wallet,
  Landmark,
  Calendar,
  TrendingUp,
  FileText,
  CircleDollarSign,
  ArrowUpRight,
  Bell,
  BadgeCheck
} from 'lucide-react';

export const ScreenDashboard = () => {
  const statusCards = [
    {
      title: 'Home Loan Application',
      appId: 'APP-4921-HL',
      status: 'Underwriting Review',
      statusTone: 'text-primary bg-primary/10 border-primary/20',
      progress: 82,
      eta: 'Decision expected in 1 business day'
    },
    {
      title: 'Personal Loan Refinance',
      appId: 'APP-2077-PL',
      status: 'Approved',
      statusTone: 'text-green-700 bg-green-50 border-green-100',
      progress: 100,
      eta: 'Agreement sent for e-signature'
    },
    {
      title: 'Credit Line Increase',
      appId: 'APP-7812-CL',
      status: 'Additional Documents Needed',
      statusTone: 'text-amber-700 bg-amber-50 border-amber-100',
      progress: 56,
      eta: 'Upload last 3 salary slips to continue'
    }
  ];

  const history = [
    { date: '12 Apr 2026', action: 'KYC completed via video verification', id: 'APP-4921-HL', type: 'Verification', amount: '-' },
    { date: '10 Apr 2026', action: 'Loan terms revised and accepted', id: 'APP-2077-PL', type: 'Agreement', amount: 'INR 2,00,000' },
    { date: '08 Apr 2026', action: 'Bank statement parsed successfully', id: 'APP-7812-CL', type: 'Document', amount: '-' },
    { date: '05 Apr 2026', action: 'Initial application submitted', id: 'APP-4921-HL', type: 'Submission', amount: 'INR 45,00,000' }
  ];

  const pendingTasks = [
    { label: 'Upload salary slips for credit-line application', severity: 'high' },
    { label: 'Review and sign refinance agreement', severity: 'medium' },
    { label: 'Add nominee details for active loan account', severity: 'low' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
      <section className="bg-surface-container-lowest rounded-[2rem] p-6 sm:p-8 lg:p-10 ambient-bloom border border-outline-variant/10 relative overflow-hidden">
        <div className="absolute -right-14 -top-14 w-44 h-44 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <LayoutDashboard size={14} />
              Account Dashboard
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-[-0.03em] text-on-surface leading-[1.08]">
              Track Every Application in One Place
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-3 max-w-3xl leading-relaxed">
              Monitor status, review history, and complete pending tasks without switching between onboarding screens.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 min-w-full lg:min-w-[460px]">
            <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
              <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">Active Applications</p>
              <p className="text-2xl font-bold text-on-surface mt-2">3</p>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
              <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">Total Approved</p>
              <p className="text-2xl font-bold text-on-surface mt-2">INR 47L</p>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
              <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">Open Alerts</p>
              <p className="text-2xl font-bold text-on-surface mt-2">2</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 sm:mt-8 grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-surface-container rounded-3xl p-5 sm:p-6 border border-outline-variant/10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-5">Application Status</h3>
            <div className="space-y-4">
              {statusCards.map((card, idx) => (
                <div key={idx} className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/10 ambient-bloom">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-on-surface">{card.title}</p>
                      <p className="text-xs text-on-surface-variant mt-1">{card.appId}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border inline-flex items-center gap-1.5 ${card.statusTone}`}>
                      {card.status.includes('Approved') ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}
                      {card.status}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${card.progress}%` }}></div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-on-surface-variant">Progress: {card.progress}%</span>
                      <span className="text-primary font-semibold">{card.eta}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container rounded-3xl p-5 sm:p-6 border border-outline-variant/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Application History</h3>
              <button className="text-xs font-bold text-primary inline-flex items-center gap-1 hover:underline">
                Export History
                <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="text-left text-on-surface-variant text-xs uppercase tracking-widest">
                    <th className="py-3 pr-4">Date</th>
                    <th className="py-3 pr-4">Action</th>
                    <th className="py-3 pr-4">Application</th>
                    <th className="py-3 pr-4">Category</th>
                    <th className="py-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, idx) => (
                    <tr key={idx} className="border-t border-outline-variant/10">
                      <td className="py-3.5 pr-4 text-on-surface-variant">{item.date}</td>
                      <td className="py-3.5 pr-4 font-medium text-on-surface">{item.action}</td>
                      <td className="py-3.5 pr-4 text-on-surface-variant">{item.id}</td>
                      <td className="py-3.5 pr-4">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3.5 font-semibold text-on-surface">{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

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
      </section>
    </div>
  );
};
