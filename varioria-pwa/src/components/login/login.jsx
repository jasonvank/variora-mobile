import 'regenerator-runtime/runtime'
// import 'typeface-roboto'
import 'antd-mobile/dist/antd-mobile.css'
import './login.css'

import { Icon, WhiteSpace } from 'antd-mobile';
import {
  faFacebook,
  faGoogle
} from '@fortawesome/free-brands-svg-icons'
import {
  faUserPlus,
  faUsers
} from '@fortawesome/free-solid-svg-icons'

import Card from '@material-ui/core/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Logo from '../../logo.svg'
import MButton from '@material-ui/core/Button';
import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import axios from 'axios'
import { library } from '@fortawesome/fontawesome-svg-core'
// import { MySnackbarContentWrapper } from './components/alert_message.jsx'

library.add(faFacebook, faGoogle, faUsers, faUserPlus)

/*eslint no-undef: "off"*/
class Login extends React.Component {

  constructor(props) {
    super()
    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFToken'

    this.state = {
      isAuthenticated: false,
      username: '',
      password: '',
      token: '',
      errorMessage: false,
    }

    this.clickLogin = function () {
      const apiBaseUrl = "/api";
      const payload = {
        "emailAddress": this.state.username,
        "password": this.state.password,
      }

      const self = this
      axios.post(apiBaseUrl + '/login/', payload)
        .then(function (response) {
          if (response.status === 200) {
            // window.location.replace('/');
            alert('login success')
            // TODO: to navigate to dashboard
          }
        })
        .catch(function (error) {
          console.log(error)
          self.setState({ errorMessage: true })
        });
    }

    this.facebookLogin = () => {
      FB.login(function (response) {
        const payload = response.authResponse
        axios.post('/api/login/fb/', payload).then((response) => {
          window.location.href = '/'
        }).catch(e => {
          // TODO: notification
        })
      }, { scope: 'email' })  // TODO: get user' friends also
    }

    this.handleMessageClose = (event, reason) => {
      if (reason === 'clickaway') {
        return
      }
      this.setState({ errorMessage: false })
    }
  }

  componentDidMount() {
    const self = this
    function loadFBSdk(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) return
      js = d.createElement(s); js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    }
    loadFBSdk(document, 'script', 'facebook-jssdk')
    window.fbAsyncInit = function () {
      FB.init({
        appId: '213151942857648',  // TODO:
        cookie: true,
        xfbml: true,
        version: 'v3.0'
      })
      FB.AppEvents.logPageView()
      self.setState({ fbLoginButtonLoading: false })
    }


    var auth2 = undefined
    function attachSignin(element) {
      auth2.attachClickHandler(element, {},
        function (googleUser) {
          axios.post('/api/login/google/', {
            id_token: googleUser.getAuthResponse().id_token
          }).then((response) => {
            window.location.href = '/'
          }).catch(e => {
            console.log(e.response)
          })
        }, function (error) {
          console.log(JSON.stringify(error, undefined, 2))
        }
      )
    }
    gapi.load('auth2', function () {
      auth2 = gapi.auth2.init({
        clientID: 'c9e686e3-bae8-4a0d-bcf1-26de09761807',
        graphScopes: ['User.ReadBasic.All', 'User.Read', 'user.read', 'user.readbasic.all']
      })
      attachSignin(document.getElementById('google-button'))
    })
  }


  render() {
    return (
      <div>
        <Card id="login-card">

          <div className="social" id="logo-div">
            <img id='logo' src={Logo} />
          </div>

          <div className="social">
            <MButton
              // onClick = {() => this.setState({ showSettleUpModal: true })}
              variant="contained" size="small"
              id="google-button"
              className="social-button"
            >
              <FontAwesomeIcon icon={['fab', 'google']} className="social-icon" />
              <span className="social-text">Log in with Google</span>
            </MButton>
          </div>


          <WhiteSpace size="lg" />
          <WhiteSpace size="lg" />

          <div className="social">
            <MButton
              // onClick = {() => this.setState({ showSettleUpModal: true })}
              variant="contained" color="primary" size="small"
              id="facebook-button"
              className="social-button"
              onClick={this.facebookLogin}
            >
              <FontAwesomeIcon icon={['fab', 'facebook']} className="social-icon" />
              <span className="social-text">Log in with Facebook</span>
            </MButton>
          </div>

          <WhiteSpace size="lg" />
          <WhiteSpace size="lg" />




          <div style={{ textAlign: 'center' }}>
            <TextField
              className="input-width"
              label="Email Address"
              value={this.state.username}
              onChange={(event) => {
                this.setState({ username: event.target.value })
              }}
            />
            <WhiteSpace size="lg" />
            <TextField
              className="input-width"
              type="password"
              label="Password"
              value={this.state.password}
              onChange={(event) => this.setState({ password: event.target.value })}
            />
          </div>

          <WhiteSpace size="lg" />
          <WhiteSpace size="lg" />

          <div className="social">
            <MButton
              onClick={(event) => this.clickLogin()}
              variant="outlined" color="primary" size="small"
              className="social-button"
            >
              <Icon type={'check-circle-o'} id="submit-icon" style={{ color: '0060c0', marginRight: 8 }} />
              <span className="social-text" style={{ color: '#0060c0' }}>Log in</span>
            </MButton>
          </div>

          <WhiteSpace size="lg" />

          <div className="social">
            <MButton
              // onClick={(event) => window.location.href='/register'}
              color="primary" size="small"
              className='social-button'
            >
              {/*<FontAwesomeIcon icon='user-plus' id="submit-icon" style={{ color: '0060c0', marginRight: 8 }} />*/}
              <span className="social-text" style={{ color: '#0060c0' }}>Create an Account (Coming soon)</span>
            </MButton>
          </div>
        </Card>
      </div>
    )
  }
}

export { Login }
