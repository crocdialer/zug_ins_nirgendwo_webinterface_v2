import {playerCommand} from './App.js'
import React, { Component } from 'react';
import './PlaybackComponent.css';

function secsToTimeString(secs){
  // var sec_num = parseInt(this, 10); // don't forget the second param
    secs = Math.round(secs);
    var hours   = Math.floor(secs / 3600);
    var minutes = Math.floor((secs - (hours * 3600)) / 60);
    var seconds = secs - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

function PlaybackButton(props){
  // title, handler
  let clickHandler = props.handler//()=>{console.log("button: " + props.title);}
  let transportClass = "transport_button" + (props.active ? " active" : "")

  return(
    <div className="col-sm-2 col-2">
      <button className={transportClass} onClick={clickHandler}>{props.title}</button>
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

  // fast backward (-10x)
  fastBackward = ()=>{
    let rate = (this.props.playState.rate == 1 ? -10 : 1)
    playerCommand("set_rate", [rate]);
  }


  render(){

    let movieTitle = this.props.playState.path.substring(this.props.playState.path.lastIndexOf('/') + 1);
    movieTitle = movieTitle.substring(0, movieTitle.lastIndexOf('.'))

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
            // handler={()=>{playerCommand("skip", [-10.0]);}}
            handler={this.fastBackward}
            active={this.props.playState.rate < 1}
          />
          <PlaybackButton
            title="&#9654;||"
            handler={this.playPause}
            active={this.props.playState.playing}
          />
          <PlaybackButton
            title=">>"
            handler={this.fastForward}
            active={this.props.playState.rate > 1}
          />
          <PlaybackButton
            title=">"
            handler={()=>{playerCommand("next");}}
          />
          {/* spacer */}
          <div className="col-sm-1 col-1"/>
        </div>
        <div className="row">
          <div className="col-sm-12 col-12">
            <p className="timeDisplay">
              {secsToTimeString(this.props.playState.position)} / {secsToTimeString(this.props.playState.duration)}
            </p>
            <p className="titleDisplay">
              {movieTitle}
            </p>
          </div>
        </div>
      </div>
    );
  }
}



export default PlaybackComponent;
