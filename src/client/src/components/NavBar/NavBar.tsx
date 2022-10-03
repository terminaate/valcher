import React from 'react';
import cl from './NavBar.module.scss';
import { FaLayerGroup, FaPlay, FaStore, FaUser, GiSpy } from 'react-icons/all';
import { NavLink } from 'react-router-dom';
import Tooltip from '../Tooltip';
import UserService from '@/services/UserService';
import { useAppSelector } from '@/store';

const NavBar = () => {
	const { isPending } = useAppSelector((state) => state.userSlice);

	const launchGame = async () => {
		try {
			await UserService.launchGame();
			window.close();
		} catch (e: any) {
			console.log('Unexcepted error', e.response.data);
		}
	};

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

			{!isPending && (
				<div className={cl.playButtonContainer}>
					<Tooltip text={'Play'}>
						<button onClick={launchGame} className={cl.button}>
							<FaPlay />
						</button>
					</Tooltip>
				</div>
			)}
		</div>
	);
};

export default NavBar;
