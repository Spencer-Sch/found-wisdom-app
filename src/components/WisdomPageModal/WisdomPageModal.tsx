import React from 'react';

import {
  IonBackdrop,
  IonButton,
  IonCard,
  IonCardContent,
  IonText,
} from '@ionic/react';

import { useAuth } from '../../contexts/AuthContext';

import { handleDelete } from '../../actions/firebaseActions';

import styles from './WisdomPageModal.module.css';
import { useHistory } from 'react-router-dom';

interface ModalProps {
  setShowDeleteModal: (value: boolean) => void;
  wisdomId: string;
}

const WisdomPage_Modal: React.FC<ModalProps> = ({
  setShowDeleteModal,
  wisdomId,
}) => {
  const { currentUser, setRenderHome } = useAuth();
  const username = currentUser!.displayName!;
  const history = useHistory();

  return (
    <>
      <IonBackdrop
        className={styles.ss_backdrop}
        visible={true}
        tappable={false}
      />
      <div className={styles.ss_modal_wrapper}>
        <IonCard className={styles.ss_ion_card}>
          <IonCardContent>
            <IonText className="ion-text-center">
              <p
                style={{
                  fontSize: '1.5rem',
                }}
              >
                Are you sure?
              </p>
            </IonText>
            <IonButton
              color="secondary"
              expand="full"
              className="ion-text-uppercase"
              onClick={async () => {
                await handleDelete(username, wisdomId);
                setRenderHome!(true);
                history.replace('/');
              }}
            >
              Yes, delete
            </IonButton>
            <IonButton
              color="danger"
              expand="full"
              className="ion-text-uppercase"
              onClick={() => setShowDeleteModal(false)}
            >
              No, cancel
            </IonButton>
          </IonCardContent>
        </IonCard>
      </div>
    </>
  );
};

export default WisdomPage_Modal;
