import { render, screen } from '@testing-library/react';
import HowToRecycleComponent from "../../../components/info/HowToRecycle";
import {MemoryRouter} from "react-router";

test('renders "INFORMATION" title', () => {
	render(<MemoryRouter><HowToRecycleComponent/></MemoryRouter>);
	const element = screen.getByText(/INFORMATION/i);
	expect(element).toBeInTheDocument();
});

test('renders "Organic (Food) Waste*" info', () => {
	render(<MemoryRouter><HowToRecycleComponent/></MemoryRouter>);
	const element = screen.getByText(/Organic \(Food\) Waste\*/i);
	expect(element).toBeInTheDocument();
});

test('renders "Glass Waste*" info', () => {
	render(<MemoryRouter><HowToRecycleComponent/></MemoryRouter>);
	const element = screen.getByText(/Glass Waste\*/i);
	expect(element).toBeInTheDocument();
});

test('renders "Metal Waste*" info', () => {
	render(<MemoryRouter><HowToRecycleComponent/></MemoryRouter>);
	const element = screen.getByText(/Metal Waste\*/i);
	expect(element).toBeInTheDocument();
});

test('renders "Paper Waste*" info', () => {
	render(<MemoryRouter><HowToRecycleComponent/></MemoryRouter>);
	const element = screen.getByText(/Paper Waste\*/i);
	expect(element).toBeInTheDocument();
});

test('renders "Plastic Waste*" info', () => {
	render(<MemoryRouter><HowToRecycleComponent/></MemoryRouter>);
	const element = screen.getByText(/Plastic Waste\*/i);
	expect(element).toBeInTheDocument();
});
