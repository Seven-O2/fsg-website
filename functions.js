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

// When top (plus delay) reaches bottom of screen, start reducing margin (thus making a fly in animation)
const FlyInFromBottom = (elements) => {
    const delay = 10; // how many VH after middle the animation shall start
    document.addEventListener("scroll", _ => {
        Array.from(elements).forEach(element => {
            const offsetFromCenter = window.innerHeight - element.getBoundingClientRect().top - delay; // represents the offset of the sections start to the screens center
            element.style.marginTop = Math.min(16, Math.max(0, 16 - offsetFromCenter / 20)) + "vh"; 
        });
    }, false);
}

// Creates the dates on the webpage according to the passed file
const CreateDates = (parent, file) => {
    fetch(file)
    .then(response => response.text())
    .then((data) => {
        data
        .split(/\r\n|\n/)
        .splice(1)
        .filter(e => e !== "")
        .map(e => e.split(";"))
        .forEach(ev => {
            // [0] => Date
            // [1] => Place
            // [2] => Latitude
            // [3] => Longitude
            // [4] => Organizer
            // [5] => Cancelled
            // [6] => Logo

            const card = document.createElement("div");
            card.onclick = () => window.open("https://maps.google.com/maps?hl=de&q=" + ev[2] + "," + ev[3], "_blank");
            card.classList.add("card")
            card.classList.add("clickable")
            if(ev[5] === "true") {
                card.classList.add("cancelled")
            }

            /**** Card data container ****/
            const data = document.createElement("div");
            card.appendChild(data);

            // Logo
            if(ev[6] === "true") {
                const logo = document.createElement("img");
                logo.classList.add("event-logo");
                logo.src = "/images/eurotrial.png";
                logo.alt = "Logo der Veranstaltung";
                data.appendChild(logo);
            }
            
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

            /**** Card map container ****/
            const map = document.createElement("iframe");
            map.loading = "lazy";
            map.referrerPolicy = "no-referrer-when-downgrade";
            map.classList.add("map");
            map.src = "https://maps.google.com/maps?hl=de&q=" + ev[2] + "," + ev[3] + "&z=6&output=embed"
            card.appendChild(map);
            parent.appendChild(card);
        });
        FlyInFromBottom([...document.getElementsByClassName("card")]);
    });
}

// Creates the rankings given by the selected PHP Script (executed server side)
const CreateRankings = (parent, phpScript) => {
    const monate = [ "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember" ];

    fetch(phpScript)
    .then(response => response.text())
    .then((data) => {
        const json = JSON.parse(data);
        Object.keys(json).reverse().forEach(year => {
            const title = document.createElement("h2");
            title.innerHTML = year;
            parent.appendChild(title);

            const rankingContainer = document.createElement("div");
            rankingContainer.classList.add("rankings-container");
            parent.appendChild(rankingContainer);

            json[year].reverse().forEach(ranking => {

                let name = ranking.replace(".pdf", "");
                if(name.includes("_")) {
                    name = name.split("_")[2] + " " + name.split("_")[1] + ". " + monate[name.split("_")[0] - 1];
                }
                const link = document.createElement("a");
                link.href = "./documents/rankings/" + year + "/" + ranking;
                link.classList.add("button-like");
                link.innerHTML = name;
                rankingContainer.appendChild(link);
        });
    });
});
}
