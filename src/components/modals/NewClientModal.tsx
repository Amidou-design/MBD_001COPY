import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({ isOpen, onClose }) => {
  const { addCustomer, addSite } = useApp();

  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('+226 ');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Ouagadougou');
  const [siteName, setSiteName] = useState('Siège principal');
  const [siteCity, setSiteCity] = useState('Ouagadougou');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Veuillez renseigner le nom de l’entreprise.');
      return;
    }

    const newCust = addCustomer({
      name,
      contactName: contactName || 'Direction',
      phone,
      email,
      address,
      status: 'Actif',
    });

    addSite({
      customerId: newCust.id,
      customerName: newCust.name,
      name: siteName || `Siège ${newCust.name}`,
      city: siteCity,
      address,
      status: 'Actif',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#002452] text-[22px]">person_add</span>
            <h2 className="font-display font-bold text-base text-[#002452]">Nouveau Client & Compte</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-[#1A1A2E] mb-1">Raison Sociale / Nom Entreprise *</label>
            <input
              type="text"
              required
              placeholder="Ex: Sahel Mining Ltd"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-[#1A1A2E] mb-1">Contact Référent</label>
              <input
                type="text"
                placeholder="M. Ouattara"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1A1A2E] mb-1">Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#1A1A2E] mb-1">Adresse Email</label>
            <input
              type="email"
              placeholder="contact@entreprise.bf"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl"
            />
          </div>

          <div className="pt-2 border-t border-[#E2E8F0]">
            <span className="block font-display font-bold text-[#002452] mb-2">Premier Site de Déploiement</span>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Nom du site (ex: Siège Ouaga 2000)"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl"
              />
              <input
                type="text"
                placeholder="Ville (ex: Ouagadougou / Bobo-Dioulasso)"
                value={siteCity}
                onChange={(e) => setSiteCity(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#002452] text-white rounded-xl font-display font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 shadow-sm mt-3"
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            <span>Enregistrer le compte client</span>
          </button>
        </form>
      </div>
    </div>
  );
};
