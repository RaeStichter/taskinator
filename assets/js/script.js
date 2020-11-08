// GLOBAL Variables
var taskIdCounter = 0; // variable to track each time the submit button is selected for tracking purposes
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler = function(event) {

    // Overrides the browser actions to allow us to control actions with just js
    event.preventDefault();

    // keep track of the data task id
    var isEdit = formEl.hasAttribute("data-task-id");

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if the input values are empty strings
    // ! in this case means ' if either or both of the variables are false, then proceed
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    // reset the form each time the button it hit so that it is empty for the next task.
    formEl.reset();

    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribute, so create object as normal and pass to createTaskEl function
    else {
    // package up data as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        }
        // send it as an argument to createTaskEl (only if isEdit is faslse)
        // this will make sure that we edit the task and not jsut create a new one
        createTaskEl(taskDataObj);
    }
}

// this function runs if the isEdit is true.  Takes the taskName, taskType, taskId as inputs
var completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    // if the two id values match, w have confirmed that the task at iteration
    // is the one we want to update.  We'ev reassigned the task's name and type property
    // to the new content submitted by the form when we finished editing.
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    alert("Task Updated!");

    // reset the form by removing the task id and changing the button text back to normal
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";

    // save tasks
    saveTasks();
};

// This hold code that creates a new task HTML element.
var createTaskEl = function(taskDataObj) {
    // Create new task item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    // make draggable
    listItemEl.setAttribute("draggable", "true");
    
    // Create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    // Give it a class name
    taskInfoEl.className = "task-info";
    // Add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    listItemEl.appendChild(taskInfoEl);

    // Call the create task actions function.  This is where the drop down info is
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    
    // include the task id in the task data object
    // push the whole object into the task array
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    // Add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    // increase task counter for next unique id
    taskIdCounter++;

    console.log(taskDataObj);
    console.log(taskDataObj.status);

    // save tasks
    saveTasks();
}

// create dynamically responsive buttons
var createTaskActions = function(taskId) {
    // create the container for the buttons
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl
}

// On a button click, create a task.
formEl.addEventListener("submit", taskFormHandler);


var taskButtonHandler = function(event) {
    // get target element from event
    var targetEl = event.target;

    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    // delete button was clicked
    else if (event.target.matches(".delete-btn")) {
        // get the element's task id
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    // save tasks
    saveTasks();
};

var editTask = function(taskId) {
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    // update the submit button to say save, this makes it clear that we are in edit mode
    document.querySelector("#save-task").textContent = "Save Task";

    // Make sure the task id is not lost when we edit
    formEl.setAttribute("data-task-id", taskId);
}

// STATUS CHANGE
var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id")

    // get the currently selected option's value and onvert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    } 
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }
    
    // update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    console.log(tasks);

    // save tasks
    saveTasks();
};

// -------------------------DRAG AND DROP FUNCTIONS-----------------------------
var dragTaskHandler = function(event) {
    // get unique task id
    var taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);

    var getId = event.dataTransfer.getData("text/plain");
    console.log("getId", getId, typeof getId);
}

var dropZoneDragHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        event.preventDefault();
    }
    taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
}

var dropTaskHandler = function(event) {
    var id = event.dataTransfer.getData("text/plain");
    
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;
    
    // set status of task based on dropZone id
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    
    if (statusType === "tasks-to-do") {
        statusSelectEl.selectedIndex = 0;
    }
    else if (statusType === "tasks-in-progress") {
        statusSelectEl.selectedIndex = 1;
    }
    else if (statusType === "tasks-completed") {
        statusSelectEl.selectedIndex = 2;
    }

    // Remove the sytling just before the task item is attached to the new task list
    dropZoneEl.removeAttribute("style");

    // append the draggable element to its new parent element
    dropZoneEl.appendChild(draggableElement);

    // loop through tasks array to find and update the task's status
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }
    // save tasks
    saveTasks();

    console.log(tasks);
};

var dragLeaveHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
}

// -------------------------SAVING TASKS------------------------------------
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// --------------------------LOADING TASKS ------------------------------
// retrieve from local storage.  load them back into the tasks variable
// this first line should reassign the tasks variable to whatever localstorage returns

var loadTasks = function() {
    tasks = localStorage.getItem("tasks");
    console.log(tasks);

    //check to see if tasks is equal to null, if so make empty array
    if (tasks === null) {
        tasks = [];
        return false;
    }

    // take the info from local storage and turn it back into an array of objects
    tasks = JSON.parse(tasks);
    console.log(tasks);

    for (var i = 0; i < tasks.length; i++) {
        // assign id property to taskIdCounter
        taskIdCounter = tasks[i].id;
        
        // Create new task item
        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";

        // add task id as a custom attribute
        listItemEl.setAttribute("data-task-id", taskIdCounter);
        // make draggable
        listItemEl.setAttribute("draggable", "true");
        
        //console.log(tasks[i]);
        

        // Create div to hold task info and add to list item
        var taskInfoEl = document.createElement("div");
        // Give it a class name
        taskInfoEl.className = "task-info";
        // Add HTML content to div
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";

        listItemEl.appendChild(taskInfoEl);
        
        // Call the create task actions function.  This is where the drop down info is
        var taskActionsEl = createTaskActions(taskIdCounter);
        listItemEl.appendChild(taskActionsEl);
             
        console.log(listItemEl);

        if (tasks[i].status === "to-do") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.appendChild(listItemEl);
            //statusSelectEl.selectedIndex = 0;
        }
        else if (tasks[i].status === "in-progress") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);
            //statusSelectEl.selectedIndex = 1;
        }
        else if (tasks[i].status === "complete") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.appendChild(listItemEl);
            //statusSelectEl.selectedIndex = 2;
        }

        taskIdCounter++;
        console.log(listItemEl);








    //      // Create div to hold task info and add to list item
    // var taskInfoEl = document.createElement("div");
    // // Give it a class name
    // taskInfoEl.className = "task-info";
    // // Add HTML content to div
    // taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    // listItemEl.appendChild(taskInfoEl);

    // // Call the create task actions function.  This is where the drop down info is
    // var taskActionsEl = createTaskActions(taskIdCounter);
    // listItemEl.appendChild(taskActionsEl);
    
    // // include the task id in the task data object
    // // push the whole object into the task array
    // taskDataObj.id = taskIdCounter;
    // tasks.push(taskDataObj);

    // // Add entire list item to list
    // tasksToDoEl.appendChild(listItemEl);

    // // increase task counter for next unique id
    // taskIdCounter++;

    // console.log(taskDataObj);
    // console.log(taskDataObj.status);

    // // save tasks
    // saveTasks();
    }
}

// -------------------------EVENT LISTENERS-----------------------------

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);

pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);
loadTasks();