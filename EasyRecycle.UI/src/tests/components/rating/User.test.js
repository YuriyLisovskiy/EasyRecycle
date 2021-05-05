import { render, screen } from '@testing-library/react';
import UserComponent from "../../../components/rating/User";

test('renders User username', () => {
	render(<UserComponent index={1} user={{
		is_superuser: true,
		username: 'test_user'
	}}/>);
	const element = screen.getByText(/test_user/i);
	expect(element).toBeInTheDocument();
});

test('renders User full name', () => {
	render(<UserComponent index={5} user={{
		is_superuser: true,
		first_name: 'test',
		last_name: 'user',
		show_full_name: true
	}}/>);
	const element = screen.getByText(/test user/i);
	expect(element).toBeInTheDocument();
});
