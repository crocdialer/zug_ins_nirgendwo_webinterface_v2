import React, { Component } from 'react';
import './App.css';
import NavBar from './NavBar';
import PlaybackComponent from './PlaybackComponent';
import Playlist from './Playlist';

var api_host = "http://" + window.location.hostname +
  ( (window.location.port === 3000)  ? ":8080" : (":" + window.location.port))

class App extends Component {

  constructor(props){
    super(props);
    this.api_host = api_host

    // register event-stream
    this.eventSource = new EventSource(this.api_host + "/events")

    // fires only for unnamed events
    // this.eventSource.onmessage = this.handleSSE
    // this.eventSource.addEventListener('node', this.handleNodeEvent, false);
    // this.eventSource.addEventListener('commands', this.handleCommandEvent, false);

    // console.log(this.state.playlists[this.state.current_index]);
  }
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
          playlist={this.state.playlists[this.state.current_index]}
          movies={this.state.movies}
        />
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
