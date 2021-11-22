let timeArr = []
for(let val = 0; val < 24; val++){
  timeArr.push([[val*30-15, (val)*30+15], val*30])
}
const timeMap = new Map(timeArr)


let timeItems = []
for(let i = 7 ; i < 22; i++){
  timeItems.push(
    {
      id:i,
      time: i < 10 ? `0${i}:00` : `${i}:00`,
      top:60 * (i - 7),
      show:true
    },
    {
      id:i+0.5,
      time: i < 10 ? `0${i}:30` : `${i}:30`,
      top:60 * (i - 7) + 30,
      show:false
    }
  )
}
console.log(timeItems)

export {timeMap,timeItems}
