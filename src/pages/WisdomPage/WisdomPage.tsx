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

  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [storedWisdoms, setStoredWisdoms] = useState<WisdomObj[]>(
    getStoredWisdoms()
  );

  const currentWisdom = storedWisdoms.find((wisdom) => wisdom.id === wisdomid)!;

  const handleDelete = () => {
    setShowModal(true);
  };

  const deleteWisdom = () => {
    //////////////////////////////////////////
    // REFACTOR!!!!!
    //////////////////////////////////////////
    if (currentWisdom.next === true && storedWisdoms.length > 1) {
      let nextWisdom: WisdomObj;
      const editedState = [...storedWisdoms];

      const currentWisdomIdx = storedWisdoms.indexOf(currentWisdom);

      if (currentWisdomIdx === storedWisdoms.length - 1) {
        nextWisdom = {
          ...storedWisdoms[0],
          next: true,
        };
        editedState[0] = { ...nextWisdom };
      } else {
        nextWisdom = {
          ...storedWisdoms[currentWisdomIdx + 1],
          next: true,
        };
        editedState[currentWisdomIdx + 1] = { ...nextWisdom };
      }
      // localStorage.setItem('myWisdoms', JSON.stringify(editedState));
      const filteredWisdoms = editedState.filter(
        (item) => item.id !== wisdomid
      );
      if (filteredWisdoms.length > 0) {
        localStorage.setItem('myWisdoms', JSON.stringify(filteredWisdoms));
      } else {
        localStorage.setItem('myWisdoms', JSON.stringify([]));
      }
      setStoredWisdoms(editedState);
      setShowModal(false);
      window.location.replace(`/`);
    } else {
      const filteredWisdoms = storedWisdoms.filter(
        (item) => item.id !== wisdomid
      );
      if (filteredWisdoms.length > 0) {
        localStorage.setItem('myWisdoms', JSON.stringify(filteredWisdoms));
      } else {
        localStorage.setItem('myWisdoms', JSON.stringify([]));
      }
      setShowModal(false);
      window.location.replace(`/`);
    }
  };

  const handleEdit = (values: FomikValues) => {
    storedWisdoms.forEach((item) => {
      if (item.id === wisdomid) {
        item.text = values.text;
        item.source = values.source;
      }
    });
    localStorage.setItem('myWisdoms', JSON.stringify(storedWisdoms));
    setShowEdit(false);
  };

  return (
    <IonPage>
      {!showEdit && (
        <WisdomView
          showModal={showModal}
          setShowEdit={setShowEdit}
          handleDelete={handleDelete}
          deleteWisdom={deleteWisdom}
          setShowModal={setShowModal}
          currentWisdom={currentWisdom}
        />
      )}
      {showEdit && (
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
