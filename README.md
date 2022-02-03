# deimos
## the 'natural satellite' subnet manager

more just built against a grudge, because a spreadsheet is the worst way to store this kind of information.

built on remix with tailwind, db via prisma on sqlite.

![Home](https://i.imgur.com/JkaVVPU.jpg)

# deployment

using the remix app server:

1. `npm install`
2. `npm run build`
3. `cp .env.example .env`
4. `npx prisma migrate deploy`
5. `npx prisma generate`
6. `npm start`
