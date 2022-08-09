import React, { useState } from 'react';
import {
  IonButton,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonText,
} from '@ionic/react';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useAuth } from '../../contexts/AuthContext';
import { addUserToDB } from '../../actions/firebaseActions';
import { SubmitRegistrationForm } from '../../models/models';

import styles from './registerForm.module.css';
import { checkUsernameAvailability } from '../../actions/cloudFunctionActions';

interface PropsData {
  setShowRegisterForm: (value: boolean) => void;
}

const RegisterForm: React.FC<PropsData> = ({ setShowRegisterForm }) => {
  const [loading, setLoading] = useState(false);
  const { registerNewUser, updateUserProfile } = useAuth();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().trim().required('username is required'),
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

  const submitForm: SubmitRegistrationForm = async ({
    username,
    email,
    password,
  }) => {
    /////////////////////////
    // doing this here for now. should this be be called as part of registerNewUser() ?
    // Check for unique username
    //
    // check for unique username on db
    try {
      const res = await checkUsernameAvailability(username);
      const data = await res.json();
      console.log('availability check ', data);

      if (data.status >= 400) {
        formik.errors.username =
          data.code === 'USERNAME_TAKEN'
            ? 'username unavailable'
            : data.message;
        setLoading(false);
        return;
      }

      console.log(data.message);
    } catch (error) {
      console.log(
        'something went wrong when checking for username availability...'
      );
      console.error(error);
      return;
    }
    //
    // if username is not available
    //  return and error
    // else continue...
    /////////////////////////
    registerNewUser!(email, password) // I have .then() mixed with async/await. refactor to only use async/await???
      .then(async (onfulfilled) => {
        const newUserUid = onfulfilled.user.uid;
        try {
          await addUserToDB(email, password, newUserUid, username);
        } catch (e) {
          console.error(
            'addUserToDB failed. RegisterForm.tsx -> registerNewUser: ',
            e
          );
        }
        updateUserProfile!(username);
      })
      .catch((e) => {
        console.error('register user: ', e);
      });
  };

  return (
    <>
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
              id="username"
              name="username"
              type="text"
              onIonChange={formik.handleChange}
              onIonBlur={formik.handleBlur}
              value={formik.values.username}
              placeholder="Enter Username Here"
            />
          </IonItem>
          {formik.touched.username && formik.errors.username ? (
            <div className={`${styles.ss_form_error_label} ion-text-center`}>
              {formik.errors.username}
            </div>
          ) : null}

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
          <div className={`ion-text-center ${styles.ss_div}`}>
            already have an account?{' '}
            <span
              className={styles.ss_span}
              onClick={() => setShowRegisterForm(false)}
            >
              log in here
            </span>
          </div>
        </form>
      </IonGrid>
      <IonLoading
        isOpen={loading}
        spinner="lines-sharp"
        cssClass={styles.my_custom_spinner}
        message="creating user account..."
      />
    </>
  );
};

export default RegisterForm;
