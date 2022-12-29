pragma solidity >=0.4.22 <0.9.0;

// This contract allows users to post reviews and get rewarded in Ether
contract Reviews {
  // Map to store reviews
  mapping(bytes32 => Review) public reviews;

  // Struct to store review information
  struct Review {
    bytes32 reviewID;
    bytes32 businessID;
    uint256 rating;
    string review;
    address reviewer;
  }

  // Event to emit when a new review is added
  event NewReview(
    bytes32 indexed reviewID,
    bytes32 indexed businessID,
    uint256 rating,
    string review,
    address reviewer
  );

  // Function to add a new review
 function addReview(
  bytes32 _reviewID,
  bytes32 _productID,
  uint256 _rating,
  string memory _review
) public {
  // Check if review already exists
  require(reviews[_reviewID].reviewID == 0, "Review already exists");

  // Add review to the mapping
  reviews[_reviewID] = Review(_reviewID, _productID, _rating, _review, msg.sender);

  // Emit event
  emit NewReview(_reviewID, _productID, _rating, _review, msg.sender);
}

  // Function to generate a link for a user to post a review
  function generateReviewLink(bytes32 _businessID) public view returns (string memory) {
    // Generate a random review ID
    bytes32 reviewID = keccak256(abi.encodePacked(block.timestamp, msg.sender, _businessID));

    // Return the review link
    return "http://localhost:1234/review?reviewID=";
  }

  // Function to reward a user for posting a review
  function rewardReviewer(bytes32 _reviewID) public {
    // Get review information
    Review storage review = reviews[_reviewID];

    // Check if review exists
    require(review.reviewID != 0, "Review does not exist");

    // Reward the reviewer
    payable(review.reviewer).transfer(1 ether);
  }
}