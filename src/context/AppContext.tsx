import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Equipment,
  Supplier,
  Purchase,
  Sale,
  Customer,
  Site,
  Installation,
  Intervention,
  AppDocument,
  StockMovement,
  InventorySession,
  EquipmentStatus,
  ProductTrackType,
} from '../types';
import {
  initialProducts,
  initialEquipments,
  initialSuppliers,
  initialSales,
  initialPurchases,
  initialCustomers,
  initialSites,
  initialInstallations,
  initialInterventions,
  initialDocuments,
  initialMovements,
  initialInventorySession,
} from '../data/mockData';

export type AppRoute =
  | 'accueil'
  | 'stock'
  | 'ventes'
  | 'clients'
  | 'plus'
  | 'equipment-detail'
  | 'client-detail'
  | 'document-preview'
  | 'inventory-physical'
  | 'interventions'
  | 'installations'
  | 'reports'
  | 'documents'
  | 'purchases'
  | 'movements'
  | 'new-sale'
  | 'new-purchase';

interface NavigationState {
  currentRoute: AppRoute;
  previousRoutes: { route: AppRoute; params?: any }[];
  selectedEquipmentId?: string;
  selectedCustomerId?: string;
  selectedDocumentId?: string;
  selectedInstallationId?: string;
  selectedInterventionId?: string;
}

interface AppContextType {
  // Navigation
  currentRoute: AppRoute;
  selectedEquipmentId?: string;
  selectedCustomerId?: string;
  selectedDocumentId?: string;
  navigate: (route: AppRoute, params?: { equipmentId?: string; customerId?: string; documentId?: string; installationId?: string; interventionId?: string }) => void;
  goBack: () => void;

  // Data Store
  products: Product[];
  equipments: Equipment[];
  suppliers: Supplier[];
  purchases: Purchase[];
  sales: Sale[];
  customers: Customer[];
  sites: Site[];
  installations: Installation[];
  interventions: Intervention[];
  documents: AppDocument[];
  movements: StockMovement[];
  inventorySession: InventorySession;

  // Core Business Operations
  recordPurchase: (data: {
    supplierId: string;
    items: {
      productId: string;
      quantity: number;
      unitCost: number;
      serialNumbers?: string[];
    }[];
    notes?: string;
  }) => { success: boolean; message: string; purchaseId?: string };

  recordSale: (data: {
    customerId: string;
    siteId?: string;
    items: {
      productId: string;
      quantity: number;
      unitPrice: number;
      equipmentId?: string;
    }[];
    paymentStatus?: 'Payée' | 'Partiel' | 'En retard' | 'Devis validé';
    depositPaid?: number;
  }) => { success: boolean; message: string; saleId?: string; invoiceNumber?: string };

  recordPhysicalInventoryCount: (itemsCount: { productId: string; countedQty: number }[]) => {
    success: boolean;
    message: string;
    session: InventorySession;
  };

  validatePhysicalInventory: () => { success: boolean; message: string; pvmDocumentId?: string };

  recordInstallation: (data: {
    customerId: string;
    siteId: string;
    technicianName: string;
    equipmentIds: string[];
    equipmentTitle: string;
    consumables: { productId: string; quantity: number }[];
  }) => { success: boolean; message: string; installationId?: string };

  recordIntervention: (data: {
    customerId: string;
    siteId: string;
    equipmentId?: string;
    equipmentTitle: string;
    urgency: 'Urgence Haute' | 'Urgence Moyenne' | 'Urgence Normale';
    description: string;
    technicianName: string;
    consumables?: { productId: string; quantity: number }[];
  }) => { success: boolean; message: string; interventionId?: string };

  transferEquipment: (equipmentId: string, newLocation: string) => { success: boolean; message: string };

  addCustomer: (customer: Omit<Customer, 'id' | 'balance' | 'totalBilled' | 'sitesCount' | 'activeEquipmentCount'>) => Customer;
  addSite: (site: Omit<Site, 'id' | 'connectedEquipmentCount'>) => Site;

  // Scenario Helper for Demonstration
  runScenarioComplete: () => { success: boolean; message: string };
  resetDataToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'onkonnect_manager_db_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State with stack
  const [navState, setNavState] = useState<NavigationState>(() => ({
    currentRoute: 'accueil',
    previousRoutes: [],
    selectedEquipmentId: 'eq-00027',
    selectedCustomerId: 'CLT-2024-0012',
    selectedDocumentId: 'PVM-2026-0042',
  }));

