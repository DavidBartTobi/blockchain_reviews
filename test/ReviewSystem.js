const ReviewSystemJson = artifacts.require('ReviewSystem');
const assert = require('assert');
const Web3 = require('web3');
const truffleAssert = require('truffle-assertions');


contract('ReviewSystem', (accounts) => {
    const business1 = accounts[0];
    const reviewer1 = accounts[1];
    const reviewer2 = accounts[2];
    const rating = 3;
    const reviewString = 'This is a test review';
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');

  it('should add a review for a business', async () => {
    const reviewSystem = await ReviewSystemJson.deployed();
    const review = await reviewSystem.addReview(rating, reviewString, business1, reviewer1);
    // Check that the review was added by checking the event data
    assert.equal(review.logs[0].args.rating, rating);
    assert.equal(review.logs[0].args.review, reviewString);
    assert.equal(review.logs[0].args.business, business1);
    assert.equal(review.logs[0].args.reviewer, reviewer1);
  });

    it('should get the number of reviews for a business', async () => {
        const reviewSystem = await ReviewSystemJson.deployed();
      
        // Add a review
        await reviewSystem.addReview(5, 'Great business!', business1, reviewer1);
      
        // Check that the number of reviews is 1
        const numReviews = await reviewSystem.getNumReviews(business1);
        assert.equal(numReviews['words'][0], 2);
      });

      it('should get a review link', async () => {
        const reviewSystem = await ReviewSystemJson.deployed();
        const reviewLink = await reviewSystem.getReviewLink();
        assert.equal(reviewLink, 'http://localhost:1234/');
      });
      
      it('should get the average rating for a business', async () => {
        const reviewSystem = await ReviewSystemJson.deployed();
      
        // Add a review with a rating of 4
        await reviewSystem.addReview(4, 'Great business!', business1, reviewer1);
      
        // Check that the average rating is 4 considering previous tests
        const avgRating = await reviewSystem.getAverageRating(business1);
        assert.equal(avgRating, 4);
      
        // Add a review with a rating of 4 so that the average rating is 4
        await reviewSystem.addReview(4, 'Ok business', business1, reviewer2);
      
        // Check that the average rating is 4
        const updatedAvgRating = await reviewSystem.getAverageRating(business1);
        assert.equal(updatedAvgRating, 4);
      });
      
      it('should reward a user for posting a review', async () => {
        const reviewSystem = await ReviewSystemJson.deployed();
        const rewardAmount = 100; // arbitrary reward amount in wei
        const reviewId = 1; // arbitrary review ID
        const review = await reviewSystem.addReview(rating, reviewString, business1, reviewer1, { from: business1 });
        const initialReviewerBalance = new web3.utils.BN(await web3.eth.getBalance(reviewer1));
        await reviewSystem.rewardUser(reviewId, business1 , { value: rewardAmount, from: business1});
        const finalReviewerBalance = new web3.utils.BN(await web3.eth.getBalance(reviewer1));
        const expectedReviewerBalance = initialReviewerBalance.add(new web3.utils.BN(rewardAmount));
        // Check that the reviewer's balance has increased by the reward amount
        assert.equal(finalReviewerBalance.toString(), expectedReviewerBalance.toString(), 'Reviewer balance does not match expected balance');
        });

        it('should not allow adding a review with an invalid rating', async () => {
            const reviewSystem = await ReviewSystemJson.deployed();
          
            // Try to add a review with a rating lower than 1
            try {
              await reviewSystem.addReview(0, 'Invalid rating', business1, reviewer1);
              assert.fail('Expected addReview to revert with an error');
            } catch (error) {
              assert.ok(error.message.startsWith('VM Exception while processing transaction: revert Rating must be between 1 and 5'));
            }
          
            // Try to add a review with a rating higher than 5
            try {
              await reviewSystem.addReview(6, 'Invalid rating', business1, reviewer1);
              assert.fail('Expected addReview to revert with an error');
            } catch (error) {
              assert.ok(error.message.startsWith('VM Exception while processing transaction: revert Rating must be between 1 and 5'));
            }
          });

          it('should not allow rewarding a user for a review that does not exist', async () => {
            const reviewSystem = await ReviewSystemJson.deployed();
            const rewardAmount = 100; // arbitrary reward amount in wei
            const nonExistentReviewId = 99; // arbitrary review ID that does not exist
            try {
              await reviewSystem.rewardUser(nonExistentReviewId, business1, { value: rewardAmount, from: business1 });
              assert.fail('Expected revert not received');
            } catch (error) {
              assert.ok(error.message.startsWith('VM Exception while processing transaction: revert'), 'Unexpected error: ' + error.message);
            }
          });

          it('should get the correct review data for a given review ID', async () => {
            const reviewSystem = await ReviewSystemJson.deployed();
          
            // Add a review
            const review = await reviewSystem.addReview(5, 'Great business!', business1, reviewer1);
          
            // Get review data using review ID
            const reviewCount = await reviewSystem.reviewCount();
            const reviewId = reviewCount['words'][0];
            const result = await reviewSystem.getReview(reviewId);
          
            // Check that returned data matches expected values
            assert.equal(result[0]['words'][0], reviewId);
            assert.equal(result[1]['words'][0], 5);
            assert.equal(result[2], 'Great business!');
            assert.equal(result[3], business1);
            assert.equal(result[4], reviewer1);
          });
          
          it('should not allow a user to be rewarded multiple times', async () => {
            const reviewSystem = await ReviewSystemJson.deployed();
            const review = await reviewSystem.addReview(rating, reviewString, business1, reviewer1, { from: business1 });
            // Get review data using review ID
            const reviewCount = await reviewSystem.reviewCount();
            const reviewId = reviewCount['words'][0];
            await reviewSystem.rewardUser(reviewId, business1, { value: 1, from: business1 });
            // Try to reward user again
            try {
              await reviewSystem.rewardUser(reviewId, business1, { value: 1, from: business1 });
              // If the above line does not throw an error, the test has failed
              assert.fail('User was able to be rewarded multiple times');
            } catch (err) {
              // Check that the error message is correct
              assert.ok(err.message.startsWith('VM Exception while processing transaction: revert User has already been rewarded'));
            }
          });
          

});