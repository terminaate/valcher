import React, {useEffect} from 'react';
import Routing from "./components/Routing";

const App = () => {

    useEffect(() => {
        console.log(localStorage.getItem("puuids"))
        if (!localStorage.getItem("puuids")) {
            localStorage.setItem("puuids", JSON.stringify([]))
        }
    }, [])

    return (
        <Routing/>
    );
};

export default App;