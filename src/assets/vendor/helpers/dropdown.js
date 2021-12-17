/* eslint-disable no-plusplus */
/* eslint-disable func-names */
function Dropdown(id, onChange) {
    this.isOpen = true;
    this.root = document.getElementById(id);
    this.items = this.root.querySelectorAll('.dropdown-item');
    this.init = function () {
        this.root.querySelector('span').innerHTML =
            this.root.querySelector('.dropdown-item').dataset.label;

        for (let i = 0; i < this.items.length; i++) {
            this.items[i].addEventListener('click', (e) => {
                this.root.querySelector('span').innerHTML =
                    e.target.dataset.label;
                onChange?.(e.target.dataset.value);
            });
        }
    };

    this.toggle = function () {
        this.isOpen = !this.isOpen;
        this.content.classList.toggle('dropdown-content--open');
    };

    this.init();
}
