import {postData, nodeCommand} from './App.js'
import React, { Component } from 'react';
import './PlaylistControls.css';

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

class PlaylistControls extends Component {

  render(){
    return(
      <div className="col-sm-4 col-4">
        <PlayListChooser
          state = {this.props.state}
          setPlayListFn = {this.props.setPlayListFn}
        />
      </div>
    );
  }
}

export default PlaylistControls;
