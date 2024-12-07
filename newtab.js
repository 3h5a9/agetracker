// Function to calculate the precise age from the birthdate
function calculatePreciseAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    let hours = today.getHours() - birth.getHours();
    let minutes = today.getMinutes() - birth.getMinutes();
    let seconds = today.getSeconds() - birth.getSeconds();

    // Adjust if seconds, minutes, hours, or days go negative
    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) { const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0); days += lastMonth.getDate(); months--; }
    if (months < 0) { months += 12; years--; }

    return { years, months, days, hours, minutes, seconds };
}

// Function to format the full age details (years, months, days, minutes, and seconds)
function formatAgeDetails(age) {
    let ageString = "";

    // Only append "months", "days", "hours", "minutes", and "seconds" if greater than 0
    if (age.months > 0) {
        ageString += `${age.months} months `;
    }
    if (age.days > 0) {
        ageString += `${age.days} days `;
    }
    if (age.hours > 0) {
        ageString += `${age.hours} hours `;
    }
    if (age.minutes > 0) {
        ageString += `${age.minutes} minutes `;
    }
    if (age.seconds > 0) {
        ageString += `${age.seconds} seconds`;
    }

    return ageString.trim();
}

// Function to store the birth date in localStorage
function saveBirthDate(birthDate) {
    localStorage.setItem('birthDate', birthDate);
}

// Function to retrieve the birth date from localStorage
function getStoredBirthDate() {
    return localStorage.getItem('birthDate');
}

// Function to start the real-time age counter
let ageInterval;
function startAgeCounter(birthDate) {
    clearInterval(ageInterval);

    ageInterval = setInterval(() => {
        const age = calculatePreciseAge(birthDate);

        // Display only years in the large format
        document.getElementById('age').textContent = `${age.years} years`;

        // Display the full details (without years) in the detailed format
        document.getElementById('age-details').textContent = formatAgeDetails(age);
    }, 1000); // Update every second
}

// Handle when the user sets their birth date via the Set button
document.getElementById('set-btn').addEventListener('click', () => {
    const birthDate = document.getElementById('birthdate').value;

    if (birthDate) {
        saveBirthDate(birthDate);
        clearInterval(ageInterval);

        document.getElementById('birthdate-container').style.display = 'none';
        document.getElementById('set-btn').style.display = 'none'; // Hide the Set button
        document.getElementById('age').textContent = "Calculating age...";

        setTimeout(() => {
            startAgeCounter(birthDate);
        }, 500); // Add a short delay to ensure user is done interacting with the field
    } else {
        document.getElementById('age').textContent = 'Please set your birth date above.';
    }
});

// Retrieve stored birth date and start age counter on page load
document.addEventListener('DOMContentLoaded', () => {
    const storedBirthDate = getStoredBirthDate();
    if (storedBirthDate) {
        document.getElementById('birthdate').value = storedBirthDate;
        document.getElementById('age').textContent = "Calculating age...";
        startAgeCounter(storedBirthDate);

        // Hide the birthdate input and Set button
        document.getElementById('birthdate-container').style.display = 'none';
        document.getElementById('set-btn').style.display = 'none'; // Hide the Set button
    }
});

// Settings Button: Show the birthdate input again when clicked
document.getElementById('settings-btn').addEventListener('click', () => {
    document.getElementById('birthdate-container').style.display = 'block';
    document.getElementById('set-btn').style.display = 'block'; // Show the Set button
    document.getElementById('age').textContent = 'Please set your birth date above.';
    clearInterval(ageInterval);
});
