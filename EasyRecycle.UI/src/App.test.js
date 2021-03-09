import { render, screen } from '@testing-library/react';
import App from './App';

test('renders title of app', () => {
    render(<App />);
    const linkElement = screen.getByText(/Easy Recycle/i);
    expect(linkElement).toBeInTheDocument();
});

test('renders login button', () => {
    render(<App />);
    const linkElement = screen.getByText(/LOGIN/i);
    expect(linkElement).toBeInTheDocument();
});

test('renders sign up button', () => {
    render(<App />);
    const linkElement = screen.getByText(/SIGN UP/i);
    expect(linkElement).toBeInTheDocument();
});
