import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux',
      DEFAULT_PAGE = 0,
      DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1',
      PATH_SEARCH = '/search',
      PARAM_SEARCH = 'query=',
      PARAM_PAGE = 'page=',
      PARAM_HPP = 'hitsPerPage=';

const isSearched = (searchTerm) => (item) => !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  componentDidMount(){ // what happens when the component first mounts on the page
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
  }

  fetchSearchTopStories(searchTerm, page){
    const url = `${ PATH_BASE }${ PATH_SEARCH }?${ PARAM_SEARCH }${ searchTerm }&${ PARAM_PAGE }${ page }&${ PARAM_HPP }${ DEFAULT_HPP }`
    fetch(url)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result));
  }

  setSearchTopStories(result){
    const { hits, page } = result;
    const oldHits = page !== 0 ? this.state.result.hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({
      result: { hits: updatedHits, page }
    });
  }

  onSearchSubmit(event){
    event.preventDefault();
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({ 
      result: {...this.state.result, hits: updatedHits}
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { searchTerm, result } = this.state;
    const page = (result && result.page) || DEFAULT_PAGE;

    return (
      <div className="page">
        <div className="interactions">
          <Search value={ searchTerm } onChange={ this.onSearchChange } onSubmit={ this.onSearchSubmit }>
            search
          </Search>
        </div>
        <div className="interactions">
        {
          result && <Table 
                      list={ result.hits } 
                      onDismiss={ this.onDismiss }
                    />
        }
        </div>
        <div class="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>More</Button>
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

const Button = ({ onClick, className='', children}) =>
  <button onClick={ onClick } className={ className } type="button">
    { children }
  </button>

const largeColumn = { width: '40%' },
      midColumn = { width: '20%' },
      smallColumn = { width: '10%' };

const Table = ({ list, onDismiss }) =>
  <div className="table">
    { list.map(item => 
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

export default App;