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
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop",
        description: "Traje oscuro de dos piezas, camisa blanca, corbata conservadora",
        items: ["Traje negro/azul marino", "Camisa blanca", "Corbata seda", "Zapatos cuero negros"],
        context: "Entrevistas ejecutivas, reuniones de directorio",
        tips: "Asegúrate de que el traje esté bien ajustado y planchado. Los zapatos deben estar bien lustrados.",
        gradient: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
    },
    {
        id: 2,
        title: "Business Casual Tech",
        gender: "male",
        tags: ["tech", "casual"],
        emoji: "👕",
        image: "https://images.unsplash.com/photo-1521566652839-697aa473761a?w=400&h=300&fit=crop",
        description: "Pantalón chino, camisa sport, zapatos mocasines",
        items: ["Pantalón chino", "Camisa sport", "Blazer opcional", "Mocasines"],
        context: "Startups tech, empresas creativas",
        tips: "Mantén los colores neutros. Un blazer añade profesionalismo sin ser demasiado formal.",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
        id: 3,
        title: "Traje Sastre Profesional",
        gender: "female",
        tags: ["corporativo", "formal"],
        emoji: "👗",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
        description: "Traje sastre oscuro, blusa clara, zapatos cerrados",
        items: ["Traje sastre", "Blusa neutra", "Zapatos tacón bajo", "Accesorios mínimos"],
        context: "Banca, finanzas, corporativo tradicional",
        tips: "Elige un tacón cómodo de 3-5cm. Los accesorios deben ser discretos y elegantes.",
        gradient: "linear-gradient(135deg, #c31432 0%, #240b36 100%)"
    },
    {
        id: 4,
        title: "Smart Casual Femenino",
        gender: "female",
        tags: ["casual", "tech"],
        emoji: "👚",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop",
        description: "Pantalón de vestir, blusa profesional, blazer",
        items: ["Pantalón vestir", "Blusa", "Blazer", "Zapatos planos/tacón bajo"],
        context: "Tech, consultoría, servicios profesionales",
        tips: "Combina colores complementarios. Un blazer siempre eleva el outfit.",
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
        id: 5,
        title: "Uniforme Corporativo",
        gender: "male",
        tags: ["corporativo"],
        emoji: "💼",
        image: "https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?w=400&h=300&fit=crop",
        description: "Camisa blanca, pantalón vestir, cinturón de cuero",
        items: ["Camisa blanca", "Pantalón gris/negro", "Cinturón cuero", "Zapatos formales"],
        context: "Oficinas corporativas, servicio al cliente",
        tips: "La camisa debe estar impecable. Plancha bien especialmente cuello y puños.",
        gradient: "linear-gradient(135deg, #434343 0%, #000000 100%)"
    },
    {
        id: 6,
        title: "Look Creativo Profesional",
        gender: "female",
        tags: ["creativo"],
        emoji: "🎨",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop",
        description: "Combinación profesional con toques de personalidad",
        items: ["Vestido sencillo", "Cardigan", "Zapatos cómodos", "Accesorios statement"],
        context: "Industrias creativas, marketing, diseño",
        tips: "Puedes añadir más color, pero mantén la profesionalidad. Un accesorio llamativo es suficiente.",
        gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    },
    {
        id: 7,
        title: "Salud y Hospitalidad",
        gender: "male",
        tags: ["salud"],
        emoji: "🏥",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=300&fit=crop",
        description: "Ropa cómoda, limpia y profesional para entornos de salud",
        items: ["Camisa polo", "Pantalón cómodo", "Zapatos cerrados antideslizantes"],
        context: "Hospitales, clínicas, servicios de salud",
        tips: "La comodidad es clave. Asegúrate de que la ropa esté impecable y sin manchas.",
        gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
    },
    {
        id: 8,
        title: "Look Profesional Salud",
        gender: "female",
        tags: ["salud"],
        emoji: "⚕️",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=300&fit=crop",
        description: "Vestimenta práctica y profesional para entornos médicos",
        items: ["Blusa cómoda", "Pantalón/falda práctica", "Zapatos cerrados cómodos"],
        context: "Clínicas, consultorios, servicios médicos",
        tips: "Evita joyas colgantes. Todo debe permitir libertad de movimiento.",
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
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
            <div class="outfit-preview-image" style="background: ${outfit.gradient};">
                ${outfit.image ? `<img src="${outfit.image}" alt="${outfit.title}" class="outfit-photo" loading="lazy">` : `<div class="outfit-emoji">${outfit.emoji}</div>`}
                <div class="outfit-overlay"></div>
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
    // Soportar tanto clases nuevas como antiguas
    const tagBtnSelector = '.tag-btn-modern.active, .tag-btn-simple.active';
    const currentTagBtn = document.querySelector(tagBtnSelector);
    const currentTag = currentTagBtn ? currentTagBtn.dataset.tag : 'all';

    // Actualizar botones de género (nuevos y antiguos)
    document.querySelectorAll('.filter-btn-modern, .filter-btn-simple').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    renderLookbook(gender, currentTag);
}

// Filtrar por tag
function filterByTag(tag) {
    // Soportar tanto clases nuevas como antiguas
    const genderBtnSelector = '.filter-btn-modern.active, .filter-btn-simple.active';
    const currentGenderBtn = document.querySelector(genderBtnSelector);
    const currentGender = currentGenderBtn ? currentGenderBtn.dataset.filter : 'all';

    // Actualizar botones de tag (nuevos y antiguos)
    document.querySelectorAll('.tag-btn-modern, .tag-btn-simple').forEach(btn => {
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
        <div class="modal-outfit-preview" style="background: ${outfit.gradient};">
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

    // Soportar tanto clases nuevas como antiguas
    const genderBtnSelector = '.filter-btn-modern.active, .filter-btn-simple.active';
    const tagBtnSelector = '.tag-btn-modern.active, .tag-btn-simple.active';
    const currentGenderBtn = document.querySelector(genderBtnSelector);
    const currentTagBtn = document.querySelector(tagBtnSelector);

    renderLookbook(
        currentGenderBtn ? currentGenderBtn.dataset.filter : 'all',
        currentTagBtn ? currentTagBtn.dataset.tag : 'all'
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

// Función para revelar la sección de outfits
function revealOutfitsSection() {
    const outfitsSection = document.getElementById('outfitsSection');
    const revealContainer = document.getElementById('revealOutfitsContainer');

    if (outfitsSection && revealContainer) {
        // Ocultar el botón con animación
        revealContainer.style.opacity = '0';
        revealContainer.style.transform = 'scale(0.9)';

        setTimeout(() => {
            revealContainer.style.display = 'none';

            // Mostrar la sección de outfits con animación
            outfitsSection.style.display = 'block';
            outfitsSection.style.opacity = '0';
            outfitsSection.style.transform = 'translateY(30px)';

            setTimeout(() => {
                outfitsSection.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                outfitsSection.style.opacity = '1';
                outfitsSection.style.transform = 'translateY(0)';

                // Scroll suave a la sección
                setTimeout(() => {
                    outfitsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }, 50);
        }, 400);
    }
}

// Inicializar cuando la pantalla de dress-code esté activa
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        if (document.getElementById('lookbookSection')) {
            initLookbook();
        }
    });
}
