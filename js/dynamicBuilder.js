/*
 * This file contains the site specific builder functions which dynamically loads content from 
 * the server (fetch)
 */

//import { imageViewerController } from "./Modules/imageViewer";
import { flyInFromBottom } from "./animations.js";
import { fetchCSV, getIconWithText, loader } from "./util.js";

const months = [ "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember" ];

export const createClubsAndBoard = (parent, clubOrBoardSelector) => {
    const clubAndBoardLoader = loader(parent);
    const boardCards = [];
    const clubCards = [];
    const hint = parent.getElementsByClassName("hint")[0];
    hint.innerHTML = "Vorstand →";
    fetchCSV("/data/board.csv").then(data => {
        data.forEach(ev => {
            // [0] => Title, [1] => Name, [2] => Phone, [3] => Mail, [4] => Image
            const card = document.createElement("card");
            boardCards.push(card);
            card.classList.add("card");
            parent.appendChild(card);
            
            // Image
            const image = document.createElement("img");
            image.src = "/images/board/" + ev[4];
            image.alt = "Bild von " + ev[0];
            image.classList.add("circle")
            card.appendChild(image);
            
            // Title
            const title = document.createElement("h2");
            title.innerHTML = ev[0];
            card.appendChild(title);

            // Name
            const name = document.createElement("p");
            name.innerHTML = ev[1];
            card.appendChild(getIconWithText("/images/icons/user.svg", "Person", name));

            // Phone
            if(ev[2] !== "") {
                const phone = document.createElement("p");
                phone.innerHTML = ev[2];
                card.appendChild(getIconWithText("/images/icons/phone.svg", "Telefonnummer", phone));
            }

            // Mail
            if(ev[3] !== "") {
                const mail = document.createElement("p");
                mail.innerHTML = ev[3];
                card.appendChild(getIconWithText("/images/icons/mail.svg", "E-Mail Adresse", mail));
            }
        });
        return fetchCSV("/data/clubs.csv"); // force loading board first, then club
    }).then(data => {
        data.forEach(ev => {
            // [0] => Title, [1] => Person, [2] => Mail, [3] => Phone, [4] => Image, [5] => Website
            const card = document.createElement("card");
            clubCards.push(card);
            card.style.display = "none";
            card.classList.add("card");
            if(ev[5] !== "") {
                card.classList.add("clickable");
                card.onclick = () => window.open(ev[5],'_blank');
            }
            parent.appendChild(card);

            // Image
            const image = document.createElement("img");
            image.src = "/images/clubs/" + ev[4];
            image.alt = "Logo von " + ev[0];
            card.appendChild(image);

            // Title
            const title = document.createElement("h2");
            title.innerHTML = ev[0];
            card.appendChild(title);

            // Name
            const name = document.createElement("p");
            name.innerHTML = ev[1];
            card.appendChild(getIconWithText("/images/icons/user.svg", "Person", name));

            // Phone
            if(ev[2] !== "") {
                const phone = document.createElement("p");
                phone.innerHTML = ev[2];
                card.appendChild(getIconWithText("/images/icons/phone.svg", "Telefonnummer", phone));
            }

            // Mail
            if(ev[3] !== "") {
                const mail = document.createElement("p");
                mail.innerHTML = ev[3];
                card.appendChild(getIconWithText("/images/icons/mail.svg", "E-Mail Adresse", mail));
            }
        });
        clubAndBoardLoader.hide();
    }).catch(error => {
        console.log(error);
        const title = document.createElement("h2");
        title.innerHTML = "Daten konnten nicht geladen werden.";
        parent.appendChild(title);
        clubAndBoardLoader.hide();
    });
    
    clubOrBoardSelector.addEventListener('change', event => {
        if(event.target.checked) {
            hint.innerHTML = "Clubs →"
            boardCards.forEach(b => b.style.display = "none");
            clubCards.forEach(b => b.style.display = "block");
        } else {
            hint.innerHTML = "Vorstand →"
            boardCards.forEach(b => b.style.display = "block");
            clubCards.forEach(b => b.style.display = "none");
        }
    });
}

