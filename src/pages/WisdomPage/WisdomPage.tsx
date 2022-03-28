import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { IonPage } from '@ionic/react';

import WisdomView from '../../components/WisdomView/WisdomView';
import WisdomEdit from '../../components/WisdomEdit/WisdomEdit';

import { WisdomData } from '../../models/models';

import styles from './wisdomPage.module.css';

// interface FomikValues {
//   source: string;
//   text: string;
// }

// interface PropsData {
//   currentWisdom: WisdomData;
//   storedWisdoms: WisdomData[];
// }

// interface PropsData {
//   wisdomViewData: {
//     currentWisdom: WisdomData;
//   };
//   wisdomEditData: {
//     currentWisdom: WisdomData;
//     storedWisdoms: WisdomData[];
//     wisdomid: string;
//   };
// }

interface PropsData {
  passingData: {
    currentWisdom: WisdomData;
    setCurrentWisdom: (value: WisdomData) => void;
  };
}

// interface PassingData {
//   currentWisdom: WisdomData;
//   storedWisdoms: WisdomData[];
//   setShowEdit: (value: boolean) => void;
// }

// const WisdomPage: React.FC<PropsData> = ({ currentWisdom, storedWisdoms }) => {
const WisdomPage: React.FC<PropsData> = ({ passingData }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { currentWisdom } = passingData;

  return (
    <IonPage>
      {
        !showEdit ? (
          <WisdomView
            currentWisdom={currentWisdom}
            setShowEdit={setShowEdit}
            setShowDeleteModal={setShowDeleteModal}
            showDeleteModal={showDeleteModal}
          />
        ) : (
          <WisdomEdit {...passingData} setShowEdit={setShowEdit} />
        )
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

//   // const [currentWisdom, setCurrentWisdom] = useState<WisdomData>(); // Do I need to re-store it?

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
