// Import required modules
import Web3 from "web3";
import contract from "truffle-contract";
import "punycode";


// Initialize web3 and contract instance
const web3 = new Web3(window.web3.currentProvider);
const ReviewSystem = contract(ReviewSystemJson);
ReviewSystem.setProvider(web3.currentProvider);

// Get contract instance
let reviewSystem;
ReviewSystem.deployed().then(instance => {
  reviewSystem = instance;
});

// Get form element
const form = document.getElementById("review-form");

// Add event listener for form submission
form.addEventListener("submit", async event => {
  // Prevent default form submission behavior
  event.preventDefault();

  // Get rating, review, and email values
  const rating = document.getElementById("rating").value;
  const review = document.getElementById("review").value;
  const email = document.getElementById("email").value;

  // Call contract function to add review
  await reviewSystem.addReview(businessID, rating, review, { from: userAccount });

  // Show confirmation message
  const confirmationMessage = document.getElementById("confirmation-message");
  confirmationMessage.style.display = "block";
});
