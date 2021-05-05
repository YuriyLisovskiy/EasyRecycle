import { render, screen } from '@testing-library/react';
import ScanQrCodeComponent from "../../../components/user/ScanQrCode";
import UserService from "../../../services/user";

test('renders Let garbage collector scan this code to give you points.', () => {
	UserService._setCurrentUserData({
		id: 1
	}, '1', '2');
	render(<ScanQrCodeComponent open={true} onRequestClose={_ => {}} />);
	const element = screen.getByText(/Let garbage collector scan this code to give you points\./i);
	expect(element).toBeInTheDocument();
});

test('renders QR-CODE', () => {
	UserService._setCurrentUserData({
		id: 1
	}, '1', '2');
	render(<ScanQrCodeComponent open={true} onRequestClose={_ => {}} />);
	const element = screen.getByText(/QR-CODE/i);
	expect(element).toBeInTheDocument();
});
