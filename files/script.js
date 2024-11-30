// Theme handling
const toggle = document.getElementById("theme-toggle");
const moonIcon = toggle.querySelector("i");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Set initial theme based on system preference
const setInitialTheme = () => {
  if (localStorage.getItem("theme")) {
    document.body.classList.toggle(
      "light-theme",
      localStorage.getItem("theme") === "light"
    );
    updateThemeIcon();
  } else if (!prefersDarkScheme.matches) {
    document.body.classList.add("light-theme");
    updateThemeIcon();
  }
};

const updateThemeIcon = () => {
  const isLightTheme = document.body.classList.contains("light-theme");
  moonIcon.className = isLightTheme ? "fas fa-sun" : "fas fa-moon";
};

toggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  const isLight = document.body.classList.contains("light-theme");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  updateThemeIcon();
});

// Project list and search functionality
const projectList = document.getElementById("submodule-list");
const searchInput = document.getElementById("project-search");
let projects = [];

const createProjectCard = (project) => {
  const li = document.createElement("li");
  
  // Create and setup link
  const link = document.createElement("a");
  link.href = `/${project.name}`;
  link.textContent = project.name;
  
  // Create description element
  const description = document.createElement("p");
  description.className = "project-description";
  description.textContent = project.description || "No description available";
  
  // Append elements
  li.appendChild(link);
  li.appendChild(description);
  
  return li;
};

const filterProjects = (searchTerm) => {
  const normalizedTerm = searchTerm.toLowerCase();
  projectList.innerHTML = "";
  
  projects
    .filter((project) =>
      project.name.toLowerCase().includes(normalizedTerm) ||
      (project.description && project.description.toLowerCase().includes(normalizedTerm))
    )
    .forEach((project) => {
      projectList.appendChild(createProjectCard(project));
    });
};

searchInput.addEventListener("input", (e) => {
  filterProjects(e.target.value);
});

// Fetch and display projects
fetch("submodules.json")
  .then((response) => response.json())
  .then((data) => {
    projects = data;
    filterProjects("");
  })
  .catch((error) => {
    console.error("Error loading submodules:", error);
    projectList.innerHTML = `
      <li class="error-message">
        Failed to load projects. Please try again later.
      </li>
    `;
  });

// Initialize theme
setInitialTheme();
