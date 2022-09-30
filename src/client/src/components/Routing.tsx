import React from 'react';
import { Routes , useLocation, Route} from 'react-router-dom';

const Routing = () => {
    const location = useLocation()

    return (
        <Routes location={location} key={location.pathname}>
            <Route></Route>
        </Routes>
    );
};

export default Routing;