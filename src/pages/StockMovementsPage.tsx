import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MovementType } from '../types';

export const StockMovementsPage: React.FC = () => {
  const { movements, goBack } = useApp();
  const [filterType, setFilterType] = useState<string>('ALL');

  const movementTypes: MovementType[] = [
    'ACHAT',
    'VENTE',
    'INSTALLATION',
    'TRANSFERT',
    'AJUSTEMENT',
    'RÉSERVATION',
    'RETOUR',
    'RÉFORME',
  ];

  const filteredMovements = movements.filter((m) => {
    if (filterType !== 'ALL' && m.type !== filterType) return false;
    return true;
  });

  const getMovementBadgeStyle = (type: MovementType) => {
    switch (type) {
      case 'ACHAT':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'VENTE':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'INSTALLATION':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'AJUSTEMENT':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'TRANSFERT':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col w-full max-w-screen-md mx-auto px-4 py-4 gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#1A1A2E] hover:bg-[#F1F5F9]"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div>
          <h1 className="font-display font-bold text-xl text-[#002452]">Mouvements de Stock</h1>
          <p className="font-sans text-xs text-[#64748B]">Traçabilité et audit des entrées, sorties et transferts</p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            filterType === 'ALL'
              ? 'bg-[#002452] text-white shadow-xs'
              : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50'
          }`}
        >
          Tous ({movements.length})
        </button>
        {movementTypes.map((t) => {
          const count = movements.filter((m) => m.type === t).length;
          if (count === 0 && filterType !== t) return null;
          return (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === t
                  ? 'bg-[#002452] text-white shadow-xs'
                  : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50'
              }`}
            >
              {t} ({count})
            </button>
          );
        })}
      </div>

      {/* Movement Rows */}
      <div className="space-y-2.5">
        {filteredMovements.map((m) => (
          <article
            key={m.id}
            className="bg-white rounded-xl border border-[#E2E8F0] p-3.5 shadow-xs text-xs space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getMovementBadgeStyle(m.type)}`}>
                  {m.type}
                </span>
                <span className="font-mono text-[11px] font-bold text-[#002452]">{m.reference}</span>
              </div>
              <span className="text-[11px] text-[#64748B] font-mono">{m.date}</span>
            </div>

            <div className="flex items-baseline justify-between">
              <h3 className="font-display font-bold text-sm text-[#1A1A2E]">{m.productName}</h3>
              <span className="font-mono font-bold text-xs text-[#002452]">
                {m.quantity > 0 ? `+${m.quantity}` : m.quantity} {m.unit}
              </span>
            </div>

            {m.serialNumber && (
              <p className="font-mono text-[11px] text-[#64748B]">N° Série : {m.serialNumber}</p>
            )}

            <div className="pt-1.5 border-t border-[#E2E8F0]/70 flex items-center justify-between text-[11px] text-[#64748B]">
              <span className="truncate">
                {m.sourceLocation} → <strong className="text-[#1A1A2E]">{m.destLocation}</strong>
              </span>
              <span className="shrink-0 ml-2">Par {m.operator}</span>
            </div>

            {m.comment && (
              <p className="text-[11px] text-[#64748B] bg-[#F8FAFC] p-1.5 rounded border border-[#E2E8F0]/50">
                {m.comment}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};
