function closeModal() {
    const modals = document.querySelectorAll('.modal');
    const overlay = document.querySelector('.modal__overlay');
    overlay.style.display = 'none';

    modals.forEach((modal) => {
        modal.style.display = 'none';
    });
}
