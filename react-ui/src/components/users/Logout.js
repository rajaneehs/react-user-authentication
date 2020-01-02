import React from 'react'
import axios from 'axios'

class Logout extends React.Component {

  componentDidMount(){
    axios.delete(`http://localhost:3005/users/logout`, {
      headers: {
        'x-auth': localStorage.getItem('userAuthToken')
      }
    })
    .then(response => {
      localStorage.removeItem('userAuthToken')
      this.props.handleAuth(false)
      this.props.history.push('/users/login')
    })
  }

  render() {
    return (
      <div>
        <p>Logging out..</p>
      </div>
    )
  }
}

export default Logout
