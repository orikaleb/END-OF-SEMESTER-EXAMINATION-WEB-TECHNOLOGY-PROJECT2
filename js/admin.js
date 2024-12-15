// Function to check if user is logged in
function checkAdminAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'admin-login.html';
        return false;
    }
    return true;
}

// Load dashboard statistics
function loadDashboardStats() {
    fetch('http://localhost:3000/api/admin/stats', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('totalUsers').textContent = data.totalUsers || 0;
        document.getElementById('activeEvents').textContent = data.activeEvents || 0;
        document.getElementById('totalRegistrations').textContent = data.totalRegistrations || 0;
    })
    .catch(error => {
        console.error('Error loading stats:', error);
        // Set default values if there's an error
        document.getElementById('totalUsers').textContent = '0';
        document.getElementById('activeEvents').textContent = '0';
        document.getElementById('totalRegistrations').textContent = '0';
    });
}

// Load events table
function loadEvents() {
    fetch('http://localhost:3000/api/admin/events', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
    })
    .then(response => response.json())
    .then(events => {
        const tableBody = document.getElementById('eventsTableBody');
        tableBody.innerHTML = '';
        
        events.forEach(event => {
            const row = `
                <tr>
                    <td>${event.title}</td>
                    <td>${new Date(event.date).toLocaleDateString()}</td>
                    <td>${event.type}</td>
                    <td>${event.participants}/${event.maxParticipants}</td>
                    <td>
                        <span class="status-badge ${event.status === 'active' ? 'status-active' : 'status-inactive'}">
                            ${event.status}
                        </span>
                    </td>
                    <td>
                        <button class="action-btn edit-btn" onclick="editEvent('${event._id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteEvent('${event._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => console.error('Error loading events:', error));
}

// Load users table
function loadUsers() {
    fetch('http://localhost:3000/api/admin/users', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
    })
    .then(response => response.json())
    .then(users => {
        const tableBody = document.getElementById('usersTableBody');
        tableBody.innerHTML = '';
        
        users.forEach(user => {
            const row = `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <span class="status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}">
                            ${user.status}
                        </span>
                    </td>
                    <td>
                        <button class="action-btn edit-btn" onclick="editUser('${user._id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteUser('${user._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => console.error('Error loading users:', error));
}

// Event management functions
function editEvent(eventId) {
    window.location.href = `edit-event.html?id=${eventId}`;
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        fetch(`http://localhost:3000/api/admin/events/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        })
        .then(response => response.json())
        .then(() => {
            loadEvents();
        })
        .catch(error => console.error('Error deleting event:', error));
    }
}

// User management functions
function editUser(userId) {
    window.location.href = `edit-user.html?id=${userId}`;
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`http://localhost:3000/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        })
        .then(response => response.json())
        .then(() => {
            loadUsers();
        })
        .catch(error => console.error('Error deleting user:', error));
    }
}

// Function to remove an event
async function removeEvent(eventId) {
    if (confirm('Are you sure you want to remove this event?')) {
        try {
            const response = await fetch(`http://localhost:3000/api/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove event');
            }

            // Remove the event card from the UI
            const eventCard = document.querySelector(`[data-event-id="${eventId}"]`);
            if (eventCard) {
                eventCard.remove();
            }

            // Show success message
            alert('Event removed successfully');
            
        } catch (error) {
            console.error('Error removing event:', error);
            alert('Failed to remove event. Please try again.');
        }
    }
}

// Function to load upcoming events
async function loadUpcomingEvents() {
    try {
        if (!checkAdminAuth()) return;

        const response = await fetch('http://localhost:3000/api/events/upcoming', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch upcoming events');
        }

        const events = await response.json();
        const eventsGrid = document.getElementById('upcomingEventsGrid');
        
        if (events.length === 0) {
            eventsGrid.innerHTML = '<p class="no-events">No upcoming events found</p>';
            return;
        }

        eventsGrid.innerHTML = ''; // Clear existing events

        events.forEach(event => {
            const date = new Date(event.date);
            const eventCard = `
                <div class="event-card" data-event-id="${event._id}">
                    <div class="event-date">
                        <span class="day">${date.getDate()}</span>
                        <span class="month">${date.toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                    </div>
                    <div class="event-details">
                        <h3>${event.title}</h3>
                        <p class="event-time">
                            <i class="fas fa-clock"></i>
                            ${event.startTime} - ${event.endTime}
                        </p>
                        <p class="event-location">
                            <i class="fas fa-location-dot"></i>
                            ${event.location}
                        </p>
                        <p class="event-participants">
                            <i class="fas fa-users"></i>
                            ${event.participants} / ${event.maxParticipants} Registered
                        </p>
                    </div>
                    <div class="event-actions">
                        <button class="action-btn" title="Edit Event" onclick="editEvent('${event._id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn" title="Remove Event" onclick="removeEvent('${event._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            eventsGrid.insertAdjacentHTML('beforeend', eventCard);
        });

    } catch (error) {
        console.error('Error loading upcoming events:', error);
        document.getElementById('upcomingEventsGrid').innerHTML = 
            '<p class="error-message">Failed to load upcoming events. Please try again later.</p>';
    }
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (checkAdminAuth()) {
        loadUpcomingEvents();
        loadDashboardStats();
    }
}); 