import React from 'react';
import cl from './NavBar.module.scss';
import { FaLayerGroup, FaStore, FaUser, GiSpy } from 'react-icons/all';
import { NavLink } from 'react-router-dom';
import Tooltip from '../Tooltip';

const NavBar = () => {
	return (
		<div className={cl.navBarContainer}>
			<Tooltip text={'Profile'}>
				<NavLink className={cl.link} to={'/profile'}>
					<button className={cl.button}>
						<FaUser />
					</button>
				</NavLink>
			</Tooltip>

			<Tooltip text={'Shop'}>
				<NavLink className={cl.link} to={'/shop'}>
					<button className={cl.button}>
						<FaStore />
					</button>
				</NavLink>
			</Tooltip>

			<Tooltip text={'Inventory'}>
				<NavLink className={cl.link} to={'/inventory'}>
					<button className={cl.button}>
						<FaLayerGroup />
					</button>
				</NavLink>
			</Tooltip>

			<Tooltip text={'Contracts'}>
				<NavLink className={cl.link} to={'/contracts'}>
					<button className={cl.button}>
						<GiSpy style={{ fontSize: '20px' }} />
					</button>
				</NavLink>
			</Tooltip>
		</div>
	);
};

export default NavBar;
