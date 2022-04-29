import { GlobalState, UserActions } from './store.models';

import { initStore } from './store';

import { fetchUserData, fetchWisdomsById } from '../actions/firebaseActions';
import { User as FirebaseUser } from 'firebase/auth';
import { WisdomData } from '../models/models';

export const actionsSource: UserActions = {
  // global-store steps:
  // where will FETCH_WISDOM_DATA be dispatched from?
  FETCH_WISDOM_DATA: (curState, currentUser) => {
    // TODO: fetch data from firestore and put into the local store under 'storedWisdoms'???

    console.log('FETCH_WISDOM_DATA dispatch', curState, currentUser);
    let updatedState: GlobalState = {
      storedWisdoms: null,
    };
    // global-store steps:
    // call getDataToDisplay function from Home.tsx useEffect (export function to an actions file)
    // CODE SKETCH:
    const getDataToDisplay = async (
      curState: GlobalState,
      currentUserName: string
    ) => {
      const userData = await fetchUserData(currentUserName);
      const defaultCollection: string[] = userData.wisdomCollections.default;
      const userWisdoms = await fetchWisdomsById(defaultCollection);
      // const updatedState = { ...curState, storedWisdoms: userWisdoms };
      console.log('userWisdoms', userWisdoms);

      // return updatedState;
      return userWisdoms;
    };

    // const userWisdoms = getDataToDisplay(currentUser!.displayName!);
    getDataToDisplay(curState, currentUser!.displayName!).then((res) => {
      console.log('data res:', res);
      // userWisdoms = res;
      updatedState = { ...curState, storedWisdoms: res };
      console.log('updatedState:', updatedState);
    });
    if (updatedState.storedWisdoms) {
      return updatedState;
    }
  },
};

export const configureDataStore = () => {
  const actions: UserActions = { ...actionsSource };
  // const actions: UserActions = {
  //   // global-store steps:
  //   // where will FETCH_WISDOM_DATA be dispatched from?
  //   FETCH_WISDOM_DATA: (curState: any, currentUser: any) => {
  //     // TODO: fetch data from firestore and put into the local store under 'storedWisdoms'???

  //     // global-store steps:
  //     // call getDataToDisplay function from Home.tsx useEffect (export function to an actions file)
  //     // CODE SKETCH:
  //     // const userWisdoms = getDataToDisplay(currentUser!.displayName!);
  //     // const updatedState = { ...curState, storedWisdoms: userWisdoms }
  //     console.log('FETCH_WISDOM_DATA dispatch', curState, currentUser);

  //     // return updatedState;
  //   },
  // };

  initStore(actions, {
    storedWisdoms: null,
  });
};
