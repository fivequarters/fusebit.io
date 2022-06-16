function calculateCardsHeight(cardsSelector) {
    function calculateHeight() {
        const cards = document.querySelectorAll(cardsSelector);
        let largestCardSize = 0;

        // Search for the biggest card
        cards.forEach((card) => {
            // Normalize card height
            card.style.height = 'auto';

            // Check the height
            const cardHeight = card.clientHeight;
            if (cardHeight > largestCardSize) {
                largestCardSize = cardHeight;
            }
        });

        // Set that height to all the cards
        cards.forEach((card) => {
            card.style.height = `${largestCardSize}px`;
        });
    };

    calculateHeight();

    window.addEventListener('resize', calculateHeight);
}