// Medicines Page Specific JavaScript

// Enhanced medicine data with quality and production information
const extendedMedicines = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        brand: "Panadol",
        category: "pain-relief",
        description: "Premium pain relief and fever reducer from GSK",
        image: "💊",
        activeIngredient: "Paracetamol",
        dosage: "500mg",
        form: "Tablet",
        prescription: false,
        type: "otc",
        quality: {
            rating: 4.8,
            certification: "WHO-GMP",
            grade: "Premium"
        },
        production: {
            country: "United Kingdom",
            manufacturer: "GlaxoSmithKline",
            facility: "GSK Manufacturing Facility, London",
            batchNumber: "UK2024-PAR-001",
            expiryDate: "2026-12-15",
            imported: true
        },
        sideEffects: ["Nausea", "Stomach upset (rare)"],
        contraindications: ["Liver disease", "Alcohol dependency"],
        pharmacies: [
            { id: 1, name: "City Pharmacy", price: 45.50, distance: 0.5, availability: "In Stock", stock: 150, location: { lat: 9.0054, lng: 38.7636 } },
            { id: 2, name: "Health Plus", price: 43.00, distance: 1.2, availability: "In Stock", stock: 89, location: { lat: 9.0154, lng: 38.7736 } },
            { id: 3, name: "MedCare", price: 47.00, distance: 2.1, availability: "Limited Stock", stock: 12, location: { lat: 9.0254, lng: 38.7836 } }
        ]
    },
    {
        id: 2,
        name: "Amoxicillin 250mg",
        brand: "Amoxil",
        category: "antibiotic",
        description: "High-quality broad-spectrum antibiotic from Pfizer",
        image: "💊",
        activeIngredient: "Amoxicillin",
        dosage: "250mg",
        form: "Capsule",
        prescription: true,
        type: "prescription",
        quality: {
            rating: 4.9,
            certification: "FDA-Approved",
            grade: "Premium"
        },
        production: {
            country: "United States",
            manufacturer: "Pfizer Inc.",
            facility: "Pfizer Manufacturing, New York",
            batchNumber: "US2024-AMX-045",
            expiryDate: "2027-03-20",
            imported: true
        },
        sideEffects: ["Diarrhea", "Nausea", "Skin rash"],
        contraindications: ["Penicillin allergy", "Mononucleosis"],
        pharmacies: [
            { id: 1, name: "City Pharmacy", price: 85.00, distance: 0.5, availability: "In Stock", stock: 75, location: { lat: 9.0054, lng: 38.7636 } },
            { id: 2, name: "Health Plus", price: 82.50, distance: 1.2, availability: "Out of Stock", stock: 0, location: { lat: 9.0154, lng: 38.7736 } },
            { id: 4, name: "Wellness Pharmacy", price: 88.00, distance: 0.8, availability: "In Stock", stock: 45, location: { lat: 9.0104, lng: 38.7686 } }
        ]
    },
    {
        id: 3,
        name: "Ibuprofen 400mg",
        brand: "Advil",
        category: "anti-inflammatory",
        description: "German-manufactured premium anti-inflammatory",
        image: "💊",
        activeIngredient: "Ibuprofen",
        dosage: "400mg",
        form: "Tablet",
        prescription: false,
        type: "otc",
        quality: {
            rating: 4.7,
            certification: "EU-GMP",
            grade: "Premium"
        },
        production: {
            country: "Germany",
            manufacturer: "Bayer AG",
            facility: "Bayer Pharma, Berlin",
            batchNumber: "DE2024-IBU-078",
            expiryDate: "2026-08-10",
            imported: true
        },
        sideEffects: ["Stomach upset", "Dizziness", "Headache"],
        contraindications: ["Stomach ulcers", "Heart disease", "Kidney problems"],
        pharmacies: [
            { id: 2, name: "Health Plus", price: 52.00, distance: 1.2, availability: "In Stock", stock: 120, location: { lat: 9.0154, lng: 38.7736 } },
            { id: 3, name: "MedCare", price: 55.50, distance: 2.1, availability: "In Stock", stock: 67, location: { lat: 9.0254, lng: 38.7836 } },
            { id: 4, name: "Wellness Pharmacy", price: 50.00, distance: 0.8, availability: "In Stock", stock: 89, location: { lat: 9.0104, lng: 38.7686 } }
        ]
    },
    {
        id: 4,
        name: "Paracetamol 500mg",
        brand: "Addis Pharmaceutical",
        category: "pain-relief",
        description: "Locally manufactured quality pain reliever",
        image: "💊",
        activeIngredient: "Paracetamol",
        dosage: "500mg",
        form: "Tablet",
        prescription: false,
        type: "local",
        quality: {
            rating: 4.3,
            certification: "EFDA-Approved",
            grade: "Standard"
        },
        production: {
            country: "Ethiopia",
            manufacturer: "Addis Pharmaceutical Factory",
            facility: "APF Manufacturing, Addis Ababa",
            batchNumber: "ET2024-PAR-156",
            expiryDate: "2025-11-30",
            imported: false
        },
        sideEffects: ["Nausea", "Stomach upset (rare)"],
        contraindications: ["Liver disease", "Alcohol dependency"],
        pharmacies: [
            { id: 1, name: "City Pharmacy", price: 18.00, distance: 0.5, availability: "In Stock", stock: 200, location: { lat: 9.0054, lng: 38.7636 } },
            { id: 3, name: "MedCare", price: 16.50, distance: 2.1, availability: "In Stock", stock: 156, location: { lat: 9.0254, lng: 38.7836 } },
            { id: 4, name: "Wellness Pharmacy", price: 17.00, distance: 0.8, availability: "Limited Stock", stock: 25, location: { lat: 9.0104, lng: 38.7686 } }
        ]
    },
    {
        id: 5,
        name: "Vitamin D3 1000IU",
        brand: "Swiss Pharma",
        category: "vitamins",
        description: "Premium Swiss-made vitamin supplement",
        image: "💊",
        activeIngredient: "Cholecalciferol",
        dosage: "1000IU",
        form: "Softgel",
        prescription: false,
        type: "imported",
        quality: {
            rating: 4.9,
            certification: "Swiss-Medic",
            grade: "Premium"
        },
        production: {
            country: "Switzerland",
            manufacturer: "Roche Pharmaceuticals",
            facility: "Roche Basel Manufacturing",
            batchNumber: "CH2024-VD3-089",
            expiryDate: "2027-06-15",
            imported: true
        },
        sideEffects: ["Rare: Nausea", "Constipation (high doses)"],
        contraindications: ["Hypercalcemia", "Kidney stones"],
        pharmacies: [
            { id: 1, name: "City Pharmacy", price: 68.00, distance: 0.5, availability: "In Stock", stock: 95, location: { lat: 9.0054, lng: 38.7636 } },
            { id: 2, name: "Health Plus", price: 66.50, distance: 1.2, availability: "In Stock", stock: 134, location: { lat: 9.0154, lng: 38.7736 } },
            { id: 4, name: "Wellness Pharmacy", price: 69.00, distance: 0.8, availability: "In Stock", stock: 78, location: { lat: 9.0104, lng: 38.7686 } }
        ]
    },
    {
        id: 6,
        name: "Metformin 500mg",
        brand: "Cipla India",
        category: "diabetes",
        description: "Indian-manufactured diabetes medication",
        image: "💊",
        activeIngredient: "Metformin HCl",
        dosage: "500mg",
        form: "Tablet",
        prescription: true,
        type: "prescription",
        quality: {
            rating: 4.5,
            certification: "WHO-GMP",
            grade: "Standard"
        },
        production: {
            country: "India",
            manufacturer: "Cipla Limited",
            facility: "Cipla Manufacturing, Mumbai",
            batchNumber: "IN2024-MET-234",
            expiryDate: "2026-09-25",
            imported: true
        },
        sideEffects: ["Nausea", "Diarrhea", "Metallic taste"],
        contraindications: ["Kidney disease", "Liver disease", "Heart failure"],
        pharmacies: [
            { id: 1, name: "City Pharmacy", price: 28.00, distance: 0.5, availability: "In Stock", stock: 200, location: { lat: 9.0054, lng: 38.7636 } },
            { id: 3, name: "MedCare", price: 26.50, distance: 2.1, availability: "In Stock", stock: 156, location: { lat: 9.0254, lng: 38.7836 } },
            { id: 4, name: "Wellness Pharmacy", price: 27.00, distance: 0.8, availability: "Limited Stock", stock: 18, location: { lat: 9.0104, lng: 38.7686 } }
        ]
    },
    {
        id: 7,
        name: "Aspirin 100mg",
        brand: "Bayer Aspirin",
        category: "heart",
        description: "German premium low-dose aspirin for heart health",
        image: "💊",
        activeIngredient: "Acetylsalicylic Acid",
        dosage: "100mg",
        form: "Tablet",
        prescription: false,
        type: "otc",
        quality: {
            rating: 4.8,
            certification: "EU-GMP",
            grade: "Premium"
        },
        production: {
            country: "Germany",
            manufacturer: "Bayer AG",
            facility: "Bayer Pharma, Leverkusen",
            batchNumber: "DE2024-ASP-123",
            expiryDate: "2027-01-10",
            imported: true
        },
        sideEffects: ["Stomach irritation", "Bleeding risk"],
        contraindications: ["Bleeding disorders", "Stomach ulcers", "Children under 16"],
        pharmacies: [
            { id: 2, name: "Health Plus", price: 42.00, distance: 1.2, availability: "In Stock", stock: 67, location: { lat: 9.0154, lng: 38.7736 } },
            { id: 3, name: "MedCare", price: 45.50, distance: 2.1, availability: "Limited Stock", stock: 15, location: { lat: 9.0254, lng: 38.7836 } },
            { id: 4, name: "Wellness Pharmacy", price: 40.00, distance: 0.8, availability: "In Stock", stock: 89, location: { lat: 9.0104, lng: 38.7686 } }
        ]
    },
    {
        id: 8,
        name: "Amoxicillin 500mg",
        brand: "Julphar Ethiopia",
        category: "antibiotic",
        description: "Locally manufactured broad-spectrum antibiotic",
        image: "💊",
        activeIngredient: "Amoxicillin",
        dosage: "500mg",
        form: "Capsule",
        prescription: true,
        type: "local",
        quality: {
            rating: 4.2,
            certification: "EFDA-Approved",
            grade: "Standard"
        },
        production: {
            country: "Ethiopia",
            manufacturer: "Julphar Ethiopia",
            facility: "Julphar Manufacturing, Addis Ababa",
            batchNumber: "ET2024-AMX-067",
            expiryDate: "2025-12-20",
            imported: false
        },
        sideEffects: ["Diarrhea", "Nausea", "Skin rash"],
        contraindications: ["Penicillin allergy", "Mononucleosis"],
        pharmacies: [
            { id: 1, name: "City Pharmacy", price: 35.00, distance: 0.5, availability: "In Stock", stock: 120, location: { lat: 9.0054, lng: 38.7636 } },
            { id: 2, name: "Health Plus", price: 32.50, distance: 1.2, availability: "In Stock", stock: 89, location: { lat: 9.0154, lng: 38.7736 } },
            { id: 3, name: "MedCare", price: 36.00, distance: 2.1, availability: "In Stock", stock: 67, location: { lat: 9.0254, lng: 38.7836 } }
        ]
    },
    {
        id: 9,
        name: "Omeprazole 20mg",
        brand: "Losec",
        category: "digestive",
        description: "Swedish premium proton pump inhibitor for acid reflux",
        image: "💊",
        activeIngredient: "Omeprazole",
        dosage: "20mg",
        form: "Capsule",
        prescription: true,
        type: "prescription",
        quality: {
            rating: 4.9,
            certification: "EU-GMP",
            grade: "Premium"
        },
        production: {
            country: "Sweden",
            manufacturer: "AstraZeneca",
            facility: "AstraZeneca Södertälje",
            batchNumber: "SE2024-OME-091",
            expiryDate: "2027-04-15",
            imported: true
        },
        sideEffects: ["Headache", "Nausea", "Diarrhea"],
        contraindications: ["Liver disease", "Osteoporosis risk"],
        pharmacies: [
            { id: 1, name: "City Pharmacy", price: 95.00, distance: 0.5, availability: "In Stock", stock: 85, location: { lat: 9.0054, lng: 38.7636 } },
            { id: 2, name: "Health Plus", price: 92.50, distance: 1.2, availability: "In Stock", stock: 67, location: { lat: 9.0154, lng: 38.7736 } },
            { id: 3, name: "MedCare", price: 98.00, distance: 2.1, availability: "Limited Stock", stock: 12, location: { lat: 9.0254, lng: 38.7836 } }
        ]
    },
    {
        id: 10,
        name: "Cetirizine 10mg",
        brand: "Zyrtec",
        category: "allergy",
        description: "Belgian-made antihistamine for allergies",
        image: "💊",
        activeIngredient: "Cetirizine HCl",
        dosage: "10mg",
        form: "Tablet",
        prescription: false,
        type: "otc",
        quality: {
            rating: 4.6,
            certification: "EU-GMP",
            grade: "Premium"
        },
        production: {
            country: "Belgium",
            manufacturer: "UCB Pharma",
            facility: "UCB Manufacturing, Brussels",
            batchNumber: "BE2024-CET-156",
            expiryDate: "2026-11-20",
            imported: true
        },
        sideEffects: ["Drowsiness", "Dry mouth", "Fatigue"],
        contraindications: ["Kidney disease", "Pregnancy (consult doctor)"],
        pharmacies: [
            { id: 1, name: "City Pharmacy", price: 38.00, distance: 0.5, availability: "In Stock", stock: 120, location: { lat: 9.0054, lng: 38.7636 } },
            { id: 2, name: "Health Plus", price: 35.50, distance: 1.2, availability: "In Stock", stock: 89, location: { lat: 9.0154, lng: 38.7736 } },
            { id: 4, name: "Wellness Pharmacy", price: 36.00, distance: 0.8, availability: "In Stock", stock: 95, location: { lat: 9.0104, lng: 38.7686 } }
        ]
    },
    {
        id: 11,
        name: "Atorvastatin 20mg",
        brand: "Lipitor",
        category: "heart",
        description: "American cholesterol-lowering medication",
        image: "💊",
        activeIngredient: "Atorvastatin Calcium",
        dosage: "20mg",
        form: "Tablet",
        prescription: true,
        type: "prescription",
        quality: {
            rating: 4.8,
            certification: "FDA-Approved",
            grade: "Premium"
        },
        production: {
            country: "United States",
            manufacturer: "Pfizer Inc.",
            facility: "Pfizer Manufacturing, Michigan",
            batchNumber: "US2024-ATO-234",
            expiryDate: "2027-08-30",
            imported: true
        },
        sideEffects: ["Muscle pain", "Liver enzyme elevation", "Headache"],
        contraindications: ["Active liver disease", "Pregnancy", "Breastfeeding"],
        pharmacies: [
            { id: 1, name: "City Pharmacy", price: 125.00, distance: 0.5, availability: "In Stock", stock: 45, location: { lat: 9.0054, lng: 38.7636 } },
            { id: 3, name: "MedCare", price: 128.50, distance: 2.1, availability: "In Stock", stock: 32, location: { lat: 9.0254, lng: 38.7836 } },
            { id: 4, name: "Wellness Pharmacy", price: 122.00, distance: 0.8, availability: "Limited Stock", stock: 8, location: { lat: 9.0104, lng: 38.7686 } }
        ]
    },
    {
        id: 12,
        name: "Diclofenac 50mg",
        brand: "Voltaren",
        category: "anti-inflammatory",
        description: "Swiss anti-inflammatory for pain and swelling",
        image: "💊",
        activeIngredient: "Diclofenac Sodium",
        dosage: "50mg",
        form: "Tablet",
        prescription: true,
        type: "prescription",
        quality: {
            rating: 4.7,
            certification: "Swiss-Medic",
            grade: "Premium"
        },
        production: {
            country: "Switzerland",
            manufacturer: "Novartis AG",
            facility: "Novartis Basel Manufacturing",
            batchNumber: "CH2024-DIC-078",
            expiryDate: "2026-12-10",
            imported: true
        },
        sideEffects: ["Stomach upset", "Dizziness", "Skin rash"],
        contraindications: ["Heart disease", "Stomach ulcers", "Kidney problems"],
        pharmacies: [
            { id: 2, name: "Health Plus", price: 65.00, distance: 1.2, availability: "In Stock", stock: 78, location: { lat: 9.0154, lng: 38.7736 } },
            { id: 3, name: "MedCare", price: 68.50, distance: 2.1, availability: "In Stock", stock: 56, location: { lat: 9.0254, lng: 38.7836 } },
            { id: 4, name: "Wellness Pharmacy", price: 62.00, distance: 0.8, availability: "In Stock", stock: 89, location: { lat: 9.0104, lng: 38.7686 } }
        ]
    },
    {
        id: 13,
        name: "Azithromycin 500mg",
        brand: "Zithromax",
        category: "antibiotic",
        description: "Croatian-manufactured broad-spectrum antibiotic",
        image: "💊",
        activeIngredient: "Azithromycin",
        dosage: "500mg",
        form: "Tablet",
        prescription: true,
        type: "prescription",
        quality: {
            rating: 4.5,
            certification: "EU-GMP",
            grade: "Standard"
        },
        production: {
            country: "Croatia",
            manufacturer: "Pliva Pharmaceuticals",
            facility: "Pliva Manufacturing, Zagreb",
            batchNumber: "HR2024-AZI-123",
            expiryDate: "2026-06-25",
            imported: true
        },
        sideEffects: ["Nausea", "Diarrhea", "Abdominal pain"],
        contraindications: ["Liver disease", "Heart rhythm disorders"],
        pharmacies: [
            { id: 1, name: "City Pharmacy", price: 78.00, distance: 0.5, availability: "In Stock", stock: 67, location: { lat: 9.0054, lng: 38.7636 } },
            { id: 2, name: "Health Plus", price: 75.50, distance: 1.2, availability: "Limited Stock", stock: 15, location: { lat: 9.0154, lng: 38.7736 } },
            { id: 4, name: "Wellness Pharmacy", price: 76.00, distance: 0.8, availability: "In Stock", stock: 45, location: { lat: 9.0104, lng: 38.7686 } }
        ]
    },
    {
        id: 14,
        name: "Multivitamin Complex",
        brand: "Centrum",
        category: "vitamins",
        description: "Canadian comprehensive vitamin supplement",
        image: "💊",
        activeIngredient: "Multiple Vitamins & Minerals",
        dosage: "1 tablet daily",
        form: "Tablet",
        prescription: false,
        type: "otc",
        quality: {
            rating: 4.4,
            certification: "Health Canada",
            grade: "Standard"
        },
        production: {
            country: "Canada",
            manufacturer: "Haleon Canada",
            facility: "Haleon Manufacturing, Toronto",
            batchNumber: "CA2024-MUL-089",
            expiryDate: "2027-02-15",
            imported: true
        },
        sideEffects: ["Rare: Nausea", "Constipation (high doses)"],
        contraindications: ["Iron overload", "Hypervitaminosis"],
        pharmacies: [
            { id: 1, name: "City Pharmacy", price: 85.00, distance: 0.5, availability: "In Stock", stock: 134, location: { lat: 9.0054, lng: 38.7636 } },
            { id: 2, name: "Health Plus", price: 82.50, distance: 1.2, availability: "In Stock", stock: 98, location: { lat: 9.0154, lng: 38.7736 } },
            { id: 3, name: "MedCare", price: 87.00, distance: 2.1, availability: "In Stock", stock: 76, location: { lat: 9.0254, lng: 38.7836 } }
        ]
    },
    {
        id: 15,
        name: "Insulin Glargine",
        brand: "Lantus",
        category: "diabetes",
        description: "French long-acting insulin for diabetes",
        image: "💉",
        activeIngredient: "Insulin Glargine",
        dosage: "100 units/mL",
        form: "Injection",
        prescription: true,
        type: "prescription",
        quality: {
            rating: 4.9,
            certification: "EU-GMP",
            grade: "Premium"
        },
        production: {
            country: "France",
            manufacturer: "Sanofi-Aventis",
            facility: "Sanofi Manufacturing, Frankfurt",
            batchNumber: "FR2024-INS-045",
            expiryDate: "2025-10-30",
            imported: true
        },
        sideEffects: ["Injection site reactions", "Hypoglycemia", "Weight gain"],
        contraindications: ["Hypoglycemia", "Diabetic ketoacidosis"],
        pharmacies: [
            { id: 1, name: "City Pharmacy", price: 285.00, distance: 0.5, availability: "In Stock", stock: 25, location: { lat: 9.0054, lng: 38.7636 } },
            { id: 3, name: "MedCare", price: 290.00, distance: 2.1, availability: "Limited Stock", stock: 8, location: { lat: 9.0254, lng: 38.7836 } },
            { id: 4, name: "Wellness Pharmacy", price: 280.00, distance: 0.8, availability: "In Stock", stock: 18, location: { lat: 9.0104, lng: 38.7686 } }
        ]
    },
    {
        id: 16,
        name: "Cough Syrup",
        brand: "Ethiopian Pharma",
        category: "respiratory",
        description: "Locally manufactured herbal cough syrup",
        image: "🍯",
        activeIngredient: "Dextromethorphan + Honey",
        dosage: "15ml",
        form: "Syrup",
        prescription: false,
        type: "local",
        quality: {
            rating: 4.1,
            certification: "EFDA-Approved",
            grade: "Standard"
        },
        production: {
            country: "Ethiopia",
            manufacturer: "Ethiopian Pharmaceutical Manufacturing",
            facility: "EPM Factory, Addis Ababa",
            batchNumber: "ET2024-COU-167",
            expiryDate: "2025-09-15",
            imported: false
        },
        sideEffects: ["Drowsiness", "Nausea", "Dizziness"],
        contraindications: ["Children under 6", "Respiratory depression"],
        pharmacies: [
            { id: 1, name: "City Pharmacy", price: 25.00, distance: 0.5, availability: "In Stock", stock: 156, location: { lat: 9.0054, lng: 38.7636 } },
            { id: 2, name: "Health Plus", price: 22.50, distance: 1.2, availability: "In Stock", stock: 134, location: { lat: 9.0154, lng: 38.7736 } },
            { id: 4, name: "Wellness Pharmacy", price: 24.00, distance: 0.8, availability: "In Stock", stock: 189, location: { lat: 9.0104, lng: 38.7686 } }
        ]
    }
];

