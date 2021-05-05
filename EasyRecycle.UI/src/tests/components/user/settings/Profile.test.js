import { render, screen } from '@testing-library/react';
import ProfileSettingsComponent from "../../../../components/user/settings/Profile";

test('renders PROFILE INFORMATION', () => {
	let user = {
		first_name: 'test',
		last_name: 'user'
	};
	render(<ProfileSettingsComponent user={user} />);
	const element = screen.getByText(/PROFILE INFORMATION/i);
	expect(element).toBeInTheDocument();
});

test('renders IMAGES', () => {
	let user = {
		first_name: 'test',
		last_name: 'user'
	};
	render(<ProfileSettingsComponent user={user} />);
	const element = screen.getByText(/IMAGES/i);
	expect(element).toBeInTheDocument();
});
