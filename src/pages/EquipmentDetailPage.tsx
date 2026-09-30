import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NewInterventionModal } from '../components/modals/NewInterventionModal';

export const EquipmentDetailPage: React.FC = () => {
  const { equipments, selectedEquipmentId, goBack, navigate, transferEquipment, documents } = useApp();

  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'docs'>('info');
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [newLocationInput, setNewLocationInput] = useState('Dépôt Central Somgandé — Étagère A');
  const [copiedSN, setCopiedSN] = useState(false);

  const equipment =
    equipments.find((e) => e.id === selectedEquipmentId) ||
    equipments[0];

  if (!equipment) {
    return (
      <div className="p-8 text-center">
        <p>Équipement non trouvé.</p>
        <button onClick={goBack} className="mt-3 text-xs text-[#002452] underline">
          Retour au stock
        </button>
      </div>
    );
  }

  const handleCopySN = () => {
    navigator.clipboard?.writeText(equipment.serialNumber);
    setCopiedSN(true);
    setTimeout(() => setCopiedSN(false), 2000);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocationInput.trim()) return;
    transferEquipment(equipment.id, newLocationInput.trim());
    setIsTransferModalOpen(false);
  };

  // Associated documents
  const relatedDocs = documents.filter(
    (d) =>
      d.equipmentId === equipment.id ||
      d.serialNumber === equipment.serialNumber ||
      d.customerId === equipment.customerId
  );

  return (
    <div className="w-full max-w-screen-md mx-auto px-4 py-4 space-y-4">
      {/* 2. EN-TÊTE ET CARTE IDENTITÉ ÉQUIPEMENT (From Stitch HTML 2) */}
      <section className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-none">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-display font-semibold text-lg text-[#002452] tracking-tight">
              {equipment.productName}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-[11px] text-[#44474f] bg-[#F1F5F9] px-1.5 py-0.5 rounded">
                {equipment.internalCode}
              </span>
              <span className="text-[#E2E8F0] text-[11px]">•</span>
              <span className="text-[11px] text-[#44474f]">{equipment.category}</span>
            </div>
          </div>

          {/* Badge Statut */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold ${
              equipment.status === 'INSTALLÉ'
                ? 'bg-[#E0F7F7] text-[#002452]'
                : equipment.status === 'EN STOCK'
                ? 'bg-[#EEF4FF] text-[#002452]'
                : 'bg-amber-50 text-amber-800'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                equipment.status === 'INSTALLÉ'
                  ? 'bg-[#006a6a]'
                  : equipment.status === 'EN STOCK'
                  ? 'bg-[#1B3A6B]'
                  : 'bg-amber-500'
              }`}
            ></span>
            {equipment.status.charAt(0) + equipment.status.slice(1).toLowerCase()}
          </span>
        </div>

        {/* 3 Métriques / Clés immédiates */}
        <div className="mt-4 pt-3 border-t border-[#E2E8F0] grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#44474f] shrink-0">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-[#44474f]">Emplacement</p>
              <p className="font-semibold text-[#181c1f] truncate">{equipment.location}</p>
            </div>
          </div>

          <div
            onClick={() => equipment.customerId && navigate('client-detail', { customerId: equipment.customerId })}
            className={`flex items-center space-x-2 ${equipment.customerId ? 'cursor-pointer group' : ''}`}
          >
            <div className="w-7 h-7 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#44474f] shrink-0 group-hover:bg-[#EEF4FF]">
              <span className="material-symbols-outlined text-[16px]">domain</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-[#44474f]">Client</p>
              <p className="font-semibold text-[#181c1f] truncate group-hover:text-[#002452]">
                {equipment.customerName || 'Stock interne (Non affecté)'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CYCLE DE VIE LINÉAIRE (Stepper 4 jalons exact Stitch) */}
      <section className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-none">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-xs text-[#181c1f]">Cycle de vie matériel</h3>
          <span className="font-mono text-[11px] text-[#44474f]">
            Étape {equipment.lifecycleStep} / 4
          </span>
        </div>

        <div className="relative flex items-center justify-between w-full pt-1 pb-1">
          {/* Continuous Connection Line */}
          <div className="absolute left-4 right-4 top-3.5 h-[2px] bg-[#E2E8F0] z-0"></div>
          <div
            className="absolute left-4 top-3.5 h-[2px] bg-[#1B3A6B] z-0 transition-all duration-300"
            style={{ width: `${((equipment.lifecycleStep - 1) / 3) * 90}%` }}
          ></div>

          {/* Jalon 1: Acheté */}
          <div className="flex flex-col items-center relative z-10">
            <div className="w-7 h-7 rounded-full bg-[#1B3A6B] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[15px] font-bold">check</span>
            </div>
            <span className="mt-1.5 font-sans text-[11px] text-[#181c1f] font-medium">Acheté</span>
          </div>

          {/* Jalon 2: Stock */}
          <div className="flex flex-col items-center relative z-10">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shadow-xs ${
                equipment.lifecycleStep >= 2 ? 'bg-[#1B3A6B] text-white' : 'bg-white border-2 border-slate-300 text-slate-400'
              }`}
            >
              {equipment.lifecycleStep >= 2 ? (
                <span className="material-symbols-outlined text-[15px] font-bold">check</span>
              ) : (
                <span className="text-[11px]">2</span>
              )}
            </div>
            <span className="mt-1.5 font-sans text-[11px] text-[#181c1f] font-medium">Stock</span>
          </div>

          {/* Jalon 3: Réservé */}
          <div className="flex flex-col items-center relative z-10">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shadow-xs ${
                equipment.lifecycleStep >= 3 ? 'bg-[#1B3A6B] text-white' : 'bg-white border-2 border-slate-300 text-slate-400'
              }`}
            >
              {equipment.lifecycleStep >= 3 ? (
                <span className="material-symbols-outlined text-[15px] font-bold">check</span>
              ) : (
                <span className="text-[11px]">3</span>
              )}
            </div>
            <span className="mt-1.5 font-sans text-[11px] text-[#181c1f] font-medium">Réservé</span>
          </div>

          {/* Jalon 4: Installé */}
          <div className="flex flex-col items-center relative z-10">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                equipment.lifecycleStep === 4
                  ? 'bg-white border-2 border-[#1B3A6B] text-[#1B3A6B] ring-4 ring-[#E0F7F7]'
                  : 'bg-white border-2 border-slate-300 text-slate-400'
              }`}
            >
              {equipment.lifecycleStep === 4 ? (
                <div className="w-2.5 h-2.5 rounded-full bg-[#1B3A6B]"></div>
              ) : (
                <span className="text-[11px]">4</span>
              )}
            </div>
            <span
              className={`mt-1.5 font-sans text-[11px] ${
                equipment.lifecycleStep === 4 ? 'text-[#002452] font-bold' : 'text-[#64748B]'
              }`}
            >
              Installé
            </span>
          </div>
        </div>
      </section>

      {/* 4. SYSTÈME D'ONGLETS HORIZONTAUX */}
      <div>
        <nav aria-label="Sections matériel" className="flex border-b border-[#E2E8F0]">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-2.5 px-4 font-display font-semibold text-xs flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'info'
                ? 'border-[#1B3A6B] text-[#1B3A6B]'
                : 'border-transparent text-[#64748B] hover:text-[#1A1A2E]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">info</span>
            <span>Informations</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-4 font-display font-semibold text-xs flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'history'
                ? 'border-[#1B3A6B] text-[#1B3A6B]'
                : 'border-transparent text-[#64748B] hover:text-[#1A1A2E]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>Historique ({equipment.history?.length || 1})</span>
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`pb-2.5 px-4 font-display font-semibold text-xs flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'docs'
                ? 'border-[#1B3A6B] text-[#1B3A6B]'
                : 'border-transparent text-[#64748B] hover:text-[#1A1A2E]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            <span>Documents ({relatedDocs.length})</span>
          </button>
        </nav>
      </div>

      {/* 5. CONTENU DE L'ONGLET ACTIF */}
      {activeTab === 'info' && (
        <section className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-none space-y-3 text-xs">
          {/* Paire: N° Série */}
          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0]/60">
            <span className="text-[#44474f]">Numéro de série</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[#181c1f] tracking-wider bg-[#F1F5F9] px-2 py-0.5 rounded font-bold">
                {equipment.serialNumber}
              </span>
              <button
                onClick={handleCopySN}
                className="text-[#44474f] hover:text-[#1B3A6B] p-1 rounded hover:bg-[#F1F5F9] active:scale-90 transition-all"
                title="Copier le numéro de série"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copiedSN ? 'done' : 'content_copy'}
                </span>
              </button>
            </div>
          </div>

          {/* Paire: Adresse MAC */}
          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0]/60">
            <span className="text-[#44474f]">Adresse MAC</span>
            <span className="font-mono text-[#181c1f]">{equipment.macAddress}</span>
          </div>

          {/* Paire: Coût d'achat */}
          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0]/60">
            <span className="text-[#44474f]">Coût d'achat</span>
            <span className="font-display font-semibold text-sm text-[#181c1f]">
              {equipment.costPrice.toLocaleString('fr-FR')} FCFA
            </span>
          </div>

          {/* Paire: Date d'achat */}
          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0]/60">
            <span className="text-[#44474f]">Date d'achat</span>
            <span className="text-[#181c1f]">{equipment.purchaseDate}</span>
          </div>

          {/* Paire: Garantie */}
          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0]/60">
            <span className="text-[#44474f]">Garantie constructeur</span>
            <div className="text-right">
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#E6F4F1] text-[#0A7A6E] text-[11px] font-semibold">
                Active
              </span>
              <p className="text-[11px] text-[#44474f] mt-0.5">{equipment.warranty}</p>
            </div>
          </div>

          {/* Paire: Accessoires */}
          <div className="pt-1">
            <span className="block text-[#44474f] mb-2 font-medium">Accessoires associés</span>
            <div className="flex flex-wrap gap-1.5">
              {(equipment.associatedAccessories || ['Câble 25m', 'Alimentation', 'Support toit']).map(
                (acc, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[11px] text-[#181c1f] bg-[#F1F5F9] px-2.5 py-1 rounded"
                  >
                    <span className="material-symbols-outlined text-[13px] text-[#44474f]">
                      {acc.includes('Câble') ? 'cable' : acc.includes('Alimentation') ? 'power' : 'roofing'}
                    </span>
                    <span>{acc}</span>
                  </span>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'history' && (
        <section className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-none space-y-3">
          <h4 className="font-display font-bold text-xs text-[#002452] uppercase tracking-wider">
            Journal des Événements & Traçabilité
          </h4>
          <div className="space-y-3 border-l-2 border-[#1B3A6B] pl-4 ml-2 text-xs">
            {(equipment.history || []).map((h, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#1B3A6B] ring-2 ring-white"></span>
                <span className="font-mono text-[10px] text-[#64748B] block">{h.date}</span>
                <p className="font-semibold text-[#1A1A2E] mt-0.5">{h.event}</p>
                <p className="text-[11px] text-[#64748B]">Opérateur : {h.operator}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'docs' && (
        <section className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-none space-y-2.5">
          <h4 className="font-display font-bold text-xs text-[#002452] uppercase tracking-wider">
            Documents techniques & PVs rattachés
          </h4>
          {relatedDocs.length === 0 ? (
            <p className="text-xs text-[#64748B]">Aucun document spécifique rattaché à cet équipement.</p>
          ) : (
            relatedDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate('document-preview', { documentId: doc.id })}
                className="p-3 border border-[#E2E8F0] rounded-xl flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-[#E0F7F7] text-[#006a6a] flex items-center justify-center text-xs font-mono font-bold">
                    {doc.type}
                  </span>
                  <div>
                    <h5 className="font-display font-bold text-xs text-[#002452]">{doc.title}</h5>
                    <p className="font-mono text-[10px] text-[#64748B]">{doc.id} • {doc.date}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#64748B]">chevron_right</span>
              </div>
            ))
          )}
        </section>
      )}

      {/* 6. ACTIONS CONTEXTUELLES EN BAS DU CONTENU */}
      <section className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={() => setIsTransferModalOpen(true)}
          className="w-full h-11 px-4 bg-white border border-[#CBD5E1] rounded-xl text-[#181c1f] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#F1F5F9] active:scale-95 transition-all shadow-xs"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
          <span>Transférer</span>
        </button>
        <button
          onClick={() => setIsInterventionModalOpen(true)}
          className="w-full h-11 px-4 bg-[#1B3A6B] text-white rounded-xl font-display font-semibold text-xs flex items-center justify-center gap-2 shadow-sm hover:brightness-110 active:scale-95 transition-all"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">build</span>
          <span>Nouvelle Intervention</span>
        </button>
      </section>

      {/* Transfer Location Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-[#E2E8F0]">
            <h3 className="font-display font-bold text-base text-[#002452]">Transférer l’Équipement</h3>
            <p className="text-xs text-[#64748B] mt-1">
              Emplacement actuel : <strong>{equipment.location}</strong>
            </p>

            <form onSubmit={handleTransferSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A2E] mb-1">
                  Nouvel Emplacement ou Site
                </label>
                <input
                  type="text"
                  value={newLocationInput}
                  onChange={(e) => setNewLocationInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="py-2 text-xs font-semibold text-[#64748B] bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="py-2 text-xs font-semibold text-white bg-[#002452] rounded-xl"
                >
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Intervention Modal */}
      <NewInterventionModal
        isOpen={isInterventionModalOpen}
        onClose={() => setIsInterventionModalOpen(false)}
        presetEquipmentId={equipment.id}
      />
    </div>
  );
};
