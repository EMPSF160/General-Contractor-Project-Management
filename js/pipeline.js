/* ==========================================================================
   PROJECT PIPELINE & INTERACTIVE DATA SYSTEM
   Structured project objects, dynamic percentage bindings & matrix control
   ========================================================================== */

const PROJECTS_DATA = [
  {
    id: "PROJECT 04",
    title: "North Avenue Office",
    type: "Commercial Office",
    location: "Chennai / India",
    year: "2026",
    progress: 92,
    status: "FINAL FINISHING",
    statusType: "on-track",
    area: "340,000 SQ FT",
    image: "image/chuttersnap-NMrUtSA7094-unsplash.jpg",
    description: "High-density corporate commercial tower featuring advanced LEED Gold MEP systems, intelligent curtain walling, and automated building management systems.",
    stages: {
      foundation: 100,
      structure: 100,
      mep: 98,
      finishing: 85,
      handover: 20
    }
  },
  {
    id: "PROJECT 05",
    title: "Riverfront Retail Complex",
    type: "Retail & Leisure",
    location: "Bengaluru / India",
    year: "2026",
    progress: 81,
    status: "MEP / FITOUT",
    statusType: "on-track",
    area: "480,000 SQ FT",
    image: "image/glenov-brankovic-DWp5nUqTn6E-unsplash.jpg",
    description: "Multi-tier retail destination with expansive structural steel atriums, seismic-isolated foundations, and bespoke facade glazing.",
    stages: {
      foundation: 100,
      structure: 100,
      mep: 88,
      finishing: 50,
      handover: 0
    }
  },
  {
    id: "PROJECT 06",
    title: "Industrial Core Facility",
    type: "Advanced Logistics",
    location: "Hyderabad / India",
    year: "2027",
    progress: 74,
    status: "SUPERSTRUCTURE",
    statusType: "on-track",
    area: "620,000 SQ FT",
    image: "image/josh-olalde-X1P1_EDNnok-unsplash.jpg",
    description: "Automated logistics and cold-chain manufacturing plant with post-tensioned heavy floor slabs and high-clearance steel framing.",
    stages: {
      foundation: 100,
      structure: 95,
      mep: 65,
      finishing: 20,
      handover: 0
    }
  },
  {
    id: "PROJECT 07",
    title: "Commercial Headquarters 07",
    type: "Corporate HQ",
    location: "Chennai / India",
    year: "2027",
    progress: 68,
    status: "ON SCHEDULE",
    statusType: "on-track",
    area: "520,000 SQ FT",
    image: "image/jeriden-villegas-VLPUm5wP5Z0-unsplash.jpg",
    description: "Signature corporate headquarters with hybrid structural steel-concrete core, parametric louvers, and mission-critical data center infrastructure.",
    stages: {
      foundation: 100,
      structure: 100,
      mep: 72,
      finishing: 35,
      handover: 0
    }
  },
  {
    id: "PROJECT 08",
    title: "Urban Courtyard Mixed-Use",
    type: "Mixed-Use",
    location: "Mumbai / India",
    year: "2027",
    progress: 43,
    status: "SUBSTRUCTURE / PODIUM",
    statusType: "controlled",
    area: "750,000 SQ FT",
    image: "image/eden-constantino-OXmym9cuaEY-unsplash.jpg",
    description: "Dense urban transit-oriented development integrating grade-A offices, curated retail galleries, and subterranean multi-level parking.",
    stages: {
      foundation: 100,
      structure: 52,
      mep: 25,
      finishing: 0,
      handover: 0
    }
  },
  {
    id: "PROJECT 09",
    title: "Residence 09 Tower",
    type: "Luxury Residential",
    location: "Pune / India",
    year: "2027",
    progress: 21,
    status: "FOUNDATION / EXCAVATION",
    statusType: "active",
    area: "290,000 SQ FT",
    image: "image/sean-pollock-PhYq704ffdA-unsplash.jpg",
    description: "Ultra-luxury residential tower featuring deep pile foundation engineering, acoustic structural dampening, and custom bronze facade systems.",
    stages: {
      foundation: 84,
      structure: 10,
      mep: 0,
      finishing: 0,
      handover: 0
    }
  }
];

