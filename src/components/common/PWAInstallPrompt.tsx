import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already in standalone installed mode, do not show
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {isInstallable && (
        <button
          onClick={install}
          type="button"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E0F7F7] text-[#007070] text-[11px] font-semibold border border-[#CBD5E1] hover:bg-[#cbf1f1] active:scale-95 transition-all shadow-xs"
          title="Installer l'application sur votre écran d'accueil"
        >
          <span className="material-symbols-outlined text-[15px]">download</span>
          <span>Installer PWA</span>
        </button>
      )}

      {isIOS && (
        <button
          onClick={() => setShowIOSGuide(true)}
          type="button"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#002452] text-[11px] font-medium border border-[#E2E8F0] hover:bg-[#e2e8f0]"
        >
          <span className="material-symbols-outlined text-[14px]">add_to_home_screen</span>
          <span>Installer</span>
        </button>
      )}

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-[#E2E8F0] text-[#1A1A2E]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E0F7F7] flex items-center justify-center text-[#006a6a]">
                  <span className="material-symbols-outlined text-[18px]">phone_iphone</span>
                </div>
                <h3 className="font-display font-bold text-base text-[#002452]">Installer sur iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-[#64748B] hover:bg-[#F1F5F9]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="mt-4 space-y-3 font-sans text-xs text-[#44474f] leading-relaxed">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#EEF4FF] text-[#002452] font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                <p>
                  Dans la barre Safari, touchez le bouton <strong>Partager</strong> <span className="material-symbols-outlined text-[14px]">ios_share</span>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#EEF4FF] text-[#002452] font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                <p>
                  Faites défiler puis sélectionnez <strong>Sur l’écran d’accueil</strong> <span className="material-symbols-outlined text-[14px]">add_box</span>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#EEF4FF] text-[#002452] font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                <p>
                  Touchez <strong>Ajouter</strong> en haut à droite. L’icône apparaîtra sur votre écran d’accueil.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-[#002452] text-white font-display font-semibold text-xs text-center active:scale-[0.98] transition-transform"
            >
              Compris
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div className="fixed top-14 inset-x-0 z-50 bg-[#EF4444] text-white text-xs font-semibold py-1.5 px-4 text-center shadow-md flex items-center justify-center gap-2">
      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
      <span>Mode hors ligne — Données en cache local actif.</span>
    </div>
  );
};
