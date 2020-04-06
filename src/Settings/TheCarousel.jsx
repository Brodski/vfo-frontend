import React from 'react';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

import Drag1 from '../Images/Tutorial/drag1-update.png';
import Drag2 from '../Images/Tutorial/drag2-update.png';
import Filt6 from '../Images/Tutorial/Filter.png';
import Order1 from '../Images/Tutorial/order2.png';
import Order2 from '../Images/Tutorial/order1.png';


  const TheCarousel = () => {
    return (
      <Carousel
        autoPlay={true}
        dynamicHeight={true}
        infiniteLoop={true}
        interval={6000}
        showArrows={true}
        showStatus={false}
        showThumbs={false}        
        useKeyboardArrows={true}        
      >
        <div>
          <img className="cara-help" src={Drag1} alt='Click & drag to order your subscriptions' />
        </div>
        <div>
          <img className="cara-help" src={Drag2} />
          {/* <p className="legend">Click & drag to order your subscriptions</p> */}
        </div>
        <div>
          <img className="cara-help" src={Filt6} />
          <p className="legend">Choose the min or max video duration</p>
        </div>
        <div>
          <img className="cara-help" src={Order1} />
          <p className="legend">Loading order </p>
        </div>
        <div>
          <img className="cara-help" src={Order2} />
          <p className="legend">Loading order </p>
        </div>
      </Carousel>
    )
  }
  export default TheCarousel