import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import './assets/css/global.scss';
import ScreenRoutes from './screens';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import SettingsPanel from './components/layout/SettingsPanel';
import Footer from './components/layout/Footer';

class App extends Component {
	state = {};

	componentDidMount() {
		this.onRouteChanged();
	}

	componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			this.onRouteChanged();
		}
	}

	onRouteChanged() {
		const { i18n } = this.props;
		const body = document.querySelector('body');

		if (this.props.location.pathname === '/layout/RtlLayout') {
			body.classList.add('rtl');
			i18n.changeLanguage('ar');
		} else {
			body.classList.remove('rtl');
			i18n.changeLanguage('en');
		}

		window.scrollTo(0, 0);

		const fullPageLayoutRoutes = [
			'/user-pages/login-1',
			'/user-pages/register-1',
			'/user-pages/lockscreen',
			'/error-pages/error-404',
			'/error-pages/error-500',
			'/general-pages/landing-page',
			'/general-pages/blank-page',
		];

		const isFullPageLayout = fullPageLayoutRoutes.includes(this.props.location.pathname);
		this.setState({ isFullPageLayout });

		const pageBodyWrapper = document.querySelector('.page-body-wrapper');
		if (!pageBodyWrapper) {
			return;
		}

		if (isFullPageLayout) {
			pageBodyWrapper.classList.add('full-page-wrapper');
		} else {
			pageBodyWrapper.classList.remove('full-page-wrapper');
		}
	}

	render() {
		const navbarComponent = !this.state.isFullPageLayout ? <Navbar /> : '';
		const sidebarComponent = !this.state.isFullPageLayout ? <Sidebar /> : '';
		const settingsPanelComponent = !this.state.isFullPageLayout ? <SettingsPanel /> : '';
		const footerComponent = !this.state.isFullPageLayout ? <Footer /> : '';

		return (
			<div className="container-scroller">
				{navbarComponent}
				<div className="container-fluid page-body-wrapper">
					{sidebarComponent}
					<div className="main-panel">
						<div className="content-wrapper">
							<ScreenRoutes />
							{settingsPanelComponent}
						</div>
						{footerComponent}
					</div>
				</div>
			</div>
		);
	}
}

export default withTranslation()(withRouter(App));
