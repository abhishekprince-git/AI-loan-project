import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const ApplicationHistorySection = ({ historyRows }) => (
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
          {historyRows.map((item, idx) => (
            <tr key={idx} className="border-t border-outline-variant/10">
              <td className="py-3.5 pr-4 text-on-surface-variant">{item.date}</td>
              <td className="py-3.5 pr-4 font-medium text-on-surface">{item.action}</td>
              <td className="py-3.5 pr-4 text-on-surface-variant">{item.id}</td>
              <td className="py-3.5 pr-4">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">{item.type}</span>
              </td>
              <td className="py-3.5 font-semibold text-on-surface">{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
