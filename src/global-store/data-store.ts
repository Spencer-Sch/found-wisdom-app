import buildOperand from '../constants/buildOperandLogic/buildOperandLogic'; // this from calc project. remove.

import { UserActions } from './store.models';

import { initStore } from './store';

export const configureDataStore = () => {
  const actions: UserActions = {
    // global-store steps:
    // where will FETCH_WISDOM_DATA be dispatched from?
    FETCH_WISDOM_DATA: (curState, currentUser) => {
      // TODO: fetch data from firestore and put into the local store under 'storedWisdoms'???

      // global-store steps:
      // call getDataToDisplay function from Home.tsx useEffect (export function to an actions file)
      // CODE SKETCH:
      // const userWisdoms = getDataToDisplay(currentUser!.displayName!);
      // const updatedState = { ...curState, storedWisdoms: userWisdoms }

      return updatedState;
    },
  };

  initStore(actions, {
    storedWisdoms: null,
  });
};
