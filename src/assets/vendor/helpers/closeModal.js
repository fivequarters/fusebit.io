function closeModal() {
    const modals = document.querySelectorAll('.modal');
    const overlay = document.querySelector('.modal__overlay');
    overlay.style.display = 'none';

    modals.forEach((modal) => {
        console.log('asdasd');
        modal.style.display = 'none';
    });
}
