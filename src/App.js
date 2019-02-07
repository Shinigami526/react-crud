import React, { Component } from 'react';
import axios from 'axios';
import { API } from './config';
import './App.css';
import IMAGE from './loading.gif'


class App extends Component {

  state= {
    newTodo: '',
    editing: false,
    editingIndex: null,
    notification: null,
    todos: [],
    loading: true
  }


  // Call api
  async componentDidMount() {

    const response = await axios.get(`${API}/todos`)
    console.log(response)

    setTimeout(() => {
      this.setState({ 
        todos: response.data,
        loading: false
       })
    }, 1000)

    
  }
  
  // Change Value
  handleChange = e => {
    this.setState({ newTodo: e.target.value })
   }


  // Add 
  addTodo = async () => {
    const response = await axios.post(`${API}/todos`, {
      name: this.state.newTodo
    })

    console.log(response)

    const todo = this.state.todos;
    todo.push(response.data);
    this.setState({ todos: todo, newTodo: '', editing: false })
    this.alert('todo Add successfully')
  }

  // Edit
  editTodo = (index) => {
    const todo = this.state.todos[index]
    this.setState({
       editing: true,
       newTodo: todo.name,
       editingIndex: index
    })
  }
  
  // Remove
  removeTodo = async (index) => {
     const todos = this.state.todos
     const todo = todos[index]

      await axios.delete(`${API}/todos/${todo.id}`)
     delete todos[index]

     this.setState({ todos })
     this.alert('todo deleted successfully')
  }

  // Update
  updateTodo = async () => {
    const todo = this.state.todos[this.state.editingIndex]
    
    const response = await axios.put(`${API}/todos/${todo.id}`, {
        name: this.state.newTodo
    })
    console.log(response)

    todo.name = this.state.newTodo;
    const todos = this.state.todos;
    todos[this.state.editingIndex] = todo
    this.setState({
       todos, 
       editing: false, 
       editingIndex: null,
       newTodo: ''
     })
     this.alert('todo Update successfully')
 }

  // Alert
  alert = (notification) => {
     this.setState({ notification })

     setTimeout(() => {
       this.setState({
         notification: null
       })
     },2000)
  }

  

  render() {
    const { todos, newTodo, editing } = this.state;
    const limit = this.state.newTodo.length < 5 ? 'btn btn-secondary m-3 form-control' : 'btn btn-success m-3 form-control';

   console.log('render')
    return (
     <div className="container">
      { this.state.notification &&
        <div className="alert m-3 alert-primary" role="alert">
       <p className="text-center">{this.state.notification}</p>
       </div>}
     <input 
     type="text" 
     name="todo"
     className="my-4 form-control" 
     placeholder="Add a new todo"
     onChange={this.handleChange}
     value={newTodo}
     />

     <button 
     onClick={this.state.editing ? this.updateTodo : this.addTodo} 
     className={limit}
     disabled={this.state.newTodo.length < 5}
     >
     {editing ? 'Update Todo' : 'Add todo'}
     </button>

     {
       this.state.loading && 
       <div className="loading">
       <img  src={IMAGE} alt="Loading"/>
       </div>
     }

     {editing === false ?
      <ul className="list-group">
       {todos.map((todo, index) => (
         <div key={todo.id}>
           <li className="list-group-item">{todo.name}</li>
           <button type="button" className="btn btn-danger" onClick={() => this.removeTodo(index)}>Delete</button>
           <button type="button" className="btn btn-light" onClick={() => this.editTodo(index)}>Edit</button>
         </div>
        ))}
       </ul> 
       : null}
     </div>
    );
  }
}

export default App;
