///////////////////
// INTERFACES
///////////////////

export interface FormikValues {
  source: string;
  text: string;
}

// export interface EditedWisdom {
//   wisdomData: {
//     date: string;
//     id: string;
//     next: boolean;
//     source: string;
//     text: string;
//   };
// }

export interface EditedWisdom {
  id: string;
  source: string;
  text: string;
}

export interface WisdomData {
  date: string;
  id: string;
  source: string;
  text: string;
}

export interface WisdomObj {
  createdBy: string;
  wisdomData: WisdomData;
}

export interface HandleEditArgs {
  values: FormikValues;
  currentWisdom: WisdomObj;
}

export interface UsersCollectionUserObj {
  userId: string;
  userInfo: {
    username: string;
    email: string;
    password: string;
    dateJoined: string;
  };
  wisdomCollections: {
    nextWisdomToPush: string | null;
    default: string[];
    userCreatedCategory?: string[];
  };
}

///////////////////
// TYPES
///////////////////

export type HandleEdit = (
  values: FormikValues,
  currentWisdom: WisdomData
) => WisdomData;

export type BuildNewWisdom = (
  values: FormikValues,
  username: string
) => WisdomObj;

export type CreateNewUserObj = (
  username: string,
  email: string,
  password: string
) => UsersCollectionUserObj;
