document.addEventListener('DOMContentLoaded', function() {
    const addEventBtn = document.getElementById('addEventBtn');
    const addEventModal = document.getElementById('addEventModal');
    const addEventForm = document.getElementById('addEventForm');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.querySelector('.cancel-btn');

    // Show modal
    addEventBtn.addEventListener('click', () => {
        addEventModal.style.display = 'block';
    });

    // Hide modal
    function hideModal() {
        addEventModal.style.display = 'none';
    }

    closeBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addEventModal) {
            hideModal();
        }
    });

    // Handle form submission
    addEventForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const newEvent = {
            id: Date.now().toString(),
            title: document.getElementById('eventTitle').value,
            category: document.getElementById('eventCategory').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            location: document.getElementById('eventLocation').value,
            image: document.getElementById('eventImage').value,
            description: document.getElementById('eventDescription').value
        };

        // Get existing events or initialize empty array
        const events = JSON.parse(localStorage.getItem('events')) || [];
        events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(events));

        // Reset form and hide modal
        addEventForm.reset();
        hideModal();

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Event created successfully!
        `;
        document.body.appendChild(successMessage);
        setTimeout(() => successMessage.remove(), 3000);

        // Refresh events list
        loadEvents();
    });

    // Load existing events
    function loadEvents() {
        const eventsList = document.getElementById('adminEventsList');
        const events = JSON.parse(localStorage.getItem('events')) || [];

        eventsList.innerHTML = events.map(event => `
            <div class="event-card" data-event-id="${event.id}">
                <img src="${event.image}" alt="${event.title}">
                <div class="event-info">
                    <h3>${event.title}</h3>
                    <p><i class="fas fa-calendar"></i> ${event.date}</p>
                    <p><i class="fas fa-clock"></i> ${event.time}</p>
                    <p><i class="fas fa-location-dot"></i> ${event.location}</p>
                    <span class="event-category ${event.category}">${event.category}</span>
                </div>
                <div class="event-actions">
                    <button class="edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    // Load events when page loads
    loadEvents();
}); 