document.addEventListener("DOMContentLoaded", function () {
  const addBtn = document.getElementById("add-btn");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");

  // Load saved to-do items from storage
  chrome.storage.sync.get("todos", function (data) {
    if (data.todos) {
      data.todos.forEach(function (todo) {
        addTodoToList(todo);
      });
    }
  });

  // Add new to-do item
  addBtn.addEventListener("click", function () {
    const todo = todoInput.value.trim();
    if (todo) {
      addTodoToList(todo);
      saveTodoToStorage(todo);
      todoInput.value = ""; // Clear input
    }
  });

  // Function to add to-do to the list in the UI
  function addTodoToList(todo) {
    const li = document.createElement("li");
    li.textContent = todo;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "delete-btn";

    // Remove to-do item when delete button is clicked
    deleteBtn.addEventListener("click", function () {
      li.remove();
      removeTodoFromStorage(todo);
    });

    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  }

  // Function to save to-do item to storage
  function saveTodoToStorage(todo) {
    chrome.storage.sync.get("todos", function (data) {
      const todos = data.todos || [];
      todos.push(todo);
      chrome.storage.sync.set({ todos: todos });
    });
  }

  // Function to remove to-do item from storage
  function removeTodoFromStorage(todo) {
    chrome.storage.sync.get("todos", function (data) {
      const todos = data.todos || [];
      const index = todos.indexOf(todo);
      if (index > -1) {
        todos.splice(index, 1);
        chrome.storage.sync.set({ todos: todos });
      }
    });
  }
});
