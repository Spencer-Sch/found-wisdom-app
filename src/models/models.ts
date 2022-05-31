///////////////////
// INTERFACES
///////////////////

export interface FormikValues {
  source: string;
  text: string;
}

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

export interface UserPrivObj {
  date_joined: string;
  email: string;
  password: string;
  profile_img: string;
  uid: string;
  username: string;
}

export interface UserPubObj {
  date_joined: string;
  profile_img: string;
  username: string;
}

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

interface LogInFormData {
  email: string;
  password: string;
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

export type CreateNewUserPrivObj = (
  email: string,
  password: string,
  uid: string,
  username: string,
  profile_img?: string
) => UserPrivObj;

export type CreateNewUserPubObj = (
  username: string,
  profile_img?: string
) => UserPubObj;

export type AddNewWisdomToFirestore = (
  values: FormikValues,
  username: string,
  uid: string
) => Promise<void>;

export type FilterDeletedItem = (
  collectionToFilter: string[],
  wisdomId: string
) => string[] | [];

export type GetNextWisdomId = (
  wisdomId: string,
  userWisdoms: string[]
) => string;

export type SubmitRegistrationForm = (values: RegisterFormData) => void;

export type SubmitLogInForm = (values: LogInFormData) => void;

export type FindSelectedWisdom = (
  userWisdoms: WisdomData[] | null,
  wisdomid: string
) => WisdomData | null;

export type AddNewWisdomToContext = (
  values: FormikValues,
  username: string,
  userWisdoms: WisdomData[] | null,
  setUserWisdoms: React.Dispatch<React.SetStateAction<WisdomData[] | [] | null>>
) => void;

export type UpdateEditedWisdomInWisdomStore = (
  editedWisdom: WisdomData,
  userWisdoms: WisdomData[] | null,
  setUserWisdoms: React.Dispatch<React.SetStateAction<WisdomData[] | [] | null>>
) => void;

export type DeleteWisdomFromWisdomStore = (
  wisdomId: string,
  userWisdoms: WisdomData[] | null,
  setUserWisdoms: React.Dispatch<React.SetStateAction<WisdomData[] | [] | null>>
) => void;
