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

export function queryShelfs(userSettings) {
  console.log('userSettings')
  console.log(userSettings)
  let newCustomShelfs = []
    var shelfs = [].slice.call(document.querySelectorAll('.sh-QHack'));
    for (let i = 0; i < shelfs.length; i++) {
      console.log(`${i} ++ Shelf ++`)
      let newShelf = new CustomShelf()
      newShelf.title = shelfs[i].dataset.name
      newShelf.isSorted = (shelfs[i].dataset.issorted == 'true')

      for (let sub of shelfs[i].querySelectorAll('.sub-QHack')) {
        let idxs = _findSubIndex(sub.dataset.name, userSettings)
        let tempSub = userSettings.customShelfs[idxs.shelf_Index].fewSubs[idxs.sub_Index]
        newShelf.fewSubs.push(tempSub)
      }
      if (newShelf.fewSubs[0]) { newCustomShelfs.push(newShelf) }
    }
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
