/* eslint-disable no-plusplus */
/* eslint-disable func-names */
function Dropdown(id, onChange) {
    this.root = document.getElementById(id);
    this.items = this.root.querySelectorAll('.dropdown-item');
    this.menu = this.root.querySelector('.dropdown-menu');
    this.open = false;
    this.init = function () {
        document.addEventListener('click', (event) => {
            const isClickInside = this.root.contains(event.target);

            if (!isClickInside && this.open) {
                this.toggle();
            }
        });

        this.root.addEventListener('click', (event) => {
            if (this.menu.contains(event.target)) {
                return;
            }
            this.toggle();
        });

        this.root.querySelector('span').innerHTML = `Category: ${
            this.root.querySelector('.dropdown-item').dataset.label
        }`;

        for (let i = 0; i < this.items.length; i++) {
            this.items[i].addEventListener('click', (e) => {
                e.stopPropagation();
                this.root.querySelector(
                    'span',
                ).innerHTML = `Category: ${e.target.dataset.label}`;
                this.toggle();
                onChange?.(e.target.dataset.value);
            });
        }

        window.Popper.createPopper(
            this.root,
            this.menu,
            {
                placement: 'bottom-start',
                strategy: 'absolute',
                modifiers: [
                    {
                        name: 'hide',
                    },
                ],
            },
        );
    };

    this.toggle = function () {
        this.open = !this.open;
        this.menu.classList.toggle('dropdown-menu--open');
    };

    this.init();
}
