<template>
  <div>
    <div class="boxContainer">
      <div class="boxCell" v-for="(item,index) in timeItems" :key="item.id" :style="{top: item.top + `px` }">
        {{item.time}}
      </div>
    </div>
    <div class="container">
      <drag-resize class="resizable" ref="resizableComponent"
                     :dragSelector="dragSelector"
                     :active="handlers" :fit-parent="fit" :maximize="maximize"
                     :max-width="checkEmpty(maxW)" :max-height="checkEmpty(maxH)"
                     :min-width="checkEmpty(minW)" :min-height="checkEmpty(minH)"
                     :width="width" :height="height"
                     :left="left" :top="top"
                     @mount="eHandler"
                     @resize:move="eHandler" @resize:start="eHandler" @resize:end="eHandler"
                     @drag:move="eHandler" @drag:start="eHandler" @drag:end="eHandler" @maximize="eHandler"
      >
        <div class="block">
<!--          <div class="drag-container-1"><span>drag_1</span></div>-->
          <div class="table-container">
            <table>
              <tr>
                <td>开始时间：{{this.startTime}}</td>
<!--                <td>width:{{ width }}</td>-->
                <td>height:{{ height }}</td>
              </tr>
              <tr>
                <td>结束时间：{{this.endTime}}</td>
<!--                <td>left:{{ left }}</td>-->
                <td>top:{{ top }}</td>
              </tr>
            </table>
          </div>
<!--          <div class="drag-container-2">drag_2</div>-->
        </div>
      </drag-resize>
    </div>

  </div>
</template>

<script>
// import VueResizable from 'vue-resizable'
import DragResize from "./dragResize";
import {timeMap} from "./contant";

export default {
  name: "drag",
  components: {DragResize },
  data() {
    const tW = 300;
    const tH = 60;
    return {
      handlers: [  'b', 't'],
      // left: `calc( 50% - ${tW / 2}px)`, top: `calc(50% - ${tH / 2}px)`,
      left: `80px`, top: `0`,
      height: tH, width: tW,
      maxW: 300, maxH: 1000,
      minW: 100, minH: 60,
      fit: true, maximize: false, event: '',
      dragSelector: ".drag-container-1, .drag-container-2,.table-container",
      timeItems:[
        {
          id:7,
          time:"07:00",
          top:"0"
        },
        {
          id:7.5,
          time:"07:30",
          top:"30",
          hide:true
        },
        {
          id:8,
          time:"08:00",
          top:"60"
        },
        {
          id:9,
          time:"09:00",
          top:"120"
        },
        {
          id:10,
          time:"10:00",
          top:"180"
        },
        {
          id:11,
          time:"11:00",
          top:"240"
        },
        {
          id:12,
          time:"12:00",
          top:"300"
        },
        {
          id:13,
          time:"13:00",
          top:"360"
        },
        {
          id:14,
          time:"14:00",
          top:"420"
        },
        {
          id:15,
          time:"15:00",
          top:"480"
        },
        {
          id:16,
          time:"16:00",
          top:"540"
        },
        {
          id:17,
          time:"17:00",
          top:"600"
        },
      ],
      startTime:"",
      endTime:""
    };
  },
  methods: {
    eHandler(data) {
      // console.log("data",data)
      this.width = data.width;
      this.height = data.height;
      this.left = data.left;
      this.top = data.top;
      this.event = data.eventName;
      if (data.eventName === 'maximize') {
        this.maximize = data.state;
      }

      let topDeal = parseInt(data.top / 30) * 30;
      this.timeItems.map(cur => {
        if(cur.top == topDeal){
          this.startTime = cur.time
        }
      })
      let bottomDeal = parseInt((data.top + data.height) / 30) * 30;
      this.timeItems.map(cur => {
        if(cur.top == bottomDeal){
          this.endTime = cur.time
        }
      })
      // console.log("startTime",this.startTime,this.endTime)

      // console.log("**********",Math.round(data.top),Math.round(data.height));
      // if(Math.round(data.top) >= 60){
        // startTime = 7 + Math.round(data.top) / 60
        // console.log(Math.round(data.top) / 60,Math.round(data.top) / 60)
      // }else {
        // startTime = "07:" + data.top
        // console.log("startTime",startTime)
      // }
      // todo later 匹配map值
      console.log( timeMap)

    },
    checkEmpty(value) {
      return typeof value !== "number" ? 0 : value;
    }
  },
  filters: {
    checkEmpty(value) {
      return typeof value !== "number" ? 0 : value;
    }
  },
}
</script>

<style scoped>
.block {
  height: 100%;
  width: 100%;
  background-color: aqua;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
<style>
body, html {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: auto;
}

.container {
  width: 100%;
  /*width: 300px;*/
  height: 800px;
  display: inline-block;
  border: 1px solid #dddddd;
  background: #ffffff;
  color: #333333;;
  float: left;
  /*position: absolute;*/
  /*right: 0;*/
  /*top: 0;*/
}

#block1 {
  border: solid black 1px;
  height: 300px;
  width: 300px;
  display: inline-block;
  float: left;
}

.resizable {
  background-position: top left;
  width: 150px;
  height: 150px;
  padding: 0;
  border: 1px solid #003eff;
  background: #007fff;
  font-weight: normal;
  color: #ffffff;
  position: relative;
}

.table-block {
  display: table;
}

.table-row {
  display: table-row;
  text-align: center;
}

.table-cell {
  width: 50%;
  display: inline-block
}

.table-input {
  width: 50px
}

.drag-container-1, .drag-container-2 {
  width: 100%;
  height: 20px;
  background: red;
  color: white;
  text-align: center;
  cursor: pointer;
}

.table-container {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.boxContainer{
  width: 100%;
  /*position: absolute;*/
  /*top:0;*/
  /*left: 0;*/
}
.boxCell{
  width: 100%;
  height: 60px;
  border-top: 1px solid #bfbfbf;
  position: absolute;
  left: 0;
}

</style>
