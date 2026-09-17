const API_URL = "https://script.google.com/macros/s/AKfycbynIAwF5nnlN8oEWTtuMMn0GU2yT6o5m_3CqYJ97iYzFtB2rcgbhIJn78nXpIaTE1MD/exec";

document.addEventListener("DOMContentLoaded", () => {
    loadData();
});

function loadData() {
    const freshURL = API_URL + (API_URL.includes("?") ? "&" : "?") + "v=" + Math.random().toString(36).substring(7);

    fetch(freshURL)
        .then(response => {
            if (!response.ok) throw new Error("Error en respuesta de red");
            return response.json();
        })
        .then(data => {
            const config = data.config || {};
            const servicios = data.servicios || [];
            const barberos = data.barberos || [];

            // 1. Horario de Atención
            document.getElementById("schedule-main").innerText = config.horario_dias || "Lun - Sáb: 10:00 AM - 8:00 PM";
            const scheduleSub = document.getElementById("schedule-sub");
            if (config.horario_extra && config.horario_extra.toString().trim() !== "") {
                scheduleSub.innerText = config.horario_extra;
                scheduleSub.style.display = "block";
            } else {
                scheduleSub.style.display = "none";
            }

            // 2. Datos Generales
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

            // 3. Menú de Servicios
            const servicesContainer = document.getElementById("services-container");
            servicesContainer.innerHTML = "";
            if (servicios.length === 0) {
                servicesContainer.innerHTML = "<p class='loading-msg'>No hay servicios registrados.</p>";
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

            // 4. Equipo / Barberos
            const barbersContainer = document.getElementById("barbers-container");
            barbersContainer.innerHTML = "";
            if (barberos.length === 0) {
                barbersContainer.innerHTML = "<p class='loading-msg'>No hay datos del equipo.</p>";
            } else {
                barberos.forEach(b => {
                    let fotoPath = "";
                    if (b.foto && b.foto.toString().trim() !== "") {
                        const fotoStr = b.foto.toString().trim();
                        fotoPath = fotoStr.startsWith("http") ? fotoStr : `./${fotoStr}`;
                    }

                    const imgHTML = fotoPath !== "" 
                        ? `<img src="${fotoPath}" alt="${b.nombre}">` 
                        : `<div class="barber-avatar-placeholder"><i class="fa-solid fa-user"></i></div>`;
                    
                    barbersContainer.innerHTML += `
                        <div class="barber-card">
                            ${imgHTML}
                            <h3>${b.nombre}</h3>
                            <p>${b.especialidad}</p>
                            ${b.instagram ? `<a href="${b.instagram}" target="_blank" class="barber-link"><i class="fa-brands fa-instagram"></i></a>` : ''}
                        </div>
                    `;
                });
            }

            // 5. Galería
            const galleryContainer = document.getElementById("gallery-container");
            galleryContainer.innerHTML = "";
            const fotos = servicios.filter(s => s.imagen && s.imagen.toString().trim() !== "").slice(0, 12);
            if (fotos.length === 0) {
                galleryContainer.innerHTML = "<p class='loading-msg'>No hay fotos en la galería.</p>";
            } else {
                fotos.forEach(item => {
                    const imgStr = item.imagen.toString().trim();
                    const imgPath = imgStr.startsWith("http") ? imgStr : `./${imgStr}`;
                    galleryContainer.innerHTML += `
                        <img src="${imgPath}" alt="${item.nombre}">
                    `;
                });
            }
        })
        .catch(err => {
            console.error("Error al cargar datos:", err);
            document.getElementById("schedule-main").innerText = "Horario disponible por WhatsApp";
        });
}

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName + '-tab').classList.add('active');
    event.currentTarget.classList.add('active');
}

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

function toggleQR() {
    const qrModal = document.getElementById('qr-modal');
    const qrImage = document.getElementById('qr-image');
    const currentURL = encodeURIComponent(window.location.href);
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${currentURL}`;
    qrModal.classList.toggle('hidden');
}
