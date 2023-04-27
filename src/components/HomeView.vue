<template>
  <div class="container">

    <div class="side-panel">
      <h1>Score Board</h1>
      <div v-for="house in housesByScore" class="score-board center">
        <div class="center" :class="house.name === winner?.name ? 'bold' : ''">
          <img :src="require(`@/assets/${house.flag}`)">
          <span>{{ house.name }}</span>
        </div>
        <span>{{ house.score }}</span>
      </div>


      <div class="mt-20">
        <h2>Updates</h2>
        <div v-for="update in updates">
          {{ update.house.name }} travelled <span class="bold">{{ update.steps }}</span> steps
        </div>
      </div>
    </div>

    <world-map :houses="houses"></world-map>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, watch} from "vue";
import House from "@/models/House";
import {IPoint} from "@/models/IPoint";
import WorldMap from "@/components/WorldMap.vue";
import {useStore} from "vuex";
import {IUpdate} from "@/models/IUpdate";

const store = useStore()

onMounted(() => {
  store.dispatch('initUpdates');
  store.dispatch('getHouses');
});

/**
 * watch for updates
 * TODO: move houses according to updates.
 * @param latestUpdate
 */
watch(() => store.getters.latestUpdate, () => {
  // console.log('new update detected:', store.getters.latestUpdate.house);
  onNewUpdate(store.getters.latestUpdate);
})
const onNewUpdate = (latestUpdate: IUpdate) => {
  let house: House = store.getters.houseByName(latestUpdate.house.name);
  if (house.name === "Lannister") {
    house.score = latestUpdate.score;
    store.dispatch("updateHouse", house);
    return;
  }
  house.score = latestUpdate.score;
  house.position = calcNewPosition(
      house.position.x,
      house.position.y,
      store.getters.kingsLandingPosition.x,
      store.getters.kingsLandingPosition.y,
      latestUpdate.steps
  )
  store.dispatch("updateHouse", house);
  if (house.position.x === store.getters.kingsLandingPosition.x &&
      house.position.y === store.getters.kingsLandingPosition.y) {
    const winner = calcWinner(house);
    store.dispatch("setWinner", winner);
    alert(winner.name + " is the winner!");
  }
}

/**
 * TODO: calculate the new position
 * @param x1 house x position
 * @param y1 house y position
 * @param x2 destination x position
 * @param y2 destination y position
 * @param length number of steps towards destination
 */
const calcNewPosition = (x1: number, y1: number, x2: number, y2: number, length: number): IPoint => {
  const xDist = x2 - x1;
  const yDist = y2 - y1;
  const dist = Math.sqrt(xDist * xDist + yDist * yDist);

  const fractionOfTotal = length / dist;


  const newPosition = {x: Math.round(x1 + xDist * fractionOfTotal), y: Math.round(y1 + yDist * fractionOfTotal)}

  // Check if the new position is beyond the destination
  if (x1 < x2 && newPosition.x > x2 || x1 > x2 && newPosition.x < x2) {
    return {x: x2, y: y2};
  } else {
    return newPosition;
  }
};

/**
 * TODO: calculate the winner
 * @param house the house fighting the Lannisters
 */
const calcWinner = (house: House): House => {
  const Lannister = store.getters.houseByName("Lannister");
  return house.score > Lannister.score ? house : Lannister;
}

/* ------ STORE GETTERS ------ */
const houses = computed((): House[] => {
  return store.getters.houses;
});

const housesByScore = computed((): House[] => {
  return store.getters.houses.sort((a: House, b: House) => b.score - a.score);
});

const updates = computed(() => {
  return store.getters.updates;
});

const winner = computed(() => {
  return store.getters.winner;
});

const latestUpdate = computed(() => {
  return store.getters.latestUpdate;
});

const kingsLandingPosition = computed((): IPoint => {
  return store.getters.kingsLandingPosition;
});
</script>

<style lang="scss">
$map-width: calc(1280px * 1.115);
.score-board {
  padding: 10px;
  border-bottom: 1px solid #55442b;

  img {
    width: 30px;
  }
}

.center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.container {
  display: flex;

  .side-panel {
    padding: 20px;
    min-width: 360px;
    width: calc(100% - #{$map-width} - 40px);
    text-align: left;

    ul {
      list-style: none;

      li {
        padding: 5px;
      }
    }

    ul.updates {

    }
  }
}
</style>
