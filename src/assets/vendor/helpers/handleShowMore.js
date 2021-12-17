function handleShowMore(amount, elements, showMoreId, hiddenClass) {
    if (document.querySelectorAll(elements).length === 0) {
        document.getElementById(showMoreId).style.display = 'none';
    }

    document.getElementById(showMoreId).addEventListener('click', () => {
        [...document.querySelectorAll(elements)].slice(0, amount).forEach((el) => {
            el.classList.remove(hiddenClass);

            if (document.querySelectorAll(elements).length === 0) {
                document.getElementById(showMoreId).style.display = 'none';
            }
        });
    });
}
