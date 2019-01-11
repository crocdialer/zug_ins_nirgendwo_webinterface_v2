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

function PlayListChooserItem(props){
  return(
    <a className="dropdown-item" href="#" onClick={props.onClick}>{props.title}</a>
  );
}

function PlayListChooser(props){

  let chooserItems = props.state.playlists.map((playlist, index)=>{
      return(
        <PlayListChooserItem
          key = {index}
          title = {playlist.title}
          onClick = {()=>{props.setPlayListFn(index)}}
        />
      );
  });

  return(
    <div className="dropdown">
      <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {props.state.playlists[props.state.current_index].title}
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {chooserItems}
      </div>
    </div>
  );
}

class Playlist extends Component {

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
          setPlayListFn = {this.props.setPlayListFn}
        />
        {this.renderMovieList(movieList)}
      </div>
    );
  }
}

export default Playlist;
