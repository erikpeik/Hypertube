import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../reducers/userReducer';
import { changeNotification } from '../reducers/notificationReducer';
import { changeSeverity } from '../reducers/severityReducer';
import signUpService from '../services/signUpService';
import { resetProfileData } from '../reducers/profileReducer';

const Logout = ({ t }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const notification = useSelector((state) => state.notification);

	useEffect(() => {
		signUpService.logOutUser();
		dispatch(setUser(''));
		dispatch(resetProfileData());
		dispatch(changeSeverity('success'));
		if (notification !== `${t('del.4')}`)
			dispatch(changeNotification(`${t('del.5')}`));
		navigate('/login');
	}, [dispatch, navigate, notification, t]);
};

export default Logout;
