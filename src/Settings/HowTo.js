import React, {useState, useEffect, Fragment} from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Pic1 from './action1.jpg'
import Pic2 from './action2.jpg'
import Pic3 from './action3.webp'
import Modal from 'react-modal';

//var Carousel = require('react-responsive-carousel').Carousel;

export const HowTo = () => {

  const [isModalOpen, setIsModalOpen] = useState(false)
  useEffect(() => {
    return () => {
    }

  })
  const TheCarousel = () => {
    return(
      <div className="carousel-wrap">
        <Carousel 
          showArrows={true} 
          showStatus={false}
          showThumbs={false}
          //width=69
          dynamicHeight={true}
          useKeyboardArrows={true}
          infiniteLoop={true}
          >
          <div>
              <img src={Pic1} />
              <p className="legend">Legend 1</p>
          </div>
          <div>
              <img src={Pic2} />
              <p className="legend">Legend 2</p>
          </div>
          <div>
            <img src={Pic3} />
              <p className="legend">Legend 3</p>
          </div>
        </Carousel>
      </div>
    )
  }

  return(
    <Fragment>
        {/* Modal Trigger */}
      <div className='valign-wrapper'> 
        <a
          className="btn filt-button z-depth-0"
          onClick={() => { console.log("HI!!!"); setIsModalOpen(true);  } }
        >
          How to
        </a>
      </div>

      {/* Modal Content */}
      <Modal 
        isOpen={isModalOpen}
        onRequestClose={() => {setIsModalOpen(false)} }
        shouldCloseOnEsc={ true}
        className="Modal "
        overlayClassName="Overlay"
      >
        {/* Idk if this is hacky, but solves a mem-leak . "To fix, cancel all subscriptions and async..." */}
        {isModalOpen ? <TheCarousel/> : null }
      </Modal>
    </Fragment>
    );
  }