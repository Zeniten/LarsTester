import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import data from './nsf-wordlist.json';

class SearchFrame extends Component {
  constructor(props) {
    super(props);
    this.state = { search: "" };
  }

  handleSearch = (e) => {
    this.setState({ search: e.target.value });
  }
  
  handleSearchClick = (e) => {
    e.preventDefault(); // Preventing reloading of page.

    this.props.onHandleClick(this.state.search);
  }

  render() {
    return (
      <div className="SearchWord">
        <form>
          <input type="text" value={this.state.search} onChange={this.handleSearch}/>
          <button type="submit" onClick={this.handleSearchClick}>
            Søk
          </button>
        </form>
      </div>
    );
  }
}

class SearchResultFrame extends Component {
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

class AnagramsFrame extends Component {
  constructor(props) {
    super(props);
    this.state = { anagram: "" }
  }

  handleAnagram = (e) => {
    this.setState({ anagram: e.target.value });
  }

  handleAnagramClick = (e) => {
    e.preventDefault();
    
    this.props.serveAnagrams(this.state.anagram);
  }

  render() {
    return (
        <form>
          <h2>Finn anagrammer</h2>
          <input type="text" value={this.state.anagram} onChange={this.handleAnagram}/>
          <button type="submit" onClick={this.handleAnagramClick}>
            Søk
          </button>
        </form>  
    )
  }
}

class AnagramsResultFrame extends Component {
  render() {
    return (
      <div>
      <p>Denne strengen har {this.props.specAnagrams.length} anagrammer.</p>
      <ul>
        {this.props.specAnagrams.map(function(word) {
          return <p>{word}</p>;
        })}
      </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wordlist: data.words,
      searchWord: "",
      anagrams: {},
      specificAnagrams: ["lev", "vel", "elv"],
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

  serveAnagrams = (word) => {
    var str = word.split("").sort().join("").toUpperCase();
    var anagrams = this.state.anagrams;

    if (str in anagrams) {
      this.setState({ specificAnagrams: anagrams[str] });
    } else {
      this.setState({ specificAnagrams: ["laaars"] });
    }
  }

  findAnagrams = () => {
    var str = "", wordlist = this.state.wordlist;
    var agrms = {};

    for (var i = 0; i < wordlist.length; i++) {
      str = wordlist[i].split("").sort().join("");

      if (str in agrms) {
        if (!agrms[str].includes(wordlist[i])) {
          agrms[str].push(wordlist[i]);
        }
      } else {
        agrms[str] = [wordlist[i]];
      }
    }
    this.setState({ anagrams: agrms });
  }

  componentWillMount() {
    this.findAnagrams();
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
          <SearchResultFrame test={this.state.test} searchWord={this.state.searchWord} />
          <AnagramsFrame serveAnagrams={this.serveAnagrams} />
          <AnagramsResultFrame specAnagrams={this.state.specificAnagrams} />
      </div>
    );
  }
}

export default App;
