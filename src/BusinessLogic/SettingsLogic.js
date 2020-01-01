import { CustomShelf } from '../Classes/User'


export function logAllShelfs() {
  var shelfs = [].slice.call(document.querySelectorAll('.subListWrapper'));
  console.log('-----------shelfs-----------')
  console.log(shelfs)

  for (let i = 0; i < shelfs.length; i++) {
    console.log(`${i} ++ Shelf ++`)
    for (let sub of shelfs[i].querySelectorAll('.sub-QHack')) {
    console.log(sub)
    console.log(sub.dataset)
    console.log(sub.id)
    console.log(sub.textContent)
    }
  } 
}



export function logIds() {
  var shelfs = [].slice.call(document.querySelectorAll('.subListWrapper'));
  console.log('----------- I D S -----------')
  console.log(shelfs)
  for (let i = 0; i < shelfs.length; i++) {
    console.log(`${i} ++ Shelf ++`)
    for (let sub of shelfs[i].querySelectorAll('.subitem')) {
      console.log(sub)
      console.log(sub.id)
    }
  }
}

export function queryShelfs(userSettings, allowEmpty = false) {
  
  let newCustomShelfs = []
  //Loop though each shelf and each item on shelf
  let shelfsQ = [].slice.call(document.querySelectorAll('.sh-QHack'));
  for (let i = 0; i < shelfsQ.length; i++) {
//    console.log(`${i} ++ Shelf ++`)
  //  console.log(shelfsQ[i].dataset)
    //Create a temp shelf 
    let tempShelf = new CustomShelf()
    tempShelf.title = shelfsQ[i].dataset.name

    tempShelf.isSorted = (shelfsQ[i].dataset.issorted == 'true')

    for (let sub of shelfsQ[i].querySelectorAll('.sub-QHack')) {
      //console.log(`${i} -----> sub `)
    //  console.log(sub)
      //console.log(sub.dataset)
      let idxs = _findSubIndex(sub.dataset.name, userSettings)
      let tempSub = userSettings.customShelfs[idxs.shelf_Index].fewSubs[idxs.sub_Index]
      tempShelf.fewSubs.push(tempSub)
    }
    if (allowEmpty) {                                     //true => push
      newCustomShelfs.push(tempShelf)
    } else if (tempShelf.fewSubs[0] && !allowEmpty) {     // yes && !true
                                                         // no  && !true
                                                         // yes && !false => push
                                                         // no  && !false
       newCustomShelfs.push(tempShelf)
    }
  }
  console.log("\n\\nEND OF QURERY\n\n")
  //console.log(newCustomShelfs)
  return newCustomShelfs
}

function _findSubIndex(chName, userSettings) {
  let sub_Index, shelf_Index = 0;
  for (let sh of userSettings.customShelfs) {
    sub_Index = sh.fewSubs.findIndex(s => s.channelName == chName) 
    if (sub_Index > -1) { break }
    shelf_Index += 1;
  }
  return { shelf_Index, sub_Index }
}
