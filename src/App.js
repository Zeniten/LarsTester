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
      <p>Denne strengen har {this.props.specAnagrams.length} anagrammer:</p>
      <ul>
        {this.props.specAnagrams.map(function(word) {
          return <p>{word}</p>;
        })}
      </ul>
      </div>
    );
  }
}

class MostValuableWords extends Component {
  render() {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Word</th>
              <th>Word Score</th>
            </tr>
          </thead>
          <tbody>
          {this.props.mostValuableWords.map(function(item) {
            return (
              <tr>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wordlist: data.words,
      searchWord: "",
      anagrams: {},
      specificAnagrams: [],
      mostValuableWords: [],
      tiles: {
                        "A": { "number": 7, "value": 1 },
                        "B": { "number": 3, "value": 4 },
                        "C": { "number": 1, "value": 10 },
                        "D": { "number": 5, "value": 1 },
                        "E": { "number": 9, "value": 1 },
                        "F": { "number": 4, "value": 2 },
                        "G": { "number": 4, "value": 2 },
                        "H": { "number": 3, "value": 3 },
                        "I": { "number": 5, "value": 1 },
                        "J": { "number": 2, "value": 4 },
                        "K": { "number": 4, "value": 2 },
                        "L": { "number": 5, "value": 1 },
                        "M": { "number": 3, "value": 2 },
                        "N": { "number": 6, "value": 1 },
                        "O": { "number": 4, "value": 2 },
                        "P": { "number": 2, "value": 4 },
                        "Q": { "number": 0, "value": 0 },
                        "R": { "number": 6, "value": 1 },
                        "S": { "number": 6, "value": 1 },
                        "T": { "number": 6, "value": 1 },
                        "U": { "number": 3, "value": 4 },
                        "V": { "number": 3, "value": 4 },
                        "W": { "number": 1, "value": 8 },
                        "X": { "number": 0, "value": 0 },
                        "Y": { "number": 1, "value": 6 },
                        "Z": { "number": 0, "value": 0 },
                        "Æ": { "number": 1, "value": 6 },
                        "Ø": { "number": 2, "value": 5 },
                        "Å": { "number": 2, "value": 4 }
      },
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
      this.setState({ specificAnagrams: [] });
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

  computeMostValuableWord = (wordLength) => {
    var wordlist = this.state.wordlist, tiles = this.state.tiles;
    var word = "", wordScore = 0, tempWordScore = 0, wordArray;

    for (var i = 0; i < wordlist.length; i++) {
      if (wordlist[i].length === wordLength) {
        wordArray = wordlist[i].split("");
        if (this.letterCounter(wordArray)) { // Use this test for valid Scrabble words.
          for (var j = 0; j < wordArray.length; j++) {
            try {
              tempWordScore += tiles[wordArray[j]].value;
            } catch(e) {
              // console.log(e);
              // console.log("wordArray: " + wordArray);
              // console.log("wordArray[j] :" + j);
            }
          }
          if (tempWordScore > wordScore) {
            word = wordlist[i];
            wordScore = tempWordScore;
          }
        }
      }
      tempWordScore = 0;
    }

    return [word, wordScore];
  }

  letterCounter = (wordArray) => {
    var tiles = this.state.tiles;
    var letter = wordArray[0], counter = 1;

    for (var i = 1; i < wordArray.length; i++) {
      if (letter === wordArray[i]) {
        counter += 1;
        try {
          if (counter > tiles[letter].number) {
            return false;
          }
        } catch(e) {
          console.log(e);
          console.log(letter);
        }
      } else {
        counter = 1;
      }
      letter = wordArray[i];
    }
    return true;
  }

  computeMostValuableWords = () => {
    var mostValuableWords = [];

    for (var i = 1; i < 16; i++) {
      mostValuableWords.push(this.computeMostValuableWord(i));
    }

    this.setState({ mostValuableWords: mostValuableWords });
  }

  componentWillMount() {
    this.findAnagrams();
    this.computeMostValuableWords();
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>NSFs ordliste</h2>
        </div>
          <div className="Search">
            <h1>Søk i ordlisten</h1>
            <SearchFrame wordlist={this.state.wordlist}
                         onHandleClick={this.handleClick} />
            <SearchResultFrame test={this.state.test} searchWord={this.state.searchWord} />
          </div>
          <div className="Anagram">
            <h1>Finn anagrammer</h1>
            <AnagramsFrame serveAnagrams={this.serveAnagrams} />
            <AnagramsResultFrame specAnagrams={this.state.specificAnagrams} />
          </div>
          <div className="MostValuableWords">
            <MostValuableWords mostValuableWords={this.state.mostValuableWords} />
          </div>
      </div>
    );
  }
}

export default App;
