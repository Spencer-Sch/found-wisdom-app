import { IonLoading } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { useAuth } from '../../contexts/AuthContext';
import { fetchCurrentWisdom } from '../../actions/firebaseActions';
import WisdomPage from './WisdomPage';
import { WisdomData } from '../../models/models';

import styles from './wisdomPage.module.css';

const WisdomPageWrapper: React.FC = () => {
  const { wisdomid }: { wisdomid: string } = useParams();
  const { currentUser } = useAuth();
  const [currentWisdom, setCurrentWisdom] = useState<WisdomData | null>(null);

  useEffect(() => {
    // console.log('WisdomPageWrapper useEffect running...');

    if (!currentUser) {
      // improve error handeling!!!
      console.error(
        'from useEffect in WisdomPageWrapper: currentUser is null!'
      );
      return;
    }

    if (!currentWisdom) {
      getSelectedWisdom();
    }

    async function getSelectedWisdom() {
      const returnedWisdom = await fetchCurrentWisdom(wisdomid);
      setCurrentWisdom(returnedWisdom);
    }
  }, [currentUser, currentWisdom, wisdomid]);

  const passingData = currentWisdom
    ? {
        currentWisdom,
        setCurrentWisdom,
      }
    : null;

  return currentWisdom ? (
    <WisdomPage passingData={passingData!} />
  ) : (
    // further error handeling???
    // add a timer to time out and kick back to home page?
    <IonLoading
      isOpen={true}
      spinner="lines-sharp"
      cssClass={styles.my_custom_spinner}
      message="WisdomPageWrapper -> loading WisdomPage..."
    />
  );
};

export default WisdomPageWrapper;
