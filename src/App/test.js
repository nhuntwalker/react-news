import React from 'react';
import ReactDOM from 'react-dom';
import App from './';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

describe('App', () => {
    it('renders without crashing', () => {
      const div = document.createElement('div');
      ReactDOM.render(<App />, div);
    });

    test('snapshots', () => {
        const component = renderer.create(<App />);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
