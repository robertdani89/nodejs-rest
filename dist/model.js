"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.getBeerBotRepository = exports.getBenderRepository = exports.getRobotRepository = exports.getRobotModelRepository = exports.BeerBot = exports.Bender = exports.Robot = exports.RobotModel = void 0;
const typeorm_1 = require("typeorm");
const SeedRobots_1 = require("./migrations/SeedRobots");
let RobotModel = class RobotModel {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], RobotModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ length: 100 }),
    __metadata("design:type", String)
], RobotModel.prototype, "name", void 0);
RobotModel = __decorate([
    typeorm_1.Entity()
], RobotModel);
exports.RobotModel = RobotModel;
let Robot = class Robot {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Robot.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Robot.prototype, "name", void 0);
__decorate([
    typeorm_1.JoinTable(),
    typeorm_1.ManyToOne(type => RobotModel),
    __metadata("design:type", RobotModel)
], Robot.prototype, "model", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], Robot.prototype, "description", void 0);
Robot = __decorate([
    typeorm_1.Entity()
], Robot);
exports.Robot = Robot;
let Bender = class Bender {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Bender.prototype, "id", void 0);
__decorate([
    typeorm_1.JoinTable(),
    typeorm_1.ManyToOne(type => Robot, { onDelete: 'CASCADE' }),
    __metadata("design:type", Robot)
], Bender.prototype, "robot", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Bender.prototype, "currentAngle", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Bender.prototype, "speedWhenEmptyInAnglesPerSecond", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Bender.prototype, "targetAngle", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Bender.prototype, "startingAngle", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Bender.prototype, "bendingSpeedInAnglesPerSeconds", void 0);
Bender = __decorate([
    typeorm_1.Entity()
], Bender);
exports.Bender = Bender;
let BeerBot = class BeerBot {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BeerBot.prototype, "id", void 0);
__decorate([
    typeorm_1.JoinTable(),
    typeorm_1.ManyToOne(type => Robot, { onDelete: 'CASCADE' }),
    __metadata("design:type", Robot)
], BeerBot.prototype, "robot", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], BeerBot.prototype, "servingTimeInSeconds", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], BeerBot.prototype, "beersServed", void 0);
BeerBot = __decorate([
    typeorm_1.Entity()
], BeerBot);
exports.BeerBot = BeerBot;
let connection;
const openConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    connection = yield typeorm_1.createConnection({
        type: 'sqlite',
        database: 'database',
        synchronize: true,
        entities: [
            RobotModel, Robot, Bender, BeerBot,
        ],
        migrations: [
            SeedRobots_1.SeedRobots1602412799831
        ],
    });
    yield connection.runMigrations();
});
function getRobotModelRepository() {
    return __awaiter(this, void 0, void 0, function* () {
        if (connection === undefined) {
            yield openConnection();
        }
        return connection.getRepository(RobotModel);
    });
}
exports.getRobotModelRepository = getRobotModelRepository;
function getRobotRepository() {
    return __awaiter(this, void 0, void 0, function* () {
        if (connection === undefined) {
            yield openConnection();
        }
        return connection.getRepository(Robot);
    });
}
exports.getRobotRepository = getRobotRepository;
function getBenderRepository() {
    return __awaiter(this, void 0, void 0, function* () {
        if (connection === undefined) {
            yield openConnection();
        }
        return connection.getRepository(Bender);
    });
}
exports.getBenderRepository = getBenderRepository;
function getBeerBotRepository() {
    return __awaiter(this, void 0, void 0, function* () {
        if (connection === undefined) {
            yield openConnection();
        }
        return connection.getRepository(BeerBot);
    });
}
exports.getBeerBotRepository = getBeerBotRepository;
