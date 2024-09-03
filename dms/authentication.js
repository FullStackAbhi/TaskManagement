function authenticate() {
  const token = sessionStorage.getItem("token");

  if (token !== null) {
    // Decode the token to get the user role (you might need to include a library like jwt-decode for this)
    const user = JSON.parse(atob(token.split(".")[1])); // Decoding JWT

    let pagename = document.querySelector("body").dataset.page;
    if (
      pagename === "developer-dashboard" ||
      pagename === "manage-assigned-tasks"
    ) {
      if (user.role === "manager") {
        location.href = "./manager.html";
      }
    }
    if (
      pagename === "dashboard" ||
      pagename === "manage-tasks" ||
      pagename === "manage-devs"
    ) {
      if (user.role === "developer") {
        location.href = "./developer.html";
      }
    }
  } else {
    location.href = "./logout.html";
  }
}

authenticate();
