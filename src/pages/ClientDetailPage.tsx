import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NewSaleModal } from '../components/modals/NewSaleModal';

export const ClientDetailPage: React.FC = () => {
  const {
    customers,
    sites,
    equipments,
    sales,
    documents,
    interventions,
    selectedCustomerId,
    goBack,
    navigate,
    addSite,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'sites' | 'equipments' | 'invoices' | 'docs' | 'interventions'
  >('overview');

  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isNewSiteModalOpen, setIsNewSiteModalOpen] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteCity, setNewSiteCity] = useState('Ouagadougou');
  const [newSiteAddress, setNewSiteAddress] = useState('');

  const customer =
    customers.find((c) => c.id === selectedCustomerId) ||
    customers[0];

  if (!customer) {
    return (
      <div className="p-8 text-center">
        <p>Client non trouvé.</p>
        <button onClick={goBack} className="mt-3 text-xs text-[#002452] underline">
          Retour aux clients
        </button>
      </div>
    );
  }

  const clientSites = sites.filter((s) => s.customerId === customer.id);
  const clientEquipments = equipments.filter((e) => e.customerId === customer.id);
  const clientSales = sales.filter((s) => s.customerId === customer.id);
  const clientDocs = documents.filter((d) => d.customerId === customer.id);
  const clientInterventions = interventions.filter((i) => i.customerId === customer.id);

  const handleCreateSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName.trim()) return;
    addSite({
      customerId: customer.id,
      customerName: customer.name,
      name: newSiteName.trim(),
      city: newSiteCity,
      address: newSiteAddress || newSiteCity,
      status: 'Actif',
    });
    setNewSiteName('');
    setIsNewSiteModalOpen(false);
  };

  return (
    <div className="w-full max-w-screen-md mx-auto flex flex-col pb-6 text-xs">
      {/* Bloc en-tête client (Stitch HTML 7) */}
      <div className="px-4 pt-3 pb-1 bg-white border-b border-[#E2E8F0]">
        <h1 className="font-display font-bold text-2xl text-[#1A1A2E] tracking-tight leading-tight">
          {customer.name}
        </h1>
        <div className="flex items-center gap-2 mt-1.5 text-xs flex-wrap">
          <span className="font-mono text-[#64748B] font-medium">{customer.id}</span>
          <span className="text-slate-300">•</span>
          <span className="text-[#64748B] font-medium">{customer.phone}</span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#E6F4F1] text-[#0A7A6E] font-semibold text-[11px]">
            {customer.status}
          </span>
        </div>

        {/* 2. SYSTÈME D'ONGLETS HORIZONTAUX (Stitch HTML 7) */}
        <nav className="flex items-center gap-5 overflow-x-auto no-scrollbar mt-4 border-b border-[#E2E8F0] -mx-4 px-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'text-[#1B3A6B] border-[#1B3A6B]'
                : 'text-[#64748B] border-transparent hover:text-[#1A1A2E]'
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('sites')}
            className={`pb-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'sites'
                ? 'text-[#1B3A6B] border-[#1B3A6B]'
                : 'text-[#64748B] border-transparent hover:text-[#1A1A2E]'
            }`}
          >
            Sites ({clientSites.length})
          </button>
          <button
            onClick={() => setActiveTab('equipments')}
            className={`pb-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'equipments'
                ? 'text-[#1B3A6B] border-[#1B3A6B]'
                : 'text-[#64748B] border-transparent hover:text-[#1A1A2E]'
            }`}
          >
            Équipements ({clientEquipments.length})
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`pb-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'invoices'
                ? 'text-[#1B3A6B] border-[#1B3A6B]'
                : 'text-[#64748B] border-transparent hover:text-[#1A1A2E]'
            }`}
          >
            Factures ({clientSales.length})
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`pb-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'docs'
                ? 'text-[#1B3A6B] border-[#1B3A6B]'
                : 'text-[#64748B] border-transparent hover:text-[#1A1A2E]'
            }`}
          >
            Documents ({clientDocs.length})
          </button>
          <button
            onClick={() => setActiveTab('interventions')}
            className={`pb-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'interventions'
                ? 'text-[#1B3A6B] border-[#1B3A6B]'
                : 'text-[#64748B] border-transparent hover:text-[#1A1A2E]'
            }`}
          >
            Interventions ({clientInterventions.length})
          </button>
        </nav>
      </div>

      {/* CONTENU DE L'ONGLET ACTIF */}
      <div className="p-4 flex flex-col gap-4">
        {activeTab === 'overview' && (
          <>
            {/* Grille 2x2 de 4 indicateurs fondamentaux (Stitch HTML 7) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Solde en cours */}
              <div className="bg-white rounded-xl p-3.5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
                <span className="text-[11px] font-medium text-[#64748B]">Solde en cours</span>
                <span className="font-display font-bold text-lg text-[#1A1A2E] tracking-tight mt-1">
                  {customer.balance.toLocaleString('fr-FR')} FCFA
                </span>
              </div>

              {/* Total facturé */}
              <div className="bg-white rounded-xl p-3.5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
                <span className="text-[11px] font-medium text-[#64748B]">Total facturé</span>
                <span className="font-display font-bold text-lg text-[#1A1A2E] tracking-tight mt-1">
                  {customer.totalBilled.toLocaleString('fr-FR')} FCFA
                </span>
              </div>

              {/* Nombre de sites */}
              <div className="bg-white rounded-xl p-3.5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
                <span className="text-[11px] font-medium text-[#64748B]">Nombre de sites</span>
                <span className="font-display font-bold text-lg text-[#1A1A2E] tracking-tight mt-1">
                  {clientSites.length} site{clientSites.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Matériel actif */}
              <div className="bg-white rounded-xl p-3.5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
                <span className="text-[11px] font-medium text-[#64748B]">Matériel actif</span>
                <span className="font-display font-bold text-lg text-[#1A1A2E] tracking-tight mt-1">
                  {clientEquipments.length} équipement{clientEquipments.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Bloc contact synthétique (Stitch HTML 7) */}
            <div className="bg-white rounded-xl p-3.5 border border-[#E2E8F0] shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <span className="material-symbols-outlined text-[19px]">person</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-[#1A1A2E] truncate">
                    Responsable : {customer.contactName}
                  </span>
                  <span className="text-[11px] text-[#64748B] truncate">{customer.address}</span>
                </div>
              </div>
              <a
                href={`tel:${customer.phone.replace(/\s+/g, '')}`}
                aria-label="Appeler responsable"
                className="w-9 h-9 rounded-full bg-[#E6F4F1] text-[#0A7A6E] flex items-center justify-center shrink-0 active:scale-95 transition-transform ml-2"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
              </a>
            </div>

            {/* SECTION LISTE SOMMAIRE DES SITES (Stitch HTML 7) */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between px-0.5">
                <h3 className="font-display text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Sites de déploiement ({clientSites.length})
                </h3>
                <button
                  onClick={() => setActiveTab('sites')}
                  className="text-[#1B3A6B] text-[11px] font-semibold hover:underline"
                >
                  Voir tous les sites
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {clientSites.map((site) => {
                  const siteEquipments = equipments.filter((e) => e.siteId === site.id);
                  return (
                    <div
                      key={site.id}
                      className="bg-white rounded-xl px-4 py-3 border border-[#E2E8F0] shadow-xs flex items-center justify-between"
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="text-xs font-bold text-[#1A1A2E] truncate">{site.name}</span>
                        <span className="text-[11px] text-[#64748B] mt-0.5">
                          {siteEquipments.length > 0
                            ? `${siteEquipments.length} équipement(s) connecté(s)`
                            : `${site.city} — ${site.address}`}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#E6F4F1] text-[#0A7A6E] text-[10px] font-bold shrink-0">
                        {site.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DEUX ACTIONS RAPIDES FIXES EN BAS (Stitch HTML 7) */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setIsNewSiteModalOpen(true)}
                type="button"
                className="bg-white border border-[#CBD5E1] text-[#1A1A2E] rounded-xl py-3 text-xs font-semibold active:scale-[0.98] transition-transform flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>+ Nouveau Site</span>
              </button>
              <button
                onClick={() => setIsSaleModalOpen(true)}
                type="button"
                className="bg-[#1B3A6B] text-white rounded-xl py-3 text-xs font-semibold active:scale-[0.98] transition-transform flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>+ Nouvelle Vente / Facture</span>
              </button>
            </div>
          </>
        )}

        {/* ONGLET SITES */}
        {activeTab === 'sites' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xs text-[#002452]">Tous les sites raccordés</h3>
              <button
                onClick={() => setIsNewSiteModalOpen(true)}
                className="text-xs font-semibold text-[#006a6a] hover:underline"
              >
                + Ajouter un site
              </button>
            </div>

            {clientSites.map((s) => (
              <div key={s.id} className="p-3 bg-white rounded-xl border border-[#E2E8F0] space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-xs text-[#002452]">{s.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#E0F7F7] text-[#007070] font-bold">
                    {s.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B]">{s.address} • {s.city}</p>
                <div className="pt-2 border-t border-[#E2E8F0]/70 flex justify-between text-[11px] text-[#64748B]">
                  <span>Matériels installés : {equipments.filter((e) => e.siteId === s.id).length}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ONGLET ÉQUIPEMENTS */}
        {activeTab === 'equipments' && (
          <div className="space-y-3">
            <h3 className="font-display font-bold text-xs text-[#002452]">Équipements déployés chez le client</h3>
            {clientEquipments.length === 0 ? (
              <p className="text-xs text-[#64748B]">Aucun équipement encore affecté.</p>
            ) : (
              clientEquipments.map((eq) => (
                <div
                  key={eq.id}
                  onClick={() => navigate('equipment-detail', { equipmentId: eq.id })}
                  className="p-3 bg-white rounded-xl border border-[#E2E8F0] flex items-center justify-between hover:border-slate-300 cursor-pointer"
                >
                  <div>
                    <h4 className="font-display font-bold text-xs text-[#002452]">{eq.productName}</h4>
                    <p className="font-mono text-[10px] text-[#64748B]">{eq.internalCode} • SN: {eq.serialNumber}</p>
                    <p className="text-[10px] text-[#006a6a] mt-0.5">{eq.location}</p>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-[#64748B]">chevron_right</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* ONGLET FACTURES */}
        {activeTab === 'invoices' && (
          <div className="space-y-3">
            <h3 className="font-display font-bold text-xs text-[#002452]">Historique de facturation</h3>
            {clientSales.length === 0 ? (
              <p className="text-xs text-[#64748B]">Aucune facture émise pour le moment.</p>
            ) : (
              clientSales.map((s) => (
                <div
                  key={s.id}
                  onClick={() => navigate('document-preview', { documentId: s.invoiceNumber })}
                  className="p-3 bg-white rounded-xl border border-[#E2E8F0] flex items-center justify-between hover:border-slate-300 cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#002452]">{s.invoiceNumber}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#DCFCE7] text-[#15803D]">
                        {s.paymentStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">{s.date}</p>
                  </div>
                  <span className="font-display font-bold text-xs text-[#002452]">
                    {s.totalTTC.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* ONGLET DOCUMENTS */}
        {activeTab === 'docs' && (
          <div className="space-y-3">
            <h3 className="font-display font-bold text-xs text-[#002452]">Documents & PVs associés</h3>
            {clientDocs.length === 0 ? (
              <p className="text-xs text-[#64748B]">Aucun document spécifique trouvé.</p>
            ) : (
              clientDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => navigate('document-preview', { documentId: doc.id })}
                  className="p-3 bg-white rounded-xl border border-[#E2E8F0] flex items-center justify-between hover:border-slate-300 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded bg-[#E0F7F7] text-[#006a6a] font-mono font-bold flex items-center justify-center text-[10px]">
                      {doc.type}
                    </span>
                    <div>
                      <h4 className="font-display font-bold text-xs text-[#002452]">{doc.title}</h4>
                      <p className="font-mono text-[10px] text-[#64748B]">{doc.id} • {doc.date}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-[#64748B]">chevron_right</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* ONGLET INTERVENTIONS */}
        {activeTab === 'interventions' && (
          <div className="space-y-3">
            <h3 className="font-display font-bold text-xs text-[#002452]">Tickets de maintenance & SAV</h3>
            {clientInterventions.length === 0 ? (
              <p className="text-xs text-[#64748B]">Aucun ticket SAV enregistré pour ce client.</p>
            ) : (
              clientInterventions.map((intv) => (
                <div
                  key={intv.id}
                  className="p-3 bg-white rounded-xl border border-[#E2E8F0] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#002452]">{intv.id}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-[#FEF2F2] text-[#EF4444]">
                      {intv.urgency}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[#1A1A2E]">{intv.equipmentTitle}</h4>
                  <p className="text-[11px] text-[#64748B]">{intv.description}</p>
                  <div className="pt-1.5 border-t border-[#E2E8F0]/70 flex justify-between text-[10px] text-[#64748B]">
                    <span>Tech : {intv.technicianName}</span>
                    <span className="font-semibold text-[#006a6a]">{intv.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal New Site */}
      {isNewSiteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-[#E2E8F0]">
            <h3 className="font-display font-bold text-base text-[#002452]">Ajouter un Site Client</h3>
            <form onSubmit={handleCreateSite} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] text-[#64748B] mb-1">Nom du Site (ex: Agence 1)</label>
                <input
                  type="text"
                  required
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#64748B] mb-1">Ville</label>
                <input
                  type="text"
                  value={newSiteCity}
                  onChange={(e) => setNewSiteCity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#64748B] mb-1">Adresse précise</label>
                <input
                  type="text"
                  value={newSiteAddress}
                  onChange={(e) => setNewSiteAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewSiteModalOpen(false)}
                  className="py-2 text-xs font-semibold text-[#64748B] bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="py-2 text-xs font-semibold text-white bg-[#002452] rounded-xl"
                >
                  Créer le site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal New Sale */}
      <NewSaleModal isOpen={isSaleModalOpen} onClose={() => setIsSaleModalOpen(false)} />
    </div>
  );
};
