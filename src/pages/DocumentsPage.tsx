import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DocumentType } from '../types';

export const DocumentsPage: React.FC = () => {
  const { documents, navigate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const docTypes: { type: string; label: string }[] = [
    { type: 'ALL', label: 'Tous' },
    { type: 'DEV', label: 'DEV' },
    { type: 'FAC', label: 'FAC' },
    { type: 'REC', label: 'REC' },
    { type: 'CTR', label: 'CTR' },
    { type: 'FIT', label: 'FIT' },
    { type: 'PVM', label: 'PVM' },
    { type: 'ACC', label: 'ACC' },
    { type: 'INT', label: 'INT' },
    { type: 'CLO', label: 'CLO' },
  ];

  const filteredDocs = documents.filter((doc) => {
    if (selectedType !== 'ALL' && doc.type !== selectedType) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.id.toLowerCase().includes(q) ||
        doc.title.toLowerCase().includes(q) ||
        (doc.customerName && doc.customerName.toLowerCase().includes(q)) ||
        (doc.equipmentTitle && doc.equipmentTitle.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getDocTypeBadgeStyle = (type: DocumentType) => {
    switch (type) {
      case 'PVM':
        return 'bg-teal-50 text-teal-800 border-teal-100';
      case 'FIT':
        return 'bg-blue-50 text-blue-800 border-blue-100';
      case 'FAC':
        return 'bg-amber-50 text-amber-800 border-amber-100';
      case 'DEV':
        return 'bg-indigo-50 text-indigo-800 border-indigo-100';
      case 'INT':
        return 'bg-rose-50 text-rose-800 border-rose-100';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    if (status.includes('Signé') || status.includes('Conforme') || status.includes('Payée')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-100';
    }
    if (status.includes('attente')) {
      return 'bg-amber-50 text-amber-800 border-amber-100';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="flex flex-col w-full max-w-screen-md mx-auto px-4 py-4 gap-4">
      {/* Header (Exact Stitch HTML 10) */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-col">
          <h1 className="font-display font-bold text-2xl text-[#002452] tracking-tight">
            Documents
          </h1>
          <p className="font-sans text-xs text-[#64748B]">
            Centre documentaire & PVs d'installation
          </p>
        </div>

        <button
          onClick={() => navigate('ventes')}
          type="button"
          className="w-full h-11 rounded-xl bg-[#002452] text-white font-display font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99] transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>+ Nouveau document / Facture</span>
        </button>
      </section>

      {/* Search Bar */}
      <div className="relative flex items-center bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <span className="material-symbols-outlined absolute left-3.5 text-[#64748B] text-[18px]">
          search
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher réf, client, matériel..."
          className="w-full h-10 pl-10 pr-4 bg-transparent text-xs text-[#1A1A2E] placeholder:text-[#64748B] focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 text-[#64748B] hover:text-[#1A1A2E]"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* Type Filter Chips (Stitch HTML 10) */}
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4 flex items-center gap-1.5 py-0.5">
        {docTypes.map((dt) => {
          const isSelected = selectedType === dt.type;
          const count =
            dt.type === 'ALL'
              ? documents.length
              : documents.filter((d) => d.type === dt.type).length;

          return (
            <button
              key={dt.type}
              onClick={() => setSelectedType(dt.type)}
              type="button"
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#002452] text-white shadow-xs'
                  : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50'
              }`}
            >
              <span>{dt.label}</span>
              <span className="text-[10px] opacity-80">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Subheader */}
      <div className="flex items-center justify-between text-xs text-[#64748B]">
        <span className="font-medium">Documents récents ({filteredDocs.length})</span>
        <span className="text-[#006a6a] font-semibold flex items-center gap-0.5">
          <span>Date récente</span>
          <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
        </span>
      </div>

      {/* Documents Stack (Stitch HTML 10) */}
      <div className="flex flex-col gap-3">
        {filteredDocs.map((doc) => (
          <article
            key={doc.id}
            className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col gap-2.5 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-[#002452]">{doc.id}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getDocTypeBadgeStyle(doc.type)}`}>
                  {doc.type}
                </span>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${getStatusBadgeStyle(doc.status)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{doc.status}</span>
              </span>
            </div>

            <div>
              <h2 className="font-display font-bold text-sm text-[#002452] leading-snug">
                {doc.title}
              </h2>
              <p className="mt-0.5 text-xs text-[#64748B]">
                {doc.customerName || 'Client'} {doc.siteName ? `• ${doc.siteName}` : ''}
              </p>
              <p className="text-[11px] text-[#94a3b8] mt-0.5 font-mono">
                {doc.date} {doc.signedBy ? `• Signé par ${doc.signedBy}` : ''}
              </p>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
              <button
                onClick={() => navigate('document-preview', { documentId: doc.id })}
                type="button"
                className="h-8 px-3 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] text-[#002452] text-xs font-semibold flex items-center gap-1 hover:bg-[#F1F5F9] active:scale-95"
              >
                <span>Voir aperçu</span>
              </button>
              <button
                onClick={() => {
                  navigate('document-preview', { documentId: doc.id });
                  setTimeout(() => window.print(), 300);
                }}
                type="button"
                className="h-8 px-3 rounded-lg bg-[#002452] text-white text-xs font-semibold flex items-center gap-1 active:opacity-90 shadow-xs"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                <span>Télécharger PDF</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
