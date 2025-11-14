// ========================================
//   LOOKBOOK - FUNCIONES MEJORADAS
// ========================================

// Datos de outfits profesionales
const lookbookOutfits = [
    {
        id: 1,
        title: "Traje Ejecutivo Clásico",
        gender: "male",
        tags: ["corporativo", "formal"],
        emoji: "👔",
        description: "Traje oscuro de dos piezas, camisa blanca, corbata conservadora",
        items: ["Traje negro/azul marino", "Camisa blanca", "Corbata seda", "Zapatos cuero negros"],
        context: "Entrevistas ejecutivas, reuniones de directorio",
        tips: "Asegúrate de que el traje esté bien ajustado y planchado. Los zapatos deben estar bien lustrados."
    },
    {
        id: 2,
        title: "Business Casual Tech",
        gender: "male",
        tags: ["tech", "casual"],
        emoji: "👕",
        description: "Pantalón chino, camisa sport, zapatos mocasines",
        items: ["Pantalón chino", "Camisa sport", "Blazer opcional", "Mocasines"],
        context: "Startups tech, empresas creativas",
        tips: "Mantén los colores neutros. Un blazer añade profesionalismo sin ser demasiado formal."
    },
    {
        id: 3,
        title: "Traje Sastre Profesional",
        gender: "female",
        tags: ["corporativo", "formal"],
        emoji: "👗",
        description: "Traje sastre oscuro, blusa clara, zapatos cerrados",
        items: ["Traje sastre", "Blusa neutra", "Zapatos tacón bajo", "Accesorios mínimos"],
        context: "Banca, finanzas, corporativo tradicional",
        tips: "Elige un tacón cómodo de 3-5cm. Los accesorios deben ser discretos y elegantes."
    },
    {
        id: 4,
        title: "Smart Casual Femenino",
        gender: "female",
        tags: ["casual", "tech"],
        emoji: "👚",
        description: "Pantalón de vestir, blusa profesional, blazer",
        items: ["Pantalón vestir", "Blusa", "Blazer", "Zapatos planos/tacón bajo"],
        context: "Tech, consultoría, servicios profesionales",
        tips: "Combina colores complementarios. Un blazer siempre eleva el outfit."
    },
    {
        id: 5,
        title: "Uniforme Corporativo",
        gender: "male",
        tags: ["corporativo"],
        emoji: "💼",
        description: "Camisa blanca, pantalón vestir, cinturón de cuero",
        items: ["Camisa blanca", "Pantalón gris/negro", "Cinturón cuero", "Zapatos formales"],
        context: "Oficinas corporativas, servicio al cliente",
        tips: "La camisa debe estar impecable. Plancha bien especialmente cuello y puños."
    },
    {
        id: 6,
        title: "Look Creativo Profesional",
        gender: "female",
        tags: ["creativo"],
        emoji: "🎨",
        description: "Combinación profesional con toques de personalidad",
        items: ["Vestido sencillo", "Cardigan", "Zapatos cómodos", "Accesorios statement"],
        context: "Industrias creativas, marketing, diseño",
        tips: "Puedes añadir más color, pero mantén la profesionalidad. Un accesorio llamativo es suficiente."
    },
    {
        id: 7,
        title: "Salud y Hospitalidad",
        gender: "male",
        tags: ["salud"],
        emoji: "🏥",
        description: "Ropa cómoda, limpia y profesional para entornos de salud",
        items: ["Camisa polo", "Pantalón cómodo", "Zapatos cerrados antideslizantes"],
        context: "Hospitales, clínicas, servicios de salud",
        tips: "La comodidad es clave. Asegúrate de que la ropa esté impecable y sin manchas."
    },
    {
        id: 8,
        title: "Look Profesional Salud",
        gender: "female",
        tags: ["salud"],
        emoji: "⚕️",
        description: "Vestimenta práctica y profesional para entornos médicos",
        items: ["Blusa cómoda", "Pantalón/falda práctica", "Zapatos cerrados cómodos"],
        context: "Clínicas, consultorios, servicios médicos",
        tips: "Evita joyas colgantes. Todo debe permitir libertad de movimiento."
    }
];

let myCloset = [];

// Inicializar lookbook
function initLookbook() {
    loadMyCloset();
    renderLookbook('all', 'all');
}

// Renderizar lookbook
function renderLookbook(gender, tag) {
    const grid = document.getElementById('lookbookGrid');
    if (!grid) return;

    let filtered = lookbookOutfits;

    if (gender !== 'all') {
        filtered = filtered.filter(outfit => outfit.gender === gender);
    }

    if (tag !== 'all') {
        filtered = filtered.filter(outfit => outfit.tags.includes(tag));
    }

    grid.innerHTML = filtered.map(outfit => {
        return `
        <div class="lookbook-card" onclick="showOutfitDetails(${outfit.id})">
            <div class="outfit-preview">
                <div class="outfit-emoji">${outfit.emoji}</div>
                <button class="favorite-btn ${isInCloset(outfit.id) ? 'active' : ''}"
                        onclick="event.stopPropagation(); toggleClosetItem(${outfit.id})">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
            </div>
            <div class="outfit-info">
                <h3 class="outfit-title">${outfit.title}</h3>
                <p class="outfit-context">${outfit.context}</p>
            </div>
        </div>
    `;
    }).join('');
}

