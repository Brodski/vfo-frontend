import React from 'react'
import * as GApiAuth from '../HttpRequests/GApiAuth'

export const ButtonsAuthDebug = () => {

return(
  <div>
    <h3>Common</h3>
    <button onClick={GApiAuth.authenticate}>authorize </button>
    <button onClick={GApiAuth.signOut} > Log Out </button>
    <button onClick={GApiAuth.getAuthCodeForServerSideShit} >Auth Code For Server</button>

    <div></div>
    <button onClick={GApiAuth.isHeSignedIn}> isHeSignedIn</button>
    <button onClick={GApiAuth.printShit}> print shit</button>

    <div></div>
    <button onClick={GApiAuth.testAuthcode} > get your logged in profile </button>
    <button onClick={GApiAuth.testWithXML} > "Ping" server with xml </button>
  </div>
    )
}