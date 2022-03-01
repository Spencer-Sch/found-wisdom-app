import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
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

import WisdomPage from './pages/WisdomPage/WisdomPage';
import Home from './pages/Home/Home';
import WisdomAdd from './pages/WisdomAdd/WisdomAdd';
import SignIn from './pages/SignIn';

setupIonicReact();

const Routes: React.FC = () => (
  <IonApp>
    <IonHeader>
      <IonToolbar>
        <IonTitle className="ion-text-center">Found Wisdom</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/wisdom/:wisdomid" component={WisdomPage} />
          <Route exact path="/wisdom/add" component={WisdomAdd} />
          <Route exact path="/home">
            <Redirect to="/" />
          </Route>
          {/* <Route exact path="/sign_in" component={SignIn} /> */}
          {/* <Route
            exact
            path="/sign_in"
            component={(props: any) => <SignIn {...props} user={user} />}
          /> */}
          <Route
            exact
            path="/sign_in"
            component={(props: any) => <SignIn {...props} />}
          />
          <Route exact path="/" component={Home} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonContent>
  </IonApp>
);

export default Routes;
