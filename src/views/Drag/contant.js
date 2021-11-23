let timeArr = []
for(let val = 0; val < 100; val++){
  timeArr.push([[val*15-7, (val)*15+8], val*15])
}
// console.log(timeArr)
const timeMap = new Map(timeArr)


let timeItems = []
for(let i = 7 ; i < 22; i++){
  timeItems.push(
    {
      id:i * 100,
      time: i < 10 ? `0${i}:00` : `${i}:00`,
      top:60 * (i - 7),
      show:true
    },
    {
      id:(i+0.15)* 100,
      time: i < 10 ? `0${i}:15` : `${i}:15`,
      top:60 * (i - 7) + 15,
      show:false
    },
    {
      id:(i+0.3)* 100,
      time: i < 10 ? `0${i}:30` : `${i}:30`,
      top:60 * (i - 7) + 30,
      show:false
    },
    {
      id:(i+0.45)* 100,
      time: i < 10 ? `0${i}:45` : `${i}:45`,
      top:60 * (i - 7) + 45,
      show:false
    },
  )
}

// console.log("timeItems",timeItems)

export {timeMap,timeItems}
