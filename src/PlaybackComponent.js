import {playerCommand} from './App.js'
import React, { Component } from 'react';
import './PlaybackComponent.css';

function rewind(secs){

}

function PlaybackButton(props){
  // title, handler
  let clickHandler = props.handler//()=>{console.log("button: " + props.title);}

  return(
    <div className="col-sm-2 col-2">
      <button className="transport_button" onClick={clickHandler}>{props.title}</button>
    </div>);
}

class PlaybackComponent extends Component {
  constructor(props){
    super(props);
  }

  // play/pause
  playPause = ()=>{
    playerCommand("toggle_pause");
  }

  // fast forward (10x)
  fastForward = ()=>{
    let rate = (this.props.playState.rate == 1 ? 10 : 1)
    playerCommand("set_rate", [rate]);
  }

  render(){

    return(
      <div className="container playbackComponent">
        <div className="row">
          {/* spacer */}
          <div className="col-sm-1 col-1"/>
          <PlaybackButton
            title="<"
            handler={()=>{playerCommand("prev")}}
          />
          <PlaybackButton
            title="<<"
            handler={()=>{playerCommand("skip", [-10.0]);}}
          />
          <PlaybackButton
            title="&#9654;||"
            handler={this.playPause}
          />
          <PlaybackButton
            title=">>"
            handler={this.fastForward}
          />
          <PlaybackButton
            title=">"
            handler={()=>{playerCommand("next");}}
          />
          {/* spacer */}
          <div className="col-sm-1 col-1"/>
        </div>
      </div>
    );
  }
}



export default PlaybackComponent;
