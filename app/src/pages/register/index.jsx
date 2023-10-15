import React from "react"
import { Link } from "react-router-dom"
import { RegisterUser } from "../../apicalls/users"

const Register = () => {
  const [user, setUser] = React.useState({
    name: '',
    email: '',
    password: '',
  })

  const register = async () => {
    try {
      const response = await RegisterUser(user);
      if (response.success) {
        alert(response.message);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert(error.message);
    }
  }
  return (
    <div className="h-screen bg-primary flex items-center justify-center">
    
    
    <div className="bg-ternary shadow-md p-5 flex flex-col gap-5 w-96"> 
      <h1 className="text-4x1 uppercase font-semibold text-secondary">Register to Sway</h1>
      <hr />
      <input type="text"
      value={user.name}
      onChange={(e) => setUser({...user, name: e.target.value})}
      placeholder="enter your name"
      />
      <input type="text"
      value={user.email}
      onChange={(e) => setUser({...user, email: e.target.value})}
      placeholder="enter your email"
      />
      <input type="password"
      value={user.password}
      onChange={(e) => setUser({...user, password: e.target.value})}
      placeholder="enter password"
      />
      <button className="contained-btn"
      onClick={register}>
      Register</button>

      <Link to="/login" className="underline">
        already have an account? Login
      </Link>
      
    </div>
    
    
    </div>
  )
}

export default Register