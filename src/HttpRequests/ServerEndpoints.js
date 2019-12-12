import axios from 'axios';
import { Subscription } from '../Classes/Subscription';
import { User, CustomShelf } from '../Classes/User';


export async function getDummyUser() {

  return "this is dummy user from backend, after a post to localhost"

}

export function getMockUser() {
  let sub1 = new Subscription()
  sub1.channelName = "The Hill"
  sub1.channelId = "UCPWXiRWZ29zrxPFIQT7eHSA";

  let sub1B = new Subscription()
  sub1B.channelName = "CNN"
  sub1B.channelId = "UCupvZG-5ko_eiXAupbDfxWw";

  let sub1C = new Subscription()
  sub1C.channelName = "Fox News"
  sub1C.channelId = "UCXIJgqnII2ZOINSWNOGFThA";

  let sub2 = new Subscription()
  sub2.channelName = "Crunkmastaflexx"
  sub2.channelId = "UCA-8h5uCH5RE-1r6gskkbTw";

  let sub3 = new Subscription()
  sub3.channelName = "Deep Beat"
  sub3.channelId = "UC0CeYMTh57zSsbUKhsyOPfw";

  let sub4 = new Subscription()
  sub4.channelName = "Video Box"
  sub4.channelId = "UCeMFHOzX9MDWbr-pu2WdmVw";

  let sub5 = new Subscription()
  sub5.channelName = "mineralblue"
  sub5.channelId = "UC3IngBBUGFUduHp-7haK1lw";

  let sub6 = new Subscription()
  sub6.channelName = "SMTOWN"
  sub6.channelId = "UCEf_Bc-KVd7onSeifS3py9g";

  let u = new User()
  u.userId = "123-UserId";
  u.fullName = "Richard Simmons"
  u.subscriptions.push(sub1, sub1C, sub1B, sub2, sub3, sub4, sub5, sub6)
  

  let cShelf1 = new CustomShelf()
  cShelf1.title = "Shelf #1"
  cShelf1.fewSubs.push(sub1, sub1B, sub1C)
  
  let cShelf2 = new CustomShelf()
  cShelf2.title = "Shelf #2"
  cShelf2.fewSubs.push(sub3, sub6)

  u.customShelfs.push(cShelf1)
  u.customShelfs.push(cShelf2)

  return u;
}