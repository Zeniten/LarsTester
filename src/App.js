import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import data from './nsf-wordlist.json';

class SearchFrame extends Component {
  constructor(props) {
    super(props);
    this.state = { search: "" };
  }

  handleOnUpdate = (e) => {
    this.setState({ search: e.target.value });
  }
  
  handleClick = (e) => {
    e.preventDefault(); // Preventing reloading of page.

    this.props.onHandleClick(this.state.search);
  }

  render() {
    return (
      <div className="SearchWord">
        <form>
          <input type="text" value={this.state.search} onChange={this.handleOnUpdate}/>
          <button type="submit" onClick={this.handleClick}>
            Søk
          </button>
        </form>
      </div>
    );
  }
}

class ResultFrame extends Component {
  render() {
    var result, test = this.props.test;
    if (this.props.searchWord !== "") {
    switch(test) {
      case true:
        result = (
          <div>
            <p>{this.props.searchWord} er et ord!</p>
          </div>
          )
        break;
      case false:
        result = (
          <div>
            <p>{this.props.searchWord} er ikke et ord!</p>
          </div>
          )
        break;
      default:
        result = (<p>Hva med å søke noe?</p>)
    }
    } else {
      result = (<p></p>)
    }

    return result;
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wordlist: data.words,
      searchWord: "",
      test: false
    };
  }

  handleClick = (word) => {

    var w = word.toUpperCase();
    this.setState({ searchWord: w,
                    test: false });
    
    for (var i = 0; i < data.words.length; i++) {
      if (w === data.words[i]) {
        this.setState({ test: true });
      }
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>NSFs ordliste</h2>
        </div>
          <h1>Søk i ordlisten</h1>
          <SearchFrame wordlist={this.state.wordlist}
                      onHandleClick={this.handleClick} />
          <ResultFrame test={this.state.test} searchWord={this.state.searchWord} />
      </div>
    );
  }
}

export default App;
