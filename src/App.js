import React, { Component } from 'react';
import './App.css';
import NavBar from './NavBar';
import PlaybackComponent from './PlaybackComponent';
import Playlist from './Playlist';
import Movielist from './Movielist';

var api_host = "http://" + window.location.hostname +
  ( (window.location.port === 3000)  ? ":8080" : (":" + window.location.port))

class App extends Component {

  state =
  {
      current_index : 1,
      playlists: [
        {
          title: "playlist_01",
          movies:["Reise nach Poopmandoo"]
        },
        {
          title: "playlist_02",
          movies:["Schrecken einer Ehe 5", "Tufftufftuff die Eisenbahn"]
        }
      ],
      movies:[
        {
          title:"Reise nach Poopmandoo",
          icon:"path/to/icon.png",
          delay: 50
        },
        {
          title:"Das ist der laengste Filmtitel auf der ganzen Welt - Reloaded & Director's Cut von 1989 in der DDR",
          icon:"path/to/icon.png",
          delay: 50
        },
        {
          title:"Schrecken einer Ehe 5",
          icon:"path/to/icon.png",
          delay: 250
        },
        {
          title:"Tufftufftuff die Eisenbahn",
          icon:"path/to/icon.png",
          delay: -50
        }
      ]
  };

  constructor(props){
    super(props);
    this.api_host = api_host

    // register event-stream
    this.eventSource = new EventSource(this.api_host + "/events")

    // fires only for unnamed events
    // this.eventSource.onmessage = this.handleSSE
    // this.eventSource.addEventListener('node', this.handleNodeEvent, false);
    // this.eventSource.addEventListener('commands', this.handleCommandEvent, false);

    this.state.playlists.unshift({title: "All", movies: this.createAllMoviesList()});

    // function binding
    this.setCurrentPlaylist = this.setCurrentPlaylist.bind(this);
    this.addNewPlaylist = this.addNewPlaylist.bind(this);
    this.deletePlaylist = this.deletePlaylist.bind(this);
    this.swapPlaylistIndices = this.swapPlaylistIndices.bind(this);
    this.removePlaylistIndex = this.removePlaylistIndex.bind(this)
  }

  setCurrentPlaylist(index){
      if(index >= 0 && index < this.state.playlists.length){
        // console.log("setCurrentPlaylist: " + index)
        this.setState(Object.assign(this.state, {current_index: index}));
      }
  }

  addNewPlaylist(title){
    console.log("addNewPlaylist:\n" + title)
    let newState = this.state;
    newState.playlists.push({title: title, movies:[]})
    this.setState(newState)
  }

  deletePlaylist(index){
    console.log("deletePlaylist:\n" + index)

    // skip first entry (implicit "All" playlist)
    if(index >= 1 && index < this.state.playlists.length){
      let newState = this.state;
      newState.playlists.splice(index, 1)
      newState.current_index = Math.min(newState.current_index, newState.playlists.length - 1)
      this.setState(newState)
    }
  }

  swapPlaylistIndices(lhsIndex, rhsIndex){

    let movies = this.state.playlists[this.state.current_index].movies

    // clamp indices
    let numItems = movies.length;
    lhsIndex = clamp(lhsIndex, 0, numItems - 1)
    rhsIndex = clamp(rhsIndex, 0, numItems - 1)

    // console.log("swap:" + lhsIndex + " <-> " + rhsIndex)

    // do nothing for equal indices
    if(lhsIndex !== rhsIndex){
      // ES6 fancy swap with "Destructuring Assignment Array Matching"
      [movies[lhsIndex], movies[rhsIndex]] = [movies[rhsIndex], movies[lhsIndex]]

      let newState = this.state;
      newState.playlists[newState.current_index].movies = movies
      this.setState(newState)
    }
  }

  removePlaylistIndex(index){
    let movies = this.state.playlists[this.state.current_index].movies
    console.log("remove playlist-item: " + index)
    if(index >= 0 && index < movies.length){

      movies.splice(index, 1)
      let newState = this.state;
      newState.playlists[newState.current_index].movies = movies
      this.setState(newState)
    }
  }

  createAllMoviesList = ()=>{
    let allMovies = [];
    for (let i in this.state.movies){
      allMovies.push(this.state.movies[i].title)
    }
    return allMovies;
  }

  render() {
    return (
      <div className="zug_ins_nirgendwo_ui">
        <NavBar
          api_host={this.api_host}
        />
        <PlaybackComponent
          api_host={this.api_host}
        />
        <Playlist
          api_host={this.api_host}
          state={this.state}
          setPlaylistFn={this.setCurrentPlaylist}
          deletePlaylistFn={this.deletePlaylist}
          addNewPlaylistFn={this.addNewPlaylist}
          swapPlaylistIndicesFn={this.swapPlaylistIndices}
          removePlaylistIndexFn={this.removePlaylistIndex}
        />
        {/* <Movielist
          state = {this.state}
        /> */}
      </div>
    );
  }

  update = () => {
      fetch(this.api_host + "/movies")
        .then(response => response.json())
        .then(nodeList => this.setState({ nodeList }))
        .catch(error => console.error(error));
  }

  componentDidMount() {
    // this.update();
    // this.interval = setInterval(this.update, 1000);
  }

  componentWillUnmount() {
    // clearInterval(this.interval);
  }
}

export default App;

////////////////////////////////////////////////////////////////////////////////////////////////////

export function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

export function postData(url = ``, data = {}) {
  // Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()) // parses response to JSON
    .catch(error => console.error(error));
}

export function nodeCommand(dst = 0, command = "", args = []){
    postData(api_host + "/nodes/cmd", {dst : dst, cmd : command, arg: args})
}