let filteredMedicines = [...extendedMedicines];
let currentPage = 1;
const itemsPerPage = 6;

// Initialize medicines page
document.addEventListener('DOMContentLoaded', function() {
    initializeMedicinesPage();
    setupMedicineEventListeners();
    loadMedicines();
});

function initializeMedicinesPage() {
    // Update global medicines array
    medicines = extendedMedicines;
    
    // Setup enhanced search
    setupEnhancedSearch();
    
    // Setup price range sliders
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const priceMinValue = document.getElementById('price-min-value');
    const priceMaxValue = document.getElementById('price-max-value');
    
    if (priceMin && priceMax) {
        priceMin.addEventListener('input', function() {
            priceMinValue.textContent = this.value;
            filterMedicines();
        });
        
        priceMax.addEventListener('input', function() {
            priceMaxValue.textContent = this.value;
            filterMedicines();
        });
    }
    
    // Setup prescription upload
    const uploadArea = document.getElementById('prescription-upload');
    const fileInput = document.getElementById('prescription-file');
    
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('drop', handleFileDrop);
        fileInput.addEventListener('change', handleFileSelect);
    }
}

function setupMedicineEventListeners() {
    // Filter event listeners
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const inStockFilter = document.getElementById('in-stock');
    const limitedStockFilter = document.getElementById('limited-stock');
    
    if (categoryFilter) categoryFilter.addEventListener('change', filterMedicines);
    if (sortFilter) sortFilter.addEventListener('change', filterMedicines);
    if (inStockFilter) inStockFilter.addEventListener('change', filterMedicines);
    if (limitedStockFilter) limitedStockFilter.addEventListener('change', filterMedicines);
    
    // View toggle
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            toggleView(this.dataset.view);
        });
    });
}

