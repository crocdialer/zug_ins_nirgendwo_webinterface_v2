import {postData, nodeCommand} from './App.js'
import React, { Component } from 'react';
import './Movielist.css';

class Movielist extends Component {

  render() {

    return (
      <div className="container movieList">
        <div className="col-sm-10 col-10">
          movie-library
        </div>
      </div>
    );
  }
}

export default Movielist;
