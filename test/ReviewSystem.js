const ReviewSystemJson = artifacts.require('ReviewSystem');
const assert = require('assert');
const Web3 = require('web3');


contract('ReviewSystem', (accounts) => {
    const business1 = accounts[0];
    const reviewer1 = accounts[1];
    const reviewer2 = accounts[2];
    const rating = 3;
    const reviewString = 'This is a test review';
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');

    it('should get the number of reviews for a business', async () => {
        const reviewSystem = await ReviewSystemJson.deployed();
      
        // Add a review
        await reviewSystem.addReview(5, 'Great business!', business1, reviewer1);
      
        // Check that the number of reviews is 1
        const numReviews = await reviewSystem.getNumReviews(business1);
        assert.equal(numReviews, 1);
      });
      
      it('should get the average rating for a business', async () => {
        const reviewSystem = await ReviewSystemJson.deployed();
      
        // Add a review with a rating of 5
        await reviewSystem.addReview(5, 'Great business!', business1, reviewer1);
      
        // Check that the average rating is 5
        const avgRating = await reviewSystem.getAverageRating(business1);
        assert.equal(avgRating, 5);
      
        // Add a review with a rating of 3
        await reviewSystem.addReview(3, 'Ok business', business1, reviewer2);
      
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
      
});