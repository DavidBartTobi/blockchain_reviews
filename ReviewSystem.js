const { expect } = require('chai');
const Web3 = require('web3');
const TruffleContract = require('@truffle/contract');
const ReviewSystemJson = require('./build/contracts/ReviewSystem.json');

describe('ReviewSystem', () => {
  let web3;
  let contract;
  let accounts;

  before(async () => {
    // Set up web3 provider
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');

    // Get list of accounts
    accounts = await web3.eth.getAccounts();
    console.log(accounts[0])
    // Set up contract
    contract = TruffleContract(ReviewSystemJson);
    contract.setProvider(web3.currentProvider);
  });

  it('should add a review', async () => {
    // Deploy contract
    const instance = await contract.new();

    // Add review
    const rating = 3;
    const review = 'This is a test review';
    const businessAddress = accounts[0];
    await instance.addReview(rating, review, businessAddress);

    // Check that review count has incremented
    const reviewCount = await instance.reviewCount();
    expect(reviewCount).to.equal(1);

    // Check that review has been added
    const reviewData = await instance.reviews(1);
    expect(reviewData.rating).to.equal(rating);
    expect(reviewData.review).to.equal(review);
    expect(reviewData.reviewer).to.equal(accounts[0]);
  });

  it('should get a review link', async () => {
    // Deploy contract
    const instance = await contract.new();

    // Get review link
    const reviewLink = await instance.getReviewLink();
    expect(reviewLink).to.equal('http://localhost:1234/');
  });

  it('should get the number of reviews for a business', async () => {
    // Deploy contract
    const instance = await contract.new();

    // Add review
    const rating = 3;
    const review = 'This is a test review';
    await instance.addReview(rating, review, { from: accounts[0] });

    // Get number of reviews for business
    const numReviews = await instance.getNumReviews(1);
    expect(numReviews).to.equal(rating);
  });

  it('should reward a user for posting a review', async () => {
    // Deploy contract
    const instance = await contract.new();

    // Add review
    const rating = 3;
    const review = 'This is a test review';
    await instance.addReview(rating, review, { from: accounts[0] });

    // Check balance before reward
    const initialBalance = await web3.eth.getBalance(accounts[0]);

    // Reward user
    const rewardAmount = web3.utils.toWei('1', 'ether');
    await instance.rewardUser(1, { from: accounts[1], value: rewardAmount });

    // Check balance after reward
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    expect(finalBalance).to.be.bignumber.equal(initialBalance.add(rewardAmount));

    // Check that user has been marked as rewarded
    const reviewData = await instance.reviews(1);
    expect(reviewData.reviewer).to.equal(address(0));
  });
});
