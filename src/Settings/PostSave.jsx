import React, { useEffect, useState } from 'react';

import { Redirect } from 'react-router-dom';

const PostSave = () => {

  const [doIt, setDoIt] = useState(false)

  useEffect(() => {

    // fixes mem-leak. "To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function"
    let t = setTimeout(() => { setDoIt(true) }, 1000)
    return () => {
      clearTimeout(t)
    }
  })

  return (
    <div className='align-center'>
      {doIt ? <Redirect to='/' /> : <div className='flow-text'> Thank you! Processing request </div>}
    </div>
  )
}
export default PostSave