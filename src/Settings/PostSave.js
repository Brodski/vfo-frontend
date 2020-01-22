import React, { useState, useContext, useEffect } from 'react';

import { Redirect } from 'react-router-dom'


export const PostSave = () => {
const [doIt, setDoIt] = useState(false)
  useEffect(() => {
    let t = setTimeout(() => { setDoIt(true) } , 1000)
    return () => { //"To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function"
      clearTimeout(t)
    }
      
  })
return (
  <div className='align-center'>
    {doIt ? <Redirect to='/' /> : <div className='flow-text'> THANK YOU </div>}
  </div>
  )
}
  