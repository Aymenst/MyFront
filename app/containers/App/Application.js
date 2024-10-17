import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';;
import { ThemeContext } from './ThemeWrapper';
import Dashboard from '../Templates/Dashboard';
import {
  BlankPage,
  Error,
  HelpSupport,
  NotFound,
  MainPage,
} from '../pageListAsync';

function Application(props) {
  const { history } = props;
  const changeMode = useContext(ThemeContext);
  return (
    <Dashboard history={history} changeMode={changeMode}>
      <Switch>
        { /* Home */}
        <Route exact path="/" component={MainPage} />
        <Route exact path="/app" component={MainPage} />
        { /* Pages */ }
        <Route path="/app/pages/blank-page" component={BlankPage} />
        <Route path="/app/pages/not-found" component={NotFound} />
        <Route path="/app/pages/error" component={Error} />
        <Route path="/app/pages/help-support" component={HelpSupport} />
        { /* Default */ }
        <Route component={NotFound} />
      </Switch>
    </Dashboard>
  );
}

export default Application;
