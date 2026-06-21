
// ==================== UTILITY FUNCTIONS ====================

async function copyLink(code) {
    const url = window.location.origin + '/' + code;
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
}

async function deleteLink(urlId) {
    if (confirm('Are you sure you want to delete this link?')) {
        try {
            const response = await fetch(`/api/url/${urlId}/delete`, {
                method: 'DELETE'
            });
            if (response.ok) {
                location.reload();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

// ==================== AUTH FORMS ====================

document.addEventListener('DOMContentLoaded', () => {
    // Modal close
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
});

// ==================== RESPONSIVE MENU ====================

function toggleMenu() {
    const menu = document.querySelector('.nav-links');
    if (menu) {
        menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
    }
}