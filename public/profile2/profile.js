// logout button to remove session
let logOut = document.querySelector(".logout");
logOut.addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    window.location.href = "/public/Login/login.html";});


console.log(currentUser)

// Populate user info
function displayUserInfo() {
    const user = checkAuthority(["admin", "customer", "seller"]);
    if (!user) return;
    userNameProfile.textContent  = `${currentUser.userName}`
    emailProfile.textContent  = `${currentUser.email}`
    roleProfile.textContent  = `${currentUser.role}`}
// display info when page loads
window.addEventListener('load', displayUserInfo);

let editPhoteBtn = document.querySelector(".edit-photo");
let profilePicUrl = document.querySelector(".profilePic");
editPhoteBtn.addEventListener('click',()=>{
    profilePicUrl.style.display = "block";
    imagePic.setAttribute("src", profilePicUrl.value);
})