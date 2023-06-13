const token = localStorage.getItem("token");
if (!token) {
  window.location.replace("signup.html");
}

const todoFormEl = document.querySelector("#todoForm");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

render();

function addTodo(e) {
  e.preventDefault();
  const username = e.target[0].value;
  const task = e.target[1].value;
  const time = e.target[2].value;

  const todo = {
    id: todos[todos.length - 1]?.id + 1 || 0,
    username,
    task,
    time: time.split("T").join(" "), // => "23-02-2023T15:00" => ["23-02-2023", "15:00"] => "23-02-2023 15:00"
    isCompleted: false,
    isEditing: false,
  };

  todos.push(todo);

  e.target[0].value = "";
  e.target[1].value = "";
  e.target[2].value = "";

  render();

  localStorage.setItem("todos", JSON.stringify(todos));
  console.log(todos);
}

function render() {
  const todoListEl = document.querySelector("#todoList");
  todoListEl.innerHTML = "";

  for (let i = 0; i < todos.length; i++) {
    const { id, username, task, time, isCompleted, isEditing } = todos[i];
    const template = isEditing
      ? `
          <li
          class="list-group-item col-md-6 d-flex justify-content-between align-items-start"
          ondblclick="toggleComplete()"
          >
            <form id="editTodo" onsubmit="return updateTodo(event, ${id})">
              <div class="col-md-12 input-group mb-3">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Username"
                  aria-label="Username"
                  value="${username}"
                />
                <input
                  type="text"
                  class="form-control"
                  placeholder="Task"
                  aria-label="Task"
                  value="${task}"
                />
                <input type="datetime-local" class="form-control" value="${time
                  .split(" ")
                  .join("T")}"/>
                <button class="btn btn-success">Update</button>
              </div>
            </form>
          </li>
        `
      : `
      <li
        class="list-group-item col-md-6 d-flex justify-content-between align-items-start ${
          isCompleted && "bg-success text-light"
        }"
        ondblclick="toggler(${id}, 'complete')"
      >
        <div class="ms-2 me-auto">
          <div class="fw-bold">${username}</div>
          ${task} ${isCompleted ? "<span>Vazifa bajarildi</span>" : ""}
        </div>
        <span class="badge bg-primary rounded-pill">${time}</span>
        <div class="ms-3">
          <button class="btn btn-danger" onclick="deleteTodo(${id})">Delete</button>
          <button class="btn btn-primary" onclick="toggler(${id}, 'edit')">Edit</button>
        </div>
      </li>
    `;

    // todoListEl.innerHTML = todoListEl.innerHTML + template;
    todoListEl.innerHTML += template;
  }
}

function toggler(id, type) {
  for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];

    if (todo.id == id) {
      switch (type) {
        case "complete":
          todo.isCompleted = !todo.isCompleted;
          break;
        case "edit":
          todo.isEditing = !todo.isEditing;
      }
    }
  }

  render();
}

function deleteTodo(id) {
  const newTodos = [];
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id != id) {
      newTodos.push(todos[i]);
    }
  }
  todos = newTodos;
  render();
  localStorage.setItem("todos", JSON.stringify(todos));
}

function updateTodo(event, id) {
  event.preventDefault();

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id == id) {
      (todos[i].username = event.target[0].value),
        (todos[i].task = event.target[1].value),
        (todos[i].time = event.target[2].value.split("T").join(" "));
      todos[i].isEditing = !todos[i].isEditing;
    }
  }

  render();
  localStorage.setItem("todos", JSON.stringify(todos));
}
