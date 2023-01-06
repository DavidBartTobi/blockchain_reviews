pragma solidity >=0.4.22 <0.9.0;

contract Reviews {
  // Mapping of review IDs to reviews
  mapping(uint => Review) public reviews;

  // The amount of Ethereum that a reviewer earns for each review
  uint public reviewPayment;

  // The number of reviews that have been submitted
  uint public reviewCount;

  // Struct to represent a review
  struct Review {
    uint id;
    string review;
  }

  // Constructor function to initialize the contract
  constructor(uint _reviewPayment) {
    reviewPayment = _reviewPayment;
  }

  // Function to submit a review
  function submitReview(string memory _review) public {
    // Increment the review count
    reviewCount++;
  
    // Create a new review struct and add it to the mapping
    Review memory newReview = Review(reviewCount, _review);
    reviews[reviewCount] = newReview;

    // Credit the Ethereum wallet of the reviewer
    payable(msg.sender).transfer(reviewPayment);

  }
}