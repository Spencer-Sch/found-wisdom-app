import React from 'react';

import {
  IonBackdrop,
  IonButton,
  IonCard,
  IonCardContent,
  IonText,
} from '@ionic/react';

import styles from './WisdomPageModal.module.css';

interface ModalProps {
  deleteWisdom: () => void;
  setShowModal: (value: boolean) => void;
}

const WisdomPage_Modal: React.FC<ModalProps> = ({
  deleteWisdom,
  setShowModal,
}) => {
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
              onClick={() => deleteWisdom()}
            >
              Yes, delete
            </IonButton>
            <IonButton
              color="danger"
              expand="full"
              className="ion-text-uppercase"
              onClick={() => setShowModal(false)}
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
