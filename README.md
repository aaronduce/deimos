# deimos
## the 'natural satellite' subnet manager

more just built against a grudge, because a spreadsheet is the worst way to store this kind of information.

built on remix with tailwind, db via prisma on sqlite.

![Home](https://i.imgur.com/JkaVVPU.jpg)

# deployment

using the remix app server:

1. `npm run build`
2. `cp .env.example .env`
3. `npx prisma migrate deploy`
4. `npm start`
