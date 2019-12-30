import axios from 'axios';
import { Subscription } from '../Classes/Subscription';
import { User, CustomShelf } from '../Classes/User';
import  * as GApiAuth from '../HttpRequests/GApiAuth';

export async function getDummyUser() {

  return "this is dummy user from backend, after a post to localhost"

}

export async function createUser() {
  let idtoken = GApiAuth.getToken()
  console.log('idtoken')
  console.log(idtoken)
  axios.post('http://localhost:8080/user/create', { "idtoken": idtoken }).then(res => { logShit(res) })


}
export async function authenticate() {
  let idtoken = GApiAuth.getToken()
  console.log('idtoken')
  console.log(idtoken)
  axios.post('http://localhost:8080/user/authenticate', { "idtoken": idtoken }).then(res => { logShit(res) })
}

export async function requestUserFromDatabase() {
    //axios.post('http://localhost:8080/userDebug', { "username": newUser }).then(res => { logShit(res) })

}

function logShit(res) {
  console.log('----------------------------------------')
  console.log(`Status code: ${res.status}`);
  console.log(`Status text: ${res.statusText}`)
  console.log(`Request method: ${res.request.method}`)
  console.log(`Path: ${res.request.path}`)

  console.log(`Date: ${res.headers.date}`)
  console.log(`Date: ${res.headers}`)
  console.log(`Data: ${res.data}`)
  console.log(`Config: ${res.config}`)

  console.log(res.config);
  console.log('----------------------------------------')
}


export function getMockUser() {
  let sub1 = new Subscription()
  sub1.channelName = "The Hill"
  sub1.channelId = "UCPWXiRWZ29zrxPFIQT7eHSA";
  sub1.filter.minDuration = "1"
  sub1.filter.maxDuration = "0.5"
  sub1.filter.id = "UCPWXiRWZ29zrxPFIQT7eHSA"

  let sub1B = new Subscription()
  sub1B.channelName = "CNN"
  sub1B.channelId = "UCupvZG-5ko_eiXAupbDfxWw";
  sub1B.filter.minDuration = "2"
  sub1B.filter.maxDuration = "8"
  sub1B.filter.id = "UCupvZG-5ko_eiXAupbDfxWw"

  let sub1C = new Subscription()
  sub1C.channelName = "Fox News"
  sub1C.channelId = "UCXIJgqnII2ZOINSWNOGFThA";
  sub1C.filter.minDuration = "6"
  sub1C.filter.id = "UCXIJgqnII2ZOINSWNOGFThA"

  let sub2 = new Subscription()
  sub2.channelName = "Crunkmastaflexx"
  sub2.channelId = "UCA-8h5uCH5RE-1r6gskkbTw";
  sub2.filter.id = "UCA-8h5uCH5RE-1r6gskkbTw"

  let sub3 = new Subscription()
  sub3.channelName = "Deep Beat"
  sub3.channelId = "UC0CeYMTh57zSsbUKhsyOPfw";
  sub3.filter.id = "UC0CeYMTh57zSsbUKhsyOPfw"

  let sub4 = new Subscription()
  sub4.channelName = "Video Box"
  sub4.channelId = "UCeMFHOzX9MDWbr-pu2WdmVw";
  sub4.filter.id = "UCeMFHOzX9MDWbr-pu2WdmVw"

  let sub5 = new Subscription()
  sub5.channelName = "mineralblue"
  sub5.channelId = "UC3IngBBUGFUduHp-7haK1lw";
  sub5.filter.id = "UC3IngBBUGFUduHp-7haK1lw"

  let sub6 = new Subscription()
  sub6.channelName = "SMTOWN"
  sub6.channelId = "UCEf_Bc-KVd7onSeifS3py9g";
  sub6.filter.minDuration = "2"
  sub6.filter.maxDuration = "6"
  sub6.filter.id = "UCEf_Bc-KVd7onSeifS3py9g"

  let uSub1 = new Subscription()
  uSub1.channelName = "Key & Peele"
  uSub1.channelId = "UCdN4aXTrHAtfgbVG9HjBmxQ";
  uSub1.filter.id = "UCdN4aXTrHAtfgbVG9HjBmxQ";

  let uSub2 = new Subscription()
  uSub2.channelName = "Tommy Boy"
  uSub2.channelId = "UCnSR7_Oq-MdsZxfogsfk-Ug";
  uSub2.filter.id = "UCnSR7_Oq-MdsZxfogsfk-Ug";

  let uSub3 = new Subscription()
  uSub3.channelName = "FRONTLINE PBS | Official"
  uSub3.channelId = "UC3ScyryU9Oy9Wse3a8OAmYQ";
  uSub3.filter.id = "UC3ScyryU9Oy9Wse3a8OAmYQ";

  
  let uSub4 = new Subscription()
  uSub4.channelName = 'Google Zeitgeist'
  uSub4.channelId = 'UC522meTsOjFWjSdLLrEMMBA';
  uSub4.filter.id = "UC522meTsOjFWjSdLLrEMMBA";

  let uSub5 = new Subscription()
  uSub5.channelName = 'Maddox'
  uSub5.channelId = 'UC_c1gdsojLxBGkgzS0NsvUw';
  uSub5.filter.id = "UC_c1gdsojLxBGkgzS0NsvUw";

  let uSub6 = new Subscription()
  uSub6.channelName = 'Asian Boss'
  uSub6.channelId = 'UC2-_WWPT_124iN6jiym4fOw';
  uSub6.filter.id = "UC2-_WWPT_124iN6jiym4fOw";


  let uSub7 = new Subscription()
  uSub7.channelName = 'TED'
  uSub7.channelId = 'UCAuUUnT6oDeKwE6v1NGQxug';
  uSub7.filter.id = "UCAuUUnT6oDeKwE6v1NGQxug";


  let u = new User()
  u.id = "123-UserId";
  u.fullName = "Richard Simmons"
  //u.subscriptions.push(sub1, sub1C, sub1B, sub2, sub3, sub4, sub5, sub6)
  u.isDemo = true;
  //u.unsortedSubs.push( uSub1, uSub2, uSub3)

  let cShelf1 = new CustomShelf()
  cShelf1.title = "Shelf #1"
  cShelf1.fewSubs.push(sub1, sub1B, sub1C)
  cShelf1.isSorted = true;

  let cShelf2 = new CustomShelf()
  cShelf2.title = "Shelf #2"
  cShelf2.fewSubs.push(sub3, sub6)
  cShelf2.isSorted = true;

  let cShelf3un = new CustomShelf()
  cShelf3un.title = "Shelf #1 unsorted"
  cShelf3un.fewSubs.push( uSub1, uSub2, uSub3)
  cShelf3un.isSorted = false;

  let cShelf4un = new CustomShelf()
  cShelf4un.title = "Shelf #4"
  cShelf4un.fewSubs.push( uSub4, uSub6)
  cShelf4un.isSorted = true;
  
  let cShelf5un = new CustomShelf()
  cShelf5un.title = "Shelf #5"
  cShelf5un.fewSubs.push( uSub7)
  cShelf5un.isSorted = true;

  let cShelf6un = new CustomShelf()
  cShelf6un.title = "Shelf #6"
  cShelf6un.fewSubs.push( uSub5)
  cShelf6un.isSorted = true;

  u.customShelfs.push(cShelf1)
  u.customShelfs.push(cShelf2)
  u.customShelfs.push(cShelf3un)
  u.customShelfs.push(cShelf4un)
  u.customShelfs.push(cShelf5un)
  u.customShelfs.push(cShelf6un)
  return u;
}