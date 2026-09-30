import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NewSaleModal } from '../components/modals/NewSaleModal';

export const VentesPage: React.FC = () => {
  const { sales, navigate } = useApp();
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  // Dynamic Metrics (Section 4: No TVA)
  const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalMargin = sales.reduce((acc, s) => acc + s.margin, 0);
  const marginPercentage = totalRevenue > 0 ? ((totalMargin / totalRevenue) * 100).toFixed(1) : '32.4';

  return (
    <div className="flex flex-col w-full max-w-screen-md mx-auto px-4 py-4 gap-4">
      {/* Page Header & Primary Action (Exact Stitch Image 10) */}
      <section className="flex flex-col gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#002452] tracking-tight">Ventes</h1>
          <p className="font-sans text-xs text-[#64748B]">Facturation & suivi commercial</p>
        </div>

        <button
          onClick={() => setIsSaleModalOpen(true)}
          type="button"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#002452] text-white px-4 py-3 rounded-xl font-display font-semibold text-xs shadow-sm active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>+ Nouvelle vente</span>
        </button>
      </section>

      {/* 3 KPI Cards Vertical Stack (from Stitch Image 10) */}
      <section className="space-y-3">
        {/* KPI 1: Chiffre d'affaires */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-xs text-[#64748B] block font-medium">Chiffre d'affaires</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display font-bold text-2xl text-[#002452] tracking-tight">
              {totalRevenue.toLocaleString('fr-FR')}
            </span>
            <span className="font-mono text-xs text-[#64748B]">FCFA</span>
          </div>
        </div>

        {/* KPI 2: Nombre de ventes */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-xs text-[#64748B] block font-medium">Nombre de ventes</span>
          <span className="font-display font-bold text-2xl text-[#002452] block mt-1">
            {sales.length}
          </span>
        </div>

        {/* KPI 3: Marge brute */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#64748B] block font-medium">Marge brute</span>
            <span className="font-display font-bold text-2xl text-[#006a6a] block mt-1">
              {marginPercentage}%
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[#64748B] block">Bénéfice opérationnel</span>
            <span className="font-mono font-bold text-xs text-[#002452]">
              +{totalMargin.toLocaleString('fr-FR')} F
            </span>
          </div>
        </div>
      </section>

      {/* Factures récentes List Header */}
      <section className="flex flex-col gap-3 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-sm text-[#002452]">Factures récentes</h2>
          <span className="font-mono text-xs text-[#64748B]">{sales.length} enregistrements</span>
        </div>

        {/* Invoices Stack */}
        <div className="flex flex-col gap-3">
          {sales.map((sale) => {
            const isPayee = sale.paymentStatus === 'Payée';
            const isPartiel = sale.paymentStatus === 'Partiel';
            const isEnRetard = sale.paymentStatus === 'En retard';

            return (
              <article
                key={sale.id}
                onClick={() => navigate('document-preview', { documentId: sale.invoiceNumber })}
                className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs hover:border-slate-300 transition-all cursor-pointer flex flex-col gap-2.5 active:bg-[#F8FAFC]"
              >
                {/* Reference & Status */}
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#002452] tracking-wider">
                    {sale.invoiceNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      isPayee
                        ? 'bg-[#DCFCE7] text-[#15803D]'
                        : isPartiel
                        ? 'bg-[#FEF3C7] text-[#92400E]'
                        : isEnRetard
                        ? 'bg-[#FEF2F2] text-[#EF4444]'
                        : 'bg-[#E0F2FE] text-[#0369A1]'
                    }`}
                  >
                    {sale.paymentStatus}
                  </span>
                </div>

                {/* Client & Date */}
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-display font-bold text-sm text-[#1A1A2E]">
                      {sale.customerName}
                    </h3>
                    <span className="text-[#CBD5E1] text-xs">•</span>
                    <span className="text-xs text-[#64748B]">{sale.date}</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1 line-clamp-1">
                    {sale.items.map((it) => it.productName).join(' + ')}
                  </p>
                </div>

                {/* Bottom Financial Details (Section 4) */}
                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                  {isPartiel && sale.depositPaid ? (
                    <span className="font-mono text-[11px] text-[#64748B]">
                      Acompte: {sale.depositPaid.toLocaleString('fr-FR')} F • Reste: {(sale.remainingDue ?? (sale.totalAmount - (sale.depositPaid || 0))).toLocaleString('fr-FR')} F
                    </span>
                  ) : (
                    <span className="text-xs text-[#64748B]">Montant de la vente</span>
                  )}
                  <span className="font-display font-bold text-sm text-[#002452]">
                    {sale.totalAmount.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Modal */}
      <NewSaleModal isOpen={isSaleModalOpen} onClose={() => setIsSaleModalOpen(false)} />
    </div>
  );
};
