import React from 'react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from './PWAInstallPrompt';

interface TopHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
}) => {
  const { currentRoute, goBack, navigate } = useApp();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      goBack();
    }
  };

  const isMainTab = ['accueil', 'stock', 'ventes', 'clients', 'plus'].includes(currentRoute);

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] pt-safe shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="max-w-screen-md mx-auto h-14 px-4 flex items-center justify-between">
        {showBack ? (
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={handleBack}
              aria-label="Retour"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#1A1A2E] hover:bg-[#F1F5F9] active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <div className="flex flex-col min-w-0">
              <h1 className="font-display font-semibold text-[16px] text-[#002452] truncate leading-tight">
                {title || "ON'Konnect Manager"}
              </h1>
              {subtitle && (
                <p className="font-sans text-[11px] text-[#64748B] truncate leading-none mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('accueil')}
              aria-label="Accueil"
              className="flex items-center gap-2 text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-[#E0F7F7] flex items-center justify-center text-[#006a6a]">
                <span className="material-symbols-outlined text-[20px]">hub</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-[16px] text-[#002452] tracking-tight leading-tight">
                  ON'Konnect
                </span>
                <span className="font-sans text-[10px] text-[#64748B] leading-none font-medium">
                  {subtitle || 'Manager'}
                </span>
              </div>
            </button>
          </div>
        )}

        {/* Right side controls: PWA button, Notifications, Avatar */}
        <div className="flex items-center gap-1.5">
          <PWAInstallButton />

          {rightAction ? (
            rightAction
          ) : (
            <>
              <button
                onClick={() => navigate('interventions')}
                aria-label="Alertes et notifications"
                className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#002452] hover:bg-[#F1F5F9] transition-colors"
                title="Alertes & SAV"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white"></span>
              </button>

              <button
                onClick={() => navigate('plus')}
                aria-label="Profil opérateur"
                className="w-8 h-8 rounded-full bg-[#1B3A6B] text-white flex items-center justify-center font-display font-semibold text-[11px] border border-[#E2E8F0] shadow-sm ml-1"
                title="Opérateur : Amidou Ouedraogo"
                type="button"
              >
                AO
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
