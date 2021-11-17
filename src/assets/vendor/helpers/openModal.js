function openModal(modalId) {
    const modal = document.querySelector(modalId);
    const overlay = document.querySelector('.modal__overlay');

    modal.style.display = 'flex';
    overlay.style.display = 'flex';
}
