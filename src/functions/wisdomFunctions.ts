import {
  FilterDeletedItem,
  GetNextWisdomId,
  HandleEdit,
} from '../models/models';

import { v4 as uuidv4 } from 'uuid';

import { format } from 'date-fns';

import { WisdomObj, BuildNewWisdom } from '../models/models';

export const getNextWisdomId: GetNextWisdomId = (wisdomId, userWisdoms) => {
  let nextWisdomId = '';
  const currentWisdomIdx = userWisdoms.indexOf(wisdomId);

  if (currentWisdomIdx === userWisdoms.length - 1) {
    nextWisdomId = userWisdoms[0];
  } else {
    nextWisdomId = userWisdoms[currentWisdomIdx + 1];
  }

  return nextWisdomId;
};

export const filterDeletedItem: FilterDeletedItem = (
  collectionToFilter,
  wisdomId
) => collectionToFilter.filter((item) => item !== wisdomId);

// const updateLocalStorage = (filteredWisdoms: WisdomObj[]) => {
//   if (filteredWisdoms.length > 0) {
//     localStorage.setItem('myWisdoms', JSON.stringify(filteredWisdoms));
//   } else {
//     localStorage.setItem('myWisdoms', JSON.stringify([]));
//   }
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

export const buildNewWisdom: BuildNewWisdom = (values, username) => {
  const newWisdom: WisdomObj = {
    createdBy: username,
    wisdomData: {
      ...values,
      source: values.source === '' ? 'unknown' : values.source,
      date: format(new Date(), 'MMM dd, yyyy'),
      id: uuidv4(),
    },
  };
  return newWisdom;
};
