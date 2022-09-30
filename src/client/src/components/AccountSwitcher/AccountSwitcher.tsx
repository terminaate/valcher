import React, {useEffect} from 'react';
import cl from "./AccountSwitcher.module.scss"
import store from "../../store";

// const NavIcon = ({account}) => {
//     return (
//         <div>
//             account.name
//         </div>
//     )
// }

const AccountSwitcher = () => {
    return (
        <div className={cl.switcherContainer}>
            Nav
            {/*{JSON.parse(localStorage.getItem("puuids")! || [] + '').map((account, key) => (*/}
            {/*    <NavIcon account={account} key={key}/>*/}
            {/*))}*/}
        </div>
    );
};

export default AccountSwitcher;