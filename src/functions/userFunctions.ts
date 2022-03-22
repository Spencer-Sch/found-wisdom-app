import { UsersCollectionUserObj, CreateNewUserObj } from '../models/models';

import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

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
