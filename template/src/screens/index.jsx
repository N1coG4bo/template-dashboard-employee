import React, { Component, Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Spinner from '../components/common/Spinner';

const Dashboard = lazy(() => import('./Dashboard'));

const Buttons = lazy(() => import('./BasicUI/Buttons'));
const Dropdowns = lazy(() => import('./BasicUI/Dropdowns'));
const Typography = lazy(() => import('./BasicUI/Typography'));

const BasicElements = lazy(() => import('./FormElements/BasicElements'));
const BasicTable = lazy(() => import('./Tables/BasicTable'));
const Mdi = lazy(() => import('./Icons/Mdi'));
const ChartJs = lazy(() => import('./Charts/ChartJs'));

const Error404 = lazy(() => import('./ErrorPages/Error404'));
const Error500 = lazy(() => import('./ErrorPages/Error500'));

const Login = lazy(() => import('./UserPages/Login'));
const Register1 = lazy(() => import('./UserPages/Register'));
const Lockscreen = lazy(() => import('./UserPages/Lockscreen'));

const BlankPage = lazy(() => import('./GeneralPages/BlankPage'));
const Upload = lazy(() => import('./Upload/Upload'));

class ScreenRoutes extends Component {
  render() {
    return (
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route exact path="/dashboard" component={Dashboard} />

          <Route path="/basic-ui/buttons" component={Buttons} />
          <Route path="/basic-ui/dropdowns" component={Dropdowns} />
          <Route path="/basic-ui/typography" component={Typography} />

          <Route path="/form-Elements/basic-elements" component={BasicElements} />

          <Route path="/tables/basic-table" component={BasicTable} />

          <Route path="/icons/mdi" component={Mdi} />

          <Route path="/charts/chart-js" component={ChartJs} />

          <Route path="/user-pages/login-1" component={Login} />
          <Route path="/user-pages/register-1" component={Register1} />
          <Route path="/user-pages/lockscreen" component={Lockscreen} />

          <Route path="/error-pages/error-404" component={Error404} />
          <Route path="/error-pages/error-500" component={Error500} />

          <Route path="/general-pages/blank-page" component={BlankPage} />
          <Route path="/upload" component={Upload} />

          <Redirect to="/dashboard" />
        </Switch>
      </Suspense>
    );
  }
}

export default ScreenRoutes;
