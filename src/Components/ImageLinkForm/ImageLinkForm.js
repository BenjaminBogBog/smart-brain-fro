import React from "react";
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div>
      <p className='f3'>
        {'This Magic Brain will detect faces in your pictures, give it a try!'}
      </p><br />
      <p className='f5 ma0'>
        <strong>NOTE:</strong> Only 1 face can be detected.
      </p>
      <div className='center'>
        <div className='form pa4 br3 shadow-5 center'>
        <input className='f4 pa2 w-70 center' type='text' onChange={onInputChange}/>
        <button
          className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple br2'
          onClick={onButtonSubmit}
        >Detect</button>
        </div>
      </div>
    </div>
  )
}

export default ImageLinkForm;
