const toggle = document.getElementById("theme-toggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
});

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

      // Append link to the list item and the list item to the list
      listItem.appendChild(link);
      list.appendChild(listItem);
    });
  })
  .catch((error) => console.error("Error loading submodules:", error));
