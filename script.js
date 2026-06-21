const projectKeys = ["rian", "jilliz", "jetpack"];
let currentLang = "en"; // IMPORTANT: default is always English on every page load.
let currentProjectKey = null;

const textIds = [
  "logoFirst", "logoLast", "navProjects", "navTracks", "navAbout", "navContact",
  "heroEyebrow", "heroTitle", "heroIntro", "telegramCTA", "bubbleSolo", "bubbleFive", "bubbleThree", "heroHint",
  "backButton", "releasesTitle", "linksTitle", "selectedReleases", "acrossProjects",
  "aboutEyebrow", "aboutTitle", "aboutText", "contactArian",
  "contactEyebrow", "contactTitle", "contactText", "emailLabel", "telegramLabel",
  "formName", "formEmail", "formMessage", "sendButton", "formNote"
];

function tr(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[currentLang] || value.en || "";
  }
  return value || "";
}

function ui(key) {
  return SITE_TEXT[currentLang][key] || SITE_TEXT.en[key] || "";
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setHTML(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}

function applyLanguageShell() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "fa" ? "rtl" : "ltr";
  document.body.classList.toggle("is-fa", currentLang === "fa");

  textIds.forEach(id => setText(id, ui(id)));

  document.getElementById("formNameInput").placeholder = ui("formNamePlaceholder");
  document.getElementById("formEmailInput").placeholder = ui("formEmailPlaceholder");
  document.getElementById("formMessageInput").placeholder = ui("formMessagePlaceholder");

  document.getElementById("langToggle").textContent = currentLang === "en" ? "فا" : "EN";

  setHTML("bubbleRian", PROJECTS.rian.bubbleTitle[currentLang]);
  setHTML("bubbleJilliz", PROJECTS.jilliz.bubbleTitle[currentLang]);
  setHTML("bubbleJetpack", PROJECTS.jetpack.bubbleTitle[currentLang]);
}

function platformLabel(platform) {
  return ui(platform) || platform;
}

function renderTrackLinks(track) {
  const platforms = ["spotify", "apple", "youtube", "soundcloud"];
  const html = platforms
    .filter(platform => Boolean(track[platform]))
    .map(platform => `<a href="${track[platform]}" target="_blank" rel="noreferrer">${platformLabel(platform)} ↗</a>`)
    .join("");

  return html || `<span class="coming-soon">${ui("linkSoon")}</span>`;
}

function renderTracks(tracks) {
  return tracks.map((track, index) => `
    <article class="release-card">
      <div class="release-number">${String(index + 1).padStart(2, "0")}</div>
      <div class="release-content">
        <h3>${track.title}</h3>
        <p>${tr(track.type)} · ${tr(track.role)}</p>
        <div class="release-links">${renderTrackLinks(track)}</div>
      </div>
    </article>
  `).join("");
}

function renderProjectLinks(links) {
  return links
    .map(link => `<a href="${link.url}" target="_blank" rel="noreferrer">${tr(link.label)} ↗</a>`)
    .join("");
}

function openProject(key) {
  currentProjectKey = key;
  const project = PROJECTS[key];

  setText("projectType", tr(project.type));
  setText("projectTitle", tr(project.title));
  document.getElementById("projectLinks").innerHTML = renderProjectLinks(project.links);
  setText("projectDescription", tr(project.description));
  document.getElementById("projectTags").innerHTML = tr(project.tags).map(tag => `<span>${tag}</span>`).join("");
  document.getElementById("projectTracks").innerHTML = renderTracks(project.tracks);

  document.getElementById("projectPanel").classList.add("active");
  document.getElementById("projectPanel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function getFeaturedTracks() {
  return [
    PROJECTS.jilliz.tracks.find(t => t.title === "Iran Khube"),
    PROJECTS.rian.tracks.find(t => t.title === "Pakkon"),
    PROJECTS.jetpack.tracks.find(t => t.title === "Kafi Nist"),
    PROJECTS.rian.tracks.find(t => t.title === "Rakhte Tane Delbar"),
    PROJECTS.jetpack.tracks.find(t => t.title === "Blue as a Girl")
  ].filter(Boolean);
}

function refreshAllText() {
  applyLanguageShell();
  document.getElementById("featuredTracks").innerHTML = renderTracks(getFeaturedTracks());
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

document.getElementById("backButton").addEventListener("click", () => {
  document.getElementById("projectPanel").classList.remove("active");
  currentProjectKey = null;
  document.getElementById("projects").scrollIntoView({ behavior: "smooth", block: "center" });
});

document.getElementById("langToggle").addEventListener("click", () => {
  currentLang = currentLang === "en" ? "fa" : "en";
  refreshAllText();
});

window.addEventListener("mousemove", event => {
  const cursorLight = document.getElementById("cursorLight");
  cursorLight.style.left = `${event.clientX}px`;
  cursorLight.style.top = `${event.clientY}px`;
});

document.getElementById("year").textContent = new Date().getFullYear();
refreshAllText();
