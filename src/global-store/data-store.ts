import { UserActions } from './store.models';

import { initStore } from './store';

export const actionsSource: UserActions = {
  // global-store steps:
  // where will FETCH_WISDOM_DATA be dispatched from?
  FETCH_WISDOM_DATA: (curState: any, currentUser: any) => {
    // TODO: fetch data from firestore and put into the local store under 'storedWisdoms'???

    // global-store steps:
    // call getDataToDisplay function from Home.tsx useEffect (export function to an actions file)
    // CODE SKETCH:
    // const userWisdoms = getDataToDisplay(currentUser!.displayName!);
    // const updatedState = { ...curState, storedWisdoms: userWisdoms }
    console.log('FETCH_WISDOM_DATA dispatch', curState, currentUser);

    // return updatedState;
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