function loadMedicines() {
    const medicineGrid = document.getElementById('medicine-grid');
    const resultsCount = document.getElementById('results-count');
    
    if (!medicineGrid) return;
    
    // Show loading state
    medicineGrid.innerHTML = Array(6).fill(0).map(() => 
        '<div class="medicine-card loading" style="height: 300px;"></div>'
    ).join('');
    
    // Simulate loading delay
    setTimeout(() => {
        displayMedicines();
        if (resultsCount) {
            resultsCount.textContent = `Showing ${filteredMedicines.length} medicines`;
        }
    }, 1000);
}

function createMedicineCard(medicine) {
    const availablePharmacies = medicine.pharmacies || [];
    const inStockPharmacies = availablePharmacies.filter(p => p.availability === 'In Stock');
    const bestPrice = inStockPharmacies.length > 0 ? 
        Math.min(...inStockPharmacies.map(p => p.price)) : 
        (availablePharmacies.length > 0 ? availablePharmacies[0].price : 0);
    
    // Generate quality stars
    const qualityStars = Array(5).fill(0).map((_, i) => 
        i < Math.floor(medicine.quality.rating) ? 
        '<i class="fas fa-star"></i>' : 
        (i < medicine.quality.rating ? '<i class="fas fa-star-half-alt"></i>' : '<i class="far fa-star"></i>')
    ).join('');
    
    // Determine badges
    const badges = [];
    if (medicine.prescription) badges.push('<span class="badge prescription">Prescription</span>');
    else badges.push('<span class="badge otc">OTC</span>');
    
    if (medicine.production.imported) badges.push('<span class="badge imported">Imported</span>');
    else badges.push('<span class="badge local">Local</span>');
    
    if (medicine.quality.grade === 'Premium') badges.push('<span class="badge premium">Premium</span>');
    
    return `
        <div class="medicine-card" data-medicine-id="${medicine.id}">
            <div class="medicine-header">
                <div class="medicine-image">
                    ${medicine.image}
                </div>
                <div class="medicine-info">
                    <h3 class="medicine-name">${medicine.name}</h3>
                    <p class="medicine-brand">${medicine.brand}</p>
                    <div class="medicine-badges">
                        ${badges.join('')}
                    </div>
                </div>
            </div>
            
            <div class="quality-rating">
                <div class="quality-stars">
                    ${qualityStars}
                </div>
                <span class="quality-text">${medicine.quality.rating}/5 (${medicine.quality.certification})</span>
            </div>
            
            <div class="production-info">
                <div class="production-header">
                    <i class="fas fa-industry"></i>
                    <span>Production Information</span>
                </div>
                <div class="production-details">
                    <div class="production-item">
                        <span class="production-label">Country:</span>
                        <span class="production-value">${medicine.production.country}</span>
                    </div>
                    <div class="production-item">
                        <span class="production-label">Manufacturer:</span>
                        <span class="production-value">${medicine.production.manufacturer}</span>
                    </div>
                    <div class="production-item">
                        <span class="production-label">Batch:</span>
                        <span class="production-value">${medicine.production.batchNumber}</span>
                    </div>
                    <div class="production-item">
                        <span class="production-label">Expires:</span>
                        <span class="production-value">${new Date(medicine.production.expiryDate).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            
            <div class="medicine-description">
                <p>${medicine.description}</p>
            </div>
            
            <div class="price-info">
                <div class="best-price">
                    <span class="price-label">Best Price:</span>
                    <span class="price-value">ETB ${bestPrice.toFixed(2)}</span>
                </div>
                <div class="availability-info">
                    <i class="fas fa-store"></i>
                    Available at ${inStockPharmacies.length} pharmacies
                </div>
            </div>
            
            <div class="medicine-actions">
                <button class="btn btn-outline" onclick="showMedicineDetails(${medicine.id})">
                    <i class="fas fa-info-circle"></i> Details
                </button>
                <button class="btn" onclick="comparePrices(${medicine.id})">
                    <i class="fas fa-chart-bar"></i> Compare
                </button>
                <button class="btn btn-success" onclick="quickOrder(${medicine.id})" ${inStockPharmacies.length === 0 ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> ${inStockPharmacies.length > 0 ? 'Order' : 'Out of Stock'}
                </button>
            </div>
        </div>
    `;
}

