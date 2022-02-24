import { IonButton, IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';

import { useIonLoading } from '@ionic/react';
import { Redirect } from 'react-router-dom';

import { useFormik } from 'formik';
import * as Yup from 'yup';

const SignIn = () => {
  const [present, dismiss] = useIonLoading();
  return (
    <IonPage>
      <IonContent>
        <IonButton
          expand="block"
          onClick={() => {
            present({
              spinner: 'lines-sharp',
              message: 'Loading...',
              duration: 3000,
            });
          }}
        >
          Show Loading
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
