var buttonEl = document.querySelector("#save-task");
var tasksToDoE1 = document.querySelector("#tasks-to-do");

var createTaskHandler = function() {
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
buttonEl.addEventListener("click", createTaskHandler);


//console.log(buttonEl);