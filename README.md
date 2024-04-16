# Mini Scrabble
## Description
A simple, miniature version of scrabble. The board is 9x9, and the bag includes only 64 tiles.

## Technolgy
### Frontend:
- Pure HTML, CSS, and JS
- Websockets with Socket.IO

### Backend:
- Runtime: Node.js
- Server: Express.js with Socket.IO
- Language: Typescript via tsx

## Why?
I made this project because programming is my passion, and I love solving prolems. Me and my friend both wanted to play scrabble, but didn't have the time for a traditional game. This gave me the idea to try making a "mini" version, and this is the result.

I didn't have a ton of experience writing servers in Express, using WebSockets, or running Typescript on Node.js prior to this, which is why I chose them for this project.

## Todo
- [x] Scrabble Board
- [x] Tiles
- [x] Word validation
- [x] Drawing tiles
- [x] Websockets
- [x] Placing tiles on board
- [x] Validating tile placements (sort of)
- [x] Rack sorting/shuffling
- [x] Syncing between clients
- [ ] Mapping game IDs to Socket.io Rooms
- [ ] Realtime word scoring
- [ ] Game joining/leaving
- [ ] Win / Lose state
- [ ] Track game state on server