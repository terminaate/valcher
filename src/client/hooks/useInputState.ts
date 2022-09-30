import {ChangeEvent, useState} from "react";

export default (defaultState: any, handler?: (e: ChangeEvent<HTMLInputElement>) => void) => {
    const [state, setState] = useState(defaultState);

    const onStateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setState(e.target.value);
        if (handler) handler(e);
    };

    return [state, onStateChange, setState];
}