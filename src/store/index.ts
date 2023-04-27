// import data from '../../public/init.json';
import House from '../models/House';
import {IPoint} from '../models/IPoint';
import { createStore } from 'vuex'

let serverURL = '';

if (process.env.VUE_APP_GITPOD_WORKSPACE_URL && process.env.VUE_APP_SERVER_PORT) {
    const appendPort = process.env.VUE_APP_SERVER_PORT + '-';
    const base = process.env.VUE_APP_GITPOD_WORKSPACE_URL;
    serverURL = [base.slice(0, 8), appendPort, base.slice(8)].join('');
    serverURL += '/api'
} else {
    serverURL = 'http://localhost:3000/api/';
}

const HOUSES = [
    {
        "id": 1,
        "name": "Lannister",
        "position": {
            "x": 260,
            "y": 470
        },
        "strength": 8,
        "flag": "lannister.png"
    },
    {
        "id": 2,
        "name": "Stark",
        "position": {
            "x": 220,
            "y": 250
        },
        "strength": 7,
        "flag": "stark.png"
    },
    {
        "id": 3,
        "name": "Targaryen",
        "position": {
            "x": 530,
            "y": 500
        },
        "strength": 9,
        "flag": "targaryen.png"
    },
    {
        "id": 4,
        "name": "Tyrell",
        "position": {
            "x": 180,
            "y": 440
        },
        "strength": 2,
        "flag": "tyrell.png"
    },
    {
        "id": 5,
        "name": "Greyjoy",
        "position": {
            "x": 110,
            "y": 380
        },
        "strength": 4,
        "flag": "greyjoy.png"
    },
    {
        "id": 6,
        "name": "White Walkers",
        "position": {
            "x": 120,
            "y": 50
        },
        "strength": 10,
        "flag": "night_king.png"
    }
];


// Vue.use(Vuex);

export interface IStore {
    kingsLandingPosition: IPoint;
    winner: House | undefined;
    houses: House[];
    updates: {
        house: House;
        steps: number;
        score: number;
    }[];
}

const store = createStore({
    state () {
        return {
            kingsLandingPosition: {x: 260, y: 470},
            winner: undefined,
            houses: [],
            updates: []
        } as IStore
    },
    getters: {
        updates: (state: IStore) => state.updates,
        latestUpdate: (state: IStore) => state.updates[state.updates.length - 1] || null,
        houses: (state: IStore) => state.houses,
        houseByName: (state: IStore) => (houseName: string) => state.houses.find(house => house.name === houseName),
        kingsLandingPosition: (state: IStore) => state.kingsLandingPosition,
        winner: (state: IStore) => state.winner
    },
    mutations: {
        setHouses(state: IStore, houses) {
            state.houses = houses;
        },
        seWinner(state: IStore, house) {
            state.winner = house;
        },
        updateHouse(state: IStore, house) {
            const i = state.houses.findIndex(item => item.id === house.id);
            if (i > -1) {
               state.houses[i] = house;
            }
        },
        createNewUpdate(state: IStore) {
            if (state.winner) {
                return;
            }
            const randHouse: House = state.houses[Math.floor(Math.random() * state.houses.length)];
            const max = 10;
            const min = 5;
            const randSteps: number = randHouse.name !== 'Lannister'
                ? Math.floor(Math.random() * (max - min) + min) * randHouse.strength : 0;
            const update = {house: randHouse, steps: randSteps, score: randSteps + 100, timestamp: Date()};
            state.updates.push(update);
        }
    },
    actions: {
        initUpdates({commit, state}) {
            (function loop() {
                const rand = Math.round(Math.random() * (1000 - 500)) + 500;
                setTimeout(function () {
                    commit('createNewUpdate');
                    if (!state.winner) loop();
                }, rand);
            }());
        },
        getHouses(context) {
            const houses: House[] = HOUSES.map((house: any) => new House(house));
            context.commit('setHouses', houses);

            return houses;
        },
        updateHouse(context, house) {
            context.commit('updateHouse', house);
        },
        setWinner(context, house) {
            context.commit('seWinner', house);
        },
    },
    modules: {},
});

export default store;