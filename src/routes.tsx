import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
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
import HomeWrapper from './pages/Home/HomeWrapper';
import AuthGuard from './components/HOC/AuthGuard';
import LogInOrRegister from './pages/LogInOrRegister/LogInOrRegister';
import WisdomPageWrapper from './pages/WisdomPage/WisdomPageWrapper';
import WisdomAdd from './pages/WisdomAdd/WisdomAdd';
import UserAccountWrapper from './pages/UserAccount/UserAccountWrapper';

import { useAuth } from './contexts/AuthContext';

setupIonicReact();

const Routes: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <IonApp>
      <IonReactRouter>
        {currentUser ? <Header /> : null}
        <IonRouterOutlet id="ion-router-outlet">
          <Route
            path="/wisdom/:wisdomid"
            component={AuthGuard(WisdomPageWrapper)}
          />
          <Route path="/add" component={AuthGuard(WisdomAdd)} />
          <Route path="/home">
            <Redirect to="/" />
          </Route>
          <Route path="/account" component={AuthGuard(UserAccountWrapper)} />
          <Route path="/login_register" component={LogInOrRegister} />
          <Route exact path="/" component={AuthGuard(HomeWrapper)} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default Routes;
