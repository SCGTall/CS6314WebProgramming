import React from 'react'
import { Form, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

const Videos = (props) => {
  return (
      
    <div>
      <div class="jumbotron">
        <form onSubmit={props.handleSubmit}>
          <div class="form-group">
            <h3>
              You can search videos here.
            </h3>
          </div>
          <div class="form-group">
            <input
              type="text"
              onChange={props.handleChange}
              defaultValue={props.state.temp}
              value={props.state.temp}
              placeholder="Search movie title"
            />
          </div>
          <button type="submit" class="btn btn-primary btn-lg">
            Search
          </button>
        </form>
      </div>

      <p>{props.state.title}</p>
      <p>{props.state.temp}</p>

      {props.state.videos.map((video) => (
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{video.title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">{video.genre}</h6>
            <p class="card-text">{video.description}</p>
            <p>
              {video.title}
              {props.state.title}
            </p>
            <p>
              {(video.title.search(props.state.title) != -1)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
};

export default Videos