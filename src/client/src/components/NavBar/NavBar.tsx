import React from 'react';
import cl from "./NavBar.module.scss"

// const NavIcon = ({account}) => {
//     return (
//         <div>
//             account.name
//         </div>
//     )
// }

const NavBar = () => {
    return (
        <div className={cl.navBarContainer}>
            Nav
            {/*{JSON.parse(localStorage.getItem("puuids")! || [] + '').map((account, key) => (*/}
            {/*    <NavIcon account={account} key={key}/>*/}
            {/*))}*/}
        </div>
    );
};

export default NavBar;