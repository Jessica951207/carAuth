<template>
  <div class="booking">
    <div class="navTop">
      <van-nav-bar
        title=""
        left-text=""
        left-arrow
        @click-left="onClickLeft"
        class="navBar"
      />
      <div class="navTitle">
        <div class="detailItem">
          <div class="blockItem blockOne"></div>
          <span>深圳嘉里营业部</span>
        </div>
        <div class="detailItem">
          <div class="blockItem blockTwo"></div>
          <span>2021-11-17 08:00-11:00</span>
        </div>
        <div class="detailItem">
          <div class="blockItem blockThree"></div>
          <span>会议室1</span>
        </div>
<!--        <img src="./src/assets/calendar.png" alt="">-->
<!--        <img :src="calendarIcon" alt="">-->
        <div class="circleButton" @click="showTimePicker"></div>
      </div>
    </div>
    <div class="marginGrey"></div>
    <div class="dragTimeBlock">
      <div class="timeContainer" @click="createComp">
        <div class="timeCell" v-for="(item,index) in timeItems" :key="item.id" :style="{top: item.top + `px` }">
          <span class="timeMoment" v-if="item.show">{{item.time}}</span>
          <div class="line" v-if="item.show"></div>
        </div>
      </div>
      <div class="container" >
        <drag-resize class="resizable" ref="resizableComponent"
                     :dragSelector="dragSelector"
                     :active="handlers" :fit-parent="fit" :maximize="maximize"
                     :max-width="checkEmpty(maxW)" :max-height="checkEmpty(maxH)"
                     :min-width="checkEmpty(minW)" :min-height="checkEmpty(minH)"
                     :width="width" :height="height" :blockArray="blockArray"
                     :left="left" :top="top"
                     @mount="eHandler"
                     @resize:move="eHandler" @resize:start="eHandler" @resize:end="eHandler"
                     @drag:move="eHandler" @drag:start="eHandler" @drag:end="eHandler" @maximize="eHandler"
        >
          <div class="block">
            <!--          <div class="drag-container-1"><span>drag_1</span></div>-->
            <div class="table-container">
              Reserve {{this.startTime}} - {{this.endTime}}
<!--              <table>-->
<!--                <tr>-->
<!--                  <td>开始时间：{{this.startTime}}</td>-->
<!--                  &lt;!&ndash;                <td>width:{{ width }}</td>&ndash;&gt;-->
<!--&lt;!&ndash;                  <td>height:{{ height }}</td>&ndash;&gt;-->
<!--                </tr>-->
<!--                <tr>-->
<!--                  <td>结束时间：{{this.endTime}}</td>-->
<!--                  &lt;!&ndash;                <td>left:{{ left }}</td>&ndash;&gt;-->
<!--&lt;!&ndash;                  <td>top:{{ top }}</td>&ndash;&gt;-->
<!--                </tr>-->
<!--              </table>-->
            </div>
            <!--          <div class="drag-container-2">drag_2</div>-->
          </div>
        </drag-resize>
      </div>
      <div class="forbiddenBlock" v-for="(item,i) in blockArray" :style="{top: `${item[0]}px`,height:`${item[1] - item[0]}px`}">
        <p class="mettingRoom">Huawei Workshop{{item}}</p>
        <p class="mettingPerson">Helen CY Chan, Support - GTS</p>
      </div>
    </div>
    <div class="bottomPart">
      <div class="confirmButton">
        确认
      </div>
    </div>

    <van-popup
      v-model="show"
      :show="show"
      position="bottom"
      teleport="body"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title=""
        :min-date='minDate'
        :formatter="formatter"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </van-popup>

  </div>
</template>

<script>
// import VueResizable from 'vue-resizable'
import DragResize from "./dragResize";
import {timeMap,timeTopMap,timeItems} from "./contant";

