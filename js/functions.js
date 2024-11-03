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
            element.style.fontSize = Math.min(16, Math.max(6, 16 - offsetFromCenter / 20)) + "vw";
        });
    }, false);
}

// Creates the dates on the webpage according to the passed file
const CreateDates = (parent, file) => {
    fetch(file)
        .then(response => response.text())
        .then((data) => {
            const csv = data
                .split(/\r\n|\n/)
                .splice(1)
                .filter(e => e !== "")
                .map(e => e.split(";"))
                .forEach(ev => {
                    // 0 => Date
                    // 1 = Place
                    // 2 = Latitude
                    // 3 = Longitude
                    // 4 = Organizer
                    // 5 = Cancelled

                    const card = document.createElement("div");
                    card.classList.add("card")
                    if(ev[5] === "true") {
                        card.classList.add("cancelled")
                    }

                    const data = document.createElement("div");
                    
                    // Title
                    const title = document.createElement("h2");
                    title.innerHTML = ev[0];
                    data.appendChild(title);
                    
                    // Place
                    const placeContainer = document.createElement("div");
                    placeContainer.classList.add("icon-with-text");
                    data.appendChild(placeContainer);
                    
                    const placeIcon = document.createElement("img");
                    placeIcon.src = "./icons/map_pin.svg";
                    placeIcon.alt = "Ortschaft";
                    placeContainer.appendChild(placeIcon);

                    const placeSubContainer = document.createElement("div");
                    placeContainer.appendChild(placeSubContainer);
                    
                    const place = document.createElement("p")
                    place.innerHTML = ev[1];
                    placeSubContainer.appendChild(place);

                    const lat = document.createElement("p");
                    lat.classList.add("mono");
                    lat.innerHTML = ev[2] + "° N";
                    placeSubContainer.appendChild(lat);

                    const lng = document.createElement("p");
                    lng.classList.add("mono");
                    lng.innerHTML = ev[3] + "° E";
                    placeSubContainer.appendChild(lng);

                    // Organizer
                    const organizerContainer = document.createElement("div");
                    organizerContainer.classList.add("icon-with-text");
                    data.appendChild(organizerContainer);
                    
                    const organizerIcon = document.createElement("img");
                    organizerIcon.src = "./icons/user.svg";
                    organizerIcon.alt = "Organisator";
                    organizerContainer.appendChild(organizerIcon)

                    const organizer = document.createElement("p");
                    organizer.innerHTML = ev[4];
                    organizerContainer.appendChild(organizer);

                    card.appendChild(data);

                    const map = document.createElement("iframe");
                    map.classList.add("map");
                    map.allowFullscreen = "";
                    map.loading = "lazy";
                    map.referrerpolicy = "no-referrer-when-downgrade";
                    map.src = "https://maps.google.com/maps?hl=de&q=" + ev[2] + "," + ev[3] + "&output=embed"
                    
                    card.appendChild(map);
                    
                    parent.appendChild(card);
                });
            console.log(csv);
            /*
<div class="card">
    <div>
    <h2>19. Oktober 2024</h2>
    <div class="icon-with-text">
        <img src="./icons/map_pin.svg" alt="Ortschaft">
        <div>
        <p>Seltz, Wissembourg (FR)</p>
        <p class="mono">48.92109° N</p>
        <p class="mono">08.10683° E</p>
        </div>
    </div>
    <div class="icon-with-text">
        <img src="./icons/user.svg" alt="Organisator">
        <p>4x4 Aargau</p>
    </div>
    </div>
    <iframe class="map" src="https://maps.google.com/maps?hl=de&q=48.92109,08.10683&output=embed" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</div>


            */

            const ifrm ="https://maps.google.com/maps?hl=de&q="
            +"48.92109"
            +","
            +"08.10683"
            +"&output=embed"
            console.log(ifrm)
        });
}

const CreateRankings = (parent, phpScript) => {
    fetch('/resources/documents/rankings/')
        .then(response => response.text())
        .then((data) => {
            console.log(data)
        });
}
