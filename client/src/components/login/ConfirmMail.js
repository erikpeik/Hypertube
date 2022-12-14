import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import signUpService from "../../services/signUpService";
import { changeNotification } from "../../reducers/notificationReducer";
import { changeSeverity } from "../../reducers/severityReducer";

const ConfirmMail = ({ t }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const userToVerify = {
		username: useParams().user,
		code: useParams().code,
	};

	signUpService.verifyUser(userToVerify).then((result) => {
		if (result === true) {
			dispatch(changeSeverity("success"));
			dispatch(changeNotification(`${t("confirm.1")}`));
		} else {
			dispatch(changeSeverity("error"));
			dispatch(changeNotification(`${t("confirm.2")}`));
		}
		navigate("/login");
	});
};

export default ConfirmMail;
