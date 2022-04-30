import { IonLoading } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { useAuth } from '../../contexts/AuthContext';
// import { fetchCurrentWisdom } from '../../actions/firebaseActions';
import { findSelectedWisdom } from '../../functions/wisdomFunctions';
import WisdomPage from './WisdomPage';
import { WisdomData } from '../../models/models';

import styles from './wisdomPage.module.css';
import { useWisdomStore } from '../../contexts/WisdomStoreContext';

const WisdomPageWrapper: React.FC = () => {
  const { wisdomid }: { wisdomid: string } = useParams();
  const { currentUser } = useAuth();
  const { userWisdoms } = useWisdomStore();
  const [currentWisdom, setCurrentWisdom] = useState<WisdomData | null>(null);

  useEffect(() => {
    // console.log('WisdomPageWrapper useEffect running...');

    // Is this if check necessary? This route is already being wrapped by authGuard.
    if (!currentUser || !userWisdoms) {
      // TODO: improve error handeling!!!
      console.error(
        'from useEffect in WisdomPageWrapper: currentUser is null or userWisdoms is null!'
      );
      return;
    }

    /////////////////////////////////////
    // New Code
    if (!currentWisdom) {
      // Searches for selected wisdom in local WisdomStoreContext
      const returnedWisdom = findSelectedWisdom(userWisdoms, wisdomid);
      setCurrentWisdom(returnedWisdom);
    }
    /////////////////////////////////////
    // Old Code
    // gate the call to the server
    // if (!currentWisdom) {
    //   getSelectedWisdom();
    // }
    // searches for selected wisdom on server
    // async function getSelectedWisdom() {
    //   const returnedWisdom = await fetchCurrentWisdom(wisdomid);
    //   setCurrentWisdom(returnedWisdom);
    // }
  }, [currentUser, currentWisdom, wisdomid, userWisdoms]);
  // }, [currentUser, currentWisdom, wisdomid]);

  const passingData = currentWisdom
    ? {
        currentWisdom,
        setCurrentWisdom,
      }
    : null;

  return currentWisdom ? (
    <WisdomPage passingData={passingData!} />
  ) : (
    // TODO: further error handeling???
    // add a timer to time out and kick back to home page?
    <IonLoading
      isOpen={true}
      spinner="lines-sharp"
      cssClass={styles.my_custom_spinner}
      message="WisdomPageWrapper -> loading wisdom..."
    />
  );
};

export default WisdomPageWrapper;
