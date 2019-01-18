import $ from 'jquery';
import {postData, nodeCommand} from './App.js'
import React, { Component } from 'react';
import './NavBar.css';

function NodeMenuItem(props){
    return(
      <li className="dropdown-item" onClick={props.onClick}>
        {/* <a className={props.enabled ? "enabled" : ""} href="#">{props.title}</a> */}
      </li>
    );
}

class NavBar extends Component {
  render() {
    let api_host = this.props.api_host;
    let saveFn = ()=>{$.get(api_host + "/save");}
    let loadFn = ()=>{
      $.get(api_host + "/load");
      this.props.updateFn();
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="/">Zug ins Nirgendwo</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">

            <li className="nav-item">
              <a className="nav-link" href="#" onClick={saveFn}>save</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#" onClick={loadFn}>load</a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default NavBar;
