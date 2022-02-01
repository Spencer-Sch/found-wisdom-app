import React from 'react';

import WisdomCard from '../WisdomCard/WisdomCard';

import './WisdomList.css';

const WisdomList: React.FC = () => {
  return (
    <div>
      <WisdomCard />
      <WisdomCard />
      <WisdomCard />
      <WisdomCard />
      <WisdomCard />
    </div>
  );
};

export default WisdomList;
