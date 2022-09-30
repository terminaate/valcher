import React, {useEffect} from 'react';
import Routing from "./components/Routing";
import {useAppDispatch} from "./store";
import {auth, getUserInfo} from "./store/reducers/user/userAPI";

const App = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!localStorage.getItem("puuids")) {
            localStorage.setItem("puuids", JSON.stringify([]))
        } else if (localStorage.getItem("rememberMe") === "true" && localStorage.getItem("puuid")) {
            dispatch(auth({puuid: localStorage.getItem("puuid")!}))
        }
    }, [])

    return (
        <Routing/>
    );
};

export default App;