//global variables

let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture, email, location, phone, dob &noinfo &nat=US`
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");

// fetch data from API

fetch(urlAPI)
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(res => {
        console.log(res); // Log full response to examine its structure
        return res.results; // Extract and return the "results" array
    })
    .then(displayEmployees) // Pass data to the displayEmployees function
    .catch(err => console.error("Error fetching data:", err));

// Function to display employees cards

function displayEmployees(employeeData) {
    employees = employeeData;
    let employeeHTML = '';
    employees.forEach((employee, index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let picture = employee.picture;
    employeeHTML += `
        <div class="card" data-index="${index}">
            <img class="avatar" src="${picture.large}" />
            <div class="text-container">
                <h2 class="name">${name.first} ${name.last}</h2>
                <p class="email">${email}</p>
                <p class="address">${city}</p>
            </div>
        </div>
    `
});
    gridContainer.innerHTML = employeeHTML;
}

// Function to display modal

function displayModal(index) {
    let { name, dob, phone, email, location: { city, street, state, postcode}, picture } = employees[index];
    
    let date = new Date(dob.date);
    
    const modalHTML = `
        <img class="avatar" src="${picture.large}" />
        <div class="text-container">
        <h2 class="name">${name.first} ${name.last}</h2>
        <p class="email">${email}</p>
        <p class="address">${city}</p>
        <hr />
        <p>${phone}</p>
        <p class="address">${street.name} ${street.number}, ${state} ${postcode}</p>
        <p>Birthday:
        ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
        </div>
        <button class="modal-prev"><</button>
        <button class="modal-next">></button>
        `;

    overlay.classList.remove("hidden");
    modalContainer.innerHTML = modalHTML;

    // Add event listeners for navigation buttons
    document.querySelector(".modal-prev").addEventListener("click", () => navigateModal(index - 1));
    document.querySelector(".modal-next").addEventListener("click", () => navigateModal(index + 1));
}

// open modal

gridContainer.addEventListener('click', e => {
    if (e.target !== gridContainer) {
        const card = e.target.closest(".card");
        const index = card.getAttribute('data-index');
        displayModal(index);
    }
});

// close modal

modalClose.addEventListener('click', () => {
    overlay.classList.add("hidden");
});

// navigate modal

function navigateModal(index) {
    if (index < 0) {
        index = employees.length - 1; // Wrap around to the last employee
    } else if (index >= employees.length) {
        index = 0; // Wrap around to the first employee
    }
    displayModal(index);
}