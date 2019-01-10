import {postData, nodeCommand} from './App.js'
import React, { Component } from 'react';
import './Playlist.css';

function MovieItem(props){

}

class Playlist extends Component {

  renderMovieList(movieList){
    let movies = movieList.map((movie)=>{
      return(
        <div className="row">
          <div className="col-sm-2 col-2">
            thumb
          </div>
          <div className="col-sm-10 col-10">{movie.title}</div>
        </div>
      );
    });
    return movies;
  }

  render() {
    let api_host = this.props.api_host;

    return (
      <div className="container playlist">
        <div className="col-sm-10 col-10">
          <h2>
            movies
          </h2>
        </div>
        {this.renderMovieList(this.props.movies)}
      </div>
    );
  }
}

export default Playlist;