function displayMedicines() {
    const medicineGrid = document.getElementById('medicine-grid');
    if (!medicineGrid) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const medicinesToShow = filteredMedicines.slice(0, endIndex);
    
    medicineGrid.innerHTML = medicinesToShow.map(medicine => createMedicineCard(medicine)).join('');
    
    // Update load more button
    const loadMoreBtn = document.querySelector('.load-more');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = endIndex >= filteredMedicines.length ? 'none' : 'block';
    }
}

// Enhanced search with suggestions
function setupEnhancedSearch() {
    const searchInput = document.getElementById('medicine-search');
    const suggestionsContainer = document.getElementById('search-suggestions');
    const filterChips = document.querySelectorAll('.filter-chip');
    
    if (!searchInput || !suggestionsContainer) return;
    
    let searchTimeout;
    
    // Search input with suggestions
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim();
        
        if (query.length < 2) {
            suggestionsContainer.classList.remove('active');
            return;
        }
        
        searchTimeout = setTimeout(() => {
            showSearchSuggestions(query);
        }, 300);
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.classList.remove('active');
        }
    });
    
    // Filter chips
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            filterChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            applyQuickFilter(this.dataset.filter);
        });
    });
}

function showSearchSuggestions(query) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (!suggestionsContainer) return;
    
    const suggestions = extendedMedicines.filter(medicine => 
        medicine.name.toLowerCase().includes(query.toLowerCase()) ||
        medicine.brand.toLowerCase().includes(query.toLowerCase()) ||
        medicine.production.country.toLowerCase().includes(query.toLowerCase()) ||
        medicine.production.manufacturer.toLowerCase().includes(query.toLowerCase()) ||
        medicine.activeIngredient.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    if (suggestions.length === 0) {
        suggestionsContainer.classList.remove('active');
        return;
    }
    
    suggestionsContainer.innerHTML = suggestions.map(medicine => `
        <div class="suggestion-item" onclick="selectSuggestion('${medicine.name}')">
            <div class="suggestion-icon">
                ${medicine.image}
            </div>
            <div class="suggestion-content">
                <div class="suggestion-name">${medicine.name}</div>
                <div class="suggestion-details">${medicine.brand} • ${medicine.production.country}</div>
            </div>
        </div>
    `).join('');
    
    suggestionsContainer.classList.add('active');
}

