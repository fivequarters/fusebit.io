function handleShowMore(amount, elements, showMoreId, hiddenClass, force) {
    const renderMore = () => {
        [...document.querySelectorAll(elements)]
            .slice(0, amount)
            .forEach((el) => {
                el.classList.remove(hiddenClass);

                if (document.querySelectorAll(elements).length === 0) {
                    document.getElementById(showMoreId).style.display = 'none';
                }
            });
    };
    const button = document.getElementById(showMoreId);
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    newButton.addEventListener('click', renderMore);

    if (document.getElementsByClassName(hiddenClass).length === 0) {
        document.getElementById(showMoreId).style.display = 'none';
    }

    if (force) {
        renderMore();
    }
}
