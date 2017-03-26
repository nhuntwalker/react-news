import React, { Component, PropTypes } from 'react';
import { sortBy } from 'lodash';
import classNames from 'classnames';
import './index.css';
import Button from '../Button';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  PUBLISHED: list => sortBy(list, 'created_at').reverse(),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

const largeColumn = { width: '40%' },
      midColumn = { width: '20%' },
      smallColumn = { width: '10%' };

class Table extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };

    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    this.setState(prevState => {
      const isSortReverse = prevState.sortKey === sortKey && !prevState.isSortReverse;
      return { sortKey, isSortReverse };
    });
  }

  render() {
    const { list, onDismiss } = this.props;
    const { sortKey, isSortReverse } = this.state;
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;

    return (
      <div className="table">
        <div className="table-header">
          <span style={ largeColumn }>
            <Sort sortKey={'TITLE'} onSort={ this.onSort } activeSortKey={ sortKey }>Title</Sort>
          </span>
          <span style={ smallColumn }>
            <Sort sortKey={'AUTHOR'} onSort={ this.onSort } activeSortKey={ sortKey }>Author</Sort>
          </span>
          <span style={ midColumn }>
            <Sort sortKey={'PUBLISHED'} onSort={ this.onSort } activeSortKey={ sortKey }>Published</Sort>
          </span>
          <span style={ smallColumn }>
            <Sort sortKey={'COMMENTS'} onSort={ this.onSort } activeSortKey={ sortKey }>Comments</Sort>
          </span>
          <span style={ smallColumn }>
            <Sort sortKey={'POINTS'} onSort={ this.onSort } activeSortKey={ sortKey }>Points</Sort>
          </span>
          <span style={ smallColumn }>
            Archive
          </span>
        </div>
        { reverseSortedList.map(item => 
          <div key={ item.objectID } className="table-row">
            <span style={ largeColumn }><a href={ item.url }>{ item.title }</a></span>
            <span style={ smallColumn }>{ item.author }</span>
            <span style={ midColumn }>{ new Date(item.created_at).toLocaleString() }</span>
            <span style={ smallColumn }>{ item.num_comments} Comments</span>
            <span style={ smallColumn }>{ item.points} Points</span>
            <span style={ smallColumn }>
              <Button onClick={ ()=> onDismiss(item.objectID) } className="button-inline">
                Dismiss
              </Button>
            </span>
          </div>
        ) }
      </div>
    );
  }
}

Table.propTypes = {
  list: PropTypes.array.isRequired,
  onDismiss: PropTypes.func.isRequired
};

const Sort = ({ sortKey, activeSortKey, onSort, children }) => {
  const sortClass = classNames(
    'button-inline',
    { 'button-active': sortKey === activeSortKey }
  );
  return (
    <Button onClick={ () => onSort(sortKey) } className={ sortClass }>
      { children }
    </Button>
  )
}

export default Table;