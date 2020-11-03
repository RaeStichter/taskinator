var formEl = document.querySelector("#task-form");
var tasksToDoE1 = document.querySelector("#tasks-to-do");

var createTaskHandler = function(event) {

    // Overrides the browser actions to allow us to control actions with just js
    event.preventDefault();

    // Create new task item
    var listItemE1 = document.createElement("li");
    // Style new task item
    listItemE1.className = "task-item";
    // Add the text
    listItemE1.textContent = "This is a new task";
    // Append this element to the task list
    tasksToDoE1.appendChild(listItemE1);
}

// On a button click, create a task.
formEl.addEventListener("submit", createTaskHandler);


//console.log(buttonEl);