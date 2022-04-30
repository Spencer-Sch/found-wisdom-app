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

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

interface SignInFormData {
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

export type AddNewWisdom = (values: FormikValues) => Promise<void>;

export type FilterDeletedItem = (
  collectionToFilter: string[],
  wisdomId: string
) => string[] | [];

export type GetNextWisdomId = (
  wisdomId: string,
  userWisdoms: string[]
) => string;

export type SubmitRegistrationForm = (values: RegisterFormData) => void;

export type SubmitSignInForm = (values: SignInFormData) => void;

export type FindSelectedWisdom = (
  userWisdoms: WisdomData[] | null,
  wisdomid: string
) => WisdomData | null;
