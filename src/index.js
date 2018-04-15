import React from 'react';
import ReactDOM from 'react-dom';
import { Switch,BrowserRouter as Router, Route } from "react-router-dom";
import './index.css';
import App from './App';
import SearchPage from './SearchPage';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
		<Router>
			<Switch>
				<Route exact path="/" component={App} />
				<Route exact path="/search" component={SearchPage} />
			</Switch>
		</Router>
		,document.getElementById('root'));
registerServiceWorker();
