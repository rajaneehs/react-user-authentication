import React from 'react'
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom'

import Register from './components/users/Register'
import Login from './components/users/Login'
import Account from './components/users/Account'
import Logout from './components/users/Logout'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: false
    }
  }
  
  componentDidMount(){
    if(localStorage.getItem('userAuthToken')){
      this.setState( { isAuthenticated: true })
    }
  }

  handleAuth = (bool) => {
    this.setState({ isAuthenticated: bool })
  }

  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <ul>
            { this.state.isAuthenticated && (
              <div>
                <li><Link to="/users/account">Account</Link></li>
                <li><Link to="/users/logout">Logout</Link></li>
              </div>
            )}
            { !this.state.isAuthenticated && (
              <div>
                <li><Link to="/users/register">Register</Link></li>
                <li><Link to="/users/login">Login</Link></li>
              </div>
            )}
          </ul>

          <Switch>
            {/* Logged in routes */}
            { this.state.isAuthenticated && (
              <React.Fragment>
                <Route path="/users/logout" render={(props) => {
                  return <Logout {...props} handleAuth={this.handleAuth} />
                }} />
                <Route path="/users/account" component={Account} />
              </React.Fragment>
            )}

            {/* Logged out routes */}
            { !this.state.isAuthenticated && (
              <React.Fragment>
                <Route path="/users/register" component={Register} />
                <Route path="/users/login" render={(props) => {
                  return <Login {...props} handleAuth={this.handleAuth} />
                }} />
              </React.Fragment>
            )}
            
            <Route render={() => {
              return <h2>The page that you are looking for doesn't exist.</h2>
            }}/>
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App
