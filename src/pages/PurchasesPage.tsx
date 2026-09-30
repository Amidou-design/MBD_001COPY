import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NewPurchaseModal } from '../components/modals/NewPurchaseModal';

export const PurchasesPage: React.FC = () => {
  const { purchases, suppliers } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalPurchases = purchases.reduce((acc, p) => acc + p.totalAmount, 0);

  return (
    <div className="flex flex-col w-full max-w-screen-md mx-auto px-4 py-4 gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#002452] tracking-tight">Achats & Fournisseurs</h1>
          <p className="font-sans text-xs text-[#64748B]">Approvisionnements, commandes et réceptions de stock</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          type="button"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#002452] text-white px-4 py-2.5 rounded-xl font-display font-semibold text-xs shadow-sm hover:opacity-95 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>+ Nouvel Achat</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-xs">
          <span className="text-[10px] text-[#64748B] block font-medium">Total Commandes</span>
          <span className="font-display font-bold text-sm text-[#002452] block mt-0.5">
            {purchases.length}
          </span>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-xs">
          <span className="text-[10px] text-[#64748B] block font-medium">Fournisseurs Actifs</span>
          <span className="font-display font-bold text-sm text-[#002452] block mt-0.5">
            {suppliers.length}
          </span>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-xs">
          <span className="text-[10px] text-[#64748B] block font-medium">Volume d'Achat</span>
          <span className="font-display font-bold text-sm text-[#002452] block mt-0.5 truncate">
            {totalPurchases.toLocaleString('fr-FR')} F
          </span>
        </div>
      </div>

      {/* Fournisseurs Partenaires Strip */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 space-y-2">
        <h3 className="font-display font-bold text-xs text-[#002452]">Fournisseurs Agréés</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {suppliers.map((s) => (
            <div key={s.id} className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
              <span className="font-bold text-[#002452] block">{s.name}</span>
              <span className="text-[11px] text-[#64748B]">{s.contactPerson}</span>
              <span className="text-[10px] text-[#006a6a] font-mono block mt-1">Délai : {s.deliveryDelay}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Purchases List */}
      <div className="space-y-3">
        <h2 className="font-display font-bold text-sm text-[#002452]">Historique des Bons de Réception</h2>
        {purchases.map((p) => (
          <article
            key={p.id}
            className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs flex flex-col gap-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-[#002452]">{p.id}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#DCFCE7] text-[#15803D]">
                {p.status}
              </span>
            </div>

            <div>
              <h3 className="font-display font-bold text-sm text-[#1A1A2E]">{p.supplierName}</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Date : {p.date}</p>
            </div>

            {/* Items table summary */}
            <div className="bg-[#F8FAFC] rounded-lg p-2.5 text-xs space-y-1 border border-[#E2E8F0]/60">
              {p.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px]">
                  <span className="text-[#1A1A2E]">
                    {it.quantity} {it.unit} × {it.productName}
                  </span>
                  <span className="font-mono text-[#002452] font-semibold">
                    {(it.quantity * it.unitCost).toLocaleString('fr-FR')} F
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-xs text-[#64748B]">Montant total réceptionné</span>
              <span className="font-display font-bold text-sm text-[#002452]">
                {p.totalAmount.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </article>
        ))}
      </div>

      <NewPurchaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
