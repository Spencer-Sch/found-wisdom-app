import { WisdomObj, WisdomData } from '../models/models';
import { User as FirebaseUser } from 'firebase/auth';

export interface GlobalState {
  storedWisdoms: WisdomData[] | null;
}

export interface UserActions {
  FETCH_WISDOM_DATA: (
    curState: GlobalState,
    currentUser: FirebaseUser | null
  ) => GlobalState | undefined;
  // FETCH_WISDOM_DATA: (
  //   curState: GlobalState,
  //   currentUser: FirebaseUser | null
  // ) => WisdomObj[];
}
