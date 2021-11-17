function openModal(modalId) {
    document.documentElement.requestFullscreen();
    const modal = document.querySelector(modalId);
    const overlay = document.querySelector('.modal__overlay');

    modal.style.display = 'flex';
    overlay.style.display = 'flex';
}
