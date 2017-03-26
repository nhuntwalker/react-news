import React, { Component } from 'react';
import './index.css';
import Search from '../Search';
import { ButtonWithLoading } from '../Button';
import Table from '../Table';

const DEFAULT_QUERY = 'redux',
      DEFAULT_PAGE = 0,
      DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1',
      PATH_SEARCH = '/search',
      PARAM_SEARCH = 'query=',
      PARAM_PAGE = 'page=',
      PARAM_HPP = 'hitsPerPage=';

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
  const { searchKey, results } = prevState;
  const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];

  const updatedHits = [...oldHits, ...hits];
  return {
    results: {
      ...results,
      [searchKey]: { hits: updatedHits, page }
    },
    isLoading: false
  };
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
    this.setState(prevState => {
      const { searchTerm } = prevState;
      this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
      return {
        searchKey: searchTerm
      }
    });
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
    this.setState(updateSearchTopStoriesState(hits, page));
  }

  onSearchSubmit(event){
    event.preventDefault();
    this.setState(prevState => {
      const { searchTerm } = prevState;
      if (this.needsToSearchTopStories(searchTerm)) {
        this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
      }
      return {
        searchKey: searchTerm
      };
    });
  }

  onDismiss(id) {
    this.setState(prevState => {
      const { searchKey, results } = prevState;
      const { hits, page } = results[searchKey];

      const isNotId = item => item.objectID !== id;
      const updatedHits = hits.filter(isNotId);
      
      return { 
        result: {
          ...results,
          [searchKey]: { hits: updatedHits, page }
        }
      };
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

export default App;