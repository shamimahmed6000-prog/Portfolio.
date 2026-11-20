const portfolio = {
  name: "Shamim Ahmed",
  initials: "SA",
  role: "Software Engineering Student",
  profileImage: "profile.jpg",
  cv: "",
  intro: "I’m studying software engineering at Daffodil International University. I enjoy making websites and learning how to improve them.",

  about: [
    "I’m a software engineering student at Daffodil International University. Lately, I’ve been spending a lot of time learning frontend development and making small web projects.",
    "I mostly work with HTML, CSS, and JavaScript. I like seeing an idea take shape in the browser, then adjusting it until it feels right."
  ],
  interests: [
    "Frontend architecture and UI design",
    "Responsive web development",
    "Learning modern JavaScript tools"
  ],

  // Group labels are only presentation categories for the current skills.
  skills: [
    { name: "HTML", level: 88, group: "Frontend" },
    { name: "CSS", level: 85, group: "Frontend" },
    { name: "JavaScript", level: 78, group: "Frontend" },
    { name: "Responsive Design", level: 82, group: "Frontend" },
    { name: "Git & GitHub", level: 74, group: "Tools" },
    { name: "Problem Solving", level: 80, group: "Soft skills" }
  ],

  projects: [
    {
      title: "Personal Portfolio Website",
      description: "A responsive portfolio designed to present projects, educational background, and technical skills through a clean, structured interface.",
      tech: ["HTML", "CSS", "JavaScript"],
      github: "",
      live: "",
      status: "Completed"
    },
    {
      title: "Task Management App",
      description: "A productivity application designed to organize tasks, track progress, and manage priorities through a simple interface.",
      tech: ["JavaScript", "Local Storage", "UI/UX"],
      github: "",
      live: "",
      status: "Completed"
    },
    {
      title: "Landing Page Redesign",
      description: "A responsive landing page concept focused on readability, accessibility, and clear visual hierarchy.",
      tech: ["HTML", "CSS", "Design"],
      github: "",
      live: "",
      status: "In Progress"
    }
  ],

  education: [
    {
      period: "2025 – Present",
      title: "B.Sc. in Software Engineering",
      place: "Daffodil International University",
      details: "Studying core software engineering principles, web development, and problem-solving through academic coursework and hands-on projects."
    },
    {
      period: "2021 – 2023",
      title: "Higher Secondary Certificate (HSC)",
      place: "Cumilla Govt College",
      details: "Focused on science and mathematics with a strong interest in technology and analytical thinking."
    }
  ],

  roles: [
    {
      period: "2025 – Present",
      title: "Software Engineering Student",
      place: "Daffodil International University",
      details: "Building a foundation in software engineering through coursework and hands-on projects.",
      responsibilities: [
        "Study software engineering principles and web development.",
        "Apply coursework through responsive, practical web projects.",
        "Strengthen problem-solving and frontend development skills."
      ]
    }
  ],

  workExperience: [],
  certifications: [],
  achievements: [],

  highlights: [
    {
      title: "Curious learner",
      details: "Continuously strengthening development skills and exploring modern web tools."
    },
    {
      title: "Hands-on mindset",
      details: "Turning ideas and coursework into practical, responsive applications."
    },
    {
      title: "User-focused",
      details: "Valuing useful, intuitive digital experiences and clear interface design."
    }
  ],

  contactText: "Have a question or want to talk about a project? Send me a message. I’m always happy to hear from you.",
  email: "251-35-585@diu.edu.bd",
  github: "https://github.com/shamimahmed6000-prog",
  linkedin: "https://www.linkedin.com/in/ahmed-shawon-4b0164398",
  facebook: "https://www.facebook.com/share/1AAxZCadd9/?mibextid=wwXIfr"
};

const MANAGED_ENTRIES_KEY = "portfolio-managed-entries-v1";
const CERTIFICATE_DB_NAME = "portfolio-certificate-files";
const CERTIFICATE_STORE_NAME = "files";
let certificateObjectUrls = [];

/* Edit the portfolio object above to customize all personal content. */

/* =========================================================
   2. HELPERS
   ========================================================= */
function byId(id) {
  return document.getElementById(id);
}

// Escape data before inserting it into HTML templates.
function esc(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character];
  });
}

function safeWebLink(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const url = new URL(value, window.location.href);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch (error) {
    return "";
  }
}

function setEditorStatus(id, message) {
  const status = byId(id);
  if (status) status.textContent = message;
}

