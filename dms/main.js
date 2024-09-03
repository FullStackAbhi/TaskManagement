// Comparison
let compare = (a, b) => {
  if (
    a.deadline.split("-").reverse().join("-") <
    b.deadline.split("-").reverse().join("-")
  ) {
    return -1;
  }
  if (
    a.deadline.split("-").reverse().join("-") >
    b.deadline.split("-").reverse().join("-")
  ) {
    return 1;
  }
  return 0;
};

// // Select the first name element from HTML document
// let userfnameEl = document.querySelector("#userfname");
// const token = sessionStorage.getItem("token");

// // Check if the token exists
// if (!token) {
//   alert("No token found. Please log in.");
//   window.location.href = "./index.html";
// }

// // Decode the token to get the user ID
// const decodedToken = JSON.parse(atob(token.split(".")[1]));
// const userId = decodedToken._id;

// // Fetch and display the user's first name
// async function displayUserFirstName() {
//   try {
//     // Fetch user details
//     const userResponse = await fetch(
//       `https://taskmanagement-backend-ymxh.onrender.com/api/v1/users/${userId}`,
//       {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         },
//       }
//     );
//     if (!userResponse.ok) {
//       throw new Error(
//         `Failed to fetch user details: ${userResponse.statusText}`
//       );
//     }
//     const user = await userResponse.json();
//     if (userfnameEl) {
//       userfnameEl.innerHTML = user.fname;
//     } else {
//       console.error("First name element not found in the DOM");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }

// Call the function to display the first name
// displayUserFirstName();

// formate date
function formatDate(d) {
  let date = new Date(d);
  let date1 = date.getDate().toString().padStart(2, "0");
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let year = date.getFullYear();

  return `${date1}-${month}-${year}`;
}

//Capitalizes the first letter of all text placeholders
function capitalizeFirstLetter(str) {
  // Check if the string is empty
  if (str.length === 0) {
    return str;
  }

  // Get the first character and capitalize it
  const firstLetter = str.charAt(0).toUpperCase();

  // Get the rest of the string
  const restOfString = str.slice(1);

  // Concatenate the capitalized first letter and the rest of the string
  return firstLetter + restOfString;
}

// Make the progress bar interactive
function bindProgressBar() {
  const taskProgressInputEl = document.querySelector("#editTaskProgress");
  //
  // Allows for keyboard control of the progress value slider
  taskProgressInputEl.addEventListener("mousemove", updateProgressValue);
  taskProgressInputEl.addEventListener("click", updateProgressValue);
  taskProgressInputEl.addEventListener("keydown", updateProgressValue);
}

// Function which updates progress value and appends % at the end of the value
function updateProgressValue() {
  const taskProgressInputEl = document.querySelector("#editTaskProgress");
  const progressSpanEl = document.querySelector("#progressValue");
  progressSpanEl.innerHTML = taskProgressInputEl.value + "%";
}

// Function which fetches task by ID and returns when id is found
async function fetchTaskById(id) {
  try {
    const response = await fetch(
      `https://taskmanagement-backend-ymxh.onrender.com/api/v1/tasks/${id}`
    );

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const task = await response.json();

    return task;
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    return null;
  }
}

// Assigns pagename to the body element in the HTML document
let pagename = document.querySelector("body").dataset.page;

