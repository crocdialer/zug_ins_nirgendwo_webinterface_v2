import {postData, playerCommand} from './App.js'
import React, { Component } from 'react';
import PlaylistControls, {PlayListChooser} from './PlaylistControls.js'
import './Playlist.css';

var api_host = "http://" + window.location.hostname +
  ( (window.location.port == 3000)  ? ":8080" : (":" + window.location.port))

function MovieItem(props){
  let moveUpFn = ()=>{props.swapPlaylistIndicesFn(props.index, props.index - 1)}
  let moveDownFn = ()=>{props.swapPlaylistIndicesFn(props.index, props.index + 1)}
  let removeFn = ()=>{props.removePlaylistIndexFn(props.index)}

  // skip first index
  let addItemFn = (index)=>{props.addToPlaylistFn(props.movie, index + 1)}

  // thumbnail
  let icon_src = props.movie.icon.length == 0 ? "img/default_icon.jpg" : (api_host + props.movie.icon)
  let iconClickHandler = ()=>{
    console.log("clicked: " + props.movie.path)

    if(props.playlistIndex === 0){
      playerCommand("play", [props.movie.path])
    }
    else{
      props.playbackFn(props.index, props.playlistIndex)
    }
  }

  let movieItemClass = "row movieItem"
  if(props.active){
    movieItemClass += " active"
  }

  let movieTitle = props.movie.path.substring(props.movie.path.lastIndexOf('/') + 1);
  movieTitle = movieTitle.substring(0, movieTitle.lastIndexOf('.'))

  return(
    <div className={movieItemClass}>
      <div className="col-sm-3 col-3 movieThumb">
        {/* thumb: {props.movie.icon} */}
        <img onClick={iconClickHandler} src={icon_src} className="img-fluid movieThumb" alt={props.movie.icon}/>
      </div>
      <div className="col-sm-7 col-7 movieTitle">
        <p>{movieTitle}</p>
      </div>

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
            alignRight = {true}
          />
        </div>
      }
    </div>
  );
}

function MovieList(props){
  let movies = []

  if(props.movieList != undefined){
    movies = props.movieList.map((movie, index)=>{
      return(
        <MovieItem
        key={index}
        index={index}
        playlistIndex={props.playlistIndex}
        active={props.isSelected && (index === props.movieIndex)}
        movie={movie}
        playlists = {props.playlists.slice(1)}
        isMainList = {props.isMainList}
        swapPlaylistIndicesFn={props.swapPlaylistIndicesFn}
        removePlaylistIndexFn={props.removePlaylistIndexFn}
        addToPlaylistFn={props.addToPlaylistFn}
        playbackFn={props.playbackFn}
        />
      );
    });
  }
  return movies;
}

class Playlist extends Component {

  constructor(props){
    super(props);
    this.playback = this.playback.bind(this)
  }

  playback(movieIndex, playlistIndex){
    postData(this.props.api_host + "/playback", {movie_index: movieIndex, playlist_index: playlistIndex})
  }

  render() {
    let api_host = this.props.api_host;
    let current_index = this.props.state.current_index >= 0 ? this.props.state.current_index : 0
    let currentPlaylist = this.props.state.playlists.length > current_index ?
      this.props.state.playlists[current_index] : []
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
          movieList = {currentPlaylist ? currentPlaylist.movies : []}
          movieIndex = {this.props.state.playState.movie_index}
          playlistIndex={this.props.state.current_index}
          isSelected={this.props.state.current_index === this.props.state.playState.playlist_index}
          isMainList = {isMainList}
          swapPlaylistIndicesFn={this.props.swapPlaylistIndicesFn}
          removePlaylistIndexFn={this.props.removePlaylistIndexFn}
          addToPlaylistFn={this.props.addToPlaylistFn}
          playbackFn={this.playback}
        />
        {/* {this.renderMovieList(movieList)} */}
      </div>
    );
  }
}

export default Playlist;
