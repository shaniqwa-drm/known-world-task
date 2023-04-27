<template>
  <div class="container">

    <div class="side-panel">
      <h1>Score Board</h1>


      <div class="mt-20">
        <h2>Updates</h2>
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
  console.log(houses.value);
  store.dispatch('initUpdates');
  store.dispatch('getHouses');
});

/**
 * watch for updates
 * TODO: move houses according to updates.
 * @param latestUpdate
 */
watch(() => store.getters.latestUpdate, () => {
  console.log('new update detected:', store.getters.latestUpdate.house);
})
const onNewUpdate = (latestUpdate: IUpdate) => {
	return;
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
  return {x: 0, y: 0}
}

/**
 * TODO: calculate the winner
 * @param house the house fighting the Lannisters
 */
const calcWinner = (house: House): House => {
  return new House();
}

/* ------ STORE GETTERS ------ */
const houses = computed((): House[] => {
  return store.getters.houses;
});

const getHouseByName = (name: string): House => {
  return store.getters.houseByName(name);
}

const updates = computed(() => {
  return store.getters.updates;
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
