import React from "react"

const Register = () => {
  const [user, setUser] = React.useState({
    name: '',
    email: '',
    password: '',
  })
  return (
    <div className="h-screen bg-primary flex items-center justify-center">
    
    
    <div className="bg-white shadow-md p-5 flex flex-col gap-5 w-96"> 
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
      <input type="text"
      value={user.password}
      onChange={(e) => setUser({...user, password: e.target.value})}
      placeholder="enter password"
      />
      <button className="contained-btn">Register</button>
      
    </div>
    
    
    </div>
  )
}

export default Register