//Login Page
if (pagename === "login") {
  // Selects all form elements
  document.addEventListener("DOMContentLoaded", () => {
    const loginFormEl = document.querySelector("#loginForm");
    const usernameEl = document.querySelector("#username");
    const passwordEl = document.querySelector("#password");

    loginFormEl.addEventListener("submit", async (event) => {
      event.preventDefault();
      await validateForm();
    });

    async function validateForm() {
      if (usernameEl.value === "" || passwordEl.value === "") {
        alert("Please enter username and password");
        usernameEl.focus();
      } else {
        await login(usernameEl.value, passwordEl.value);
      }
    }

    async function login(username, password) {
      console.log(username, password);

      try {
        const response = await fetch(
          "https://taskmanagement-backend-ymxh.onrender.com/api/v1/users/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          }
        );

        const data = await response.json();
        console.log("Server response:", data); // Debugging

        if (response.ok) {
          // Debugging: Check the token received
          console.log("Token received:", data.token);

          // Save token in session storage
          sessionStorage.setItem("token", data.token);

          // Debugging: Check the token stored
          console.log("Token saved:", sessionStorage.getItem("token"));

          // Redirect based on role
          // console.log(data.role);
          if (data.role === "developer") {
            window.location.href = "./developer.html";
          } else if (data.role === "manager") {
            window.location.href = "./manager.html";
          }
        } else {
          alert(data.error || "Login failed!");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred. Please try again.");
      }
    }
  });
}

// Logout page (shown for a brief second), removes logged in user data and redirects to root folder
if (pagename === "logout") {
  document.addEventListener("DOMContentLoaded", async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      // If no token is found, redirect to login page
      window.location.href = "./index.html";
    }

    try {
      const response = await fetch(
        "https://taskmanagement-backend-ymxh.onrender.com/api/v1/users/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Clear token from session storage
        sessionStorage.removeItem("token");
        // Redirect to login page
        window.location.href = "./index.html";
      } else {
        const data = await response.json();
        alert(data.error || "Logout failed!");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred. Please try again.");
    }
  });
}

