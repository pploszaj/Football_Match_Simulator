import { Length, Matches } from "class-validator";

export class SimulationNameDto {
    @Length(8, 30)
    @Matches(/^[A-Za-z0-9\s]+$/, {
        message: 'Name can only contain alphabetic characters, digits, and whitespaces'
    })
    name: string;
}