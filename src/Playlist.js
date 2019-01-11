import {postData, nodeCommand} from './App.js'
import React, { Component } from 'react';
import PlaylistControls from './PlaylistControls.js'
import './Playlist.css';

function MovieItem(props){
  return(
    <div className="row playListItem">
      <div className="col-sm-2 col-2">
        thumb: {props.movie.icon}
      </div>
      <div className="col-sm-10 col-10">{props.movie.title}</div>
    </div>
  );
}

class Playlist extends Component {

  constructor(props){
    super(props);
  }

  renderMovieList(movieList){
    let movies = movieList.map((movie, index)=>{
      return(
        <MovieItem
          key={index}
          movie={movie}
        />
      );
    });
    return movies;
  }

  createMovieObjectList(playlist){
    let retList = []

    for(let i in playlist.movies){

      let movieTitle = playlist.movies[i]
      console.log(movieTitle)

      // lookup movie_obj by title
      for (let j in this.props.state.movies){
        let movieObj = this.props.state.movies[j]

          if(movieObj.title == movieTitle){
            retList.push(movieObj);
            break;
          }
      }
    }
    return retList;
  }

  render() {
    let api_host = this.props.api_host;
    let currentPlaylist = this.props.state.playlists[this.props.state.current_index]
    let movieList = this.createMovieObjectList(currentPlaylist)

    return (
      <div className="container playlist">
        <PlaylistControls
          state = {this.props.state}
          setPlaylistFn = {this.props.setPlaylistFn}
          addNewPlaylistFn={this.props.addNewPlaylistFn}
          deletePlaylistFn={this.props.deletePlaylistFn}
        />
        {this.renderMovieList(movieList)}
      </div>
    );
  }
}

export default Playlist;
