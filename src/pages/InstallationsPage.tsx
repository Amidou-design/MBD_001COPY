import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NewInstallationModal } from '../components/modals/NewInstallationModal';

export const InstallationsPage: React.FC = () => {
  const { installations, navigate } = useApp();
  const [filter, setFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const planifieesCount = installations.filter((i) => i.status === 'Planifiée').length;
  const enCoursCount = installations.filter((i) => i.status === 'En cours').length;
  const installeesCount = installations.filter((i) => i.status === 'Installée').length;
  const valideesCount = installations.filter((i) => i.status === 'Validée').length;

  const filteredInstallations = installations.filter((item) => {
    if (filter === 'PLANIFIEE') return item.status === 'Planifiée';
    if (filter === 'EN_COURS') return item.status === 'En cours';
    if (filter === 'INSTALLEE') return item.status === 'Installée';
    if (filter === 'VALIDEE') return item.status === 'Validée';
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-screen-md mx-auto px-4 py-4 gap-4">
      {/* Header Section (Exact Stitch Image 20) */}
      <section className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-[#002452] tracking-tight">Installations</h1>
            <p className="font-sans text-xs text-[#64748B]">Déploiements terrain & raccordements sites</p>
          </div>
          <span className="bg-[#F8FAFC] text-[#002452] border border-[#E2E8F0] px-2 py-0.5 rounded-lg text-[11px] font-semibold self-center">
            Burkina Faso
          </span>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          type="button"
          className="w-full bg-[#002452] hover:bg-opacity-95 active:scale-[0.99] transition-all text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm font-display font-semibold text-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Nouvelle installation</span>
        </button>
      </section>

      {/* Horizontal Filter Bar (Stitch HTML 8) */}
      <section className="-mx-4 px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 py-0.5 min-w-max">
          <button
            onClick={() => setFilter('ALL')}
            type="button"
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filter === 'ALL'
                ? 'bg-[#002452] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
            }`}
          >
            <span>Toutes</span>
            <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {installations.length}
            </span>
          </button>

          <button
            onClick={() => setFilter('PLANIFIEE')}
            type="button"
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filter === 'PLANIFIEE'
                ? 'bg-[#002452] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
            }`}
          >
            <span>Planifiée</span>
            <span className="bg-[#F1F5F9] text-[#64748B] text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {planifieesCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('EN_COURS')}
            type="button"
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filter === 'EN_COURS'
                ? 'bg-[#006a6a] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
            }`}
          >
            <span>En cours</span>
            <span className="bg-[#E0F7F7] text-[#007070] text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
              {enCoursCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('INSTALLEE')}
            type="button"
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filter === 'INSTALLEE'
                ? 'bg-[#002452] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
            }`}
          >
            <span>Installée</span>
            <span className="bg-[#F1F5F9] text-[#64748B] text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {installeesCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('VALIDEE')}
            type="button"
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filter === 'VALIDEE'
                ? 'bg-[#15803D] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
            }`}
          >
            <span>Validée</span>
            <span className="bg-[#DCFCE7] text-[#15803D] text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
              {valideesCount}
            </span>
          </button>
        </div>
      </section>

      {/* Deployments Single-Level Cards List (Stitch HTML 8) */}
      <section className="flex flex-col gap-3">
        {filteredInstallations.map((item) => {
          const isEnCours = item.status === 'En cours';
          const isValidee = item.status === 'Validée';
          const isPlanifiee = item.status === 'Planifiée';
          const isInstallee = item.status === 'Installée';

          return (
            <article
              key={item.id}
              onClick={() => {
                if (item.equipmentIds.length > 0) {
                  navigate('equipment-detail', { equipmentId: item.equipmentIds[0] });
                } else {
                  navigate('client-detail', { customerId: item.customerId });
                }
              }}
              className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col gap-2.5 transition-colors hover:border-slate-300 cursor-pointer shadow-xs active:bg-[#F8FAFC]"
            >
              {/* Card Header & Badge */}
              <div className="flex items-center justify-between border-b border-[#E2E8F0]/70 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#002452] bg-[#EEF4FF] px-2 py-0.5 rounded">
                    {item.id}
                  </span>
                  {isEnCours && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#006a6a]"></span>}
                </div>

                <span
                  className={`font-sans text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    isEnCours
                      ? 'bg-[#E0F7F7] text-[#007070]'
                      : isValidee
                      ? 'bg-[#DCFCE7] text-[#15803D]'
                      : isPlanifiee
                      ? 'bg-[#F1F5F9] text-[#64748B]'
                      : 'bg-[#E0F2FE] text-[#0369A1]'
                  }`}
                >
                  {isEnCours && <span className="w-1.5 h-1.5 rounded-full bg-[#006a6a] animate-pulse"></span>}
                  {isValidee && <span className="material-symbols-outlined text-[14px]">check_circle</span>}
                  {item.status}
                </span>
              </div>

              {/* Client & Site Location */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-display font-bold text-sm text-[#1A1A2E] tracking-tight">
                    {item.customerName}
                  </h2>
                  <div className="flex items-center gap-1 text-[#64748B] text-xs mt-0.5">
                    <span className="material-symbols-outlined text-[15px]">location_on</span>
                    <span>{item.siteName}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#64748B] text-[20px]">chevron_right</span>
              </div>

              {/* Equipment & Hardware */}
              <div className="flex items-center gap-2 text-[#1A1A2E] bg-[#F8FAFC] px-2.5 py-2 rounded-lg border border-[#E2E8F0]/60">
                <span className="material-symbols-outlined text-[#006a6a] text-[18px]">satellite_alt</span>
                <span className="text-xs font-semibold truncate">{item.equipmentTitle}</span>
              </div>

              {/* Field Tech & Date Tracking */}
              <div className="flex items-center justify-between text-[#64748B] text-xs pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">engineering</span>
                  <span>Tech: <strong className="text-[#1A1A2E] font-medium">{item.technicianName}</strong></span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  <span>{item.date} {item.time ? `(${item.time})` : ''}</span>
                </div>
              </div>

              {/* Linked Field Documents */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-[#E2E8F0]/60 flex-wrap text-xs">
                <span className="text-[10px] text-[#64748B] font-semibold mr-1">Docs:</span>
                <span className="text-[10px] bg-[#F1F5F9] text-[#1A1A2E] px-2 py-0.5 rounded border border-[#E2E8F0] font-medium">
                  {item.docsStatus.fit}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded border font-medium ${
                    item.docsStatus.pvm.includes('Signé')
                      ? 'bg-[#DCFCE7] text-[#15803D] border-[#15803D]/20'
                      : 'bg-[#FEF2F2] text-[#EF4444] border-[#EF4444]/20'
                  }`}
                >
                  {item.docsStatus.pvm}
                </span>
                {item.docsStatus.acc && (
                  <span className="text-[10px] bg-[#E0F7F7] text-[#007070] px-2 py-0.5 rounded border border-[#007070]/20 font-medium">
                    {item.docsStatus.acc}
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <NewInstallationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
