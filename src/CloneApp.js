import React, { Component } from 'react';
import axios from 'axios';
import './App.css';


class App extends Component {

  state= {
    newTodo: '',
    editing: false,
    editingIndex: null,
    notification: null,
    todos: []
  }

  async componentDidMount() {
    const API = 'https://5c5b3d7e1041df0014b3eee7.mockapi.io/'
    const response = await axios.get(`${API}/todos`)
    console.log(response)

    this.setState({ todos: response.data })
  }


  generateTodoId = () => {
    const lastTodo = this.state.todos[this.state.todos.length - 1];
    if (lastTodo) {
      return lastTodo.id + 1
    }
    return 1
  }

   addTodo = () => {
    const newTodo = {
      name: this.state.newTodo,
      id: this.generateTodoId()
    }
    const todo = this.state.todos;
    todo.push(newTodo);
    this.setState({ todos: todo, newTodo: '', editing: false })
    this.alert('todo Add successfully')
  }
  
  removeTodo = (index) => {
     const todos = this.state.todos
     delete todos[index]
     this.setState({ todos })
     this.alert('todo deleted successfully')
  }

  editTodo = (index) => {
    const todo = this.state.todos[index]
    this.setState({
       editing: true,
       newTodo: todo.name,
       editingIndex: index
    })
  }

  

  alert = (notification) => {
     this.setState({ notification })

     setTimeout(() => {
       this.setState({
         notification: null
       })
     },2000)
  }

  updateTodo = () => {
     const todo = this.state.todos[this.state.editingIndex]

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

  handleChange = e => {
   this.setState({ newTodo: e.target.value })
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