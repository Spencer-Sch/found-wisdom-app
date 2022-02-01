import React from 'react';

import WisdomCard from '../WisdomCard/WisdomCard';

import './WisdomList.css';

interface ItemsProps {
  items: { id: string; title: string; date: string; text: string }[];
}

const WisdomList: React.FC<ItemsProps> = (props) => {
  return (
    <div>
      {props.items.map((item) => (
        <WisdomCard
          key={item.id}
          id={item.id}
          title={item.title}
          date={item.date}
          text={item.text}
        />
      ))}
    </div>
  );
};

export default WisdomList;