// Initialize Project 07 and Pipeline Interactive Handlers
document.addEventListener('DOMContentLoaded', () => {
  // Modal Viewer
  const modalOverlay = document.getElementById('project-detail-modal');
  const modalBody = document.getElementById('modal-card-content');
  const modalClose = document.getElementById('modal-close-btn');

  function openProjectModal(projId) {
    const project = PROJECTS_DATA.find(p => p.id === projId) || PROJECTS_DATA[3]; // Default Project 07
    if (!modalBody || !modalOverlay) return;

    modalBody.innerHTML = `
      <div class="hud-top-bar" style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem; border-bottom: 1px solid var(--c-blueprint-border); padding-bottom: 0.75rem;">
        <div>
          <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--c-orange); font-weight: 700;">${project.id} // COMMAND DOSSIER</span>
          <h2 style="font-family: var(--font-display); font-size: 2.2rem; text-transform: uppercase; color: var(--c-white); margin-top: 0.2rem;">${project.title}</h2>
        </div>
        <span class="tech-tag tech-tag-orange">${project.status}</span>
      </div>

      <div class="modal-body-grid">
        <div style="position: relative; aspect-ratio: 16/10; overflow: hidden; border: 1px solid var(--c-blueprint-border); background: #151515;">
          <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;">
        </div>
        <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 1rem;">
          <p style="font-size: 0.9rem; color: var(--c-white-muted); line-height: 1.6;">${project.description}</p>
          <div class="modal-telemetry-grid">
            <div><span style="color: var(--c-white-dim);">LOCATION:</span><br><strong style="color: var(--c-white);">${project.location}</strong></div>
            <div><span style="color: var(--c-white-dim);">TOTAL AREA:</span><br><strong style="color: var(--c-white);">${project.area}</strong></div>
            <div><span style="color: var(--c-white-dim);">COMPLETION:</span><br><strong style="color: var(--c-orange);">${project.progress}% COMPLETE</strong></div>
            <div><span style="color: var(--c-white-dim);">TARGET YEAR:</span><br><strong style="color: var(--c-white);">${project.year}</strong></div>
          </div>
        </div>
      </div>

      <div style="border-top: 1px solid var(--c-blueprint-border); padding-top: 1.25rem;">
        <h4 style="font-family: var(--font-mono); font-size: 0.8rem; text-transform: uppercase; color: var(--c-blueprint-light); margin-bottom: 0.75rem;">CONSTRUCTION MILESTONES</h4>
        <div style="display: flex; flex-direction: column; gap: 0.6rem; font-family: var(--font-mono); font-size: 0.75rem;">
          <div style="display: flex; justify-content: space-between;"><span>FOUNDATION & SUBSTRUCTURE</span><span style="color: #2ECC71;">${project.stages.foundation}% ✓</span></div>
          <div class="progress-track"><div class="progress-fill" style="width: ${project.stages.foundation}%; background: #2ECC71;"></div></div>

          <div style="display: flex; justify-content: space-between;"><span>PRIMARY SUPERSTRUCTURE</span><span>${project.stages.structure}%</span></div>
          <div class="progress-track"><div class="progress-fill" style="width: ${project.stages.structure}%;"></div></div>

          <div style="display: flex; justify-content: space-between;"><span>MEP & HVAC INTEGRATION</span><span>${project.stages.mep}%</span></div>
          <div class="progress-track"><div class="progress-fill" style="width: ${project.stages.mep}%;"></div></div>

          <div style="display: flex; justify-content: space-between;"><span>ARCHITECTURAL FINISHING</span><span>${project.stages.finishing}%</span></div>
          <div class="progress-track"><div class="progress-fill" style="width: ${project.stages.finishing}%;"></div></div>
        </div>
      </div>
    `;

    modalOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  // Bind all project card clicks
  document.querySelectorAll('[data-open-project]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-open-project');
      openProjectModal(projId);
    });
  });

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });
  }

  // Interactive Services Accordion
  const serviceRows = document.querySelectorAll('.service-row');
  serviceRows.forEach(row => {
    const header = row.querySelector('.service-row-header');
    const drawer = row.querySelector('.service-drawer');
    if (!header || !drawer) return;

    header.addEventListener('click', () => {
      const isOpen = row.classList.contains('is-open');
      
      // Close others
      serviceRows.forEach(other => {
        if (other !== row) {
          other.classList.remove('is-open');
          const d = other.querySelector('.service-drawer');
          if (d) d.style.maxHeight = null;
        }
      });

      if (!isOpen) {
        row.classList.add('is-open');
        drawer.style.maxHeight = drawer.scrollHeight + "px";
      } else {
        row.classList.remove('is-open');
        drawer.style.maxHeight = null;
      }
    });
  });

  // Open first service by default
  if (serviceRows.length > 0) {
    const firstRow = serviceRows[0];
    const firstDrawer = firstRow.querySelector('.service-drawer');
    firstRow.classList.add('is-open');
    if (firstDrawer) firstDrawer.style.maxHeight = firstDrawer.scrollHeight + "px";
  }

  // Matrix Table Row Hover/Click Telemetry
  const matrixRows = document.querySelectorAll('.matrix-row');
  matrixRows.forEach(mRow => {
    mRow.addEventListener('mouseenter', () => {
      mRow.style.borderColor = 'var(--c-orange)';
    });
    mRow.addEventListener('mouseleave', () => {
      mRow.style.borderColor = '';
    });
  });
});
