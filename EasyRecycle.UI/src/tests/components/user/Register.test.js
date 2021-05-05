import { render, screen } from '@testing-library/react';
import RegisterComponent from "../../../components/user/Register";

test('renders Already on Easy Recycle?', () => {
	render(<RegisterComponent open={true}
	                       onLoginSuccess={_ => {}}
	                       onClickSwitchToRegister={_ => {}}
	                       onRequestClose={_ => {}}/>);
	const element = screen.getByText(/Already on Easy Recycle?/i);
	expect(element).toBeInTheDocument();
});

test('renders Sign In button', () => {
	render(<RegisterComponent open={true}
	                       onLoginSuccess={_ => {}}
	                       onClickSwitchToRegister={_ => {}}
	                       onRequestClose={_ => {}}/>);
	const element = screen.getByText(/Sign In/i);
	expect(element).toBeInTheDocument();
});
