import {postData, nodeCommand} from './App.js'
import React, { Component } from 'react';
import './Playlist.css';

function MovieItem(props){

}

class Playlist extends Component {

  renderMovieList(movieList){
    let movies = movieList.map((movie)=>{
      return(
        <div className="row">
          <div className="col-sm-2 col-2">
            thumb
          </div>
          <div className="col-sm-10 col-10">{movie.title}</div>
        </div>
      );
    });
    return movies;
  }

  createMovieObjectList(){
    let retList = []

    for(let i in this.props.playlist.movies){

      let movieTitle = this.props.playlist.movies[i]
      console.log(movieTitle)

      // lookup movie_obj by title
      for (let j in this.props.movies){
        let movieObj = this.props.movies[j]

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
    let movieList = this.createMovieObjectList()
    return (
      <div className="container playlist">
        <div className="col-sm-10 col-10">
          <h2>
            movies
          </h2>
        </div>
        {this.renderMovieList(movieList)}
      </div>
    );
  }
}

export default Playlist;
