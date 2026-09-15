// PEGA AQUÍ LA URL DE TU APPS SCRIPT
const API_URL = "https://script.google.com/macros/s/AKfycbwNEYHKcnXgwNc14MX0_bvGezFTJmVojrQGyCFHXS8O72cjW5jq5JDFxp-zqWjeddl5/exec";

document.addEventListener("DOMContentLoaded", () => {
    loadData();
});

function loadData() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const config = data.config;
            const servicios = data.servicios;

            // Cargar Datos Generales
            document.getElementById("shop-name").innerText = config.nombre || "Mi Barbería";
            document.getElementById("footer-name").innerText = config.nombre || "Mi Barbería";
            document.getElementById("shop-tagline").innerText = config.eslogan || "";
            document.getElementById("shop-location").innerText = config.ubicacion_texto || "";
            
            document.getElementById("btn-call").href = `tel:${config.telefono}`;
            document.getElementById("btn-wa").href = `https://wa.me/${config.whatsapp}?text=Hola,%20quisiera%20agendar%20una%20cita`;
            document.getElementById("btn-maps").href = config.ubicacion_maps;
            
            document.getElementById("link-ig").href = config.instagram;
            document.getElementById("link-tt").href = config.tiktok;
            document.getElementById("link-fb").href = config.facebook;

            // Cargar Lista de Servicios
            const servicesContainer = document.getElementById("services-container");
            servicesContainer.innerHTML = "";
            servicios.forEach(item => {
                servicesContainer.innerHTML += `
                    <div class="service-item">
                        <div class="service-info">
                            <h3>${item.nombre}</h3>
                            <p>${item.descripcion}</p>
                        </div>
                        <span class="price">${item.precio}</span>
                    </div>
                `;
            });

            // Cargar Galería (Máximo 12 fotos)
            const galleryContainer = document.getElementById("gallery-container");
            galleryContainer.innerHTML = "";
            const fotos = servicios.filter(s => s.imagen && s.imagen.trim() !== "").slice(0, 12);
            
            fotos.forEach(item => {
                galleryContainer.innerHTML += `
                    <img src="${item.imagen}" alt="${item.nombre}">
                `;
            });
        })
        .catch(err => console.error("Error cargando los datos:", err));
}

// Cambio de pestañas
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName + '-tab').classList.add('active');
    event.currentTarget.classList.add('active');
}

// Compartir enlace
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: document.getElementById("shop-name").innerText,
            text: '¡Conoce nuestra barbería y agenda tu cita!',
            url: window.location.href
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert("¡Enlace copiado al portapapeles!");
    }
}

// Mostrar/Ocultar Código QR
function toggleQR() {
    const qrModal = document.getElementById('qr-modal');
    const qrImage = document.getElementById('qr-image');
    const currentURL = encodeURIComponent(window.location.href);
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${currentURL}`;
    qrModal.classList.toggle('hidden');
}
