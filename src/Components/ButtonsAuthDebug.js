import React from 'react'
import * as GApiAuth        from '../HttpRequests/GApiAuth'
import * as ytLogic         from '../BusinessLogic/ytLogic'
import * as ServerEndpoints from '../HttpRequests/ServerEndpoints'

async function debugUser(u) {
  console.log(u)
  ServerEndpoints.debugUser(u)
}

export const ButtonsAuthDebug = (props) => {
return(
  <div>
    <h3>Common</h3>
    <button onClick={GApiAuth.login}> Login </button>
    <button onClick={GApiAuth.logout} > Log Out </button>

    <div></div>
    <button onClick={() => { console.log(GApiAuth.isHeSignedIn()) }}> isHeSignedIn</button>
    <button onClick={GApiAuth.printShit}> print shit</button>
    <button onClick={GApiAuth.getProfile}> get profile</button>

    <div></div>
    <button onClick={GApiAuth.testAuthcode} > get your profile from localhost </button>
    <button onClick={GApiAuth.testWithXML} > "Ping" server with xml </button>
    <h3> More </h3>

    <button onClick={props.loadMock} >Load mock user</button>
    <button onClick={() => {console.log('numVids');     console.log(props.data.numVids) }      }>  c.log numVids     </button>
    <button onClick={() => {console.log('finalShelfs'); console.log(props.data.finalShelfs) }  }>  c.log finalShelfs </button>
    <button onClick={() => {console.log('user');        console.log(props.data.user) }         }>  c.log User        </button>
    <button onClick={() => {console.log('isLogged2');   console.log(props.data.isLogged2) }    }>  c.log isLogged2   </button>
    <button onClick={() => {console.log('pageLength');  console.log(props.data.pageLength) }   }>  c.log pageLength  </button>
    <div></div>
    <button onClick={() => {console.log('doLoginToBackend'); props.data.doLoginToBackend(); }  }> doLoginToBackend </button>
    <button onClick={() => {console.log('saveBackend'); ServerEndpoints.saveUser(props.user); }      }> saveBackend </button>
    <button onClick={() => {console.log('set Page 1');  props.data.setPageLength(1); }                    }> set Page 1 </button>
    <button onClick={() => {console.log('debugUser');   debugUser(props.user); }    }> debugUser </button>
    <div></div>
    <button onClick={ytLogic.getAllSubs}> Get All Subs  </button> 
    <button onClick={ytLogic.XXXgetActivitesOfChannels_2}> 2.0: Get All Subs, then get activites of 1 of your subs  </button>
  </div>

    )
}