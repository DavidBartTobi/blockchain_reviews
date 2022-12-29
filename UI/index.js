// Get form elements
const form = document.getElementById("review-form");
const rating = document.getElementById("rating");
const review = document.getElementById("review");
const email = document.getElementById("email");
const submitButton = document.getElementById("submit-button");

// Add event listeners
form.addEventListener("submit", submitReview);
rating.addEventListener("click", selectRating);

// Select rating
function selectRating(event) {
  // Get clicked element
  const target = event.target;

  // Check if element is a star
  if (!target.classList.contains("fa-star")) {
    return;
  }

  // Get rating
  const rating = parseInt(target.getAttribute("data-rating"), 10);

  // Set rating
  setRating(rating);
}

// Set rating
function setRating(rating) {
  // Get stars
  const stars = rating.children;

  // Set star colors
  for (let i = 0; i < stars.length; i++) {
    if (i < rating) {
      stars[i].style.color = "#ffc107";
    } else {
      stars[i].style.color = "#ccc";
    }
  }
}

// Submit review
async function submitReview(event) {
  // Prevent form submission
  event.preventDefault();

  // Get form values
  const rating = getRating();
  const review = getReview();
  const email = getEmail();

  // Validate form values
  if (!rating || !review || !email) {
    return;
  }

  // Disable form
  disableForm();

  // Filter bad language
  const filteredReview = filterBadLanguage(review);

  // Submit review
  try {
    // Send transaction to contract
    await contract.methods
      .addReview(reviewID, businessID, rating, filteredReview)
      .send({ from: userAccount });

    // Show success message
    showMessage("Review submitted successfully!");
  } catch (error) {
    // Show error message
    showMessage(error.message);
  }

  // Enable form
  enableForm();
}

// Get rating
function getRating() {
  // Get stars
  const stars = rating.children;

  // Find selected star
  for (let i = 0; i < stars.length; i++) {
    if (stars[i].style.color === "#ffc107") {
      // Return rating
      return i + 1;
    }
  }

  // Return null if no rating is selected
  return null;
}

// Get review
function getReview() {
  // Get review value
  const value = review.value.trim();

  // Validate review
  if (value.length === 0) {
    // Show error message
    showMessage("Please enter a review.");
    return null;
  }

  // Return review
  return value;
}

// Get email
function getEmail() {
  // Get email value
  const value = email.value.trim();

  // Validate email
  if (value.length === 0 || !value.includes("@")) {
    // Show error message
    showMessage("Please enter a valid email.");
    return null;
  }

  // Return email
  return value;
}

// Filter bad language
function filterBadLanguage(review) {
  // Replace bad words with asterisks
  return review.replace(/badword1|badword2|badword3/gi, "***");
}

// Disable form
function disableForm() {
  // Set form disabled attribute
  form.setAttribute("disabled", "");

  // Set submit button disabled attribute and text
  submitButton.setAttribute("disabled", "");
  submitButton.textContent = "Submitting...";
}

// Enable form
function enableForm() {
  // Remove form disabled attribute
  form.removeAttribute("disabled");

  // Remove submit button disabled attribute and reset text
  submitButton.removeAttribute("disabled");
  submitButton.textContent = "Submit Review";
}

// Show message
function showMessage(message) {
  // Create message element
  const messageElement = document.createElement("div");

  // Set message text and class
  messageElement.textContent = message;
  messageElement.classList.add("message");

  // Add message to form
  form.appendChild(messageElement);

  // Remove message after 3 seconds
  setTimeout(() => {
    messageElement.remove();
  }, 3000);
}
