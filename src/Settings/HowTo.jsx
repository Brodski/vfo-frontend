import React, {Fragment, useState} from 'react';

import { Carousel } from 'react-responsive-carousel';
import Modal from 'react-modal';

import Drag1 from '../Images/Tutorial/drag3.png';
import Drag2 from '../Images/Tutorial/drag-sub2.png';
import Filt6 from '../Images/Tutorial/tut-filt-combo2.png';
import Order1 from '../Images/Tutorial/order2.png';
import Order2 from '../Images/Tutorial/notice-with-arrow.png';


const HowTo = () => {

  const [isModalOpen, setIsModalOpen] = useState(false)

  const TheCarousel = () => {
    return(
      // <div className="carousel-wrap ">
      <Carousel 
        showArrows={true} 
        showStatus={false}
        showThumbs={false}
        
        dynamicHeight={true}
        useKeyboardArrows={true}
        infiniteLoop={true}
      >
        <div>
          <img className="cara-help" src={Drag2} />            
          <p className="legend">Click & drag to order your subscriptions</p>
        </div>
        <div>
          <img className="cara-help" src={Drag1} />
          <p className="legend">Click & drag to order your subscriptions</p>
        </div>
        <div>
          <img className="cara-help" src={Filt6} />
          <p className="legend">Choose the min or max of a subscription's videos</p>
        </div>
        <div>
          <img className="cara-help" src={Order1} />
          <p className="legend">Loading order - right side first</p>
        </div>
        <div>
          <img className="cara-help" src={Order2} />
          <p className="legend">Loading order </p>
        </div>
      </Carousel>
    // </div>
    )
  }

  return(
    <Fragment>
      {/* Modal Trigger */}
      <div className='set-howto2 valign-wrapper'> 
        <i
          className="set-howto-aux  z-depth-0 material-icons"
          onClick={() => { setIsModalOpen(true);  }}
        >info_outline
        </i>
        
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
        {isModalOpen ? <TheCarousel /> : null }
      </Modal>
    </Fragment>
    );
  }
  export default HowTo