import { FormikValues } from '../models/FormikValues.model';
import { HandleEditArgs } from '../models/HandleEditArgs.model';
import { WisdomObj } from '../models/WisdomObj.model';

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
  setShowEdit,
}: HandleEditArgs) => {
  storedWisdoms.forEach((item) => {
    // also grab index
    if (item.id === wisdomid) {
      // store index of correct item
      item.text = values.text;
      item.source = values.source === '' ? 'unknown' : values.source;
    } // after editing the item, find that item (using the index) in the array and replace just that one item? This instead of re-uploading the entire array of wisdoms
  });
  ///////////////////////
  // update storedWisdsoms
  console.log(storedWisdoms);
  ///////////////////////
  // OLD CODE
  // localStorage.setItem('myWisdoms', JSON.stringify(storedWisdoms));
  ///////////////////////
  setShowEdit(false);
};
