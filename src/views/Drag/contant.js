let timeArr = []
for(let val = 0; val < 100; val++){
  timeArr.push([[val*15-7, (val)*15+7], val*15])
}
const timeMap = new Map(timeArr)


var timeTopArr = []
var hour = 8,min = 0,h
for(let i = 0; i <= 44; i++){
  if(i % 4 == 0){
    hour++;
    h = hour < 10 ? `0${hour}` :hour
  }
  min = (i % 4) == 0 ? "00" : i % 4 * 15
  timeTopArr.push([`${h}:${min}`, i * 15])
}
const timeTopMap = new Map(timeTopArr)
// console.log("timeTopMap",timeTopMap)


let timeItems = []
for(let i = 9 ; i <= 20; i++){
  if(i != 20){
    timeItems.push(
      {
        id:i * 100,
        time: i < 10 ? `0${i}:00` : `${i}:00`,
        top:60 * (i - 9),
        show:true
      },
      {
        id:i* 100 + 15,
        time: i < 10 ? `0${i}:15` : `${i}:15`,
        top:60 * (i - 9) + 15,
        show:false
      },
      {
        id:i* 100 + 30,
        time: i < 10 ? `0${i}:30` : `${i}:30`,
        top:60 * (i - 9) + 30,
        show:false
      },
      {
        id:i* 100+45,
        time: i < 10 ? `0${i}:45` : `${i}:45`,
        top:60 * (i - 9) + 45,
        show:false
      },
    )
  }
  if(i == 20){
    timeItems.push(
      {
        id:i * 100,
        time: i < 10 ? `0${i}:00` : `${i}:00`,
        top:60 * (i - 9),
        show:true
      }
    )
  }
}


console.log("timeItems",timeItems)

export {timeMap,timeTopMap,timeItems}