// Dashboard page
if (pagename == "dashboard") {
  // Selects tasks, devs and first name elements from HTML document
  let tasksCountEl = document.querySelector("#task-count");
  let devsCountEl = document.querySelector("#dev-count");
  let userfnameEl = document.querySelector("#userfname");
  const token = sessionStorage.getItem("token");

  // Retrieves data from local storage to display first name of logged in user in the dashboard
  if (!token) {
    alert("No token found. Please log in.");
    window.location.href = "./index.html";
  }
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const userId = decodedToken._id;
  try {
    // Fetch user details
    const userResponse = await fetch(
      `https://taskmanagement-backend-ymxh.onrender.com/api/v1/users/${userId}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );
    if (!userResponse.ok) {
      throw new Error(
        `Failed to fetch user details: ${userResponse.statusText}`
      );
    }
    const user = await userResponse.json();
    userfnameEl.innerHTML = user.fname;
  } catch (err) {
    console.log(err);
  }

  // count task and dev
  await fetchCounts();
  async function fetchCounts() {
    // Get the token from session storage
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      window.location.href = "./index.html";
      return;
    }

    try {
      // Fetch task count
      const taskCountResponse = await fetch(
        "https://taskmanagement-backend-ymxh.onrender.com/api/v1/tasks/count",
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!taskCountResponse.ok) {
        throw new Error("Failed to fetch task count");
      }
      const taskCountData = await taskCountResponse.json();

      // Fetch user count
      const userCountResponse = await fetch(
        "https://taskmanagement-backend-ymxh.onrender.com/api/v1/users/count",
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!userCountResponse.ok) {
        throw new Error("Failed to fetch user count");
      }
      const userCountData = await userCountResponse.json();

      if (tasksCountEl && devsCountEl) {
        tasksCountEl.innerHTML = taskCountData.count;
        devsCountEl.innerHTML = userCountData.count;
      } else {
        console.error("Count elements not found in the DOM");
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  }
}

// ------------------------------------------------common functions for task and dev------------------------------------------------------------------------------
async function fetchTasks() {
  fetch("https://taskmanagement-backend-ymxh.onrender.com/api/v1/tasks/list")
    .then((response) => response.json())
    .then((tasks) => {
      // console.log(tasks);
      showTasks(tasks);
      // Log the tasks to verify data
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
    });
}

// Function which searches for the the task ID then deletes the task and updates tasks to be displayed
async function delTask(id) {
  try {
    // Fetch task by ID
    const task = await fetchTaskById(id);

    if (!task) {
      alert("Task not found.");
      return;
    }

    // Confirm deletion
    let confirmation = confirm(
      `Do you want to delete the task "${task.name}"?`
    );

    if (confirmation) {
      console.log(id);
      // Proceed to delete task
      const response = await fetch(
        `https://taskmanagement-backend-ymxh.onrender.com/api/v1/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      // Refresh tasks list
      await fetchTasks();
    }
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

async function showTasks(tasks) {
  let tasksTbodyEl = document.querySelector("#tasks-table tbody");
  tasksTbodyEl.innerHTML = "";

  if (tasks.length < 1) {
    tasksTbodyEl.innerHTML =
      "<tr><td colspan='6'><div class='alert alert-sm alert-danger m-2 p-0 px-3 py-2 mx-auto' style='width:fit-content'>No tasks yet!</div></td></tr>";
  } else {
    tasks.sort(compare).forEach(async function (item, index) {
      try {
        let assignedUsernames = "Not assigned yet!";
        if (item.assignedTo.length > 0) {
          // Map through the assignedTo array, which contains user objects
          const assignedUsernamesArray = item.assignedTo.map((user) => {
            return `${user.fname}`;
          });
          assignedUsernames = assignedUsernamesArray.join(", ");
        }

        tasksTbodyEl.innerHTML += `
          <tr>
            <th scope="row">${index + 1}</th>
            <td>${item.name}</td>
            <td>${item.progress}%</td>
            <td>${new Date(item.deadline).toLocaleDateString()}</td>
            <td>${assignedUsernames}</td>
            <td>
              <button class="btn btn-primary btn-sm" title="Assign Devs" data-bs-toggle="modal" data-bs-target="#assignTaskModal" data-id="${
                item._id
              }">
                <i class="fa-solid fa-user-plus"></i>
              </button>
              <button class="btn btn-success btn-sm edit-task-btn" data-id="${
                item._id
              }" title="Edit" data-bs-toggle="modal" data-bs-target="#editTaskModal">
                <i class="fa-solid fa-pencil" data-id="${item._id}"></i>
              </button>
              <button class="btn btn-danger btn-sm del-task-btn" data-id="${
                item._id
              }" title="Delete">
                <i class="fa-solid fa-trash" data-id="${item._id}"></i>
              </button>
            </td>
          </tr>
        `;
      } catch (error) {
        console.error("Error displaying tasks:", error);
      }
    });

    bindDelTask();
    // bindEditTask();
  }
}

// Binds delete task btn
function bindDelTask() {
  let delTaskBtns = document.querySelectorAll(".del-task-btn");
  delTaskBtns.forEach(function (delTaskBtn) {
    delTaskBtn.addEventListener("click", function (event) {
      delTask(event.target.dataset.id);
    });
  });
}

// ------------------------------------------------******************------------------------------------------------------------------------------

// Tasks page
if (pagename == "manage-tasks") {
  // Selection of all form elements and buttons
  const newTaskFormEl = document.querySelector("#newTaskForm");
  const editTaskFormEl = document.querySelector("#editTaskForm");
  const assignTaskFormEl = document.querySelector("#assignTaskForm");
  const newTaskBtnEl = document.querySelector("#create-new-task-btn");
  const selectEl = document.querySelector("#assignDevs");
  let userfnameEl = document.querySelector("#userfname");
  const token = sessionStorage.getItem("token");

  // Retrieves data from local storage to display first name of logged in user in the dashboard
  if (!token) {
    alert("No token found. Please log in.");
    window.location.href = "./index.html";
  }
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const userId = decodedToken._id;
  try {
    // Fetch user details
    const userResponse = await fetch(
      `https://taskmanagement-backend-ymxh.onrender.com/api/v1/users/${userId}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );
    if (!userResponse.ok) {
      throw new Error(
        `Failed to fetch user details: ${userResponse.statusText}`
      );
    }
    const user = await userResponse.json();
    userfnameEl.innerHTML = user.fname;
  } catch (err) {
    console.log(err);
  }

  bindProgressBar();

  // Event listener which calls createNewTask when submit action is detected
  newTaskFormEl.addEventListener("submit", function (event) {
    event.preventDefault();
    createNewTask();
  });

  // Event listener which calls editTask when submit action is detected
  editTaskFormEl.addEventListener("submit", function (event) {
    event.preventDefault();
    editTask();
  });

  // Event listener which calls assignDevs when submit action is detected
  assignTaskFormEl.addEventListener("submit", function (event) {
    event.preventDefault();
    assignDevs();
  });

  // Event listener which resets the form to its initial state when click action is detected
  newTaskBtnEl.addEventListener("click", function () {
    newTaskFormEl.reset();
  });

  // Function which retrieves local data and fetches all tasks
  await fetchTasks();
  // Assuming you are running this in a Node.js environment with access to the fetch API

  // Displays all tasks in a tabular format

  // Function which gets developer names in an array by ID
  function getDevNamesArrByIdArr(idArray) {
    // Assuming you have a users array that stores all users
    const users = [
      { id: 1, username: "John Doe" },
      { id: 2, username: "Jane Smith" },
      { id: 3, username: "Bob Brown" },
      // Add more users as needed
    ];

    return idArray
      .map((id) => {
        const user = users.find((user) => user.id === id);
        return user ? user.username : null;
      })
      .filter((username) => username !== null);
  }

  // Function which creates a new task object with user-provided details, updates local storage, fetches updated task data, and closes the new task creation modal
  async function createNewTask() {
    let taskNameInputEl = newTaskFormEl.querySelector("#taskName");
    let taskDeadlineInputEl = newTaskFormEl.querySelector("#taskDeadline");

    // Create a new Date object from the input value and convert it to ISO format
    let deadlineDate = new Date(taskDeadlineInputEl.value);
    let isoDeadline = deadlineDate.toISOString(); // Use ISO format directly

    let newTaskObj = {
      name: taskNameInputEl.value,
      progress: 0,
      deadline: isoDeadline, // Use ISO format here
      assignedTo: [], // Ensure this is sent as an empty array
    };

    try {
      const response = await fetch(
        "https://taskmanagement-backend-ymxh.onrender.com/api/v1/tasks/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTaskObj),
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Task created:", result);
      fetchTasks(); // Refresh task list
      document.querySelector("#newTaskModal .btn-close").click();
    } catch (error) {
      console.error("Error creating new task:", error);
    }
  }

  // Function edits a task's details based on user input, updates local data, fetches updated tasks, and closes the edit task modal.
  async function editTask() {
    let form = new FormData(editTaskFormEl);
    const id = form.get("editTaskId"); // Extract task ID from the form data
    let newTaskName = form.get("editTaskName");
    let newProgress = Number(form.get("editTaskProgress"));
    let newDeadline = new Date(form.get("editTaskDeadline")).toISOString(); // Convert date to ISO string

    console.log(newProgress);
    try {
      // Prepare the data to be sent
      const response = await fetch(
        `https://taskmanagement-backend-ymxh.onrender.com/api/v1/tasks/${id}`,
        {
          method: "PUT", // Use PUT or PATCH depending on your API
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newTaskName,
            progress: newProgress,
            deadline: newDeadline,
            // Include assignedTo if necessary
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      // Refresh tasks list after successful update
      await fetchTasks();
      document.querySelector("#editTaskModal .btn-close").click();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  // Function which fills preexisting data into the form boxes to allow for the user to edit data
  async function fillTaskData(id) {
    try {
      // Fetch task data from the backend
      const response = await fetch(
        `https://taskmanagement-backend-ymxh.onrender.com/api/v1/tasks/${id}`
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const task = await response.json();

      // Select all form elements
      const taskIdEl = document.querySelector("#editTaskId");
      const taskNameEl = document.querySelector("#editTaskName");
      const taskProgressEl = document.querySelector("#editTaskProgress");
      const taskDeadlineEl = document.querySelector("#editTaskDeadline");
      const taskProgressValueEl = document.querySelector("#progressValue");

      // Set values for task ID, name, progress (with a corresponding display update), and formatted deadline in their respective HTML elements
      taskIdEl.value = task._id; // Use _id from the backend response
      taskNameEl.value = task.name;
      taskProgressEl.value = task.progress;
      taskProgressValueEl.innerHTML = task.progress + "%";
      taskDeadlineEl.value = new Date(task.deadline)
        .toISOString()
        .split("T")[0]; // Convert ISO date to YYYY-MM-DD
    } catch (error) {
      console.error("Error fetching task data:", error);
    }
  }

  const editModal = document.querySelector("#editTaskModal");
  editModal.addEventListener("show.bs.modal", function (event) {
    fillTaskData(event.relatedTarget.dataset.id);
  });

  //Fills developer names in drop down menu when assigning
  async function fillDevs(id) {
    // console.log(id);
    try {
      // Fetch the task details by ID
      const task = await fetchTaskById(id);

      // Retrieve token from session storage
      const token = sessionStorage.getItem("token");

      if (!token) {
        alert("No token found. Please log in.");
        window.location.href = "./index.html";
        return;
      }

      // Fetch all users from the server
      const response = await fetch(
        "https://taskmanagement-backend-ymxh.onrender.com/api/v1/users/developers",
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("users", response);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const users = await response.json();

      // Filter out developers from the user list
      const devs = users.filter(
        (user) => user.role.toLowerCase() === "developer"
      );

      // Populate the dropdown menu
      const selectEl = document.querySelector("#assignDevs");
      selectEl.innerHTML = "";
      devs.forEach((dev) => {
        selectEl.innerHTML += `<option value="${dev._id}" ${
          task.assignedTo.includes(dev._id) ? "selected" : ""
        }>${dev.fname} ${dev.lname}</option>`;
      });

      // Set the task ID in the hidden form field
      document.querySelector("#assignTaskId").value = id;
    } catch (error) {
      console.error("Error filling developers dropdown:", error);
    }
  }

  //
  async function assignDevs() {
    try {
      // Get selected developer IDs from the dropdown
      const selectEl = document.querySelector("#assignDevs");
      let newAssignedTo = [];
      for (let i = 0; i < selectEl.selectedOptions.length; i++) {
        newAssignedTo.push(selectEl.selectedOptions[i].value);
      }

      // Get the task ID from the hidden input field
      const taskId = document.querySelector("#assignTaskId").value;

      // Ensure all IDs are strings
      const stringIds = newAssignedTo.map((id) => String(id));

      // Send a PUT request to update the task with assigned developers
      const response = await fetch(
        `https://taskmanagement-backend-ymxh.onrender.com/api/v1/tasks/${taskId}/assign`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ assignedTo: stringIds }), // Ensure this matches your backend's expected format
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.statusText}`);
      }

      // Refresh the tasks list
      await fetchTasks();

      // Close the modal
      document.querySelector("#assignTaskModal .btn-close").click();
    } catch (error) {
      console.error("Error assigning developers:", error);
    }
  }

  const assignModal = document.querySelector("#assignTaskModal");
  assignModal.addEventListener("show.bs.modal", function (event) {
    fillDevs(event.relatedTarget.dataset.id);
  });
}

// Devs
if (pagename == "manage-devs") {
  // Selecting the dev form and storing in newDevFormEl
  const newDevFormEl = document.querySelector("#newDevForm");
  const newDevBtnEl = document.querySelector("#create-new-dev-btn");
  let userfnameEl = document.querySelector("#userfname");
  const token = sessionStorage.getItem("token");

  // Retrieves data from local storage to display first name of logged in user in the dashboard
  if (!token) {
    alert("No token found. Please log in.");
    window.location.href = "./index.html";
  }
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const userId = decodedToken._id;
  try {
    // Fetch user details
    const userResponse = await fetch(
      `https://taskmanagement-backend-ymxh.onrender.com/api/v1/users/${userId}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );
    if (!userResponse.ok) {
      throw new Error(
        `Failed to fetch user details: ${userResponse.statusText}`
      );
    }
    const user = await userResponse.json();
    userfnameEl.innerHTML = user.fname;
  } catch (err) {
    console.log(err);
  }

  // Calling the createNewDev function when the dev form is submitted
  newDevFormEl.addEventListener("submit", function (event) {
    createNewDev(event);
  });

  newDevBtnEl.addEventListener("click", function () {
    newDevFormEl.reset();
  });

  await fetchDevs();
  async function fetchDevs() {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      window.location.href = "./index.html";
      return;
    }

    try {
      const response = await fetch(
        "https://taskmanagement-backend-ymxh.onrender.com/api/v1/users/developers",
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Handle successful response
        console.log(data);
        await showDevs(data);
      } else {
        // Handle errors
        console.error(
          "Error fetching devs:",
          data.error || response.statusText
        );
        alert("Error fetching developers. Please try again.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("An error occurred while fetching developers.");
    }
  }

  function showDevs(devs) {
    let devsTbodyEl = document.querySelector("#devs-table tbody");
    devsTbodyEl.innerHTML = "";
    if (devs.length < 1) {
      devsTbodyEl.innerHTML =
        "<tr><td colspan='5'><div class='alert alert-sm alert-danger m-2 p-0 px-3 py-2 mx-auto' style='width:fit-content'>No developers yet!</div></td></tr>";
    } else {
      devs.forEach(function (item, ind) {
        devsTbodyEl.innerHTML += `
                <tr>
                    <th scope="row">${ind + 1}</th>
                    <td>${item.fname}</td>
                    <td>${item.lname}</td>
                    <td>${capitalizeFirstLetter(item.role)}</td>
                    <td>
                        <button class="btn btn-danger btn-sm del-dev-btn" title="Delete" data-id="${
                          item._id
                        }">
                            <i class="fa-solid fa-trash" data-id="${
                              item._id
                            }"></i>
                        </button>
                    </td>
                </tr>
                `;
      });

      bindDelDev();
    }
  }

  function createNewDev(event) {
    event.preventDefault();

    // Select the form input elements
    let devFirstNameInputEl = newDevFormEl.querySelector("#fname");
    let devLastNameInputEl = newDevFormEl.querySelector("#lname");

    // Create a new developer object
    let newDevObj = {
      fname: devFirstNameInputEl.value,
      lname: devLastNameInputEl.value,
      role: "developer",
      username:
        devFirstNameInputEl.value.toLowerCase() +
        devLastNameInputEl.value.slice(0, 1).toLowerCase(),
      password:
        devFirstNameInputEl.value.toLowerCase() +
        devLastNameInputEl.value.slice(0, 1).toLowerCase() +
        "@123",
    };

    // Send a POST request to the backend to create a new developer
    fetch(
      "https://taskmanagement-backend-ymxh.onrender.com/api/v1/users/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDevObj),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Handle successful response
        console.log("New developer created:", data);
        fetchDevs(); // Refresh the list of developers
        // Reset form and close modal
        devFirstNameInputEl.value = "";
        devLastNameInputEl.value = "";
        document.querySelector("#newDevModal .btn-close").click();
      })
      .catch((error) => {
        // Handle errors
        console.error("Error creating new developer:", error);
      });
  }

  async function delDev(id) {
    try {
      // Retrieve the token from sessionStorage
      const token = sessionStorage.getItem("token");

      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      // Fetch the developer details by id to get the name
      const response = await fetch(
        `https://taskmanagement-backend-ymxh.onrender.com/api/v1/users/${id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const developer = await response.json();

      // Confirmation prompt with the developer's name
      let confirmation = confirm(
        `Do you want to delete the developer "${developer.fname} ${developer.lname}"?`
      );

      if (confirmation) {
        // Send DELETE request to the backend with Authorization header
        const deleteResponse = await fetch(
          `https://taskmanagement-backend-ymxh.onrender.com/api/v1/users/${id}`,
          {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (!deleteResponse.ok) {
          throw new Error("Network response was not ok");
        }

        // Handle successful deletion
        console.log(
          `Developer ${developer.fname} ${developer.lname} deleted successfully`
        );
        await fetchDevs();
        await fetchTasks();
        //
        // Refresh the list of developers
      }
    } catch (error) {
      // Handle errors
      console.error("Error deleting developer:", error);
    }
  }

  function bindDelDev() {
    let delDevBtns = document.querySelectorAll(".del-dev-btn");
    delDevBtns.forEach(function (delDevBtn) {
      delDevBtn.addEventListener("click", function (event) {
        console.log("Developer ID:", event.target.dataset.id); // Debugging line
        delDev(event.target.dataset.id);
      });
    });
  }
}

// Developer Dashboard
if (pagename === "developer-dashboard") {
  const userfnameEl = document.querySelector("#userfname");
  const assignedTasksCountEl = document.querySelector("#assigned-tasks-count");
  const tasksYtsCountEl = document.querySelector("#tasks-yts-count");
  const tasksInpCountEl = document.querySelector("#tasks-inp-count");
  const completedTasksCountEl = document.querySelector(
    "#completed-tasks-count"
  );

  const token = sessionStorage.getItem("token");

  if (!token) {
    alert("No token found. Please log in.");
    window.location.href = "./index.html";
    // console.log("hiih");
  }

  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const userId = decodedToken._id;

  try {
    // Fetch user details
    const userResponse = await fetch(
      `https://taskmanagement-backend-ymxh.onrender.com/api/v1/users/${userId}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error(
        `Failed to fetch user details: ${userResponse.statusText}`
      );
    }

    const user = await userResponse.json();
    userfnameEl.innerHTML = user.fname;

    // Fetch all tasks
    const tasksResponse = await fetch(
      "https://taskmanagement-backend-ymxh.onrender.com/api/v1/tasks/list",
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!tasksResponse.ok) {
      if (tasksResponse.status === 404) {
        // Handle the case where no tasks are found
        assignedTasksCountEl.innerHTML = "0";
        tasksYtsCountEl.innerHTML = "0";
        tasksInpCountEl.innerHTML = "0";
        completedTasksCountEl.innerHTML = "0";
      }
      throw new Error(`Failed to fetch tasks: ${tasksResponse.statusText}`);
    }

    const allTasks = await tasksResponse.json();
    const myTasks = allTasks.filter((task) =>
      task.assignedTo.some((user) => user._id === userId)
    );
    // console.log(myTasks);
    // console.log(allTasks);

    // Update the task counts
    assignedTasksCountEl.innerHTML = myTasks.length;
    tasksYtsCountEl.innerHTML = myTasks.filter(
      (task) => task.progress === 0
    ).length;
    tasksInpCountEl.innerHTML = myTasks.filter(
      (task) => task.progress > 0 && task.progress < 100
    ).length;
    completedTasksCountEl.innerHTML = myTasks.filter(
      (task) => task.progress === 100
    ).length;
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("An error occurred. Please try again.");
  }
}

// Manage assigned tasks page
if (pagename === "manage-assigned-tasks") {
  const userfnameEl = document.querySelector("#userfname");
  const editTaskFormEl = document.querySelector("#editTaskForm");

  // Function to fetch user details and initialize the page
  async function initializePage() {
    const userDetails = await fetchUserDetails();
    if (userDetails) {
      userfnameEl.innerHTML = userDetails.fname;
      const myId = userDetails._id;
      await fetchTasks(myId);
    }
  }

  // Event listener which calls editTask when submit action is detected
  editTaskFormEl.addEventListener("submit", function (event) {
    event.preventDefault();
    editTask();
  });

  // Bind progress bar (if applicable)
  bindProgressBar();

  // Function which fetches user details and initializes the page
  async function fetchUserDetails() {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      window.location.href = "./index.html";
      return null; // Ensure function exits if no token
    }

    let userId;
    try {
      // Decode JWT token
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
      userId = decodedToken._id;
    } catch (error) {
      console.error("Failed to decode token:", error);
      alert("Invalid token. Please log in again.");
      window.location.href = "./index.html";
      return null; // Ensure function exits if decoding fails
    }

    try {
      // Fetch user details from backend
      const response = await fetch(
        `https://taskmanagement-backend-ymxh.onrender.com/api/v1/users/${userId}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      // Parse response JSON
      return await response.json();
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert("Failed to fetch user details. Please try again.");
      return null; // Return null in case of error
    }
  }

  // Function to fetch tasks from backend
  async function fetchTasks(userId) {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      window.location.href = "./index.html";
      return;
    }

    try {
      const response = await fetch(
        "https://taskmanagement-backend-ymxh.onrender.com/api/v1/tasks/list",
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const allTasks = await response.json();
      const myTasks = allTasks.filter((task) =>
        task.assignedTo.some((user) => user._id === userId)
      );
      showTasks(myTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  // Displays all tasks in a tabular format
  function showTasks(tasks) {
    const tasksTbodyEl = document.querySelector("#tasks-table tbody");
    tasksTbodyEl.innerHTML = "";

    if (tasks.length < 1) {
      tasksTbodyEl.innerHTML =
        "<tr><td colspan='6'><div class='alert alert-sm alert-danger m-2 p-0 px-3 py-2 mx-auto' style='width:fit-content'>No assigned tasks yet!</div></td></tr>";
    } else {
      tasks.sort(compare).forEach((item, ind) => {
        tasksTbodyEl.innerHTML += `
                <tr>
                     <th scope="row">${ind + 1}</th>
                     <td>${item.name}</td>
                     <td>${item.progress}%</td>
                     <td>${getStatus(item.progress)}</td>
                     <td>${formatDate(item.deadline)}</td>
                     <td>
                        <button class="btn btn-success btn-sm edit-task-btn" data-id="${
                          item._id
                        }" title="Edit" data-bs-toggle="modal" data-bs-target="#editTaskModal">
                            <i class="fa-solid fa-pencil" data-id="${
                              item._id
                            }"></i>
                        </button>
                     </td>
                 </tr>
            `;
      });
    }
  }

  function getStatus(progress) {
    if (progress === 0)
      return "<span class='badge text-bg-danger'>Yet to start</span>";
    if (progress === 100)
      return "<span class='badge text-bg-success'>Completed</span>";
    if (progress > 0 && progress < 100)
      return "<span class='badge text-bg-warning'>In progress</span>";
  }

  // Function edits a task's details based on user input, updates backend, fetches updated tasks, and closes the edit task modal.
  async function editTask() {
    const form = new FormData(editTaskFormEl);
    const id = form.get("editTaskId");
    const newProgress = Number(form.get("editTaskProgress"));
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      window.location.href = "./index.html";
      return;
    }

    try {
      const response = await fetch(
        `https://taskmanagement-backend-ymxh.onrender.com/api/v1/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ progress: newProgress }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken._id;

      // Fetch updated tasks after editing
      await fetchTasks(userId);
      document.querySelector("#editTaskModal .btn-close").click();
    } catch (error) {
      console.error("Error editing task:", error);
    }
  }

  // Function which fills preexisting data into the form boxes to allow for the user to edit data
  async function fillTaskData(id) {
    console.log(id);
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      window.location.href = "./index.html";
      return;
    }

    try {
      const response = await fetch(
        `https://taskmanagement-backend-ymxh.onrender.com/api/v1/tasks/${id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const task = await response.json();
      const taskIdEl = document.querySelector("#editTaskId");
      const taskProgressEl = document.querySelector("#editTaskProgress");
      const taskProgressValueEl = document.querySelector("#progressValue");

      taskIdEl.value = task._id;
      taskProgressEl.value = task.progress;
      taskProgressValueEl.innerHTML = task.progress + "%";
    } catch (error) {
      console.error("Error fetching task data:", error);
    }
  }

  const editModal = document.querySelector("#editTaskModal");
  editModal.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    const taskId = button.getAttribute("data-id");
    fillTaskData(taskId);
  });

  // Initialize the page
  initializePage();
}

// Settings Page
if (pagename === "settings") {
  document.addEventListener("DOMContentLoaded", () => {
    const userfnameEl = document.querySelector("#userfname");
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      window.location.href = "./index.html";
      return;
    }
    // Fetch user ID from token
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
    const userId = decodedToken._id;

    // Fetch user details from backend
    fetch(
      `https://taskmanagement-backend-ymxh.onrender.com/api/v1/users/${userId}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((user) => {
        userfnameEl.innerHTML = user.fname;
        const chngPwdFormEl = document.querySelector("#chngPwdForm");

        chngPwdFormEl.addEventListener("submit", function (event) {
          event.preventDefault();
          validateChngPwdForm(user._id);
        });
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        alert("An error occurred while fetching user details.");
      });

    function validateChngPwdForm(userId) {
      const currPwdEl = document.querySelector("#currentPassword");
      const newPwdEl = document.querySelector("#newPassword");
      const confirmPwdEl = document.querySelector("#confirmPassword");

      if (
        currPwdEl.value === "" ||
        newPwdEl.value === "" ||
        confirmPwdEl.value === ""
      ) {
        alert("Please fill all the fields to proceed!");
        return;
      }

      if (newPwdEl.value !== confirmPwdEl.value) {
        alert("New Password and confirm password are different.");
        return;
      }

      // Call backend to verify current password
      fetch(
        "https://taskmanagement-backend-ymxh.onrender.com/api/v1/users/verifyPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword: currPwdEl.value }),
        }
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            // Current password is correct, change password
            changePassword(userId, newPwdEl.value);
          } else {
            alert("Current password is incorrect!");
          }
        })
        .catch((error) => {
          console.error("Error verifying current password:", error);
          alert("An error occurred while verifying the password.");
        });
    }

    function changePassword(userId, newPassword) {
      fetch(
        "https://taskmanagement-backend-ymxh.onrender.com/api/v1/users/changePassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, newPassword }),
        }
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            alert("Password updated successfully!");
            window.location.href = "./logout.html";
          } else {
            alert("Failed to update password. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error updating password:", error);
          alert("An error occurred while updating the password.");
        });
    }
  });
}
