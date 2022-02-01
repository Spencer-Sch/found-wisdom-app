import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';

const WisdomPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Found Wisdom</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid className="ion-no-padding ion-margin-top">
          <IonRow>
            <IonCol size="12">
              {/* <IonItem> */}
              <IonText>
                <h1 className="ion-no-margin">Wisdom Title</h1>
              </IonText>
              {/* </IonItem> */}
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="3" offset="9">
              {/* <IonItem> */}
              <IonText color="medium">
                <p>8/20/1990</p>
              </IonText>
              {/* </IonItem> */}
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              {/* <IonItem> */}
              <IonText>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Architecto nihil at dolorum, sint sunt nisi laboriosam illum
                  iusto pariatur odio quae accusamus autem necessitatibus
                  corporis exercitationem voluptatum doloribus, repellendus
                  mollitia.
                </p>
              </IonText>
              {/* </IonItem> */}
            </IonCol>
          </IonRow>
          <IonRow className="ion-align-items-end ion-justify-content-end">
            <IonCol size="12">
              <IonButton
                expand="full"
                color="secondary"
                className="ion-text-uppercase"
              >
                edit
              </IonButton>
              <IonButton
                expand="full"
                color="danger"
                className="ion-text-uppercase"
              >
                delete
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default WisdomPage;
