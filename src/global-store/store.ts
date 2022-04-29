import { useState, useEffect } from 'react';

import { UserActions, GlobalState } from './store.models';

import { actionsSource } from './data-store';

///////////////////
// TYPES
///////////////////

type Dispatch = (actionIdentifier: any, payload: any) => void;
type UseStoreHook = (
  shouldListen?: boolean | undefined
) => [GlobalState, Dispatch];

// let globalState: {} | GlobalState = {};
let globalState: GlobalState = {
  storedWisdoms: null,
};
let listeners: any[] = [];
// let actions: {} | UserActions = {};
let actions: UserActions = {
  ...actionsSource,
  // FETCH_WISDOM_DATA: (curState: any, currentUser: any) => {
  //   // TODO: fetch data from firestore and put into the local store under 'storedWisdoms'???

  //   // global-store steps:
  //   // call getDataToDisplay function from Home.tsx useEffect (export function to an actions file)
  //   // CODE SKETCH:
  //   // const userWisdoms = getDataToDisplay(currentUser!.displayName!);
  //   // const updatedState = { ...curState, storedWisdoms: userWisdoms }
  //   console.log('FETCH_WISDOM_DATA dispatch');

  //   // return updatedState;
  // },
};

export const useStore: UseStoreHook = (shouldListen = true) => {
  const setState = useState(globalState)[1];

  const dispatch = (actionIdentifier: string, payload: any) => {
    /////////////////////////////
    // New Code
    // const action = Object.call(actions, actionIdentifier);
    // const newState = action(globalState, payload);
    let newState: any = {};
    switch (actionIdentifier) {
      case 'FETCH_WISDOM_DATA':
        newState = actions.FETCH_WISDOM_DATA(globalState, payload);
        break;
    }
    /////////////////////////////
    // Original code
    // const newState = actions[actionIdentifier](globalState, payload);
    /////////////////////////////

    globalState = { ...globalState, ...newState };

    console.log('globalState is:', globalState);

    for (const listener of listeners) {
      listener(globalState);
    }
  };

  useEffect(() => {
    if (shouldListen) {
      listeners.push(setState);
    }

    return () => {
      if (shouldListen) {
        listeners = listeners.filter((li) => li !== setState);
      }
    };
  }, [setState, shouldListen]);

  return [globalState, dispatch];
};

export const initStore = (
  userActions: UserActions,
  initialState: GlobalState
) => {
  if (initialState) {
    globalState = { ...globalState, ...initialState };
  }
  actions = { ...actions, ...userActions };
};

///////////////////////////////////////////////////////////////////////
// Original JS code
// import { useState, useEffect } from 'react';

// let globalState = {};
// let listeners = [];
// let actions = {};

// export const useStore = (shouldListen = true) => {
//   const setState = useState(globalState)[1];

//   const dispatch = (actionIdentifier, payload) => {
//     const newState = actions[actionIdentifier](globalState, payload);

//     globalState = { ...globalState, ...newState };

//     // console.log('globalState is:', globalState);

//     for (const listener of listeners) {
//       listener(globalState);
//     }
//   };

//   useEffect(() => {
//     if (shouldListen) {
//       listeners.push(setState);
//     }

//     return () => {
//       if (shouldListen) {
//         listeners = listeners.filter((li) => li !== setState);
//       }
//     };
//   }, [setState, shouldListen]);

//   return [globalState, dispatch];
// };

// export const initStore = (userActions, initialState) => {
//   if (initialState) {
//     globalState = { ...globalState, ...initialState };
//   }
//   actions = { ...actions, ...userActions };
// };
