import {postData, nodeCommand} from './App.js'
import React, { Component } from 'react';
import './PlaybackComponent.css';

function PlaybackButton(props){
  // title, handler
  let clickHandler = ()=>{console.log("button: " + props.title);}

  return(
    <div className="col-sm-2 col-2">
      <button className="transport_button" onClick={clickHandler}>{props.title}</button>
    </div>);
}

function PlaybackComponent(props){
  let dummyHandler = ()=>{console.log("button handler");}
    return(
      <div className="container playbackComponent">
        <div className="row">
          {/* spacer */}
          <div className="col-sm-1 col-1"/>
          <PlaybackButton
            title="<"
            handler={dummyHandler}
          />
          <PlaybackButton
            title="<<"
            handler={dummyHandler}
          />
          <PlaybackButton
            title="&#9654; ||"
            handler={dummyHandler}
          />
          <PlaybackButton
            title=">>"
            handler={dummyHandler}
          />
          <PlaybackButton
            title=">"
            handler={dummyHandler}
          />
          {/* spacer */}
          <div className="col-sm-1 col-1"/>
        </div>
      </div>
    );
}

export default PlaybackComponent;
