<template>
  <div>
    <div class="map" :class="{'full-size': isFullSize}">
      <div class="full-size-btn" @click="isFullSize = !isFullSize">toggle full size</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import House from "../models/House";
import {ref} from "vue";

defineProps<{ houses: House[] }>()
const isFullSize = ref<boolean>(false);

const housePosition = (house: House) => {
  const ratio = isFullSize.value ? 2.5 : 1;
}


</script>

<style scoped lang="scss">
.map {
  position: relative;
  top: 0;
  right: 0;
  background-image: url('~@/assets/map.jpg');
  background-size: cover;
  width: calc(1280px * 1.115);
  height: calc(853px * 1.115);
  border-left: 2px solid #55442b;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.50);

  &.full-size {
    width: 3600px;
    height: 2400px;
  }

  .full-size-btn {
    position: absolute;
    top: 0;
    left: 0;
    color: #a58e64;
    background-color: #775f3c;
    padding: 3px;
  }
}
</style>
