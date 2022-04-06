import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonContent,
  IonRouterOutlet,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import HomeWrapper from './pages/Home/HomeWrapper';
import AuthGuard from './components/HOC/AuthGuard';
import SignInOrRegister from './pages/SignInOrRegister';
import WisdomPageWrapper from './pages/WisdomPage/WisdomPageWrapper';
// import WisdomPage from './pages/WisdomPage/WisdomPage';
import WisdomAdd from './pages/WisdomAdd/WisdomAdd';

import { useAuth } from './contexts/AuthContext';

setupIonicReact();

const Routes: React.FC = () => {
  // const { currentUser } = useAuth();

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route
            exact
            path="/wisdom/:wisdomid"
            component={AuthGuard(WisdomPageWrapper)}
          />
          <Route exact path="/wisdom/add" component={AuthGuard(WisdomAdd)} />
          <Route exact path="/home">
            <Redirect to="/" />
          </Route>
          <Route
            exact
            path="/sign_in"
            component={(props: any) => <SignInOrRegister {...props} />}
          />
          <Route exact path="/" component={AuthGuard(HomeWrapper)} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
  // return (
  //   <IonApp>
  //     {/* ///////////////////////////////// */}
  //     {/* {currentUser ? <Header /> : null} */}
  //     <Header />
  //     <IonContent id="main-content">
  //     {/* ///////////////////////////////// */}
  //       <IonReactRouter>
  //     {/* ///////////////////////////////// */}
  //        <Header />
  //        <IonRouterOutlet id="main-content">
  //        {/* <IonRouterOutlet> */}
  //     {/* ///////////////////////////////// */}
  //           <Route
  //             exact
  //             path="/wisdom/:wisdomid"
  //             component={AuthGuard(WisdomPageWrapper)}
  //           />
  //           <Route exact path="/wisdom/add" component={AuthGuard(WisdomAdd)} />
  //           <Route exact path="/home">
  //             <Redirect to="/" />
  //           </Route>
  //           <Route
  //             exact
  //             path="/sign_in"
  //             component={(props: any) => <SignInOrRegister {...props} />}
  //           />
  //           <Route exact path="/" component={AuthGuard(HomeWrapper)} />
  //         </IonRouterOutlet>
  //       </IonReactRouter>
  //     </IonContent>
  //   </IonApp>
  // );
};

export default Routes;
