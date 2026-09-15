// Reemplaza esta URL con tu enlace de ejecutable de Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbwOz8Uhm6ujWyqx5x3_wCR-lWjdo_uLD7ZuVmYBuNDg_o8wlIdGxBuo701lMGDT_BY/exec";

document.addEventListener("DOMContentLoaded", () => {
    loadData();
});

function loadData() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Respuesta de red no ok");
            }
            return response.json();
        })
        .then(data => {
            const config = data.config || {};
            const servicios = data.servicios || [];

            // 1. Cargar Datos Generales
            if (config.nombre) {
                document.getElementById("shop-name").innerText = config.nombre;
                document.getElementById("footer-name").innerText = config.nombre;
            }
            if (config.eslogan) document.getElementById("shop-tagline").innerText = config.eslogan;
            if (config.ubicacion_texto) document.getElementById("shop-location").innerText = config.ubicacion_texto;
            
            if (config.telefono) document.getElementById("btn-call").href = `tel:${config.telefono}`;
            if (config.whatsapp) document.getElementById("btn-wa").href = `https://wa.me/${config.whatsapp}?text=Hola,%20quisiera%20agendar%20una%20cita`;
            if (config.ubicacion_maps) document.getElementById("btn-maps").href = config.ubicacion_maps;
            
            if (config.instagram) document.getElementById("link-ig").href = config.instagram;
            if (config.tiktok) document.getElementById("link-tt").href = config.tiktok;
            if (config.facebook) document.getElementById("link-fb").href = config.facebook;

            // 2. Cargar Lista de Servicios
            const servicesContainer = document.getElementById("services-container");
            servicesContainer.innerHTML = "";
            
            if (servicios.length === 0) {
                servicesContainer.innerHTML = "<p>No hay servicios registrados.</p>";
            } else {
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
            }

            // 3. Cargar Galería (Filtra solo las filas que tengan una URL de imagen válida)
            const galleryContainer = document.getElementById("gallery-container");
            galleryContainer.innerHTML = "";
            
            const fotos = servicios.filter(s => s.imagen && s.imagen.toString().trim().startsWith("http")).slice(0, 12);
            
            if (fotos.length === 0) {
                galleryContainer.innerHTML = "<p>No hay imágenes en la galería.</p>";
            } else {
                fotos.forEach(item => {
                    galleryContainer.innerHTML += `
                        <img src="${item.imagen}" alt="${item.nombre}">
                    `;
                });
            }
        })
        .catch(err => {
            console.error("Error cargando los datos:", err);
            document.getElementById("services-container").innerHTML = "<p style='color:#ff6b6b;'>Error al conectar con la base de datos. Verifica la URL de Apps Script.</p>";
            document.getElementById("gallery-container").innerHTML = "<p style='color:#ff6b6b;'>Error al cargar imágenes.</p>";
        });
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
