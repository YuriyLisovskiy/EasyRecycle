import { render, screen } from '@testing-library/react';
import HomeComponent from "../../components/Home";
import {MemoryRouter} from "react-router";

test('renders "How To?" card', () => {
	render(<MemoryRouter><HomeComponent /></MemoryRouter>);
	const linkElement = screen.getByText(/How to\?/i);
	expect(linkElement).toBeInTheDocument();
});

test('renders "Where to?" card', () => {
	render(<MemoryRouter><HomeComponent /></MemoryRouter>);
	const linkElement = screen.getByText(/Where to\?/i);
	expect(linkElement).toBeInTheDocument();
});

test('renders "Don\'t want to?" card', () => {
	render(<MemoryRouter><HomeComponent /></MemoryRouter>);
	const linkElement = screen.getByText(/Don't want to\?/i);
	expect(linkElement).toBeInTheDocument();
});
