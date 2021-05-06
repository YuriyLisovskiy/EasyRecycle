import {render, screen} from '@testing-library/react';
import ProfileComponent from "../../../components/user/Profile";
import { configure, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });

let user = {
	id: 10,
	is_commercial: true,
	rating: 10,
	avatar_info: {
		pixels: [],
		color: ''
	}
};

let userService = () => {
	return {
		banUser: _ => {},
		unbanUser: _ => {},
		getUser: () => user,
		getCurrentUser: () => user
	};
}

let transactionsService = () => {
	return {
		getTransactions: () => {}
	};
}

let commercialOrderService = () => {
	return {
		getOrders: () => {}
	};
}

test('renders PROFILE', () => {
	let component = shallow(<ProfileComponent
		match={{params: {}}}
		user={user}
		userService={userService()}
		transactionsService={transactionsService()}
		commercialOrderService={commercialOrderService()}
	/>);
	component.setState({
		loading: false,
		notFound: false,
		user: user,
		currentUser: user
	});
	render(component);
	const element = screen.getByText(/PROFILE/i);
	expect(element).toBeInTheDocument();
});

test('renders ORDERS', () => {
	let component = shallow(<ProfileComponent
		match={{params: {}}}
		user={user}
		userService={userService()}
		transactionsService={transactionsService()}
		commercialOrderService={commercialOrderService()}
	/>);
	component.setState({
		loading: false,
		notFound: false,
		user: user,
		currentUser: user,
		orders: [{}, {}],
		loadingOrders: false
	});
	render(component);
	let element = screen.getByText(/ORDERS/i);
	expect(element).toBeInTheDocument();
	element = screen.getByText(/Type/i);
	expect(element).toBeInTheDocument();
	element = screen.getByText(/Mass \(kg\)/i);
	expect(element).toBeInTheDocument();
	element = screen.getByText(/Address/i);
	expect(element).toBeInTheDocument();
	element = screen.getByText(/Date/i);
	expect(element).toBeInTheDocument();
	element = screen.getByText(/Status/i);
	expect(element).toBeInTheDocument();
});

test('renders TOTAL POINTS ACCUMULATED: 10', () => {
	user.is_commercial = false;
	let component = shallow(<ProfileComponent
		match={{params: {}}}
		user={user}
		userService={userService()}
		transactionsService={transactionsService()}
		commercialOrderService={commercialOrderService()}
	/>);
	component.setState({
		loading: false,
		notFound: false,
		user: user,
		currentUser: user,
		transactions: [{}, {}],
		loadingTransactions: false
	});
	render(component);
	let element = screen.getByText(/TOTAL POINTS ACCUMULATED: 10/i);
	expect(element).toBeInTheDocument();
	element = screen.getByText(/Type/i);
	expect(element).toBeInTheDocument();
	element = screen.getByText(/Mass \(kg\)/i);
	expect(element).toBeInTheDocument();
	element = screen.getByText(/Time \(UTC\)/i);
	expect(element).toBeInTheDocument();
	let elements = screen.getAllByText(/Points/i);
	for (let i = 0; i < elements.length; i++) {
		expect(elements[i]).toBeInTheDocument();
	}
});

test('renders NO TRANSACTIONS', () => {
	user.is_commercial = false;
	let component = shallow(<ProfileComponent
		match={{params: {}}}
		user={user}
		userService={userService()}
		transactionsService={transactionsService()}
		commercialOrderService={commercialOrderService()}
	/>);
	component.setState({
		loading: false,
		notFound: false,
		user: user,
		currentUser: user,
		transactions: [],
		loadingTransactions: false
	});
	render(component);
	let element = screen.getByText(/NO TRANSACTIONS/i);
	expect(element).toBeInTheDocument();
});
