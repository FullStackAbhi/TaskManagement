// Uncomment these lines to restore/initialize local Data
const data = {
  tasks: [
    {
      id: 1,
      name: "Create APIs",
      progress: 30,
      deadline: "24-04-2025",
      assignedTo: [2],
    },
    {
      id: 2,
      name: "Redesign the UI",
      progress: 0,
      deadline: "13-08-2024",
      assignedTo: [3],
    },
    {
      id: 3,
      name: "Task 3",
      progress: 62,
      deadline: "24-12-2024",
      assignedTo: [2, 3],
    },
    {
      id: 4,
      name: "Task 4",
      progress: 62,
      deadline: "12-10-2024",
      assignedTo: [2, 3],
    },
    {
      id: 5,
      name: "Task 5",
      progress: 62,
      deadline: "24-12-2024",
      assignedTo: [2, 3],
    },
  ],
  taskCounter: 5,
  users: [
    {
      id: 1,
      fname: "Keshav",
      lname: "Pillarisetti",
      role: "manager",
      username: "keshavp",
      password: "keshavp@123",
    },
    {
      id: 2,
      fname: "Gautam",
      lname: "Singh",
      role: "developer",
      username: "gautams",
      password: "gautams@123",
    },
    {
      id: 3,
      fname: "Aryan",
      lname: "Gupta",
      role: "developer",
      username: "aryang",
      password: "aryang@123",
    },
  ],
  userCounter: 3,
};

if (!localStorage.getItem("data")) {
  localStorage.setItem("data", JSON.stringify(data));
}

export function updateLocalData(keyName, keyValue) {
  localStorage.setItem(keyName, JSON.stringify(keyValue));
}
export function getLocalData(keyName) {
  return JSON.parse(localStorage.getItem(keyName));
}
