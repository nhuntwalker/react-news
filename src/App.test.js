import React from 'react';
import ReactDOM from 'react-dom';
import App, { Search, Button, Table } from './App';
import renderer from 'react-test-renderer';

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

describe('Search', () => {
    it('renders', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Search>Search</Search>, div);
    });

    test('snapshots', () => {
        const component = renderer.create(<Search>Search</Search>);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});

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

describe('Table', () => {
    const props = {
        list: [
            { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
            { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' },
        ],
        onDismiss: () => true
    };

    it('renders', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Table { ...props } />, div);
    });

    test('snapshots', () => {
        const component = renderer.create(<Table { ...props } />);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    })
});