function createEntryId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
}

function isManagedEntry(item) {
  return item && typeof item === "object" &&
    typeof item.id === "string" && typeof item.title === "string" &&
    typeof item.place === "string" && typeof item.period === "string";
}

function loadManagedEntries() {
  try {
    const saved = window.localStorage.getItem(MANAGED_ENTRIES_KEY);
    if (!saved) return;
    const entries = JSON.parse(saved);
    if (!entries || typeof entries !== "object") throw new Error("Saved data has an invalid format.");
    portfolio.workExperience = Array.isArray(entries.workExperience)
      ? entries.workExperience.filter(isManagedEntry)
      : [];
    portfolio.certifications = Array.isArray(entries.certifications)
      ? entries.certifications.filter(isManagedEntry)
      : [];
    portfolio.achievements = Array.isArray(entries.achievements)
      ? entries.achievements.filter(isManagedEntry)
      : [];
  } catch (error) {
    const message = "Saved entries could not be loaded: " + error.message;
    setEditorStatus("experience-status", message);
    setEditorStatus("certificate-status", message);
    setEditorStatus("achievement-status", message);
  }
}

function saveManagedEntries() {
  try {
    window.localStorage.setItem(MANAGED_ENTRIES_KEY, JSON.stringify({
      workExperience: portfolio.workExperience,
      certifications: portfolio.certifications,
      achievements: portfolio.achievements
    }));
  } catch (error) {
    throw new Error("Could not save in this browser: " + error.message);
  }
}

function openCertificateDatabase() {
  if (!window.indexedDB) {
    return Promise.reject(new Error("This browser does not support certificate file storage."));
  }
  return new Promise(function (resolve, reject) {
    const request = window.indexedDB.open(CERTIFICATE_DB_NAME, 1);
    request.onupgradeneeded = function () {
      const database = request.result;
      if (!database.objectStoreNames.contains(CERTIFICATE_STORE_NAME)) {
        database.createObjectStore(CERTIFICATE_STORE_NAME);
      }
    };
    request.onsuccess = function () { resolve(request.result); };
    request.onerror = function () {
      reject(new Error("Could not open certificate storage: " +
        (request.error ? request.error.message : "unknown browser error")));
    };
    request.onblocked = function () {
      reject(new Error("Certificate storage is busy in another tab. Close that tab and try again."));
    };
  });
}

function storeCertificateFile(id, file) {
  return openCertificateDatabase().then(function (database) {
    return new Promise(function (resolve, reject) {
      const transaction = database.transaction(CERTIFICATE_STORE_NAME, "readwrite");
      transaction.objectStore(CERTIFICATE_STORE_NAME).put(file, id);
      transaction.oncomplete = function () { database.close(); resolve(); };
      transaction.onerror = function () {
        database.close();
        reject(new Error("Could not store the certificate file: " +
          (transaction.error ? transaction.error.message : "unknown browser error")));
      };
      transaction.onabort = function () {
        database.close();
        reject(new Error("Certificate file storage was cancelled."));
      };
    });
  });
}

function getCertificateFile(id) {
  return openCertificateDatabase().then(function (database) {
    return new Promise(function (resolve, reject) {
      const transaction = database.transaction(CERTIFICATE_STORE_NAME, "readonly");
      const request = transaction.objectStore(CERTIFICATE_STORE_NAME).get(id);
      let file = null;
      request.onsuccess = function () { file = request.result || null; };
      transaction.oncomplete = function () { database.close(); resolve(file); };
      transaction.onerror = function () {
        database.close();
        reject(new Error("Could not read the certificate file: " +
          (transaction.error ? transaction.error.message : "unknown browser error")));
      };
      transaction.onabort = function () {
        database.close();
        reject(new Error("Certificate file reading was cancelled."));
      };
    });
  });
}

function deleteCertificateFile(id) {
  return openCertificateDatabase().then(function (database) {
    return new Promise(function (resolve, reject) {
      const transaction = database.transaction(CERTIFICATE_STORE_NAME, "readwrite");
      transaction.objectStore(CERTIFICATE_STORE_NAME).delete(id);
      transaction.oncomplete = function () { database.close(); resolve(); };
      transaction.onerror = function () {
        database.close();
        reject(new Error("Could not remove the stored certificate file: " +
          (transaction.error ? transaction.error.message : "unknown browser error")));
      };
      transaction.onabort = function () {
        database.close();
        reject(new Error("Certificate file removal was cancelled."));
      };
    });
  });
}

