import axios from 'axios';
import  Subscription from '../Classes/Subscription';
// import { User, CustomShelf } from '../Classes/User';
import  * as GApiAuth from '../HttpRequests/GApiAuth';

const SPRING_BACKEND= 'http://' + process.env.REACT_APP_SPRINGB_DOMAIN // localhost:8080

axios.defaults.baseURL = SPRING_BACKEND;

axios.interceptors.request.use( (config) => {
  //console.log(`Request was made to ${config.url}`)  
  return config
}, error => {
  console.log("Request error")
  return Promise.reject(error)

})

axios.interceptors.response.use( (res) => {
  //console.log(`Response recieved with status ${res.status} `)  
  return res
}, error => {
  console.log('Response error')
  return Promise.reject(error)
})


export async function loginToBackend() {
  if (!GApiAuth.isHeSignedIn()) {
    console.log('User is not logged in. Returning')
    return
  }
  let idtoken = GApiAuth.getToken()
  return axios.post('/user/login', { "idtoken": idtoken })
    .then(res => {
      console.log('User login successful')
      return res
    })
    .catch(e => {
      console.log(`Axios request failed: Login ${e}`);
      return e
    })

}

export async function saveUser(user) {
  if (GApiAuth.isHeSignedIn) {
    let idtoken = GApiAuth.getToken()
    return axios.post(SPRING_BACKEND + '/user/save', { "idtoken": idtoken, "user": user })
      .then(res => {
        console.log(`User has been saved with status code ${res.status}`)
        return res
      })
      .catch(e => {
        console.log(`Axios request failed: save user ${e}`);
        return e
      })
  }
}

//https://www.npmjs.com/package/axios#handling-errors
function handleError(error) {
  if (error.response) { // response != 2xx
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) { // request sent but recieved no response
    console.log(error.request);
  } else { 
    console.log('Error', error.message);
  }
  console.log("error.config")
  console.log(error.config);
  
}