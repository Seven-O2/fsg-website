# FSG Website
![FSG Logo](./images/icons/logo.svg)
Repostiory containing the source code for the official swiss offroader federation. It is entirely written in plain HTML and CSS (because frameworks are heavy and tedious to maintain if not done daily) and a little javascript for animations.

Since this will be running on a php enabled server, some php is added to traverse the file system (for the rankings, so they are added automatically). Also, the events may be added by a simple .csv file.

## Adding new board members or clubs
Board members and clubs are displayed in a container at the beginning of the website in the about section. Since these can change sometimes (and strictly copy pasting the same cards all over is bad anyway), `.csv` are used to display them. They are kind of used as small databases.

### Board
Board members are saved at `/data/board.csv`. It contains the board members formatted as the table below:
|title|name|phone|mail|image|
|-|-|-|-|-|
|Member|Max Mustermann|+41 76 123 45 67|mm@email.com|mmustermann.jpg|

Phone/Mail are optional, the image should be the filename for a file saved at `images/board`.

### Clubs
Clubs are saved at `/data/clubs.csv`. It contains the clubs formatted as the table below:
|title|Person|phone|mail|image|website|
|-|-|-|-|-|-|
|Member Club|Max Mustermann|+41 76 123 45 67|mm@email.com|musterclub.jpg|memberclub.com|

Phone/Mail and website are optional, the image should be the filename for a file saved at `/images/clubs`. If a website is provided, the card becomes clickable

## Adding new rankings
Simply put the ranking into `/document/rankings/{year}/{MM_DD_PLACE.pdf}`, where `MM` represents the month and `DD` represents the day (this will be formatted).

## Adding events
Events are saved into the `/data/dates.csv` file. It contains the entries seen in the table below.
|Title|Subtitle|Date|Latitude|Longitude|Organizer|Cancelled (T/F)|Logo (link)|
|-|-|-|-|-|-|-|-|
|Reichenau, GR|2. Lauf|27. April 2024|46.82478|09.41534|GWC-Schweiz|false|false|

The events contain a map. These maps allow the users to locate the event position. The map is based on leaflet which uses tiling services to show tiles. Following tiling-services can be used:
- https://tiles1-bc7b4da77e971c12cb0e069bffcf2771.skobblermaps.com/TileService/tiles/2.0/01021113210/7/{z}/{x}/{y}.png@2x?traffic=false
- https://tile-4.kartenforum.slub-dresden.de/styles/maptiler-basic-v2/{z}/{x}/{y}@2x.png
- https://tile.openstreetmap.org/{z}/{x}/{y}.png
