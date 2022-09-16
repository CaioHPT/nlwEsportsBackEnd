var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { convertHourToMinutes } from './utils/convertHourToMinutes';
const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.get("/games", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const games = yield prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true
                }
            }
        }
    });
    return res.json(games);
}));
app.post("/ads", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const ad = yield prisma.ad.create({
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
    });
    return res.status(201).json(ad);
}));
app.get("/games/:id/ads", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = req.params.id;
    const ads = yield prisma.ad.findMany({
        select: {
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
    });
    return res.json(ads.map(ad => {
        return Object.assign(Object.assign({}, ad), { weekDays: ad.split(',') });
    }));
}));
app.get("/ads/:id/discord", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adId = req.params.id;
    const ad = yield prisma.ad.findUniqueOrThrow({
        select: {
            discord: true
        },
        where: {
            id: adId
        }
    });
    return res.json(ad);
}));
app.listen(3333, () => console.log("Server is running..."));