export default {
  name: "drag",
  components: {DragResize },
  data() {
    const tW = 80;
    const tH = 30;
    return {
      handlers: [  'b', 't'],
      // left: `calc( 50% - ${tW / 2}px)`, top: `calc(50% - ${tH / 2}px)`,
      left: `67px`, top: `0`,
      height: tH, width: tW,
      maxW: 300, maxH: 1000,
      minW: 50, minH: 15,
      fit: true, maximize: false, event: '',
      dragSelector: ".drag-container-1, .drag-container-2,.table-container",
      timeItems:timeItems,
      startTime:"",
      endTime:"",
      blockTimeArray:[["10:15","11:00"],["14:00","16:00"],["17:00","18:00"]],
      blockArray:[],
      calendarIcon:"../assets/car.png",
      minDate:new Date(Date.now()),
      currentDate: new Date(),
      show: false
    };
  },
  computed: {
    style(){
      return{

      }
    },
  },
  watch:{
    top(newValue){
      console.log("newValue",newValue)
      // this.startTime = newValue;
    }
  },
  created() {
    // this.nowBeforeAddBlock()
  },
  mounted() {
    this.blockTimeArray.map(cur => {
      this.blockArray.push([timeTopMap.get(cur[0]),timeTopMap.get(cur[1])])
    })
    console.log("this.blockArray",this.blockArray)

    this.nowBeforeBlock()
    this.getStartAndEndTime()

  },
  methods: {
    showTimePicker(){
      this.show = true
    },
    onConfirm(value){
      console.log(value)
      this.show = false
    },
    onCancel(){
      this.show = false
    },
    formatter(type, val) {
      if (type === 'year') {
        return val + '年';
      }
      if (type === 'month') {
        return val + '月';
      }
      if (type === 'day') {
        return val + '日';
      }
      return val;
    },
    nowBeforeAddBlock(){
      let nowHour = new Date().getHours()
      let nowMin = new Date().getMinutes()
      let shouldMin
      if(nowMin > 0 && nowMin<=15){
        shouldMin = 15
      }else if(nowMin > 15 && nowMin<=30){
        shouldMin = 30
      }
      else if(nowMin > 30 && nowMin<=45){
        shouldMin = 45
      }else if(nowMin > 45 && nowMin<=60){
        shouldMin = "00";
        nowHour++;
      }
      let now = `${nowHour}:${shouldMin}`
      console.log("now",now,nowHour)

      const nowTop = (nowHour - 9 ) * 60 + shouldMin
      console.log("now  top",nowTop)

      this.top = nowTop
      if(nowHour > 9){
        this.blockTimeArray.unshift(["09:00",now])
      }
    },
    nowBeforeBlock(){
      let nowHour = new Date().getHours()
      let nowMin = new Date().getMinutes()
      let shouldMin
      if(nowMin > 0 && nowMin<=15){
        shouldMin = 15
      }else if(nowMin > 15 && nowMin<=30){
        shouldMin = 30
      }
      else if(nowMin > 30 && nowMin<=45){
        shouldMin = 45
      }else if(nowMin > 45 && nowMin<=60){
        shouldMin = "00";
        nowHour++;
      }
      let now = `${nowHour}:${shouldMin}`
      console.log("now",now,nowHour)

      const nowTop = (nowHour - 9 ) * 60 + shouldMin
      console.log("now  top",nowTop)

      this.top = nowTop
      let tempTime = nowTop
      let res = [];
      let restFlag = false
      for(let item in this.blockArray){
        const index = Number(item)
        const cur =  this.blockArray[index]
        if(tempTime <= cur[1]){
          // 判断是否在禁止区域内
          if(tempTime>=cur[0]){
            res = [[0, cur[1]]]
            restFlag = index+1
            break;
          }
          else if(tempTime <cur[0]){
            res =[[0, tempTime]]
            restFlag = index
            break;
          }
        }
        else {
          res = [[0, tempTime]]
          restFlag = false
        }
      }
      if(!!restFlag){
        for(var i =restFlag ; i<this.blockArray.length;i++){
          res = res.concat([this.blockArray[i]])
        }
      }
      this.blockArray = res
    },
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

      this.getStartAndEndTime();

      // console.log( timeMap)

    },
    checkEmpty(value) {
      return typeof value !== "number" ? 0 : value;
    },
    onClickLeft(){
      console.log("成功返回上一页")
      this.$router.go(-1);
    },
    getStartAndEndTime(){
      console.log("111111",this.top,this.height)
      let topDeal = parseInt(this.top / 15) * 15;
      this.timeItems.map(cur => {
        if(cur.top == topDeal){
          this.startTime = cur.time
        }
      })
      let bottomDeal = parseInt((this.top + this.height) / 15) * 15;
      this.timeItems.map(cur => {
        if(cur.top == bottomDeal){
          this.endTime = cur.time
        }
      })
    },
    createComp(event){
      console.log("event.pageY ",event.pageY)
      if(event.pageY <= 840){
        for (let [key, value] of timeMap){
          if(event.pageY -200 >= key[0] && event.pageY - 200 <= key[1]){
            this.height = 30
            this.top = value;
            this.getStartAndEndTime();
          }
        }
      }
    },

  },
  filters: {
    checkEmpty(value) {
      return typeof value !== "number" ? 0 : value;
    }
  },
}
</script>


