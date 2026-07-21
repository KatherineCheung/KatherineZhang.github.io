// Loads Professional Experience content from data/experience.json and
// renders it into the #timelineContainer element. Keeping this data
// separate from index.html means new entries can be added by editing
// one JSON file instead of hand-writing HTML.

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
}

function renderTimelineItem(item) {
    const bullets = (item.bullets || [])
        .map(b => `<li>${escapeHtml(b)}</li>`)
        .join('');

    return `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h3>${escapeHtml(item.title)}</h3>
                <h4>${escapeHtml(item.company)}</h4>
                <span class="timeline-date">${escapeHtml(item.dateRange)}</span>
                <p>${escapeHtml(item.summary)}</p>
                <ul>${bullets}</ul>
            </div>
        </div>
    `;
}

async function loadExperience() {
    const container = document.getElementById('timelineContainer');
    if (!container) return;

    try {
        const response = await fetch('data/experience.json', { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const items = await response.json();

        container.innerHTML = items.map(renderTimelineItem).join('');
    } catch (err) {
        console.error('Failed to load experience data:', err);
        // Leave a visible fallback rather than an empty section
        container.innerHTML = '<p style="color:#64748b;">Experience data could not be loaded.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadExperience);
