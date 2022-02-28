import React from 'react';
import { render } from '@testing-library/react';
import Routes from './routes';

test('renders without crashing', () => {
  const { baseElement } = render(<Routes />);
  expect(baseElement).toBeDefined();
});
