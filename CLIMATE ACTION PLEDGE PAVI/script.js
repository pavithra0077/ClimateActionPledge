// Smooth scroll to the form
function scrollToForm() {
  document.getElementById("pledgeForm").scrollIntoView({ behavior: "smooth" });
}

// Load pledges from localStorage or initialize
let pledges = JSON.parse(localStorage.getItem("pledges") || "[]");

// Update KPIs and Pledge Wall on load
updateKPI();
renderWall();

// Form submission
document.getElementById("pledgeForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const state = document.getElementById("state").value.trim();
  const profile = document.getElementById("profile").value;
  const commitments = Array.from(document.querySelectorAll(".commit:checked")).map(c => c.value);

  if (!name || !email || !mobile) {
    alert("Please fill in all required fields.");
    return;
  }

  const pledge = {
    id: "P" + (pledges.length + 1).toString().padStart(3, "0"),
    name, email, mobile, state, profile,
    commitments,
    date: new Date().toLocaleDateString(),
    stars: "⭐".repeat(Math.min(5, commitments.length))
  };

  pledges.push(pledge);
  localStorage.setItem("pledges", JSON.stringify(pledges));

  updateKPI();
  renderWall();
  showCertificate(pledge);
  document.getElementById("pledgeForm").reset();
});

// Show Certificate
function showCertificate(p) {
  document.getElementById("certificateSection").classList.remove("hidden");
  document.getElementById("certName").innerText = p.name;
  document.getElementById("certStars").innerText = p.stars;
  document.getElementById("certDate").innerText = p.date;
  document.querySelector(".sign-name").innerText = "Pavithra";
  window.scrollTo({
    top: document.getElementById("certificateSection").offsetTop,
    behavior: "smooth",
  });
}

// Certificate Download Function
function downloadCert() {
  const cert = document.getElementById("certCard");
  html2canvas(cert, { scale: 2 }).then(canvas => {
    const link = document.createElement("a");
    link.download = "ClimateActionPledge_Certificate.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

// Render Wall
function renderWall() {
  const tbody = document.querySelector("#wallTable tbody");
  tbody.innerHTML = "";
  pledges.slice().reverse().forEach(p => {
    const row = `<tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.date}</td>
      <td>${p.state || "-"}</td>
      <td>${p.profile}</td>
      <td>${p.stars}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

// Update KPIs
function updateKPI() {
  document.getElementById("achievedPledges").innerText = pledges.length;
  document.getElementById("studentCount").innerText = pledges.filter(p => p.profile === "Student").length;
  document.getElementById("proCount").innerText = pledges.filter(p => p.profile === "Working Professional").length;
}


