<template>
  <div class="mine-page">
    <h3>我的</h3>
    <div
      class="add-car center"
      :tracker-key="JSON.stringify(customData)"
      @click="addCar"
    >
      添加车辆
    </div>
  </div>
</template>

<script>
export default {
  name: 'Mine',
  data() {
    return {
      customData: {
        name: '1',
      },
    }
  },
  methods: {
    addCar() {},
  },
}
</script>

<style scoped>
.add-car {
  height: 100px;
  border-radius: 20px;
  background-color: beige;
}
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
