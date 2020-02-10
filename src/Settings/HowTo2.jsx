import React, { Fragment, useState } from 'react';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Modal from 'react-modal';

import Drag1 from '../Images/Tutorial/drag3.png';
import Drag2 from '../Images/Tutorial/drag-sub2new2.png';
import Filt6 from '../Images/Tutorial/tut-filt-combo2.png';
import Order1 from '../Images/Tutorial/order2new.png';
import Order2 from '../Images/Tutorial/notice-with-arrow.png';

const HowTo2 = () => {

  const [isModalOpen, setIsModalOpen] = useState(false)

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
          <img className="cara-helpx" src={Drag2} />
          {/* <p className="legend">Click & drag to order your subscriptions</p> */}
        </div>
        <div>
          <img className="cara-helpx" src={Drag1} />
          <p className="legend">Click & drag to order your subscriptions</p>
        </div>
        <div>
          <img className="cara-helpx" src={Filt6} />
          <p className="legend">Choose the min or max of a subscription's videos</p>
        </div>
        <div>
          <img className="cara-helpx" src={Order1} />
          <p className="legend">Loading order - right side first</p>
        </div>
        <div>
          <img className="cara-helpx" src={Order2} />
          <p className="legend">Loading order </p>
        </div>
      </Carousel>
    )
  }

  return (
    <div className="center-align cara2">
      <TheCarousel /> 
    </div>
  );
}
export default HowTo2