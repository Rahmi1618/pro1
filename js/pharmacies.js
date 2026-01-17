// Google Maps Integration for Kombolcha Pharmacies
// Using the specific location: https://maps.app.goo.gl/Y2H2tajgEwqVL65t5

// Kombolcha coordinates from the provided Google Maps link
const KOMBOLCHA_CENTER = {
    lat: 11.0815,  // Kombolcha city center latitude
    lng: 39.7267   // Kombolcha city center longitude
};

// Extended pharmacy data with real Kombolcha locations
const pharmaciesData = [
    {
        id: 1,
        name: "Kombolcha Central Pharmacy",
        address: "Main Street, Near Kombolcha Hospital, Kombolcha",
        phone: "+251911234567",
        email: "info@kombolichacentral.com",
        website: "www.kombolichacentral.com",
        distance: 0.3,
        rating: 4.8,
        reviewCount: 245,
        coordinates: { lat: 11.0815, lng: 39.7267 }, // Kombolcha center
        hours: {
            monday: "7:00 AM - 10:00 PM",
            tuesday: "7:00 AM - 10:00 PM",
            wednesday: "7:00 AM - 10:00 PM",
            thursday: "7:00 AM - 10:00 PM",
            friday: "7:00 AM - 10:00 PM",
            saturday: "8:00 AM - 9:00 PM",
            sunday: "9:00 AM - 8:00 PM"
        },
        services: ["Home Delivery", "24/7 Emergency", "Prescription Service", "Pharmacist Consultation"],
        specialties: ["General Medicine", "Diabetes Care", "Heart Medication"],
        description: "The largest and most trusted pharmacy in Kombolcha, serving the community for over 15 years.",
        averagePrice: "Medium",
        deliveryTime: "20-30 minutes",
        isOpen: true,
        is24Hours: true
    },
    {
        id: 2,
        name: "Dessie Road Pharmacy",
        address: "Dessie Road, Near Bus Station, Kombolcha",
        phone: "+251911234568",
        email: "contact@dessieroadpharmacy.com",
        website: "www.dessieroadpharmacy.com",
        distance: 0.8,
        rating: 4.6,
        reviewCount: 189,
        coordinates: { lat: 11.0845, lng: 39.7298 }, // Near Dessie road
        hours: {
            monday: "6:30 AM - 11:00 PM",
            tuesday: "6:30 AM - 11:00 PM",
            wednesday: "6:30 AM - 11:00 PM",
            thursday: "6:30 AM - 11:00 PM",
            friday: "6:30 AM - 11:00 PM",
            saturday: "7:00 AM - 10:00 PM",
            sunday: "8:00 AM - 9:00 PM"
        },
        services: ["Home Delivery", "Prescription Service", "Pharmacist Consultation", "Health Screening"],
        specialties: ["Pediatric Medicine", "Women's Health", "Vitamins & Supplements"],
        description: "Conveniently located near the bus station, serving travelers and local community.",
        averagePrice: "Low",
        deliveryTime: "25-35 minutes",
        isOpen: true,
        is24Hours: false
    },
    {
        id: 3,
        name: "Wollo University Pharmacy",
        address: "Wollo University Campus, Kombolcha Institute of Technology",
        phone: "+251911234569",
        email: "pharmacy@wku.edu.et",
        website: "www.wku.edu.et/pharmacy",
        distance: 1.2,
        rating: 4.7,
        reviewCount: 156,
        coordinates: { lat: 11.0789, lng: 39.7234 }, // University campus
        hours: {
            monday: "8:00 AM - 6:00 PM",
            tuesday: "8:00 AM - 6:00 PM",
            wednesday: "8:00 AM - 6:00 PM",
            thursday: "8:00 AM - 6:00 PM",
            friday: "8:00 AM - 6:00 PM",
            saturday: "9:00 AM - 4:00 PM",
            sunday: "Closed"
        },
        services: ["Prescription Service", "Student Health", "Faculty Consultation"],
        specialties: ["Student Health", "Academic Research", "Preventive Care"],
        description: "University-affiliated pharmacy serving students, faculty, and the academic community.",
        averagePrice: "Low",
        deliveryTime: "30-40 minutes",
        isOpen: true,
        is24Hours: false
    },
    {
        id: 4,
        name: "Bati Road Health Pharmacy",
        address: "Bati Road, Near Kombolcha Health Center",
        phone: "+251911234570",
        email: "info@batiroadhealth.com",
        website: "www.batiroadhealth.com",
        distance: 1.5,
        rating: 4.4,
        reviewCount: 203,
        coordinates: { lat: 11.0798, lng: 39.7301 }, // Bati road area
        hours: {
            monday: "7:00 AM - 9:00 PM",
            tuesday: "7:00 AM - 9:00 PM",
            wednesday: "7:00 AM - 9:00 PM",
            thursday: "7:00 AM - 9:00 PM",
            friday: "7:00 AM - 9:00 PM",
            saturday: "8:00 AM - 8:00 PM",
            sunday: "9:00 AM - 7:00 PM"
        },
        services: ["Home Delivery", "Prescription Service", "Health Screening", "Blood Pressure Check"],
        specialties: ["Chronic Disease Management", "Elderly Care", "Health Monitoring"],
        description: "Specialized in chronic disease management and elderly care services.",
        averagePrice: "Medium",
        deliveryTime: "35-45 minutes",
        isOpen: true,
        is24Hours: false
    },
    {
        id: 5,
        name: "Kombolcha Express Pharmacy",
        address: "Commercial District, Near Market Area, Kombolcha",
        phone: "+251911234571",
        email: "express@kombolichaexpress.com",
        website: "www.kombolichaexpress.com",
        distance: 0.6,
        rating: 4.5,
        reviewCount: 178,
        coordinates: { lat: 11.0832, lng: 39.7289 }, // Market area
        hours: {
            monday: "6:00 AM - 11:00 PM",
            tuesday: "6:00 AM - 11:00 PM",
            wednesday: "6:00 AM - 11:00 PM",
            thursday: "6:00 AM - 11:00 PM",
            friday: "6:00 AM - 11:00 PM",
            saturday: "6:00 AM - 11:00 PM",
            sunday: "7:00 AM - 10:00 PM"
        },
        services: ["Express Delivery", "24/7 Emergency", "Prescription Service", "Online Ordering"],
        specialties: ["Emergency Medicine", "Fast Service", "Online Platform"],
        description: "Fast and reliable pharmacy service with express delivery and online ordering.",
        averagePrice: "Medium",
        deliveryTime: "15-25 minutes",
        isOpen: true,
        is24Hours: true
    },
    {
        id: 6,
        name: "Family Care Pharmacy",
        address: "Residential Area, Near Primary School, Kombolcha",
        phone: "+251911234572",
        email: "care@familycarepharmacy.com",
        website: "www.familycarepharmacy.com",
        distance: 1.8,
        rating: 4.3,
        reviewCount: 134,
        coordinates: { lat: 11.0801, lng: 39.7245 }, // Residential area
        hours: {
            monday: "8:00 AM - 8:00 PM",
            tuesday: "8:00 AM - 8:00 PM",
            wednesday: "8:00 AM - 8:00 PM",
            thursday: "8:00 AM - 8:00 PM",
            friday: "8:00 AM - 8:00 PM",
            saturday: "9:00 AM - 7:00 PM",
            sunday: "10:00 AM - 6:00 PM"
        },
        services: ["Family Health", "Child Care", "Vaccination", "Health Education"],
        specialties: ["Pediatric Care", "Family Medicine", "Preventive Health"],
        description: "Family-focused pharmacy providing comprehensive health services for all ages.",
        averagePrice: "Low",
        deliveryTime: "40-50 minutes",
        isOpen: true,
        is24Hours: false
    }
];

