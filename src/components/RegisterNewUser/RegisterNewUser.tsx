import {
  IonButton,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonText,
} from '@ionic/react';
import React, { useState } from 'react';

import { firebase, firestoreDB } from '../../firebase/firebase';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';

import { useAuth } from '../../contexts/AuthContext';

import { Redirect } from 'react-router-dom';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import styles from './registerNewUser.module.css';

interface PropsData {
  setShowRegisterForm: (value: boolean) => void;
}

const RegisterNewUser: React.FC<PropsData> = (props: any) => {
  const [loading, setLoading] = useState(false);

  const { registerNewUser } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .email('Invalid email address')
        .required('email is required'),
      password: Yup.string().trim().required('password is required'),
      confirmPassword: Yup.string()
        .trim()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('confirm password is required'),
    }),
    onSubmit: (values) => {
      setLoading(true);
      submitForm(values);
    },
  });

  const submitForm = (values: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    // const auth = getAuth(firebase);

    createUserCollection(values.email);

    registerNewUser!(values.email, values.password)
      .then(() => {
        props.history.replace('/');
      })
      .catch((error) => {
        console.log('register user: ', error);
      });

    // createUserWithEmailAndPassword(auth, values.email, values.password)
    //   .then(() => {
    //     props.history.replace('/');
    //   })
    //   .catch((error) => {
    //     console.log('register user: ', error);
    //   });
  };

  const createUserCollection = (userEmail: string) => {
    const userCollection = collection(firestoreDB, userEmail);

    addDoc(userCollection, {
      userInfo: {
        userEmail,
      },
      userWisdoms: [],
    }).catch((error) => console.log('Error from create userInfo doc: ', error));
  };

  return (
    <IonGrid
      className={`${styles.ss_grid} ${styles.ss_move_back} ion-no-padding ion-margin-top`}
      style={{ padding: '1rem' }}
    >
      <form onSubmit={formik.handleSubmit} className={styles.ss_form}>
        <IonText color="dark" className="ion-text-center">
          <h2>Please Enter Your Info</h2>
        </IonText>

        <IonItem>
          <IonLabel position="stacked"></IonLabel>
          <IonInput
            id="email"
            name="email"
            type="text"
            onIonChange={formik.handleChange}
            onIonBlur={formik.handleBlur}
            value={formik.values.email}
            placeholder="Enter Email Here"
          />
        </IonItem>
        {formik.touched.email && formik.errors.email ? (
          <div className={`${styles.ss_form_error_label} ion-text-center`}>
            {formik.errors.email}
          </div>
        ) : null}

        <IonItem>
          <IonLabel position="stacked"></IonLabel>
          <IonInput
            id="password"
            name="password"
            type="password"
            onIonChange={formik.handleChange}
            onIonBlur={formik.handleBlur}
            value={formik.values.password}
            placeholder="Enter Password Here"
          />
        </IonItem>
        {formik.touched.password && formik.errors.password ? (
          <div className={`${styles.ss_form_error_label} ion-text-center`}>
            {formik.errors.password}
          </div>
        ) : null}
        <IonItem>
          <IonLabel position="stacked"></IonLabel>
          <IonInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            onIonChange={formik.handleChange}
            onIonBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            placeholder="Confirm Password"
          />
        </IonItem>
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <div className={`${styles.ss_form_error_label} ion-text-center`}>
            {formik.errors.confirmPassword}
          </div>
        ) : null}

        <IonButton
          expand="block"
          type="submit"
          color="primary"
          disabled={loading}
          className="ion-text-uppercase"
        >
          register
        </IonButton>
        <IonButton
          fill="clear"
          expand="block"
          color="secondary"
          disabled={loading}
          className="ion-text-lowercase"
          onClick={() => props.setShowRegisterForm(false)}
        >
          existing user? log in here.
        </IonButton>

        {loading ? (
          <IonLoading
            isOpen={loading}
            spinner="lines-sharp"
            cssClass={styles.my_custom_spinner}
            message="logging in..."
          />
        ) : (
          <>
            {/* <IonButton
              expand="block"
              type="submit"
              color="primary"
              className="ion-text-uppercase"
            >
              register
            </IonButton>
            <IonButton
              fill="clear"
              expand="block"
              color="secondary"
              className="ion-text-lowercase"
              onClick={() => props.setShowRegisterForm(false)}
            >
              existing user? log in here.
            </IonButton> */}
          </>
        )}
      </form>
    </IonGrid>
  );
};

export default RegisterNewUser;
