import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      full_name: 'octo/demo', owner: { avatar_url: '' }, description: 'Demo',
      html_url: 'https://github.com/octo/demo',
    }),
  }));
});

afterEach(() => jest.restoreAllMocks());

test('renders the dashboard controls', async () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Pulseboard' })).toBeInTheDocument();
  expect(screen.getByLabelText('Repository')).toBeInTheDocument();
  expect(await screen.findByRole('button', { name: /refresh data/i })).toBeInTheDocument();
});

test('shows an API error to the user', async () => {
  global.fetch.mockRejectedValueOnce(new Error('Network unavailable'));
  render(<App />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Network unavailable');
});