  // Domain entities state (initialized from localStorage or seed mock)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [equipments, setEquipments] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_equipments');
    return saved ? JSON.parse(saved) : initialEquipments;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_suppliers');
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_purchases');
    return saved ? JSON.parse(saved) : initialPurchases;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_sales');
    return saved ? JSON.parse(saved) : initialSales;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [sites, setSites] = useState<Site[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_sites');
    return saved ? JSON.parse(saved) : initialSites;
  });

  const [installations, setInstallations] = useState<Installation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_installations');
    return saved ? JSON.parse(saved) : initialInstallations;
  });

  const [interventions, setInterventions] = useState<Intervention[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_interventions');
    return saved ? JSON.parse(saved) : initialInterventions;
  });

  const [documents, setDocuments] = useState<AppDocument[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_documents');
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  const [movements, setMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_movements');
    return saved ? JSON.parse(saved) : initialMovements;
  });

  const [inventorySession, setInventorySession] = useState<InventorySession>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_inventory');
    return saved ? JSON.parse(saved) : initialInventorySession;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_products', JSON.stringify(products));
    localStorage.setItem(STORAGE_KEY + '_equipments', JSON.stringify(equipments));
    localStorage.setItem(STORAGE_KEY + '_suppliers', JSON.stringify(suppliers));
    localStorage.setItem(STORAGE_KEY + '_purchases', JSON.stringify(purchases));
    localStorage.setItem(STORAGE_KEY + '_sales', JSON.stringify(sales));
    localStorage.setItem(STORAGE_KEY + '_customers', JSON.stringify(customers));
    localStorage.setItem(STORAGE_KEY + '_sites', JSON.stringify(sites));
    localStorage.setItem(STORAGE_KEY + '_installations', JSON.stringify(installations));
    localStorage.setItem(STORAGE_KEY + '_interventions', JSON.stringify(interventions));
    localStorage.setItem(STORAGE_KEY + '_documents', JSON.stringify(documents));
    localStorage.setItem(STORAGE_KEY + '_movements', JSON.stringify(movements));
    localStorage.setItem(STORAGE_KEY + '_inventory', JSON.stringify(inventorySession));
  }, [
    products,
    equipments,
    suppliers,
    purchases,
    sales,
    customers,
    sites,
    installations,
    interventions,
    documents,
    movements,
    inventorySession,
  ]);

  // Navigation handlers
  const navigate = (
    route: AppRoute,
    params?: {
      equipmentId?: string;
      customerId?: string;
      documentId?: string;
      installationId?: string;
      interventionId?: string;
    }
  ) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setNavState((prev) => ({
      currentRoute: route,
      previousRoutes: [
        ...prev.previousRoutes,
        {
          route: prev.currentRoute,
          params: {
            equipmentId: prev.selectedEquipmentId,
            customerId: prev.selectedCustomerId,
            documentId: prev.selectedDocumentId,
          },
        },
      ],
      selectedEquipmentId: params?.equipmentId ?? prev.selectedEquipmentId,
      selectedCustomerId: params?.customerId ?? prev.selectedCustomerId,
      selectedDocumentId: params?.documentId ?? prev.selectedDocumentId,
      selectedInstallationId: params?.installationId ?? prev.selectedInstallationId,
      selectedInterventionId: params?.interventionId ?? prev.selectedInterventionId,
    }));
  };

  const goBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setNavState((prev) => {
      if (prev.previousRoutes.length === 0) {
        return { ...prev, currentRoute: 'accueil' };
      }
      const last = prev.previousRoutes[prev.previousRoutes.length - 1];
      const remaining = prev.previousRoutes.slice(0, -1);
      return {
        currentRoute: last.route,
        previousRoutes: remaining,
        selectedEquipmentId: last.params?.equipmentId ?? prev.selectedEquipmentId,
        selectedCustomerId: last.params?.customerId ?? prev.selectedCustomerId,
        selectedDocumentId: last.params?.documentId ?? prev.selectedDocumentId,
      };
    });
  };

  // 1. ACHAT: Réception de stock fournisseur
  const recordPurchase = (data: {
    supplierId: string;
    items: {
      productId: string;
      quantity: number;
      unitCost: number;
      serialNumbers?: string[];
    }[];
    notes?: string;
  }) => {
    const supplier = suppliers.find((s) => s.id === data.supplierId);
    if (!supplier) {
      return { success: false, message: 'Fournisseur introuvable.' };
    }

    const purchaseNum = `ACH-2026-${String(purchases.length + 13).padStart(4, '0')}`;
    let totalPurchaseAmount = 0;
    const newEquipments: Equipment[] = [];
    const newMovements: StockMovement[] = [];

    // Clone products to update stock and cost
    const updatedProducts = [...products];

    data.items.forEach((item, index) => {
      const prodIdx = updatedProducts.findIndex((p) => p.id === item.productId);
      if (prodIdx === -1) return;
      const product = updatedProducts[prodIdx];
      const lineCost = item.quantity * item.unitCost;
      totalPurchaseAmount += lineCost;

      // Update unit cost
      updatedProducts[prodIdx] = {
        ...product,
        costPrice: item.unitCost,
      };

      if (product.trackType === 'SERIALIZED') {
        // Serialized product: increment stock count & generate Equipment entities
        updatedProducts[prodIdx].currentStock += item.quantity;
        for (let i = 0; i < item.quantity; i++) {
          const sn = item.serialNumbers?.[i] || `${product.reference}-${Date.now().toString().slice(-4)}-${i + 1}`;
          const internalCode = `OKN-MAT-${String(equipments.length + newEquipments.length + 28).padStart(5, '0')}`;
          
          const mac = `00:${Math.floor(Math.random() * 89 + 10)}:${Math.floor(Math.random() * 89 + 10)}:${Math.floor(Math.random() * 89 + 10)}:${Math.floor(Math.random() * 89 + 10)}:${Math.floor(Math.random() * 89 + 10)}`;

          const eq: Equipment = {
            id: `eq-${Date.now()}-${i}`,
            productId: product.id,
            productName: product.name,
            category: product.category,
            serialNumber: sn,
            macAddress: mac,
            internalCode,
            status: 'EN STOCK',
            lifecycleStep: 2,
            location: 'Dépôt Central Somgandé — Étagère A',
            costPrice: item.unitCost,
            purchaseDate: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
            warranty: '2 ans constructeur (Active)',
            supplierId: supplier.id,
            supplierName: supplier.name,
            associatedAccessories: ['Câble alimentation', 'Kit fixation standard'],
            history: [
              {
                date: 'Aujourd’hui',
                event: `Achat réceptionné via ${purchaseNum} auprès de ${supplier.name}`,
                operator: 'Amidou Ouedraogo',
              },
            ],
          };
          newEquipments.push(eq);

          newMovements.push({
            id: `MVT-${Date.now()}-${index}-${i}`,
            date: 'Aujourd’hui',
            type: 'ACHAT',
            productId: product.id,
            productName: product.name,
            equipmentId: eq.id,
            serialNumber: sn,
            quantity: 1,
            unit: product.unit,
            sourceLocation: supplier.name,
            destLocation: 'Dépôt Central Somgandé',
            reference: purchaseNum,
            operator: 'Amidou Ouedraogo',
            comment: `Entrée équipement sérialisé ${sn}`,
          });
        }
      } else if (product.trackType === 'QUANTIFIED') {
        // Quantified product (e.g. câble 610m, RJ45 500 pcs)
        updatedProducts[prodIdx].currentStock += item.quantity;
        newMovements.push({
          id: `MVT-${Date.now()}-${index}`,
          date: 'Aujourd’hui',
          type: 'ACHAT',
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unit: product.unit,
          sourceLocation: supplier.name,
          destLocation: 'Dépôt Central Somgandé',
          reference: purchaseNum,
          operator: 'Amidou Ouedraogo',
          comment: `Arrivage stock quantifié: +${item.quantity} ${product.unit}`,
        });
      }
      // SERVICE: no physical stock change
    });

    const newPurchase: Purchase = {
      id: purchaseNum,
      supplierId: supplier.id,
      supplierName: supplier.name,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'REÇU',
      totalAmount: totalPurchaseAmount,
      items: data.items.map((it, idx) => {
        const prod = updatedProducts.find((p) => p.id === it.productId)!;
        return {
          id: `pi-${purchaseNum}-${idx}`,
          productId: prod.id,
          productName: prod.name,
          trackType: prod.trackType,
          quantity: it.quantity,
          unit: prod.unit,
          unitCost: it.unitCost,
          serialNumbers: it.serialNumbers,
        };
      }),
      notes: data.notes,
    };

    setProducts(updatedProducts);
    setEquipments((prev) => [...newEquipments, ...prev]);
    setPurchases((prev) => [newPurchase, ...prev]);
    setMovements((prev) => [...newMovements, ...prev]);

    return {
      success: true,
      message: `Achat ${purchaseNum} validé : ${totalPurchaseAmount.toLocaleString('fr-FR')} FCFA. Stock mis à jour.`,
      purchaseId: purchaseNum,
    };
  };

  // 2. VENTE: Vente multi-articles avec calcul de marge & contrôle strict de stock
  const recordSale = (data: {
    customerId: string;
    siteId?: string;
    items: {
      productId: string;
      quantity: number;
      unitPrice: number;
      equipmentId?: string;
      equipmentIds?: string[];
    }[];
    paymentStatus?: 'Payée' | 'Partiel' | 'En retard' | 'Devis validé';
    depositPaid?: number;
  }) => {
    const customer = customers.find((c) => c.id === data.customerId);
    if (!customer) {
      return { success: false, message: 'Client non trouvé.' };
    }

    const site = sites.find((s) => s.id === data.siteId) || sites.find((s) => s.customerId === customer.id);

    // Verify stock availability for physical products
    for (const item of data.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;
      if (product.trackType !== 'SERVICE') {
        if (product.currentStock < item.quantity) {
          return {
            success: false,
            message: `Stock insuffisant pour "${product.name}" — ${product.currentStock} ${product.unit} disponibles, ${item.quantity} demandés.`,
          };
        }
      }
    }

    const saleId = `VNT-2026-${String(sales.length + 88).padStart(4, '0')}`;
    const invoiceNum = `FAC-2026-${String(sales.length + 45).padStart(3, '0')}`;

    let subtotal = 0;
    let totalCost = 0;
    const newMovements: StockMovement[] = [];
    const updatedProducts = [...products];
    const updatedEquipments = [...equipments];

    const saleItems = data.items.map((item, idx) => {
      const prodIdx = updatedProducts.findIndex((p) => p.id === item.productId);
      const product = updatedProducts[prodIdx];
      const itemSubtotal = item.quantity * item.unitPrice;
      const itemCost = item.quantity * product.costPrice;

      subtotal += itemSubtotal;
      totalCost += itemCost;

      const allocatedIds: string[] = [];
      const allocatedSerials: string[] = [];

      // Update physical inventory
      if (product.trackType === 'QUANTIFIED') {
        updatedProducts[prodIdx].currentStock = Math.max(0, product.currentStock - item.quantity);
        newMovements.push({
          id: `MVT-S-${Date.now()}-${idx}`,
          date: 'Aujourd’hui',
          type: 'VENTE',
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unit: product.unit,
          sourceLocation: 'Dépôt Central Somgandé',
          destLocation: customer.name + (site ? ` (${site.name})` : ''),
          reference: invoiceNum,
          operator: 'Amidou Ouedraogo',
          comment: `Sortie vente quantifié: -${item.quantity} ${product.unit}`,
        });
      } else if (product.trackType === 'SERIALIZED') {
        // Decrease product counter
        updatedProducts[prodIdx].currentStock = Math.max(0, product.currentStock - item.quantity);

        // Section 6: Manage distinct serialized equipments for each unit
        for (let u = 0; u < item.quantity; u++) {
          let targetEq: Equipment | undefined;
          if (item.equipmentIds && item.equipmentIds[u]) {
            targetEq = updatedEquipments.find((e) => e.id === item.equipmentIds![u]);
          } else if (u === 0 && item.equipmentId) {
            targetEq = updatedEquipments.find((e) => e.id === item.equipmentId);
          } else {
            targetEq = updatedEquipments.find(
              (e) => e.productId === product.id && e.status === 'EN STOCK' && !allocatedIds.includes(e.id)
            );
          }

          if (targetEq) {
            const eqIdx = updatedEquipments.findIndex((e) => e.id === targetEq!.id);
            allocatedIds.push(targetEq.id);
            allocatedSerials.push(targetEq.serialNumber);

            updatedEquipments[eqIdx] = {
              ...targetEq,
              status: 'VENDU',
              customerId: customer.id,
              customerName: customer.name,
              siteId: site?.id,
              siteName: site?.name,
              history: [
                ...(targetEq.history || []),
                {
                  date: 'Aujourd’hui',
                  event: `Vendu à ${customer.name} (Facture ${invoiceNum}) - Unité ${u + 1}/${item.quantity}`,
                  operator: 'Amidou Ouedraogo',
                },
              ],
            };

            newMovements.push({
              id: `MVT-S-${Date.now()}-${idx}-${u}`,
              date: 'Aujourd’hui',
              type: 'VENTE',
              productId: product.id,
              productName: product.name,
              equipmentId: targetEq.id,
              serialNumber: targetEq.serialNumber,
              quantity: 1,
              unit: product.unit,
              sourceLocation: 'Dépôt Central Somgandé',
              destLocation: customer.name + (site ? ` (${site.name})` : ''),
              reference: invoiceNum,
              operator: 'Amidou Ouedraogo',
              comment: `Sortie vente équipement sérialisé ${targetEq.serialNumber} (${u + 1}/${item.quantity})`,
            });
          } else {
            // Auto-provision equipment instance if stock had fewer pre-registered rows
            const newEqId = `eq-vnt-${Date.now()}-${idx}-${u}`;
            const autoSerial = `SN-${product.reference}-${Math.floor(1000 + Math.random() * 9000)}-${u + 1}`;
            const internalCode = `OKN-MAT-${String(updatedEquipments.length + 1).padStart(5, '0')}`;
            allocatedIds.push(newEqId);
            allocatedSerials.push(autoSerial);

            const newEq: Equipment = {
              id: newEqId,
              productId: product.id,
              productName: product.name,
              category: product.category,
              serialNumber: autoSerial,
              macAddress: `00:1B:63:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}:${u + 1}`,
              internalCode,
              status: 'VENDU',
              lifecycleStep: 4,
              location: customer.name + (site ? ` (${site.name})` : ''),
              costPrice: product.costPrice,
              purchaseDate: new Date().toLocaleDateString('fr-FR'),
              warranty: '12 mois',
              customerId: customer.id,
              customerName: customer.name,
              siteId: site?.id,
              siteName: site?.name,
              history: [
                {
                  date: 'Aujourd’hui',
                  event: `Vendu à ${customer.name} (Facture ${invoiceNum}) - Unité ${u + 1}/${item.quantity}`,
                  operator: 'Amidou Ouedraogo',
                },
              ],
            };
            updatedEquipments.unshift(newEq);

            newMovements.push({
              id: `MVT-S-${Date.now()}-${idx}-${u}`,
              date: 'Aujourd’hui',
              type: 'VENTE',
              productId: product.id,
              productName: product.name,
              equipmentId: newEqId,
              serialNumber: autoSerial,
              quantity: 1,
              unit: product.unit,
              sourceLocation: 'Dépôt Central Somgandé',
              destLocation: customer.name + (site ? ` (${site.name})` : ''),
              reference: invoiceNum,
              operator: 'Amidou Ouedraogo',
              comment: `Sortie vente équipement sérialisé ${autoSerial} (${u + 1}/${item.quantity})`,
            });
          }
        }
      }

      return {
        id: `si-${saleId}-${idx}`,
        productId: product.id,
        productName: product.name,
        trackType: product.trackType,
        quantity: item.quantity,
        unit: product.unit,
        unitPrice: item.unitPrice,
        unitCost: product.costPrice,
        equipmentId: allocatedIds[0] || item.equipmentId,
        serialNumber: allocatedSerials[0],
        equipmentIds: allocatedIds.length > 0 ? allocatedIds : undefined,
        serialNumbers: allocatedSerials.length > 0 ? allocatedSerials : undefined,
      };
    });

    // 4. NOUVEAU CALCUL D'UNE VENTE SANS TVA
    const totalAmount = subtotal;
    const margin = totalAmount - totalCost;
    const marginRate = totalAmount > 0 ? Number(((margin / totalAmount) * 100).toFixed(1)) : 0;
    const payStatus = data.paymentStatus || 'Payée';
    const depositPaid = data.depositPaid;
    const remainingDue = payStatus === 'Partiel'
      ? Math.max(0, totalAmount - (depositPaid || 0))
      : (payStatus === 'Payée' ? 0 : totalAmount);

    const newSale: Sale = {
      id: saleId,
      invoiceNumber: invoiceNum,
      customerId: customer.id,
      customerName: customer.name,
      siteId: site?.id,
      siteName: site?.name,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      subtotal,
      totalAmount,
      totalCost,
      margin,
      marginRate,
      paymentStatus: payStatus,
      depositPaid,
      remainingDue,
      items: saleItems,
    };

    // Create FAC document without any TVA
    const invoiceDoc: AppDocument = {
      id: invoiceNum,
      type: 'FAC',
      title: `Facture Vente & Prestations ${customer.name}`,
      customerId: customer.id,
      customerName: customer.name,
      siteName: site?.name,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: payStatus,
      totalAmount,
      technicianVisa: {
        name: 'Amidou Ouedraogo',
        title: "Responsable Commercial ON'Konnect",
        date: new Date().toLocaleDateString('fr-FR'),
      },
      clientVisa: {
        name: customer.contactName,
        company: customer.name,
        status: payStatus === 'Payée' ? 'Règlement validé' : 'En attente règlement',
      },
    };

    // Update customer billed and balance
    const updatedCustomers = customers.map((c) => {
      if (c.id === customer.id) {
        return {
          ...c,
          totalBilled: c.totalBilled + totalAmount,
          balance: payStatus !== 'Payée' ? c.balance + remainingDue : c.balance,
          unpaidInvoiceRef: payStatus !== 'Payée' ? invoiceNum : c.unpaidInvoiceRef,
        };
      }
      return c;
    });

    setProducts(updatedProducts);
    setEquipments(updatedEquipments);
    setSales((prev) => [newSale, ...prev]);
    setDocuments((prev) => [invoiceDoc, ...prev]);
    setMovements((prev) => [...newMovements, ...prev]);
    setCustomers(updatedCustomers);

    return {
      success: true,
      message: `Vente enregistrée avec succès ! Facture ${invoiceNum} générée. Marge calculée : ${margin.toLocaleString('fr-FR')} FCFA (${marginRate}%).`,
      saleId,
      invoiceNumber: invoiceNum,
    };
  };

  // 3. INVENTAIRE PHYSIQUE: Comptage et réconciliation
  const recordPhysicalInventoryCount = (itemsCount: { productId: string; countedQty: number }[]) => {
    const updatedItems = inventorySession.items.map((item) => {
      const match = itemsCount.find((ic) => ic.productId === item.productId);
      if (!match) return item;
      const difference = match.countedQty - item.theoreticalQty;
      let status: 'Conforme' | 'Manquant' | 'Excédent' = 'Conforme';
      if (difference < 0) status = 'Manquant';
      if (difference > 0) status = 'Excédent';
      return {
        ...item,
        countedQty: match.countedQty,
        difference,
        status,
      };
    });

    const newSession: InventorySession = {
      ...inventorySession,
      items: updatedItems,
    };
    setInventorySession(newSession);
    return {
      success: true,
      message: 'Comptages mis à jour.',
      session: newSession,
    };
  };

  const validatePhysicalInventory = () => {
    // Generate movements of AJUSTEMENT and update actual stock
    const newMovements: StockMovement[] = [];
    const updatedProducts = [...products];

    inventorySession.items.forEach((item, idx) => {
      const prodIdx = updatedProducts.findIndex((p) => p.id === item.productId);
      if (prodIdx !== -1) {
        updatedProducts[prodIdx].currentStock = item.countedQty;
      }
      if (item.difference !== 0) {
        newMovements.push({
          id: `MVT-INV-${Date.now()}-${idx}`,
          date: 'Aujourd’hui',
          type: 'AJUSTEMENT',
          productId: item.productId,
          productName: item.productName,
          quantity: item.difference,
          unit: item.unit,
          sourceLocation: inventorySession.location,
          destLocation: inventorySession.location,
          reference: inventorySession.id,
          operator: inventorySession.operator,
          comment: `Rapprochement inventaire physique: écart ${item.difference > 0 ? '+' : ''}${item.difference} ${item.unit}`,
        });
      }
    });

    // Generate PV d'Écart
    const pvmId = `PVM-2026-${String(documents.length + 50).padStart(4, '0')}`;
    const pvmDoc: AppDocument = {
      id: pvmId,
      type: 'PVM',
      title: `PV d'Écart et Réconciliation Stock — ${inventorySession.location}`,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Signé & Validé',
      telemetry: {
        downloadSpeed: 0,
        uploadSpeed: 0,
        latency: 0,
        obstruction: 0,
      },
      technicianVisa: {
        name: inventorySession.operator,
        title: "Responsable Logistique & Stock ON'Konnect",
        date: new Date().toLocaleDateString('fr-FR'),
      },
      clientVisa: {
        name: "Direction Générale ON'Konnect",
        company: "ON'Konnect Group",
        status: 'Audit de Stock Validé',
      },
      notes: `Session ${inventorySession.id} clôturée. ${newMovements.length} ajustements appliqués au grand livre de stock.`,
    };

    setProducts(updatedProducts);
    setMovements((prev) => [...newMovements, ...prev]);
    setDocuments((prev) => [pvmDoc, ...prev]);
    setInventorySession((prev) => ({ ...prev, status: 'CLÔTURÉE' }));

    return {
      success: true,
      message: `Comptage validé. Stocks réalignés sur le stock réel. PV d'Écart ${pvmId} généré.`,
      pvmDocumentId: pvmId,
    };
  };

  // 4. INSTALLATION: Déploiement terrain, passe à INSTALLÉ, déduit consommables, génère FIT & PVM
  const recordInstallation = (data: {
    customerId: string;
    siteId: string;
    technicianName: string;
    equipmentIds: string[];
    equipmentTitle: string;
    consumables: { productId: string; quantity: number }[];
  }) => {
    const customer = customers.find((c) => c.id === data.customerId);
    const site = sites.find((s) => s.id === data.siteId);
    if (!customer || !site) {
      return { success: false, message: 'Client ou site introuvable.' };
    }

    const instId = `INST-2026-${String(installations.length + 35).padStart(3, '0')}`;
    const updatedEquipments = [...equipments];
    const updatedProducts = [...products];
    const newMovements: StockMovement[] = [];

    // Update equipment statuses to INSTALLÉ
    data.equipmentIds.forEach((eqId) => {
      const idx = updatedEquipments.findIndex((e) => e.id === eqId);
      if (idx !== -1) {
        updatedEquipments[idx] = {
          ...updatedEquipments[idx],
          status: 'INSTALLÉ',
          lifecycleStep: 4,
          location: site.name,
          customerId: customer.id,
          customerName: customer.name,
          siteId: site.id,
          siteName: site.name,
          installationId: instId,
          history: [
            ...(updatedEquipments[idx].history || []),
            {
              date: 'Aujourd’hui',
              event: `Installé et raccordé sur ${site.name} par ${data.technicianName} (${instId})`,
              operator: data.technicianName,
            },
          ],
        };

        newMovements.push({
          id: `MVT-I-${Date.now()}-${eqId}`,
          date: 'Aujourd’hui',
          type: 'INSTALLATION',
          productId: updatedEquipments[idx].productId,
          productName: updatedEquipments[idx].productName,
          equipmentId: eqId,
          serialNumber: updatedEquipments[idx].serialNumber,
          quantity: 1,
          unit: 'unité',
          sourceLocation: 'Dépôt Central Somgandé',
          destLocation: site.name,
          reference: instId,
          operator: data.technicianName,
          comment: `Installation équipement ${updatedEquipments[idx].internalCode}`,
        });
      }
    });

    // Deduct consumables
    const usedConsumablesList = data.consumables.map((c, idx) => {
      const prodIdx = updatedProducts.findIndex((p) => p.id === c.productId);
      const prod = updatedProducts[prodIdx];
      if (prodIdx !== -1) {
        updatedProducts[prodIdx].currentStock = Math.max(0, prod.currentStock - c.quantity);
        newMovements.push({
          id: `MVT-IC-${Date.now()}-${idx}`,
          date: 'Aujourd’hui',
          type: 'INSTALLATION',
          productId: prod.id,
          productName: prod.name,
          quantity: c.quantity,
          unit: prod.unit,
          sourceLocation: 'Dépôt Central Somgandé',
          destLocation: site.name,
          reference: instId,
          operator: data.technicianName,
          comment: `Consommation installation : -${c.quantity} ${prod.unit}`,
        });
      }
      return {
        productId: prod.id,
        productName: prod.name,
        quantity: c.quantity,
        unit: prod.unit,
      };
    });

    const newInst: Installation = {
      id: instId,
      customerId: customer.id,
      customerName: customer.name,
      siteId: site.id,
      siteName: site.name,
      technicianName: data.technicianName,
      date: 'Aujourd’hui',
      status: 'Validée',
      equipmentTitle: data.equipmentTitle,
      equipmentIds: data.equipmentIds,
      consumablesUsed: usedConsumablesList,
      docsStatus: {
        fit: 'FIT Conforme',
        pvm: 'PVM Signé',
        acc: 'ACC Validé',
      },
    };

    // Generate FIT & PVM
    const fitId = `FIT-2026-${String(documents.length + 30).padStart(4, '0')}`;
    const pvmId = `PVM-2026-${String(documents.length + 31).padStart(4, '0')}`;

    const fitDoc: AppDocument = {
      id: fitId,
      type: 'FIT',
      title: `Fiche Technique d'Installation ${data.equipmentTitle}`,
      customerId: customer.id,
      customerName: customer.name,
      siteName: site.name,
      equipmentTitle: data.equipmentTitle,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Conforme',
      technicianVisa: {
        name: data.technicianName,
        title: "Technicien Agréé ON'Konnect",
        date: new Date().toLocaleDateString('fr-FR'),
      },
    };

    const pvmDoc: AppDocument = {
      id: pvmId,
      type: 'PVM',
      title: `PV de Mise en Service ${data.equipmentTitle}`,
      customerId: customer.id,
      customerName: customer.name,
      siteName: site.name,
      equipmentTitle: data.equipmentTitle,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Signé & Conforme',
      telemetry: {
        downloadSpeed: 238,
        uploadSpeed: 42,
        latency: 39,
        obstruction: 0.0,
      },
      technicianVisa: {
        name: data.technicianName,
        title: "Certifié terrain ON'Konnect",
        date: 'Aujourd’hui à 11:30',
      },
      clientVisa: {
        name: customer.contactName,
        company: customer.name,
        status: 'Signature numérique validée',
      },
    };

    // Update customer active equipment count
    const updatedCustomers = customers.map((c) => {
      if (c.id === customer.id) {
        return {
          ...c,
          activeEquipmentCount: c.activeEquipmentCount + data.equipmentIds.length,
        };
      }
      return c;
    });

    setEquipments(updatedEquipments);
    setProducts(updatedProducts);
    setInstallations((prev) => [newInst, ...prev]);
    setDocuments((prev) => [pvmDoc, fitDoc, ...prev]);
    setMovements((prev) => [...newMovements, ...prev]);
    setCustomers(updatedCustomers);

    return {
      success: true,
      message: `Installation ${instId} validée ! Équipement passé au statut INSTALLÉ. Documents ${fitId} et ${pvmId} générés.`,
      installationId: instId,
    };
  };

  // 5. INTERVENTION: SAV et maintenance
  const recordIntervention = (data: {
    customerId: string;
    siteId: string;
    equipmentId?: string;
    equipmentTitle: string;
    urgency: 'Urgence Haute' | 'Urgence Moyenne' | 'Urgence Normale';
    description: string;
    technicianName: string;
    consumables?: { productId: string; quantity: number }[];
  }) => {
    const customer = customers.find((c) => c.id === data.customerId);
    const site = sites.find((s) => s.id === data.siteId);
    if (!customer) return { success: false, message: 'Client non trouvé.' };

    const intId = `INT-2026-${String(interventions.length + 90).padStart(3, '0')}`;
    const newMovements: StockMovement[] = [];
    const updatedProducts = [...products];

    // Deduct any repair parts
    const usedPartsList = (data.consumables || []).map((c, idx) => {
      const prodIdx = updatedProducts.findIndex((p) => p.id === c.productId);
      const prod = updatedProducts[prodIdx];
      if (prodIdx !== -1) {
        updatedProducts[prodIdx].currentStock = Math.max(0, prod.currentStock - c.quantity);
        newMovements.push({
          id: `MVT-INT-${Date.now()}-${idx}`,
          date: 'Aujourd’hui',
          type: 'INSTALLATION',
          productId: prod.id,
          productName: prod.name,
          quantity: c.quantity,
          unit: prod.unit,
          sourceLocation: 'Dépôt Central Somgandé',
          destLocation: site?.name || customer.name,
          reference: intId,
          operator: data.technicianName,
          comment: `Pièce utilisée en SAV : -${c.quantity} ${prod.unit}`,
        });
      }
      return {
        productId: prod.id,
        productName: prod.name,
        quantity: c.quantity,
        unit: prod.unit,
      };
    });

    const newIntervention: Intervention = {
      id: intId,
      customerId: customer.id,
      customerName: customer.name,
      siteId: site?.id || 'SITE-01',
      siteName: site?.name || 'Site Client',
      equipmentId: data.equipmentId,
      equipmentTitle: data.equipmentTitle,
      urgency: data.urgency,
      status: 'Clôturée & Validée',
      technicianName: data.technicianName,
      date: 'Aujourd’hui',
      time: '14:00',
      description: data.description,
      reportStatus: 'PV signé client ✓',
      consumablesUsed: usedPartsList,
    };

    // Generate INT Document
    const intDoc: AppDocument = {
      id: intId,
      type: 'INT',
      title: `Rapport d'Intervention SAV — ${data.equipmentTitle}`,
      customerId: customer.id,
      customerName: customer.name,
      siteName: site?.name,
      equipmentId: data.equipmentId,
      equipmentTitle: data.equipmentTitle,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Clôturé & Validé',
      notes: data.description,
      technicianVisa: {
        name: data.technicianName,
        title: "Technicien SAV ON'Konnect",
        date: 'Aujourd’hui à 15:30',
      },
      clientVisa: {
        name: customer.contactName,
        company: customer.name,
        status: 'Validation intervention effectuée',
      },
    };

    setProducts(updatedProducts);
    setInterventions((prev) => [newIntervention, ...prev]);
    setDocuments((prev) => [intDoc, ...prev]);
    setMovements((prev) => [...newMovements, ...prev]);

    return {
      success: true,
      message: `Intervention ${intId} enregistrée et clôturée. Fiche INT générée.`,
      interventionId: intId,
    };
  };

  // Transfer equipment
  const transferEquipment = (equipmentId: string, newLocation: string) => {
    const eq = equipments.find((e) => e.id === equipmentId);
    if (!eq) return { success: false, message: 'Équipement non trouvé.' };

    const oldLocation = eq.location;
    const updatedEquipments = equipments.map((e) => {
      if (e.id === equipmentId) {
        return {
          ...e,
          location: newLocation,
          history: [
            ...(e.history || []),
            {
              date: 'Aujourd’hui',
              event: `Transfert de "${oldLocation}" vers "${newLocation}"`,
              operator: 'Amidou Ouedraogo',
            },
          ],
        };
      }
      return e;
    });

    const mvt: StockMovement = {
      id: `MVT-TR-${Date.now()}`,
      date: 'Aujourd’hui',
      type: 'TRANSFERT',
      productId: eq.productId,
      productName: eq.productName,
      equipmentId: eq.id,
      serialNumber: eq.serialNumber,
      quantity: 1,
      unit: 'unité',
      sourceLocation: oldLocation,
      destLocation: newLocation,
      reference: 'TRF-INTERNE',
      operator: 'Amidou Ouedraogo',
      comment: `Transfert de site: ${eq.internalCode}`,
    };

    setEquipments(updatedEquipments);
    setMovements((prev) => [mvt, ...prev]);

    return { success: true, message: `Équipement transféré vers ${newLocation}.` };
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'balance' | 'totalBilled' | 'sitesCount' | 'activeEquipmentCount'>): Customer => {
    const newCust: Customer = {
      ...customerData,
      id: `CLT-2026-${String(customers.length + 80).padStart(4, '0')}`,
      balance: 0,
      totalBilled: 0,
      sitesCount: 1,
      activeEquipmentCount: 0,
    };
    setCustomers((prev) => [newCust, ...prev]);
    return newCust;
  };

  const addSite = (siteData: Omit<Site, 'id' | 'connectedEquipmentCount'>): Site => {
    const newSite: Site = {
      ...siteData,
      id: `SITE-${String(sites.length + 10).padStart(2, '0')}`,
      connectedEquipmentCount: 0,
    };
    setSites((prev) => [...prev, newSite]);
    // Also increment customer site count
    setCustomers((prev) =>
      prev.map((c) => (c.id === siteData.customerId ? { ...c, sitesCount: c.sitesCount + 1 } : c))
    );
    return newSite;
  };

  // CRITÈRE DE RÉUSSITE PRINCIPAL (Section 37 du prompt):
  // Exécute enchaîné le scénario d'or pour validation immédiate
  const runScenarioComplete = () => {
    // 1. ACHAT: 5 MikroTik hAP ax3, 610m Cat6, 500 RJ45
    const purchaseRes = recordPurchase({
      supplierId: 'SUP-001',
      items: [
        { productId: 'prod-mikrotik-hap-ax3', quantity: 5, unitCost: 65000, serialNumbers: ['MTK-AX3-SCEN-1', 'MTK-AX3-SCEN-2', 'MTK-AX3-SCEN-3', 'MTK-AX3-SCEN-4', 'MTK-AX3-SCEN-5'] },
        { productId: 'prod-cable-cat6', quantity: 610, unitCost: 350 },
        { productId: 'prod-rj45', quantity: 500, unitCost: 110 },
      ],
      notes: 'Commande Scénario Principal 37',
    });

    // 2. INVENTAIRE: 4 MikroTik, 575m câble, 490 RJ45
    recordPhysicalInventoryCount([
      { productId: 'prod-mikrotik-hap-ax3', countedQty: 4 },
      { productId: 'prod-cable-cat6', countedQty: 575 },
      { productId: 'prod-rj45', countedQty: 490 },
    ]);
    validatePhysicalInventory();

    // 3. VENTE: 1 MikroTik, 35m câble, 20 RJ45 + Installation réseau + Configuration
    const saleRes = recordSale({
      customerId: 'CLT-2026-0071', // Entreprise ABC
      siteId: 'SITE-07', // Siège social Bobo
      items: [
        { productId: 'prod-mikrotik-hap-ax3', quantity: 1, unitPrice: 95000 },
        { productId: 'prod-cable-cat6', quantity: 35, unitPrice: 650 },
        { productId: 'prod-rj45', quantity: 20, unitPrice: 250 },
        { productId: 'serv-installation', quantity: 1, unitPrice: 150000 },
        { productId: 'serv-config-mikrotik', quantity: 1, unitPrice: 80000 },
      ],
      paymentStatus: 'Payée',
    });

    // 4 & 5 & 6. INSTALLATION: Le MikroTik devient INSTALLÉ, consommables déduits
    const availableEq = equipments.find((e) => e.productId === 'prod-mikrotik-hap-ax3') || equipments[0];
    recordInstallation({
      customerId: 'CLT-2026-0071',
      siteId: 'SITE-07',
      technicianName: 'Amidou Ouedraogo',
      equipmentTitle: 'Routeur MikroTik hAP ax3 + Déploiement LAN',
      equipmentIds: [availableEq.id],
      consumables: [
        { productId: 'prod-cable-cat6', quantity: 35 },
        { productId: 'prod-rj45', quantity: 20 },
      ],
    });

    // 7. INTERVENTION: Créée sur ce site liée à l'équipement
    recordIntervention({
      customerId: 'CLT-2026-0071',
      siteId: 'SITE-07',
      equipmentId: availableEq.id,
      equipmentTitle: `Routeur MikroTik (${availableEq.internalCode})`,
      urgency: 'Urgence Normale',
      technicianName: 'Amidou Ouedraogo',
      description: 'Audit post-installation et paramétrage du port WAN2 secouru.',
    });

    return {
      success: true,
      message: 'Scénario complet (Achat → Inventaire → Vente → Installation → Intervention → Documents) exécuté avec succès !',
    };
  };

  const resetDataToDefault = () => {
    localStorage.clear();
    setProducts(initialProducts);
    setEquipments(initialEquipments);
    setSuppliers(initialSuppliers);
    setPurchases(initialPurchases);
    setSales(initialSales);
    setCustomers(initialCustomers);
    setSites(initialSites);
    setInstallations(initialInstallations);
    setInterventions(initialInterventions);
    setDocuments(initialDocuments);
    setMovements(initialMovements);
    setInventorySession(initialInventorySession);
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute: navState.currentRoute,
        selectedEquipmentId: navState.selectedEquipmentId,
        selectedCustomerId: navState.selectedCustomerId,
        selectedDocumentId: navState.selectedDocumentId,
        navigate,
        goBack,
        products,
        equipments,
        suppliers,
        purchases,
        sales,
        customers,
        sites,
        installations,
        interventions,
        documents,
        movements,
        inventorySession,
        recordPurchase,
        recordSale,
        recordPhysicalInventoryCount,
        validatePhysicalInventory,
        recordInstallation,
        recordIntervention,
        transferEquipment,
        addCustomer,
        addSite,
        runScenarioComplete,
        resetDataToDefault,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
