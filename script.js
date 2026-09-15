// Cambio de pestañas (Menú / Galería)
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName + '-tab').classList.add('active');
    event.currentTarget.classList.add('active');
}

// Función para compartir el enlace de la página
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: 'Legendary Barber',
            text: '¡Conoce nuestra barbería y agenda tu cita!',
            url: window.location.href
        }).catch(console.error);
    } else {
        // Copiar al portapapeles si la API navigator.share no está disponible
        navigator.clipboard.writeText(window.location.href);
        alert("¡Enlace copiado al portapapeles!");
    }
}

// Función para mostrar / ocultar el código QR
function toggleQR() {
    const qrModal = document.getElementById('qr-modal');
    const qrImage = document.getElementById('qr-image');
    
    // Genera automáticamente un código QR con la URL actual de la página
    const currentURL = encodeURIComponent(window.location.href);
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${currentURL}`;

    qrModal.classList.toggle('hidden');
}
