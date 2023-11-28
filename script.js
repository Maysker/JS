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
    const container = document.getElementById('users');
    container.innerHTML = ''; // Clearing the container before adding new elements
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
    });
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('tabAll').addEventListener('click', () => loadAndShowUsers('all'));
    document.getElementById('tabWomen').addEventListener('click', () => loadAndShowUsers('female'));
    document.getElementById('tabMen').addEventListener('click', () => loadAndShowUsers('male'));
});

