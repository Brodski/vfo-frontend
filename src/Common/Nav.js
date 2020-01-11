import React,  { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom'
import * as Common from  '../BusinessLogic/Common';
import GoogleButton from 'react-google-button'
import  * as GApiAuth                   from '../HttpRequests/GApiAuth';


//class Nav extends React.Component {
//const Nav = async () => {
const Nav = () => {
  useEffect(() => {
    renderButton()
  })

  async function something() {
    while (!window.gapi.signin2) {
      await Common.sleep(5000)
      console.log('damn')
      console.log('damn')
      console.log('damn')
    }
}

  async function renderButton() {
    await GApiAuth.getGoogleAuth() 
    await something()
    window.gapi.signin2.render('my-signin2', {
      //'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    })
  }
  // gRender = async () => {
  // await Common.sleep(5000)
  // console.log('damn')
  // console.log('damn')
  // console.log('damn')
  // console.log('damn')
  // console.log('damn')
  // console.log('damn')
  // console.log('damn')
  //}

  const baseStyle2 = {
    height: '50px',
    width: '240px',
  }

  //render() {
    return (
      <nav >
      
        <ul>
          <li> <Link to='/'> Home </Link> </li>

          <li> <Link to='/youtube'> youtube </Link> </li>

          <li> <Link to='/settings2'> Settings2 </Link> </li>
          <li> <GoogleButton
            label='Signccccz in with Google'
            type="dark"
            disabled={false}
            onClick={() => { console.log('Google button clicked') }}
            style={baseStyle2}
        /> </li>

          <div id="my-signin2"></div>
          <div></div>
        </ul>
         
        
      </nav>
    );
  }
//}
export default Nav;