let filteredPharmacies = [...pharmaciesData];
let selectedRating = 0;
let currentPharmacyId = null;
let map = null;
let markers = [];
let infoWindow = null;

// Mobile navigation toggle function
function toggleMobileNav() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (navMenu && navToggle) {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (navMenu && navToggle) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Add click listeners to navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Close mobile menu when clicking on navigation links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        const navbar = document.querySelector('.navbar');
        
        if (navMenu && navToggle && navbar) {
            if (!navbar.contains(event.target) && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
    
    initializePharmaciesPage();
    setupPharmacyEventListeners();
    loadPharmacies();
});

// Google Maps initialization callback
function initGoogleMap() {
    try {
        const mapElement = document.getElementById('google-map');
        const loadingElement = document.getElementById('map-loading');
        
        if (!mapElement) {
            console.error('Google Map element not found');
            return;
        }

        // Initialize map centered on Kombolcha
        map = new google.maps.Map(mapElement, {
            zoom: 14,
            center: KOMBOLCHA_CENTER,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'on' }]
                }
            ]
        });

        // Initialize info window
        infoWindow = new google.maps.InfoWindow();

        // Add pharmacy markers
        addPharmacyMarkers();
        
        // Add key landmarks
        addLandmarkMarkers();

        // Hide loading state
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }

        console.log('Google Maps initialized successfully for Kombolcha');
        
    } catch (error) {
        console.error('Error initializing Google Maps:', error);
        showMapError();
    }
}

