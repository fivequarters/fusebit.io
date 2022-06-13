function handleShowMore({
    amount, elements, showMoreId, force, defaultDisplay
}) {
    const shouldShowMore = () => {
        if (document.querySelectorAll(elements).length > 0) {
            document.getElementById(showMoreId).style.display = defaultDisplay || 'block';
        } else {
            document.getElementById(showMoreId).style.display = 'none';
        }
    };
    const renderMore = () => {
        [...document.querySelectorAll(elements)]
            .slice(0, amount)
            .forEach((el) => {
                el.classList.remove(
                    'show-more-item--hidden',
                    'show-more-item--hidden-out',
                );
                setTimeout(() => {
                    el.classList.remove('show-more-item--hidden-animation');
                }, 10);
            });
        shouldShowMore();
    };
    const button = document.getElementById(showMoreId);
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    newButton.addEventListener('click', renderMore);

    if (force) {
        renderMore();
        shouldShowMore();
    }
}
