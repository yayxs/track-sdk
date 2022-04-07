<template>
  <div class="home-page">
    <div class="home-page-header center">
      <button @click="toMine">to mine</button>
    </div>
    <main></main>
    <footer class="center">
      <button @click="toAbout">to about</button>

      <!-- <a href="">to about</a> -->
    </footer>
  </div>
</template>

<script>
// @ is an alias to /src
import html2canvas from 'html2canvas'
export default {
  name: 'Home',
  components: {},
  methods: {
    toMine() {},
    toAbout() {},
    getImg() {
      html2canvas(document.getElementById('target-dom'), {
        backgroundColor: null, //画出来的图片有白色的边框,不要可设置背景为透明色（null）
        useCORS: true, //支持图片跨域
        scale: 1, //设置放大的倍数
      }).then((canvas) => {
        let img = new Image()
        img.src = canvas.toDataURL('image/jpeg')
        let a = document.createElement('a')
        a.href = canvas.toDataURL('image/jpeg')
        a.download = 'test'
        a.click()
      })
    },
  },
}
</script>

<style scoped>
.home-page {
  height: 80vh;
  display: flex;
  flex-direction: column;
}
.home-page-header {
  height: 100px;
  background-color: skyblue;
}
main {
  flex: 1;
}
footer {
  height: 80px;
  background-color: #f8f8f8;
}
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
