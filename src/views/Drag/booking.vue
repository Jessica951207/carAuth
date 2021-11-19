<template>
  <div class="outBox">
    <div class="boxCell" v-for="item in timeItems" :key="item.id">
      {{item.time}}
    </div>
    <div class="chooseBan"></div>
    <div class="chooseAllow"></div>
  </div>
</template>

<script>
export default {
  name: 'booking',
  data(){
    return{
      timeItems:[
        {
          id:7,
          time:"07:00"
        },
        {
          id:8,
          time:"08:00"
        },
        {
          id:9,
          time:"09:00"
        },
        {
          id:10,
          time:"10:00"
        },
        {
          id:11,
          time:"11:00"
        },
        {
          id:12,
          time:"12:00"
        },
        {
          id:13,
          time:"13:00"
        },
        {
          id:14,
          time:"14:00"
        },
        {
          id:15,
          time:"15:00"
        },
        {
          id:16,
          time:"16:00"
        },
        {
          id:17,
          time:"17:00"
        },
      ]
    }
  }
}
</script>

<style scoped>
.outBox{
  position: relative;
}
.boxCell{
  height: 4rem;
  border-bottom: 1px solid #bfbfbf
}
.chooseBan{
  width: 85vw;
  height: 20rem;
  background: #303133;
  /*background: #be1722;*/
  position: absolute;
  top: 0;
  right: 0;
}
.chooseAllow{
  width: 85vw;
  min-height: 2em;
  border:1px solid red;
}
</style>
