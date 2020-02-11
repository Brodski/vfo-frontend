import React, { Fragment, useState } from 'react';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import Modal from 'react-modal';

import TheCarousel from './TheCarousel.jsx';

const HowTo = () => {

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Fragment>
      {/* Modal Trigger */}
      <div className='set-howto2 valign-wrapper'>
        <i
          className="set-howto-aux  z-depth-0 material-icons"
          onClick={() => { setIsModalOpen(true); }}
        >info_outline
        </i>
      </div>

      {/* Modal Content */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => { setIsModalOpen(false) }}
        shouldCloseOnEsc={true}
        className="Modal "
        overlayClassName="Overlay"
      >
        {/* solves a mem-leak . "To fix, cancel all subscriptions and async..." */}
        <div className="cara1">
          {isModalOpen ? <TheCarousel /> : null}
        </div>
      </Modal>
    </Fragment>
  );
}
export default HowTo