// Creates the dates on the webpage according to the passed file
export const createDates = (parent) => {
    const datesLoader = loader(parent);
    fetchCSV("/data/dates.csv").then(data => {
        data.forEach(ev => {
            // [0] => Title, [1] => Subtitle, [2] => Date, [3] => Latitude, [4] => Longitude, [5] => Organizer, [6] => Cancelled, [7] => Logo
            const card = document.createElement("div");
            card.classList.add("map-card");
            card.classList.add("clickable");
            if(ev[6] === "true") {
                card.classList.add("cancelled");
            }
            // if mouse up has same position as mouse down, open google maps
            let mousePosition = undefined;
            card.onmousedown = (e) => { mousePosition = {x: e.clientX, y: e.clientY}; }
            card.onmouseup = (e) => {
                if(mousePosition && mousePosition.x === e.clientX && mousePosition.y === e.clientY) {
                    window.open("https://maps.google.com/maps?hl=de&q=" + ev[3] + "," + ev[4], "_blank");
                }
            }
            
            parent.appendChild(card);

            /**** Card data container ****/
            const data = document.createElement("div");
            card.appendChild(data);

            // Logo
            if(ev[7] === "true") {
                const logo = document.createElement("img");
                logo.classList.add("event-logo");
                logo.src = "/images/icons/eurotrial.png";
                logo.alt = "Logo der Veranstaltung";
                data.appendChild(logo);
            }
            
            // Title
            const title = document.createElement("h2");
            title.innerHTML = ev[0];
            data.appendChild(title);

            // Subtitle
            const subtitle = document.createElement("h4");
            subtitle.innerHTML = ev[1];
            data.appendChild(subtitle);

            // Date
            const date = document.createElement("p");
            date.innerHTML = ev[2];
            data.appendChild(getIconWithText("./images/icons/calendar.svg", "Datum", date))
            
            // Place
            const place = document.createElement("div");
            const lat = document.createElement("p");
            lat.classList.add("mono");
            lat.innerHTML = ev[3] + "° N";
            place.appendChild(lat);

            const lng = document.createElement("p");
            lng.classList.add("mono");
            lng.innerHTML = ev[4] + "° E";
            place.appendChild(lng);

            data.appendChild(getIconWithText("./images/icons/map_pin.svg", "Ortschaft", place))

            // Organizer
            const organizer = document.createElement("p");
            organizer.innerHTML = ev[5];
            data.appendChild(getIconWithText("./images/icons/user.svg", "Organisator", organizer))

            /**** Card map container ****/
            const mapDiv = document.createElement("div");
            mapDiv.classList.add("map");
            // Touchstart with only one finger => remind user to use multiple
            mapDiv.addEventListener('touchstart', (event) => {
                if (event.touches.length === 1) {
                    mapDiv.classList.add("use-two-fingers");
                } else {
                    mapDiv.classList.remove("use-two-fingers");
                }
            });
            mapDiv.addEventListener('touchend', (event) => {
                mapDiv.classList.remove("use-two-fingers");
            });
            card.appendChild(mapDiv);

            const map = L.map(mapDiv, { dragging: !L.Browser.mobile }).setView([ev[3], ev[4]], 7);
            L.tileLayer('https://tiles1-bc7b4da77e971c12cb0e069bffcf2771.skobblermaps.com/TileService/tiles/2.0/01021113210/7/{z}/{x}/{y}.png@2x?traffic=false', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);
            L.marker([ev[3], ev[4]], {icon: L.icon({iconUrl: './images/icons/marker_pin.svg', iconSize: [40, 40], iconAnchor: [20, 40]})}).addTo(map);

            // Move marker to center between blurred part and right bounds (bottom bound on mobile)
            let verticalCenter   = mapDiv.getBoundingClientRect().height / 2;
            let horizontalCenter = mapDiv.getBoundingClientRect().width / 2;
            if(window.matchMedia("(max-width: 1000px)").matches) {
                // MOBILE
                verticalCenter   = (mapDiv.getBoundingClientRect().height - data.getBoundingClientRect().height) / 2;
                map.setView(map.containerPointToLatLng([horizontalCenter, verticalCenter]));
            } else {
                // DESKTOP
                horizontalCenter = (mapDiv.getBoundingClientRect().width - data.getBoundingClientRect().width) / 2;
                map.setView(map.containerPointToLatLng([horizontalCenter, verticalCenter]));
            }
            
        });
        flyInFromBottom([...document.getElementsByClassName("map-card")]);
        datesLoader.hide();
    }).catch(_ => {
        const title = document.createElement("h2");
        title.innerHTML = "Daten konnten nicht geladen werden.";
        parent.appendChild(title);
        datesLoader.hide();
    });
}

// Creates the rankings given by the selected PHP Script (executed server side)
export const createRankings = (parent) => {
    const rankingLoader = loader(parent);
    fetch("/documents/rankings/list_rankings.php")
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
                    name = name.split("_")[2] + " " + name.split("_")[1] + ". " + months[name.split("_")[0] - 1];
                }
                const link = document.createElement("a");
                link.href = "./documents/rankings/" + year + "/" + ranking;
                link.classList.add("button-like");
                link.innerHTML = name;
                rankingContainer.appendChild(link);
            });
        });
        rankingLoader.hide();
    }).catch(_ => {
        const title = document.createElement("h2");
        title.innerHTML = "Daten konnten nicht geladen werden.";
        parent.appendChild(title);
        rankingLoader.hide();
    });
}
