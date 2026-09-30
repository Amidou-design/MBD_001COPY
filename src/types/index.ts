export type ProductTrackType = 'SERIALIZED' | 'QUANTIFIED' | 'SERVICE';

export interface Product {
  id: string;
  name: string;
  reference: string;
  brand: string;
  model: string;
  category: 'Réseau' | 'Satellite' | 'Câblage & Accessoires' | 'Énergie' | 'Services Pro';
  description: string;
  trackType: ProductTrackType;
  unit: string; // 'unité', 'm', 'pièce', 'forfait'
  costPrice: number; // Coût d'achat en FCFA
  sellingPrice: number; // Prix de vente en FCFA
  currentStock: number; // Nombre d'unités ou mètres en stock
  minThreshold?: number; // Seuil d'alerte stock critique
  image?: string;
}

export type EquipmentStatus = 
  | 'EN STOCK' 
  | 'RÉSERVÉ' 
  | 'INSTALLÉ' 
  | 'MAINTENANCE' 
  | 'RETOURNÉ' 
  | 'VENDU' 
  | 'PERDU' 
  | 'RÉFORMÉ';

export interface Equipment {
  id: string;
  productId: string;
  productName: string;
  category: string;
  serialNumber: string;
  macAddress: string;
  internalCode: string; // ex: OKN-MAT-00027
  status: EquipmentStatus;
  lifecycleStep: 1 | 2 | 3 | 4; // 1: Acheté, 2: Stock, 3: Réservé, 4: Installé
  location: string; // ex: "Site Ouaga 2000" ou "Dépôt Central Somgandé"
  costPrice: number;
  purchaseDate: string;
  warranty: string;
  supplierId?: string;
  supplierName?: string;
  customerId?: string;
  customerName?: string;
  siteId?: string;
  siteName?: string;
  installationId?: string;
  associatedAccessories?: string[];
  history?: {
    date: string;
    event: string;
    operator: string;
    notes?: string;
  }[];
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  deliveryDelay: string;
}

export interface PurchaseItem {
  id: string;
  productId: string;
  productName: string;
  trackType: ProductTrackType;
  quantity: number;
  unit: string;
  unitCost: number;
  serialNumbers?: string[];
}

export interface Purchase {
  id: string; // e.g. ACH-2026-0012
  supplierId: string;
  supplierName: string;
  date: string;
  status: 'REÇU' | 'EN COURS';
  totalAmount: number;
  items: PurchaseItem[];
  notes?: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  trackType: ProductTrackType;
  quantity: number;
  unit: string;
  unitPrice: number;
  unitCost: number;
  equipmentId?: string;
  serialNumber?: string;
}

export interface Sale {
  id: string; // e.g. VNT-2026-0087
  invoiceNumber: string; // e.g. FAC-2026-044
  customerId: string;
  customerName: string;
  siteId?: string;
  siteName?: string;
  date: string;
  subtotal: number;
  vat: number; // 18%
  totalTTC: number;
  totalCost: number;
  margin: number;
  marginRate: number; // in %
  paymentStatus: 'Payée' | 'Partiel' | 'En retard' | 'Devis validé';
  depositPaid?: number;
  items: SaleItem[];
}

export interface Customer {
  id: string; // e.g. CLT-2024-0012
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  status: 'Actif' | 'En attente' | 'Inactif' | 'En attente devis';
  balance: number; // Solde en compte
  unpaidInvoiceRef?: string;
  totalBilled: number;
  sitesCount: number;
  activeEquipmentCount: number;
}

export interface Site {
  id: string;
  customerId: string;
  customerName: string;
  name: string; // e.g. "Site Siège Ouaga 2000"
  city: string;
  address: string;
  connectedEquipmentCount: number;
  status: 'Actif' | 'En attente' | 'En travaux';
}

export interface Installation {
  id: string; // INST-2026-031
  customerId: string;
  customerName: string;
  siteId: string;
  siteName: string;
  technicianName: string;
  date: string;
  time?: string;
  status: 'Planifiée' | 'En cours' | 'Installée' | 'Validée';
  equipmentTitle: string;
  equipmentIds: string[];
  consumablesUsed: {
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
  }[];
  docsStatus: {
    fit: string; // e.g. 'FIT Signée'
    pvm: string; // e.g. 'PVM en attente'
    acc?: string;
  };
}

export interface Intervention {
  id: string; // INT-2026-088
  customerId: string;
  customerName: string;
  siteId: string;
  siteName: string;
  equipmentId?: string;
  equipmentTitle: string;
  urgency: 'Urgence Haute' | 'Urgence Moyenne' | 'Urgence Normale';
  status: 'En cours' | 'En attente pièce' | 'Planifiée' | 'Clôturée & Validée';
  technicianName: string;
  date: string;
  time?: string;
  description: string;
  reportStatus: string;
  consumablesUsed?: {
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
  }[];
}

export type DocumentType = 
  | 'DEV' // Devis
  | 'FAC' // Facture
  | 'REC' // Reçu de paiement
  | 'CTR' // Contrat de services
  | 'FIT' // Fiche technique d'installation
  | 'PVM' // PV de mise en service
  | 'ACC' // Fiche accès & tickets
  | 'INT' // Fiche d'intervention
  | 'CLO'; // Fiche de clôture

export interface AppDocument {
  id: string; // e.g. PVM-2026-0042
  type: DocumentType;
  title: string;
  customerId?: string;
  customerName?: string;
  siteName?: string;
  equipmentId?: string;
  equipmentTitle?: string;
  serialNumber?: string;
  macAddress?: string;
  date: string;
  status: string; // 'Signé & Validé', 'Conforme', 'Payée', etc.
  totalAmount?: number;
  signedBy?: string;
  telemetry?: {
    downloadSpeed: number; // Mbps
    uploadSpeed: number; // Mbps
    latency: number; // ms
    obstruction: number; // %
  };
  technicianVisa?: {
    name: string;
    title: string;
    date: string;
  };
  clientVisa?: {
    name: string;
    company: string;
    status: string;
  };
  notes?: string;
}

export type MovementType = 
  | 'ACHAT' 
  | 'VENTE' 
  | 'TRANSFERT' 
  | 'RÉSERVATION' 
  | 'INSTALLATION' 
  | 'RETOUR' 
  | 'AJUSTEMENT' 
  | 'RÉFORME';

export interface StockMovement {
  id: string;
  date: string;
  type: MovementType;
  productId: string;
  productName: string;
  equipmentId?: string;
  serialNumber?: string;
  quantity: number;
  unit: string;
  sourceLocation: string;
  destLocation: string;
  reference: string; // e.g. ACH-2026-0012, FAC-2026-044, INST-2026-031
  operator: string;
  comment: string;
}

export interface InventoryItemCount {
  productId: string;
  productName: string;
  code: string;
  unit: string;
  theoreticalQty: number;
  countedQty: number;
  difference: number;
  status: 'Conforme' | 'Manquant' | 'Excédent';
}

export interface InventorySession {
  id: string; // #INV-2026-09
  location: string;
  operator: string;
  date: string;
  status: 'EN_COURS' | 'CLÔTURÉE';
  items: InventoryItemCount[];
}
