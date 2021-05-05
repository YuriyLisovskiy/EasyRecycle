import { render, screen } from '@testing-library/react';
import CollectionInfoComponent from "../../../components/info/CollectionInfo";
import {MemoryRouter} from "react-router";

test('renders "Ordinary User" card', () => {
	render(<MemoryRouter><CollectionInfoComponent/></MemoryRouter>);
	const element = screen.getByText(/Ordinary User/i);
	expect(element).toBeInTheDocument();
});

test('renders "Commercial User" card', () => {
	render(<MemoryRouter><CollectionInfoComponent/></MemoryRouter>);
	const elements = screen.getAllByText(/Commercial User/i);
	for (let i = 0; i < elements.length; i++) {
		expect(elements[i]).toBeInTheDocument();
	}
});
