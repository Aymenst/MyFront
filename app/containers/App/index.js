import React from 'react';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import NotFound from 'containers/Pages/Standalone/NotFoundDedicated';
import Application from './Application';
import ThemeWrapper from './ThemeWrapper';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

function App() {
    return (
        <ThemeWrapper>
            <BrowserRouter getUserConfirmation={(message, callback) => {
            }}>
                <Switch>
                    <Route path="/" component={Application}/>
                    <Route path="/app" component={Application}/>
                    <Route component={NotFound}/>
                </Switch>
            </BrowserRouter>
        </ThemeWrapper>
    );
}

export default App;