/* =========================================================
   3. PAGE CONTENT
   ========================================================= */
function fillBasicInfo() {
  document.title = portfolio.name + " | " + portfolio.role;
  document.querySelector('meta[name="description"]').content = portfolio.intro;
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = portfolio.intro;
  document.querySelector('meta[name="theme-color"]').content =
    document.documentElement.dataset.theme === "dark" ? "#0c1018" : "#f5f6f8";

  byId("logo").textContent = portfolio.name;
  byId("hero-name").textContent = portfolio.name;
  byId("hero-role").textContent = portfolio.role;
  byId("hero-intro").textContent = portfolio.intro;
  byId("avatar-initials").textContent = portfolio.initials;
  byId("footer-name").textContent = portfolio.name;
  const footerMonogram = document.querySelector(".footer-monogram");
  if (footerMonogram) footerMonogram.textContent = portfolio.initials;
  byId("contact-text").textContent = portfolio.contactText;
  byId("footer-year").textContent = new Date().getFullYear();

  const image = byId("profile-img");
  if (portfolio.profileImage) {
    image.onload = function () { image.hidden = false; };
    image.onerror = function () { image.hidden = true; };
    image.src = portfolio.profileImage;
    image.alt = portfolio.name + " profile photo";
  }

  const cvLink = byId("cv-link");
  if (portfolio.cv) {
    cvLink.href = portfolio.cv;
    cvLink.hidden = false;
  }
  if (portfolio.profileImage) {
    byId("og-image").content = new URL(portfolio.profileImage, window.location.href).href;
  }
}

function renderCodePreview() {
  const firstName = portfolio.name.trim().split(/\s+/)[0] || "profile";
  const school = portfolio.education.length ? portfolio.education[0].place : "";
  const lines = [
    '<span class="code-line"><span class="code-keyword">const</span> <span class="code-variable">' + esc(firstName) + '</span> <span class="code-punctuation">= {</span></span>',
    '<span class="code-line">  <span class="code-property">role</span>: <span class="code-string">"' + esc(portfolio.role) + '"</span>,</span>',
    '<span class="code-line">  <span class="code-property">school</span>: <span class="code-string">"' + esc(school) + '"</span>,</span>',
    '<span class="code-line">  <span class="code-property">interests</span>: [</span>'
  ];
  portfolio.interests.forEach(function (interest, index) {
    lines.push('<span class="code-line">    <span class="code-string">"' + esc(interest) + '"</span>' + (index < portfolio.interests.length - 1 ? "," : "") + "</span>");
  });
  lines.push(
    '<span class="code-line">  ],</span>',
    '<span class="code-line">  <span class="code-property">openTo</span>: <span class="code-string">"' + esc(portfolio.contactText) + '"</span></span>',
    '<span class="code-line"><span class="code-punctuation">};</span></span>'
  );
  byId("profile-code").innerHTML = lines.join("");
}

function renderAbout() {
  byId("about-text").innerHTML = portfolio.about.map(function (paragraph) {
    return "<p>" + esc(paragraph) + "</p>";
  }).join("");

  byId("interest-list").innerHTML = portfolio.interests.map(function (item) {
    return "<li>" + esc(item) + "</li>";
  }).join("");
}

function renderSkills() {
  const groups = Object.create(null);
  portfolio.skills.forEach(function (skill) {
    const group = skill.group || "Skills";
    if (!groups[group]) groups[group] = [];
    groups[group].push(skill);
  });

  byId("skills-grid").innerHTML = Object.keys(groups).map(function (group) {
    const skills = groups[group].map(function (skill) {
      const level = Math.max(0, Math.min(100, Number(skill.level) || 0));
      const name = esc(skill.name);
      return '<div class="skill-item">' +
        '<div class="skill-top"><span>' + name + '</span><span>' + level + "%</span></div>" +
        '<div class="skill-track" role="progressbar" aria-label="' + name + '" aria-valuenow="' + level + '" aria-valuemin="0" aria-valuemax="100">' +
          '<div class="skill-fill" style="--level:' + level + '%"></div>' +
        "</div>" +
      "</div>";
    }).join("");
    return '<section class="skill-group"><h3>' + esc(group) + "</h3>" + skills + "</section>";
  }).join("");
}

