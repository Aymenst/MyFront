/* eslint-disable */

import React from 'react';
import Loading from 'dan-components/Loading';
import loadable from '../utils/loadable';

// Pages
export const ComingSoon = loadable(() =>
    import ('./Pages/ComingSoon'), {
    fallback: <Loading/>,
});

export const BlankPage = loadable(() =>
    import ('./Pages/BlankPage'), {
    fallback: <Loading/>,
});

// Other
export const NotFound = loadable(() =>
    import ('./NotFound/NotFound'), {
    fallback: <Loading/>,
});
export const Error = loadable(() =>
    import ('./Pages/Error'), {
    fallback: <Loading/>,
});
export const Maintenance = loadable(() =>
    import ('./Pages/Maintenance'), {
    fallback: <Loading/>,
});
export const HelpSupport = loadable(() =>
    import ('./Pages/HelpSupport'), {
    fallback: <Loading/>,
});

export const MainPage = loadable(() =>
    import ('./Pages/Ticket'), {
    fallback: <Loading/>,
});

