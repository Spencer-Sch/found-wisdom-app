import { WisdomObj } from '../models/models';
import { User as FirebaseUser } from 'firebase/auth';

export interface GlobalState {
  storedWisdoms: WisdomObj[] | null;
}

export interface UserActions {
  FETCH_WISDOM_DATA: (
    curState: GlobalState,
    currentUser: FirebaseUser | null
  ) => WisdomObj[];
}
