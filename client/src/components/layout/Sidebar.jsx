import React from 'react';
import { 
  LayoutDashboard,
  Home, 
  Settings, 
  Video, 
  UserCheck, 
  Gavel, 
  Tag, 
  HelpCircle,
  X
} from 'lucide-react';
import { NavItem } from './NavItem';

export const Sidebar = ({ currentStep, setStep, isOpen, onClose }) => (
  <>
    {isOpen && <button onClick={onClose} className="lg:hidden fixed inset-0 bg-on-surface/40 backdrop-blur-[1px] z-55" aria-label="Close navigation" />}

    <aside className="hidden lg:flex h-screen w-64 fixed left-0 top-0 bg-surface-container flex-col py-8 px-6 z-50">
      <div className="mb-10 px-2">
        <h1 className="text-xl font-bold tracking-tighter text-on-surface">LoanFlow AI</h1>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mt-1 opacity-60">Onboarding v2.4</p>
      </div>
      
      <nav className="flex-1 space-y-1">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={currentStep === 'dashboard'} onClick={() => setStep('dashboard')} />
        <NavItem icon={<Home size={20} />} label="Home" active={currentStep === 1} onClick={() => setStep(1)} />
        <NavItem icon={<Settings size={20} />} label="Setup" active={currentStep === 2} onClick={() => setStep(2)} />
        <NavItem icon={<Video size={20} />} label="Video Onboarding" active={currentStep === 3} onClick={() => setStep(3)} />
        <NavItem icon={<UserCheck size={20} />} label="Verification" active={currentStep === 4} onClick={() => setStep(4)} />
        <NavItem icon={<Gavel size={20} />} label="Decision" active={currentStep === 5} onClick={() => setStep(5)} />
        <NavItem icon={<Tag size={20} />} label="Offer" active={currentStep === 6} onClick={() => setStep(6)} />
      </nav>

      <div className="mt-auto pt-6 border-t border-outline-variant/10 space-y-1">
        <button 
          onClick={() => setStep('support')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentStep === 'support' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant opacity-70 hover:bg-surface-container-high'}`}
        >
          <HelpCircle size={18} />
          <span className="text-sm font-medium">Support</span>
        </button>
        <button 
          onClick={() => setStep('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentStep === 'settings' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant opacity-70 hover:bg-surface-container-high'}`}
        >
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </button>
        
        <button 
          onClick={() => setStep('profile')}
          className={`flex items-center gap-3 py-3 px-4 mt-4 rounded-xl transition-colors w-full text-left ${currentStep === 'profile' ? 'bg-primary/10' : 'hover:bg-surface-container-high'}`}
        >
          <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center overflow-hidden border border-outline-variant/20">
            <img 
              src="https://picsum.photos/seed/alex/100/100" 
              alt="User" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface">Alex Rivera</span>
            <span className="text-[10px] text-on-surface-variant">
              {typeof currentStep === 'number' ? `Step ${currentStep} of 6` : currentStep === 'dashboard' ? 'Overview Ready' : 'Account Settings'}
            </span>
          </div>
        </button>
      </div>
    </aside>

    <aside className={`lg:hidden h-screen w-70 max-w-[85vw] fixed left-0 top-0 bg-surface-container flex flex-col py-6 px-5 z-60 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-8 px-2">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold tracking-tighter text-on-surface">LoanFlow AI</h1>
          <button onClick={onClose} className="w-9 h-9 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center" aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mt-1 opacity-60">Onboarding v2.4</p>
      </div>
      
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={currentStep === 'dashboard'} onClick={() => setStep('dashboard')} />
        <NavItem icon={<Home size={20} />} label="Home" active={currentStep === 1} onClick={() => setStep(1)} />
        <NavItem icon={<Settings size={20} />} label="Setup" active={currentStep === 2} onClick={() => setStep(2)} />
        <NavItem icon={<Video size={20} />} label="Video Onboarding" active={currentStep === 3} onClick={() => setStep(3)} />
        <NavItem icon={<UserCheck size={20} />} label="Verification" active={currentStep === 4} onClick={() => setStep(4)} />
        <NavItem icon={<Gavel size={20} />} label="Decision" active={currentStep === 5} onClick={() => setStep(5)} />
        <NavItem icon={<Tag size={20} />} label="Offer" active={currentStep === 6} onClick={() => setStep(6)} />
      </nav>

      <div className="mt-auto pt-6 border-t border-outline-variant/10 space-y-1">
        <button 
          onClick={() => setStep('support')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentStep === 'support' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant opacity-70 hover:bg-surface-container-high'}`}
        >
          <HelpCircle size={18} />
          <span className="text-sm font-medium">Support</span>
        </button>
        <button 
          onClick={() => setStep('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentStep === 'settings' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant opacity-70 hover:bg-surface-container-high'}`}
        >
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </button>
        
        <button 
          onClick={() => setStep('profile')}
          className={`flex items-center gap-3 py-3 px-4 mt-4 rounded-xl transition-colors w-full text-left ${currentStep === 'profile' ? 'bg-primary/10' : 'hover:bg-surface-container-high'}`}
        >
          <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center overflow-hidden border border-outline-variant/20">
            <img 
              src="https://picsum.photos/seed/alex/100/100" 
              alt="User" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface">Alex Rivera</span>
            <span className="text-[10px] text-on-surface-variant">
              {typeof currentStep === 'number' ? `Step ${currentStep} of 6` : currentStep === 'dashboard' ? 'Overview Ready' : 'Account Settings'}
            </span>
          </div>
        </button>
      </div>
    </aside>
  </>
);
