import React, {useEffect} from 'react';
import Routing from './components/Routing';
import {useAppDispatch} from './store';
import {auth} from './store/reducers/user/userAPI';
import Loader from './components/Loader';
import Notification from "@/components/Notification";

const App = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!localStorage.getItem('accounts')) {
            localStorage.setItem('accounts', JSON.stringify([]));
        } else if (localStorage.getItem('accessToken')) {
            dispatch(auth({accessToken: localStorage.getItem('accessToken')!}));
        }
    }, []);

    return (
        <>
            <Loader/>
            <Routing/>
            <Notification/>
        </>
    );
};

export default App;
