import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface NewPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewPurchaseModal: React.FC<NewPurchaseModalProps> = ({ isOpen, onClose }) => {
  const { suppliers, products, recordPurchase } = useApp();

  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [items, setItems] = useState<
    { productId: string; quantity: number; unitCost: number; serialNumbersText: string }[]
  >([
    {
      productId: 'prod-mikrotik-hap-ax3',
      quantity: 5,
      unitCost: 65000,
      serialNumbersText: 'MTK-AX3-2026-00482, MTK-AX3-2026-00483, MTK-AX3-2026-00484, MTK-AX3-2026-00485, MTK-AX3-2026-00486',
    },
    {
      productId: 'prod-cable-cat6',
      quantity: 610,
      unitCost: 350,
      serialNumbersText: '',
    },
    {
      productId: 'prod-rj45',
      quantity: 500,
      unitCost: 110,
      serialNumbersText: '',
    },
  ]);
  const [notes, setNotes] = useState('Approvisionnement standard stock matériel & consommables');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { productId: products[0].id, quantity: 1, unitCost: products[0].costPrice, serialNumbersText: '' },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, newProdId: string) => {
    const prod = products.find((p) => p.id === newProdId);
    setItems((prev) =>
      prev.map((it, i) =>
        i === index
          ? {
              ...it,
              productId: newProdId,
              unitCost: prod?.costPrice || 0,
            }
          : it
      )
    );
  };

  const handleQuantityChange = (index: number, qty: number) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, quantity: Math.max(1, qty) } : it))
    );
  };

  const handleCostChange = (index: number, cost: number) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, unitCost: Math.max(0, cost) } : it))
    );
  };

  const handleSerialsChange = (index: number, text: string) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, serialNumbersText: text } : it))
    );
  };

  const totalCalculated = items.reduce((acc, it) => acc + it.quantity * it.unitCost, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Veuillez ajouter au moins une ligne d’achat.');
      return;
    }

    const formattedItems = items.map((it) => {
      const serials = it.serialNumbersText
        ? it.serialNumbersText.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined;
      return {
        productId: it.productId,
        quantity: it.quantity,
        unitCost: it.unitCost,
        serialNumbers: serials,
      };
    });

    const result = recordPurchase({
      supplierId,
      items: formattedItems,
      notes,
    });

    if (result.success) {
      setFeedback(result.message);
      setTimeout(() => {
        setFeedback(null);
        onClose();
      }, 1200);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#002452] text-[22px]">shopping_cart</span>
            <div>
              <h2 className="font-display font-bold text-base text-[#002452]">Nouvel Achat / Réception Stock</h2>
              <p className="text-[11px] text-[#64748B]">Entrée directe en stock et création d’équipements</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {feedback && (
            <div className="p-3 bg-[#E0F7F7] border border-[#006a6a]/30 text-[#007070] text-xs font-semibold rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{feedback}</span>
            </div>
          )}

          {/* Fournisseur */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A2E] mb-1">
              Fournisseur
            </label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#002452] font-medium"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.deliveryDelay})
                </option>
              ))}
            </select>
          </div>

          {/* Lignes d'achats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-bold text-[#002452] uppercase tracking-wider">
                Lignes de commande ({items.length})
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-semibold text-[#006a6a] hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Ajouter article</span>
              </button>
            </div>

            {items.map((item, idx) => {
              const product = products.find((p) => p.id === item.productId);
              const isSerialized = product?.trackType === 'SERIALIZED';

              return (
                <div
                  key={idx}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <label className="block text-[11px] text-[#64748B] mb-0.5">Article</label>
                      <select
                        value={item.productId}
                        onChange={(e) => handleProductChange(idx, e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium focus:outline-none"
                      >
                        {products
                          .filter((p) => p.trackType !== 'SERVICE')
                          .map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.trackType === 'SERIALIZED' ? 'Sérialisé' : `${p.unit}`})
                            </option>
                          ))}
                      </select>
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 rounded"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-[#64748B] mb-0.5">
                        Quantité ({product?.unit || 'un.'})
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(idx, parseInt(e.target.value, 10) || 1)}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#64748B] mb-0.5">Coût Unitaire HT (FCFA)</label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={item.unitCost}
                        onChange={(e) => handleCostChange(idx, parseInt(e.target.value, 10) || 0)}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  {isSerialized && (
                    <div>
                      <label className="block text-[11px] text-[#006a6a] font-medium mb-0.5">
                        Numéros de série ({item.quantity} prévus, séparés par virgule) :
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: MTK-AX3-001, MTK-AX3-002..."
                        value={item.serialNumbersText}
                        onChange={(e) => handleSerialsChange(idx, e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-[11px] font-mono text-[#002452]"
                      />
                    </div>
                  )}

                  <div className="text-right text-[11px] font-semibold text-[#002452]">
                    Ligne : {(item.quantity * item.unitCost).toLocaleString('fr-FR')} FCFA
                  </div>
                </div>
              );
            })}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A2E] mb-1">
              Commentaire / Référence BL
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none"
            />
          </div>

          {/* Total & Submit */}
          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
            <div>
              <span className="block text-[11px] text-[#64748B]">Total Achat Fournisseur</span>
              <span className="font-display font-bold text-lg text-[#002452]">
                {totalCalculated.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#002452] text-white font-display font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>Valider la réception</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
