import {postData, playerCommand} from './App.js'
import React, { Component } from 'react';
import PlaylistControls, {PlayListChooser} from './PlaylistControls.js'
import $ from 'jquery';
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

    if(props.playlistIndex <= 0){
      playerCommand("play", [props.movie.path])
      playerCommand("delay", [props.movie.delay])
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


  let delay_input_id = "delay_input"

  let movieSettingsFn = ()=>{
    let m = props.movie
    m.delay = parseFloat($("#" + delay_input_id).val())
    console.log(m)
    props.setMovieSettingsFn(m)
  }


  return(
    <div className={movieItemClass}>
      <div className="col-sm-4 col-4 movieThumb">
        {/* thumb: {props.movie.icon} */}
        <img onClick={iconClickHandler} src={icon_src} className="img-fluid movieThumb" alt={props.movie.icon}/>
      </div>
      <div className="col-sm-6 col-6 movieTitle">
        <p>{movieTitle}</p>
        {!props.isMainList &&
         <p>delay: {props.movie.delay}s</p>
        }
        {props.isMainList &&

          <form className="form-inline">
            <div className="form-group mx-sm-3 mb-2">
              <label htmlFor={delay_input_id} className="sr-only">{props.movie.delay}</label>
              <input type="text" className="form-control" id={delay_input_id} placeholder={props.movie.delay}/>
            </div>
            <button className="btn btn-secondary mb-2" onClick={movieSettingsFn}>ok</button>
          </form>
        }
      </div>

      {/* movie placement and deletion*/}
      {!props.isMainList &&
        <div className="col-sm-2 col-2 moviePlacer">
          <div className="row moviePlacer">
            <div className="col-sm-4"><a onClick={moveUpFn}>&uarr;</a></div>
            <div className="col-sm-4"><a onClick={moveDownFn}>&darr;</a></div>
            <div className="col-sm-4"><a onClick={removeFn}>-</a></div>
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
        setMovieSettingsFn={props.setMovieSettingsFn}
        />
      );
    });
  }
  return movies;
}

class Playlist extends Component {

  constructor(props){
    super(props);
    this.listRef = React.createRef()
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
      <div className="container playlist" ref={this.listRef}>
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
          setMovieSettingsFn={this.props.setMovieSettingsFn}
        />
        {/* {this.renderMovieList(movieList)} */}
      </div>
    );
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // are we changing the items in the list or load a new one?
    // new one: do nothing
    // else: capture the scroll position so we can adjust scroll later.
    if (prevProps.playlistIndex === this.props.playlistIndex) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }
}

export default Playlist;
