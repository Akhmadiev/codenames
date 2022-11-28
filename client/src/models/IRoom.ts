import { IWord } from "./IWord";

export interface IUser {
    id: string,
    name: string
}

export interface IPlayer {
    user: IUser,
    isCaptain: boolean,
    isRedTeam: boolean
}

export interface IRoom {
    id: string,
    name: string,
    words: IWord[],
    finished: boolean,
    redWins: boolean,
    redMove: boolean,
    createDate: Date,
    players: IPlayer[]
}