function renderProjects() {
  byId("projects-grid").innerHTML = portfolio.projects.map(function (project) {
    const tags = project.tech.map(function (technology) {
      return "<li>" + esc(technology) + "</li>";
    }).join("");
    const github = safeWebLink(project.github);
    const live = safeWebLink(project.live);
    const status = String(project.status || "").trim();
    const statusClass = status.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    let links = "";
    if (github) links += '<a href="' + esc(github) + '" target="_blank" rel="noopener noreferrer">Source code ↗</a>';
    if (live) links += '<a href="' + esc(live) + '" target="_blank" rel="noopener noreferrer">Live demo ↗</a>';
    if (!links) links = '<span class="link-placeholder">Links coming soon</span>';

    return '<article class="project-row">' +
      '<div class="project-heading"><h3>' + esc(project.title) + "</h3>" +
        (status ? '<span class="project-status status-' + esc(statusClass) + '">' + esc(status) + "</span>" : "") +
      "</div>" +
      '<p class="project-description">' + esc(project.description) + "</p>" +
      '<ul class="tech-list">' + tags + "</ul>" +
      '<div class="project-links">' + links + "</div>" +
    "</article>";
  }).join("");
}

function renderEducation() {
  renderTimeline("education-list", portfolio.education);
}

function renderTimeline(containerId, items, emptyMessage, options) {
  const container = byId(containerId);
  if (!items.length) {
    container.classList.add("is-empty");
    container.innerHTML = '<p class="empty-state">' + esc(emptyMessage || "Nothing has been added yet.") + "</p>";
    return;
  }

  container.classList.remove("is-empty");
  container.innerHTML = items.map(function (item) {
    const responsibilities = item.responsibilities && item.responsibilities.length
      ? '<ul class="responsibility-list">' + item.responsibilities.map(function (responsibility) {
          return "<li>" + esc(responsibility) + "</li>";
        }).join("") + "</ul>"
      : "";
    const actions = options && options.removeKind && item.id
      ? '<div class="record-actions"><button class="entry-remove" type="button" data-remove-kind="' +
        esc(options.removeKind) + '" data-entry-id="' + esc(item.id) + '" aria-label="Remove ' +
        esc(item.title) + '">Remove</button></div>'
      : "";
    return '<article class="timeline-item">' +
      (item.period ? '<p class="period">' + esc(item.period) + "</p>" : "") +
      "<h3>" + esc(item.title) + "</h3>" +
      (item.place ? '<p class="place">' + esc(item.place) + "</p>" : "") +
      (item.details ? "<p>" + esc(item.details) + "</p>" : "") +
      responsibilities +
      actions +
    "</article>";
  }).join("");
}

async function renderCertifications() {
  const container = byId("certifications-list");
  certificateObjectUrls.forEach(function (url) { URL.revokeObjectURL(url); });
  certificateObjectUrls = [];

  if (!portfolio.certifications.length) {
    container.classList.add("is-empty");
    container.innerHTML = '<p class="empty-state">No certifications have been added yet.</p>';
    return;
  }

  container.classList.remove("is-empty");
  let fileError = "";
  const entries = await Promise.all(portfolio.certifications.map(async function (certificate) {
    let downloadLink = '<span class="link-placeholder">No certificate file attached</span>';
    if (certificate.fileId) {
      try {
        const file = await getCertificateFile(certificate.fileId);
        if (file) {
          const url = URL.createObjectURL(file);
          certificateObjectUrls.push(url);
          downloadLink = '<a class="certificate-download" href="' + esc(url) + '" download="' +
            esc(certificate.fileName || certificate.title) + '">Download certificate ↓</a>';
        } else {
          downloadLink = '<span class="link-placeholder">Certificate file not found</span>';
        }
      } catch (error) {
        fileError = error.message;
        downloadLink = '<span class="link-placeholder">Certificate download is unavailable</span>';
      }
    }

    return '<article class="timeline-item">' +
      (certificate.period ? '<p class="period">' + esc(certificate.period) + "</p>" : "") +
      "<h3>" + esc(certificate.title) + "</h3>" +
      '<p class="place">' + esc(certificate.place) + "</p>" +
      (certificate.details ? "<p>" + esc(certificate.details) + "</p>" : "") +
      '<div class="record-actions">' + downloadLink +
        '<button class="entry-remove" type="button" data-remove-kind="certificate" data-entry-id="' +
        esc(certificate.id) + '" aria-label="Remove ' + esc(certificate.title) + '">Remove</button>' +
      "</div>" +
    "</article>";
  }));
  container.innerHTML = entries.join("");
  if (fileError) setEditorStatus("certificate-status", "Certificate details loaded, but a file could not be opened: " + fileError);
}

