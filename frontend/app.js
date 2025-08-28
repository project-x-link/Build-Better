fetch("https://build-better-backend.onrender.com/api/data")

// -------------------- PROFESSIONAL REGISTRATION --------------------
document.getElementById("professionalForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const professional = {
    fullName: document.getElementById("fullName").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    category: document.getElementById("category").value,
    experience: document.getElementById("experience").value,
    serviceArea: document.getElementById("serviceArea").value,
    description: document.getElementById("description").value,
    rate: document.getElementById("rate").value,
  };

  try {
    const res = await fetch(`${API_BASE}/api/professionals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(professional),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Professional registered successfully!");
      e.target.reset();
    } else {
      alert("❌ Error: " + data.error);
    }
  } catch (err) {
    alert("⚠️ Network error: " + err.message);
  }
});

// -------------------- FETCH PROFESSIONALS BY CATEGORY --------------------
async function fetchProfessionals(category) {
  try {
    const res = await fetch(`${API_BASE}/api/professionals/${category}`);
    const data = await res.json();

    renderProfessionals(category, data);
    document.getElementById(`${category}Count`).innerText = data.length;
  } catch (err) {
    console.error("Error fetching professionals:", err.message);
  }
}

function renderProfessionals(category, data) {
  const grid = document.getElementById(category + "Grid");

  if (!data || data.length === 0) {
    grid.innerHTML = `
      <div class="empty-state col-span-full">
        <div class="empty-state-icon">⚠️</div>
        <h3 class="text-xl font-semibold mb-2">No ${category} Available</h3>
        <p>Be the first professional to join this category!</p>
        <button onclick="scrollToSection('join')" 
                class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Join as Professional
        </button>
      </div>`;
    return;
  }

  grid.innerHTML = data
    .map(
      (pro) => `
      <div class="professional-card">
        <h3 class="text-lg font-bold">${pro.fullName}</h3>
        <p class="text-gray-600">${pro.experience} years experience</p>
        <p class="text-gray-600">📍 ${pro.serviceArea}</p>
        <p class="text-gray-600">💰 ${pro.rate || "Not specified"}</p>
        <p class="mt-2 text-sm text-gray-700">${pro.description || ""}</p>
      </div>`
    )
    .join("");
}

// -------------------- LOGIN --------------------
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.querySelector("input[type='text']").value;
  const password = e.target.querySelector("input[type='password']").value;

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (res.ok) {
      alert("✅ Login successful!");
      localStorage.setItem("token", data.token); // save JWT
      hideLoginModal();
      fetchMyProjects(); // refresh user projects after login
    } else {
      alert("❌ " + data.error);
    }
  } catch (err) {
    alert("⚠️ Network error: " + err.message);
  }
});

// -------------------- SIGNUP --------------------
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = {
    name: e.target.querySelector("input[type='text']").value,
    email: e.target.querySelector("input[type='email']").value,
    password: e.target.querySelector("input[type='password']").value,
  };

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const data = await res.json();

    if (res.ok) {
      alert("✅ Signup successful!");
      hideSignupModal();
    } else {
      alert("❌ " + data.error);
    }
  } catch (err) {
    alert("⚠️ Network error: " + err.message);
  }
});

// -------------------- POST PROJECT --------------------
document.getElementById("projectForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) {
    alert("⚠️ Please log in first to post a project.");
    return;
  }

  const project = {
    title: document.getElementById("projectTitle").value,
    description: document.getElementById("projectDescription").value,
    budget: document.getElementById("projectBudget").value,
    location: document.getElementById("projectLocation").value,
  };

  try {
    const res = await fetch(`${API_BASE}/api/projects`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(project),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Project posted successfully!");
      e.target.reset();
      fetchProjects();    // refresh all projects
      fetchMyProjects();  // refresh user’s projects
    } else {
      alert("❌ Error: " + data.error);
    }
  } catch (err) {
    alert("⚠️ Network error: " + err.message);
  }
});

// -------------------- FETCH & RENDER PROJECTS --------------------
async function fetchProjects() {
  try {
    const res = await fetch(`${API_BASE}/api/projects`);
    const data = await res.json();

    renderProjects(data);
  } catch (err) {
    console.error("Error fetching projects:", err.message);
  }
}

function renderProjects(data) {
  const grid = document.getElementById("projectsGrid");

  if (!data || data.length === 0) {
    grid.innerHTML = `
      <div class="empty-state col-span-full">
        <div class="empty-state-icon">📭</div>
        <h3 class="text-xl font-semibold mb-2">No Projects Available</h3>
        <p>Be the first client to post a project!</p>
      </div>`;
    return;
  }

  grid.innerHTML = data
    .map(
      (proj) => `
      <div class="project-card border p-4 rounded shadow">
        <h3 class="text-lg font-bold">${proj.title}</h3>
        <p class="text-gray-600">${proj.description}</p>
        <p class="text-gray-600">📍 ${proj.location}</p>
        <p class="text-gray-600">💰 ${proj.budget || "Not specified"}</p>
        <p class="mt-2 text-sm text-gray-500">Posted by: ${proj.userId?.name || "Anonymous"}</p>
      </div>`
    )
    .join("");
}

window.fetchProjects = fetchProjects;

// -------------------- FETCH & RENDER MY PROJECTS --------------------
async function fetchMyProjects() {
  const token = localStorage.getItem("token");
  if (!token) {
    document.getElementById("myProjectsGrid").innerHTML = `
      <p class="text-center text-gray-600 col-span-full">⚠️ Please log in to view your projects.</p>`;
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/projects/my-projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    renderMyProjects(data);
  } catch (err) {
    console.error("Error fetching my projects:", err.message);
  }
}

function renderMyProjects(data) {
  const grid = document.getElementById("myProjectsGrid");

  if (!data || data.length === 0) {
    grid.innerHTML = `
      <div class="empty-state col-span-full">
        <div class="empty-state-icon">📭</div>
        <h3 class="text-xl font-semibold mb-2">No Projects Found</h3>
        <p>You haven’t posted any projects yet.</p>
      </div>`;
    return;
  }

  grid.innerHTML = data
    .map(
      (proj) => `
      <div class="project-card border p-4 rounded shadow">
        <h3 class="text-lg font-bold">${proj.title}</h3>
        <p class="text-gray-600">${proj.description}</p>
        <p class="text-gray-600">📍 ${proj.location}</p>
        <p class="text-gray-600">💰 ${proj.budget || "Not specified"}</p>
      </div>`
    )
    .join("");
}

window.fetchMyProjects = fetchMyProjects;

// -------------------- INIT --------------------
document.addEventListener("DOMContentLoaded", () => {
  fetchProjects();     // load all projects
  fetchMyProjects();   // load logged-in user's projects
});
