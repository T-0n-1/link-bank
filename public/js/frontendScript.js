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

let currentLinkElement = null; // Store the link being edited

function showEditForm(linkElement) {
  // Populate the form with the link's existing text and URL
  currentLinkElement = linkElement;
  const form = document.getElementById("editForm");
  document.getElementById("editText").value = linkElement.textContent;
  document.getElementById("editUrl").value = linkElement.href;
  form.style.display = "block"; // Show the form
}

function submitEdit(event) {
  event.preventDefault(); // Prevent form submission from reloading the page

  // Validate and sanitize input
  const newText = sanitizeInput(document.getElementById("editText").value);
  const newUrl = sanitizeInput(document.getElementById("editUrl").value);

  if (currentLinkElement) {
    // Update the link element
    currentLinkElement.textContent = newText;
    currentLinkElement.href = newUrl;
  }

  cancelEdit(); // Hide the form
}

function cancelEdit() {
  // Hide the form
  document.getElementById("editForm").style.display = "none";
  currentLinkElement = null; // Clear the current link reference
}

function sanitizeInput(input) {
  // Basic sanitization to escape HTML special characters
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}
