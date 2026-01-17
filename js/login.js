// Login page functionality
document.addEventListener("DOMContentLoaded", function () {
  initializeLoginPage();
  setupEventListeners();
});

function initializeLoginPage() {
  // Check if user is already logged in
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    // Redirect to main page if already logged in
    window.location.href = "index.html";
    return;
  }

  // Show login form by default
  showLoginForm();
}

function setupEventListeners() {
  // Form submissions
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  document
    .getElementById("register-form")
    .addEventListener("submit", handleRegister);

  // Password confirmation validation
  document
    .getElementById("confirm-password")
    .addEventListener("input", validatePasswordMatch);

  // Social login buttons
  document.querySelector(".social-btn.google").addEventListener("click", () => {
    showAlert("Google login!", "info");
  });

  document
    .querySelector(".social-btn.facebook")
    .addEventListener("click", () => {
      showAlert("Facebook acount!", "info");
    });

  // Forgot password link
  document.querySelector(".forgot-password").addEventListener("click", (e) => {
    e.preventDefault();
    showAlert("Remenber The passwoed")
  });
}

function showLoginForm() {
  document.getElementById("login-form-section").classList.add("active");
  document.getElementById("register-form-section").classList.remove("active");

  document.querySelectorAll(".tab-btn")[0].classList.add("active");
  document.querySelectorAll(".tab-btn")[1].classList.remove("active");
}

function showRegisterForm() {
  document.getElementById("register-form-section").classList.add("active");
  document.getElementById("login-form-section").classList.remove("active");

  document.querySelectorAll(".tab-btn")[1].classList.add("active");
  document.querySelectorAll(".tab-btn")[0].classList.remove("active");
}

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const button = input.parentElement.querySelector(".password-toggle i");

  if (input.type === "password") {
    input.type = "text";
    button.classList.remove("fa-eye");
    button.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    button.classList.remove("fa-eye-slash");
    button.classList.add("fa-eye");
  }
}

function validatePasswordMatch() {
  const password = document.getElementById("reg-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const confirmInput = document.getElementById("confirm-password");

  if (confirmPassword && password !== confirmPassword) {
    confirmInput.style.borderColor = "#ef4444";
    confirmInput.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.1)";
  } else {
    confirmInput.style.borderColor = "#e5e7eb";
    confirmInput.style.boxShadow = "none";
  }
}

async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("remember-me").checked;

  if (!username || !password) {
    showAlert("Please fill in all fields", "error");
    return;
  }

  showLoading();

  try {
    // Call the new simplified backend API
    const response = await fetch("backend/auth.php?action=login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const result = await response.json();

    hideLoading();

    if (result.success && result.data) {
      // Store user data and token
      const userData = {
        id: result.data.user.id,
        username: result.data.user.username,
        first_name: result.data.user.first_name,
        last_name: result.data.user.last_name,
        email: result.data.user.email,
        phone: result.data.user.phone,
        address: result.data.user.address,
        loginTime: new Date().toISOString(),
        rememberMe: rememberMe,
        token: result.data.token
      };

      localStorage.setItem("currentUser", JSON.stringify(userData));
      localStorage.setItem("authToken", result.data.token);

      if (rememberMe) {
        localStorage.setItem("rememberUser", "true");
      }

      showAlert("Login successful! Redirecting...", "success");

      // Redirect to main page after short delay
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      showAlert(result.message || "Login failed. Please try again.", "error");
    }
  } catch (error) {
    hideLoading();
    console.error("Login error:", error);
    showAlert("Network error. Please check your connection and ensure the backend is running.", "error");
  }
}

async function handleRegister(e) {
  e.preventDefault();

  const firstName = document.getElementById("reg-first-name").value.trim();
  const lastName = document.getElementById("reg-last-name").value.trim();
  const username = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const phone = document.getElementById("reg-phone").value.trim();
  const address = document.getElementById("reg-address").value.trim();
  const password = document.getElementById("reg-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const agreeTerms = document.getElementById("agree-terms").checked;

  // Validation
  if (!firstName || !lastName || !username || !email || !phone || !password || !confirmPassword) {
    showAlert("Please fill in all required fields", "error");
    return;
  }

  if (!validateEmail(email)) {
    showAlert("Please enter a valid email address", "error");
    return;
  }

  if (password.length < 6) {
    showAlert("Password must be at least 6 characters long", "error");
    return;
  }

  if (password !== confirmPassword) {
    showAlert("Passwords do not match", "error");
    return;
  }

  if (!agreeTerms) {
    showAlert(
      "Please agree to the Terms of Service and Privacy Policy",
      "error"
    );
    return;
  }

  showLoading();

  try {
    // Call the new simplified backend API
    const response = await fetch("backend/auth.php?action=register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        phone: phone,
        address: address || null,
      }),
    });

    const result = await response.json();

    hideLoading();

    if (result.success && result.data) {
      // Store user data and token
      const userData = {
        id: result.data.user.id,
        username: result.data.user.username,
        first_name: result.data.user.first_name,
        last_name: result.data.user.last_name,
        email: result.data.user.email,
        phone: result.data.user.phone,
        address: result.data.user.address,
        registrationTime: new Date().toISOString(),
        token: result.data.token
      };

      localStorage.setItem("currentUser", JSON.stringify(userData));
      localStorage.setItem("authToken", result.data.token);

      showAlert("Account created successfully! Redirecting...", "success");

      // Redirect to main page after short delay
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      showAlert(
        result.message || "Registration failed. Please try again.",
        "error"
      );
    }
  } catch (error) {
    hideLoading();
    console.error("Registration error:", error);
    showAlert("Network error. Please check your connection and ensure the backend is running.", "error");
  }
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showLoading() {
  document.getElementById("loading-overlay").classList.remove("hidden");
}

function hideLoading() {
  document.getElementById("loading-overlay").classList.add("hidden");
}

function showAlert(message, type = "info") {
  const alertContainer = document.getElementById("alert-container");
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type}`;

  const icon =
    type === "success"
      ? "fas fa-check-circle"
      : type === "error"
      ? "fas fa-exclamation-circle"
      : "fas fa-info-circle";

  alertDiv.innerHTML = `
        <i class="${icon}"></i>
        ${message}
    `;

  alertContainer.appendChild(alertDiv);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove();
    }
  }, 5000);

  // Add click to dismiss
  alertDiv.addEventListener("click", () => {
    alertDiv.remove();
  });
}
