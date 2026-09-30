import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface NewInstallationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewInstallationModal: React.FC<NewInstallationModalProps> = ({ isOpen, onClose }) => {
  const { customers, sites, equipments, products, recordInstallation, navigate } = useApp();

  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [siteId, setSiteId] = useState(sites[0]?.id || '');
  const [technicianName, setTechnicianName] = useState('Amidou Ouedraogo');
  const [equipmentTitle, setEquipmentTitle] = useState('Kit Starlink Standard V4 + Mât galvanisé 3m');
  const [selectedEqIds, setSelectedEqIds] = useState<string[]>([]);
  const [cableMeters, setCableMeters] = useState(45);
  const [rj45Pieces, setRj45Pieces] = useState(8);

  if (!isOpen) return null;

  const currentCustomerSites = sites.filter((s) => s.customerId === customerId);
  const stockEquipments = equipments.filter((e) => e.status === 'EN STOCK' || e.status === 'RÉSERVÉ');

  const handleToggleEquipment = (id: string) => {
    setSelectedEqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveSiteId = siteId || currentCustomerSites[0]?.id || sites[0]?.id;

    const res = recordInstallation({
      customerId,
      siteId: effectiveSiteId,
      technicianName,
      equipmentIds: selectedEqIds,
      equipmentTitle,
      consumables: [
        { productId: 'prod-cable-cat6', quantity: cableMeters },
        { productId: 'prod-rj45', quantity: rj45Pieces },
      ],
    });

    if (res.success) {
      alert(res.message);
      onClose();
      navigate('installations');
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#002452] text-[22px]">build</span>
            <h2 className="font-display font-bold text-base text-[#002452]">Nouvelle Installation Terrain</h2>
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
            <label className="block font-semibold text-[#1A1A2E] mb-1">Client souscripteur</label>
            <select
              value={customerId}
              onChange={(e) => {
                setCustomerId(e.target.value);
                const firstSite = sites.find((s) => s.customerId === e.target.value);
                if (firstSite) setSiteId(firstSite.id);
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
            <label className="block font-semibold text-[#1A1A2E] mb-1">Site de raccordement</label>
            <select
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none"
            >
              {currentCustomerSites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#1A1A2E] mb-1">Libellé du Déploiement</label>
            <input
              type="text"
              value={equipmentTitle}
              onChange={(e) => setEquipmentTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1A1A2E] mb-1">Technicien Agréé Terrain</label>
            <input
              type="text"
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1A1A2E] mb-1">
              Affecter des équipements sérialisés du stock (passeront à INSTALLÉ) :
            </label>
            <div className="max-h-36 overflow-y-auto space-y-1.5 border border-[#E2E8F0] rounded-xl p-2 bg-[#F8FAFC]">
              {stockEquipments.length === 0 ? (
                <p className="text-[11px] text-[#64748B]">Aucun équipement libre en stock actuellement.</p>
              ) : (
                stockEquipments.map((eq) => (
                  <label
                    key={eq.id}
                    className={`flex items-center justify-between p-2 rounded-lg border text-[11px] cursor-pointer ${
                      selectedEqIds.includes(eq.id) ? 'bg-[#EEF4FF] border-[#002452]' : 'bg-white border-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedEqIds.includes(eq.id)}
                        onChange={() => handleToggleEquipment(eq.id)}
                        className="rounded text-[#002452]"
                      />
                      <span className="font-semibold text-[#002452]">{eq.productName}</span>
                    </div>
                    <span className="font-mono text-[#64748B]">{eq.serialNumber}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Consumables */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-[#1A1A2E] mb-1">Câble Cat6 utilisé (m)</label>
              <input
                type="number"
                min="0"
                value={cableMeters}
                onChange={(e) => setCableMeters(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1A1A2E] mb-1">RJ45 sertis (pièces)</label>
              <input
                type="number"
                min="0"
                value={rj45Pieces}
                onChange={(e) => setRj45Pieces(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#002452] text-white rounded-xl font-display font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 shadow-sm mt-3"
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Valider le Déploiement & Générer FIT + PVM</span>
          </button>
        </form>
      </div>
    </div>
  );
};
