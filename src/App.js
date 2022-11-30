import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import Form from './Components/Form';


const URL = "https://rest-api-without-db.herokuapp.com/users";

function App() {

  const [users,setUsers] = useState(null);
  const [isLoading,setIsLoading] = useState(true);
  const [error,setError] = useState(null);

  // Update Data
  const [selectedUser,setSelectedUser] = useState({
    username: '',
    email: ''
  });

  const [upadateFlag,setUpdateFlag] = useState(false);
  const [selectedUserId,setSelectedUserId] = useState("");


  const getAllUsers = () => {
    fetch(URL)
    .then((res) =>{
      if(!res.ok){
        throw Error("Could not fatch data.")
      }
      return res.json();
    })
    .then((data) => {
      console.log(data.users);
      setUsers(data.users);
    })
    .catch((err)=>{
      setError(err.message);
    })
    .finally(() => {
      setIsLoading(false);
    })

  }

    // Delete users
    const handleDelete = (id) => {
      fetch(URL + `/${id}`, {
        method: 'DELETE',
      })
      .then((res) =>{
        if(!res.ok){
          throw Error("Could not Delete.")
        }
        getAllUsers();
      })
      .catch((err)=>{
        setError(err.message);
      })
    }
  
  useEffect(() => {
    getAllUsers();
    
  }, [])

  const addUser = (user) => {
    fetch(URL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
    .then((res) =>{
      if(res.status==201){
        getAllUsers();
      }
      else{
        throw new Error("Could not created new user.");
      }
    })
    .catch((err)=>{
      setError(err.message);
    })

  }

  const handleEdit =(id) => {
    selectedUserId(id);
    setUpdateFlag(true);
    const filterData = users.filter((user)=>user.id == id);
    setSelectedUser({
      username: filterData[0].username,
      email: filterData[0].email,
    })
  }
//  Data Updation procedure
  const handleUpdate = (user) => {
    fetch(URL +`/${selectedUserId}`,{
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
    .then((res) =>{
      if(!res.ok){
        throw new Error(" Failed to Update..")
      }
      else{
        getAllUsers();
        setUpdateFlag(false);
        
      }
    })
    .catch((err)=>{
      setError(err.message);
    })

  }

  
  return (
    <div className='App'>
     <h1>User Management App</h1>
     {isLoading && <h2>Loading.....</h2>}
     {error && <h2>{error}</h2>}

     {/* <Form btnText ="Add User" handleSubmitData= {addUser} /> */}
     {upadateFlag ? (<Form btnText ="Update User" selectedUser = {selectedUser} handleSubmitData={handleUpdate} />) :(<Form btnText ="Add User" handleSubmitData= {addUser} />)}

     <section>
     {users && users.map((user) => {
      const {id, username, email} = user;
      return (

        <article key={id} className="card">
          <p>{username}</p>
          <p>{email}</p>
          <button className='btn' onClick={()=>{handleEdit(id)}}>Edit</button>
          <button className='btn' onClick={() =>{handleDelete(id)}}>Delete</button>
          
        </article>
      )
     })}
     </section>
    </div>
  );
}

export default App;
