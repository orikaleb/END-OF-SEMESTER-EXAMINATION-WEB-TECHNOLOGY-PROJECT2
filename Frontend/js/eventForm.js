document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.querySelector('.add-event-form');
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    if (eventForm) {
        eventForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = {
                    title: document.getElementById('eventTitle').value,
                    type: document.getElementById('eventType').value,
                    date: document.getElementById('eventDate').value,
                    startTime: document.getElementById('eventTime').value,
                    endTime: calculateEndTime(document.getElementById('eventTime').value),
                    location: document.getElementById('eventLocation').value,
                    maxParticipants: parseInt(document.getElementById('maxParticipants').value) || 100,
                    description: document.getElementById('eventDescription').value
                };

                const response = await fetch('http://localhost:3000/api/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to create event');
                }

                const result = await response.json();
                showNotification('Event created successfully!', 'success');
                
                // Reset form
                eventForm.reset();
                
                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 2000);

            } catch (error) {
                console.error('Error creating event:', error);
                showNotification(error.message || 'Failed to create event', 'error');
            }
        });
    }
});

// Helper function to calculate end time (2 hours after start time by default)
function calculateEndTime(startTime) {
    const [hours, minutes] = startTime.split(':');
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    date.setHours(date.getHours() + 2);
    
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// File preview functionality
const eventImage = document.getElementById('eventImage');
if (eventImage) {
    eventImage.addEventListener('change', function(e) {
        const fileName = e.target.files[0]?.name || 'Choose an image';
        const fileLabel = e.target.nextElementSibling.querySelector('span');
        if (fileLabel) {
            fileLabel.textContent = fileName;
        }
    });
} 