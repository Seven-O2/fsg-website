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

// Passed elements follow scroll in an inverse manner
const FollowScrollInverse = (elements) => {
    document.addEventListener("scroll", _ => {
        const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
        elements.forEach(element => {
            element.style.top = -1 * scrollPosition / 2 + "px";
        });
    }, false);
}

// When scrolled past middle of the display, the element will be reduced in size
const ReduceSizeOnScroll = (elements) => {
    console.log(elements)
    const delay = 20;
    document.addEventListener("scroll", _ => {
        Array.from(elements).forEach(element => {
            const offsetFromCenter = window.innerHeight / 2 - element.getBoundingClientRect().top - delay; // represents the offset of the sections start to the screens center
            element.style.fontSize = Math.min(8, Math.max(2, 8 - offsetFromCenter / 20)) + "rem";
        });
    }, false);
}

const CreateDates = (parent) => {

}

const CreateRankings = (parent) => {
    
}
