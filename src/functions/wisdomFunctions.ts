import { HandleEdit } from '../models/models';

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

export const handleEdit: HandleEdit = (values, currentWisdom) => {
  const editedWisdom = {
    ...currentWisdom,
    id: currentWisdom.id,
    text: values.text,
    source: values.source === '' ? 'unknown' : values.source,
  };
  return editedWisdom;
};
