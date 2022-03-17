import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { IonPage } from '@ionic/react';

import WisdomView from '../../components/WisdomView/WisdomView';
import WisdomEdit from '../../components/WisdomEdit/WisdomEdit';

import { WisdomObj } from '../../models/WisdomObj.model';

import styles from './wisdomPage.module.css';

// interface FomikValues {
//   source: string;
//   text: string;
// }

// interface PropsData {
//   currentWisdom: WisdomObj;
//   storedWisdoms: WisdomObj[];
// }

// interface PropsData {
//   wisdomViewData: {
//     currentWisdom: WisdomObj;
//   };
//   wisdomEditData: {
//     currentWisdom: WisdomObj;
//     storedWisdoms: WisdomObj[];
//     wisdomid: string;
//   };
// }

interface PropsData {
  wisdomData: {
    currentWisdom: WisdomObj;
    wisdomid: string;
  };
}

// interface PassingData {
//   currentWisdom: WisdomObj;
//   storedWisdoms: WisdomObj[];
//   setShowEdit: (value: boolean) => void;
// }

// const WisdomPage: React.FC<PropsData> = ({ currentWisdom, storedWisdoms }) => {
const WisdomPage: React.FC<PropsData> = ({ wisdomData }) => {
  const [showEdit, setShowEdit] = useState(false);
  const { currentWisdom } = wisdomData;

  // const passingData: PassingData = {
  //   ...wisdomData,
  //   setShowEdit,
  // };

  return (
    <IonPage>
      {
        !showEdit ? (
          <WisdomView currentWisdom={currentWisdom} setShowEdit={setShowEdit} />
        ) : //////////////////
        // commented out for a moment
        null
        // <WisdomEdit {...wisdomData} setShowEdit={setShowEdit} />
        //////////////////
        // <WisdomEdit passingData={passingData} />
      }
      {/* {!showEdit ? (
        <WisdomView currentWisdom={currentWisdom} setShowEdit={setShowEdit} />
      ) : (
        <WisdomEdit
          currentWisdom={currentWisdom}
          storedWisdoms={storedWisdoms}
          setShowEdit={setShowEdit}
        />
      )} */}
    </IonPage>
  );
};

// const WisdomPage: React.FC<PropsData> = ({ currentWisdom }) => {
//   // accept currentWisdom through props
//   // const { wisdomid }: { wisdomid: string } = useParams();
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showEdit, setShowEdit] = useState(false);
//   // const [loading, setLoading] = useState(false);

//   // const [currentWisdom, setCurrentWisdom] = useState<WisdomObj>(); // Do I need to re-store it?

//   // const { currentUser } = useAuth();

//   return (
//     <IonPage>
//       {!showEdit && (
//         <WisdomView
//           showDeleteModal={showDeleteModal}
//           setShowEdit={setShowEdit}
//           handleDelete={handleDelete}
//           setShowDeleteModal={setShowDeleteModal}
//           currentWisdom={currentWisdom}
//         />
//       )}
//       {showEdit && (
//         <WisdomEdit
//           currentWisdom={currentWisdom}
//           handleEdit={handleEdit}
//           setShowEdit={setShowEdit}
//         />
//       )}
//     </IonPage>
//   );
// };

export default WisdomPage;