// Add pharmacy markers to the map
function addPharmacyMarkers() {
    pharmaciesData.forEach(pharmacy => {
        const marker = new google.maps.Marker({
            position: pharmacy.coordinates,
            map: map,
            title: pharmacy.name,
            icon: {
                url: 'data:image/svg+xml;base64,' + btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                        <circle cx="12" cy="12" r="10" fill="#2563eb" stroke="#ffffff" stroke-width="2"/>
                        <path d="M12 6v6l4 2" stroke="#ffffff" stroke-width="2" fill="none"/>
                        <text x="12" y="16" text-anchor="middle" fill="#ffffff" font-size="8" font-weight="bold">Rx</text>
                    </svg>
                `),
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 16)
            },
            animation: google.maps.Animation.DROP
        });
        
        // Add click listener for info window
        marker.addListener('click', () => {
            const content = createInfoWindowContent(pharmacy);
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
        });
        
        markers.push(marker);
    });
}

// Add landmark markers
function addLandmarkMarkers() {
    const landmarks = [
        {
            name: "Kombolcha Hospital",
            position: { lat: 11.0820, lng: 39.7270 },
            type: "hospital",
            icon: "🏥"
        },
        {
            name: "Wollo University - Kombolcha Institute of Technology",
            position: { lat: 11.0789, lng: 39.7234 },
            type: "university",
            icon: "🎓"
        },
        {
            name: "Kombolcha Bus Station",
            position: { lat: 11.0845, lng: 39.7298 },
            type: "transport",
            icon: "🚌"
        }
    ];
    
    landmarks.forEach(landmark => {
        const marker = new google.maps.Marker({
            position: landmark.position,
            map: map,
            title: landmark.name,
            icon: {
                url: 'data:image/svg+xml;base64,' + btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
                        <circle cx="12" cy="12" r="10" fill="${landmark.type === 'hospital' ? '#ef4444' : landmark.type === 'university' ? '#8b5cf6' : '#f59e0b'}" stroke="#ffffff" stroke-width="2"/>
                        <text x="12" y="16" text-anchor="middle" font-size="12">${landmark.icon}</text>
                    </svg>
                `),
                scaledSize: new google.maps.Size(28, 28),
                anchor: new google.maps.Point(14, 14)
            }
        });
        
        marker.addListener('click', () => {
            infoWindow.setContent(`
                <div style="padding: 10px; max-width: 200px;">
                    <h4 style="margin: 0 0 5px 0; color: #1f2937;">${landmark.name}</h4>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Landmark in Kombolcha</p>
                </div>
            `);
            infoWindow.open(map, marker);
        });
    });
}

// Create info window content for pharmacies
function createInfoWindowContent(pharmacy) {
    const servicesHtml = pharmacy.services.slice(0, 3).map(service => 
        `<span style="background: rgba(37, 99, 235, 0.1); color: #2563eb; padding: 2px 6px; border-radius: 8px; font-size: 11px; margin-right: 4px;">${service}</span>`
    ).join('');
    
    return `
        <div style="padding: 15px; max-width: 300px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">${pharmacy.name}</h3>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="color: #fbbf24; margin-right: 5px;">★★★★★</span>
                <span style="color: #6b7280; font-size: 13px;">${pharmacy.rating} (${pharmacy.reviewCount} reviews)</span>
            </div>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px; display: flex; align-items: center;">
                <span style="margin-right: 5px;">📍</span>${pharmacy.address}
            </p>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px; display: flex; align-items: center;">
                <span style="margin-right: 5px;">📞</span>${pharmacy.phone}
            </p>
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px; display: flex; align-items: center;">
                <span style="margin-right: 5px;">🚚</span>Delivery: ${pharmacy.deliveryTime}
            </p>
            <div style="margin-bottom: 10px;">
                ${servicesHtml}
            </div>
            <div style="display: flex; gap: 8px;">
                <button onclick="showPharmacyDetails(${pharmacy.id})" style="background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">View Details</button>
                <button onclick="getDirections(${pharmacy.coordinates.lat}, ${pharmacy.coordinates.lng})" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">Directions</button>
            </div>
        </div>
    `;
}

