function tableOfContents(childrenSelector) {
    const children = document.querySelector(childrenSelector)?.childNodes;
    const sidebar = document.querySelector('.sidebar');
    const sidebarCross = document.querySelector('.sidebar--cross-mobile');
    const sidebarShadow = document.querySelector('.sidebar--mobile-shadow');
    const sidebarSections = document.querySelector('.sidebar--sections');
    const relatedContent = document.getElementById('related-content');
    const relatedPostsCta = document.getElementById('related-content-cta');
    children.forEach((child) => {
        if (child?.nodeName?.includes('H2')) {
            const section = document.createElement('div');
            section.innerText = child.innerText;
            section.classList.add('sidebar--section');
            if (sidebarSections.childElementCount < 1) {
                section.classList.add('sidebar--section-active');
            }
            section.addEventListener('click', () => {
                child.scrollIntoView();
                sidebar.classList.remove('sidebar--mobile-active');
            });
            sidebarSections.append(section);
        }
    });

    if (relatedContent && relatedPostsCta) {
        relatedPostsCta.addEventListener('click', () => {
            relatedContent.scrollIntoView();
            sidebar.classList.remove('sidebar--mobile-active');
        });
    }

    window.addEventListener(
        'scroll',
        (e) => {
            children.forEach((child) => {
                const sections = Array.from(sidebarSections?.children);
                if (child?.nodeName?.includes('H2') && isInViewport(child)) {
                    const newSectionToSelect = sections.find(
                        (section) => section.innerText === child.innerText
                    );
                    const currentSelectedSection = document.querySelector(
                        '.sidebar--section-active'
                    );
                    if (
                        newSectionToSelect &&
                        currentSelectedSection !== newSectionToSelect
                    ) {
                        currentSelectedSection?.classList?.remove?.(
                            'sidebar--section-active'
                        );
                        newSectionToSelect?.classList?.add?.(
                            'sidebar--section-active'
                        );
                    }
                }
            });
        },
        { passive: true }
    );

    sidebarShadow.addEventListener('click', (e) => {
        sidebar.classList.remove('sidebar--mobile-active');
    });

    sidebarCross.addEventListener('click', () => {
        sidebar.classList.remove('sidebar--mobile-active');
    });
}