function selectSuggestion(medicineName) {
    const searchInput = document.getElementById('medicine-search');
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    if (searchInput) {
        searchInput.value = medicineName;
        searchMedicine();
    }
    
    if (suggestionsContainer) {
        suggestionsContainer.classList.remove('active');
    }
}

function applyQuickFilter(filterType) {
    let filtered = [...extendedMedicines];
    
    switch (filterType) {
        case 'prescription':
            filtered = filtered.filter(m => m.prescription);
            break;
        case 'otc':
            filtered = filtered.filter(m => !m.prescription);
            break;
        case 'imported':
            filtered = filtered.filter(m => m.production.imported);
            break;
        case 'local':
            filtered = filtered.filter(m => !m.production.imported);
            break;
        case 'all':
        default:
            // Keep all medicines
            break;
    }
    
    filteredMedicines = filtered;
    currentPage = 1;
    displayMedicines();
    
    // Update results count
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = `Showing ${filteredMedicines.length} medicines`;
    }
}

function quickSearch(query) {
    const searchInput = document.getElementById('medicine-search');
    if (searchInput) {
        searchInput.value = query;
        searchMedicine();
    }
}

function filterMedicines() {
    const category = document.getElementById('category-filter')?.value || '';
    const priceMin = parseInt(document.getElementById('price-min')?.value || 0);
    const priceMax = parseInt(document.getElementById('price-max')?.value || 500);
    const inStock = document.getElementById('in-stock')?.checked;
    const limitedStock = document.getElementById('limited-stock')?.checked;
    const sortBy = document.getElementById('sort-filter')?.value || 'relevance';
    
    // Filter medicines
    filteredMedicines = extendedMedicines.filter(medicine => {
        // Category filter
        if (category && medicine.category !== category) return false;
        
        // Price filter
        const minPrice = Math.min(...medicine.pharmacies.map(p => p.price));
        if (minPrice < priceMin || minPrice > priceMax) return false;
        
        // Availability filter
        const hasInStock = medicine.pharmacies.some(p => p.availability === 'In Stock');
        const hasLimitedStock = medicine.pharmacies.some(p => p.availability === 'Limited Stock');
        
        if (inStock && !limitedStock && !hasInStock) return false;
        if (limitedStock && !inStock && !hasLimitedStock) return false;
        if (!inStock && !limitedStock) return false;
        
        return true;
    });
    
    // Sort medicines
    sortMedicines(sortBy);
    
    // Reset pagination
    currentPage = 1;
    
    // Display filtered results
    displayMedicines();
    
    // Update results count
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = `Showing ${filteredMedicines.length} medicines`;
    }
}

function sortMedicines(sortBy) {
    switch (sortBy) {
        case 'price-low':
            filteredMedicines.sort((a, b) => {
                const aMin = Math.min(...a.pharmacies.map(p => p.price));
                const bMin = Math.min(...b.pharmacies.map(p => p.price));
                return aMin - bMin;
            });
            break;
        case 'price-high':
            filteredMedicines.sort((a, b) => {
                const aMin = Math.min(...a.pharmacies.map(p => p.price));
                const bMin = Math.min(...b.pharmacies.map(p => p.price));
                return bMin - aMin;
            });
            break;
        case 'name':
            filteredMedicines.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'popularity':
            filteredMedicines.sort((a, b) => {
                const aStock = a.pharmacies.reduce((sum, p) => sum + (p.stock || 0), 0);
                const bStock = b.pharmacies.reduce((sum, p) => sum + (p.stock || 0), 0);
                return bStock - aStock;
            });
            break;
        default:
            // Keep original order for relevance
            break;
    }
}

function clearFilters() {
    // Reset all filter inputs
    const categoryFilter = document.getElementById('category-filter');
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const sortFilter = document.getElementById('sort-filter');
    const inStock = document.getElementById('in-stock');
    const limitedStock = document.getElementById('limited-stock');
    
    if (categoryFilter) categoryFilter.value = '';
    if (priceMin) {
        priceMin.value = 0;
        document.getElementById('price-min-value').textContent = '0';
    }
    if (priceMax) {
        priceMax.value = 500;
        document.getElementById('price-max-value').textContent = '500';
    }
    if (sortFilter) sortFilter.value = 'relevance';
    if (inStock) inStock.checked = true;
    if (limitedStock) limitedStock.checked = false;
    
    // Reset filtered medicines
    filteredMedicines = [...extendedMedicines];
    currentPage = 1;
    
    // Redisplay
    displayMedicines();
    
    // Update results count
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = `Showing ${filteredMedicines.length} medicines`;
    }
}

function toggleView(viewType) {
    const medicineGrid = document.getElementById('medicine-grid');
    if (!medicineGrid) return;
    
    if (viewType === 'list') {
        medicineGrid.classList.add('list-view');
    } else {
        medicineGrid.classList.remove('list-view');
    }
}

function loadMoreMedicines() {
    currentPage++;
    displayMedicines();
}

function showMedicineDetails(medicineId) {
    const medicine = extendedMedicines.find(m => m.id === medicineId);
    if (!medicine) return;
    
    const modal = document.getElementById('medicine-modal');
    const title = document.getElementById('medicine-modal-title');
    const details = document.getElementById('medicine-details');
    
    title.textContent = medicine.name;
    
    details.innerHTML = `
        <div class="medicine-detail-grid">
            <div class="medicine-image">
                <img src="${medicine.image}" alt="${medicine.name}">
            </div>
            <div class="medicine-info">
                <h3>${medicine.name}</h3>
                <div class="info-item">
                    <span class="info-label">Brand:</span>
                    <span class="info-value">${medicine.brand}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Active Ingredient:</span>
                    <span class="info-value">${medicine.activeIngredient}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Dosage:</span>
                    <span class="info-value">${medicine.dosage}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Form:</span>
                    <span class="info-value">${medicine.form}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Prescription Required:</span>
                    <span class="info-value">${medicine.prescription ? 'Yes' : 'No'}</span>
                </div>
            </div>
        </div>
        
        <div class="medicine-description">
            <h4>Description</h4>
            <p>${medicine.description}</p>
        </div>
        
        <div class="medicine-warnings">
            <h4>Side Effects</h4>
            <ul>
                ${medicine.sideEffects.map(effect => `<li>${effect}</li>`).join('')}
            </ul>
            
            <h4>Contraindications</h4>
            <ul>
                ${medicine.contraindications.map(contra => `<li>${contra}</li>`).join('')}
            </ul>
        </div>
        
        <div class="medicine-availability">
            <h4>Availability & Pricing</h4>
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Pharmacy</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Distance</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${medicine.pharmacies.map(pharmacy => `
                        <tr>
                            <td>${pharmacy.name}</td>
                            <td class="price-cell">ETB ${pharmacy.price.toFixed(2)}</td>
                            <td>
                                <span class="status-badge ${pharmacy.availability === 'In Stock' ? 'in-stock' : pharmacy.availability === 'Limited Stock' ? 'limited' : 'out-of-stock'}">
                                    ${pharmacy.stock || 0} units
                                </span>
                            </td>
                            <td>${pharmacy.distance} km</td>
                            <td>
                                ${pharmacy.availability !== 'Out of Stock' ? 
                                    `<button class="btn btn-success" onclick="orderFromPharmacy(${medicine.id}, ${pharmacy.id})">Order</button>` : 
                                    '<span style="color: var(--text-secondary);">Unavailable</span>'
                                }
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Prescription upload handlers
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
}

