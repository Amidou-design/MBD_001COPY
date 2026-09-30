import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from '../components/common/PWAInstallPrompt';
import { BarcodeScannerModal } from '../components/common/BarcodeScannerModal';

export const MoreMenuPage: React.FC = () => {
  const { navigate, runScenarioComplete, resetDataToDefault } = useApp();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRunGoldenScenario = () => {
    const res = runScenarioComplete();
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleResetData = () => {
    if (confirm('Voulez-vous réinitialiser toutes les données de démonstration ?')) {
      resetDataToDefault();
      setToastMessage('Données réinitialisées avec succès.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleDownloadSupabaseSQL = () => {
    const sqlSchema = `-- ============================================================
-- ON'KONNECT MANAGER — SUPABASE POSTGRESQL SCHEMA & RLS RULES
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users / Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'technician' CHECK (role IN ('admin', 'manager', 'technician', 'auditor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  reference TEXT UNIQUE NOT NULL,
  brand TEXT,
  model TEXT,
  category TEXT NOT NULL,
  description TEXT,
  track_type TEXT NOT NULL CHECK (track_type IN ('SERIALIZED', 'QUANTIFIED', 'SERVICE')),
  unit TEXT DEFAULT 'unité',
  cost_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
  selling_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
  current_stock NUMERIC(15, 2) NOT NULL DEFAULT 0,
  min_threshold NUMERIC(15, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Equipments (Serialized Units)
CREATE TABLE IF NOT EXISTS public.equipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products ON DELETE RESTRICT,
  serial_number TEXT UNIQUE NOT NULL,
  mac_address TEXT,
  internal_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'EN STOCK' CHECK (status IN ('EN STOCK', 'RÉSERVÉ', 'INSTALLÉ', 'MAINTENANCE', 'RETOURNÉ', 'VENDU', 'PERDU', 'RÉFORMÉ')),
  lifecycle_step INT DEFAULT 2 CHECK (lifecycle_step BETWEEN 1 AND 4),
  location TEXT NOT NULL,
  cost_price NUMERIC(15, 2) NOT NULL,
  purchase_date DATE DEFAULT CURRENT_DATE,
  warranty TEXT,
  customer_id UUID,
  site_id UUID,
  installation_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Customers & Sites
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  status TEXT DEFAULT 'Actif',
  balance NUMERIC(15, 2) DEFAULT 0,
  total_billed NUMERIC(15, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  status TEXT DEFAULT 'Actif',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Sales & Invoices
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers ON DELETE RESTRICT,
  site_id UUID REFERENCES public.sites ON DELETE SET NULL,
  sale_date DATE DEFAULT CURRENT_DATE,
  subtotal NUMERIC(15, 2) NOT NULL,
  vat NUMERIC(15, 2) NOT NULL,
  total_ttc NUMERIC(15, 2) NOT NULL,
  total_cost NUMERIC(15, 2) NOT NULL,
  margin NUMERIC(15, 2) NOT NULL,
  margin_rate NUMERIC(5, 2) NOT NULL,
  payment_status TEXT DEFAULT 'Payée' CHECK (payment_status IN ('Payée', 'Partiel', 'En retard', 'Devis validé')),
  deposit_paid NUMERIC(15, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Stock Movements (Audit Trail)
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  movement_date TIMESTAMPTZ DEFAULT NOW(),
  movement_type TEXT NOT NULL CHECK (movement_type IN ('ACHAT', 'VENTE', 'TRANSFERT', 'RÉSERVATION', 'INSTALLATION', 'RETOUR', 'AJUSTEMENT', 'RÉFORME')),
  product_id UUID REFERENCES public.products ON DELETE RESTRICT,
  equipment_id UUID REFERENCES public.equipments ON DELETE SET NULL,
  quantity NUMERIC(15, 2) NOT NULL,
  unit TEXT NOT NULL,
  source_location TEXT,
  dest_location TEXT,
  reference TEXT NOT NULL,
  operator_name TEXT,
  comment TEXT
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read products" ON public.products FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write products" ON public.products FOR ALL USING (auth.role() = 'authenticated');
`;

    const blob = new Blob([sqlSchema], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'supabase_onkonnect_schema.sql';
    link.click();
    URL.revokeObjectURL(url);
  };

  const modulesList = [
    {
      title: 'Achats & Fournisseurs',
      desc: 'Bons de réception, approvisionnements et gestion des fournisseurs',
      icon: 'local_shipping',
      route: 'purchases' as const,
      color: 'bg-[#EEF4FF] text-[#002452]',
    },
    {
      title: 'Installations & Déploiements',
      desc: 'Affectation terrain, raccordement et validation FIT / PVM',
      icon: 'build',
      route: 'installations' as const,
      color: 'bg-[#E0F7F7] text-[#006a6a]',
    },
    {
      title: 'Interventions & SAV',
      desc: 'Maintenance curative, perte de signal satellite et tickets',
      icon: 'handyman',
      route: 'interventions' as const,
      color: 'bg-[#FEF2F2] text-[#EF4444]',
    },
    {
      title: 'Centre Documentaire',
      desc: 'PV de mise en service, fiches techniques, devis et factures',
      icon: 'description',
      route: 'documents' as const,
      color: 'bg-[#F1F5F9] text-[#002452]',
    },
    {
      title: 'Rapports & Statistiques',
      desc: 'Analyse financière, marges réelles, tendances et exportations',
      icon: 'query_stats',
      route: 'reports' as const,
      color: 'bg-[#E0F7F7] text-[#007070]',
    },
    {
      title: 'Inventaire Physique',
      desc: 'Session de comptage par étagère et réconciliation automatique',
      icon: 'checklist',
      route: 'inventory-physical' as const,
      color: 'bg-[#EEF4FF] text-[#1B3A6B]',
    },
    {
      title: 'Mouvements de Stock',
      desc: 'Journal d’audit intégral des entrées, sorties et transferts',
      icon: 'sync_alt',
      route: 'movements' as const,
      color: 'bg-[#F8FAFC] text-[#64748B]',
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-screen-md mx-auto px-4 py-4 gap-4">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-[#002452] tracking-tight">
          Modules & Paramètres
        </h1>
        <p className="font-sans text-xs text-[#64748B]">
          Gestion globale ON'Konnect Manager, extensions et architecture
        </p>
      </div>

      {toastMessage && (
        <div className="p-3 bg-[#E0F7F7] border border-[#006a6a]/30 text-[#007070] text-xs font-semibold rounded-xl flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Action Card: Scénario d'Or Complet */}
      <div className="bg-gradient-to-br from-[#002452] to-[#1B3A6B] text-white rounded-2xl p-4 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#75f6f6] uppercase font-bold tracking-wider">
            Test Intégral Section 37
          </span>
          <span className="w-2 h-2 rounded-full bg-[#3EC8C8] animate-pulse"></span>
        </div>
        <h3 className="font-display font-bold text-base">Cycle d'Or Opérationnel en 1 Clic</h3>
        <p className="text-xs text-white/80 leading-relaxed">
          Exécute l'enchaînement métier complet : Achat 5 MikroTik + 610m Cat6 + 500 RJ45 → Inventaire & Écarts → Vente → Installation → Intervention → Documents.
        </p>
        <div className="pt-1 flex items-center gap-2">
          <button
            onClick={handleRunGoldenScenario}
            type="button"
            className="flex-1 py-2.5 bg-[#3EC8C8] text-[#001a40] font-display font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-transform"
          >
            Exécuter le Scénario Complet
          </button>
          <button
            onClick={handleResetData}
            type="button"
            className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium"
            title="Réinitialiser données"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          </button>
        </div>
      </div>

      {/* Grid of Extended Modules */}
      <div className="space-y-2.5">
        <h2 className="font-display font-bold text-sm text-[#002452]">Tous les Modules de l'Application</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {modulesList.map((mod) => (
            <div
              key={mod.route}
              onClick={() => navigate(mod.route)}
              className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 flex items-start gap-3 hover:border-slate-300 cursor-pointer shadow-xs transition-colors"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${mod.color}`}>
                <span className="material-symbols-outlined text-[20px]">{mod.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-xs text-[#002452] truncate">{mod.title}</h3>
                <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-2">{mod.desc}</p>
              </div>
              <span className="material-symbols-outlined text-[16px] text-slate-400 mt-1">chevron_right</span>
            </div>
          ))}

          {/* Quick Scanner */}
          <div
            onClick={() => setIsScannerOpen(true)}
            className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 flex items-start gap-3 hover:border-slate-300 cursor-pointer shadow-xs transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-[#E0F7F7] text-[#006a6a] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-xs text-[#002452]">Scanner Numéro de Série</h3>
              <p className="text-[11px] text-[#64748B] mt-0.5">Reconnaissance optique & recherche rapide sur le parc</p>
            </div>
            <span className="material-symbols-outlined text-[16px] text-slate-400 mt-1">chevron_right</span>
          </div>
        </div>
      </div>

      {/* Supabase Ready Architecture (Section 28 & 29) */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006a6a] text-[20px]">database</span>
            <h3 className="font-display font-bold text-xs text-[#002452]">Architecture Backend Supabase</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#E0F7F7] text-[#007070] text-[10px] font-bold">
            Modèle PostgreSQL Prêt
          </span>
        </div>
        <p className="text-xs text-[#64748B] leading-relaxed">
          L'application utilise une couche d'abstraction Repository. Les données sont persistées en cache local et le schéma DDL PostgreSQL avec Row Level Security (RLS) est prêt pour le déploiement sur Supabase.
        </p>
        <button
          onClick={handleDownloadSupabaseSQL}
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#002452] text-xs font-semibold hover:bg-slate-100"
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          <span>Télécharger le schéma SQL Supabase</span>
        </button>
      </div>

      {/* PWA & Mobile Installation */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#002452] text-[20px]">install_mobile</span>
            <h3 className="font-display font-bold text-xs text-[#002452]">Statut PWA (Application Web Progressive)</h3>
          </div>
          <span className="text-[10px] font-mono text-[#006a6a] font-bold">Standalone Ready</span>
        </div>
        <p className="text-xs text-[#64748B]">
          Application responsive mobile-first installable sur smartphone sans magasin applicatif.
        </p>
        <div className="pt-1">
          <PWAInstallButton />
        </div>
      </div>

      <BarcodeScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </div>
  );
};
