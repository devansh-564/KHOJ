import { render } from '@testing-library/react';
import App from './App';

test('renders KHOJ application successfully', () => {
  const { container } = render(<App />);

  expect(container.firstChild).toBeInTheDocument();
});