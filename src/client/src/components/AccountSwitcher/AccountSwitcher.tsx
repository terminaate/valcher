import React from 'react';
import cl from "./AccountSwitcher.module.scss"
import {FaPlus} from "react-icons/all";
import {useLocation, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../store";
import {auth} from "../../store/reducers/user/userAPI";
import Tooltip from "../Tooltip";

const AccountSwitcher = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const {isPending} = useAppSelector(state => state.userSlice);

    const changeAccount = (account: Record<string, any>) => {
        if (localStorage.getItem("puuid") !== account.puuid) {
            localStorage.setItem("puuid", account.puuid);
            dispatch(auth({puuid: account.puuid}))
        }
        if (location.pathname !== "/profile") {
            navigate("/profile")
        }
    }

    return (
        <div className={cl.switcherContainer}>
            {JSON.parse(localStorage.getItem("puuids")! || [] + '').map((account, key) => (
                <Tooltip key={key} text={account.username}>
                    <button onClick={() => changeAccount(account)} data-active={localStorage.getItem("puuid") === account.puuid} className={cl.button}>
                        <img alt={""} src={account.playerCard.displayIcon}/>
                    </button>
                </Tooltip>
            ))}
            {!isPending && (
                <Tooltip text={"Add account"}>
                    <button onClick={() => navigate("/")} className={cl.button}>
                        <FaPlus/>
                    </button>
                </Tooltip>
            )}
        </div>
    );
};

export default AccountSwitcher;