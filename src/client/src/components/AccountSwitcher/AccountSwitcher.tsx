import React from 'react';
import cl from "./AccountSwitcher.module.scss"
import {FaPlus} from "react-icons/all";
import {useLocation, useNavigate} from "react-router-dom";
import {useAppDispatch} from "../../store";
import {auth} from "../../store/reducers/user/userAPI";

// const NavIcon = ({account}) => {
//     return (
//         <div>
//             account.name
//         </div>
//     )
// }

const AccountSwitcher = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation()

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
                <button onClick={() => changeAccount(account)} key={key} className={cl.addButton}>
                    <img alt={""} src={account.playerCard.displayIcon}/>
                </button>
            ))}
            <button onClick={() => navigate("/")} className={cl.addButton}>
                <FaPlus/>
            </button>
        </div>
    );
};

export default AccountSwitcher;