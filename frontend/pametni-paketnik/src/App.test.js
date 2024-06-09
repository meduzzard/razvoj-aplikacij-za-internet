import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders Home component', () => {
  render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
  );
  const linkElement = screen.getByText(/Welcome to Home/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders Login component', () => {
  render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
  );
  const linkElement = screen.getByText(/Login/i);
  expect(linkElement).toBeInTheDocument();
});
