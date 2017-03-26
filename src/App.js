import React, { Component, PropTypes } from 'react';
import { sortBy } from 'lodash';
import classNames from 'classnames';
import './App.css';

const DEFAULT_QUERY = 'redux',
      DEFAULT_PAGE = 0,
      DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1',
      PATH_SEARCH = '/search',
      PARAM_SEARCH = 'query=',
      PARAM_PAGE = 'page=',
      PARAM_HPP = 'hitsPerPage=';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  PUBLISHED: list => sortBy(list, 'created_at').reverse(),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      isLoading: false,
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  componentDidMount(){ // what happens when the component first mounts on the page
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
  }

  fetchSearchTopStories(searchTerm, page){
    this.setState({ isLoading: true });
    const url = `${ PATH_BASE }${ PATH_SEARCH }?${ PARAM_SEARCH }${ searchTerm }&${ PARAM_PAGE }${ page }&${ PARAM_HPP }${ DEFAULT_HPP }`
    fetch(url)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result));
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result){
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    const updatedHits = [...oldHits, ...hits];

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      },
      isLoading: false
    });
  }

  onSearchSubmit(event){
    event.preventDefault();
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
    }
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({ 
      result: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const {
      searchTerm,
      results,
      searchKey,
      isLoading,
    } = this.state;
    
    const page = (
      results &&
      results[searchKey] &&
      results[searchKey].page
    ) || DEFAULT_PAGE;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search value={ searchTerm } onChange={ this.onSearchChange } onSubmit={ this.onSearchSubmit }>
            search
          </Search>
        </div>
        <Table 
          list={ list }
          onDismiss={ this.onDismiss }
        />
        <div className="interactions">
          <ButtonWithLoading
            isLoading={ isLoading }
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, onSubmit, children }) =>
  <form onSubmit={ onSubmit }>
    <input type="text" value={ value } onChange={ onChange } />
    <button type="submit">{ children }</button>
  </form>

Search.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.node
};
// class Search extends Component {

//   componentDidMount() {
//     this.input.focus();
//   }

//   render() {
//     const {
//       value,
//       onChange,
//       onSubmit,
//       children
//     } = this.props;

//     return (
//       <form onSubmit={ onSubmit }>
//         <input
//           type="text"
//           value={ value }
//           onChange={ onChange }
//           ref={(node) => { this.input = node; }}
//         />
//         <button type="submit">{ children }</button>
//       </form>
//     );
//   }
// }

const Button = ({ onClick, className, children}) =>
  <button onClick={ onClick } className={ className } type="button">
    { children }
  </button>

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

Button.defaultProps = {
  className: '',
}

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
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
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

const Loading = () =>
  <div>
    Loading...
  </div>

const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component { ...rest } />

const ButtonWithLoading = withLoading(Button);

export default App;

export {
  Button,
  Table,
  Search,
};