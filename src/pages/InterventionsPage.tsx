import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NewInterventionModal } from '../components/modals/NewInterventionModal';

export const InterventionsPage: React.FC = () => {
  const { interventions, navigate } = useApp();
  const [filter, setFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const urgentesCount = interventions.filter((i) => i.urgency === 'Urgence Haute').length;
  const enCoursCount = interventions.filter((i) => i.status === 'En cours').length;
  const planifieesCount = interventions.filter((i) => i.status === 'Planifiée').length;
  const clotureesCount = interventions.filter((i) => i.status === 'Clôturée & Validée').length;

  const filteredInterventions = interventions.filter((item) => {
    if (filter === 'URGENT') return item.urgency === 'Urgence Haute';
    if (filter === 'EN_COURS') return item.status === 'En cours';
    if (filter === 'PLANIFIEE') return item.status === 'Planifiée';
    if (filter === 'CLOTUREE') return item.status === 'Clôturée & Validée';
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-screen-md mx-auto px-4 py-4 gap-4">
      {/* Page Header & Action (Exact Stitch Image 16) */}
      <section className="flex flex-col gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#002452] tracking-tight">
            Interventions
          </h1>
          <p className="font-sans text-xs text-[#64748B]">
            Maintenance, dépannages & tickets SAV
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          type="button"
          className="w-full bg-[#1B3A6B] text-white py-3 px-4 rounded-xl font-display font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:opacity-95 active:scale-[0.99] transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Nouvelle intervention</span>
        </button>
      </section>

      {/* Horizontal filter chips */}
      <section className="-mx-4 px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 py-0.5 min-w-max">
          <button
            onClick={() => setFilter('ALL')}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === 'ALL'
                ? 'bg-[#1B3A6B] text-white font-bold'
                : 'bg-white border border-[#E2E8F0] text-[#1A1A2E]'
            }`}
          >
            <span>Toutes</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                filter === 'ALL' ? 'bg-white text-[#1B3A6B]' : 'bg-slate-100'
              }`}
            >
              {interventions.length}
            </span>
          </button>

          <button
            onClick={() => setFilter('URGENT')}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === 'URGENT'
                ? 'bg-[#EF4444] text-white font-bold'
                : 'bg-white border border-[#E2E8F0] text-[#1A1A2E]'
            }`}
          >
            <span>Urgentes</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                filter === 'URGENT' ? 'bg-white text-[#EF4444]' : 'bg-[#FEF2F2] text-[#EF4444]'
              }`}
            >
              {urgentesCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('EN_COURS')}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === 'EN_COURS'
                ? 'bg-[#006a6a] text-white font-bold'
                : 'bg-white border border-[#E2E8F0] text-[#1A1A2E]'
            }`}
          >
            <span>En cours</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                filter === 'EN_COURS' ? 'bg-white text-[#006a6a]' : 'bg-[#E0F7F7] text-[#007070]'
              }`}
            >
              {enCoursCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('PLANIFIEE')}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === 'PLANIFIEE'
                ? 'bg-[#002452] text-white font-bold'
                : 'bg-white border border-[#E2E8F0] text-[#1A1A2E]'
            }`}
          >
            <span>Planifiées</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100">
              {planifieesCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('CLOTUREE')}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === 'CLOTUREE'
                ? 'bg-[#15803D] text-white font-bold'
                : 'bg-white border border-[#E2E8F0] text-[#1A1A2E]'
            }`}
          >
            <span>Clôturées</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100">
              {clotureesCount}
            </span>
          </button>
        </div>
      </section>

      {/* Cards Stack (from Stitch HTML 5) */}
      <div className="space-y-3">
        {filteredInterventions.map((item) => {
          const isUrgent = item.urgency === 'Urgence Haute';
          const isEnAttentePiece = item.status === 'En attente pièce';
          const isEnCours = item.status === 'En cours';
          const isPlanifiee = item.status === 'Planifiée';
          const isCloturee = item.status === 'Clôturée & Validée';

          return (
            <article
              key={item.id}
              onClick={() => item.equipmentId && navigate('equipment-detail', { equipmentId: item.equipmentId })}
              className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition-colors cursor-pointer shadow-xs"
            >
              {/* Ligne Statuts & Référence */}
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E8F0]">
                <span className="font-mono text-xs text-[#002452] font-bold tracking-wider">
                  {item.id}
                </span>

                <div className="flex items-center space-x-1.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                      isUrgent ? 'bg-[#FEF2F2] text-[#EF4444]' : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    {item.urgency}
                  </span>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                      isEnCours
                        ? 'bg-[#E0F7F7] text-[#007070]'
                        : isEnAttentePiece
                        ? 'bg-[#FEF3C7] text-[#92400E]'
                        : isPlanifiee
                        ? 'bg-[#E0F2FE] text-[#0369A1]'
                        : 'bg-[#DCFCE7] text-[#15803D]'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Client & Lieu */}
              <div className="mt-3 flex items-start justify-between">
                <div>
                  <h2 className="font-display font-bold text-sm text-[#1A1A2E]">
                    {item.customerName}
                  </h2>
                  <div className="flex items-center gap-1 text-[#64748B] text-xs mt-0.5">
                    <span className="material-symbols-outlined text-[15px]">location_on</span>
                    <span>{item.siteName}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#64748B] text-[20px]">chevron_right</span>
              </div>

              {/* Matériel & Motif */}
              <div className="mt-2.5 bg-[#F8FAFC] rounded-lg p-2.5 flex flex-col space-y-1 border border-[#E2E8F0]/70">
                <div className="flex items-center space-x-1.5 text-[#002452] text-xs font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-[#006a6a]">
                    {item.equipmentTitle.includes('Starlink') ? 'satellite_alt' : 'router'}
                  </span>
                  <span className="truncate">{item.equipmentTitle}</span>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Section Bas : Technicien & Métadonnées */}
              <div className="mt-2.5 pt-2 flex flex-wrap items-center justify-between text-xs text-[#64748B] gap-y-1">
                <div className="flex items-center space-x-1.5">
                  <span className="material-symbols-outlined text-[15px]">engineering</span>
                  <span className="font-medium text-[#1A1A2E]">{item.technicianName}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px]">
                  <span>{item.date}</span>
                  <span>•</span>
                  <span className={isCloturee ? 'text-[#15803D] font-bold' : isUrgent ? 'text-[#EF4444] font-bold' : ''}>
                    {item.reportStatus}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <NewInterventionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
