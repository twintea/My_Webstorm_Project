<template>
    <div style="width:100%;">
      <aplayer :float="videoUpload.float" :autoplay="videoUpload.autoplay"
               :music="videoUpload.music"></aplayer>
    </div>
</template>

<script>
import aplayer from 'vue-aplayer'

export default {
  components: {
    aplayer
  },
  data() {
    return {
      videoUpload: {
        //progress: false,
        // progressPercent: 0,
        // successPercent: 0,
        theme: '#1387b4',
        autoplay: true,
        repeat: 'repeat-one', // 轮播模式。值可以是 'repeat-one'（单曲循环）'repeat-all'（列表循环）或者 'no-repeat'（不循环）。为了好记，还可以使用对应的 'music' 'list' 'none'
        // mini: true, // 迷你模式
        float: true, // 浮动模式。你可以在页面上随意拖放你的播放器
        fixed: true, //吸底模式
        music: { // 当前播放的音乐
          title: '重新开始',
          artist: '久石让',
          src: 'http://m10.music.126.net/20220604031336/697bee6c8a4cee918d40fda74bc4af94/ymusic/520f/0e5d/0253/ee64f8fedd9768b6c8d85922910aeba8.mp3',
          pic: 'https://p1.music.126.net/0dym_keDqAbqYlOiQmUjiw==/109951164728012307.jpg?param=130y130' // 封面图片
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