function renderHighlights() {
  byId("highlights-list").innerHTML = portfolio.highlights.map(function (item) {
    return '<article class="highlight-card"><h3>' + esc(item.title) + "</h3><p>" +
      esc(item.details) + "</p></article>";
  }).join("");
}

function renderLinks() {
  const links = [
    { label: "Email", url: portfolio.email ? "mailto:" + portfolio.email : "", text: portfolio.email, external: false },
    { label: "GitHub", url: safeWebLink(portfolio.github), text: "GitHub", external: true },
    { label: "LinkedIn", url: safeWebLink(portfolio.linkedin), text: "LinkedIn", external: true },
    { label: "Facebook", url: safeWebLink(portfolio.facebook), text: "Facebook", external: true }
  ];
  let contactHtml = "";
  let footerHtml = "";
  links.forEach(function (link) {
    if (!link.url) return;
    const externalAttributes = link.external ? ' target="_blank" rel="noopener noreferrer"' : "";
    contactHtml += "<li><strong>" + esc(link.label) + '</strong><a href="' + esc(link.url) + '"' +
      externalAttributes + ">" + esc(link.text) + "</a></li>";
    if (link.external) {
      footerHtml += '<li><a href="' + esc(link.url) + '"' + externalAttributes + ">" + esc(link.label) + "</a></li>";
    }
  });
  byId("contact-links").innerHTML = contactHtml;
  byId("footer-links").innerHTML = footerHtml;
}

function formValue(form, name) {
  const value = new FormData(form).get(name);
  return typeof value === "string" ? value.trim() : "";
}

