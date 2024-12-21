// Initialize markdown renderer
const renderer = new MDRenderer();

// Function to render markdown content
const renderMarkdown = (markdownContent) => {
  return renderer.render(markdownContent);
};

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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
};

const createProjectCard = (project) => {
  const li = document.createElement("li");
  
  // Create header with name and date
  const header = document.createElement("div");
  header.className = "project-header";
  
  const nameLink = document.createElement("a");
  nameLink.href = `viewer.html?render=${project.name}`; // Link to submodule
  nameLink.className = "project-name";
  nameLink.textContent = project.name;
  
  const date = document.createElement("span");
  date.className = "project-date";
  date.textContent = `Updated ${formatDate(project.lastUpdated)}`;
  
  header.appendChild(nameLink);
  header.appendChild(date);
  
  // Create description
  const description = document.createElement("p");
  description.className = "project-description";
  description.textContent = project.description || "No description available";
  
  // Create commit link
  const commitLink = document.createElement("a");
  commitLink.href = project.lastCommit.url; // Link to GitHub commit
  commitLink.className = "project-commit";
  commitLink.target = "_blank";
  commitLink.rel = "noopener noreferrer";
  
  const commitIcon = document.createElement("i");
  commitIcon.className = "fas fa-code-commit";
  
  const commitMessage = document.createElement("span");
  commitMessage.className = "commit-message";
  commitMessage.textContent = project.lastCommit.message.split('\n')[0]; // First line only
  
  const commitHash = document.createElement("span");
  commitHash.className = "commit-hash";
  commitHash.textContent = project.lastCommit.hash.slice(0, 7); // Short hash
  
  commitLink.appendChild(commitIcon);
  commitLink.appendChild(commitMessage);
  commitLink.appendChild(commitHash);

  // Create README section
  const readmeToggle = document.createElement("button");
  readmeToggle.className = "readme-toggle";
  readmeToggle.innerHTML = '<i class="fas fa-book"></i> View README';
  
  const readmeContent = document.createElement("div");
  readmeContent.className = "project-readme";
  if (project.readme) {
    readmeContent.innerHTML = renderMarkdown(project.readme);
  } else {
    readmeContent.textContent = "No README available";
  }
  
  readmeToggle.addEventListener("click", () => {
    readmeContent.classList.toggle("active");
    readmeToggle.innerHTML = readmeContent.classList.contains("active") 
      ? '<i class="fas fa-book-open"></i> Hide README'
      : '<i class="fas fa-book"></i> View README';
  });
  
  // Append all elements
  li.appendChild(header);
  li.appendChild(description);
  li.appendChild(commitLink);
  if (project.readme) {
    li.appendChild(readmeToggle);
    li.appendChild(readmeContent);
  }
  
  return li;
};

const filterProjects = (searchTerm) => {
  const normalizedTerm = searchTerm.toLowerCase();
  projectList.innerHTML = "";
  
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(normalizedTerm) ||
    (project.description && project.description.toLowerCase().includes(normalizedTerm))
  );

  if (filteredProjects.length === 0) {
    const noResults = document.createElement("li");
    noResults.className = "no-results";
    noResults.textContent = `No projects found matching "${searchTerm}"`;
    projectList.appendChild(noResults);
    return;
  }
  
  filteredProjects.forEach((project) => {
    projectList.appendChild(createProjectCard(project));
  });
};

searchInput.addEventListener("input", (e) => {
  filterProjects(e.target.value);
});

// Show loading state
projectList.innerHTML = `
  <li class="loading-spinner">
    <i class="fas fa-spinner fa-2x"></i>
  </li>
`;

// Fetch and display projects
fetch("submodules.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  })
  .then((data) => {
    projects = data;
    filterProjects("");
  })
  .catch((error) => {
    console.error("Error loading submodules:", error);
    projectList.innerHTML = `
      <li class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>Failed to load projects. Please try again later.</p>
      </li>
    `;
  });

// Initialize theme
setInitialTheme();
