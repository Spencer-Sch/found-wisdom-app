import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

import {
  WisdomObj,
  BuildNewWisdom,
  FindSelectedWisdom,
  AddNewWisdomToContext,
  DeleteWisdomFromWisdomStore,
  FilterDeletedItem,
  GetNextWisdomId,
  HandleEdit,
  UpdateEditedWisdomInWisdomStore,
} from '../models/models';

export const getNextWisdomId: GetNextWisdomId = (wisdomId, userWisdomIds) => {
  let nextWisdomId = '';
  const currentWisdomIdx = userWisdomIds.indexOf(wisdomId);

  if (currentWisdomIdx === userWisdomIds.length - 1) {
    nextWisdomId = userWisdomIds[0];
  } else {
    nextWisdomId = userWisdomIds[currentWisdomIdx + 1];
  }

  return nextWisdomId;
};

export const filterDeletedItem: FilterDeletedItem = (
  collectionToFilter,
  wisdomId
) => collectionToFilter.filter((item) => item !== wisdomId);

export const handleEdit: HandleEdit = (values, currentWisdom) => {
  const editedWisdom = {
    ...currentWisdom,
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

export const findSelectedWisdom: FindSelectedWisdom = (
  userWisdoms,
  wisdomId
) => {
  const matchingWisdom = userWisdoms!.filter((item) => item.id === wisdomId);

  return matchingWisdom[0];
};

export const addNewWisdomToContext: AddNewWisdomToContext = (
  newWisdom,
  userWisdoms,
  setUserWisdoms
) => {
  setUserWisdoms([...userWisdoms!, newWisdom.wisdomData]);
};

export const updateEditedWisdomInWisdomStore: UpdateEditedWisdomInWisdomStore =
  (editedWisdom, userWisdoms, setUserWisdoms) => {
    userWisdoms!.forEach((item, idx) => {
      if (item.id === editedWisdom.id) {
        let userWisdomsCopy = [...userWisdoms!];
        userWisdomsCopy[idx] = { ...editedWisdom };
        setUserWisdoms(userWisdomsCopy);
      }
    });
  };

export const deleteWisdomFromWisdomStore: DeleteWisdomFromWisdomStore = (
  wisdomId,
  userWisdoms,
  setUserWisdoms
) => {
  const filteredWisdoms = userWisdoms!.filter((item) => item.id !== wisdomId);
  setUserWisdoms(filteredWisdoms);
};
