import {MigrationInterface, QueryRunner} from "typeorm";
import {RobotModelSeed} from "./robot-models.seed";
import {RobotSeed} from "./robots.seed";
import {BenderSeed} from "./benders.seed";
import {
    BeerBot,
    Bender, getBeerBotRepository,
    getBenderRepository,
    getRobotModelRepository,
    getRobotRepository,
    Robot,
    RobotModel
} from "../model";

export class SeedRobots1602412799831 implements MigrationInterface {

    public async up(_: QueryRunner): Promise<any> {
        const robotModelRepository = await getRobotModelRepository();
        const robotRepository = await getRobotRepository();
        const benderRepository = await getBenderRepository();
        const beerBotRepository = await getBeerBotRepository();

        await robotModelRepository.save(RobotModelSeed);

        const benderModel: RobotModel = await robotModelRepository.findOne({name: "Bender"});
        const beerBotModel: RobotModel = await robotModelRepository.findOne({name: "BeerBot"});

        for (let robotFromSeed of RobotSeed) {
            if (robotFromSeed.model === "Bender") {
                let robot: Robot = {
                    model: benderModel,
                    name: robotFromSeed.name,
                    description: robotFromSeed.description,
                }

                await robotRepository.save(robot);
                robot = await robotRepository.findOne({name: robotFromSeed.name});
                const benderProperties: Bender = {...BenderSeed, robot: robot};
                await benderRepository.save(benderProperties);
            } else if (robotFromSeed.model === "BeerBot") {
                let robot: Robot = {
                    model: beerBotModel,
                    name: robotFromSeed.name,
                    description: robotFromSeed.description,
                }

                await robotRepository.save(robot);
                robot = await robotRepository.findOne({name: robotFromSeed.name});
                const beerbotProperties: BeerBot = {robot: robot, servingTimeInSeconds: 5};
                await beerBotRepository.save(beerbotProperties);
            }
        }
    }

    public async down(_: QueryRunner): Promise<any> {
        // do nothing
    }

}
