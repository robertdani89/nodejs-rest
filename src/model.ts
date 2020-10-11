import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    createConnection,
    Connection,
    Repository,
    ManyToOne,
    JoinTable, PrimaryColumn
} from 'typeorm';
import {SeedRobots1602412799831} from "./migrations/SeedRobots";

@Entity()
export class RobotModel {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({length: 100})
    name: string;
}

@Entity()
export class Robot {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name: string;

    @JoinTable()
    @ManyToOne(type => RobotModel)
    model: RobotModel;

    @Column('text')
    description: string;
}

@Entity()
export class Bender {
    @PrimaryGeneratedColumn()
    id?: number;

    @JoinTable()
    @ManyToOne(type => Robot, { onDelete: 'CASCADE' })
    robot: Robot;

    @Column()
    currentAngle: number;

    @Column()
    speedWhenEmptyInAnglesPerSecond: number;

    @Column()
    targetAngle: number;

    @Column()
    startingAngle: number;

    @Column()
    bendingSpeedInAnglesPerSeconds: number;
}

@Entity()
export class BeerBot {
    @PrimaryGeneratedColumn()
    id?: number;

    @JoinTable()
    @ManyToOne(type => Robot, { onDelete: 'CASCADE' })
    robot: Robot;

    @Column()
    servingTimeInSeconds: number;

    @Column({default: 0})
    beersServed?: number;
}

let connection:Connection;

const openConnection = async () => {
    connection = await createConnection({
        type: 'sqlite',
        database: 'database',
        synchronize: true,
        entities: [
            RobotModel, Robot, Bender, BeerBot,
        ],
        migrations: [
            SeedRobots1602412799831
        ],
    });
    await connection.runMigrations();
}

export async function getRobotModelRepository(): Promise<Repository<RobotModel>>{
    if (connection===undefined) {
        await openConnection();
    }
    return connection.getRepository(RobotModel);
}

export async function getRobotRepository(): Promise<Repository<Robot>>{
    if (connection===undefined) {
        await openConnection();
    }
    return connection.getRepository(Robot);
}

export async function getBenderRepository(): Promise<Repository<Bender>> {
    if (connection===undefined) {
        await openConnection();
    }
    return connection.getRepository(Bender);
}

export async function getBeerBotRepository(): Promise<Repository<BeerBot>> {
    if (connection===undefined) {
        await openConnection();
    }
    return connection.getRepository(BeerBot);
}
