import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  ShieldCheck, 
  CreditCard,
  Briefcase,
  Calendar,
  ChevronRight
} from 'lucide-react';

export const ScreenProfile = () => {
  const profile = {
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "+91 98765 43210",
    location: "Austin, Texas",
    occupation: "Senior Product Designer",
    dob: "14 March 1992"
  };

  const ProfileField = ({ icon, label, value, onEdit }) => (
    <div className="flex items-center justify-between p-4 sm:p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/15 hover:border-primary/20 transition-all ambient-bloom">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</p>
          <p className="text-sm font-semibold text-on-surface leading-tight break-words">{value}</p>
        </div>
      </div>
      <button 
        onClick={onEdit}
        className="text-xs font-bold text-primary hover:underline shrink-0"
      >
        Edit
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-[2rem] p-6 sm:p-8 text-center ambient-bloom relative overflow-hidden border border-outline-variant/10">
            <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative inline-block mb-5">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 bg-primary-gradient shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/alex/200/200" 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover border-4 border-white"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button className="absolute bottom-1 right-1 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:scale-110 transition-transform border border-outline-variant/15">
                <Camera size={18} />
              </button>
            </div>
            <h2 className="text-3xl font-bold text-on-surface tracking-tight">{profile.name}</h2>
            <p className="text-sm font-medium text-on-surface-variant opacity-80 mt-1">{profile.occupation}</p>
            
            <div className="mt-7 pt-6 border-t border-outline-variant/10 grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-sm font-bold text-on-surface">12</p>
                <p className="text-[10px] text-on-surface-variant uppercase font-bold">Loans</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-on-surface">98%</p>
                <p className="text-[10px] text-on-surface-variant uppercase font-bold">Score</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-on-surface">Gold</p>
                <p className="text-[10px] text-on-surface-variant uppercase font-bold">Tier</p>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-3xl p-6 sm:p-7 border border-primary/15">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/80 text-primary flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <h3 className="font-bold text-primary">Identity Verified</h3>
            </div>
            <p className="text-sm text-primary/80 leading-relaxed">
              Your identity has been verified through our AI video onboarding system. This enables access to premium credit tiers.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-container rounded-[2rem] p-5 sm:p-6 lg:p-7 border border-outline-variant/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Personal Information</h3>
              <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity w-full sm:w-auto">
                Save Changes
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileField icon={<User size={18} />} label="Full Name" value={profile.name} onEdit={() => {}} />
              <ProfileField icon={<Mail size={18} />} label="Email Address" value={profile.email} onEdit={() => {}} />
              <ProfileField icon={<Phone size={18} />} label="Phone Number" value={profile.phone} onEdit={() => {}} />
              <ProfileField icon={<MapPin size={18} />} label="Location" value={profile.location} onEdit={() => {}} />
              <ProfileField icon={<Briefcase size={18} />} label="Occupation" value={profile.occupation} onEdit={() => {}} />
              <ProfileField icon={<Calendar size={18} />} label="Date of Birth" value={profile.dob} onEdit={() => {}} />
            </div>
          </section>

          <section className="bg-surface-container rounded-[2rem] p-5 sm:p-6 lg:p-7 border border-outline-variant/10">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-5">Financial Profiles</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 sm:p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/15 group hover:border-primary/20 transition-all cursor-pointer ambient-bloom">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">Primary Bank Account</h4>
                    <p className="text-xs text-on-surface-variant font-medium">HDFC Bank • • • • 4921</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-on-surface-variant opacity-40 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="flex items-center justify-between p-5 sm:p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/15 group hover:border-primary/20 transition-all cursor-pointer ambient-bloom">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">Credit Report</h4>
                    <p className="text-xs text-on-surface-variant font-medium">Last updated: Today</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-on-surface-variant opacity-40 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
