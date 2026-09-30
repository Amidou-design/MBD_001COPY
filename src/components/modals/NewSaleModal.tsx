import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewSaleModal: React.FC<NewSaleModalProps> = ({ isOpen, onClose }) => {
  const { customers, sites, products, equipments, recordSale, navigate } = useApp();

  const [step, setStep] = useState<number>(4); // Default to Step 4 as in Stitch preview!
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0]?.id || '');

  // Line items
  const [items, setItems] = useState<
    { productId: string; quantity: number; unitPrice: number; equipmentId?: string }[]
  >([
    {
      productId: 'prod-starlink-v4',
      quantity: 2,
      unitPrice: 350000,
    },
    {
      productId: 'serv-installation',
      quantity: 1,
      unitPrice: 150000,
    },
  ]);

  const [paymentStatus, setPaymentStatus] = useState<'Payée' | 'Partiel' | 'En retard' | 'Devis validé'>('Payée');
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [stockError, setStockError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const customerSites = sites.filter((s) => s.customerId === currentCustomer.id);
  const currentSite = sites.find((s) => s.id === selectedSiteId) || customerSites[0];

  const handleAddItem = (prodId?: string) => {
    const prod = products.find((p) => p.id === (prodId || products[0].id))!;
    setItems((prev) => [
      ...prev,
      {
        productId: prod.id,
        quantity: 1,
        unitPrice: prod.sellingPrice,
      },
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
              unitPrice: prod?.sellingPrice || 0,
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

  const handlePriceChange = (index: number, price: number) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, unitPrice: Math.max(0, price) } : it))
    );
  };

  // Calculations
  const subtotalHT = items.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);
  const tva = Math.round(subtotalHT * 0.18);
  const totalTTC = subtotalHT + tva;
  const totalCost = items.reduce((acc, it) => {
    const prod = products.find((p) => p.id === it.productId);
    return acc + it.quantity * (prod?.costPrice || 0);
  }, 0);
  const margin = subtotalHT - totalCost;
  const marginRate = subtotalHT > 0 ? Number(((margin / subtotalHT) * 100).toFixed(1)) : 0;

  const handleValidateSale = () => {
    setStockError(null);
    const res = recordSale({
      customerId: currentCustomer.id,
      siteId: currentSite?.id,
      items,
      paymentStatus,
      depositPaid: paymentStatus === 'Partiel' ? depositAmount : undefined,
    });

    if (!res.success) {
      setStockError(res.message);
    } else {
      onClose();
      if (res.invoiceNumber) {
        navigate('ventes');
      }
    }
  };

  const stepLabels = [
    '1. Client',
    '2. Site',
    '3. Infos',
    '4. Lignes',
    '5. Paiement',
    '6. Aperçu',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-xl bg-[#F6F8FC] rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[95vh]">
        {/* 1. Header Sobre */}
        <header className="bg-white border-b border-[#E2E8F0] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              type="button"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#1A1A2E] hover:bg-[#F1F5F9] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div>
              <h2 className="font-display font-bold text-base text-[#1A1A2E] leading-tight">Nouvelle Facture</h2>
              <p className="font-sans text-[11px] text-[#64748B]">Émission guidée pas-à-pas</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#E9F0FA] text-[#1B3A6B] flex items-center justify-center border border-[#CBD5E1]">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </header>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 2. Stepper 6 étapes */}
          <section className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-display font-semibold text-[#1B3A6B]">
                Étape {step} sur 6 — {stepLabels[step - 1].replace(/^\d+\.\s*/, '')}
              </span>
              <span className="text-[#64748B] font-medium text-[11px]">
                {Math.round((step / 6) * 100)}% complété
              </span>
            </div>
            {/* Segmented bar */}
            <div className="grid grid-cols-6 gap-1 mb-2">
              {[1, 2, 3, 4, 5, 6].map((st) => (
                <div
                  key={st}
                  onClick={() => setStep(st)}
                  className={`h-1.5 rounded-full cursor-pointer transition-colors ${
                    st <= step ? 'bg-[#1B3A6B]' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            {/* Steps mini label clicks */}
            <div className="flex items-center justify-between text-[10px] text-[#64748B] font-medium">
              {stepLabels.map((lbl, idx) => {
                const sNum = idx + 1;
                const isDone = sNum < step;
                const isCurr = sNum === step;
                return (
                  <button
                    key={sNum}
                    type="button"
                    onClick={() => setStep(sNum)}
                    className={`${
                      isCurr
                        ? 'text-[#1B3A6B] font-bold bg-[#E9F0FA] px-1.5 py-0.5 rounded'
                        : isDone
                        ? 'text-[#1B3A6B] font-semibold'
                        : 'text-slate-400'
                    }`}
                  >
                    {lbl}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Error Banner */}
          {stockError && (
            <div className="bg-[#FEF2F2] border border-[#EF4444]/30 rounded-xl p-3 flex items-start gap-2 text-xs text-[#93000a]">
              <span className="material-symbols-outlined text-[18px] text-[#EF4444] shrink-0 mt-0.5">error</span>
              <div>
                <strong className="block font-bold">Opération bloquée :</strong>
                <span>{stockError}</span>
              </div>
            </div>
          )}

          {/* STEP 1: CLIENT */}
          {step === 1 && (
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 space-y-3">
              <h3 className="font-display font-semibold text-sm text-[#002452]">Sélectionnez le Client souscripteur</h3>
              <div className="space-y-2">
                {customers.map((c) => (
                  <label
                    key={c.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedCustomerId === c.id
                        ? 'border-[#002452] bg-[#EEF4FF]'
                        : 'border-[#E2E8F0] bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="client-select"
                        checked={selectedCustomerId === c.id}
                        onChange={() => {
                          setSelectedCustomerId(c.id);
                          const clientSite = sites.find((s) => s.customerId === c.id);
                          if (clientSite) setSelectedSiteId(clientSite.id);
                        }}
                        className="text-[#002452]"
                      />
                      <div>
                        <span className="font-display font-bold text-xs text-[#002452] block">{c.name}</span>
                        <span className="text-[11px] text-[#64748B]">{c.contactName} • {c.phone}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100">{c.id}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: SITE */}
          {step === 2 && (
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 space-y-3">
              <h3 className="font-display font-semibold text-sm text-[#002452]">
                Site de livraison / raccordement pour {currentCustomer.name}
              </h3>
              <div className="space-y-2">
                {customerSites.length === 0 ? (
                  <p className="text-xs text-[#64748B]">Aucun site spécifique enregistré, le siège sera utilisé.</p>
                ) : (
                  customerSites.map((s) => (
                    <label
                      key={s.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedSiteId === s.id
                          ? 'border-[#002452] bg-[#EEF4FF]'
                          : 'border-[#E2E8F0] bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="site-select"
                          checked={selectedSiteId === s.id}
                          onChange={() => setSelectedSiteId(s.id)}
                          className="text-[#002452]"
                        />
                        <div>
                          <span className="font-display font-bold text-xs text-[#002452] block">{s.name}</span>
                          <span className="text-[11px] text-[#64748B]">{s.city} — {s.address}</span>
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          {/* STEP 3: INFOS */}
          {step === 3 && (
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 space-y-3">
              <h3 className="font-display font-semibold text-sm text-[#002452]">Paramètres & Conditions commerciales</h3>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[11px] text-[#64748B] mb-1">Date d’émission</label>
                  <input
                    type="text"
                    disabled
                    value={new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#64748B] mb-1">Devise & Régime Fiscal</label>
                  <div className="p-2.5 bg-[#F1F5F9] rounded-lg font-mono text-xs flex justify-between">
                    <span>Franc CFA (XOF / FCFA)</span>
                    <span className="font-bold text-[#006a6a]">TVA 18% Applicable</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: LIGNES DE FACTURATION (Core view from Stitch image) */}
          {(step === 4 || step >= 5) && (
            <section className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm space-y-4">
              {/* Contexte Client */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-xs text-[#64748B] truncate">
                  <span className="material-symbols-outlined text-[#1B3A6B] text-[18px]">business</span>
                  <span className="truncate">
                    Client : <strong className="text-[#1A1A2E] font-semibold">{currentCustomer.name}</strong> • Site : {currentSite?.name || 'Siège'}
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold tracking-wider rounded uppercase">
                  B2B
                </span>
              </div>

              {/* Lignes d'articles */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-xs text-[#1A1A2E] uppercase tracking-wider">
                    Articles & Prestations ajoutés
                  </h3>
                  <span className="text-xs text-[#64748B]">{items.length} lignes</span>
                </div>

                {items.map((item, idx) => {
                  const product = products.find((p) => p.id === item.productId);
                  const isService = product?.trackType === 'SERVICE';
                  const availableStock = product?.currentStock ?? 0;
                  const isStockInsufficient = !isService && item.quantity > availableStock;

                  return (
                    <div
                      key={idx}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border transition-colors bg-white ${
                        isStockInsufficient ? 'border-[#EF4444] bg-[#FEF2F2]/30' : 'border-[#E2E8F0] hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-lg bg-[#E9F0FA] text-[#1B3A6B] flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[18px]">
                            {product?.category === 'Satellite' ? 'satellite_alt' : isService ? 'handyman' : 'inventory_2'}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <select
                              value={item.productId}
                              onChange={(e) => handleProductChange(idx, e.target.value)}
                              className="font-display font-bold text-xs text-[#1A1A2E] bg-transparent focus:outline-none border-b border-transparent hover:border-slate-300 truncate max-w-full"
                            >
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-[#64748B]">
                            <span>P.U :</span>
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handlePriceChange(idx, parseInt(e.target.value, 10) || 0)}
                              className="w-20 px-1 py-0.5 border border-[#E2E8F0] rounded text-[11px] font-mono"
                            />
                            <span>FCFA</span>
                            <span className="text-slate-300">•</span>
                            <span>Qté :</span>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(idx, parseInt(e.target.value, 10) || 1)}
                              className="w-12 px-1 py-0.5 border border-[#E2E8F0] rounded text-[11px] font-mono font-bold text-center"
                            />
                            <span>{product?.unit}</span>
                          </div>

                          {!isService && (
                            <div className="mt-1">
                              {isStockInsufficient ? (
                                <span className="text-[10px] text-[#EF4444] font-bold">
                                  ⚠️ Stock insuffisant — {availableStock} {product?.unit} disponibles
                                </span>
                              ) : (
                                <span className="text-[10px] text-[#006a6a]">
                                  ✓ Stock dispo : {availableStock} {product?.unit}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E2E8F0]">
                        <span className="font-display font-bold text-xs text-[#1B3A6B] whitespace-nowrap">
                          {(item.quantity * item.unitPrice).toLocaleString('fr-FR')} FCFA
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bouton Ajouter pointillé */}
              <button
                type="button"
                onClick={() => handleAddItem()}
                className="w-full py-2.5 px-4 border border-dashed border-[#CBD5E1] rounded-lg bg-white text-[#1B3A6B] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Ajouter un équipement ou service</span>
              </button>

              {/* Synthèse des montants */}
              <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0] text-xs">
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>Sous-total HT</span>
                  <span className="font-medium text-[#1A1A2E]">{subtotalHT.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>TVA (18%)</span>
                  <span className="font-medium text-[#1A1A2E]">{tva.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-[#E2E8F0]/80">
                  <span className="font-display font-bold text-sm text-[#1A1A2E]">Total TTC</span>
                  <span className="font-display font-bold text-lg text-[#1B3A6B]">
                    {totalTTC.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                {/* Marge calculée en direct */}
                <div className="pt-1 flex items-center justify-between text-[11px] bg-[#E6F4F1] px-2.5 py-1 rounded-lg text-[#0A7A6E] font-medium">
                  <span>Marge brute générée :</span>
                  <span className="font-bold">
                    {margin.toLocaleString('fr-FR')} FCFA ({marginRate}%)
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* STEP 5: PAIEMENT */}
          {step === 5 && (
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 space-y-3">
              <h3 className="font-display font-semibold text-sm text-[#002452]">Modalité de Règlement</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['Payée', 'Partiel', 'En retard', 'Devis validé'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setPaymentStatus(st)}
                    className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                      paymentStatus === st
                        ? 'border-[#002452] bg-[#EEF4FF] text-[#002452] font-bold'
                        : 'border-[#E2E8F0] text-[#64748B] hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              {paymentStatus === 'Partiel' && (
                <div className="pt-2">
                  <label className="block text-[11px] text-[#64748B] mb-1">Acompte perçu (FCFA)</label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 6: APERÇU */}
          {step === 6 && (
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 space-y-3 text-xs">
              <h3 className="font-display font-bold text-sm text-[#002452]">Aperçu final avant validation</h3>
              <div className="p-3 bg-[#F8FAFC] rounded-lg space-y-1">
                <p><strong>Client :</strong> {currentCustomer.name}</p>
                <p><strong>Site :</strong> {currentSite?.name || 'Siège principal'}</p>
                <p><strong>Articles :</strong> {items.length} lignes</p>
                <p><strong>Total Facturé :</strong> {totalTTC.toLocaleString('fr-FR')} FCFA</p>
                <p><strong>Statut :</strong> <span className="font-bold text-[#006a6a]">{paymentStatus}</span></p>
              </div>
            </div>
          )}
        </div>

        {/* 4. Boutons navigation d'étape */}
        <div className="p-4 bg-white border-t border-[#E2E8F0] grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="h-11 rounded-xl bg-white border border-[#E2E8F0] text-[#1A1A2E] font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-95 disabled:opacity-40 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Précédent</span>
          </button>

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(6, s + 1))}
              className="h-11 rounded-xl bg-[#1B3A6B] text-white font-display font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#0F2548] active:scale-95 transition-all shadow-xs"
            >
              <span>Continuer ({stepLabels[step]})</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleValidateSale}
              className="h-11 rounded-xl bg-[#006a6a] text-white font-display font-bold text-xs flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Valider & Générer Facture</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
