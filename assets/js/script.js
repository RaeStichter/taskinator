var formEl = document.querySelector("#task-form");
var tasksToDoE1 = document.querySelector("#tasks-to-do");

var taskFormHandler = function(event) {

    // Overrides the browser actions to allow us to control actions with just js
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    // send it as an argument to createTaskEl
    createTaskEl(taskDataObj);
}

// This hold code that creates a new task HTML element.
var createTaskEl = function(taskDataObj) {
    // Create new task item
    var listItemE1 = document.createElement("li");
    listItemE1.className = "task-item";

    // Create div to hold task info and add to list item
    var taskInfoE1 = document.createElement("div");
    // Give it a class name
    taskInfoE1.className = "task-info";
    // Add HTML content to div
    taskInfoE1.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    listItemE1.appendChild(taskInfoE1);

    // Add entire list iten to list
    tasksToDoE1.appendChild(listItemE1);
}




// On a button click, create a task.
formEl.addEventListener("submit", taskFormHandler);