// Map control functions
function toggleMapView() {
    if (map) {
        const currentType = map.getMapTypeId();
        const newType = currentType === google.maps.MapTypeId.ROADMAP ? 
                       google.maps.MapTypeId.SATELLITE : 
                       google.maps.MapTypeId.ROADMAP;
        map.setMapTypeId(newType);
    }
}

function centerMap() {
    if (map) {
        map.setCenter(KOMBOLCHA_CENTER);
        map.setZoom(14);
    }
}

function toggleFullscreen() {
    const mapContainer = document.querySelector('.google-map-container');
    if (mapContainer) {
        if (!document.fullscreenElement) {
            mapContainer.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

function showAllPharmacies() {
    if (map && markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        markers.forEach(marker => {
            bounds.extend(marker.getPosition());
        });
        map.fitBounds(bounds);
        
        // Ensure minimum zoom level
        google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
            if (map.getZoom() > 16) {
                map.setZoom(16);
            }
        });
    }
}

function getDirections(lat, lng) {
    const destination = `${lat},${lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, '_blank');
}

// Error handling for map loading
function handleMapError() {
    console.error('Failed to load Google Maps');
    const mapLoading = document.getElementById('map-loading');
    if (mapLoading) {
        mapLoading.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
                <h3 style="color: #1f2937; margin-bottom: 0.5rem;">Map Loading Error</h3>
                <p style="color: #6b7280; margin-bottom: 1rem;">Unable to load the interactive map.</p>
                <button onclick="location.reload()" style="background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">
                    Retry
                </button>
            </div>
        `;
    }
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set a timeout to show error if map doesn't load
    setTimeout(() => {
        const mapLoading = document.getElementById('map-loading');
        if (mapLoading && !mapLoading.classList.contains('hidden')) {
            handleMapError();
        }
    }, 10000); // 10 second timeout
});


