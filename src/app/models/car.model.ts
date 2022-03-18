import * as internal from "stream";

export class Car {

    public carIndex: number;
    public chassisIndex: number;
    public brand: string;
    public chassis: string;
    public engine: string;
    public kw: string;
    public hp: string;
    public displacement: string;
    public year: string;
    public fuel: string;

    constructor(carIndex: number, chassisIndex: number, brand: string, chassis: string, engine: string, kw: string, hp: string, displacement: string, year: string, fuel: string){
        this.carIndex = carIndex;
        this.chassisIndex = chassisIndex;
        this.brand = brand;
        this.chassis = chassis;
        this.engine = engine;
        this.kw = kw;
        this.hp = hp;
        this.displacement = displacement;
        this.year = year;
        this.fuel = fuel;
        
    }

}