<style scoped>
body, html {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: auto;
}
.bottomPart{
  width: 100%;
  height: 100px;
  position: absolute;
  top:860px;
  background: #B5B5B5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.confirmButton{
  width:180px;
  height: 50px;
  background: #E0301E;
  color: #ffffff;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.marginGrey{
  width: 100%;
  height: 40px;
  background: #F2F2F2;
}
.dragTimeBlock{
  position: relative;
}
.container {
  width: 100%;
  height: 660px;
  display: inline-block;
  /*border: 1px solid #dddddd;*/
  background: #ffffff;
  color: #333333;;
  float: left;

}

.resizable {
  background-position: top left;
  width: 150px;
  height: 150px;
  padding: 0;
  border: 2px solid #CF251D;
  background: #ffffff;
  font-weight: normal;
  color: #CF251D;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
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
  /*align-items: center;*/
}
.timeContainer{
  width: 100%;
  /*position: absolute;*/
  /*top:200px;*/
  /*left: 0;*/
}
.timeCell{
  width: 94%;
  padding: 0 3%;
  height: 15px;
  position: absolute;
  left: 0;
  background: #F2F2F2;
  display: flex;
  justify-content: center;
  align-content: center;
}
.timeMoment{
  margin-right: 5%;
  margin-top: -10px;
}
.line{
  border-top: 1px solid #bfbfbf;
  width: 100%;
  height: 1px;
}

.forbiddenBlock{
  width: 80vw;
  height: 120px;
  background: #FFCDCD;
  position: absolute;
  top: 300px;
  left: 67px;
}
.mettingRoom{
  font-size: 16px;
  color: #404041;
  margin: 5px;
}
.mettingPerson{
  font-size: 14px;
  color: #6D6E71;
  margin: 5px;
}
.block {
  height: 100%;
  width: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.navBar{
  background: #BE1722;
}
.navTop .van-nav-bar  >>> .van-icon {
  color: #F2F2F2;
}
.navTop >>> .van-nav-bar__arrow{
  font-size: 22px;
}
.navTitle{
  padding: 1rem 0;
  position: relative;
}
.detailItem{
  display: flex;
  align-content: center;
  color: #010001;
  font-size: 1rem;
}
.blockItem{
  width:33px;
  height: 24px;
  margin-right:1rem ;
}
.blockOne{
  background: #630204;
}
.blockTwo{
  background: #BB1A28;
}
.blockThree{
  background: #E0301E;
}
.circleButton{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #CF251D;
  position: absolute;
  bottom: 1rem;
  right: 1rem;
}
.booking >>> .van-picker__cancel,.booking >>> .van-picker__confirm{
  background: #CF251D;
  color: #FFFFFF;
  height: 70%;
  margin: 0 3%;
}
.booking >>> .van-picker__toolbar{
  border-bottom: 1px solid #BEBEBE;
}
</style>