function addPharmacyMarkers() {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    filteredPharmacies.forEach(pharmacy => {
        const marker = new google.maps.Marker({
            position: pharmacy.coordinates,
            map: map,
            title: pharmacy.name,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 0C6.716 0 0 6.716 0 15c0 8.284 15 25 15 25s15-16.716 15-25C30 6.716 23.284 0 15 0z" fill="#2563eb"/>
                        <circle cx="15" cy="15" r="8" fill="white"/>
                        <text x="15" y="20" text-anchor="middle" fill="#2563eb" font-size="16" font-weight="bold">+</text>
                    </svg>
                `),
                scaledSize: new google.maps.Size(30, 40),
                anchor: new google.maps.Point(15, 40)
            }
        });

        // Add click listener for pharmacy info
        marker.addListener('click', () => {
            showPharmacyInfoWindow(pharmacy, marker);
            highlightPharmacyCard(pharmacy.id);
        });

        markers.push(marker);
    });
}

function addLandmarkMarkers() {
    // Kombolcha General Hospital
    const hospitalMarker = new google.maps.Marker({
        position: { lat: 11.0821, lng: 39.7278 },
        map: map,
        title: 'Kombolcha General Hospital',
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="25" height="35" viewBox="0 0 25 35" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 6.904 12.5 22.5 12.5 22.5s12.5-15.596 12.5-22.5C25 5.596 19.404 0 12.5 0z" fill="#ef4444"/>
                    <rect x="8" y="8" width="9" height="9" fill="white" rx="1"/>
                    <text x="12.5" y="15" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="bold">H</text>
                </svg>
            `),
            scaledSize: new google.maps.Size(25, 35),
            anchor: new google.maps.Point(12.5, 35)
        }
    });

    // Wollo University
    const universityMarker = new google.maps.Marker({
        position: { lat: 11.0789, lng: 39.7234 },
        map: map,
        title: 'Wollo University',
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="25" height="35" viewBox="0 0 25 35" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 6.904 12.5 22.5 12.5 22.5s12.5-15.596 12.5-22.5C25 5.596 19.404 0 12.5 0z" fill="#8b5cf6"/>
                    <rect x="8" y="8" width="9" height="9" fill="white" rx="1"/>
                    <text x="12.5" y="15" text-anchor="middle" fill="#8b5cf6" font-size="12" font-weight="bold">U</text>
                </svg>
            `),
            scaledSize: new google.maps.Size(25, 35),
            anchor: new google.maps.Point(12.5, 35)
        }
    });
}

function showPharmacyInfoWindow(pharmacy, marker) {
    const stars = '★'.repeat(Math.floor(pharmacy.rating)) + '☆'.repeat(5 - Math.floor(pharmacy.rating));
    const isOpen = pharmacy.isOpen ? '<span style="color: #10b981;">Open Now</span>' : '<span style="color: #ef4444;">Closed</span>';
    
    const content = `
        <div style="max-width: 300px; padding: 1rem;">
            <h3 style="margin: 0 0 0.5rem 0; color: #1a202c;">${pharmacy.name}</h3>
            <div style="margin-bottom: 0.5rem;">
                <span style="color: #fbbf24;">${stars}</span>
                <span style="margin-left: 0.5rem; color: #4a5568;">${pharmacy.rating} (${pharmacy.reviewCount} reviews)</span>
            </div>
            <p style="margin: 0.5rem 0; color: #4a5568; font-size: 0.9rem;">
                <i class="fas fa-map-marker-alt" style="color: #2563eb; margin-right: 0.5rem;"></i>
                ${pharmacy.address}
            </p>
            <p style="margin: 0.5rem 0; color: #4a5568; font-size: 0.9rem;">
                <i class="fas fa-phone" style="color: #2563eb; margin-right: 0.5rem;"></i>
                ${pharmacy.phone}
            </p>
            <p style="margin: 0.5rem 0; color: #4a5568; font-size: 0.9rem;">
                <i class="fas fa-clock" style="color: #2563eb; margin-right: 0.5rem;"></i>
                ${isOpen} • ${pharmacy.distance} km away
            </p>
            <div style="margin: 1rem 0;">
                ${pharmacy.services.slice(0, 3).map(service => 
                    `<span style="background: rgba(37, 99, 235, 0.1); color: #2563eb; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.75rem; margin-right: 0.25rem;">${service}</span>`
                ).join('')}
            </div>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <button onclick="showPharmacyDetails(${pharmacy.id})" style="background: #2563eb; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">
                    <i class="fas fa-info-circle"></i> Details
                </button>
                <button onclick="getDirections(${pharmacy.coordinates.lat}, ${pharmacy.coordinates.lng})" style="background: #10b981; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">
                    <i class="fas fa-directions"></i> Directions
                </button>
            </div>
        </div>
    `;
    
    infoWindow.setContent(content);
    infoWindow.open(map, marker);
}

function highlightPharmacyCard(pharmacyId) {
    // Remove previous highlights
    document.querySelectorAll('.pharmacy-card').forEach(card => {
        card.classList.remove('highlighted');
    });
    
    // Highlight the selected pharmacy card
    const pharmacyCard = document.querySelector(`[data-pharmacy-id="${pharmacyId}"]`);
    if (pharmacyCard) {
        pharmacyCard.classList.add('highlighted');
        pharmacyCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function showMapError() {
    const mapElement = document.getElementById('google-map');
    const loadingElement = document.getElementById('map-loading');
    
    if (loadingElement) {
        loadingElement.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f59e0b; margin-bottom: 1rem;"></i>
                <h3 style="color: #1a202c; margin-bottom: 0.5rem;">Map Loading Error</h3>
                <p style="color: #4a5568; margin-bottom: 1rem;">Unable to load Google Maps. Please check your internet connection or try again later.</p>
                <button onclick="location.reload()" style="background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer;">
                    <i class="fas fa-refresh"></i> Retry
                </button>
            </div>
        `;
    }
}

function initializePharmaciesPage() {
    // Setup distance slider
    const distanceRange = document.getElementById('distance-range');
    const distanceValue = document.getElementById('distance-value');
    
    if (distanceRange && distanceValue) {
        distanceRange.addEventListener('input', function() {
            distanceValue.textContent = this.value;
            filterPharmacies();
        });
    }
    
    // Setup rating filter
    const ratingOptions = document.querySelectorAll('.rating-option');
    ratingOptions.forEach(option => {
        option.addEventListener('click', function() {
            ratingOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedRating = parseInt(this.dataset.rating);
            filterPharmacies();
        });
    });
    
    // Setup star rating in review modal
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
}

function setupPharmacyEventListeners() {
    // Filter event listeners
    const serviceCheckboxes = document.querySelectorAll('#delivery-service, #emergency-service, #prescription-service, #consultation-service');
    const sortSelect = document.getElementById('pharmacy-sort');
    
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterPharmacies);
    });
    
    if (sortSelect) sortSelect.addEventListener('change', filterPharmacies);
    
    // View toggle
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            togglePharmacyView(this.dataset.view);
        });
    });
    
    // Form submissions
    const contactForm = document.getElementById('contact-form');
    const reviewForm = document.getElementById('review-form');
    
    if (contactForm) contactForm.addEventListener('submit', handleContactSubmission);
    if (reviewForm) reviewForm.addEventListener('submit', handleReviewSubmission);
}

