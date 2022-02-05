import React, { useEffect, useState } from 'react';

import WisdomCard from '../WisdomCard/WisdomCard';

import './WisdomList.css';

interface WisdomObj {
  id: string;
  title: string;
  date: string;
  text: string;
}

const WisdomList: React.FC = () => {
  const [storedWisdoms, setStoredWisdoms] = useState<WisdomObj[]>([]);

  useEffect(() => {
    const wisdomsString: string | null = localStorage.getItem('myWisdoms');
    if (wisdomsString) {
      const wisdomsArr: WisdomObj[] = JSON.parse(wisdomsString);
      setStoredWisdoms(wisdomsArr);
    }
  }, []);

  return (
    <div>
      {storedWisdoms.map((item: WisdomObj) => (
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
