// import { isUserNameUnique, isEmailUnique } from './adminDashboard.js';
let allJsonUsers = []
let localUsers = [];
let nameError = document.getElementById("nameError");
let emailError = document.getElementById("emailError");
let passwordError = document.getElementById("passwordError");
let confPasswordError = document.getElementById("confpasswordError");
let form = document.querySelector("#registerForm");
let name = document.querySelector(".username");
let email = document.querySelector(".email");
let password = document.querySelector(".password");
let confPassword = document.querySelector(".confpassword");

// Fetch and display data
async function fetchData() {    // async to return promise
    try {
        const [users, products, orders] = await Promise.all([       
            fetch('http://localhost:3000/users').then(res => res.json()),
            fetch('http://localhost:3000/products').then(res => res.json()),
            fetch('http://localhost:3000/orders').then(res => res.json())
        ]);

        // Filter out users with status 'deleted'
        localUsers = users.filter(user => {
            return user.status !== 'deleted'; // Exclude deleted users
        });
        allJsonUsers = users;


    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
    window.addEventListener('load',fetchData)




    //Validations
    // username validation
    function isUserNameUnique(usernameToCheck) {
        // Normalize the username for comparison
        const normalizedUsername = usernameToCheck.trim().toLowerCase();
        // Extract and normalize all usernames from the user data
        const user_Names = allJsonUsers.map(item => item.username.trim().toLowerCase());
        // console.log(allJsonUsers)
        // Check if the username already exists
        return !user_Names.includes(normalizedUsername);    //true || false
    }
    
    // email validation
    function isEmailUnique(emailToCheck) {
        // Normalize the email for comparison
        const normalizedEmail = emailToCheck.toLowerCase();
        // Extract and normalize all emails from the user data
        const existedEmails = allJsonUsers.map(item => item.email.trim().toLowerCase());
        // Check if the email already exists
        return !existedEmails.includes(normalizedEmail);    //true || false
    }








    async function userRegister(userData){
        try {
            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(userData)
            });
            if (response.ok) {
                await fetchData();
            }
        }   catch(error) {
            console.error('Error in Registeration:', error);
                }
        }




    //initializing data of Registeration on submit
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let isValid = true;

    // Clear previous error messages
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confPasswordError.textContent = "";

    const userData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role'),
        id: (allJsonUsers.length + 1).toString(),
        status: 'active',
        createdAt: new Date().toISOString(),
    };

    // Validate username uniqueness
    if (!isUserNameUnique(userData.username)) {
        nameError.textContent = "Username is already taken.";
        isValid = false;
    }

    // Validate email uniqueness
    if (!isEmailUnique(userData.email)) {
        emailError.textContent = "Email is already in use.";
        isValid = false;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userData.email.trim())) {
        emailError.textContent = "Invalid email format.";
        isValid = false;
    }

    // Validate password
    if (password.value.trim() === "") {
        passwordError.textContent = "Password is required.";
        isValid = false;
    } else if (password.value.trim().length < 6) {
        passwordError.textContent = "Password must be at least 6 characters.";
        isValid = false;
    }

    // Validate confirm password
    if (confPassword.value.trim() === "") {
        confPasswordError.textContent = "Confirm password is required.";
        isValid = false;
    } else if (confPassword.value.trim() !== password.value.trim()) {
        confPasswordError.textContent = "Passwords do not match.";
        isValid = false;
    }

    // If all validations pass, proceed with registration
    if (isValid) {
        await userRegister(userData);
        e.target.reset();
        alert('Registration successful!');
    }
});













