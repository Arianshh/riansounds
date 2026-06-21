const projects = portfolioData.projects;
let currentLang = localStorage.getItem("riansounds_lang") || "en";
let currentProjectKey = null;

const panel = document.getElementById("projectPanel");
const backButton = document.getElementById("backButton");
const cursorLight = document.getElementById("cursorLight");
const langToggle = document.getElementById("langToggle");

function t(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value[currentLang] || value.en || "";
  return value || "";
}
function ui(key) { return translations[currentLang][key] || translations.en[key] || key; }

function platformLabel(name) {
  const labels = {
    en: { spotify:"Spotify", youtube:"YouTube", soundcloud:"SoundCloud", apple:"Apple" },
    fa: { spotify:"اسپاتیفای", youtube:"یوتیوب", soundcloud:"ساندکلاد", apple:"اپل موزیک" }
  };
  return labels[currentLang][name] || name;
}

function applyStaticTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = ui(el.dataset.i18n));
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => el.placeholder = ui(el.dataset.i18nPlaceholder));
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "fa" ? "rtl" : "ltr";
  document.body.classList.toggle("is-fa", currentLang === "fa");
  langToggle.textContent = currentLang === "en" ? "فا" : "EN";
}

function renderTrackLinks(track) {
  const platforms = ["spotify", "apple", "youtube", "soundcloud"];
  const links = platforms
    .filter(platform => track[platform])
    .map(platform => `<a href="${track[platform]}" target="_blank" rel="noreferrer">${platformLabel(platform)} ↗</a>`)
    .join("");
  return links || `<span class="coming-soon">${ui("linkSoon")}</span>`;
}

function renderTracks(tracks) {
  return tracks.map((track, index) => `
    <article class="release-card">
      <div class="release-number">${String(index + 1).padStart(2, "0")}</div>
      <div>
        <h3>${track.title}</h3>
        <p>${t(track.type)} · ${t(track.role)}</p>
        <div class="release-links">${renderTrackLinks(track)}</div>
      </div>
    </article>
  `).join("");
}

function renderProjectLinks(links = []) {
  return links.map(link => `<a href="${link.url}" target="_blank" rel="noreferrer">${t(link.label)} ↗</a>`).join("");
}

function openProject(key) {
  currentProjectKey = key;
  const project = projects[key];
  document.getElementById("projectType").textContent = t(project.type);
  document.getElementById("projectTitle").textContent = t(project.title);
  document.getElementById("projectLinks").innerHTML = renderProjectLinks(project.links);
  document.getElementById("projectDescription").textContent = t(project.description);
  document.getElementById("projectTags").innerHTML = t(project.tags).map(tag => `<span>${tag}</span>`).join("");
  document.getElementById("projectTracks").innerHTML = renderTracks(project.tracks);
  panel.classList.add("active");
  panel.scrollIntoView({ behavior:"smooth", block:"start" });
}

function getFeaturedTracks() {
  return [
    projects.jilliz.tracks.find(track => track.title === "Iran Khube"),
    projects.rian.tracks.find(track => track.title === "Pakkon"),
    projects.jetpack.tracks.find(track => track.title === "Kafi Nist"),
    projects.rian.tracks.find(track => track.title === "Rakhte Tane Delbar"),
    projects.jetpack.tracks.find(track => track.title === "Blue as a Girl")
  ].filter(Boolean);
}
function renderFeaturedTracks() {
  document.getElementById("featuredTracks").innerHTML = renderTracks(getFeaturedTracks());
}
function refreshLanguage() {
  applyStaticTranslations();
  renderFeaturedTracks();
  if (currentProjectKey) openProject(currentProjectKey);
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
  currentProjectKey = null;
  document.getElementById("projects").scrollIntoView({ behavior:"smooth", block:"center" });
});

langToggle.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "fa" : "en";
  localStorage.setItem("riansounds_lang", currentLang);
  refreshLanguage();
});

window.addEventListener("mousemove", event => {
  cursorLight.style.left = `${event.clientX}px`;
  cursorLight.style.top = `${event.clientY}px`;
});

document.getElementById("year").textContent = new Date().getFullYear();
refreshLanguage();
