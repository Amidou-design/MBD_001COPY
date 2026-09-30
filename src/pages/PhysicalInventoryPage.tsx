import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarcodeScannerModal } from '../components/common/BarcodeScannerModal';

export const PhysicalInventoryPage: React.FC = () => {
  const {
    inventorySession,
    recordPhysicalInventoryCount,
    validatePhysicalInventory,
    navigate,
    goBack,
  } = useApp();

  const [counts, setCounts] = useState<{ [productId: string]: number }>(() => {
    const initial: { [key: string]: number } = {};
    inventorySession.items.forEach((item) => {
      initial[item.productId] = item.countedQty;
    });
    return initial;
  });

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleIncrement = (productId: string) => {
    setCounts((prev) => {
      const next = { ...prev, [productId]: (prev[productId] || 0) + 1 };
      // Sync to context
      recordPhysicalInventoryCount([{ productId, countedQty: next[productId] }]);
      return next;
    });
  };

  const handleDecrement = (productId: string) => {
    setCounts((prev) => {
      const curr = prev[productId] || 0;
      if (curr <= 0) return prev;
      const next = { ...prev, [productId]: curr - 1 };
      recordPhysicalInventoryCount([{ productId, countedQty: next[productId] }]);
      return next;
    });
  };

  const handleValidate = () => {
    const res = validatePhysicalInventory();
    if (res.success) {
      setSuccessBanner(res.message);
      setTimeout(() => {
        if (res.pvmDocumentId) {
          navigate('document-preview', { documentId: res.pvmDocumentId });
        } else {
          navigate('stock');
        }
      }, 1500);
    }
  };

  const handleScanResult = (code: string) => {
    // If scanned item matches any product code, increment it
    const item = inventorySession.items.find(
      (it) => it.code.toLowerCase().includes(code.toLowerCase()) || code.toLowerCase().includes('v4')
    );
    if (item) {
      handleIncrement(item.productId);
      alert(`Article scanné : ${item.productName}. Comptage incrémenté.`);
    } else {
      alert(`Code ${code} scanné.`);
    }
  };

  return (
    <div className="w-full max-w-screen-md mx-auto px-4 py-4 space-y-4">
      {/* 1. EN-TÊTE ÉPURÉ DE LA MISSION (Stitch HTML 4) */}
      <section className="space-y-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-1.5 text-[#002452] hover:opacity-80 transition-opacity"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span className="font-semibold text-xs">Inventaire</span>
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#F1F5F9] text-[#44474f] font-mono text-[11px] border border-[#E2E8F0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006a6a]"></span>
            <span>Session {inventorySession.id}</span>
          </div>
        </div>
        <h1 className="font-display font-bold text-xl text-[#002452] tracking-tight">
          Inventaire Physique
        </h1>
        <p className="text-xs text-[#64748B]">Session de comptage et réconciliation de stock</p>
      </section>

      {successBanner && (
        <div className="p-3 bg-[#E0F7F7] border border-[#006a6a]/30 text-[#007070] text-xs font-semibold rounded-xl flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{successBanner}</span>
        </div>
      )}

      {/* 2. ÉTAPE 1 : CHOIX DE L'EMPLACEMENT (Stitch HTML 4) */}
      <section>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-none">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-[#64748B]">Emplacement inventorié</span>
            <button
              onClick={() => setIsScannerOpen(true)}
              className="text-[11px] font-semibold text-[#002452] hover:underline flex items-center gap-1"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">qr_code_scanner</span>
              <span>Scanner matériel</span>
            </button>
          </div>

          <div className="flex items-center justify-between bg-[#F8FAFC] px-3 py-2.5 rounded-lg border border-[#E2E8F0] mb-2">
            <div className="flex items-center gap-2 truncate">
              <span className="material-symbols-outlined text-[#002452] text-[18px]">warehouse</span>
              <span className="font-display font-semibold text-xs text-[#002452] truncate">
                {inventorySession.location}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#64748B] text-[18px]">expand_more</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#64748B] text-[11px]">
            <span className="material-symbols-outlined text-[14px]">badge</span>
            <span>
              Opérateur : <strong className="font-semibold text-[#181c1f]">{inventorySession.operator}</strong>
            </span>
            <span className="text-[#CBD5E1]">•</span>
            <span>{inventorySession.date}</span>
          </div>
        </div>
      </section>

      {/* 3. ÉTAPE 2 : CARTES / LIGNES DE COMPTAGE (Single-level cards, Stitch HTML 4) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="font-display font-semibold text-xs text-[#002452]">
            Articles à dénombrer ({inventorySession.items.length})
          </h2>
          <span className="text-xs text-[#64748B]">Progression: {inventorySession.items.length}/{inventorySession.items.length}</span>
        </div>

        {inventorySession.items.map((item) => {
          const counted = counts[item.productId] ?? item.countedQty;
          const diff = counted - item.theoreticalQty;

          const isConforme = diff === 0;
          const isManquant = diff < 0;
          const isExcedent = diff > 0;

          return (
            <article
              key={item.productId}
              className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col gap-3 shadow-none"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display font-bold text-xs text-[#002452]">{item.productName}</h3>
                  <p className="font-mono text-[10px] text-[#64748B] mt-0.5">{item.code}</p>
                </div>

                {isConforme && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#E6F4F1] text-[#0A7A6E] text-[10px] font-semibold">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    Conforme
                  </span>
                )}

                {isManquant && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEF2F2] text-[#EF4444] text-[10px] font-semibold">
                    <span className="material-symbols-outlined text-[13px]">warning</span>
                    {diff} unités manquantes
                  </span>
                )}

                {isExcedent && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EEF4FF] text-[#002452] text-[10px] font-semibold">
                    <span className="material-symbols-outlined text-[13px]">info</span>
                    +{diff} excédent
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
                <div className="flex items-baseline gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-[#64748B] block">Théorique</span>
                    <span className="font-display font-bold text-base text-[#181c1f]">
                      {item.theoreticalQty}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] block">Écart</span>
                    <span
                      className={`font-display font-bold text-sm ${
                        isManquant ? 'text-[#EF4444]' : isExcedent ? 'text-[#006a6a]' : 'text-[#64748B]'
                      }`}
                    >
                      {diff > 0 ? `+${diff}` : diff}
                    </span>
                  </div>
                </div>

                {/* Stepper Interactif (- / +) */}
                <div className="flex items-center border border-[#E2E8F0] rounded-xl bg-white p-0.5">
                  <button
                    type="button"
                    onClick={() => handleDecrement(item.productId)}
                    className="w-8 h-8 flex items-center justify-center text-[#002452] hover:bg-[#F1F5F9] rounded-lg transition-colors active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">remove</span>
                  </button>
                  <span className="w-9 text-center font-display font-bold text-base text-[#002452]">
                    {counted}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleIncrement(item.productId)}
                    className="w-8 h-8 flex items-center justify-center text-[#002452] hover:bg-[#F1F5F9] rounded-lg transition-colors active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* 4. ACTION PRINCIPALE (Stitch HTML 4) */}
      <section className="pt-2">
        <button
          onClick={handleValidate}
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-[#002452] text-white py-3.5 px-4 rounded-xl font-display font-semibold text-xs shadow-sm active:scale-[0.99] transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
          <span>Valider le comptage & Générer PV d'Écart</span>
        </button>
        <p className="text-center text-[11px] text-[#64748B] mt-1.5">
          Génère instantanément le rapport audité au format officiel
        </p>
      </section>

      {/* Scanner modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanResult={handleScanResult}
        contextHint="Scannez les étiquettes en rayon pour ajuster automatiquement le comptage."
      />
    </div>
  );
};
