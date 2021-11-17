function closeModal() {
    const modals = document.querySelectorAll('.modal');
    const overlay = document.querySelector('.modal__overlay');
    overlay.style.display = 'none';

    const clearModalHash = () =>
        window.history.pushState('', document.title, window.location.pathname);

    clearModalHash();

    modals.forEach((modal) => {
        modal.style.display = 'none';
    });
}
