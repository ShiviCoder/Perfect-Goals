import React from 'react';
import '../../styles/InfoCards.css';
import { Link } from 'react-router-dom';


const cards = [
  {
    tag: 'Info',
    title: 'Change Profile Password',
    description: 'You can change your profile password from ',
    linkText: 'Change Password',
    link: '/change-password'
  },
  {
    tag: 'Warning',
    title: 'Do Not Disclose',
    description: 'Never share your Login Credentials with anyone.'
  },
  {
    tag: 'Workload',
    title: 'Cross Check Twice',
    description: 'Always check twice before submitting your workload to avoid any rejections.'
  }
];

const InfoCards = () => {
  return (
    <div className="card-container">
      {cards.map((card, index) => (
        <div className="card" key={index}>
          <div className={`tag ${card.tag.toLowerCase()}`}>{card.tag}</div>
          <h3>{card.title}</h3>
          <p>
            {card.description}
            {card.linkText &&  <Link to={card.link}>{card.linkText}</Link>}
          </p>
        </div>
      ))}
    </div>
  );
};

export default InfoCards;
