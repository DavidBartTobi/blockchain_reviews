pragma experimental ABIEncoderV2;
pragma solidity 0.6.12;

contract ReviewSystem {
   // Contract variables
  uint public reviewCount;
  mapping(uint => Review) public reviews;
  mapping(address => uint) public averageRatings;
  mapping(address => uint) public numRatings;

  // Review struct
  struct Review {
    uint reviewId;
    uint rating;
    string review;
    address payable business;
    address payable reviewer;
  } 

  // Event
  event NewReview(uint indexed reviewID, uint rating, string review, address business, address reviewer);

// Contract functions
  function addReview(uint _rating, string memory _review, address payable _business, address payable _reviewer) public {
    // Increment review count
    reviewCount++;

    // Create review object
    Review memory review = Review(reviewCount, _rating, _review, _business, _reviewer);

    // Save review
    reviews[reviewCount] = review;

    // Update average rating and number of ratings for business
    uint previousRatingTotal = averageRatings[_business] * numRatings[_business];
    numRatings[_business] = numRatings[_business] + 1;
    averageRatings[_business] = (previousRatingTotal + _rating) / numRatings[_business];

    // Emit NewReview event
    emit NewReview(reviewCount, _rating, _review, _business, _reviewer);
  }

  function getReviewLink() public view returns (string memory) {
    // Generate and return review link
    return "http://localhost:1234/";
  }

  function getReview(uint _reviewId) public view returns (uint, uint, string memory, address, address) {
    Review memory review = reviews[_reviewId];
    return (review.reviewId, review.rating, review.review, review.business, review.reviewer);
  }


  // Function to get the average rating of a business
  function getAverageRating(address _business) public view returns (uint) {
    return averageRatings[_business];
  }

  // Function to get the number of reviews for a business
  function getNumReviews(address _business) public view returns (uint) {
    return numRatings[_business];
  }

  // Function to reward a user for posting a review
 function rewardUser(uint reviewID, address payable _business) public payable {
    // Get review data
    Review storage reviewData = reviews[reviewID];

    // Check that review exists
    require(reviewData.rating > 0, "Review not found");

    // Check that user has not already been rewarded
    require(reviewData.reviewer != address(0), "User has already been rewarded");

    // Check that business is the one associated with the review
    require(reviewData.business == _business, "Business not associated with review");

    // Transfer reward to user
    reviewData.reviewer.transfer(msg.value);

    // Update review data to mark user as rewarded
    reviewData.reviewer = address(0);
}
}
