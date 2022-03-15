import { HandleEditArgs } from '../models/models';

// const transferNextValue = () => {
//   let nextWisdom: WisdomObj;
//   const stateCopy = [...storedWisdoms];

//   // const currentWisdomIdx = currentWisdom ? storedWisdoms.indexOf(currentWisdom) : null;
//   const currentWisdomIdx = storedWisdoms.indexOf(currentWisdom);

//   if (currentWisdomIdx === storedWisdoms.length - 1) {
//     nextWisdom = {
//       ...storedWisdoms[0],
//       next: true,
//     };
//     stateCopy[0] = { ...nextWisdom };
//   } else {
//     nextWisdom = {
//       ...storedWisdoms[currentWisdomIdx + 1],
//       next: true,
//     };
//     stateCopy[currentWisdomIdx + 1] = { ...nextWisdom };
//   }
//   return stateCopy;
// };

// const filterDeletedItem = (stateToFilter: WisdomObj[]) =>
//   stateToFilter.filter((item) => item.id !== wisdomid);

// const updateLocalStorage = (filteredWisdoms: WisdomObj[]) => {
//   if (filteredWisdoms.length > 0) {
//     localStorage.setItem('myWisdoms', JSON.stringify(filteredWisdoms));
//   } else {
//     localStorage.setItem('myWisdoms', JSON.stringify([]));
//   }
// };

// const handleDelete = () => {
//   if (currentWisdom.next === true && storedWisdoms.length > 1) {
//     const editedState = transferNextValue();
//     const filteredState = filterDeletedItem(editedState);
//     updateLocalStorage(filteredState);
//     setStoredWisdoms(filteredState);
//   } else {
//     const filteredState = filterDeletedItem(storedWisdoms);
//     updateLocalStorage(filteredState);
//   }
//   setShowDeleteModal(false);
//   window.location.replace(`/`);
// };

// export const handleEdit = (values: FormikValues) => {
export const handleEdit = ({
  values,
  storedWisdoms,
  wisdomid,
}: HandleEditArgs) => {
  //////////////////////////////
  // If I restructure the firestore collections according to Luke's suggestion then this
  // function will simply edit the currentWisdom object, return it, then another function will
  // send it to update the wisdomCollection on firestore.
  // There will be no need to iterate over storedWisdoms unless I'm going to update also update
  // storedWisdoms locally to avoid another fetch call.
  //////////////////////////////
  storedWisdoms.forEach((item) => {
    // also grab index
    if (item.id === wisdomid) {
      // store index of correct item
      item.text = values.text;
      item.source = values.source === '' ? 'unknown' : values.source;
    } // after editing the item, find that item (using the index) in the array and replace just that one item? This instead of re-uploading the entire array of wisdoms
  });
  return storedWisdoms;
};
