import React, { Component } from 'react';
import './App.css';
import NavBar from './NavBar';
import PlaybackComponent from './PlaybackComponent';
import Playlist from './Playlist';
import Movielist from './Movielist';

var api_host = "http://" + window.location.hostname +
  ( (window.location.port == 3000)  ? ":8080" : (":" + window.location.port))

class App extends Component {

  state =
  {
      current_index : 0,

      playState : {
        playlist_index : -1,
        movie_index : -1,
        position : 0.0,
        duration : 0.0,
        rate : 1.0,
        volume : 1.0,
        playing: false
      },

      playlists: [
        {
          title: "All Movies",
          movies:[
            // {
            //   path:"/path/to/Reise nach Poopmandoo.mp4",
            //   icon:""
            // }
          ]
        }
      ]
  };

  constructor(props){
    super(props);
    this.api_host = api_host

    // this.state.playlists.unshift({title: "All Movies", movies: this.createAllMoviesList()});

    // function binding
    this.handleCommandACK = this.handleCommandACK.bind(this)
    this.handlePlayStateEvent = this.handlePlayStateEvent.bind(this)
    this.setCurrentPlaylist = this.setCurrentPlaylist.bind(this);
    this.addNewPlaylist = this.addNewPlaylist.bind(this);
    this.deletePlaylist = this.deletePlaylist.bind(this);
    this.swapPlaylistIndices = this.swapPlaylistIndices.bind(this);
    this.removePlaylistIndex = this.removePlaylistIndex.bind(this);
    this.addToPlaylist = this.addToPlaylist.bind(this);
    this.onPlaylistsModified = this.onPlaylistsModified.bind(this);

    // register event-stream
    this.eventSource = new EventSource(this.api_host + "/events")

    // fires only for unnamed events
    // this.eventSource.onmessage = this.handleSSE
    this.eventSource.addEventListener('commandACK', this.handleCommandACK, false);
    this.eventSource.addEventListener('playstate', this.handlePlayStateEvent, false);
  }

  handleCommandACK(e){
    // {"command":{"id":2,"cmd":"toggle_pause","arg":[]},"success":true,"value":null}

      let ack = JSON.parse(e.data)
      console.log(ack)

      if(ack.command.cmd == "playstate"){
        let ps = JSON.parse(ack.value)
        // console.log(ps)
        this.setState({playState: ps})
      }
  }

  handlePlayStateEvent(e){
    let ps = JSON.parse(e.data)
    // console.log(e.data)
    this.setState({playState: ps});
  }

  setCurrentPlaylist(index){
      if(index >= 0 && index < this.state.playlists.length){
        // console.log("setCurrentPlaylist: " + index)
        this.setState(Object.assign(this.state, {current_index: index}));

        //this.state.playState.playlist_index

        // send playlist to media_player
        // let compList = [{
        //   name: "media_player",
        //   properties:[
        //     {
        //       name : "playlist",
        //       type : "string_array",
        //       value : this.state.playlists[index].movies
        //     }
        //   ]
        // }]
        // console.log(compList)
      }
  }

  addNewPlaylist(title){
    console.log("addNewPlaylist:\n" + title)
    let newState = this.state;
    newState.playlists.push({title: title, movies:[]})
    this.setState(newState)

    // send changes to backend
    this.onPlaylistsModified();
  }

  deletePlaylist(index){
    console.log("deletePlaylist:\n" + index)

    // skip first entry (do not delete "All Movies" playlist)
    if(index >= 1 && index < this.state.playlists.length){
      let newState = this.state;
      newState.playlists.splice(index, 1)
      newState.current_index = Math.min(newState.current_index, newState.playlists.length - 1)
      this.setState(newState)
    }

    // send changes to backend
    this.onPlaylistsModified();
  }

  addToPlaylist(movieObj, playlistIndex){
    console.log("addToPlaylist: " + movieObj + " -> playlist " + playlistIndex)
    let newState = this.state;
    newState.playlists[playlistIndex].movies.push(movieObj);
    this.setState(newState);

    // send changes to backend
    this.onPlaylistsModified();
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

    // send changes to backend
    this.onPlaylistsModified();
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

    // send changes to backend
    this.onPlaylistsModified();
  }

  onPlaylistsModified(){
    postData(api_host + "/playlists", this.state.playlists)
  }

  render() {
    return (
      <div className="zug_ins_nirgendwo_ui">
        <NavBar
          api_host={this.api_host}
        />
        <PlaybackComponent
          api_host={this.api_host}
          playState={this.state.playState}
        />
        <Playlist
          api_host={this.api_host}
          state={this.state}
          setPlaylistFn={this.setCurrentPlaylist}
          deletePlaylistFn={this.deletePlaylist}
          addNewPlaylistFn={this.addNewPlaylist}
          addToPlaylistFn={this.addToPlaylist}
          swapPlaylistIndicesFn={this.swapPlaylistIndices}
          removePlaylistIndexFn={this.removePlaylistIndex}
        />
      </div>
    );
  }

  update = () => {

    fetch(this.api_host + "/playlists")
      .then(response => response.json())
      .then(playlists => this.setState({ playlists }))
      .catch(error => console.error(error));

    // playbackstate
    fetch(this.api_host + "/playstate")
      .then(response => response.json())
      .then(playState => this.setState({ playState }))
      .catch(error => console.error(error));
  }

  componentDidMount() {
    this.update();
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

export function playerCommand(command = "", args = []){
    postData(api_host + "/cmd", {cmd : command, arg: args})
}
