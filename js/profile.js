document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch user data from the backend
        const response = await fetch('/api/auth/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile data');
        }

        const userData = await response.json();

        // Update only the username in the profile information
        document.querySelector('.user-info span').textContent = userData.username;
        document.querySelector('.user-info img').src = 'images/avatar-placeholder.jpg';

        // Update personal information card with only username
        document.querySelector('[data-field="fullName"]').textContent = userData.username;
        document.querySelector('[data-field="email"]').textContent = userData.email;
        document.querySelector('[data-field="phone"]').textContent = 'Not available';
        document.querySelector('[data-field="location"]').textContent = 'Not available';

    } catch (error) {
        console.error('Error fetching profile:', error);
        // Handle error (show notification to user)
    }
}); 