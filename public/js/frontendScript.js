/* eslint-disable @typescript-eslint/no-unused-vars */
function deleteItem(id) {
    const url = id.split(",");
    url[0] = url[0].replace("[", "");
    url[1] = url[1].replace(" ", "");
    url[2] = url[2].replace(" ", "");
    url[2] = url[2].replace("]", "");
    fetch(`http://${url[0]}:${url[1]}/api/delete/${url[2]}`, {
        method: 'DELETE',
    }).then((response) => {
        if (response.ok) {
            location.reload();
        } 
    });
}

function editItem(id) {
  // Redirect the user to the edit page
  const parsedId = parseInt(id);
  window.location.href = `/api/edit/${id}`;
}

function submitEdit(event) {
  event.preventDefault();

  // Collect values from the form
  const id = document.getElementById("editId").value;
  const linkName = document.getElementById("editText").value;
  const link = document.getElementById("editUrl").value;
  const description = document.getElementById("editDescription").value;

  // Prepare the request payload
  const payload = { id, linkName, link, description };

  // Send the PUT request to the server
  fetch("/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.error || "Failed to update the link.");
        });
      }
      return response.json();
    })
    .then((data) => {
      alert(data.message || "Update successful!");
      // Optionally redirect or refresh the page
      location.href = "/links"; // Adjust as needed
    })
    .catch((error) => {
      console.error("Error updating the link:", error);
      alert(error.message || "An unexpected error occurred.");
    });
}
