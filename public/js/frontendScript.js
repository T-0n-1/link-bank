/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unused-vars */
function deleteItem(id) {
  const confirmation = window.confirm("Are you sure you want to delete this item?");
    if (!confirmation) {
        return;
    }
  const cleanedId = id.replace(/[\[\]\s]/g, "");
  const urlParts = cleanedId.split(",");
  if (urlParts.length !== 3) {
      console.error("Invalid ID format. Expected format: [server, port, id]");
      return;
  }
  const [server, port, resourceId] = urlParts;
  fetch(`http://${server}:${port}/api/delete/${resourceId}`, {
      method: "DELETE",
  })
  .then((response) => {
      if (response.ok) {
          location.reload();
      } else {
          console.error("Failed to delete item:", response.status);
      }
  })
  .catch((error) => {
      console.error("Error during delete request:", error);
  });
}

function editItem(id) {
  const parsedId = parseInt(id);
  window.location.href = `/api/edit/${id}`;
}

function cancelEdit() {
  if (document.getElementById("editId")) {
    window.location.href = "/api/links";
  } else {
    window.location.href = "/";
  }
}

function submitEdit(event) {
  event.preventDefault();
  const id = document.getElementById("editId").value;
  const linkName = document.getElementById("editText").value;
  const link = document.getElementById("editUrl").value;
  const description = document.getElementById("editDescription").value;
  const payload = { id, linkName, link, description };
  fetch("/api/update", {
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
      location.href = "/api/links";
    })
    .catch((error) => {
      console.error("Error updating the link:", error);
      alert(error.message || "An unexpected error occurred.");
    });
}

function submitNew(event) {
  event.preventDefault();
  const linkName = document.getElementById("editText").value;
  const link = document.getElementById("editUrl").value;
  const description = document.getElementById("editDescription").value;
  fetch("/api/insert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ linkName, link, description }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.error || "Failed to add the new link.");
        });
      }
      return response.json();
    })
    .then((data) => {
      alert(data.message || "Link added successfully!");
      window.location.href = "/api/links";
    })
    .catch((error) => {
      console.error("Error adding new link:", error);
      alert(error.message || "An unexpected error occurred.");
    });
}
