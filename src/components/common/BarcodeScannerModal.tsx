import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult?: (code: string) => void;
  contextHint?: string;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScanResult,
  contextHint = "Pointez vers le code-barres, QR Code ou numéro de série de l'équipement",
}) => {
  const { equipments, products, navigate } = useApp();
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);

  if (!isOpen) return null;

  const handleSelectCode = (code: string) => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      onClose();
      if (onScanResult) {
        onScanResult(code);
      } else {
        // Find equipment matching serial or internal code
        const matchedEq = equipments.find(
          (e) =>
            e.serialNumber.toLowerCase() === code.toLowerCase() ||
            e.internalCode.toLowerCase() === code.toLowerCase() ||
            e.macAddress.toLowerCase() === code.toLowerCase()
        );
        if (matchedEq) {
          navigate('equipment-detail', { equipmentId: matchedEq.id });
        } else {
          // Check product
          const matchedProd = products.find(
            (p) => p.reference.toLowerCase() === code.toLowerCase()
          );
          if (matchedProd) {
            navigate('stock');
          } else {
            alert(`Code scanné : ${code} (Aucun équipement lié directement).`);
          }
        }
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006a6a] text-[22px]">qr_code_scanner</span>
            <h2 className="font-display font-bold text-base text-[#002452]">Scanner Équipement & Code</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Viewfinder Canvas */}
        <div className="p-5 flex flex-col items-center">
          <div className="relative w-64 h-48 bg-[#001a40] rounded-2xl overflow-hidden flex items-center justify-center border-2 border-[#3EC8C8] shadow-inner">
            {/* Animated Scan Line */}
            <div className="absolute inset-x-0 h-0.5 bg-[#3EC8C8] shadow-[0_0_8px_#3EC8C8] animate-bounce"></div>
            
            {/* Targeting Reticle Corners */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#3EC8C8]"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#3EC8C8]"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#3EC8C8]"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#3EC8C8]"></div>

            <div className="flex flex-col items-center text-center p-4">
              <span className="material-symbols-outlined text-white/50 text-[36px]">filter_center_focus</span>
              <p className="text-[11px] text-white/80 mt-1 font-mono">
                {scanning ? 'Lecture en cours...' : 'Aligner le code dans le cadre'}
              </p>
            </div>
          </div>
          <p className="font-sans text-xs text-[#64748B] text-center mt-3 max-w-xs">
            {contextHint}
          </p>

          {/* Quick Scan Emulators (For field tests) */}
          <div className="w-full mt-4 pt-3 border-t border-[#E2E8F0]">
            <span className="block font-sans text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">
              Simulation rapide sur le parc :
            </span>
            <div className="flex flex-wrap gap-1.5">
              {equipments.slice(0, 4).map((eq) => (
                <button
                  key={eq.id}
                  onClick={() => handleSelectCode(eq.serialNumber)}
                  type="button"
                  className="px-2.5 py-1 rounded-lg bg-[#F1F5F9] hover:bg-[#E0F7F7] hover:text-[#007070] text-[#1A1A2E] text-[11px] font-mono border border-[#E2E8F0] active:scale-95 transition-all text-left"
                >
                  <span className="font-bold">{eq.productName.split(' ')[0]}</span>: {eq.serialNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Entry */}
          <div className="w-full mt-4 flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Saisir code ou numéro de série..."
              className="flex-1 px-3 py-2 text-xs font-mono bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#002452]"
            />
            <button
              onClick={() => manualCode && handleSelectCode(manualCode)}
              disabled={!manualCode.trim()}
              type="button"
              className="px-4 py-2 bg-[#002452] text-white rounded-xl text-xs font-semibold disabled:opacity-40 active:scale-95"
            >
              Valider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
