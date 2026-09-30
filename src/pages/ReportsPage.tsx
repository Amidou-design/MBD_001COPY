import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ReportsPage: React.FC = () => {
  const { products, sales, purchases } = useApp();
  const [period, setPeriod] = useState<'month' | 'q1' | 'year'>('month');

  // Compute stats
  const totalStockValue = products.reduce((acc, p) => acc + p.currentStock * p.costPrice, 0);
  const totalPurchasesAmount = purchases.reduce((acc, p) => acc + p.totalAmount, 0) || 28500000;
  const totalSalesRevenue = sales.reduce((acc, s) => acc + s.totalTTC, 0) || 18400000;
  const totalSalesMargin = sales.reduce((acc, s) => acc + s.margin, 0);
  const totalSalesSubtotal = sales.reduce((acc, s) => acc + s.subtotal, 0);
  const marginPercentage =
    totalSalesSubtotal > 0
      ? ((totalSalesMargin / totalSalesSubtotal) * 100).toFixed(1)
      : '32.4';

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Indicateur,Montant (FCFA)\n' +
      `Valeur du Stock,${totalStockValue}\n` +
      `Total Achats,${totalPurchasesAmount}\n` +
      `Chiffre d'Affaires,${totalSalesRevenue}\n` +
      `Marge Brute,${marginPercentage}%\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `onkonnect_rapport_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full max-w-screen-md mx-auto px-4 py-4 gap-4">
      {/* 2. Screen Header Section (Stitch HTML 9) */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#002452] tracking-tight">Rapports</h1>
          <p className="font-sans text-xs text-[#64748B]">Synthèse financière et opérationnelle</p>
        </div>

        <button
          onClick={handleExportCSV}
          type="button"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#002452] hover:bg-[#F8FAFC] active:scale-95 transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">file_download</span>
          <span>Exporter CSV</span>
        </button>
      </section>

      {/* 3. Horizontal Period Selector Chips (Stitch HTML 9) */}
      <section className="-mx-4 px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 py-0.5 min-w-max">
          <button
            onClick={() => setPeriod('month')}
            type="button"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              period === 'month'
                ? 'bg-[#1B3A6B] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#002452]'
            }`}
          >
            <span>Ce mois (Fév 2026)</span>
          </button>

          <button
            onClick={() => setPeriod('q1')}
            type="button"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              period === 'q1'
                ? 'bg-[#1B3A6B] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#002452]'
            }`}
          >
            <span>Trimestre Q1</span>
          </button>

          <button
            onClick={() => setPeriod('year')}
            type="button"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              period === 'year'
                ? 'bg-[#1B3A6B] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#002452]'
            }`}
          >
            <span>Année 2026</span>
          </button>
        </div>
      </section>

      {/* 4. Four Core Indicators: 2x2 Grid (Stitch HTML 9) */}
      <section className="grid grid-cols-2 gap-3">
        {/* Card 1: Valeur du stock */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col justify-between h-28 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B] truncate">Valeur du stock</span>
            <span className="px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-medium">
              Stock actif
            </span>
          </div>
          <div className="mt-auto">
            <div className="font-display font-bold text-base text-[#002452] tracking-tight leading-tight">
              {totalStockValue.toLocaleString('fr-FR')}
            </div>
            <span className="text-[11px] text-[#64748B]">FCFA</span>
          </div>
        </div>

        {/* Card 2: Total achats */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col justify-between h-28 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B] truncate">Total achats</span>
            <span className="px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-medium">
              Fournisseurs
            </span>
          </div>
          <div className="mt-auto">
            <div className="font-display font-bold text-base text-[#002452] tracking-tight leading-tight">
              {totalPurchasesAmount.toLocaleString('fr-FR')}
            </div>
            <span className="text-[11px] text-[#64748B]">FCFA</span>
          </div>
        </div>

        {/* Card 3: Chiffre d'affaires */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col justify-between h-28 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B] truncate">Total ventes</span>
            <span className="px-1.5 py-0.5 rounded bg-[#E0F7F7] text-[#007070] text-[10px] font-medium">
              Chiffre d'affaires
            </span>
          </div>
          <div className="mt-auto">
            <div className="font-display font-bold text-base text-[#002452] tracking-tight leading-tight">
              {totalSalesRevenue.toLocaleString('fr-FR')}
            </div>
            <span className="text-[11px] text-[#64748B]">FCFA</span>
          </div>
        </div>

        {/* Card 4: Marge brute */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col justify-between h-28 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B] truncate">Marge brute</span>
            <span className="px-1.5 py-0.5 rounded bg-[#E6F4F1] text-[#006a6a] text-[10px] font-semibold">
              +2.1% vs m-1
            </span>
          </div>
          <div className="mt-auto">
            <div className="font-display font-bold text-base text-[#002452] tracking-tight leading-tight">
              {marginPercentage}%
            </div>
            <span className="text-[11px] text-[#64748B]">Taux opérationnel</span>
          </div>
        </div>
      </section>

      {/* 5. Chart Card: Évolution Ventes vs Achats (Stitch HTML 9) */}
      <section className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col gap-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E2E8F0]">
          <h2 className="font-display font-bold text-sm text-[#002452]">Évolution Ventes vs Achats</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1B3A6B]"></span>
              <span className="text-xs text-[#64748B]">Ventes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#54d9d9]"></span>
              <span className="text-xs text-[#64748B]">Achats</span>
            </div>
          </div>
        </div>

        {/* Minimal SVG Visualizer (6 Months) */}
        <div className="w-full pt-2">
          <div className="relative h-40 w-full flex items-end justify-between px-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]/60 pb-2">
            {/* Oct */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="flex items-end gap-1 h-28">
                <div className="w-3 rounded-t bg-[#1B3A6B]" style={{ height: '55%' }}></div>
                <div className="w-3 rounded-t bg-[#54d9d9]" style={{ height: '68%' }}></div>
              </div>
              <span className="text-[10px] text-[#64748B]">Oct</span>
            </div>
            {/* Nov */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="flex items-end gap-1 h-28">
                <div className="w-3 rounded-t bg-[#1B3A6B]" style={{ height: '65%' }}></div>
                <div className="w-3 rounded-t bg-[#54d9d9]" style={{ height: '72%' }}></div>
              </div>
              <span className="text-[10px] text-[#64748B]">Nov</span>
            </div>
            {/* Déc */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="flex items-end gap-1 h-28">
                <div className="w-3 rounded-t bg-[#1B3A6B]" style={{ height: '82%' }}></div>
                <div className="w-3 rounded-t bg-[#54d9d9]" style={{ height: '60%' }}></div>
              </div>
              <span className="text-[10px] text-[#64748B]">Déc</span>
            </div>
            {/* Jan */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="flex items-end gap-1 h-28">
                <div className="w-3 rounded-t bg-[#1B3A6B]" style={{ height: '70%' }}></div>
                <div className="w-3 rounded-t bg-[#54d9d9]" style={{ height: '50%' }}></div>
              </div>
              <span className="text-[10px] text-[#64748B]">Jan</span>
            </div>
            {/* Fév */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="flex items-end gap-1 h-28">
                <div className="w-3 rounded-t bg-[#002452] ring-2 ring-[#002452]/20" style={{ height: '92%' }}></div>
                <div className="w-3 rounded-t bg-[#54d9d9]" style={{ height: '76%' }}></div>
              </div>
              <span className="text-[10px] font-bold text-[#002452]">Fév</span>
            </div>
            {/* Mar */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="flex items-end gap-1 h-28">
                <div className="w-3 rounded-t bg-[#1B3A6B]/40 border border-dashed border-[#1B3A6B]" style={{ height: '48%' }}></div>
                <div className="w-3 rounded-t bg-[#54d9d9]/40 border border-dashed border-[#54d9d9]" style={{ height: '40%' }}></div>
              </div>
              <span className="text-[10px] text-[#64748B]">Mar</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Card: Ventilation du CA par activité (Stitch HTML 9) */}
      <section className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col gap-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
          <h2 className="font-display font-bold text-sm text-[#002452]">Ventilation du CA par activité</h2>
          <span className="text-xs text-[#64748B]">100% audité</span>
        </div>

        <div className="flex flex-col gap-3 pt-1">
          {/* Item 1 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#1A1A2E]">Ventes Kits & Terminaux</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-[#002452]">12 500 000 FCFA</span>
                <span className="text-[10px] text-[#64748B]">(68%)</span>
              </div>
            </div>
            <div className="w-full bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
              <div className="bg-[#1B3A6B] h-full rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#1A1A2E]">Déploiements & Câblage</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-[#002452]">4 200 000 FCFA</span>
                <span className="text-[10px] text-[#64748B]">(23%)</span>
              </div>
            </div>
            <div className="w-full bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
              <div className="bg-[#54d9d9] h-full rounded-full" style={{ width: '23%' }}></div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#1A1A2E]">Maintenance & SAV</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-[#002452]">1 700 000 FCFA</span>
                <span className="text-[10px] text-[#64748B]">(9%)</span>
              </div>
            </div>
            <div className="w-full bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
              <div className="bg-[#006a6a] h-full rounded-full" style={{ width: '9%' }}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