function handleFileDrop(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handlePrescriptionFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handlePrescriptionFile(file);
    }
}

function handlePrescriptionFile(file) {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
        showAlert('Please upload a valid image (JPG, PNG) or PDF file.', 'error');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showAlert('File size must be less than 5MB.', 'error');
        return;
    }
    
    showLoading();
    
    // Simulate AI processing
    setTimeout(() => {
        hideLoading();
        
        // Simulate AI extraction results
        const extractedMedicines = ['Paracetamol 500mg', 'Ibuprofen 400mg'];
        
        showAlert(`Prescription processed successfully! Found: ${extractedMedicines.join(', ')}`, 'success');
        
        // Auto-search for extracted medicines
        setTimeout(() => {
            document.getElementById('medicine-search').value = extractedMedicines[0];
            searchMedicine();
        }, 2000);
        
    }, 3000);
}

// Enhanced comparison function with location, price, and quality
function comparePrices(medicineId) {
    const medicine = extendedMedicines.find(m => m.id === medicineId);
    if (!medicine) return;
    
    const modal = document.getElementById('comparison-modal');
    const content = document.getElementById('comparison-content');
    
    // Calculate scores for each pharmacy
    const pharmaciesWithScores = medicine.pharmacies.map(pharmacy => {
        // Price score (lower price = higher score, max 40 points)
        const minPrice = Math.min(...medicine.pharmacies.map(p => p.price));
        const maxPrice = Math.max(...medicine.pharmacies.map(p => p.price));
        const priceScore = maxPrice === minPrice ? 40 : 
            40 - ((pharmacy.price - minPrice) / (maxPrice - minPrice)) * 40;
        
        // Distance score (closer = higher score, max 30 points)
        const maxDistance = Math.max(...medicine.pharmacies.map(p => p.distance));
        const distanceScore = maxDistance === 0 ? 30 : 
            30 - (pharmacy.distance / maxDistance) * 30;
        
        // Quality score (based on medicine quality rating, max 20 points)
        const qualityScore = (medicine.quality.rating / 5) * 20;
        
        // Availability score (max 10 points)
        let availabilityScore = 0;
        if (pharmacy.availability === 'In Stock') availabilityScore = 10;
        else if (pharmacy.availability === 'Limited Stock') availabilityScore = 5;
        
        const totalScore = priceScore + distanceScore + qualityScore + availabilityScore;
        
        return {
            ...pharmacy,
            scores: {
                price: Math.round(priceScore),
                distance: Math.round(distanceScore),
                quality: Math.round(qualityScore),
                availability: availabilityScore,
                total: Math.round(totalScore)
            }
        };
    });
    
    // Sort by total score (highest first)
    pharmaciesWithScores.sort((a, b) => b.scores.total - a.scores.total);
    
    content.innerHTML = `
        <div class="comparison-header">
            <div class="medicine-info">
                <h3>${medicine.name}</h3>
                <p>${medicine.brand} • ${medicine.production.country}</p>
                <div class="quality-info">
                    <div class="quality-stars">
                        ${Array(5).fill(0).map((_, i) => 
                            i < Math.floor(medicine.quality.rating) ? 
                            '<i class="fas fa-star"></i>' : 
                            (i < medicine.quality.rating ? '<i class="fas fa-star-half-alt"></i>' : '<i class="far fa-star"></i>')
                        ).join('')}
                    </div>
                    <span>${medicine.quality.rating}/5 • ${medicine.quality.certification}</span>
                </div>
            </div>
        </div>
        
        <div class="comparison-explanation">
            <h4>Smart Comparison Algorithm</h4>
            <p>Our algorithm considers multiple factors to find the best pharmacy for you:</p>
            <div class="scoring-factors">
                <div class="factor">
                    <i class="fas fa-dollar-sign"></i>
                    <span>Price (40%)</span>
                </div>
                <div class="factor">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Distance (30%)</span>
                </div>
                <div class="factor">
                    <i class="fas fa-star"></i>
                    <span>Quality (20%)</span>
                </div>
                <div class="factor">
                    <i class="fas fa-check-circle"></i>
                    <span>Availability (10%)</span>
                </div>
            </div>
        </div>
        
        <div class="comparison-table-container">
            <table class="enhanced-comparison-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Pharmacy</th>
                        <th>Price</th>
                        <th>Distance</th>
                        <th>Availability</th>
                        <th>Score Breakdown</th>
                        <th>Total Score</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${pharmaciesWithScores.map((pharmacy, index) => `
                        <tr class="${index === 0 ? 'best-option' : ''}">
                            <td>
                                <div class="rank-badge ${index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-other'}">
                                    ${index + 1}
                                    ${index === 0 ? '<i class="fas fa-crown"></i>' : ''}
                                </div>
                            </td>
                            <td>
                                <div class="pharmacy-info">
                                    <strong>${pharmacy.name}</strong>
                                    <div class="pharmacy-details">
                                        <i class="fas fa-map-marker-alt"></i>
                                        ${pharmacy.distance} km away
                                    </div>
                                </div>
                            </td>
                            <td class="price-cell">
                                <span class="price">ETB ${pharmacy.price.toFixed(2)}</span>
                                ${pharmacy.price === Math.min(...medicine.pharmacies.map(p => p.price)) ? 
                                    '<span class="best-price-badge">Best Price</span>' : ''}
                            </td>
                            <td>
                                <div class="distance-info">
                                    <span>${pharmacy.distance} km</span>
                                    ${pharmacy.distance === Math.min(...medicine.pharmacies.map(p => p.distance)) ? 
                                        '<span class="closest-badge">Closest</span>' : ''}
                                </div>
                            </td>
                            <td>
                                <span class="status-badge ${pharmacy.availability === 'In Stock' ? 'in-stock' : 
                                    pharmacy.availability === 'Limited Stock' ? 'limited' : 'out-of-stock'}">
                                    ${pharmacy.availability}
                                    <small>(${pharmacy.stock} units)</small>
                                </span>
                            </td>
                            <td>
                                <div class="score-breakdown">
                                    <div class="score-item">
                                        <span class="score-label">Price:</span>
                                        <span class="score-value">${pharmacy.scores.price}/40</span>
                                    </div>
                                    <div class="score-item">
                                        <span class="score-label">Distance:</span>
                                        <span class="score-value">${pharmacy.scores.distance}/30</span>
                                    </div>
                                    <div class="score-item">
                                        <span class="score-label">Quality:</span>
                                        <span class="score-value">${pharmacy.scores.quality}/20</span>
                                    </div>
                                    <div class="score-item">
                                        <span class="score-label">Stock:</span>
                                        <span class="score-value">${pharmacy.scores.availability}/10</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="total-score">
                                    <span class="score-number">${pharmacy.scores.total}</span>
                                    <span class="score-max">/100</span>
                                    <div class="score-bar">
                                        <div class="score-fill" style="width: ${pharmacy.scores.total}%"></div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                ${pharmacy.availability !== 'Out of Stock' ? 
                                    `<button class="btn ${index === 0 ? 'btn-success' : 'btn-outline'}" 
                                        onclick="orderFromPharmacy(${medicine.id}, ${pharmacy.id})">
                                        ${index === 0 ? '<i class="fas fa-crown"></i> Best Choice' : '<i class="fas fa-shopping-cart"></i> Order'}
                                    </button>` : 
                                    '<span class="unavailable">Unavailable</span>'
                                }
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="comparison-summary">
            <div class="best-recommendation">
                <h4><i class="fas fa-trophy"></i> Our Recommendation</h4>
                <p><strong>${pharmaciesWithScores[0].name}</strong> offers the best overall value with a score of 
                   <strong>${pharmaciesWithScores[0].scores.total}/100</strong>. 
                   ${pharmaciesWithScores[0].scores.total >= 80 ? 'Excellent choice!' : 
                     pharmaciesWithScores[0].scores.total >= 60 ? 'Good option.' : 'Consider alternatives.'}
                </p>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Override the global search function for medicines page
