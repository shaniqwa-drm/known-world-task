import House from './House';

export interface IUpdate {
	timestamp: Date;
	house: House;
	steps: number;
	score: number;
}
