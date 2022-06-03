function tableOfContents(childrenSelector) {
    const children = document.querySelector(childrenSelector)?.childNodes;
    const sidebar = document.querySelector('.post__sidebar');
    const sidebarCross = document.querySelector('.post__sidebar--cross-mobile');
    const sidebarShadow = document.querySelector(
        '.post__sidebar--mobile-shadow'
    );
    const sidebarSections = document.querySelector('.post__sidebar--sections');
    const relatedContent = document.getElementById('related-content');
    const relatedPostsCta = document.getElementById('related-content-cta');
    children.forEach((child) => {
        if (child?.nodeName?.includes('H2')) {
            const section = document.createElement('div');
            section.innerText = child.innerText;
            section.classList.add('post__sidebar--section');
            if (sidebarSections.childElementCount < 1) {
                section.classList.add('post__sidebar--section-active');
            }
            section.addEventListener('click', () => {
                child.scrollIntoView();
                sidebar.classList.remove('post__sidebar--mobile-active');
            });
            sidebarSections.append(section);
        }
    });

    if (relatedContent && relatedPostsCta) {
        relatedPostsCta.addEventListener('click', () => {
            relatedContent.scrollIntoView();
            sidebar.classList.remove('post__sidebar--mobile-active');
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
                        '.post__sidebar--section-active'
                    );
                    if (
                        newSectionToSelect &&
                        currentSelectedSection !== newSectionToSelect
                    ) {
                        currentSelectedSection?.classList?.remove?.(
                            'post__sidebar--section-active'
                        );
                        newSectionToSelect?.classList?.add?.(
                            'post__sidebar--section-active'
                        );
                    }
                }
            });
        },
        { passive: true }
    );

    sidebarShadow.addEventListener('click', (e) => {
        sidebar.classList.remove('post__sidebar--mobile-active');
    });

    sidebarCross.addEventListener('click', () => {
        sidebar.classList.remove('post__sidebar--mobile-active');
    });
}
