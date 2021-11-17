function openModalFromHash(hash, id) {
    function checkContactHashInUrl() {
        if (window.location.hash.indexOf(hash) > -1) {
            openModal(id);
        }
    }

    checkContactHashInUrl();

    window.addEventListener('hashchange', checkContactHashInUrl);
}