// Filtrar por género
function filterByGender(gender) {
    const currentTag = document.querySelector('.tag-btn-simple.active').dataset.tag || 'all';

    document.querySelectorAll('.filter-btn-simple').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    renderLookbook(gender, currentTag);
}

// Filtrar por tag
function filterByTag(tag) {
    const currentGender = document.querySelector('.filter-btn-simple.active').dataset.filter || 'all';

    document.querySelectorAll('.tag-btn-simple').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    renderLookbook(currentGender, tag);
}

// Mostrar detalles de outfit
function showOutfitDetails(id) {
    const outfit = lookbookOutfits.find(o => o.id === id);
    if (!outfit) return;

    const modal = document.getElementById('outfitModal');
    const modalBody = document.getElementById('modalBody');

    const itemsList = outfit.items.map(item => '<li>' + item + '</li>').join('');

    modalBody.innerHTML = `
        <div class="modal-outfit-preview">
            <div class="outfit-emoji-large">${outfit.emoji}</div>
        </div>
        <div class="modal-outfit-details">
            <h2>${outfit.title}</h2>
            <p class="outfit-description">${outfit.description}</p>

            <div class="outfit-section">
                <h4>📋 Prendas necesarias:</h4>
                <ul class="outfit-items-list">
                    ${itemsList}
                </ul>
            </div>

            <div class="outfit-section">
                <h4>💼 Contexto de uso:</h4>
                <p>${outfit.context}</p>
            </div>

            <div class="outfit-section">
                <h4>💡 Consejos:</h4>
                <p>${outfit.tips}</p>
            </div>

            <button class="btn-primary" onclick="toggleClosetItem(${outfit.id}); closeOutfitModal();">
                ${isInCloset(outfit.id) ? '❤️ En Mi Closet' : '🤍 Guardar en Mi Closet'}
            </button>
        </div>
    `;

    modal.style.display = 'flex';
}

// Cerrar modal de outfit
function closeOutfitModal() {
    document.getElementById('outfitModal').style.display = 'none';
}

// Verificar si outfit está en closet
function isInCloset(id) {
    return myCloset.includes(id);
}

// Agregar/quitar de closet
function toggleClosetItem(id) {
    if (isInCloset(id)) {
        myCloset = myCloset.filter(i => i !== id);
    } else {
        myCloset.push(id);
    }

    localStorage.setItem('myCloset', JSON.stringify(myCloset));
    updateClosetCount();
    renderLookbook(
        document.querySelector('.filter-btn-simple.active').dataset.filter || 'all',
        document.querySelector('.tag-btn-simple.active').dataset.tag || 'all'
    );

    if (document.getElementById('myClosetPanel').style.display === 'block') {
        renderMyCloset();
    }
}

// Cargar closet desde localStorage
function loadMyCloset() {
    const saved = localStorage.getItem('myCloset');
    if (saved) {
        myCloset = JSON.parse(saved);
    }
    updateClosetCount();
}

// Actualizar contador de closet
function updateClosetCount() {
    const countEl = document.getElementById('closetCount');
    if (countEl) {
        countEl.textContent = myCloset.length;
    }
}

// Mostrar/ocultar panel de closet
function toggleMyCloset() {
    const panel = document.getElementById('myClosetPanel');
    if (panel.style.display === 'block') {
        panel.style.display = 'none';
    } else {
        panel.style.display = 'block';
        renderMyCloset();
    }
}

// Renderizar mi closet
function renderMyCloset() {
    const container = document.getElementById('closetItems');
    if (!container) return;

    if (myCloset.length === 0) {
        container.innerHTML = '<p class="closet-empty">Aún no has guardado ningún outfit. Haz clic en el corazón de tus favoritos.</p>';
        return;
    }

    const myOutfits = lookbookOutfits.filter(o => myCloset.includes(o.id));

    container.innerHTML = myOutfits.map(outfit => {
        return `
        <div class="closet-item">
            <span class="closet-item-emoji">${outfit.emoji}</span>
            <div class="closet-item-info">
                <strong>${outfit.title}</strong>
                <small>${outfit.context}</small>
            </div>
            <button class="closet-remove" onclick="toggleClosetItem(${outfit.id})">×</button>
        </div>
    `;
    }).join('');
}

// Exportar closet a PDF
function exportMyCloset() {
    if (myCloset.length === 0) {
        showToast('⚠️ Agrega outfits a tu closet primero', 'error');
        return;
    }

    const myOutfits = lookbookOutfits.filter(o => myCloset.includes(o.id));

    let content = '=== MI GUÍA DE VESTIMENTA PROFESIONAL ===\n\n';
    myOutfits.forEach((outfit, i) => {
        content += (i + 1) + '. ' + outfit.title + '\n';
        content += '   Contexto: ' + outfit.context + '\n';
        content += '   Prendas:\n';
        outfit.items.forEach(item => {
            content += '   - ' + item + '\n';
        });
        content += '   Consejo: ' + outfit.tips + '\n\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mi-guia-vestimenta.txt';
    a.click();

    showToast('✅ Guía descargada exitosamente', 'success');
}

// Inicializar cuando la pantalla de dress-code esté activa
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        if (document.getElementById('lookbookSection')) {
            initLookbook();
        }
    });
}
