import { Suspense } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import signUpService from './services/signUpService';
import { setUser } from './reducers/userReducer';
import { getProfileData } from './reducers/profileReducer';
import Login from './components/Login';
import Logout from './components/Logout';
import Signup from './components/Signup';
import Profile from './components/Profile';
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

const App = () => {
	const dispatch = useDispatch();
	const [t, i18n] = useTranslation('common');
	const profileData = useSelector((state) => state.profile);

	useEffect(() => {
		console.log(profileData?.language)
		if (profileData?.language === 'English') {
			i18n.changeLanguage('en');
		}
		if (profileData?.language === 'Romanian') {
			i18n.changeLanguage('ro');
		}
		if (profileData?.language === 'Finnish') {
			i18n.changeLanguage('fi');
		}
		if (profileData?.language === 'Hungarian') {
			i18n.changeLanguage('hu');
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
					<Button onClick={() => i18n.changeLanguage('ro')}>
						🇷🇴
					</Button>
					<Button onClick={() => i18n.changeLanguage('en')}>
						🇬🇧
					</Button>
					<Button onClick={() => i18n.changeLanguage('fi')}>
						🇫🇮
					</Button>
					<Button onClick={() => i18n.changeLanguage('hu')}>
						🇭🇺
					</Button>
					<NavBar t={t} />
					<Routes>
						<Route path="/" element={<Frontpage t={t} />} />
						<Route path="/login" element={<Login t={t} />} />
						<Route path="/signup" element={<Signup t={t} />} />
						<Route path="/profile" element={<Profile t={t} />} />
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
