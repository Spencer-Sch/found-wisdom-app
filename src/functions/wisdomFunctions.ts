import {
  AddNewWisdomToContext,
  FilterDeletedItem,
  GetNextWisdomId,
  HandleEdit,
} from '../models/models';

import { v4 as uuidv4 } from 'uuid';

import { format } from 'date-fns';

import {
  WisdomObj,
  BuildNewWisdom,
  FindSelectedWisdom,
} from '../models/models';

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

export const findSelectedWisdom: FindSelectedWisdom = (
  userWisdoms,
  wisdomid
) => {
  const matchingWisdom = userWisdoms!.filter((item) => item.id === wisdomid);
  console.log('from findSelectedWisdom - matchingWisdom:', matchingWisdom);

  return matchingWisdom[0];
};

export const addNewWisdomToContext: AddNewWisdomToContext = (
  values,
  username,
  userWisdoms,
  setUserWisdoms
) => {
  const newWisdom = buildNewWisdom(values, username);
  setUserWisdoms([...userWisdoms!, newWisdom.wisdomData]);
};
