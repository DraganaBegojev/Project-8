// Global Variables
let employees = [];
let filteredEmployees = []; // To store filtered employees
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture, email, location, phone, dob &noinfo &nat=US`;
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");

// Fetch Data from API
fetch(urlAPI)
    .then(res => res.json())
    .then(data => {
        employees = data.results;
        displayEmployees(employees);
    })
    .catch(err => console.error("Error fetching data:", err));

// Function to Display Employees
function displayEmployees(employeeList) {
    let employeeHTML = '';
    employeeList.forEach((employee, index) => {
        const { name, email, location, picture } = employee;
        employeeHTML += `
            <div class="card" data-index="${index}">
                <img class="avatar" src="${picture.large}" />
                <div class="text-container">
                    <h2 class="name">${name.first} ${name.last}</h2>
                    <p class="email">${email}</p>
                    <p class="address">${location.city}</p>
                </div>
            </div>
        `;
    });
    gridContainer.innerHTML = employeeHTML;

    // Add Event Listener for Cards
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.addEventListener("click", e => {
            const index = parseInt(card.getAttribute("data-index"));
            displayModal(employeeList, index); // Pass current list (original or filtered)
        });
    });
}

// Function to Display Modal
function displayModal(employeeList, index) {
    const { name, dob, phone, email, location, picture } = employeeList[index];
    const date = new Date(dob.date);

    const modalHTML = `
        <img class="avatar" src="${picture.large}" />
        <div class="text-container">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email">${email}</p>
            <p class="address">${location.city}</p>
            <hr />
            <p class="address">${phone}</p>
            <p class="address">${location.street.number} ${location.street.name}, ${location.state} ${location.postcode}</p>
            <p class="address">Birthday: ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}</p>
        </div>
        <button class="modal-prev"><</button>
        <button class="modal-next">></button>
    `;

    overlay.classList.remove("hidden");
    modalContainer.innerHTML = modalHTML;

    // Add Event Listeners for Navigation
    document.querySelector(".modal-prev").addEventListener("click", () => navigateModal(employeeList, index - 1));
    document.querySelector(".modal-next").addEventListener("click", () => navigateModal(employeeList, index + 1));
}

// Close Modal

function closeModal() {
    if (!overlay.classList.contains("hidden")) {
        overlay.classList.add("hidden");
    }
}

// Close Modal when clicking the close button
modalClose.addEventListener("click", closeModal);

// Close Modal when clicking outside modal content
overlay.addEventListener("click", (e) => {
    if(e.target === overlay) {
        closeModal();
    }
});

// Close Modal with Esckey
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Navigate Modal
function navigateModal(employeeList, index) {
    if (index < 0) {
        index = employeeList.length - 1; // Wrap to last
    } else if (index >= employeeList.length) {
        index = 0; // Wrap to first
    }
    displayModal(employeeList, index);
}

// Search Bar
const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("input", e => {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm === "") {
        filteredEmployees = [];
        displayEmployees(employees); // Show original list
    } else {
        filteredEmployees = employees.filter(employee => {
            const fullName = `${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`;
            return fullName.includes(searchTerm);
        });
        displayEmployees(filteredEmployees); // Show filtered list
    }
});
