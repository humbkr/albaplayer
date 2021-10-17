# Alba Player
> Minimalistic audio library web player.

## About
Alba player is an audio library web-based player. I was tired of all the desktop audio players 
available on linux and macos with questionable user interfaces and/or library management, 
and I wanted to learn Golang and React, so I decided to build my own.   
This player is by purpose limited in terms of functionalities, as its main goal is to just 
play music. It is focused on users that like playing entire albums more than random songs from their
library.  

Although fully operational, this project is still under heavy development, as it is a pet project
that I use to improve my coding skills. Contributions and remarks on the existing code are welcomed!

WEBSITE (with demo): [https://albaplayer.com](https://albaplayer.com)

### Basic features

- HTML5 audio player with basic controls (play / pause / previous / next / timeline progress / 
volume / random / repeat)
- Main playing queue à la Winamp (playback doesn't magically change to the songs you are currently 
browsing in the library)
- Library browser with Artists / Albums / Tracks views that actually manage compilations properly
- Now playing screen with current song info and buttons to google lyrics and guitar tabs
- Client / server app, so can be installed on a server to access and play a music library remotely
- Can manage huge libraries (tested with 30000+ songs)

**Note:** this player is not adapted for mobile or tablet use. A good mobile UI would be completely 
different from a desktop one, so I focused on the desktop first, as there are already a lot of good 
mobile players apps.

## Installation

Grab the archive corresponding to your system on the [official website](https://albaplayer.com), 
unzip it somewhere, tinker with the alba.yml configuration file and run the alba executable from the 
command line.

## Developement

**Tech stack:**
- React for the client
- Golang for the server
- GraphQL
- SQLite
