export enum Significance {
    Red = 10,
    Blue = 20,
    White = 30,
    Black = 40,
}

export interface IWord {
    id: number,
    word: string,
    significance: Significance,
    checked: boolean
}