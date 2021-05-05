import { render, screen } from '@testing-library/react';
import AccountSettingsComponent from "../../../../components/user/settings/Account";
import UserService from "../../../../services/user";

test('renders ACCOUNT PREFERENCES', () => {
	let user = {
		id: 1,
		email: 'email@email.com'
	};
	UserService._setCurrentUserData(user, '1', '2');
	render(<AccountSettingsComponent user={user} />);
	const element = screen.getByText(/ACCOUNT PREFERENCES/i);
	expect(element).toBeInTheDocument();
});

test('renders COMMERCIAL', () => {
	let user = {
		id: 1,
		email: 'email@email.com'
	};
	UserService._setCurrentUserData(user, '1', '2');
	render(<AccountSettingsComponent user={user} />);
	const elements = screen.getAllByText(/COMMERCIAL/i);
	for (let i = 0; i < elements.length; i++) {
		expect(elements[i]).toBeInTheDocument();
	}
});

test('renders BECOME A COMMERCIAL USER', () => {
	let user = {
		id: 1,
		email: 'email@email.com'
	};
	UserService._setCurrentUserData(user, '1', '2');
	render(<AccountSettingsComponent user={user} />);
	const element = screen.getByText(/BECOME A COMMERCIAL USER/i);
	expect(element).toBeInTheDocument();
});

test('renders DEACTIVATE ACCOUNT', () => {
	let user = {
		id: 1,
		email: 'email@email.com'
	};
	UserService._setCurrentUserData(user, '1', '2');
	render(<AccountSettingsComponent user={user} />);
	const elements = screen.getAllByText(/DEACTIVATE ACCOUNT/i);
	for (let i = 0; i < elements.length; i++) {
		expect(elements[i]).toBeInTheDocument();
	}
});
