import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface NewInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetEquipmentId?: string;
}

export const NewInterventionModal: React.FC<NewInterventionModalProps> = ({
  isOpen,
  onClose,
  presetEquipmentId,
}) => {
  const { customers, sites, equipments, recordIntervention, navigate } = useApp();

  const presetEq = presetEquipmentId ? equipments.find((e) => e.id === presetEquipmentId) : undefined;

  const [customerId, setCustomerId] = useState(presetEq?.customerId || customers[0]?.id || '');
  const [siteId, setSiteId] = useState(presetEq?.siteId || sites[0]?.id || '');
  const [equipmentId, setEquipmentId] = useState(presetEquipmentId || equipments[0]?.id || '');
  const [equipmentTitle, setEquipmentTitle] = useState(
    presetEq ? `${presetEq.productName} (${presetEq.internalCode})` : 'Antenne Starlink & Câblage'
  );
  const [urgency, setUrgency] = useState<'Urgence Haute' | 'Urgence Moyenne' | 'Urgence Normale'>('Urgence Haute');
  const [technicianName, setTechnicianName] = useState('Amidou Ouedraogo');
  const [description, setDescription] = useState('Perte de signal / maintenance corrective requise.');
  const [cableMeters, setCableMeters] = useState(5);

  if (!isOpen) return null;

  const customerSites = sites.filter((s) => s.customerId === customerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveSiteId = siteId || customerSites[0]?.id || sites[0]?.id;

    const res = recordIntervention({
      customerId,
      siteId: effectiveSiteId,
      equipmentId: equipmentId || undefined,
      equipmentTitle,
      urgency,
      technicianName,
      description,
      consumables: cableMeters > 0 ? [{ productId: 'prod-cable-cat6', quantity: cableMeters }] : undefined,
    });

    if (res.success) {
      alert(res.message);
      onClose();
      navigate('interventions');
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#EF4444] text-[22px]">build_circle</span>
            <h2 className="font-display font-bold text-base text-[#002452]">Nouveau Ticket SAV / Intervention</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#1A1A2E] mb-1">Niveau d’Urgence</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Urgence Haute', 'Urgence Moyenne', 'Urgence Normale'] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUrgency(u)}
                  className={`py-2 px-1 rounded-xl text-center font-semibold text-[11px] border transition-all ${
                    urgency === u
                      ? u === 'Urgence Haute'
                        ? 'bg-[#FEF2F2] border-[#EF4444] text-[#EF4444]'
                        : 'bg-[#EEF4FF] border-[#002452] text-[#002452]'
                      : 'bg-white border-[#E2E8F0] text-[#64748B]'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#1A1A2E] mb-1">Client concerné</label>
            <select
              value={customerId}
              onChange={(e) => {
                setCustomerId(e.target.value);
                const s = sites.find((site) => site.customerId === e.target.value);
                if (s) setSiteId(s.id);
              }}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#1A1A2E] mb-1">Site d’intervention</label>
            <select
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none"
            >
              {customerSites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#1A1A2E] mb-1">Matériel / Objet de l’intervention</label>
            <input
              type="text"
              value={equipmentTitle}
              onChange={(e) => setEquipmentTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1A1A2E] mb-1">Description du problème / Diagnostic</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1A1A2E] mb-1">Technicien assigné</label>
            <input
              type="text"
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1A1A2E] mb-1">Pièce de rechange / Câble utilisé (m)</label>
            <input
              type="number"
              min="0"
              value={cableMeters}
              onChange={(e) => setCableMeters(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#002452] text-white rounded-xl font-display font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 shadow-sm mt-3"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>Enregistrer le ticket & Générer Fiche INT</span>
          </button>
        </form>
      </div>
    </div>
  );
};
