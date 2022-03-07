import { render, screen } from '@testing-library/react';
import create from './testUtils/dsl';
import App from './App';
import Cookies from 'js-cookie';

describe('App', () => {
  describe('when user authenticated', () => {
    test('should render navbar with pages list', () => {
      jest.mocked(Cookies).get = jest.fn().mockReturnValue('test_access_token');

      const ui = create
        .component(<App></App>)
        .withReduxStore()
        .please();

      render(ui);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText(/Pages/)).toBeInTheDocument();
    });
  });
});