function loadPharmacies() {
    const pharmacyGrid = document.getElementById('pharmacy-grid');
    if (!pharmacyGrid) return;
    
    // Show loading state
    pharmacyGrid.innerHTML = Array(4).fill(0).map(() => 
        '<div class="pharmacy-card loading" style="height: 350px;"></div>'
    ).join('');
    
    // Simulate loading delay
    setTimeout(() => {
        pharmacyGrid.innerHTML = filteredPharmacies.map(pharmacy => createPharmacyCard(pharmacy)).join('');
    }, 1000);
}

function createPharmacyCard(pharmacy) {
    const stars = '★'.repeat(Math.floor(pharmacy.rating)) + '☆'.repeat(5 - Math.floor(pharmacy.rating));
    
    return `
        <div class="pharmacy-card" data-pharmacy-id="${pharmacy.id}">
            <div class="pharmacy-header">
                <div class="pharmacy-info">
                    <h3>${pharmacy.name}</h3>
                    <div class="pharmacy-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-count">${pharmacy.rating} (${pharmacy.reviewCount} reviews)</span>
                    </div>
                </div>
                <div class="pharmacy-distance">${pharmacy.distance} km</div>
            </div>
            
            <div class="pharmacy-details">
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${pharmacy.address}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-phone"></i>
                    <span>${pharmacy.phone}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>${pharmacy.is24Hours ? '24/7 Open' : getTodayHours(pharmacy.hours)}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-truck"></i>
                    <span>Delivery: ${pharmacy.deliveryTime}</span>
                </div>
            </div>
            
            <div class="pharmacy-services">
                ${pharmacy.services.map(service => 
                    `<span class="service-badge">${service}</span>`
                ).join('')}
            </div>
            
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.95rem;">
                ${pharmacy.description}
            </p>
            
            <div class="pharmacy-actions">
                <button class="btn" onclick="showPharmacyDetails(${pharmacy.id})">
                    <i class="fas fa-info-circle"></i> Details
                </button>
                <button class="btn btn-success" onclick="getDirections(${pharmacy.coordinates.lat}, ${pharmacy.coordinates.lng})">
                    <i class="fas fa-directions"></i> Directions
                </button>
                <button class="btn btn-outline" onclick="showContactModal(${pharmacy.id})">
                    <i class="fas fa-comments"></i> Contact
                </button>
            </div>
        </div>
    `;
}

function getTodayHours(hours) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    return hours[today] || 'Closed';
}

function filterPharmacies() {
    const maxDistance = parseFloat(document.getElementById('distance-range')?.value || 10);
    const deliveryService = document.getElementById('delivery-service')?.checked;
    const emergencyService = document.getElementById('emergency-service')?.checked;
    const prescriptionService = document.getElementById('prescription-service')?.checked;
    const consultationService = document.getElementById('consultation-service')?.checked;
    const sortBy = document.getElementById('pharmacy-sort')?.value || 'distance';
    
    // Filter pharmacies
    filteredPharmacies = pharmaciesData.filter(pharmacy => {
        // Distance filter
        if (pharmacy.distance > maxDistance) return false;
        
        // Rating filter
        if (selectedRating > 0 && pharmacy.rating < selectedRating) return false;
        
        // Service filters
        if (deliveryService && !pharmacy.services.includes('Home Delivery')) return false;
        if (emergencyService && !pharmacy.services.includes('24/7 Emergency')) return false;
        if (prescriptionService && !pharmacy.services.includes('Prescription Service')) return false;
        if (consultationService && !pharmacy.services.includes('Pharmacist Consultation')) return false;
        
        return true;
    });
    
    // Sort pharmacies
    sortPharmacies(sortBy);
    
    // Display filtered results
    loadPharmacies();
    
    // Update map markers
    if (map) {
        addPharmacyMarkers();
    }
}

