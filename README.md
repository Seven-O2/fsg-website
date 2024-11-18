# FSG Website
![FSG Logo](./icons/logo.svg)
Repostiory containing the source code for my offroad club's website. It is entirely written in plain HTML and CSS (because frameworks are heavy and tedious to maintain if not done daily) and a little javascript for animations.

Since this will be running on a php enabled server, some php is added to traverse the file system (for the rankings, so they are added automatically). Also, the events may be added by a simple .csv file.

## Adding new rankings
Simply put the ranking into `/document/rankings/{year}/{MM_DD_PLACE.pdf}`, where `MM` represents the month and `DD` represents the day (this will be formatted).

## Adding events
Events are saved into the `dates.csv` file. It contains the entries seen in the table below.
|Date|Place|Latitude|Longitude|Organizer|Cancelled (T/F)|Logo|
|-|-|-|-|-|-|-|
|27. April 2024|Reichenau GR|46.82478|09.41534|GWC-Schweiz|false||

The events contain a map. These maps allow the users to locate the event position. The map is based on leaflet which uses tiling services to show tiles. Following tiling-services can be used:
https://tiles1-bc7b4da77e971c12cb0e069bffcf2771.skobblermaps.com/TileService/tiles/2.0/01021113210/7/{z}/{x}/{y}.png@2x?traffic=false
https://tile-4.kartenforum.slub-dresden.de/styles/maptiler-basic-v2/{z}/{x}/{y}@2x.png
https://tile.openstreetmap.org/{z}/{x}/{y}.png
