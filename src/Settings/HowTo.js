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
      <div className="carousel-wrap ">
        <Carousel 
          showArrows={true} 
          showStatus={false}
          showThumbs={false}
          
          dynamicHeight={true}
          useKeyboardArrows={true}
          infiniteLoop={true}
          >
          <div>
              <img src={Pic1} />
          </div>
          <div>
              <img src={Pic2} />
          </div>
          <div>
            <img src={Pic3} />
          </div>
        </Carousel>
      </div>
    )
  }

  return(
    <Fragment>
        {/* Modal Trigger */}
      <div className='set-howto2 valign-wrapper'> 
       <i className="set-howto-aux  z-depth-0 material-icons"
          onClick={() => { setIsModalOpen(true);  }}>info_outline</i>
        
        {/* <a
          className="btn filt-button z-depth-0"
          onClick={() => { setIsModalOpen(true);  } }
        >
          How to
        </a> */}
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