import React, {Component} from 'react';
import Videos from './components/videos';


    class App extends Component {

      state = {
        videos: []
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
         return (
          <Videos videos={this.state.videos} />
        )

        



      }
    }

    export default App;