import { render, screen } from '@testing-library/react';
import CreateLocationComponent from "../../components/CreateLocation";
import UserService from "../../services/user";

test('renders ADD NEW LOCATION button', () => {
	UserService._setCurrentUserData({
		is_superuser: true
	}, '1', '2');
	render(<CreateLocationComponent history={{goBack: () => {}}} />);
	const element = screen.getByText(/ADD NEW LOCATION/i);
	expect(element).toBeInTheDocument();
});
