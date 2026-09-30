import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopHeader } from './components/common/TopHeader';
import { BottomNavBar } from './components/common/BottomNavBar';
import { OfflineIndicator } from './components/common/PWAInstallPrompt';

import { AccueilPage } from './pages/AccueilPage';
import { StockPage } from './pages/StockPage';
import { EquipmentDetailPage } from './pages/EquipmentDetailPage';
import { VentesPage } from './pages/VentesPage';
import { DocumentPreviewPage } from './pages/DocumentPreviewPage';
import { PhysicalInventoryPage } from './pages/PhysicalInventoryPage';
import { InterventionsPage } from './pages/InterventionsPage';
import { ClientsPage } from './pages/ClientsPage';
import { ClientDetailPage } from './pages/ClientDetailPage';
import { InstallationsPage } from './pages/InstallationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { PurchasesPage } from './pages/PurchasesPage';
import { StockMovementsPage } from './pages/StockMovementsPage';
import { MoreMenuPage } from './pages/MoreMenuPage';

const AppContent: React.FC = () => {
  const { currentRoute, goBack, selectedDocumentId } = useApp();

  const getHeaderProps = () => {
    switch (currentRoute) {
      case 'accueil':
        return { title: "ON'Konnect", subtitle: 'Accueil' };
      case 'stock':
        return { title: 'Stock', subtitle: 'Catalogue & Matériel' };
      case 'equipment-detail':
        return { title: 'Fiche Équipement', showBack: true };
      case 'ventes':
        return { title: 'Ventes', subtitle: 'Facturation & Suivi' };
      case 'clients':
        return { title: 'Clients', subtitle: 'CRM & Portefeuille' };
      case 'client-detail':
        return { title: 'Fiche Client', showBack: true };
      case 'document-preview':
        return {
          title: 'Aperçu Document',
          subtitle: selectedDocumentId,
          showBack: true,
        };
      case 'inventory-physical':
        return { title: 'Inventaire Physique', showBack: true };
      case 'interventions':
        return { title: 'Interventions & SAV', subtitle: 'Tickets terrain', showBack: true };
      case 'installations':
        return { title: 'Installations', subtitle: 'Déploiements', showBack: true };
      case 'reports':
        return { title: 'Rapports & Statistiques', showBack: true };
      case 'documents':
        return { title: 'Centre Documentaire', showBack: true };
      case 'purchases':
        return { title: 'Achats & Fournisseurs', showBack: true };
      case 'movements':
        return { title: 'Mouvements de Stock', showBack: true };
      case 'plus':
      default:
        return { title: 'Plus', subtitle: 'Modules étendus' };
    }
  };

  const headerProps = getHeaderProps();

  return (
    <div className="bg-[#f7f9fd] text-[#1A1A2E] font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-[#E0F7F7] selection:text-[#007070]">
      {/* Offline Toast Banner */}
      <OfflineIndicator />

      {/* Top Application Header */}
      <TopHeader
        title={headerProps.title}
        subtitle={headerProps.subtitle}
        showBack={headerProps.showBack}
        onBack={goBack}
      />

      {/* Main Content Stream with Top and Bottom Viewport Pads */}
      <main className="flex-1 w-full pt-16 pb-24">
        {currentRoute === 'accueil' && <AccueilPage />}
        {currentRoute === 'stock' && <StockPage />}
        {currentRoute === 'equipment-detail' && <EquipmentDetailPage />}
        {currentRoute === 'ventes' && <VentesPage />}
        {currentRoute === 'document-preview' && <DocumentPreviewPage />}
        {currentRoute === 'inventory-physical' && <PhysicalInventoryPage />}
        {currentRoute === 'interventions' && <InterventionsPage />}
        {currentRoute === 'clients' && <ClientsPage />}
        {currentRoute === 'client-detail' && <ClientDetailPage />}
        {currentRoute === 'installations' && <InstallationsPage />}
        {currentRoute === 'reports' && <ReportsPage />}
        {currentRoute === 'documents' && <DocumentsPage />}
        {currentRoute === 'purchases' && <PurchasesPage />}
        {currentRoute === 'movements' && <StockMovementsPage />}
        {currentRoute === 'plus' && <MoreMenuPage />}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