function searchMedicine() {
    const query = document.getElementById('medicine-search').value.trim();
    if (!query) {
        showAlert('Please enter a medicine name to search', 'error');
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        const results = extendedMedicines.filter(medicine => 
            medicine.name.toLowerCase().includes(query.toLowerCase()) ||
            medicine.brand.toLowerCase().includes(query.toLowerCase()) ||
            medicine.category.toLowerCase().includes(query.toLowerCase()) ||
            medicine.activeIngredient.toLowerCase().includes(query.toLowerCase()) ||
            medicine.production.country.toLowerCase().includes(query.toLowerCase()) ||
            medicine.production.manufacturer.toLowerCase().includes(query.toLowerCase())
        );
        
        hideLoading();
        
        // Update filtered medicines
        filteredMedicines = results;
        currentPage = 1;
        displayMedicines();
        
        // Update results count
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            resultsCount.textContent = `Found ${results.length} medicines for "${query}"`;
        }
        
        // Scroll to results
        document.getElementById('medicine-results').scrollIntoView({ behavior: 'smooth' });
        
    }, 1000);
}

// Order functions for payment integration
function orderFromPharmacy(medicineId, pharmacyId) {
    const medicine = extendedMedicines.find(m => m.id === medicineId);
    const pharmacy = medicine?.pharmacies.find(p => p.id === pharmacyId);
    
    if (!medicine || !pharmacy) {
        showAlert('Medicine or pharmacy not found', 'error');
        return;
    }
    
    if (pharmacy.availability === 'Out of Stock') {
        showAlert('This medicine is currently out of stock at this pharmacy', 'error');
        return;
    }
    
    // Check if user is logged in
    if (!currentUser) {
        showAlert('Please login to place an order', 'error');
        setTimeout(() => {
            window.location.href = '../login.html';
        }, 2000);
        return;
    }
    
    // Create order for payment
    createOrderForPayment(medicine, pharmacy);
}

function createOrderForPayment(medicine, pharmacy, quantity = 1) {
    const orderId = `ORD-2024-${Date.now().toString(36).toUpperCase()}`;
    
    const orderData = {
        id: orderId,
        items: [{
            id: medicine.id,
            name: medicine.name,
            brand: medicine.brand,
            quantity: quantity,
            price: pharmacy.price,
            total: pharmacy.price * quantity,
            prescription: medicine.prescription
        }],
        subtotal: pharmacy.price * quantity,
        deliveryFee: 15.00,
        serviceFee: 5.00,
        discount: 0.00,
        total: (pharmacy.price * quantity) + 15.00 + 5.00,
        pharmacy: {
            id: pharmacy.id,
            name: pharmacy.name,
            phone: '+251911234567'
        },
        deliveryAddress: currentUser?.address || '123 Main Street, Addis Ababa, Ethiopia',
        estimatedDelivery: '30-45 minutes',
        createdAt: new Date().toISOString()
    };
    
    // Store order data for payment page
    localStorage.setItem('pendingOrderId', orderId);
    localStorage.setItem('pendingOrder', JSON.stringify(orderData));
    
    // Show order confirmation modal
    showOrderConfirmationModal(orderData);
}

