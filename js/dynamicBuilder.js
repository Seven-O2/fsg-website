/*
 * This file contains the site specific builder functions which dynamically loads content from 
 * the server (fetch)
 */

//import { imageViewerController } from "./Modules/imageViewer";
import { flyInFromBottom } from "./animations.js";
import { createMapCard, fetchCSV, getIconWithText, loader } from "./util.js";

const months = [ "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember" ];

export const createBoard = (parent) => {
    const boardLoader = loader(parent);
    fetchCSV("/data/board.csv").then(data => {
        data.forEach(ev => {
            // [0] => Title, [1] => Name, [2] => Phone, [3] => Mail, [4] => Image
            const card = document.createElement("card");
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
            boardLoader.hide();
        });
    }).catch(error => {
        console.log(error);
        const title = document.createElement("h2");
        title.innerHTML = "Daten konnten nicht geladen werden.";
        parent.appendChild(title);
        boardLoader.hide();
    });
}

export const createClubs = (parent) => {
    const clubLoader = loader(parent);
    fetchCSV("/data/clubs.csv").then(data => {
        data.forEach(ev => {
            // [0] => Title, [1] => Person, [2] => Mail, [3] => Phone, [4] => Image, [5] => Website
            const card = document.createElement("card");
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
        clubLoader.hide();
    }).catch(error => {
        console.log(error);
        const title = document.createElement("h2");
        title.innerHTML = "Daten konnten nicht geladen werden.";
        parent.appendChild(title);
        clubLoader.hide();
    });
}

// Creates the dates on the webpage according to the passed file
export const createDates = (parent) => {
    const datesLoader = loader(parent);
    fetchCSV("/data/dates.csv").then(data => {
        data.forEach(ev => createMapCard(parent, ev[0], ev[1], ev[2], ev[3], ev[4], ev[5], ev[6], ev[7]));
        flyInFromBottom([...document.getElementsByClassName("map-card")]);
        datesLoader.hide();
    }).catch(error => {
        console.error(error);
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
                link.target = '_blank';
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
