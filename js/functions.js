// Passed elements follow the mouse
const FollowMouse = (elements) => {
    let imageXOffset = -0.5;
    let imageYOffset = -0.5;

    let posXOld = 0;
    let posYOld = 0;

    document.addEventListener("mousemove", e => {
        const deltaX = (e.clientX - posXOld) / 500
        const deltaY = (e.clientY - posYOld) / 500
      
        posXOld = e.clientX;
        posYOld = e.clientY;
        
        imageXOffset = Math.min(0, Math.max(-1, imageXOffset + deltaX));
        imageYOffset = Math.min(0, Math.max(-1, imageYOffset + deltaY));

        elements.forEach(element => {
            element.style.left = imageXOffset + "vw"; 
            element.style.top  = imageYOffset + "vw";
        });
    }, false);
}

// Passed elements follow scroll
const FollowScrollInverse = (elements) => {
    document.addEventListener("scroll", _ => {
        const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
        elements.forEach(element => {
            element.style.top = -1 * scrollPosition / 2 + "px";
        });
    }, false);
}

const SectionScrollActions = (elements) => {
    const defaultSpacing = getComputedStyle(document.documentElement).getPropertyValue("--default-spacing").slice(0, -2);
    const delay = 20;
    document.addEventListener("scroll", _ => {
        Array.from(elements).forEach(element => {
            const title = element.getElementsByClassName("section-title")[0];
            const offsetFromCenter = window.innerHeight / 2 - title.getBoundingClientRect().top - delay; // represents the offset of the sections start to the screens center
            title.style.fontSize  = Math.min( 16, Math.max(defaultSpacing * 0.8, 16 - offsetFromCenter / 11)) + "vw";
        });
    }, false);
}

const switchElements = (e1, e2) => {
    element1 = document.getElementById(e1);
    element2 = document.getElementById(e2);
    if(element1.style.display !== "none") {
        element2.style.display = element1.style.display;
        element1.style.display = "none"
    } else {
        element1.style.display = element2.style.display;
        element2.style.display = "none"
    }
}
