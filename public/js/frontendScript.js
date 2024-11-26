// export async function fetchLinks() {
//   try {
//     const response = await fetch("/getAll");
//     if (!response.ok) {
//       throw new Error("Failed to fetch links");
//     }
//     const links = await response.json();

//     // Clear the current list
//     const listContainer = document.getElementById("links-list");
//     listContainer.innerHTML = "";

//     // Add each link to the list
//     links.forEach((link) => {
//       const listItem = document.createElement("li");
//       const anchor = document.createElement("a");
//       anchor.href = link.link;
//       anchor.textContent = link.linkName;
//       anchor.target = "_blank";
//       listItem.appendChild(anchor);
//       listContainer.appendChild(listItem);
//     });
//   } catch (error) {
//     console.error("Error fetching links:", error);
//     alert("Failed to load links. Please try again.");
//   }
// }