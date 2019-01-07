import {postData, nodeCommand} from './App.js'
import React, { Component } from 'react';
import './Playlist.css';

class Playlist extends Component {
  render() {
    let api_host = this.props.api_host;

    return (
      <div className="playlist">
        Playlist
      </div>
    );
  }
}

export default Playlist;
