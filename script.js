window.onload = displayTodos;

document.querySelector("#submit-btn").addEventListener("click", () => {
    saveTodo();
    displayTodos();
});

function saveTodo() {
    const todoInputElement = document.querySelector("#todo-field");
    const todoText = todoInputElement.value;
    let todoObject = JSON.stringify({ todoText, isCompleted: false });
    localStorage.setItem(`${Date.now()}`, todoObject);
    todoInputElement.value = "";
}

function displayTodos() {
    const todoList = document.querySelector("#todo-list");
    todoList.textContent = "";
    const ids = getSavedTodosIds();

    ids.forEach((id) => {
        const newListItem = createTodo(id);
        todoList.append(newListItem);
    });
}

function getSavedTodosIds() {
    return Object.keys(localStorage).sort((a, b) => {
        return Number(a) - Number(b);
    });
}

function createTodo(id) {
    const todoListItem = document.createElement("li");
    const doneButton = createToggleTodoButton(id);
    const deleteButton = createDeleteButton(id);
    const todoObject = localStorage.getItem(id);
    const parsedTodoObject = JSON.parse(todoObject);
    todoListItem.append(parsedTodoObject.todoText);
    todoListItem.append(doneButton);
    todoListItem.append(deleteButton);
    checkStrikethru(parsedTodoObject, todoListItem, doneButton);
    todoListItem.classList.add("list-item");
    todoListItem.setAttribute("id", id);
    return todoListItem;
}



function createDeleteButton(id) {
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "x";
    deleteButton.classList.add("clear");
    deleteButton.addEventListener("click", () => deleteTodo(id, deleteButton));
    return deleteButton;
}

function deleteTodo(id, deleteButton) {
    localStorage.removeItem(id);
    deleteButton.parentElement.remove();
}

function createToggleTodoButton(id) {
    const doneButton = document.createElement("input");
    doneButton.setAttribute("type", "checkbox");
    doneButton.classList.add("pending");
    doneButton.addEventListener("click", () => strikethru(id, doneButton));
    return doneButton;
}

function strikethru(id, doneButton) {
    const item = doneButton.parentElement;
    !item.classList.contains("strike")
        ? item.classList.add("strike")
        : item.classList.remove("strike");
    const todoObject = changeCompleteState(id);
    localStorage.setItem(id, JSON.stringify(todoObject));
}

function checkStrikethru(parsedTodoObject, todoListItem, doneButton) {
    if (parsedTodoObject.isCompleted) {
        todoListItem.classList.add("strike");
        doneButton.checked = true;
    }
}

function changeCompleteState(id) {
    const todoObject = JSON.parse(localStorage.getItem(id));
    if (!todoObject.isCompleted) {
        todoObject.isCompleted = true;
    }
    else
        todoObject.isCompleted = false;
    return todoObject;
}

