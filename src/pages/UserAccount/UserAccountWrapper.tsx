import React, { useEffect, useState } from 'react';
import { IonLoading } from '@ionic/react';

import UserAccount from './UserAccount';
import { useAuth } from '../../contexts/AuthContext';

import styles from './userAccountWrapper.module.css';
import { fetchUserPrivData } from '../../actions/firebaseActions';

interface UserPrivInfo {
  date_joined: string;
  email: string;
  profile_img: string;
  uid: string;
  username: string;
}

const UserAccountWrapper: React.FC = () => {
  const [userPrivInfo, setUserPrivInfo] = useState<null | UserPrivInfo>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (userPrivInfo) {
      return;
    }

    const getUserData = async () => {
      // reach out to firebase and pull user_priv data to display
      const uid = currentUser?.uid;

      if (!uid) {
        // TODO: improve error handeling.
        console.error(
          'error from UserAccountWrapper.tsx -> userEffect: user uid is undefined.'
        );
        return;
      }

      const userPrivData = await fetchUserPrivData(uid);

      const data: UserPrivInfo = {
        date_joined: userPrivData.date_joined,
        email: userPrivData.email,
        profile_img: userPrivData.profile_img,
        uid: userPrivData.uid,
        username: userPrivData.username,
      };
      setUserPrivInfo(data);
    };
    getUserData();
  }, [currentUser, userPrivInfo]);

  return userPrivInfo ? (
    <UserAccount {...userPrivInfo} />
  ) : (
    <IonLoading
      isOpen={true}
      spinner="lines-sharp"
      cssClass={styles.my_custom_spinner}
      message="loading account info..."
    />
    // TODO: add a timeout that will trigger an error message if loading takes longer than 30 seconds
  );
};

export default UserAccountWrapper;
