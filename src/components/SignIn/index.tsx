import {
  IonButton,
  IonContent,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
} from '@ionic/react';
import React, { useState } from 'react';

import { useIonLoading } from '@ionic/react';
import { Redirect } from 'react-router-dom';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import styles from './signin.module.css';

const SignIn = () => {
  const [present, dismiss] = useIonLoading();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('email is required'),
      password: Yup.string().required('password is required'),
    }),
    onSubmit: (values) => {
      console.log('Logging in...');
    },
  });

  return (
    <IonPage>
      <IonContent>
        {/* <div className={styles.ss_container}>
          <div className={styles.ss_form_wrapper}> */}
        <IonGrid
          className={`${styles.ss_grid} ${styles.ss_move_back} ion-no-padding ion-margin-top`}
          style={{ padding: '1rem' }}
        >
          <form onSubmit={formik.handleSubmit} className={styles.ss_form}>
            <IonText color="dark" className="ion-text-center">
              <h2>Please Login</h2>
            </IonText>
            {/* <div> */}
            <IonItem>
              <IonLabel position="stacked"></IonLabel>
              <IonInput
                id="email"
                name="email"
                type="text"
                onIonChange={formik.handleChange}
                onIonBlur={formik.handleBlur}
                value={formik.values.email}
                placeholder="Enter email Here"
              />
            </IonItem>
            {formik.touched.email && formik.errors.email ? (
              <IonLabel
                className={`${styles.ss_form_error_label} ion-text-center`}
                position="stacked"
              >
                {formik.errors.email}
              </IonLabel>
            ) : null}
            {/* </div> */}
            <IonItem>
              <IonLabel position="stacked"></IonLabel>
              <IonInput
                id="password"
                name="password"
                type="password"
                onIonChange={formik.handleChange}
                onIonBlur={formik.handleBlur}
                value={formik.values.password}
                placeholder="Enter password Here"
              />
            </IonItem>
            {formik.touched.password && formik.errors.password ? (
              <IonLabel
                className={`${styles.ss_form_error_label} ion-text-center`}
                position="stacked"
              >
                {formik.errors.password}
              </IonLabel>
            ) : null}
            <IonButton
              expand="full"
              type="submit"
              color="primary"
              className="ion-text-uppercase"
            >
              login
            </IonButton>
          </form>
          {/* </div> */}
          {/* <IonButton
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
          </IonButton> */}
          {/* </div> */}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
