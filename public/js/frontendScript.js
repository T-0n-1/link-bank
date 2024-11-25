// Function to fetch all links and populate the list
async function fetchLinks() {
    try {
      const response = await fetch('/api/getAll'); // Backend endpoint to get all links
      const links = await response.json();
  
      const linkList = document.getElementById('link-list');
      linkList.innerHTML = ''; // Clear existing list
  
      // Populate the list with links
      links.forEach(link => {
        const linkItem = document.createElement('div');
        linkItem.classList.add('link-item');
        linkItem.textContent = link.linkName;
        linkItem.dataset.id = link.id; // Store ID for fetching details later
        linkItem.onclick = () => fetchLinkDetails(link.id); // Attach click event
        linkList.appendChild(linkItem);
      });
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  }
  
  // Function to fetch details for a specific link
  async function fetchLinkDetails(linkId) {
    try {
      const response = await fetch(`/api/links/${linkId}`); // Backend endpoint to get link details
      const link = await response.json();
  
      // Update the details section
      document.getElementById('link-name').textContent = link.linkName;
      document.getElementById('link-description').textContent = link.description;
      const linkUrl = document.getElementById('link-url');
      linkUrl.textContent = link.link;
      linkUrl.href = link.link;
    } catch (error) {
      console.error('Error fetching link details:', error);
    }
  }
  
  // Event listener for "List All Links" button
  document.getElementById('list-all-links-button').addEventListener('click', fetchLinks);
  