function handleClickButtonsGroup(className, onClick) {
    const buttons = document.querySelectorAll(className);

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];

        button.addEventListener('click', (e) => {
            onClick(e);
        });
    }
}
