"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const model_1 = require("./model");
exports.router = express_1.Router();
exports.router.get('/robots', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mapRobotDTO = (robot) => {
                return {
                    id: robot.id,
                    name: robot.name,
                    modelId: robot.model.id,
                    modelName: robot.model.name,
                    description: robot.description,
                };
            };
            const robotRepository = yield model_1.getRobotRepository();
            const allRobots = yield robotRepository.find({ relations: ["model"] });
            const mappedRobots = allRobots.map(mapRobotDTO);
            res.send(mappedRobots);
        }
        catch (err) {
            return next(err);
        }
    });
});
exports.router.get('/robots/bender/:id', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const benderRepository = yield model_1.getBenderRepository();
            const robot = yield benderRepository.findOne({ where: { robot: req.params.id } });
            res.send(robot);
        }
        catch (err) {
            return next(err);
        }
    });
});
exports.router.get('/robots/beerbot/:id', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const beerBotRepository = yield model_1.getBeerBotRepository();
            const robot = yield beerBotRepository.findOne({ where: { robot: req.params.id } });
            res.send(robot);
        }
        catch (err) {
            return next(err);
        }
    });
});
exports.router.post('/robots/beerbotbeer/:id', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const delay = (delayInMs) => {
                return new Promise(resolve => {
                    setTimeout(function () {
                        resolve();
                    }, delayInMs);
                });
            };
            const beerBotRepository = yield model_1.getBeerBotRepository();
            const robot = yield beerBotRepository.findOne({ where: { robot: req.params.id } });
            yield delay(robot.servingTimeInSeconds * 1000);
            robot.beersServed += 1;
            yield beerBotRepository.save(robot);
            res.send({ status: 'OK' });
        }
        catch (err) {
            return next(err);
        }
    });
});
exports.router.post('/robots', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const modelRepository = yield model_1.getRobotModelRepository();
            const model = yield modelRepository.findOne(req.body.modelId);
            const robotRepository = yield model_1.getRobotRepository();
            let robot = new model_1.Robot();
            robot.name = req.body.name;
            robot.model = model;
            robot.description = "The Robot you have just added";
            robot = yield robotRepository.save(robot);
            if (robot.model.name === "Bender") {
                const benderRepository = yield model_1.getBenderRepository();
                const benderProperties = new model_1.Bender();
                benderProperties.bendingSpeedInAnglesPerSeconds = 1;
                benderProperties.speedWhenEmptyInAnglesPerSecond = 5;
                benderProperties.currentAngle = 0;
                benderProperties.startingAngle = 0;
                benderProperties.targetAngle = 90;
                benderProperties.robot = robot;
                yield benderRepository.save(benderProperties);
            }
            else if (robot.model.name === "BeerBot") {
                const beerBotRepository = yield model_1.getBeerBotRepository();
                const beerBotProperties = new model_1.BeerBot();
                beerBotProperties.servingTimeInSeconds = 30;
                beerBotProperties.beersServed = 0;
                beerBotProperties.robot = robot;
                yield beerBotRepository.save(beerBotProperties);
            }
            res.send(robot);
        }
        catch (err) {
            return next(err);
        }
    });
});
exports.router.post('/robots/:id', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let result;
            const robotRepository = yield model_1.getRobotRepository();
            let robot = yield robotRepository.findOne({ where: { id: req.params.id }, relations: ["model"] });
            robot.name = req.body.name;
            robot.description = req.body.description;
            robot = yield robotRepository.save(robot);
            if (robot.model.name === "Bender") {
                const benderRepository = yield model_1.getBenderRepository();
                const bender = yield benderRepository.findOne({ where: { robot: robot.id } });
                bender.robot = robot;
                bender.bendingSpeedInAnglesPerSeconds = req.body.bendingSpeedInAnglesPerSeconds;
                bender.speedWhenEmptyInAnglesPerSecond = req.body.speedWhenEmptyInAnglesPerSecond;
                bender.startingAngle = req.body.startingAngle;
                bender.targetAngle = req.body.targetAngle;
                result = yield benderRepository.save(bender);
            }
            else if (robot.model.name === "BeerBot") {
                const beerBotRepository = yield model_1.getBeerBotRepository();
                const beerBot = yield beerBotRepository.findOne({ where: { robot: robot.id } });
                beerBot.robot = robot;
                beerBot.servingTimeInSeconds = req.body.servingTimeInSeconds;
                result = yield beerBotRepository.save(beerBot);
            }
            res.send(result);
        }
        catch (err) {
            return next(err);
        }
    });
});
exports.router.delete('/robots/:id', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const repository = yield model_1.getRobotRepository();
            const robot = yield repository.findOne(req.params.id);
            yield repository.delete(robot);
            res.send({ status: 'OK' });
        }
        catch (err) {
            return next(err);
        }
    });
});
