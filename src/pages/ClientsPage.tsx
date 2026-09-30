import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NewClientModal } from '../components/modals/NewClientModal';

export const ClientsPage: React.FC = () => {
  const { customers, navigate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'DEBT'>('ALL');
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  const activeCount = customers.filter((c) => c.status === 'Actif').length;
  const pendingCount = customers.filter((c) => c.status === 'En attente' || c.status === 'En attente devis').length;
  const debtCount = customers.filter((c) => c.balance > 0).length;

  const filteredCustomers = customers.filter((c) => {
    if (filter === 'ACTIVE' && c.status !== 'Actif') return false;
    if (filter === 'PENDING' && c.status !== 'En attente' && c.status !== 'En attente devis') return false;
    if (filter === 'DEBT' && c.balance <= 0) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.contactName.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-screen-md mx-auto px-4 py-4 gap-4">
      {/* Page Header & Action (Exact Stitch Image 18) */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#002452] tracking-tight">Clients</h1>
          <p className="font-sans text-xs text-[#64748B]">Portefeuille clients & comptes de facturation</p>
        </div>
        <button
          onClick={() => setIsClientModalOpen(true)}
          type="button"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#002452] text-white px-4 py-2.5 rounded-xl font-display font-semibold text-xs shadow-sm hover:opacity-95 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Nouveau client</span>
        </button>
      </section>

      {/* Search Bar */}
      <div className="relative w-full">
        <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#64748B] text-[20px]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un client, contact, ID..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#002452] shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-[#64748B] hover:text-[#1A1A2E]"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setFilter('ALL')}
          type="button"
          className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
            filter === 'ALL'
              ? 'bg-[#002452] text-white font-bold'
              : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50'
          }`}
        >
          <span>Tous</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              filter === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#64748B]'
            }`}
          >
            {customers.length}
          </span>
        </button>

        <button
          onClick={() => setFilter('ACTIVE')}
          type="button"
          className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
            filter === 'ACTIVE'
              ? 'bg-[#002452] text-white font-bold'
              : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50'
          }`}
        >
          <span>Actifs</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[#64748B] text-[10px]">
            {activeCount}
          </span>
        </button>

        <button
          onClick={() => setFilter('PENDING')}
          type="button"
          className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
            filter === 'PENDING'
              ? 'bg-[#002452] text-white font-bold'
              : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50'
          }`}
        >
          <span>En attente</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[#64748B] text-[10px]">
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setFilter('DEBT')}
          type="button"
          className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
            filter === 'DEBT'
              ? 'bg-[#EF4444] text-white font-bold'
              : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-red-50'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          <span>Solde débiteur</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[#FEF2F2] text-[#EF4444] text-[10px] font-bold">
            {debtCount}
          </span>
        </button>
      </div>

      {/* Customer Cards List (Stitch HTML 6) */}
      <section className="flex flex-col gap-3">
        {filteredCustomers.map((cust) => {
          const hasDebt = cust.balance > 0;
          return (
            <article
              key={cust.id}
              onClick={() => navigate('client-detail', { customerId: cust.id })}
              className="bg-white border border-[#E2E8F0] rounded-xl p-4 transition-all duration-150 hover:border-slate-300 cursor-pointer shadow-xs active:bg-[#F8FAFC]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Name & ID Row */}
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="font-display font-bold text-base text-[#1A1A2E] truncate">
                      {cust.name}
                    </h2>
                    <span className="font-mono text-[11px] text-[#64748B] px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#E2E8F0]">
                      {cust.id}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        cust.status === 'Actif'
                          ? 'bg-[#E0F7F7] text-[#007070]'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {cust.status}
                    </span>
                  </div>

                  {/* Contact & Phone */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[#64748B] text-xs mt-1.5">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">call</span>
                      <span className="font-mono">{cust.phone}</span>
                    </div>
                    <span className="text-[#CBD5E1]">•</span>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">person</span>
                      <span>{cust.contactName}</span>
                    </div>
                  </div>

                  {/* Parc & Sites */}
                  <div className="flex items-center gap-1.5 text-[#64748B] text-xs mt-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#006a6a]">
                      cell_tower
                    </span>
                    <span className="truncate">
                      {cust.sitesCount} site{cust.sitesCount > 1 ? 's' : ''} déployé{cust.sitesCount > 1 ? 's' : ''} • {cust.activeEquipmentCount} équipements actifs
                    </span>
                  </div>
                </div>

                {/* Trailing chevron */}
                <div className="pt-1 text-[#64748B]">
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </div>
              </div>

              {/* Bottom Financial Row */}
              <div className="mt-3 pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between">
                {hasDebt ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-[#64748B]">Solde débiteur</span>
                    <span className="text-[10px] bg-[#FEF2F2] text-[#EF4444] px-1.5 py-0.2 rounded font-bold">
                      {cust.unpaidInvoiceRef || 'Paiement en attente'}
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] text-[#64748B]">Solde en compte</span>
                )}

                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-display font-bold text-sm ${
                      hasDebt ? 'text-[#EF4444]' : 'text-[#1A1A2E]'
                    }`}
                  >
                    {cust.balance.toLocaleString('fr-FR')} FCFA
                  </span>
                  {!hasDebt && (
                    <span className="text-[11px] text-[#006a6a] font-semibold">(À jour)</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Summary Footer */}
      <footer className="pt-1 text-center">
        <p className="font-sans text-[11px] text-[#64748B]">
          Affichage de {filteredCustomers.length} clients • Synchronisé en temps réel
        </p>
      </footer>

      {/* Modal */}
      <NewClientModal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} />
    </div>
  );
};
