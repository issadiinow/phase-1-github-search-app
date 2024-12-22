document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const userResults = document.getElementById("user-results");
    const repoResults = document.getElementById("repo-results");
    const repoSearchBtn = document.getElementById("repo-search-btn");
  
    let currentSearchType = "user"; // Default search type is "user"
  
    // Handle form submission
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        if (currentSearchType === "user") {
          searchUsers(query);
        } else {
          searchRepos(query);
        }
      }
    });
  
    // Toggle search type between user and repo
    repoSearchBtn.addEventListener("click", () => {
      currentSearchType = currentSearchType === "user" ? "repo" : "user";
      repoSearchBtn.textContent = currentSearchType === "user" ? "Search Repos" : "Search Users";
      searchInput.placeholder = currentSearchType === "user" ? "Search for GitHub user..." : "Search for GitHub repo...";
      repoResults.innerHTML = ""; // Clear repo results
    });
  
    // Search for users using GitHub API
    const searchUsers = (query) => {
      userResults.innerHTML = "Loading...";
      fetch(`https://api.github.com/search/users?q=${query}`, {
        headers: { "Accept": "application/vnd.github.v3+json" }
      })
      .then(response => response.json())
      .then(data => {
        userResults.innerHTML = ""; // Clear previous results
        if (data.items) {
          data.items.forEach(user => renderUser(user));
        } else {
          userResults.innerHTML = "No users found.";
        }
      })
      .catch(error => {
        userResults.innerHTML = "Error fetching users.";
        console.error(error);
      });
    };
  
    // Render user info on the page
    const renderUser = (user) => {
      const userCard = document.createElement("div");
      userCard.classList.add("user-result");
      userCard.innerHTML = `
        <h3>${user.login}</h3>
        <img src="${user.avatar_url}" alt="${user.login}" width="100">
        <a href="${user.html_url}" target="_blank">View Profile</a>
      `;
      userCard.addEventListener("click", () => searchUserRepos(user.login));
      userResults.appendChild(userCard);
    };
  
    // Search for repositories of a user
    const searchUserRepos = (username) => {
      repoResults.innerHTML = "Loading...";
      fetch(`https://api.github.com/users/${username}/repos`, {
        headers: { "Accept": "application/vnd.github.v3+json" }
      })
      .then(response => response.json())
      .then(data => {
        repoResults.innerHTML = ""; // Clear previous repo results
        if (data.length > 0) {
          data.forEach(repo => renderRepo(repo));
        } else {
          repoResults.innerHTML = "No repositories found.";
        }
      })
      .catch(error => {
        repoResults.innerHTML = "Error fetching repositories.";
        console.error(error);
      });
    };
  
    // Render repository info on the page
    const renderRepo = (repo) => {
      const repoCard = document.createElement("div");
      repoCard.classList.add("repo-result", "repo-card");
      repoCard.innerHTML = `
        <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
        <p>${repo.description || "No description available."}</p>
        <p>⭐ ${repo.stargazers_count} Stars</p>
      `;
      repoResults.appendChild(repoCard);
    };
  });
  