import React from 'react';
import { useApp } from '../context/AppContext';

export const DocumentPreviewPage: React.FC = () => {
  const { documents, selectedDocumentId, goBack, navigate, customers } = useApp();

  // Find document or fallback
  const document =
    documents.find((d) => d.id === selectedDocumentId) ||
    documents[0];

  const handlePrintOrDownload = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          text: `Document officiel ON'Konnect ${document.id} - ${document.title}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Lien du document copié dans le presse-papiers.');
    }
  };

  return (
    <div className="w-full max-w-screen-md mx-auto px-4 py-4 flex flex-col gap-4">
      {/* 2. FEUILLE DU DOCUMENT OFFICIEL (A4 stylisé exact Stitch HTML 3) */}
      <section className="print-page bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs relative overflow-hidden text-xs">
        {/* Document Watermark/Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#002452]"></div>

        {/* En-tête officiel du document */}
        <div className="flex justify-between items-start pb-3 border-b border-[#E2E8F0] mb-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base text-[#002452] tracking-tight">
                ON'KONNECT
              </span>
              <span className="text-[10px] text-[#64748B] font-normal">by BLUE GROUP IN</span>
            </div>
            <span className="text-[11px] text-[#64748B] mt-0.5">Ouagadougou, Burkina Faso</span>
          </div>
          <div className="text-right">
            <span className="inline-block px-2 py-0.5 bg-[#F1F5F9] rounded font-mono text-[10px] text-[#002452] font-bold">
              BURKINA FASO
            </span>
          </div>
        </div>

        {/* Document Big Title */}
        <div className="text-center py-1 mb-3">
          <h2 className="font-display font-bold text-sm text-[#002452] tracking-tight uppercase">
            {document.type === 'PVM' && 'Procès-Verbal de Mise en Service (PVM)'}
            {document.type === 'FIT' && "Fiche Technique d'Installation (FIT)"}
            {document.type === 'FAC' && 'Facture Commerciale Officielle (FAC)'}
            {document.type === 'DEV' && 'Devis & Proposition Commerciale (DEV)'}
            {document.type === 'INT' && "Rapport d'Intervention & SAV (INT)"}
            {!['PVM', 'FIT', 'FAC', 'DEV', 'INT'].includes(document.type) && document.title}
          </h2>
          <div className="mt-1 flex items-center justify-center gap-2 font-mono text-[11px] text-[#64748B]">
            <span>
              Réf: <strong className="text-[#1A1A2E] font-bold">{document.id}</strong>
            </span>
            <span>•</span>
            <span>
              Date: <strong className="text-[#1A1A2E] font-semibold">{document.date}</strong>
            </span>
          </div>
        </div>

        {/* Informations Client & Déploiement */}
        <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0] mb-4 flex flex-col gap-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#64748B]">Client souscripteur</span>
              <span className="font-display font-bold text-xs text-[#002452]">
                {document.customerName || 'Faso Connect SARL'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#64748B]">Emplacement & Site</span>
              <span className="text-xs text-[#1A1A2E] font-medium">
                {document.siteName || 'Siège Ouaga 2000'}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E2E8F0] flex flex-col">
            <span className="text-[10px] text-[#64748B]">Équipement raccordé</span>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
              <span className="font-bold text-xs text-[#1A1A2E]">
                {document.equipmentTitle || 'Kit Starlink Standard V4'}
              </span>
              <span className="font-mono text-[10px] text-[#64748B] bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                SN: {document.serialNumber || 'SLS-901248'}
              </span>
              <span className="font-mono text-[10px] text-[#64748B] bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                MAC: {document.macAddress || '74:AC:B9:12:44:80'}
              </span>
            </div>
          </div>
        </div>

        {/* Financial info if Invoice or Devis */}
        {document.totalAmount && (
          <div className="mb-4 bg-[#EEF4FF] rounded-lg p-3 border border-[#002452]/20 flex items-center justify-between">
            <span className="font-display font-bold text-xs text-[#002452]">
              Montant Total ({document.type === 'DEV' ? 'Devisé' : 'Facturé'}) :
            </span>
            <span className="font-display font-bold text-base text-[#002452]">
              {document.totalAmount.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
        )}

        {/* Télémétrie & Conformité de Liaison (Only for PVM / FIT / Test) */}
        {document.telemetry && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[11px] text-[#64748B] uppercase tracking-wider font-bold">
                Télémétrie & Conformité de Liaison
              </h3>
              <span className="text-[11px] text-[#006a6a] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#006a6a]">verified</span>
                Audit Conforme
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Débit descendant */}
              <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#64748B] mb-1">
                  <span className="text-[10px]">Débit descendant</span>
                  <span className="material-symbols-outlined text-[#006a6a] text-[16px]">arrow_downward</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-lg text-[#002452]">
                    {document.telemetry.downloadSpeed}
                  </span>
                  <span className="text-[10px] text-[#64748B]">Mbps</span>
                </div>
              </div>

              {/* Débit montant */}
              <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#64748B] mb-1">
                  <span className="text-[10px]">Débit montant</span>
                  <span className="material-symbols-outlined text-[#006a6a] text-[16px]">arrow_upward</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-lg text-[#002452]">
                    {document.telemetry.uploadSpeed}
                  </span>
                  <span className="text-[10px] text-[#64748B]">Mbps</span>
                </div>
              </div>

              {/* Latence */}
              <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#64748B] mb-1">
                  <span className="text-[10px]">Latence réseau</span>
                  <span className="material-symbols-outlined text-[#006a6a] text-[16px]">speed</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-lg text-[#002452]">
                    {document.telemetry.latency}
                  </span>
                  <span className="text-[10px] text-[#64748B]">ms</span>
                </div>
              </div>

              {/* Obstruction */}
              <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#64748B] mb-1">
                  <span className="text-[10px]">Obstruction ciel</span>
                  <span className="material-symbols-outlined text-[#006a6a] text-[16px]">cloud_done</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-lg text-[#002452]">
                    {document.telemetry.obstruction.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-[#006a6a] font-bold">✓</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes et observations */}
        {document.notes && (
          <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] mb-4">
            <span className="text-[10px] text-[#64748B] block font-semibold">Observations :</span>
            <p className="text-xs text-[#1A1A2E] mt-0.5">{document.notes}</p>
          </div>
        )}

        {/* Signatures & Horodatage */}
        <div className="pt-3 border-t border-[#E2E8F0]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Visa Technicien */}
            <div className="rounded-lg p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-[#64748B] block mb-1">Visa Technicien Agréé</span>
                <p className="font-display font-bold text-xs text-[#002452]">
                  {document.technicianVisa?.name || 'Amidou Ouedraogo'}
                </p>
                <p className="text-[10px] text-[#64748B]">
                  {document.technicianVisa?.title || "Certifié terrain ON'Konnect"}
                </p>
              </div>
              <div className="mt-2 pt-1.5 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#64748B]">
                  {document.technicianVisa?.date || '28/02/2026 à 10:45'}
                </span>
                <span className="material-symbols-outlined text-[#006a6a] text-[15px]">check_circle</span>
              </div>
            </div>

            {/* Visa Client */}
            <div className="rounded-lg p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-[#64748B] block mb-1">Visa Client & Réception</span>
                <p className="font-display font-bold text-xs text-[#002452]">
                  {document.clientVisa?.name || 'M. Ouedraogo'}
                </p>
                <p className="text-[10px] text-[#64748B]">
                  {document.clientVisa?.company || document.customerName || 'Faso Connect SARL'}
                </p>
              </div>
              <div className="mt-2 pt-1.5 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#006a6a] font-semibold">
                  {document.clientVisa?.status || 'Signature numérique validée'}
                </span>
                <span className="material-symbols-outlined text-[#006a6a] text-[15px]">verified_user</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PANNEAU D'ACTIONS (From Stitch HTML 3) */}
      <section className="no-print flex flex-col gap-2 pt-1">
        {/* Primary Action Button */}
        <button
          onClick={handlePrintOrDownload}
          type="button"
          className="w-full h-11 bg-[#002452] text-white rounded-xl font-display font-semibold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.99] transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Télécharger PDF Officiel</span>
        </button>

        {/* Secondary Balanced Actions */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => navigate('documents')}
            type="button"
            className="h-10 bg-white border border-[#E2E8F0] text-[#002452] rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-[#F1F5F9] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#64748B]">folder</span>
            <span>Documents</span>
          </button>
          <button
            onClick={handlePrintOrDownload}
            type="button"
            className="h-10 bg-white border border-[#E2E8F0] text-[#002452] rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-[#F1F5F9] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#64748B]">print</span>
            <span>Imprimer</span>
          </button>
          <button
            onClick={handleShare}
            type="button"
            className="h-10 bg-white border border-[#E2E8F0] text-[#002452] rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-[#F1F5F9] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#64748B]">share</span>
            <span>Partager</span>
          </button>
        </div>
      </section>
    </div>
  );
};
