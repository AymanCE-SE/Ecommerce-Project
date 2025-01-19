// authority
// function checkAuth(requiredRole) {
//     const userData = localStorage.getItem('currentUser');
//     if (!userData) {
//         window.location.href = 'public/login.html';
//         return false;
//     }
//     const user = JSON.parse(userData);
//     // If a specific role is required, check it
//     if (requiredRole && user.role !== requiredRole) {
//         window.location.href = 'public/login.html';
//         return false;
//     }
//     return true;
// }


// get current 
let currentUserString = localStorage.getItem('currentUser');
const currentUser = JSON.parse(currentUserString);

function checkAuthority(allowedRoles) {
    if (currentUserString) {
        return allowedRoles.includes(currentUser.role);
    }
    return false; //   
}

console.log(" iam auth ")
