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
import { useHistory } from 'react-router';
import { getErrorMsg } from '../../functions_client/utilFunctions';

interface PropsData {
  setShowRegisterForm: (value: boolean) => void;
}

const RegisterForm: React.FC<PropsData> = ({ setShowRegisterForm }) => {
  const [loading, setLoading] = useState(false);
  const { registerNewUser, updateUserProfile, logOutUser } = useAuth();
  const history = useHistory();

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
    try {
      // Check to make sure the user submited username is available
      const res = await checkUsernameAvailability(username);

      if (res.status >= 400) {
        // if name is not available, show error to user
        formik.errors.username = res.message;
        setLoading(false);
        return;
      }
      // if name is available, then proceed
    } catch (error) {
      console.error('RegisterForm.tsx -> submitForm: ', error);
      return;
    }

    // create a new user auth account
    registerNewUser!(email, password)
      .then(async (UserCredential) => {
        try {
          // add the chosen username to the auth account
          await updateUserProfile!(username);
        } catch (error) {
          console.error('registerNewUser -> updateUserProfile failed', error);
        }

        try {
          /*********************
          See Issue #1 in known_issues_log.md for details
          **********************/
          // build and send a batch write to firestore to create all user collections and documents
          const newUserUid = UserCredential.user.uid;
          await addUserToDB(email, newUserUid, username);
        } catch (e: any) {
          const errorLog = {
            date: new Date(),
            uid: UserCredential.user.uid,
            error: Object.assign(e),
          };
          console.log('log log', errorLog);
          console.error(
            'addUserToDB failed. RegisterForm.tsx -> registerNewUser: ',
            e
          );
          // if the batch write fails, logout the user and send them back to the login screen
          await logOutUser!();
          history.push('login_register');
          return;
        }
      })
      .catch((error) => {
        const errorMsg = getErrorMsg(error);

        if (errorMsg.input === 'email') {
          formik.errors.email = errorMsg.msg;
        } else if (errorMsg.input === 'password') {
          formik.errors.password = errorMsg.msg;
        } else {
          formik.errors.confirmPassword = errorMsg.msg;
        }
        setLoading(false);
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
            <h2>Enter Your Info</h2>
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
