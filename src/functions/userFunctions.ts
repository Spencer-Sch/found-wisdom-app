import { format } from 'date-fns';

import {
  UserPrivObj,
  CreateNewUserPrivObj,
  CreateNewUserPubObj,
  UserPubObj,
} from '../models/models';

export const createNewUserPrivObj: CreateNewUserPrivObj = (
  email,
  password,
  uid,
  username,
  profile_img = ''
) => {
  const user_priv_docData: UserPrivObj = {
    date_joined: format(new Date(), 'MMM dd, yyyy'),
    email,
    password,
    profile_img,
    uid,
    username,
  };

  return user_priv_docData;
};

export const createNewUserPubObj: CreateNewUserPubObj = (
  username,
  profile_img = ''
) => {
  const user_pub_docData: UserPubObj = {
    date_joined: format(new Date(), 'MMM dd, yyyy'),
    profile_img,
    username,
  };

  return user_pub_docData;
};