function setupPortfolioEditor() {
  const experienceForm = byId("experience-form");
  experienceForm.addEventListener("submit", function (event) {
    event.preventDefault();
    setEditorStatus("experience-status", "");
    const item = {
      id: createEntryId(),
      title: formValue(experienceForm, "title"),
      place: formValue(experienceForm, "place"),
      period: formValue(experienceForm, "period"),
      details: formValue(experienceForm, "details")
    };
    if (!item.title || !item.place || !item.period) {
      setEditorStatus("experience-status", "Add a job title, organization, and time period.");
      return;
    }

    portfolio.workExperience.unshift(item);
    try {
      saveManagedEntries();
    } catch (error) {
      portfolio.workExperience.shift();
      setEditorStatus("experience-status", error.message);
      return;
    }
    experienceForm.reset();
    renderTimeline("work-experience-list", portfolio.workExperience, "No work experience has been added yet.", {
      removeKind: "experience"
    });
    setEditorStatus("experience-status", "Experience saved in this browser.");
  });

  const certificateForm = byId("certificate-form");
  certificateForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    setEditorStatus("certificate-status", "");
    const title = formValue(certificateForm, "title");
    const place = formValue(certificateForm, "place");
    const file = certificateForm.elements.certificateFile.files[0] || null;
    if (!title || !place) {
      setEditorStatus("certificate-status", "Add the certificate name and issuer.");
      return;
    }
    if (file && !/\.(pdf|jpe?g|png)$/i.test(file.name)) {
      setEditorStatus("certificate-status", "Choose a PDF, JPG, or PNG file.");
      return;
    }

    const item = {
      id: createEntryId(),
      title: title,
      place: place,
      period: formValue(certificateForm, "period"),
      details: formValue(certificateForm, "details"),
      fileId: file ? "" : null,
      fileName: file ? file.name : ""
    };
    let fileStored = false;
    let entriesSaved = false;
    try {
      if (file) {
        await storeCertificateFile(item.id, file);
        fileStored = true;
        item.fileId = item.id;
      }
      portfolio.certifications.unshift(item);
      try {
        saveManagedEntries();
        entriesSaved = true;
      } catch (error) {
        portfolio.certifications.shift();
        throw error;
      }
      certificateForm.reset();
      setEditorStatus("certificate-status", file
        ? "Certificate saved. Use Download certificate to check the file."
        : "Certificate saved. Attach a file if you want to enable downloading.");
      await renderCertifications();
    } catch (error) {
      if (fileStored && !entriesSaved) {
        try {
          await deleteCertificateFile(item.id);
        } catch (cleanupError) {
          setEditorStatus("certificate-status", error.message + " " + cleanupError.message);
          return;
        }
      }
      setEditorStatus("certificate-status", entriesSaved
        ? "Certificate was saved, but could not be displayed: " + error.message
        : error.message);
    }
  });

  const achievementForm = byId("achievement-form");
  achievementForm.addEventListener("submit", function (event) {
    event.preventDefault();
    setEditorStatus("achievement-status", "");
    const item = {
      id: createEntryId(),
      title: formValue(achievementForm, "title"),
      period: formValue(achievementForm, "period"),
      place: formValue(achievementForm, "place"),
      details: formValue(achievementForm, "details")
    };
    if (!item.title) {
      setEditorStatus("achievement-status", "Add an achievement before saving.");
      return;
    }

    portfolio.achievements.unshift(item);
    try {
      saveManagedEntries();
    } catch (error) {
      portfolio.achievements.shift();
      setEditorStatus("achievement-status", error.message);
      return;
    }
    achievementForm.reset();
    renderTimeline("achievements-list", portfolio.achievements, "No achievements have been added yet.", {
      removeKind: "achievement"
    });
    setEditorStatus("achievement-status", "Achievement saved in this browser.");
  });

  document.addEventListener("click", async function (event) {
    const button = event.target instanceof Element ? event.target.closest("[data-remove-kind]") : null;
    if (!button) return;

    const kind = button.getAttribute("data-remove-kind");
    const isCertificate = kind === "certificate";
    if (kind !== "certificate" && kind !== "experience" && kind !== "achievement") return;
    const entries = isCertificate
      ? portfolio.certifications
      : kind === "experience" ? portfolio.workExperience : portfolio.achievements;
    const statusId = isCertificate ? "certificate-status"
      : kind === "experience" ? "experience-status" : "achievement-status";
    const index = entries.findIndex(function (item) {
      return item.id === button.getAttribute("data-entry-id");
    });
    if (index < 0) return;

    const removed = entries[index];
    if (!window.confirm('Remove "' + removed.title + '"?')) return;
    setEditorStatus(statusId, "");
    entries.splice(index, 1);
    try {
      saveManagedEntries();
    } catch (error) {
      entries.splice(index, 0, removed);
      setEditorStatus(statusId, error.message);
      return;
    }

    if (isCertificate) {
      if (removed.fileId) {
        try {
          await deleteCertificateFile(removed.fileId);
        } catch (error) {
          setEditorStatus("certificate-status", "The certificate was removed, but its file could not be deleted: " + error.message);
        }
      }
      await renderCertifications();
      if (!byId("certificate-status").textContent) {
        setEditorStatus("certificate-status", "Certificate removed.");
      }
    } else if (kind === "experience") {
      renderTimeline("work-experience-list", portfolio.workExperience, "No work experience has been added yet.", {
        removeKind: "experience"
      });
      setEditorStatus("experience-status", "Experience removed.");
    } else {
      renderTimeline("achievements-list", portfolio.achievements, "No achievements have been added yet.", {
        removeKind: "achievement"
      });
      setEditorStatus("achievement-status", "Achievement removed.");
    }
  });
}

/* =========================================================
   4. THEME TOGGLE
   ========================================================= */
function setupTheme() {
  const button = byId("theme-toggle");
  const icon = button.querySelector(".theme-icon");
  const preference = window.matchMedia("(prefers-color-scheme: dark)");

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const dark = theme === "dark";
    icon.textContent = dark ? "☀" : "◐";
    button.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    document.querySelector('meta[name="theme-color"]').content = dark ? "#0c1018" : "#f5f6f8";
  }

  function hasSavedTheme() {
    try {
      return localStorage.getItem("portfolio-theme") === "light" ||
        localStorage.getItem("portfolio-theme") === "dark";
    } catch (error) {
      return false;
    }
  }

  applyTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  button.addEventListener("click", function () {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch (error) {
      // The selected theme remains active until this page is closed.
    }
  });

  const updateFromSystem = function (event) {
    if (!hasSavedTheme()) applyTheme(event.matches ? "dark" : "light");
  };
  if (preference.addEventListener) preference.addEventListener("change", updateFromSystem);
  else if (preference.addListener) preference.addListener(updateFromSystem);
}

/* =========================================================
   5. MOBILE MENU
   ========================================================= */
