import { render, screen } from '@testing-library/react';
import PrivacySettingsComponent from "../../../../components/user/settings/Privacy";

test('renders PRIVACY', () => {
	let user = {
		show_full_name: true
	};
	render(<PrivacySettingsComponent user={user} />);
	const element = screen.getByText(/PRIVACY/i);
	expect(element).toBeInTheDocument();
});
