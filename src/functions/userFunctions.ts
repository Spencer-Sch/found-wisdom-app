import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

import {
  UsersCollectionUserObj,
  CreateNewUserObj,
  UserPrivObj,
  CreateNewUserPrivObj,
  CreateNewUserPubObj,
  UserPubObj,
} from '../models/models';

export const createNewUserObj: CreateNewUserObj = (
  username,
  email,
  password
) => {
  const newUserObj: UsersCollectionUserObj = {
    userId: uuidv4(),
    userInfo: {
      username,
      email,
      password: password, // encrypt this data!!!
      dateJoined: format(new Date(), 'MMM dd, yyyy'),
    },
    wisdomCollections: {
      nextWisdomToPush: null,
      default: [],
    },
  };

  return newUserObj;
};

//////////////////////////////////////
// New functions

export const createNewUserPrivObj: CreateNewUserPrivObj = (
  email,
  password,
  username,
  uid,
  profile_img
) => {
  const user_priv_docData: UserPrivObj = {
    date_joined: format(new Date(), 'MMM dd, yyyy'),
    email,
    password,
    profile_img: profile_img ? profile_img : null,
    uid: uid ? uid : null,
    username,
  };

  return user_priv_docData;
};

export const createNewUserPubObj: CreateNewUserPubObj = (
  username,
  profile_img
) => {
  const user_pub_docData: UserPubObj = {
    date_joined: format(new Date(), 'MMM dd, yyyy'),
    profile_img: profile_img ? profile_img : null,
    username,
  };

  return user_pub_docData;
};
