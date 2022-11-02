import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import signUpService from './services/signUpService';
import { setUser } from './reducers/userReducer';
import { getProfileData } from './reducers/profileReducer';
import Login from './components/Login';
import Logout from './components/Logout';
import Signup from './components/Signup';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';
import ProfileSettings from './components/profile/ProfileSettings';
import NavBar from './components/Navbar';
import PathNotExists from './components/PathNotExists';
import ConfirmMail from './components/login/ConfirmMail';
import RedirectPage from './components/RedirectPage';
import DeleteUser from './components/profile/DeleteUser';
import Browsing from './components/Browsing';
import ResetPassword, {
	SetNewPassword,
} from './components/login/ResetPassword';
import ChangePassword from './components/profile/ChangePassword';
import './css/App.css';
import VideoPlayer from './components/VideoPlayer';
import MoviePage from './components/MoviePage';
import Frontpage from './components/Frontpage';
import Footer from './components/Footer';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import profileService from './services/profileService';
import { changeSeverity } from './reducers/severityReducer';
import {
	changeNotification,
	resetNotification,
} from './reducers/notificationReducer';

const App = () => {
	const dispatch = useDispatch();
	const [t, i18n] = useTranslation('common');
	const profileData = useSelector((state) => state.profile);
	const [value, setValue] = useState('');

	const [settings, changeSettings] = useState({});

	useEffect(() => {
		dispatch(resetNotification());
		if (profileData) {
			changeSettings({
				username: profileData.username,
				firstname: profileData.firstname,
				lastname: profileData.lastname,
				email: profileData.email,
				language: profileData.language,
			});
		}
	}, [dispatch, profileData]);

	// i18n.changeLanguage('ro')
	const handleLanguage = (event) => {
		const lang = event.target.value;
		setValue(lang);
		if (lang === 'English') i18n.changeLanguage('en');
		if (lang === 'Romanian') i18n.changeLanguage('ro');
		if (lang === 'Finnish') i18n.changeLanguage('fi');
		if (lang === 'Hungarian') i18n.changeLanguage('hu');
		profileService
			.editUserSettings({ ...settings, language: event.target.value })
			.then((result) => {
				if (result === true) {
					dispatch(getProfileData());
					dispatch(changeSeverity('success'));
					dispatch(changeNotification(`${t('profile_settings.1')}`));
				} else {
					dispatch(changeSeverity('error'));
					dispatch(changeNotification(result));
				}
			});
		changeSettings({ ...settings, language: event.target.value });
	};

	useEffect(() => {
		if (profileData?.language === 'English') {
			i18n.changeLanguage('en');
			setValue('English');
		}
		if (profileData?.language === 'Romanian') {
			i18n.changeLanguage('ro');
			setValue('Romanian');
		}
		if (profileData?.language === 'Finnish') {
			i18n.changeLanguage('fi');
			setValue('Finnish');
		}
		if (profileData?.language === 'Hungarian') {
			i18n.changeLanguage('hu');
			setValue('Hungarian');
		}
	}, [i18n, profileData]);

	useEffect(() => {
		dispatch(getProfileData());
		signUpService.getSessionUser().then((result) => {
			dispatch(setUser(result));
		});
	}, [dispatch]);

	return (
		<div className="content-wrap">
			<Suspense fallback="loading">
				<Router>
					<RedirectPage />

					<Button
						value={'Romanian'}
						variant={value === 'Romanian' ? 'contained' : 'text'}
						onClick={handleLanguage}
					>
						🇷🇴
					</Button>
					<Button
						value={'English'}
						variant={value === 'English' ? 'contained' : 'text'}
						onClick={handleLanguage}
					>
						🇬🇧
					</Button>
					<Button
						value={'Finnish'}
						variant={value === 'Finnish' ? 'contained' : 'text'}
						onClick={handleLanguage}
					>
						🇫🇮
					</Button>
					<Button
						value={'Hungarian'}
						variant={value === 'Hungarian' ? 'contained' : 'text'}
						onClick={handleLanguage}
					>
						🇭🇺
					</Button>

					<NavBar t={t} />
					<Routes>
						<Route path="/" element={<Frontpage t={t} />} />
						<Route path="/login" element={<Login t={t} />} />
						<Route path="/signup" element={<Signup t={t} />} />
						<Route path="/profile" element={<Profile t={t} />} />
						<Route path="/profile/:id" element={<UserProfile t={t} />} />
						<Route path="/browsing" element={<Browsing t={t} />} />
						<Route
							path="/movie/:id"
							element={<MoviePage t={t} />}
						/>
						<Route
							path="/confirm/:user/:code"
							element={<ConfirmMail t={t} />}
						/>
						<Route
							path="/login/resetpassword"
							element={<ResetPassword t={t} />}
						/>
						<Route
							path="/resetpassword/:user/:code"
							element={<SetNewPassword t={t} />}
						/>
						<Route
							path="/changepassword"
							element={<ChangePassword t={t} />}
						/>
						<Route
							path="/settings"
							element={<ProfileSettings t={t} />}
						/>
						<Route path="/logout" element={<Logout t={t} />} />
						<Route
							path="/deleteuser"
							element={<DeleteUser t={t} />}
						/>
						<Route path="/videoplayer" element={<VideoPlayer />} />
						<Route path="*" element={<PathNotExists />} />
					</Routes>
				</Router>
				<Footer />
			</Suspense>
		</div>
	);
};

export default App;
