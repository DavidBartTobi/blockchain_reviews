const Reviews = artifacts.require("Reviews");

contract("ReviewContract", () => {
  let reviewContract;

  before(async () => {
    reviewContract = await Reviews.deployed(10); // Reviewers earn 10 wei per review
  });

  it("should allow a review to be submitted and the reviewer to be paid", async () => {
    // Submit a review
    await reviewContract.submitReview("This is a great business!");

    // Check that the review was added to the mapping
    const review = await reviewContract.reviews(1);
    assert.equal(review.id.toNumber(), 1, "Incorrect review ID");
    assert.equal(
      review.review,
      "This is a great business!",
      "Incorrect review text"
    );

    // Check that the reviewer's wallet was credited with the correct amount of wei
    const balance = await web3.eth.getBalance(reviewContract.address);
    assert.equal(balance, 10, "Incorrect balance");
  });
});
