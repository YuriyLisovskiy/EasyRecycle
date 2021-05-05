import { render, screen } from '@testing-library/react';
import LoginComponent from "../../../components/user/Login";

test('renders Username field', () => {
	render(<LoginComponent open={true}
	                       onLoginSuccess={_ => {}}
	                       onClickSwitchToRegister={_ => {}}
	                       onRequestClose={_ => {}}/>);
	const element = screen.getByText(/Username/i);
	expect(element).toBeInTheDocument();
});

test('renders Password field', () => {
	render(<LoginComponent open={true}
	                       onLoginSuccess={_ => {}}
	                       onClickSwitchToRegister={_ => {}}
	                       onRequestClose={_ => {}}/>);
	const element = screen.getByText(/Password/i);
	expect(element).toBeInTheDocument();
});

test('renders Sign Up button', () => {
	render(<LoginComponent open={true}
	                       onLoginSuccess={_ => {}}
	                       onClickSwitchToRegister={_ => {}}
	                       onRequestClose={_ => {}}/>);
	const element = screen.getByText(/Sign Up/i);
	expect(element).toBeInTheDocument();
});