function showOrderConfirmationModal(orderData) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'order-confirmation-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-shopping-cart"></i> Confirm Your Order</h2>
                <span class="close" onclick="closeOrderModal()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="order-summary">
                    <h3>Order Summary</h3>
                    <div class="order-item">
                        <div class="item-info">
                            <h4>${orderData.items[0].name}</h4>
                            <p>${orderData.items[0].brand} - Quantity: ${orderData.items[0].quantity}</p>
                            ${orderData.items[0].prescription ? '<span class="prescription-badge">Prescription Required</span>' : ''}
                        </div>
                        <div class="item-price">ETB ${orderData.items[0].total.toFixed(2)}</div>
                    </div>
                    
                    <div class="order-totals">
                        <div class="total-row">
                            <span>Subtotal:</span>
                            <span>ETB ${orderData.subtotal.toFixed(2)}</span>
                        </div>
                        <div class="total-row">
                            <span>Delivery Fee:</span>
                            <span>ETB ${orderData.deliveryFee.toFixed(2)}</span>
                        </div>
                        <div class="total-row">
                            <span>Service Fee:</span>
                            <span>ETB ${orderData.serviceFee.toFixed(2)}</span>
                        </div>
                        <div class="total-row grand-total">
                            <span>Total:</span>
                            <span>ETB ${orderData.total.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div class="pharmacy-info">
                        <h4>Pharmacy</h4>
                        <p><strong>${orderData.pharmacy.name}</strong></p>
                        <p>Estimated delivery: ${orderData.estimatedDelivery}</p>
                    </div>
                    
                    <div class="delivery-address">
                        <h4>Delivery Address</h4>
                        <div class="address-display">
                            <p>${orderData.deliveryAddress}</p>
                            <div class="address-actions">
                                <button class="btn-change-address" onclick="changeAddress()">
                                    <i class="fas fa-edit"></i> 
                                    <span>Change Address</span>
                                    <i class="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="closeOrderModal()">Cancel</button>
                <button class="btn btn-primary" onclick="proceedToPayment()">
                    <i class="fas fa-credit-card"></i> Pay with Stripe
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
    const modal = document.getElementById('order-confirmation-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function proceedToPayment() {
    const orderId = localStorage.getItem('pendingOrderId');
    if (orderId) {
        window.location.href = `./payment.html?order=${orderId}`;
    }
}

function changeAddress() {
    // Create a proper address change modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'address-change-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-map-marker-alt"></i> Change Delivery Address</h2>
                <p class="modal-subtitle">Update your delivery location and contact information</p>
                <span class="close" onclick="closeAddressModal()">&times;</span>
            </div>
            <div class="modal-body">
                <form id="address-change-form">
                    <div class="address-form-grid">
                        <div class="form-group full-width">
                            <input type="text" id="street-address" placeholder=" " required>
                            <label for="street-address">Street Address</label>
                            <div class="form-icon">
                                <i class="fas fa-home"></i>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <input type="text" id="city" placeholder=" " required>
                            <label for="city">City</label>
                            <div class="form-icon">
                                <i class="fas fa-city"></i>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <input type="text" id="district" placeholder=" " required>
                            <label for="district">District/Zone</label>
                            <div class="form-icon">
                                <i class="fas fa-map"></i>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <input type="tel" id="phone-number" placeholder=" " required>
                            <label for="phone-number">Contact Phone</label>
                            <div class="form-icon">
                                <i class="fas fa-phone"></i>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <select id="address-type" required>
                                <option value="">Select Address Type</option>
                                <option value="home">Home</option>
                                <option value="work">Work</option>
                                <option value="other">Other</option>
                            </select>
                            <label for="address-type">Address Type</label>
                            <div class="form-icon">
                                <i class="fas fa-tag"></i>
                            </div>
                        </div>
                        
                        <div class="form-group full-width">
                            <textarea id="delivery-instructions" placeholder=" " rows="3"></textarea>
                            <label for="delivery-instructions">Delivery Instructions (Optional)</label>
                            <div class="form-icon">
                                <i class="fas fa-sticky-note"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div class="address-suggestions">
                        <h4><i class="fas fa-lightbulb"></i> Quick Suggestions</h4>
                        <div class="suggestion-buttons">
                            <button type="button" class="suggestion-btn" onclick="fillSuggestion('home')">
                                <i class="fas fa-home"></i> Use Home Address
                            </button>
                            <button type="button" class="suggestion-btn" onclick="fillSuggestion('work')">
                                <i class="fas fa-building"></i> Use Work Address
                            </button>
                            <button type="button" class="suggestion-btn" onclick="fillSuggestion('current')">
                                <i class="fas fa-map-marker-alt"></i> Use Current Location
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline" onclick="closeAddressModal()">
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button type="button" class="btn btn-success" onclick="saveNewAddress()">
                    <i class="fas fa-check"></i> Update Address
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Pre-fill current address if available
    if (currentOrder && currentOrder.deliveryAddress) {
        const addressParts = currentOrder.deliveryAddress.split(', ');
        if (addressParts.length >= 3) {
            document.getElementById('street-address').value = addressParts[0] || '';
            document.getElementById('district').value = addressParts[1] || '';
            document.getElementById('city').value = addressParts[2] || '';
        }
    }
}

function closeAddressModal() {
    const modal = document.getElementById('address-change-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function saveNewAddress() {
    const streetAddress = document.getElementById('street-address').value.trim();
    const city = document.getElementById('city').value.trim();
    const district = document.getElementById('district').value.trim();
    const phoneNumber = document.getElementById('phone-number').value.trim();
    const addressType = document.getElementById('address-type').value;
    const instructions = document.getElementById('delivery-instructions').value.trim();
    
    // Validate required fields
    if (!streetAddress || !city || !district || !phoneNumber) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate phone number (basic validation)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
        showAlert('Please enter a valid phone number', 'error');
        return;
    }
    
    // Create full address
    const fullAddress = `${streetAddress}, ${district}, ${city}`;
    
    // Update order data
    if (currentOrder) {
        currentOrder.deliveryAddress = fullAddress;
        currentOrder.contactPhone = phoneNumber;
        currentOrder.addressType = addressType;
        currentOrder.deliveryInstructions = instructions;
        
        // Save updated order
        localStorage.setItem('pendingOrder', JSON.stringify(currentOrder));
        
        // Update display in the order confirmation modal
        const addressDisplay = document.querySelector('.delivery-address p');
        if (addressDisplay) {
            addressDisplay.textContent = fullAddress;
        }
    }
    
    closeAddressModal();
    showAlert('Delivery address updated successfully!', 'success');
}

function fillSuggestion(type) {
    // Sample addresses for demonstration
    const suggestions = {
        home: {
            street: '123 Bole Road',
            district: 'Bole',
            city: 'Addis Ababa',
            phone: '+251911234567',
            type: 'home'
        },
        work: {
            street: '456 Kazanchis Business District',
            district: 'Kazanchis',
            city: 'Addis Ababa',
            phone: '+251911234567',
            type: 'work'
        },
        current: {
            street: '789 Piazza Area',
            district: 'Arada',
            city: 'Addis Ababa',
            phone: '+251911234567',
            type: 'other'
        }
    };
    
    const suggestion = suggestions[type];
    if (suggestion) {
        document.getElementById('street-address').value = suggestion.street;
        document.getElementById('district').value = suggestion.district;
        document.getElementById('city').value = suggestion.city;
        document.getElementById('phone-number').value = suggestion.phone;
        document.getElementById('address-type').value = suggestion.type;
        
        // Trigger label animations
        document.querySelectorAll('#address-change-modal .form-group input, #address-change-modal .form-group select').forEach(input => {
            if (input.value) {
                input.classList.add('has-value');
            }
        });
    }
}

// Quick order function for search results
function quickOrder(medicineId) {
    const medicine = extendedMedicines.find(m => m.id === medicineId);
    if (!medicine) return;
    
    // Find the best price pharmacy
    const bestPharmacy = medicine.pharmacies
        .filter(p => p.availability !== 'Out of Stock')
        .sort((a, b) => a.price - b.price)[0];
    
    if (!bestPharmacy) {
        showAlert('This medicine is currently out of stock at all pharmacies', 'error');
        return;
    }
    
    orderFromPharmacy(medicineId, bestPharmacy.id);
}

// Add to cart function (for future cart feature)
function addToCart(medicineId, pharmacyId, quantity = 1) {
    const medicine = extendedMedicines.find(m => m.id === medicineId);
    const pharmacy = medicine?.pharmacies.find(p => p.id === pharmacyId);
    
    if (!medicine || !pharmacy) return;
    
    // Get existing cart or create new one
    let cart = JSON.parse(localStorage.getItem('medicineCart') || '[]');
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => 
        item.medicineId === medicineId && item.pharmacyId === pharmacyId
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.total = existingItem.price * existingItem.quantity;
    } else {
        cart.push({
            medicineId: medicineId,
            pharmacyId: pharmacyId,
            name: medicine.name,
            brand: medicine.brand,
            pharmacyName: pharmacy.name,
            price: pharmacy.price,
            quantity: quantity,
            total: pharmacy.price * quantity,
            prescription: medicine.prescription
        });
    }
    
    // Save cart
    localStorage.setItem('medicineCart', JSON.stringify(cart));
    
    // Update cart UI indicator
    updateCartIndicator();
    
    showAlert(`${medicine.name} added to cart`, 'success');
}

function updateCartIndicator() {
    const cart = JSON.parse(localStorage.getItem('medicineCart') || '[]');
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart badge if it exists
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? 'block' : 'none';
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
        modal.classList.remove('show');
    });
    document.body.style.overflow = '';
}

// Global functions
window.orderFromPharmacy = orderFromPharmacy;
window.quickOrder = quickOrder;
window.addToCart = addToCart;
window.closeOrderModal = closeOrderModal;
window.proceedToPayment = proceedToPayment;
window.changeAddress = changeAddress;

// Demo video function
function watchDemo() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'demo-video-modal';
    modal.innerHTML = `
        <div class="modal-content large">
            <div class="modal-header">
                <h2><i class="fas fa-play"></i> PharmaCare Demo</h2>
                <span class="close" onclick="closeDemoModal()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="video-container">
                    <iframe 
                        width="100%" 
                        height="400" 
                        src="https://www.youtube.com/embed/ploFnvE1770?si=YddHFKafGZY9CzRy&autoplay=1" 
                        title="PharmaCare Demo Video" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen>
                    </iframe>
                </div>
                <div class="demo-description">
                    <h3>See PharmaCare in Action</h3>
                    <p>Watch this comprehensive demo to learn how PharmaCare revolutionizes pharmacy management and medicine discovery in Ethiopia.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-search"></i>
                            <span>Smart Medicine Search</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-chart-bar"></i>
                            <span>Price Comparison</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-robot"></i>
                            <span>AI Recommendations</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-truck"></i>
                            <span>Fast Delivery</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="getStarted()">
                    <i class="fas fa-rocket"></i> Get Started Now
                </button>
                <button class="btn btn-outline" onclick="closeDemoModal()">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeDemoModal() {
    const modal = document.getElementById('demo-video-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Make functions globally available
window.watchDemo = watchDemo;
window.closeDemoModal = closeDemoModal;
window.closeModal = closeModal;
window.changeAddress = changeAddress;
window.closeAddressModal = closeAddressModal;
window.saveNewAddress = saveNewAddress;
window.fillSuggestion = fillSuggestion;