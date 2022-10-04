import React from 'react';
import cl from './NavBar.module.scss';
import { FaLayerGroup, FaPlay, FaStore, FaUser, GiSpy } from 'react-icons/all';
import { NavLink } from 'react-router-dom';
import Tooltip from '../Tooltip';
import { useAppDispatch, useAppSelector } from '@/store';
import { launchGame } from '@/store/reducers/user/userAPI';

const NavBar = () => {
	const { isPending, isGameLaunched } = useAppSelector(
		(state) => state.userSlice
	);
	const dispatch = useAppDispatch();

	const startGame = async () => {
		dispatch(launchGame());
	};

	return (
		<div className={cl.navBarContainer}>
			<Tooltip text={'Profile'}>
				<NavLink className={cl.link} to={'/profile'}>
					<button disabled={isPending} className={cl.button}>
						<FaUser />
					</button>
				</NavLink>
			</Tooltip>

			<Tooltip text={'Shop'}>
				<NavLink className={cl.link} to={'/shop'}>
					<button disabled={isPending} className={cl.button}>
						<FaStore />
					</button>
				</NavLink>
			</Tooltip>

			<Tooltip text={'Inventory'}>
				<NavLink className={cl.link} to={'/inventory'}>
					<button disabled={isPending} className={cl.button}>
						<FaLayerGroup />
					</button>
				</NavLink>
			</Tooltip>

			<Tooltip text={'Contracts'}>
				<NavLink className={cl.link} to={'/contracts'}>
					<button disabled={isPending} className={cl.button}>
						<GiSpy style={{ fontSize: '20px' }} />
					</button>
				</NavLink>
			</Tooltip>

			{!isPending && (
				<div className={cl.playButtonContainer}>
					<Tooltip text={'Play'}>
						<button
							disabled={isPending || isGameLaunched}
							onClick={launchGame}
							className={cl.button}
						>
							<FaPlay />
						</button>
					</Tooltip>
				</div>
			)}
		</div>
	);
};

export default NavBar;
