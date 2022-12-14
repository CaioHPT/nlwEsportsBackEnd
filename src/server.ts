import express from 'express'
import { PrismaClient } from '@prisma/client'
import { convertHourToMinutes } from './utils/convertHourToMinutes'

const app = express()
const prisma = new PrismaClient()

app.use(express.json())

app.get("/games", async (req, res) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true
                }
            }
        }
    })

    return res.json(games)
})

app.post("/ads", async (req, res) => {
    const body = req.body

    const ad = await prisma.ad.create({
        data: {
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(","),
            hourStart: convertHourToMinutes(body.hourStart),
            hourEnd: convertHourToMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel,
            gameId: body.gameId
        }
    })

    return res.status(201).json(ad)
})

app.get("/games/:id/ads", async(req, res) => {
    const gameId = req.params.id

    const ads = await prisma.ad.findMany({
        select:{
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true
        },
        where: {
            gameId: gameId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return res.json(ads.map(ad => {
        return{
            ...ad,
            weekDays: ad.weekDays.split(',')
        }
    }))
})

app.get("/ads/:id/discord", async (req, res) => {
    const adId = req.params.id

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true
        },
        where : {
            id: adId
        }
    })

    return res.json(ad)
})

app.listen(3333, () => console.log("Server is running..."))