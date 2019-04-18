import React, { Component } from 'react';
import Navigation from './Components/Navigation/navigation.js';
import Logo from './Components/Logo/Logo.js';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js';
import Rank from './Components/Rank/Rank.js';
import Signin from './Components/Signin/Signin.js';
import Register from './Components/Register/Register.js';
import Particles from 'react-particles-js';
import './App.css';

const particleOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
    input: '',
    imageURL: '',
    box: {},
    route: 'signin',
    isSignedin: false,
    users: {
      id: '',
      name: '',
      email: '',
      password: '',
      entries: 0,
      joined: ''
    }
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  componentDidMount() {
    fetch('https://salty-basin-15434.herokuapp.com/')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log('Unable to connect fetch root'))
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
       leftCol: clarifaiFace.left_col * width,
       topRow: clarifaiFace.top_row * height,
       rightCol: width - (clarifaiFace.right_col * width),
       bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    fetch('https://salty-basin-15434.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(res => res.json())
    .then(response => {
      if(response){
        fetch('https://salty-basin-15434.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.users.id
          })
        })
        .then(res => res.json())
        .then(count => {
          this.setState(Object.assign(this.state.users, {
            entries: count
          }))
        })
        .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log('There was an Error,', err))
  }

  onRouteChange = (route) => {
    if(route === 'signOut'){
      this.setState(initialState);
    } else if (route === 'home'){
      this.setState({isSignedin: true})
    }
    this.setState({route: route});
  }

  loadUser = (data) => {
    this.setState({
      users: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  render() {
    const { isSignedin, imageURL, route, box } = this.state;
    return (
      <div className="App">
      <Particles className='particles'
      params={particleOptions}
      />
      <Navigation onRouteChange={this.onRouteChange} isSignedin={isSignedin}/>
      { route === 'home'
        ? <div>
            <Logo />
            <Rank name={this.state.users.name} entries={this.state.users.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition imageURL={imageURL} box={box}/>
          </div>
        : (
          route === 'register'
          ? <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
          : <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )
      }
      </div>
    );
  }
}

export default App;
