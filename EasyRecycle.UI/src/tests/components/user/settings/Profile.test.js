import { render, screen } from '@testing-library/react';
import ProfileSettingsComponent from "../../../../components/user/settings/Profile";

let user = {
	first_name: 'test',
	last_name: 'user',
	avatar_info: {
		pixels: [],
		color: ''
	}
};

test('renders PROFILE INFORMATION', () => {
	render(<ProfileSettingsComponent user={user} />);
	const element = screen.getByText(/PROFILE INFORMATION/i);
	expect(element).toBeInTheDocument();
});

test('renders IMAGE', () => {
	render(<ProfileSettingsComponent user={user} />);
	const elements = screen.getAllByText(/IMAGE/i);
	for (let i = 0; i < elements.length; i++) {
		expect(elements[i]).toBeInTheDocument();
	}
});
