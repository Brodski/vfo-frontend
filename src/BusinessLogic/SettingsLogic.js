/* eslint-disable no-restricted-syntax */
import CustomShelf from "../Classes/CustomShelf";

function _findSubIndex(chName, userSettings) {
  let subIndex;
  let shelfIndex = 0;

  for (let sh of userSettings.customShelfs) {
    subIndex = sh.fewSubs.findIndex(s => s.channelName === chName);
    if (subIndex > -1) {
      break;
    }
    shelfIndex = shelfIndex + 1;
  }
  return { shelfIndex, subIndex };
}

export function queryShelfs(userSettings, allowEmpty = false) {
  
  // Loop though each shelf and each item on shelf
  let newCustomShelfs = [];
  let shelfsQ = [].slice.call(document.querySelectorAll(".sh-QHack"));
  for (let i = 0; i < shelfsQ.length; i = i + 1) {
    let tempShelf = new CustomShelf();
    tempShelf.title = shelfsQ[i].dataset.name;
    tempShelf.isSorted = shelfsQ[i].dataset.issorted == "true"; // keep "=="

    for (let sub of shelfsQ[i].querySelectorAll(".sub-QHack")) {
      let idxs = _findSubIndex(sub.dataset.name, userSettings);
      let tempSub = userSettings.customShelfs[idxs.shelfIndex].fewSubs[idxs.subIndex];
      tempShelf.fewSubs.push(tempSub);
    }
    if (allowEmpty) {
      newCustomShelfs.push(tempShelf);
    } else if (tempShelf.fewSubs[0] && !allowEmpty) {
      newCustomShelfs.push(tempShelf);
    }
  }
  return newCustomShelfs;
}