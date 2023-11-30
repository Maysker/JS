//Creating a class for API data retrieval.//
class UserFetcher { 
    constructor(apiURL) {
        this.apiURL = apiURL;
    }
    
   // Asynchronous retrieval of users from API
    async fetchUsers() {
        try {
            const response = await fetch(this.apiURL);
            const data = await response.json();
            return data.users; 
        } catch (error) {
            console.error("Error getting users", error);
        }
    }
}


const fetcher = new UserFetcher('https://dummyjson.com/users');

// Function for displaying user data
function renderUsers(users) {
    // Hide the chart when displaying users
    document.querySelector('.chart-container').style.display = 'none';
    
    const container = document.getElementById('users');
    container.innerHTML = '';
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-info'; 
        userDiv.innerHTML = `
            <p>Name: ${user.firstName} ${user.lastName}</p>
            <p>Phone: ${user.phone}</p>
            <p>Gender: ${user.gender}</p>
            <p>Age: ${user.age}</p>
        `; 
        container.appendChild(userDiv);
    });
    container.style.display = 'block'; // Displaying the container after all elements have been added
}


function loadAndShowUsers(gender) {
    fetcher.fetchUsers().then(users => {
        const filteredUsers = gender === 'all' ? users : users.filter(user => user.gender === gender);
        renderUsers(filteredUsers);
        // Show the 'back' button when user data is displayed
        document.getElementById('backButton').style.display = 'block';
    });
}

// Now add functionality to the 'back' button to show the chart again and hide user data
document.getElementById('backButton').addEventListener('click', () => {
    // Show the chart
    document.querySelector('.chart-container').style.display = 'block';
    // Hide the user data
    document.getElementById('users').style.display = 'none';
    // Hide the 'back' button
    document.getElementById('backButton').style.display = 'none';
});


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('tabAll').addEventListener('click', () => loadAndShowUsers('all'));
    document.getElementById('tabWomen').addEventListener('click', () => loadAndShowUsers('female'));
    document.getElementById('tabMen').addEventListener('click', () => loadAndShowUsers('male'));
});

//chart//
async function fetchUsersData() {
    // Fetching the users data from the API
    const response = await fetch('https://dummyjson.com/users');
    const data = await response.json();
    
    // Processing the users data to get age distribution
    const ageDistribution = data.users.reduce((acc, user) => {
        const ageGroup = Math.floor(user.age / 10) * 10; // Group ages by decade
        acc[ageGroup] = (acc[ageGroup] || 0) + 1;
        return acc;
    }, {});

    return ageDistribution;
}

async function initChart() {
    const ageDistribution = await fetchUsersData();

    // Modifying labels to be more descriptive (e.g., "20-29" for "20s")
    const labels = Object.keys(ageDistribution).sort((a, b) => a - b).map(age => `${age}-${parseInt(age)+9}`);

    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of users',
                data: Object.values(ageDistribution),
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Users'
                    },
                    grid: {
                        drawBorder: true, // This will ensure the borders of Y-axis are also drawn
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Age Groups'
                    },
                    grid: {
                        drawBorder: true, // Ensure the grid border is drawn
                        drawOnChartArea: true, // Draw the grid on the chart area
                    }
                }
            },
            layout: {
                padding: {
                        right: 10 // Add padding on the right to ensure the edge line is visible
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    enabled: false // Disable tooltips
                }
            },
            animation: {
                duration: 2000, // Duration of the initial animation
            },
            events: ['click'], // Remove mouse events to disable tooltips
        }
    });

    // Add an event listener to replay the animation on hover
    ctx.canvas.addEventListener('mouseenter', () => {
        myChart.reset(); // Reset the chart to initial state
        myChart.update(); // Update the chart to replay the animation
    });
}

// Initializing the chart when the script loads
initChart();
