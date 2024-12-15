class EventManager {
    constructor() {
        this.myEvents = JSON.parse(localStorage.getItem('myEvents')) || [];
    }

    addEvent(event) {
        if (!this.myEvents.some(e => e.id === event.id)) {
            this.myEvents.push(event);
            localStorage.setItem('myEvents', JSON.stringify(this.myEvents));
            console.log('Event added to storage:', this.myEvents);
            return true;
        }
        return false;
    }

    getMyEvents() {
        const events = JSON.parse(localStorage.getItem('myEvents')) || [];
        console.log('Retrieved events:', events);
        return events;
    }

    removeEvent(eventId) {
        this.myEvents = this.myEvents.filter(event => event.id !== eventId);
        localStorage.setItem('myEvents', JSON.stringify(this.myEvents));
    }
}

// Handle RSVP button clicks
document.addEventListener('DOMContentLoaded', function() {
    const eventManager = new EventManager();

    // If we're on the profile page, update the events list
    if (window.location.pathname.includes('user.html')) {
        updateProfileEvents();
    }

    // Add click handlers to all RSVP buttons
    document.querySelectorAll('.register-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const clickedButton = e.currentTarget;
            const eventCard = e.target.closest('.event-card');
            
            const eventData = {
                id: eventCard.dataset.eventId,
                title: eventCard.querySelector('h3').textContent,
                date: eventCard.querySelector('.event-info p:nth-child(1)').textContent.replace(/.*calendar.*?(\d.*)/i, '$1').trim(),
                time: eventCard.querySelector('.event-info p:nth-child(2)').textContent.replace(/.*clock.*?(\d.*)/i, '$1').trim(),
                location: eventCard.querySelector('.event-info p:nth-child(3)').textContent.replace(/.*location-dot.*?([^]*)/i, '$1').trim(),
                image: eventCard.querySelector('img').src,
                category: eventCard.dataset.category,
                status: 'upcoming'
            };
            
            console.log('Attempting to add event:', eventData);
            
            if (eventData.id && eventManager.addEvent(eventData)) {
                // Update button state
                clickedButton.innerHTML = '<i class="fas fa-check"></i> Registered';
                clickedButton.disabled = true;
                clickedButton.classList.add('registered');
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    Successfully registered for the event!
                `;
                document.body.appendChild(successMessage);
                setTimeout(() => successMessage.remove(), 3000);
                
                // Update profile page if we're on it
                updateProfileEvents();
                
                // Redirect to profile page after a short delay
                setTimeout(() => {
                    window.location.href = 'user.html';
                }, 2000);
            } else {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    You are already registered for this event
                `;
                document.body.appendChild(errorMessage);
                setTimeout(() => errorMessage.remove(), 3000);
            }
        });
    });
});

// Function to update My Events section in profile
function updateProfileEvents() {
    const myEventsList = document.querySelector('.my-events-list');
    console.log('Found events list element:', myEventsList);

    if (myEventsList) {
        const eventManager = new EventManager();
        const events = eventManager.getMyEvents();
        console.log('Events to display:', events);
        
        myEventsList.innerHTML = events.map(event => `
            <div class="event-item" data-event-id="${event.id}">
                <div class="event-image">
                    <img src="${event.image}" alt="${event.title}">
                    <span class="event-status ${event.status}">${event.status}</span>
                    <button class="cancel-btn" title="Cancel Registration">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="event-details">
                    <h3>${event.title}</h3>
                    <div class="event-meta">
                        <span><i class="fas fa-calendar"></i> ${event.date}</span>
                        <span><i class="fas fa-clock"></i> ${event.time}</span>
                    </div>
                    <div class="event-location">
                        <i class="fas fa-location-dot"></i> ${event.location}
                    </div>
                    <button class="view-details-btn">View Details</button>
                </div>
            </div>
        `).join('');

        // Add event listeners for cancel buttons
        document.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const eventId = this.closest('.event-item').dataset.eventId;
                eventManager.removeEvent(eventId);
                updateProfileEvents();
            });
        });
    }
}