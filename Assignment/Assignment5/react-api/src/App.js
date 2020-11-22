import React, {Component} from 'react';
import Videos from './components/videos';


    class App extends Component {

      constructor(props) {
        super(props);
        this.state = { videos: [], keywords: [], temp: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      componentDidMount() {
        fetch('http://localhost:3000/api/videos')
        .then(res => res.json())
        .then((data) => {
          this.setState({ videos: data })
        })
        .catch(console.log)
      }

      render () {
        let selected = [];
        if (this.state.keywords === undefined || this.state.keywords.length === 0){
          selected = this.state.videos;
        } else {
          this.state.videos.forEach((video) => {
            let flag = true;
            for (let i = 0; i < this.state.keywords.length; i++) {
              if (flag && video.title.toLowerCase().search(this.state.keywords[i]) === -1) {
                flag = false;
              }
            }
            if (flag) {
              selected.push(video);
            }
          })
        }
        return (
          <div>
            <div class="jumbotron">
              <form onSubmit={this.handleSubmit}>
                <div class="form-group">
                  <h3>
                    You can search videos here.
                  </h3>
                </div>
                <div class="form-group">
                  <input
                    type="text"
                    onChange={this.handleChange}
                    defaultValue={this.state.temp}
                    value={this.state.temp}
                    placeholder="Search movie title"
                  />
                </div>
                <button type="submit" class="btn btn-primary btn-lg">
                  Search
                </button>
              </form>
            </div>
            
            {selected.map((video) => (
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">{video.title}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">{video.genre}</h6>
                  <p class="card-text">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        )
      }

      handleChange(e) {
        this.setState({temp: e.target.value});
      }

      handleSubmit(e) {
        e.preventDefault();
        this.setState({ keywords: this.state.temp.trim().toLowerCase().split(' ') });
      }


    }

    export default App;