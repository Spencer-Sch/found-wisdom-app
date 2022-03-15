import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import WisdomView from '../../components/WisdomView/WisdomView';
import WisdomEdit from '../../components/WisdomEdit/WisdomEdit';

import { WisdomObj } from '../../models/WisdomObj.model';

import { IonPage } from '@ionic/react';

interface FomikValues {
  source: string;
  text: string;
}

const getStoredWisdoms = () => {
  const wisdomsString: string | null = localStorage.getItem('myWisdoms');
  if (wisdomsString) {
    return JSON.parse(wisdomsString);
  } else {
    return [];
  }
};

const WisdomPage: React.FC = () => {
  const { wisdomid }: { wisdomid: string } = useParams();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [storedWisdoms, setStoredWisdoms] = useState<WisdomObj[]>(
    getStoredWisdoms()
  );

  const currentWisdom = storedWisdoms.find((wisdom) => wisdom.id === wisdomid)!;

  const transferNextValue = () => {
    let nextWisdom: WisdomObj;
    const stateCopy = [...storedWisdoms];

    const currentWisdomIdx = storedWisdoms.indexOf(currentWisdom);

    if (currentWisdomIdx === storedWisdoms.length - 1) {
      nextWisdom = {
        ...storedWisdoms[0],
        next: true,
      };
      stateCopy[0] = { ...nextWisdom };
    } else {
      nextWisdom = {
        ...storedWisdoms[currentWisdomIdx + 1],
        next: true,
      };
      stateCopy[currentWisdomIdx + 1] = { ...nextWisdom };
    }
    return stateCopy;
  };

  const filterDeletedItem = (stateToFilter: WisdomObj[]) =>
    stateToFilter.filter((item) => item.id !== wisdomid);

  const updateLocalStorage = (filteredWisdoms: WisdomObj[]) => {
    if (filteredWisdoms.length > 0) {
      localStorage.setItem('myWisdoms', JSON.stringify(filteredWisdoms));
    } else {
      localStorage.setItem('myWisdoms', JSON.stringify([]));
    }
  };

  const handleDelete = () => {
    if (currentWisdom.next === true && storedWisdoms.length > 1) {
      const editedState = transferNextValue();
      const filteredState = filterDeletedItem(editedState);
      updateLocalStorage(filteredState);
      setStoredWisdoms(filteredState);
    } else {
      const filteredState = filterDeletedItem(storedWisdoms);
      updateLocalStorage(filteredState);
    }
    setShowDeleteModal(false);
    window.location.replace(`/`);
  };

  const handleEdit = (values: FomikValues) => {
    storedWisdoms.forEach((item) => {
      if (item.id === wisdomid) {
        item.text = values.text;
        item.source = values.source === '' ? 'unknown' : values.source;
      }
    });
    localStorage.setItem('myWisdoms', JSON.stringify(storedWisdoms));
    setShowEdit(false);
  };

  return (
    <IonPage>
      {!showEdit ? (
        <WisdomView
          showDeleteModal={showDeleteModal}
          setShowEdit={setShowEdit}
          handleDelete={handleDelete}
          setShowDeleteModal={setShowDeleteModal}
          currentWisdom={currentWisdom}
        />
      ) : (
        <WisdomEdit
          currentWisdom={currentWisdom}
          handleEdit={handleEdit}
          setShowEdit={setShowEdit}
        />
      )}
    </IonPage>
  );
};

export default WisdomPage;
