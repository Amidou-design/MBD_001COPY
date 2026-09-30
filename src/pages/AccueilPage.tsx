import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NewSaleModal } from '../components/modals/NewSaleModal';
import { NewClientModal } from '../components/modals/NewClientModal';
import { BarcodeScannerModal } from '../components/common/BarcodeScannerModal';

export const AccueilPage: React.FC = () => {
  const {
    products,
    sales,
    customers,
    interventions,
    navigate,
    runScenarioComplete,
  } = useApp();

  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scenarioFeedback, setScenarioFeedback] = useState<string | null>(null);

  // Calculate live dynamic KPIs from actual store
  const totalStockValue = products.reduce((acc, p) => acc + p.currentStock * p.costPrice, 0);
  const totalRefs = products.length;
  const totalSalesRevenue = sales.reduce((acc, s) => acc + s.totalTTC, 0);
  const totalMargin = sales.reduce((acc, s) => acc + s.margin, 0);
  const totalSubtotal = sales.reduce((acc, s) => acc + s.subtotal, 0);
  const calculatedMarginRate = totalSubtotal > 0 ? ((totalMargin / totalSubtotal) * 100).toFixed(1) : '32.4';
  const totalUnpaidBalance = customers.reduce((acc, c) => acc + c.balance, 0);
  const lateCustomersCount = customers.filter((c) => c.balance > 0).length;

  const handleRunScenario = () => {
    const res = runScenarioComplete();
    setScenarioFeedback(res.message);
    setTimeout(() => setScenarioFeedback(null), 5000);
  };

  return (
    <div className="flex flex-col w-full max-w-screen-md mx-auto px-4 py-4 gap-5">
      {/* Scenario runner banner (Section 37 of User Prompt) */}
      <div className="bg-gradient-to-r from-[#002452] to-[#1B3A6B] text-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#3EC8C8]/20 flex items-center justify-center text-[#75f6f6] shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[20px]">auto_mode</span>
          </div>
          <div>
            <h3 className="font-display font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
              <span>Scénario d'Or Complet (Section 37)</span>
              <span className="px-1.5 py-0.2 bg-[#007070] text-[#75f6f6] rounded text-[10px] uppercase font-mono">
                Interconnecté
              </span>
            </h3>
            <p className="text-[11px] text-white/80 mt-0.5 leading-snug">
              Achat 5 MikroTik + 610m Cat6 + 500 RJ45 → Inventaire & Écart → Vente → Installation → Intervention → Documents
            </p>
          </div>
        </div>
        <button
          onClick={handleRunScenario}
          type="button"
          className="self-stretch sm:self-auto px-4 py-2 bg-[#3EC8C8] hover:bg-[#20b2aa] text-[#001a40] font-display font-bold text-xs rounded-xl shadow-sm transition-transform active:scale-95 whitespace-nowrap text-center"
        >
          Exécuter le cycle complet
        </button>
      </div>

      {scenarioFeedback && (
        <div className="p-3 bg-[#E0F7F7] border border-[#006a6a]/30 text-[#007070] text-xs font-semibold rounded-xl flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{scenarioFeedback}</span>
        </div>
      )}

      {/* Greeting Header Banner */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="font-display font-bold text-[20px] text-[#002452]">Bonjour Amidou</h1>
            <p className="font-sans text-[12px] text-[#64748B]">Vue d'ensemble de l'activité en temps réel</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E0F7F7] text-[#007070] font-sans text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006a6a] animate-pulse"></span>
            Synchronisé
          </span>
        </div>
      </div>

      {/* Primary Metric: Quick Summary Grid (4 KPIs) */}
      <div className="grid grid-cols-2 gap-3">
        {/* KPI 1: Valeur Stock */}
        <div
          onClick={() => navigate('stock')}
          className="bg-white rounded-xl p-3.5 shadow-xs border border-[#E2E8F0] flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-[#64748B] truncate">Valeur du Stock</span>
            <div className="w-7 h-7 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#002452] shrink-0">
              <span className="material-symbols-outlined text-[16px]">inventory_2</span>
            </div>
          </div>
          <div className="flex flex-col mt-1">
            <span className="font-display font-bold text-xl text-[#002452] tracking-tight">
              {(totalStockValue / 1000000).toFixed(2).replace('.', ',')}M
            </span>
            <span className="font-mono text-[11px] text-[#64748B]">
              {totalStockValue.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-[11px] text-[#006a6a] font-semibold">{totalRefs} articles</span>
            <span className="text-[11px] text-[#64748B]">en dépôt</span>
          </div>
        </div>

        {/* KPI 2: CA du Mois */}
        <div
          onClick={() => navigate('ventes')}
          className="bg-white rounded-xl p-3.5 shadow-xs border border-[#E2E8F0] flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-[#64748B] truncate">CA Facturé</span>
            <div className="w-7 h-7 rounded-lg bg-[#E0F7F7] flex items-center justify-center text-[#006a6a] shrink-0">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
            </div>
          </div>
          <div className="flex flex-col mt-1">
            <span className="font-display font-bold text-xl text-[#002452] tracking-tight">
              {(totalSalesRevenue / 1000000).toFixed(2).replace('.', ',')}M
            </span>
            <span className="font-mono text-[11px] text-[#64748B]">
              {totalSalesRevenue.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-[11px] text-[#006a6a] font-semibold">{sales.length} ventes</span>
            <span className="text-[11px] text-[#64748B]">enregistrées</span>
          </div>
        </div>

        {/* KPI 3: Marge Brute */}
        <div
          onClick={() => navigate('reports')}
          className="bg-white rounded-xl p-3.5 shadow-xs border border-[#E2E8F0] flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-[#64748B] truncate">Marge Brute</span>
            <div className="w-7 h-7 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#1B3A6B] shrink-0">
              <span className="material-symbols-outlined text-[16px]">pie_chart</span>
            </div>
          </div>
          <div className="flex flex-col mt-1">
            <span className="font-display font-bold text-xl text-[#002452] tracking-tight">
              {calculatedMarginRate}%
            </span>
            <span className="text-[11px] text-[#006a6a] font-medium flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              +2.1% vs m-1
            </span>
          </div>
          <div className="mt-2 w-full bg-[#F1F5F9] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#006a6a] h-full rounded-full" style={{ width: `${Math.min(100, parseFloat(calculatedMarginRate) * 2)}%` }}></div>
          </div>
        </div>

        {/* KPI 4: Créances Clients */}
        <div
          onClick={() => navigate('clients')}
          className="bg-white rounded-xl p-3.5 shadow-xs border border-[#E2E8F0] flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-[#64748B] truncate">Créances</span>
            <div className="w-7 h-7 rounded-lg bg-[#FEF2F2] flex items-center justify-center text-[#EF4444] shrink-0">
              <span className="material-symbols-outlined text-[16px]">warning</span>
            </div>
          </div>
          <div className="flex flex-col mt-1">
            <span className="font-display font-bold text-xl text-[#002452] tracking-tight">
              {(totalUnpaidBalance / 1000000).toFixed(2).replace('.', ',')}M
            </span>
            <span className="font-mono text-[11px] text-[#64748B]">
              {totalUnpaidBalance.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-[11px] text-[#EF4444] font-semibold">{lateCustomersCount} comptes</span>
            <span className="text-[11px] text-[#64748B]">en attente</span>
          </div>
        </div>
      </div>

      {/* Performance Visualizer: Evolution CA & Marge (From Stitch HTML 1) */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-[#E2E8F0] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-sm text-[#002452]">Tendance Trimestrielle</h2>
            <p className="font-sans text-[11px] text-[#64748B]">Chiffre d'Affaires vs Marge brute</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] text-[#002452] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#1B3A6B]"></span>
              CA
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#006a6a] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#006a6a]"></span>
              Marge
            </span>
          </div>
        </div>

        {/* Minimal Clean Spark/Bar Combo Graph */}
        <div className="w-full flex flex-col gap-2 pt-1">
          <div className="relative w-full h-32 flex items-end justify-between px-4 pb-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]/60">
            {/* SVG Grid Guide Lines & Trend overlay path for margin */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none p-3" preserveAspectRatio="none" viewBox="0 0 100 100">
              <line stroke="#CBD5E1" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="100" y1="25" y2="25"></line>
              <line stroke="#CBD5E1" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="100" y1="60" y2="60"></line>
              <polyline fill="none" points="15,62 50,45 85,32" stroke="#006a6a" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></polyline>
              <circle className="ring-2 ring-white" cx="15" cy="62" fill="#006a6a" r="2.5"></circle>
              <circle cx="50" cy="45" fill="#006a6a" r="2.5"></circle>
              <circle cx="85" cy="32" fill="#006a6a" r="2.5"></circle>
            </svg>

            {/* Octobre */}
            <div className="flex flex-col items-center gap-1 z-10 w-1/5">
              <div className="w-7 bg-[#1B3A6B]/80 rounded-t transition-all hover:bg-[#002452]" style={{ height: '52px' }}></div>
              <span className="font-sans text-[11px] text-[#64748B]">Oct</span>
            </div>
            {/* Novembre */}
            <div className="flex flex-col items-center gap-1 z-10 w-1/5">
              <div className="w-7 bg-[#1B3A6B]/80 rounded-t transition-all hover:bg-[#002452]" style={{ height: '72px' }}></div>
              <span className="font-sans text-[11px] text-[#64748B]">Nov</span>
            </div>
            {/* Décembre (En cours) */}
            <div className="flex flex-col items-center gap-1 z-10 w-1/5">
              <div className="w-7 bg-[#002452] rounded-t relative flex items-end justify-center" style={{ height: '90px' }}>
                <span className="absolute -top-4 text-[9px] font-bold text-[#006a6a]">32.4%</span>
              </div>
              <span className="font-sans text-[11px] font-bold text-[#002452]">Déc</span>
            </div>
          </div>
          <div className="flex justify-between items-center px-1 font-sans text-[11px] text-[#64748B]">
            <span>Oct: 14.8M (30.1%)</span>
            <span>Nov: 16.2M (31.8%)</span>
            <span className="text-[#006a6a] font-semibold">Déc: 18.4M (32.4%)</span>
          </div>
        </div>
      </div>

      {/* Operational Alerts: "À surveiller" (3 items from Stitch) */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-sm text-[#002452]">À surveiller</h2>
            <span className="w-5 h-5 rounded-full bg-[#FEF2F2] text-[#EF4444] text-[11px] flex items-center justify-center font-bold">
              3
            </span>
          </div>
          <button
            onClick={() => navigate('interventions')}
            className="text-[11px] font-semibold text-[#006a6a] hover:underline"
          >
            Tout afficher
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {/* Item 1: Urgent Intervention */}
          <div
            onClick={() => navigate('interventions')}
            className="bg-white rounded-xl p-3 border border-[#E2E8F0] shadow-xs flex items-start gap-3 cursor-pointer hover:border-slate-300"
          >
            <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">build_circle</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-display font-bold text-xs text-[#002452] truncate">Maintenance Groupe Koumassi</p>
                <span className="px-1.5 py-0.2 rounded-full bg-[#FEF2F2] text-[#EF4444] font-mono text-[10px] font-bold">
                  Urgent
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-0.5 truncate">
                Arrêt préventif nécessaire • Tech assigné : M. Traoré
              </p>
            </div>
          </div>

          {/* Item 2: Stock Alert 1 */}
          <div
            onClick={() => navigate('stock')}
            className="bg-white rounded-xl p-3 border border-[#E2E8F0] shadow-xs flex items-start gap-3 cursor-pointer hover:border-slate-300"
          >
            <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] text-[#006a6a] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">production_quantity_limits</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-display font-bold text-xs text-[#002452] truncate">Câble Cuivre 16mm² (Rouleau)</p>
                <span className="px-1.5 py-0.2 rounded-full bg-[#FEF2F2] text-[#EF4444] font-mono text-[10px] font-bold">
                  Reste: 3 un.
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-0.5 truncate">
                Seuil critique (5) atteint • Réapprovisionnement requis
              </p>
            </div>
          </div>

          {/* Item 3: Stock Alert 2 */}
          <div
            onClick={() => navigate('stock')}
            className="bg-white rounded-xl p-3 border border-[#E2E8F0] shadow-xs flex items-start gap-3 cursor-pointer hover:border-slate-300"
          >
            <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] text-[#006a6a] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">production_quantity_limits</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-display font-bold text-xs text-[#002452] truncate">Disjoncteur Diff. 32A Legrand</p>
                <span className="px-1.5 py-0.2 rounded-full bg-[#F1F5F9] font-mono text-[10px] text-[#64748B] font-bold">
                  Reste: 6 un.
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-0.5 truncate">
                Fournisseur : BluePower Ltd • Délai 48h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fast Actions (Accès Rapides - 4 buttons from Stitch) */}
      <div className="flex flex-col gap-2">
        <h2 className="font-display font-bold text-sm text-[#002452]">Accès Rapides</h2>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => setIsSaleModalOpen(true)}
            type="button"
            className="bg-white rounded-xl p-2.5 shadow-xs border border-[#E2E8F0] flex flex-col items-center gap-1.5 active:bg-[#F1F5F9] transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#002452] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
            </div>
            <span className="text-[11px] font-medium text-[#002452] text-center leading-tight">Nouvelle Vente</span>
          </button>

          <button
            onClick={() => setIsScannerOpen(true)}
            type="button"
            className="bg-white rounded-xl p-2.5 shadow-xs border border-[#E2E8F0] flex flex-col items-center gap-1.5 active:bg-[#F1F5F9] transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] text-[#002452] flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
            </div>
            <span className="text-[11px] font-medium text-[#002452] text-center leading-tight">Scanner Inv.</span>
          </button>

          <button
            onClick={() => setIsClientModalOpen(true)}
            type="button"
            className="bg-white rounded-xl p-2.5 shadow-xs border border-[#E2E8F0] flex flex-col items-center gap-1.5 active:bg-[#F1F5F9] transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#E0F7F7] text-[#006a6a] flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">person_add</span>
            </div>
            <span className="text-[11px] font-medium text-[#002452] text-center leading-tight">Nouv. Client</span>
          </button>

          <button
            onClick={() => navigate('documents')}
            type="button"
            className="bg-white rounded-xl p-2.5 shadow-xs border border-[#E2E8F0] flex flex-col items-center gap-1.5 active:bg-[#F1F5F9] transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] text-[#002452] flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </div>
            <span className="text-[11px] font-medium text-[#002452] text-center leading-tight">Bordereaux</span>
          </button>
        </div>
      </div>

      {/* Compact Recent Activity Log (From Stitch HTML 1) */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-[#E2E8F0] flex flex-col gap-2.5 mb-2">
        <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
          <h2 className="font-display font-bold text-sm text-[#002452]">Activité Récente</h2>
          <span className="font-mono text-[11px] text-[#64748B]">Aujourd'hui</span>
        </div>

        <div className="flex flex-col divide-y divide-[#E2E8F0]/60">
          {/* Item A */}
          <div
            onClick={() => navigate('ventes')}
            className="flex items-center justify-between py-2.5 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#E0F7F7] text-[#006a6a] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px]">receipt</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-display font-bold text-xs text-[#002452] truncate">Facture #FC-2024-089</span>
                <span className="text-[11px] text-[#64748B] truncate">SARL Bâtiment Pro • 14:22</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-display font-bold text-xs text-[#002452]">+450 000 F</span>
              <span className="block text-[10px] text-[#006a6a] font-semibold">Payé</span>
            </div>
          </div>

          {/* Item B */}
          <div
            onClick={() => navigate('purchases')}
            className="flex items-center justify-between py-2.5 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#002452] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-display font-bold text-xs text-[#002452] truncate">Arrivage Stock Quai B</span>
                <span className="text-[11px] text-[#64748B] truncate">48 unités reçues • 11:40</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-mono text-[10px] text-[#64748B]">BL-9812</span>
              <span className="block text-[10px] text-[#64748B]">Conforme</span>
            </div>
          </div>

          {/* Item C */}
          <div
            onClick={() => navigate('clients')}
            className="flex items-center justify-between py-2.5 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px]">notification_important</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-display font-bold text-xs text-[#002452] truncate">Relance Client Eburnie</span>
                <span className="text-[11px] text-[#64748B] truncate">Échéance 45 jours • 09:15</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-display font-bold text-xs text-[#EF4444]">850 000 F</span>
              <span className="block text-[10px] text-[#EF4444] font-semibold">En retard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <NewSaleModal isOpen={isSaleModalOpen} onClose={() => setIsSaleModalOpen(false)} />
      <NewClientModal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} />
      <BarcodeScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </div>
  );
};
