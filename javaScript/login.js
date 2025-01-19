// save user data in local storage
function saveUserSession(user) {
    const userData = {
        userName: user.username,
        id: user.id,
        email: user.email,
        role: user.role
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));  //key, value
}


// select DOM elements
const loginForm = document.querySelector('#loginForm');
const email = document.querySelector('#email');
const passwd = document.querySelector('#passwd');
const emailError = document.querySelector('#emailError');
const passwordError = document.querySelector('#passwordError');

// check if the user already logged
if(currentUser){
    alert("you already logged in!")
    window.location.href = '/public/profile2/profile.html';
}

// submitting flag
let isSubmitting = false;

// Email validation regex function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Event on submit
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Clear previous errors
    emailError.textContent = "";  
    passwordError.textContent = ""; 
    
    // Get form values
    const emailValue = email.value.trim().toLowerCase();
    const passwordValue = passwd.value.trim();  
    
    // Validate email
    if (!emailValue) {
        emailError.textContent = "Email is required";
        return;
    }
    
    if (!isValidEmail(emailValue)) {
        emailError.textContent = "Please enter a valid email address";
        return;
    }
    
    // Validate password
    if (!passwordValue) {  
        passwordError.textContent = "Password is required";
        return;
    }
    
    // Prevent double submission
    if (isSubmitting) return;
    isSubmitting = true;
    
    try {
        const res = await fetch("http://localhost:3000/users");
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const users = await res.json();
        const user = users.find((u) => u.email.toLowerCase() === emailValue);        
        if (user) {
            if (user.password === passwordValue) {
                saveUserSession(user);
                // console.log(saveUserSession)
                switch(user.role) {
                    case 'admin':
                        window.location.href = "../Admin/adminDashboard.html";
                        break;
                    case 'customer':
                        window.location.href = "../index.html";
                        break;
                    case 'seller':  
                        window.location.href = "../Seller/seller.html";
                        break;
                    default:
                        throw new Error("Invalid login, please contact us!");
                }
            } else {
                passwordError.textContent = "Incorrect password. Please try again.";
            }
        } else {
            emailError.textContent = "No user found with this email. Please sign up first.";
        }
    } catch (error) {
        console.error("Login error:", error);
        // Show user-friendly error message
        const errorMessage = document.createElement("div");
        errorMessage.className = "error-message";
        errorMessage.textContent = "An error occurred during login. Please try again later.";
        loginForm.insertBefore(errorMessage, loginForm.firstChild);
    } finally {
        isSubmitting = false;
    }
});

// Real-time validation
email.addEventListener("input", function() {
    emailError.textContent = "";
    if (this.value.trim() && !isValidEmail(this.value.trim())) {
        emailError.textContent = "Please enter a valid email address";
    }
});

passwd.addEventListener("input", function() {
    passwordError.textContent = "";
});


