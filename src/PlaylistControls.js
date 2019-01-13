import {postData, nodeCommand} from './App.js'
import React, { Component } from 'react';
import $ from 'jquery';
import './PlaylistControls.css';

function PlayListChooserItem(props){
  return(
    <a className="dropdown-item" href="#" onClick={props.onClick}>{props.title}</a>
  );
}

function PlayListChooser(props){

  let chooserItems = props.playlists.map((playlist, index)=>{
      return(
        <PlayListChooserItem
          key = {index}
          title = {playlist.title}
          onClick = {()=>{props.selectItemFn(index)}}
        />
      );
  });

  return(
    <div className="dropdown">
      <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {props.displayText}
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {chooserItems}
      </div>
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////////////////////////

function PlayListAddNew(props){
  let title_input_id = "playlistTitleInput"
  let addFn = ()=>{ props.addNewPlaylistFn($("#" + title_input_id).val())}

  return(
    <div>
      {/* Button trigger modal */}
      <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#newPlaylistModal">
        add
      </button>

      {/* Modal */}
      <div className="modal fade" id="newPlaylistModal" tabIndex="-1" role="dialog" aria-labelledby="newPlaylistModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="newPlaylistModalLabel">enter a name for the new playlist</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <input type="text" className="form-control" id={title_input_id} placeholder="enter name ..."/>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={addFn}>Ok</button>
            </div>
          </div>
        </div>
      </div>
    </div>);
}

////////////////////////////////////////////////////////////////////////////////////////////////////

function PlayListDelete(props){

  let isDisabled = props.state.current_index === 0;
  let deleteFn = ()=>{ props.deletePlaylistFn(props.state.current_index) }

  return(
    <div>
      {/* Button trigger modal */}
      <button type="button" className="btn btn-primary" data-toggle="modal" disabled={isDisabled}
        data-target="#deletePlaylistModal">
        delete
      </button>

      {/* Modal */}
      <div className="modal fade" id="deletePlaylistModal" tabIndex="-1" role="dialog"
        aria-labelledby="deletePlaylistModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deletePlaylistModalLabel">
                "{props.state.playlists[props.state.current_index].title}" will be deleted ...
              </h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              are you sure?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" data-dismiss="modal"
                onClick={deleteFn}>Ok</button>
            </div>
          </div>
        </div>
      </div>
    </div>);
}

////////////////////////////////////////////////////////////////////////////////////////////////////

class PlaylistControls extends Component {

  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className="row playlistControls">
        <div className="col-sm-3 col-3">
          <PlayListChooser
            displayText = {this.props.state.playlists[this.props.state.current_index].title}
            playlists = {this.props.state.playlists}
            selectItemFn = {this.props.setPlaylistFn}
          />
        </div>
        <div className="col-sm-1 col-1">
          <PlayListAddNew
            state = {this.props.state}
            addNewPlaylistFn = {this.props.addNewPlaylistFn}
          />
        </div>
        <div className="col-sm-1 col-1">
          <PlayListDelete
            state = {this.props.state}
            deletePlaylistFn = {this.props.deletePlaylistFn}
          />
        </div>
      </div>
    );
  }
}

export default PlaylistControls;
export {PlayListChooser}