function setupMobileMenu() {
  const toggle = byId("nav-toggle");
  const menu = byId("nav-links");
  const scrim = byId("menu-scrim");

  function setMenuOpen(open) {
    menu.classList.toggle("open", open);
    toggle.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    scrim.tabIndex = open ? 0 : -1;
  }

  toggle.addEventListener("click", function () {
    const opening = toggle.getAttribute("aria-expanded") !== "true";
    setMenuOpen(opening);
    if (opening) menu.querySelector("a").focus();
  });
  scrim.addEventListener("click", function () { setMenuOpen(false); });
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { setMenuOpen(false); });
  });
  document.addEventListener("click", function (event) {
    if (toggle.getAttribute("aria-expanded") === "true" &&
        !menu.contains(event.target) && !toggle.contains(event.target)) setMenuOpen(false);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      toggle.focus();
    }
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 900) setMenuOpen(false);
  });
}

/* =========================================================
   6. SCROLL PROGRESS, NAV HIGHLIGHT, AND BACK TO TOP
   ========================================================= */
function setupScrollControls() {
  const progress = byId("scroll-progress");
  const topButton = byId("back-to-top");
  let scheduled = false;

  function updateScrollControls() {
    const maximum = document.documentElement.scrollHeight - window.innerHeight;
    const amount = maximum > 0 ? (window.scrollY / maximum) * 100 : 0;
    progress.style.width = amount + "%";
    topButton.classList.toggle("visible", window.scrollY > 600);
    scheduled = false;
  }

  window.addEventListener("scroll", function () {
    if (!scheduled) {
      window.requestAnimationFrame(updateScrollControls);
      scheduled = true;
    }
  }, { passive: true });
  window.addEventListener("resize", updateScrollControls);
  topButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  updateScrollControls();
}

/* =========================================================
   7. INTERSECTION OBSERVERS
   ========================================================= */
function setupSectionNavigation() {
  const links = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("main section[id]");
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (link) {
        const active = link.getAttribute("href") === "#" + entry.target.id ||
          (entry.target.dataset.navGroup && link.dataset.navGroup === entry.target.dataset.navGroup);
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-25% 0px -65% 0px", threshold: 0 });
  sections.forEach(function (section) { observer.observe(section); });
}

function setupSkillBars() {
  const items = document.querySelectorAll(".skill-item");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)) {
    items.forEach(function (item) { item.classList.add("in-view"); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  items.forEach(function (item) { observer.observe(item); });
}

/* =========================================================
   8. CONTACT FORM VALIDATION
   This validates in the browser; it does not send an email.
   ========================================================= */
function setupContactForm() {
  const form = byId("contact-form");
  const status = byId("form-status");

  function setError(fieldId, message) {
    byId(fieldId + "-error").textContent = message;
    byId(fieldId).classList.toggle("invalid", Boolean(message));
    byId(fieldId).setAttribute("aria-invalid", String(Boolean(message)));
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = byId("name").value.trim();
    const email = byId("email").value.trim();
    const message = byId("message").value.trim();
    let valid = true;

    if (name.length < 2) { setError("name", "Please enter your name (at least 2 characters)."); valid = false; }
    else setError("name", "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("email", "Please enter a valid email address."); valid = false; }
    else setError("email", "");

    if (message.length < 10) { setError("message", "Your message should be at least 10 characters."); valid = false; }
    else setError("message", "");

    if (valid) {
      status.textContent = "Thanks, " + name + "! (Demo: connect a form service to receive real messages.)";
      form.reset();
    } else {
      status.textContent = "Please correct the highlighted fields.";
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
    }
  });
}

/* =========================================================
   9. INITIALIZE AFTER THE PAGE MARKUP IS READY
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
  loadManagedEntries();
  fillBasicInfo();
  renderCodePreview();
  renderAbout();
  renderSkills();
  renderProjects();
  renderTimeline("roles-list", portfolio.roles);
  renderTimeline("work-experience-list", portfolio.workExperience, "No work experience has been added yet.", {
    removeKind: "experience"
  });
  renderEducation();
  renderCertifications().catch(function (error) {
    setEditorStatus("certificate-status", "Could not load certificates: " + error.message);
  });
  renderTimeline("achievements-list", portfolio.achievements, "No achievements have been added yet.", {
    removeKind: "achievement"
  });
  renderHighlights();
  renderLinks();
  setupPortfolioEditor();
  setupTheme();
  setupMobileMenu();
  setupScrollControls();
  setupSectionNavigation();
  setupSkillBars();
  setupContactForm();
});
