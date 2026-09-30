import React from 'react';
import { useApp, AppRoute } from '../../context/AppContext';

export const BottomNavBar: React.FC = () => {
  const { currentRoute, navigate } = useApp();

  // Mapping sub-routes to parent main tab
  const getActiveTab = (): 'accueil' | 'stock' | 'ventes' | 'clients' | 'plus' => {
    if (currentRoute === 'accueil') return 'accueil';
    if (['stock', 'equipment-detail', 'inventory-physical'].includes(currentRoute)) return 'stock';
    if (['ventes', 'new-sale'].includes(currentRoute)) return 'ventes';
    if (['clients', 'client-detail'].includes(currentRoute)) return 'clients';
    return 'plus'; // reports, documents, installations, interventions, purchases, movements, document-preview, etc.
  };

  const activeTab = getActiveTab();

  const navItems: {
    key: 'accueil' | 'stock' | 'ventes' | 'clients' | 'plus';
    targetRoute: AppRoute;
    label: string;
    icon: string;
  }[] = [
    { key: 'accueil', targetRoute: 'accueil', label: 'Accueil', icon: 'dashboard' },
    { key: 'stock', targetRoute: 'stock', label: 'Stock', icon: 'inventory_2' },
    { key: 'ventes', targetRoute: 'ventes', label: 'Ventes', icon: 'point_of_sale' },
    { key: 'clients', targetRoute: 'clients', label: 'Clients', icon: 'group' },
    { key: 'plus', targetRoute: 'plus', label: 'Plus', icon: 'more_horiz' },
  ];

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E2E8F0] pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.03)]"
    >
      <div className="max-w-screen-md mx-auto flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.targetRoute)}
              type="button"
              className={`flex-1 flex flex-col items-center justify-center h-12 transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-[#006a6a]'
                  : 'text-[#64748B] hover:text-[#002452]'
              }`}
            >
              <div
                className={`px-3 py-1 rounded-full flex flex-col items-center justify-center transition-colors ${
                  isActive ? 'bg-[#E0F7F7] font-semibold text-[#007070]' : ''
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 600" } : undefined}
                >
                  {item.icon}
                </span>
              </div>
              <span className={`text-[11px] font-medium leading-none mt-0.5 ${isActive ? 'font-bold text-[#002452]' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
