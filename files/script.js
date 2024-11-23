fetch("submodules.json")
  .then((response) => response.json())
  .then((data) => {
    const list = document.getElementById("submodule-list");
    data.forEach((submodule) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");

      // Set link properties
      link.textContent = submodule.name;
      link.href = `/${submodule.name}`; // Adjust the URL as needed
      link.target = "_blank"; // Open link in a new tab

      // Append link to the list item and the list item to the list
      listItem.appendChild(link);
      list.appendChild(listItem);
    });
  })
  .catch((error) => console.error("Error loading submodules:", error));
