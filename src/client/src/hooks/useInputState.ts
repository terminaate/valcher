import {ChangeEvent, useState} from "react";

export default (defaultState: any, handler?: (e: ChangeEvent<HTMLInputElement>) => void) => {
    const [state, setState] = useState(defaultState);

    const onStateChange = (e: ChangeEvent<HTMLInputElement>) => {
        switch (typeof defaultState) {
            case "string":
                setState(e.target.value);
                break;

            case "boolean":
                setState(e.target.checked);
                break;
        }

        if (handler) handler(e);
    };

    return [state, onStateChange, setState];
}