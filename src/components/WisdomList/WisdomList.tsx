import React from 'react';

import WisdomCard from '../WisdomCard/WisdomCard';

import './WisdomList.css';

import { DUMMY_DATA } from '../../dummy_data/dummy_data';

// type DummyDataType = {
//   DUMMY_DATA: {
//     id: string;
//     title: string;
//     date: string;
//     text: string;
//   }[]
// }

const WisdomList: React.FC = () => {
  return (
    <div>
      {DUMMY_DATA.map((item) => (
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
