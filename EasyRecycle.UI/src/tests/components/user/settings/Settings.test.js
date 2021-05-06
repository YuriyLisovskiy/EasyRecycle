import { render, screen } from '@testing-library/react';
import SettingsComponent from "../../../../components/user/settings/Settings";
import UserService from "../../../../services/user";

test('renders User settings', () => {
	UserService._setCurrentUserData({
		is_superuser: true,
		avatar_info: {
			pixels: [],
			color: ''
		}
	}, '1', '2');
	render(<SettingsComponent activeKey={'account'} updateAvatar={_ => {}} updateFullName={_ => {}}/>);
	const element = screen.getByText(/User settings/i);
	expect(element).toBeInTheDocument();
});
