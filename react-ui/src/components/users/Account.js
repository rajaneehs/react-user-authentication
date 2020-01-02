import React from 'react'
import axios from 'axios'

class Account extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
       user: {}
    }
  }
  
  componentDidMount(){
    axios.get(`http://localhost:3005/users/account`, {
      headers: {
        'x-auth': localStorage.getItem('userAuthToken')
      }
    })
      .then(response => {
        const user = response.data
        this.setState({ user })
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div>
        <h2>User Account</h2>
        <p>{this.state.user.username}</p>
      </div>
    )
  }
}

export default Account
