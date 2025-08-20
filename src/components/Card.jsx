import React from 'react'
import "./Card.css"
const Card=React.memo((props) => {
  return (
    <div className="card">
      <h2 className="card-title">{props.title}</h2>
      <p className="card-number">{props.number}</p>
      <button className="card-btn" 
      onClick={props.onButtonClick}
      >
        {props.buttonName}
      </button>
    </div>
  )
}
);

export default Card;
