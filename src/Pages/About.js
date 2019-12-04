import React, { useState }from 'react';



function About() {
const [count, setCount] = useState(0)
  function handleButtonClick() {
    setCount(count + 1 )
  }
  return (
    <div>
      <h1>this is the about section</h1>
          <div> count incremented {count} times </div>
      <button onClick={handleButtonClick}>
      click me 
      </button>
  
    </div>
  );
}

export default About;