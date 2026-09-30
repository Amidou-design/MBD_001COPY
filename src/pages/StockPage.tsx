import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductTrackType } from '../types';
import { NewPurchaseModal } from '../components/modals/NewPurchaseModal';
import { BarcodeScannerModal } from '../components/common/BarcodeScannerModal';

export const StockPage: React.FC = () => {
  const { products, equipments, navigate } = useApp();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Calculations
  const totalStockValue = products.reduce((acc, p) => acc + p.currentStock * p.costPrice, 0);
  const totalQtyPhysical = products
    .filter((p) => p.trackType !== 'SERVICE')
    .reduce((acc, p) => acc + p.currentStock, 0);
  const alertCount = products.filter(
    (p) => p.minThreshold !== undefined && p.currentStock <= p.minThreshold
  ).length;

  const filteredProducts = products.filter((prod) => {
    // Type filter
    if (filterType === 'SERIALIZED' && prod.trackType !== 'SERIALIZED') return false;
    if (filterType === 'QUANTIFIED' && prod.trackType !== 'QUANTIFIED') return false;
    if (filterType === 'SERVICE' && prod.trackType !== 'SERVICE') return false;
    if (filterType === 'ALERT' && (prod.minThreshold === undefined || prod.currentStock > prod.minThreshold)) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        prod.name.toLowerCase().includes(q) ||
        prod.reference.toLowerCase().includes(q) ||
        prod.brand.toLowerCase().includes(q) ||
        prod.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-screen-md mx-auto px-4 py-4 gap-4">
      {/* Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-xl text-[#002452]">Catalogue & Stocks</h1>
          <p className="font-sans text-xs text-[#64748B]">
            Équipements sérialisés, consommables quantifiés & prestations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPurchaseModalOpen(true)}
            type="button"
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#002452] text-white text-xs font-display font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[16px]">add_box</span>
            <span>+ Entrée Achat</span>
          </button>
          <button
            onClick={() => navigate('inventory-physical')}
            type="button"
            className="px-3 py-2 rounded-xl bg-[#E0F7F7] text-[#006a6a] text-xs font-semibold flex items-center justify-center gap-1 border border-[#006a6a]/20 active:scale-95 transition-transform"
            title="Inventaire Physique"
          >
            <span className="material-symbols-outlined text-[16px]">checklist</span>
            <span>Inventaire</span>
          </button>
          <button
            onClick={() => setIsScannerOpen(true)}
            type="button"
            className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#002452] hover:bg-slate-50"
            title="Scanner Code / Numéro de série"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
          </button>
        </div>
      </div>

      {/* 3 Summary Stats Strip */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-xs">
          <span className="text-[10px] text-[#64748B] block font-medium">Valeur Marchande</span>
          <span className="font-display font-bold text-sm text-[#002452] block mt-0.5 truncate">
            {totalStockValue.toLocaleString('fr-FR')} F
          </span>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-xs">
          <span className="text-[10px] text-[#64748B] block font-medium">Références Cataloguées</span>
          <span className="font-display font-bold text-sm text-[#002452] block mt-0.5">
            {products.length} types
          </span>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-xs">
          <span className="text-[10px] text-[#64748B] block font-medium">Seuils Critiques</span>
          <span className="font-display font-bold text-sm text-[#EF4444] block mt-0.5 flex items-center gap-1">
            {alertCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></span>}
            {alertCount} alertes
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#64748B] text-[18px]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher équipement, référence (ex: MikroTik, Starlink, Cat6)..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#002452]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2 text-[#64748B] hover:text-[#1A1A2E]"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setFilterType('ALL')}
          type="button"
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            filterType === 'ALL'
              ? 'bg-[#002452] text-white shadow-xs'
              : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50'
          }`}
        >
          Tous ({products.length})
        </button>
        <button
          onClick={() => setFilterType('SERIALIZED')}
          type="button"
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            filterType === 'SERIALIZED'
              ? 'bg-[#002452] text-white shadow-xs'
              : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50'
          }`}
        >
          Sérialisés ({products.filter((p) => p.trackType === 'SERIALIZED').length})
        </button>
        <button
          onClick={() => setFilterType('QUANTIFIED')}
          type="button"
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            filterType === 'QUANTIFIED'
              ? 'bg-[#002452] text-white shadow-xs'
              : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50'
          }`}
        >
          Quantifiés ({products.filter((p) => p.trackType === 'QUANTIFIED').length})
        </button>
        <button
          onClick={() => setFilterType('SERVICE')}
          type="button"
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            filterType === 'SERVICE'
              ? 'bg-[#002452] text-white shadow-xs'
              : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50'
          }`}
        >
          Services ({products.filter((p) => p.trackType === 'SERVICE').length})
        </button>
        <button
          onClick={() => setFilterType('ALERT')}
          type="button"
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
            filterType === 'ALERT'
              ? 'bg-[#EF4444] text-white shadow-xs'
              : 'bg-white border border-[#E2E8F0] text-[#EF4444] hover:bg-red-50'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          <span>Critique ({alertCount})</span>
        </button>
      </div>

      {/* Product List */}
      <div className="flex flex-col gap-2.5">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-[#E2E8F0]">
            <span className="material-symbols-outlined text-[36px] text-slate-300">inventory_2</span>
            <p className="font-display font-semibold text-sm text-[#002452] mt-2">Aucun article correspondant</p>
            <p className="text-xs text-[#64748B] mt-1">Modifiez vos filtres ou effectuez une entrée de stock.</p>
          </div>
        ) : (
          filteredProducts.map((prod) => {
            const isCritical = prod.minThreshold !== undefined && prod.currentStock <= prod.minThreshold;
            const isSerialized = prod.trackType === 'SERIALIZED';
            const isService = prod.trackType === 'SERVICE';
            // Count registered physical equipment items
            const matchingEquipments = equipments.filter((e) => e.productId === prod.id);

            return (
              <article
                key={prod.id}
                className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-xs hover:border-slate-300 transition-all flex flex-col gap-2.5"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-display font-bold text-sm text-[#002452] truncate">
                        {prod.name}
                      </h2>
                      <span className="font-mono text-[10px] text-[#64748B] bg-[#F1F5F9] px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                        {prod.reference}
                      </span>
                      {/* Track Type Badge */}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isSerialized
                            ? 'bg-[#EEF4FF] text-[#002452]'
                            : isService
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-[#E0F7F7] text-[#007070]'
                        }`}
                      >
                        {isSerialized ? 'Sérialisé' : isService ? 'Service' : 'Quantifié'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {prod.brand} • {prod.category}
                    </p>
                  </div>

                  {/* Stock Count Pill */}
                  <div className="text-right shrink-0">
                    {isService ? (
                      <span className="inline-flex items-center text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg">
                        Prestation
                      </span>
                    ) : (
                      <div className="flex flex-col items-end">
                        <div
                          className={`flex items-baseline gap-1 px-2 py-0.5 rounded-lg font-mono font-bold text-xs ${
                            isCritical
                              ? 'bg-[#FEF2F2] text-[#EF4444] border border-[#EF4444]/20'
                              : 'bg-[#F8FAFC] text-[#002452] border border-[#E2E8F0]'
                          }`}
                        >
                          <span>{prod.currentStock}</span>
                          <span className="text-[10px] font-normal">{prod.unit}</span>
                        </div>
                        {isCritical && (
                          <span className="text-[10px] text-[#EF4444] font-semibold mt-0.5">
                            Seuil min: {prod.minThreshold}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Financials & Stock Details */}
                <div className="pt-2 border-t border-[#E2E8F0]/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
                    <span>
                      Coût : <strong className="text-[#1A1A2E]">{prod.costPrice.toLocaleString('fr-FR')} F</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Prix Vente : <strong className="text-[#002452] font-bold">{prod.sellingPrice.toLocaleString('fr-FR')} F</strong>
                    </span>
                  </div>

                  {/* Serialized quick link to equipments */}
                  {isSerialized && matchingEquipments.length > 0 && (
                    <button
                      onClick={() => navigate('equipment-detail', { equipmentId: matchingEquipments[0].id })}
                      type="button"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#006a6a] hover:underline"
                    >
                      <span>Fiche ({matchingEquipments.length})</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Modals */}
      <NewPurchaseModal isOpen={isPurchaseModalOpen} onClose={() => setIsPurchaseModalOpen(false)} />
      <BarcodeScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </div>
  );
};
