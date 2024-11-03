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