function sortPharmacies(sortBy) {
    switch (sortBy) {
        case 'distance':
            filteredPharmacies.sort((a, b) => a.distance - b.distance);
            break;
        case 'rating':
            filteredPharmacies.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
            filteredPharmacies.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price':
            const priceOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
            filteredPharmacies.sort((a, b) => priceOrder[a.averagePrice] - priceOrder[b.averagePrice]);
            break;
    }
}

function clearPharmacyFilters() {
    // Reset all filters
    const distanceRange = document.getElementById('distance-range');
    const distanceValue = document.getElementById('distance-value');
    const serviceCheckboxes = document.querySelectorAll('#delivery-service, #emergency-service, #prescription-service, #consultation-service');
    const sortSelect = document.getElementById('pharmacy-sort');
    const ratingOptions = document.querySelectorAll('.rating-option');
    
    if (distanceRange) {
        distanceRange.value = 5;
        distanceValue.textContent = '5';
    }
    
    serviceCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    if (sortSelect) sortSelect.value = 'distance';
    
    ratingOptions.forEach(option => {
        option.classList.remove('selected');
    });
    
    selectedRating = 0;
    filteredPharmacies = [...pharmaciesData];
    loadPharmacies();
    
    // Update map markers
    if (map) {
        addPharmacyMarkers();
    }
}

// Map controls for Google Maps
function toggleMapView() {
    if (!map) return;
    
    const currentType = map.getMapTypeId();
    const newType = currentType === google.maps.MapTypeId.ROADMAP ? 
                   google.maps.MapTypeId.SATELLITE : 
                   google.maps.MapTypeId.ROADMAP;
    
    map.setMapTypeId(newType);
    showAlert(`Map view changed to ${newType === google.maps.MapTypeId.SATELLITE ? 'Satellite' : 'Road'} view`, 'info');
}

function centerMap() {
    if (!map) return;
    
    map.setCenter(KOMBOLCHA_CENTER);
    map.setZoom(14);
    showAlert('Map centered on Kombolcha', 'info');
}

function toggleFullscreen() {
    const mapDisplay = document.querySelector('.map-display');
    if (!mapDisplay) return;
    
    if (!document.fullscreenElement) {
        mapDisplay.requestFullscreen().then(() => {
            // Trigger map resize after entering fullscreen
            setTimeout(() => {
                if (map) {
                    google.maps.event.trigger(map, 'resize');
                }
            }, 100);
            showAlert('Map in fullscreen mode', 'info');
        }).catch(err => {
            console.error('Error entering fullscreen:', err);
            showAlert('Fullscreen not supported', 'error');
        });
    } else {
        document.exitFullscreen();
    }
}

function showAllPharmacies() {
    if (!map) return;
    
    // Reset filters to show all pharmacies
    clearPharmacyFilters();
    
    // Fit map bounds to show all pharmacy markers
    if (markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        markers.forEach(marker => {
            bounds.extend(marker.getPosition());
        });
        map.fitBounds(bounds);
        
        // Ensure minimum zoom level
        const listener = google.maps.event.addListener(map, 'idle', () => {
            if (map.getZoom() > 16) map.setZoom(16);
            google.maps.event.removeListener(listener);
        });
    }
    
    showAlert('Showing all pharmacies in Kombolcha', 'info');
}

