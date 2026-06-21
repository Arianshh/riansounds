const projects = portfolioData.projects;
const panel = document.getElementById("projectPanel");
const backButton = document.getElementById("backButton");
const cursorLight = document.getElementById("cursorLight");

function platformLabel(name) {
  return { spotify: "Spotify", youtube: "YouTube", soundcloud: "SoundCloud", apple: "Apple" }[name] || name;
}

function renderTrackLinks(track) {
  const platforms = ["spotify", "apple", "youtube", "soundcloud"];
  const links = platforms
    .filter(platform => track[platform])
    .map(platform => `<a href="${track[platform]}" target="_blank" rel="noreferrer">${platformLabel(platform)} ↗</a>`)
    .join("");
  return links || `<span class="coming-soon">link soon</span>`;
}

function renderTracks(tracks) {
  return tracks.map((track, index) => `
    <article class="release-card">
      <div class="release-number">${String(index + 1).padStart(2, "0")}</div>
      <div>
        <h3>${track.title}</h3>
        <p>${track.type || "Release"} · ${track.role || ""}</p>
        <div class="release-links">${renderTrackLinks(track)}</div>
      </div>
    </article>
  `).join("");
}

function renderProjectLinks(links = []) {
  return links.map(link => `<a href="${link.url}" target="_blank" rel="noreferrer">${link.label} ↗</a>`).join("");
}

function openProject(key) {
  const project = projects[key];
  document.getElementById("projectType").textContent = project.type;
  document.getElementById("projectTitle").textContent = project.title;
  document.getElementById("projectLinks").innerHTML = renderProjectLinks(project.links);
  document.getElementById("projectDescription").textContent = project.description;
  document.getElementById("projectTags").innerHTML = project.tags.map(tag => `<span>${tag}</span>`).join("");
  document.getElementById("projectTracks").innerHTML = renderTracks(project.tracks);
  panel.classList.add("active");
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelectorAll(".project-bubble").forEach(bubble => {
  bubble.addEventListener("click", () => openProject(bubble.dataset.project));
  bubble.addEventListener("mousemove", event => {
    const rect = bubble.getBoundingClientRect();
    bubble.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    bubble.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  });
});

backButton.addEventListener("click", () => {
  panel.classList.remove("active");
  document.getElementById("projects").scrollIntoView({ behavior: "smooth", block: "center" });
});

const featured = [
  projects.jilliz.tracks.find(t => t.title === "Iran Khube"),
  projects.rian.tracks.find(t => t.title === "Pakkon"),
  projects.rian.tracks.find(t => t.title === "Rakhte Tane Delbar"),
  projects.jetpack.tracks.find(t => t.title === "Kafi Nist"),
  projects.jetpack.tracks.find(t => t.title === "Blue as a Girl")
].filter(Boolean);
document.getElementById("featuredTracks").innerHTML = renderTracks(featured);
document.getElementById("year").textContent = new Date().getFullYear();

window.addEventListener("mousemove", event => {
  cursorLight.style.left = `${event.clientX}px`;
  cursorLight.style.top = `${event.clientY}px`;
});
