import React, { useEffect, useState } from 'react';
import { IonLoading } from '@ionic/react';

import UserAccount from './UserAccount';
import { useAuth } from '../../contexts/AuthContext';

import styles from './userAccountWrapper.module.css';
import { fetchUserData } from '../../actions/firebaseActions';

interface UserInfo {
  username: string;
  email: string;
  dateJoined: string;
}

const UserAccountWrapper: React.FC = () => {
  const [userInfo, setUserInfo] = useState<null | UserInfo>(null);
  const { currentUser } = useAuth();

  // reach out to firebase and pull user info to display
  useEffect(() => {
    const getUserData = async () => {
      const username = currentUser?.displayName!;
      // maybe make a new function to fetch only the user account info and not the userWisdoms
      const userData = await fetchUserData(username);
      // figure out a way not to bring down or store the user's password
      // const dataObj = {
      //   userId: userData.userId,
      //   userInfo: {

      //   }
      // }
      const userInfoData = {
        username: userData.userInfo.username,
        email: userData.userInfo.email,
        dateJoined: userData.userInfo.dateJoined,
      };
      setUserInfo(userInfoData);
    };
    getUserData();
  }, [currentUser]);

  return userInfo ? (
    <UserAccount {...userInfo} />
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
