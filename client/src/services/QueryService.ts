import axios from "axios";
import { IWord, Significance } from "../models/IWord";
import { v4 } from 'uuid';
import { IRoom, IPlayer, IUser } from "../models/IRoom";

const API_URL = process.env.REACT_APP_DB || 'http://localhost:4004';

axios.defaults.baseURL = API_URL;


export const QueryService = {
    async getRoom(id: string) {
		return axios.get(`/rooms/${id}`)
    },
    
	async generateWord() {
		const id = Math.floor(Math.random() * 1000);
		return await axios.get<any>(`/words/${id}`);
	},

	async getRooms() {
		return axios.get('/rooms');
	},

    async getWords(id: string) {
        return axios.get(`/rooms/${id}`);
	},
	
	async wordCheck(roomId: string, wordId: number) {
		const room = await this.getRoom(roomId);
		const roomData = room.data as IRoom;
		
		const word = roomData.words.filter(x => x.id === wordId)[0];
		word.checked = true;

		var blackFinished = word.significance === Significance.Black;
		var redFinished = roomData.words.filter(x => x.checked === true && x.significance === Significance.Red).length === 9;
		var blueFinished = roomData.words.filter(x => x.checked === true && x.significance === Significance.Blue).length === 8;

		if (blackFinished || redFinished || blueFinished) {
			roomData.finished = true;

			if (blackFinished) {
				roomData.redWins = !roomData.redMove;
			} else {
				roomData.redWins = redFinished;
				roomData.redMove = redFinished;
			}
		}

		if (roomData.redMove && word.significance !== Significance.Red || !roomData.redMove && word.significance !== Significance.Blue) {
			roomData.redMove = !roomData.redMove;
		}

		return axios.put(`/rooms/${roomId}`, roomData, {
			headers: { 'Content-Type': 'application/json' }
		});
	},

	async selectTeam(roomId: string, user: IUser, isReadTeam: boolean, isCaptain: boolean) {
		const room = await this.getRoom(roomId);
		const roomData = room.data as IRoom;

		if (roomData.players.map(x => x.user.id).includes(user.id)) {
			roomData.players = roomData.players.filter(x => x.user.id !== user.id);
		}

		const newPlayer = {} as IPlayer;
		newPlayer.user = user;
		newPlayer.isCaptain = isCaptain;
		newPlayer.isRedTeam = isReadTeam;
		roomData.players.push(newPlayer);

		return axios.put(`/rooms/${roomId}`, roomData, {
			headers: { 'Content-Type': 'application/json' }
		});
	},

	async createRoom(roomName: string) {
		const words = [] as IWord[];
		const exceptions = [] as number[];
		const blackNumber = this.generateRandom(exceptions);
		const redNumbers = [] as number[];
		const blueNumbers = [] as number[];
		for (let i = 0; i < 9; i++){
			redNumbers.push(this.generateRandom(exceptions));
		}

		for (let i = 0; i < 8; i++){
			blueNumbers.push(this.generateRandom(exceptions));
		}
		const createdWords = [] as string[];
		for (let i = 0; i < 25; i++){
			let newWord = null as any;
			newWord = await this.generateWord();
			let word = newWord?.data as IWord;

			while (word?.word == null || createdWords.includes(word.word) || word.word.length > 20) {
				newWord = await this.generateWord();
				word = newWord?.data as IWord;
			}

			createdWords.push(word.word);

			words.push({
				id: i,
				word: word.word,
				significance: this.getColor(i, blackNumber, redNumbers, blueNumbers),
				checked: false
			});
		}

		const data = {
			id: v4(),
			name: roomName,
			words: words,
			finished: false,
			redWins: false,
			redMove: true,
			players: [],
			createDate: new Date()
		} as IRoom;

		return axios.post(`/rooms`, data, {
			headers: { 'Content-Type': 'application/json' },
		})
	},

	generateRandom(exceptions: number[]) {
		let random = Math.floor(Math.random() * 25);

		while (exceptions.includes(random)) {
			random = Math.floor(Math.random() * 25);
		}
		
		exceptions.push(random);
		return random;
	},

	getColor(i: number, blackNumber: number, redNumbers: number[], blueNumbers: number[]) {
		if (blackNumber === i) {
			return Significance.Black;
		} else if (redNumbers.includes(i)) {
			return Significance.Red;
		} else if (blueNumbers.includes(i)) {
			return Significance.Blue;
		}
		return Significance.White;
	}
}