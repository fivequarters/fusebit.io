/* eslint-disable no-plusplus */
/* eslint-disable func-names */
function Dropdown(id, onChange) {
    this.isOpen = true;
    this.root = document.getElementById(id);
    this.items = this.root.querySelectorAll('.dropdown-item');
    this.init = function () {
        this.root.querySelector('span').innerHTML = `Category: ${
            this.root.querySelector('.dropdown-item').dataset.label
        }`;

        for (let i = 0; i < this.items.length; i++) {
            this.items[i].addEventListener('click', (e) => {
                this.root.querySelector(
                    'span',
                ).innerHTML = `Category: ${e.target.dataset.label}`;
                onChange?.(e.target.dataset.value);
            });
        }

        window.Popper.createPopper(
            this.root,
            this.root.querySelector('.dropdown-menu'),
            {
                placement: 'bottom-start',
                strategy: 'fixed',
            },
        );
    };

    this.toggle = function () {
        this.isOpen = !this.isOpen;
        this.content.classList.toggle('dropdown-content--open');
    };

    this.init();
}
