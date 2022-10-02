import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import NavigateSetter from './components/NavigateSetter';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<NavigateSetter />
		<Provider store={store}>
			<App />
		</Provider>
	</BrowserRouter>
);
