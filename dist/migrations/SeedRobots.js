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
exports.SeedRobots1602412799831 = void 0;
const robot_models_seed_1 = require("./robot-models.seed");
const robots_seed_1 = require("./robots.seed");
const benders_seed_1 = require("./benders.seed");
const model_1 = require("../model");
class SeedRobots1602412799831 {
    up(_) {
        return __awaiter(this, void 0, void 0, function* () {
            const robotModelRepository = yield model_1.getRobotModelRepository();
            const robotRepository = yield model_1.getRobotRepository();
            const benderRepository = yield model_1.getBenderRepository();
            const beerBotRepository = yield model_1.getBeerBotRepository();
            yield robotModelRepository.save(robot_models_seed_1.RobotModelSeed);
            const benderModel = yield robotModelRepository.findOne({ name: "Bender" });
            const beerBotModel = yield robotModelRepository.findOne({ name: "BeerBot" });
            for (let robotFromSeed of robots_seed_1.RobotSeed) {
                if (robotFromSeed.model === "Bender") {
                    let robot = {
                        model: benderModel,
                        name: robotFromSeed.name,
                        description: robotFromSeed.description,
                    };
                    yield robotRepository.save(robot);
                    robot = yield robotRepository.findOne({ name: robotFromSeed.name });
                    const benderProperties = Object.assign(Object.assign({}, benders_seed_1.BenderSeed), { robot: robot });
                    yield benderRepository.save(benderProperties);
                }
                else if (robotFromSeed.model === "BeerBot") {
                    let robot = {
                        model: beerBotModel,
                        name: robotFromSeed.name,
                        description: robotFromSeed.description,
                    };
                    yield robotRepository.save(robot);
                    robot = yield robotRepository.findOne({ name: robotFromSeed.name });
                    const beerbotProperties = { robot: robot, servingTimeInSeconds: 5 };
                    yield beerBotRepository.save(beerbotProperties);
                }
            }
        });
    }
    down(_) {
        return __awaiter(this, void 0, void 0, function* () {
            // do nothing
        });
    }
}
exports.SeedRobots1602412799831 = SeedRobots1602412799831;
