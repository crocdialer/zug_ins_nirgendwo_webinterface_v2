import {postData, nodeCommand} from './App.js'
import React, { Component } from 'react';
import PlaylistControls, {PlayListChooser} from './PlaylistControls.js'
import './Playlist.css';

function MovieItem(props){
  let moveUpFn = ()=>{props.swapPlaylistIndicesFn(props.index, props.index - 1)}
  let moveDownFn = ()=>{props.swapPlaylistIndicesFn(props.index, props.index + 1)}
  let removeFn = ()=>{props.removePlaylistIndexFn(props.index)}

  // skip first index
  let addItemFn = (index)=>{props.addToPlaylistFn(props.movie.title, index + 1)}

  return(
    <div className="row movieItem">
      <div className="col-sm-2 col-2 movieThumb">
        {/* thumb: {props.movie.icon} */}
        <img src="img/default_icon.jpg" className="img-fluid movieThumb" alt={props.movie.icon}/>
      </div>
      <div className="col-sm-8 col-8 movieTitle">{props.movie.title}</div>

      {/* movie placement and deletion*/}
      {!props.isMainList &&
        <div className="col-sm-2 col-2 moviePlacer">
          <div className="row moviePlacer">
            <div className="col-sm-4"><a href="#" onClick={moveUpFn}>&uarr;</a></div>
            <div className="col-sm-4"><a href="#" onClick={moveDownFn}>&darr;</a></div>
            <div className="col-sm-4"><a href="#" onClick={removeFn}>-</a></div>
          </div>
        </div>
      }

      {/* add to playlist */}
      {props.isMainList &&
        <div className="col-sm-2 col-2">
          <PlayListChooser
            displayText = "add to"
            playlists = {props.playlists}
            selectItemFn = {addItemFn}
          />
        </div>
      }
    </div>
  );
}

function MovieList(props){
  let movies = props.movieList.map((movie, index)=>{
    return(
      <MovieItem
        key={index}
        index={index}
        movie={movie}
        playlists = {props.playlists.slice(1)}
        isMainList = {props.isMainList}
        swapPlaylistIndicesFn={props.swapPlaylistIndicesFn}
        removePlaylistIndexFn={props.removePlaylistIndexFn}
        addToPlaylistFn={props.addToPlaylistFn}
      />
    );
  });
  return movies;
}

class Playlist extends Component {

  constructor(props){
    super(props);
  }

  createMovieObjectList(playlist){
    let retList = []

    for(let i in playlist.movies){

      let movieTitle = playlist.movies[i]
      // console.log(movieTitle)

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
    let isMainList = (this.props.state.current_index === 0);

    return (
      <div className="container playlist">
        <PlaylistControls
          state = {this.props.state}
          setPlaylistFn = {this.props.setPlaylistFn}
          addNewPlaylistFn={this.props.addNewPlaylistFn}
          deletePlaylistFn={this.props.deletePlaylistFn}
        />
        <MovieList
          playlists = {this.props.state.playlists}
          movieList = {movieList}
          isMainList = {isMainList}
          swapPlaylistIndicesFn={this.props.swapPlaylistIndicesFn}
          removePlaylistIndexFn={this.props.removePlaylistIndexFn}
          addToPlaylistFn={this.props.addToPlaylistFn}
        />
        {/* {this.renderMovieList(movieList)} */}
      </div>
    );
  }
}

export default Playlist;
