import React from 'react';
import ReactDOM from 'react-dom';
import Button from './';
import renderer from 'react-test-renderer';

describe('Button', () => {
    const onClick = () => true;
    it('renders', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Button onClick={ onClick }>Give Me More</Button>, div);
    });

    test('snapshots', () => {
        const component = renderer.create(<Button onClick={ onClick }>Give Me More</Button>);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});