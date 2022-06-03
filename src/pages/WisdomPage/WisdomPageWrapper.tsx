import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { IonLoading } from '@ionic/react';

import WisdomPage from './WisdomPage';
import { findSelectedWisdom } from '../../functions/wisdomFunctions';
import { useAuth } from '../../contexts/AuthContext';
import { useWisdomStore } from '../../contexts/WisdomStoreContext';
import { WisdomData } from '../../models/models';

import styles from './wisdomPage.module.css';

const WisdomPageWrapper: React.FC = () => {
  const [currentWisdom, setCurrentWisdom] = useState<WisdomData | null>(null);
  const { userWisdoms, fetchWisdomData } = useWisdomStore();
  const { currentUser } = useAuth();
  const { wisdomid }: { wisdomid: string } = useParams();

  useEffect(() => {
    if (!currentUser) {
      // TODO: improve error handeling!!!
      console.error(
        'from useEffect in WisdomPageWrapper: currentUser is null!'
      );
      return;
    }

    if (!userWisdoms) {
      // if the app is directed to /wisdom/id123 before the home component is rendered
      // OR if the app is on /wisdom/id123 and the page is reloaded.
      currentUser.displayName
        ? fetchWisdomData!(currentUser.displayName)
        : console.error(
            // TODO: improve error handeling!!!
            'WisdomPageWrapper.tsx -> useEffect: currentUser.displayName is not present.'
          );
    }

    if (userWisdoms && !currentWisdom) {
      // Searches for selected wisdom in local WisdomStoreContext
      const returnedWisdom = findSelectedWisdom(userWisdoms, wisdomid);
      setCurrentWisdom(returnedWisdom);
    }
  }, [currentUser, currentWisdom, wisdomid, userWisdoms, fetchWisdomData]);

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
