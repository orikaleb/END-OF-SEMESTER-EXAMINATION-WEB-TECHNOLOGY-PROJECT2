// Event management functionality
class EventManager {
    constructor() {
        this.baseUrl = '@https://end-of-semester-examination-web.onrender.com//api';
        this.token = localStorage.getItem('token');
    }

    // Fetch all upcoming events
    async getUpcomingEvents() {
        try {
            const response = await fetch(`${this.baseUrl}/events/upcoming`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch upcoming events');
            }

            const events = await response.json();
            return events;
        } catch (error) {
            console.error('Error fetching upcoming events:', error);
            throw error;
        }
    }

    // Register for an event
    async registerForEvent(eventId) {
        try {
            const response = await fetch(`${this.baseUrl}/events/${eventId}/register`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to register for event');
            }

            return await response.json();
        } catch (error) {
            console.error('Error registering for event:', error);
            throw error;
        }
    }

    // Cancel event registration
    async cancelRegistration(eventId) {
        try {
            const response = await fetch(`${this.baseUrl}/events/${eventId}/register`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to cancel registration');
            }

            return await response.json();
        } catch (error) {
            console.error('Error canceling registration:', error);
            throw error;
        }
    }

    // Get event details
    async getEventDetails(eventId) {
        try {
            const response = await fetch(`${this.baseUrl}/events/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch event details');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching event details:', error);
            throw error;
        }
    }

    // Get user's registered events
    async getMyEvents() {
        try {
            const response = await fetch(`${this.baseUrl}/events/my-events`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch registered events');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching registered events:', error);
            throw error;
        }
    }
}

// Event UI Handler
class EventUI {
    constructor(eventManager) {
        this.eventManager = eventManager;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Event registration buttons
        document.addEventListener('click', async (e) => {
            if (e.target.matches('.register-btn')) {
                const eventId = e.target.dataset.eventId;
                try {
                    await this.eventManager.registerForEvent(eventId);
                    this.showNotification('Successfully registered for event!', 'success');
                    this.updateEventUI(eventId, true);
                } catch (error) {
                    this.showNotification(error.message, 'error');
                }
            }

            if (e.target.matches('.cancel-btn')) {
                const eventId = e.target.closest('.event-item').dataset.eventId;
                try {
                    await this.eventManager.cancelRegistration(eventId);
                    this.showNotification('Registration cancelled successfully', 'success');
                    this.updateEventUI(eventId, false);
                } catch (error) {
                    this.showNotification(error.message, 'error');
                }
            }

            if (e.target.matches('.view-details-btn')) {
                const eventId = e.target.closest('.event-item').dataset.eventId;
                this.showEventDetails(eventId);
            }
        });
    }

    // Update UI after registration/cancellation
    updateEventUI(eventId, isRegistered) {
        const eventElement = document.querySelector(`[data-event-id="${eventId}"]`);
        if (eventElement) {
            const registerBtn = eventElement.querySelector('.register-btn');
            const cancelBtn = eventElement.querySelector('.cancel-btn');

            if (isRegistered) {
                registerBtn?.classList.add('hidden');
                cancelBtn?.classList.remove('hidden');
            } else {
                registerBtn?.classList.remove('hidden');
                cancelBtn?.classList.add('hidden');
            }
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Show event details modal
    async showEventDetails(eventId) {
        try {
            const event = await this.eventManager.getEventDetails(eventId);
            
            const modal = document.createElement('div');
            modal.className = 'event-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h2>${event.title}</h2>
                    <div class="event-info">
                        <p><i class="fas fa-calendar"></i> ${new Date(event.date).toLocaleDateString()}</p>
                        <p><i class="fas fa-clock"></i> ${event.startTime} - ${event.endTime}</p>
                        <p><i class="fas fa-location-dot"></i> ${event.location}</p>
                        <p><i class="fas fa-users"></i> ${event.participants}/${event.maxParticipants} Registered</p>
                    </div>
                    <div class="event-description">
                        <h3>Description</h3>
                        <p>${event.description}</p>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            modal.querySelector('.close-modal').onclick = () => {
                modal.remove();
            };

            window.onclick = (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            };
        } catch (error) {
            this.showNotification('Failed to load event details', 'error');
        }
    }

    // Load and display upcoming events
    async loadUpcomingEvents(containerId) {
        try {
            const events = await this.eventManager.getUpcomingEvents();
            const container = document.getElementById(containerId);
            
            if (!container) return;

            if (events.length === 0) {
                container.innerHTML = '<p class="no-events">No upcoming events found</p>';
                return;
            }

            container.innerHTML = events.map(event => this.createEventCard(event)).join('');
        } catch (error) {
            console.error('Error loading upcoming events:', error);
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '<p class="error-message">Failed to load upcoming events</p>';
            }
        }
    }

    // Create event card HTML
    createEventCard(event) {
        return `
            <div class="event-item" data-event-id="${event._id}">
                <div class="event-image">
                    <img src="images/tech-conference.jpg" alt="${event.title}">
                    <span class="event-status upcoming">Upcoming</span>
                    <button class="cancel-btn hidden" title="Cancel Registration">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="event-details">
                    <h3>${event.title}</h3>
                    <div class="event-meta">
                        <span><i class="fas fa-calendar"></i> ${new Date(event.date).toLocaleDateString()}</span>
                        <span><i class="fas fa-clock"></i> ${event.startTime}</span>
                    </div>
                    <div class="event-location">
                        <i class="fas fa-location-dot"></i> ${event.location}
                    </div>
                    <button class="view-details-btn">View Details</button>
                    <button class="register-btn" data-event-id="${event._id}">Register Now</button>
                </div>
            </div>
        `;
    }
}

// Initialize event management
document.addEventListener('DOMContentLoaded', () => {
    const eventManager = new EventManager();
    const eventUI = new EventUI(eventManager);

    // Load upcoming events if on the upcoming events page
    if (document.getElementById('upcomingEvents')) {
        eventUI.loadUpcomingEvents('upcomingEvents');
    }

    // Load user's registered events if on the profile page
    if (document.querySelector('.my-events-list')) {
        eventUI.loadMyEvents();
    }
});
