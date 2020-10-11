import { NextFunction, Request, Response, Router } from 'express';
import {
    BeerBot, Bender,
    getBeerBotRepository,
    getBenderRepository,
    getRobotModelRepository,
    getRobotRepository,
    Robot
} from './model';
import {IRobotDTO} from "./interfaces/IRobotDTO";

export const router: Router = Router();

router.get('/robots', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const mapRobotDTO = (robot: Robot): IRobotDTO => {
            return {
                id: robot.id,
                name: robot.name,
                modelId: robot.model.id,
                modelName: robot.model.name,
                description: robot.description,
            }
        }

        const robotRepository = await getRobotRepository();
        const allRobots = await robotRepository.find({ relations: ["model"] });
        const mappedRobots: IRobotDTO[] = allRobots.map(mapRobotDTO);
        res.send(mappedRobots);
    }
    catch (err) {
        return next(err);
    }
});

router.get('/robots/bender/:id', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const benderRepository = await getBenderRepository();
        const robot = await benderRepository.findOne({where: {robot: req.params.id}});
        res.send(robot);
    }
    catch (err) {
        return next(err);
    }
});

router.get('/robots/beerbot/:id', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const beerBotRepository = await getBeerBotRepository();
        const robot = await beerBotRepository.findOne({where: {robot: req.params.id}});
        res.send(robot);
    }
    catch (err) {
        return next(err);
    }
});

router.post('/robots/beerbotbeer/:id', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const delay = (delayInMs: number): Promise<void> => {
            return new Promise<void>( resolve => {
                setTimeout(function(){
                    resolve();
                }, delayInMs);
            })
        };

        const beerBotRepository = await getBeerBotRepository();
        const robot = await beerBotRepository.findOne({where: {robot: req.params.id}});
        await delay(robot.servingTimeInSeconds * 1000);
        robot.beersServed += 1;
        await beerBotRepository.save(robot);
        res.send({status: 'OK'});
    }
    catch (err) {
        return next(err);
    }
});

router.post('/robots', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const modelRepository = await getRobotModelRepository();
        const model = await modelRepository.findOne(req.body.modelId);

        const robotRepository = await getRobotRepository();
        let robot = new Robot();
        robot.name = req.body.name;
        robot.model = model;
        robot.description = "The Robot you have just added";
        robot = await robotRepository.save(robot);

        if (robot.model.name === "Bender") {
            const benderRepository = await getBenderRepository();
            const benderProperties = new Bender();
            benderProperties.bendingSpeedInAnglesPerSeconds = 1;
            benderProperties.speedWhenEmptyInAnglesPerSecond = 5;
            benderProperties.currentAngle = 0;
            benderProperties.startingAngle = 0;
            benderProperties.targetAngle = 90;
            benderProperties.robot = robot;
            await benderRepository.save(benderProperties);
        } else if (robot.model.name === "BeerBot") {
            const beerBotRepository = await getBeerBotRepository();
            const beerBotProperties = new BeerBot();
            beerBotProperties.servingTimeInSeconds = 30;
            beerBotProperties.beersServed = 0;
            beerBotProperties.robot = robot;
            await beerBotRepository.save(beerBotProperties);
        }

        res.send(robot);
    }
    catch (err) {
        return next(err);
    }
});

router.post('/robots/:id', async function (req: Request, res: Response, next: NextFunction) {
    try {
        let result;
        const robotRepository = await getRobotRepository();
        let robot = await robotRepository.findOne({where: {id: req.params.id}, relations: ["model"]});
        robot.name = req.body.name;
        robot.description = req.body.description;
        robot = await robotRepository.save(robot);
        if (robot.model.name === "Bender") {
            const benderRepository = await getBenderRepository();
            const bender = await benderRepository.findOne({where: {robot: robot.id}});
            bender.robot = robot;
            bender.bendingSpeedInAnglesPerSeconds = req.body.bendingSpeedInAnglesPerSeconds;
            bender.speedWhenEmptyInAnglesPerSecond = req.body.speedWhenEmptyInAnglesPerSecond;
            bender.startingAngle = req.body.startingAngle;
            bender.targetAngle = req.body.targetAngle;
            result = await benderRepository.save(bender);
        } else if (robot.model.name === "BeerBot") {
            const beerBotRepository = await getBeerBotRepository();
            const beerBot = await beerBotRepository.findOne({where: {robot: robot.id}});
            beerBot.robot = robot;
            beerBot.servingTimeInSeconds = req.body.servingTimeInSeconds;
            result = await beerBotRepository.save(beerBot);
        }

        res.send(result);
    }
    catch (err) {
        return next(err);
    }
});


router.delete('/robots/:id', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const repository = await getRobotRepository();
        const robot = await repository.findOne(req.params.id);
        await repository.delete(robot);
        res.send({status: 'OK'});
    }
    catch (err) {
        return next(err);
    }
});

