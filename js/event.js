// Event management functionality
class EventManager {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api';
        this.token = localStorage.getItem('adminToken') || localStorage.getItem('token');
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
}

// Event UI Handler
class EventUI {
    constructor(eventManager) {
        this.eventManager = eventManager;
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
                container.innerHTML = '<p class="error-message">Failed to load upcoming events. Please try again later.</p>';
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