function getCurrentLocation() {
    if (!navigator.geolocation) {
        showAlert('Geolocation is not supported by this browser.', 'error');
        return;
    }
    
    showAlert('Getting your location...', 'info');
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Check if user is near Kombolcha (within reasonable distance)
            const distance = calculateDistance(lat, lng, KOMBOLCHA_CENTER.lat, KOMBOLCHA_CENTER.lng);
            
            if (distance < 50) { // Within 50km of Kombolcha
                showAlert(`Location found! You are ${distance.toFixed(1)}km from Kombolcha center.`, 'success');
                
                // Update map center to user location if close to Kombolcha
                if (map && distance < 10) {
                    map.setCenter({ lat, lng });
                    
                    // Add user location marker
                    new google.maps.Marker({
                        position: { lat, lng },
                        map: map,
                        title: 'Your Location',
                        icon: {
                            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="15" cy="15" r="12" fill="#10b981" stroke="white" stroke-width="3"/>
                                    <circle cx="15" cy="15" r="4" fill="white"/>
                                </svg>
                            `),
                            scaledSize: new google.maps.Size(30, 30),
                            anchor: new google.maps.Point(15, 15)
                        }
                    });
                }
                updateDistances(lat, lng);
            } else {
                showAlert('You seem to be far from Kombolcha. Showing default Kombolcha pharmacies.', 'info');
            }
        },
        function(error) {
            showAlert('Unable to get your location. Showing default Kombolcha pharmacies.', 'info');
            
            // Center map on Kombolcha
            if (map) {
                map.setCenter(KOMBOLCHA_CENTER);
            }
        }
    );
}

function searchPharmacies() {
    const location = document.getElementById('location-search').value.trim();
    if (!location) {
        showAlert('Please enter a location to search.', 'error');
        return;
    }
    
    showLoading();
    
    // Simulate location-based search
    setTimeout(() => {
        hideLoading();
        
        if (location.toLowerCase().includes('kombolcha') || location.toLowerCase().includes('current')) {
            // Show Kombolcha pharmacies
            filteredPharmacies = [...pharmaciesData];
            
            // Center map on Kombolcha
            if (map) {
                map.setCenter(KOMBOLCHA_CENTER);
                addPharmacyMarkers();
            }
            
            showAlert(`Found ${filteredPharmacies.length} pharmacies in Kombolcha`, 'success');
        } else {
            // Simulate search in other areas (limited results)
            filteredPharmacies = pharmaciesData.slice(0, 2); // Show limited results
            showAlert(`Limited results for "${location}". Showing nearby options in Kombolcha area.`, 'info');
        }
        
        loadPharmacies();
        
        // Scroll to results
        document.getElementById('pharmacy-list-section').scrollIntoView({ behavior: 'smooth' });
    }, 1500);
}

function getDirections(lat, lng) {
    // Open Google Maps with directions
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
}

function calculateDistance(lat1, lng1, lat2, lng2) {
    // Simplified distance calculation (Haversine formula)
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function updateDistances(userLat, userLng) {
    // Calculate distances (simplified calculation)
    pharmaciesData.forEach(pharmacy => {
        const distance = calculateDistance(userLat, userLng, pharmacy.coordinates.lat, pharmacy.coordinates.lng);
        pharmacy.distance = Math.round(distance * 10) / 10;
    });
    
    // Re-filter and display
    filterPharmacies();
}

// Additional utility functions
function showPharmacyDetails(pharmacyId) {
    const pharmacy = pharmaciesData.find(p => p.id === pharmacyId);
    if (!pharmacy) return;
    
    // Create a simple modal or alert with pharmacy details
    const details = `
        ${pharmacy.name}
        
        Address: ${pharmacy.address}
        Phone: ${pharmacy.phone}
        Rating: ${pharmacy.rating}/5 (${pharmacy.reviewCount} reviews)
        
        Services: ${pharmacy.services.join(', ')}
        Specialties: ${pharmacy.specialties.join(', ')}
        
        ${pharmacy.description}
        
        Hours Today: ${getTodayHours(pharmacy.hours)}
        Delivery Time: ${pharmacy.deliveryTime}
    `;
    
    alert(details);
}

function showContactModal(pharmacyId) {
    const pharmacy = pharmaciesData.find(p => p.id === pharmacyId);
    if (!pharmacy) return;
    
    const contact = `
        Contact ${pharmacy.name}
        
        Phone: ${pharmacy.phone}
        Email: ${pharmacy.email}
        Website: ${pharmacy.website}
        Address: ${pharmacy.address}
    `;
    
    alert(contact);
}

function showAlert(message, type = 'info') {
    // Simple alert implementation
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // You could implement a more sophisticated notification system here
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
        color: white;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'global-loading';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    loadingDiv.innerHTML = `
        <div style="text-align: center;">
            <div class="loading" style="margin: 0 auto 1rem;"></div>
            <p>Loading...</p>
        </div>
    `;
    
    document.body.appendChild(loadingDiv);
}

function hideLoading() {
    const loadingDiv = document.getElementById('global-loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Mobile navigation toggle function
function toggleMobileNav() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (navMenu && navToggle) {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    }
}

// Make functions globally available
window.showPharmacyDetails = showPharmacyDetails;
window.showContactModal = showContactModal;
window.getDirections = getDirections;
window.toggleMobileNav = toggleMobileNav;
window.openFullMap = openFullMap;
window.toggleFullscreen = toggleFullscreen;

// Function to open full map
function openFullMap() {
    window.open('https://maps.app.goo.gl/Y2H2tajgEwqVL65t5', '_blank');
}