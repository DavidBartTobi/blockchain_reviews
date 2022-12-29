const { expect } = require("chai");
const TruffleContract = require("@truffle/contract");
const Reviews = require("../build/contracts/Reviews.json");

// Test the ReviewSystem contract
describe("Reviews", () => {
  // Test variables
  let accounts;
  let reviews;

  // Before each test, create a new instance of the contract
  beforeEach(async () => {
    // Get test accounts
    accounts = await web3.eth.getAccounts();

    // Create a new instance of the Reviews contract
    reviews = await TruffleContract(Reviews)
      .setProvider(web3.currentProvider)
      .new();
  });

  // Test that a review can be added successfully
  it("should add a review", async () => {
    // Add a review
    await reviews.addReview(
      "0x1234567890",
      "0x0987654321",
      5,
      "This is an excellent product!",
      { from: accounts[0] }
    );

    // Get the review from the contract
    const review = await reviews.reviews("0x1234567890");

    // Check that the review was added successfully
    expect(review[0]).to.equal("0x1234567890");
    expect(review[1]).to.equal("0x0987654321");
    expect(review[2].toNumber()).to.equal(5);
    expect(review[3]).to.equal("This is an excellent product!");
  });

  // Test that a review link can be generated successfully
  it("should generate a review link", async () => {
    // Generate a review link
    const reviewLink = await reviews.generateReviewLink("0x0987654321", {
      from: accounts[0],
    });

    // Check that the review link is in the correct format
    expect(reviewLink).to.equal("https://example.com/reviews/0x1234567890");
  });

  // Test that a user can be rewarded for posting a review
  it("should reward a reviewer", async () => {
    // Add a review
    await reviews.addReview(
      "0x1234567890",
      "0x0987654321",
      5,
      "This is an excellent product!",
      { from: accounts[0] }
    );

    // Get the balance of the reviewer before they are rewarded
    const balanceBefore = await web3.eth.getBalance(accounts[0]);

    // Reward the reviewer
    await reviews.rewardReviewer("0x1234567890", { from: accounts[0] });

    // Get the balance of the reviewer after they are rewarded
    const balanceAfter = await web3.eth.getBalance(accounts[0]);

    // Check that the balance increased by 1 ether
    expect(balanceAfter.toNumber()).to.equal(balanceBefore.toNumber() + 1e18);
  });
});

/////////////////////////////////////////////////////////////

// Sure! The NewReview event in the ReviewSystem contract is an event that is emitted whenever a new review is added to the system. It is defined as follows:

// An event is a special type of function in Solidity that is used to notify external clients (such as frontend applications or other smart contracts) of changes that have occurred within the contract. Events are defined using the event keyword, followed by the name of the event and a list of parameters.

// The NewReview event has five parameters:

// reviewID: This is the unique ID of the review. It is defined as a bytes32 (32-byte hash) and is marked as indexed, which means that it can be used as a filter in event logs.

// productID: This is the unique ID of the product that was reviewed. It is also defined as a bytes32 and is marked as indexed.

// rating: This is the rating given to the product by the reviewer. It is defined as a uint256 (unsigned integer with 256 bits).

// review: This is the text of the review. It is defined as a string.

// reviewer: This is the address of the user who posted the review. It is defined as an address.

// The NewReview event is emitted from the addReview function whenever a new review is added to the system:

// Whenever the addReview function is called and a new review is added to the system, the NewReview event is emitted with the review ID, product ID, rating, review text, and reviewer address as parameters.

// I hope this helps! Let me know if you have any more questions.
////////////////////////////////////////////////////////////////////////////////%%%%%%%%%%%%%%%%%%%%

// Sure! Here is an example of the end-to-end process of generating a link for a user to post a review using the ReviewSystem contract:

// 1. Deploy the ReviewSystem contract to the Ethereum blockchain. This can be done using a tool like Truffle or Remix.

// 2. Interact with the contract using a web3 interface, such as MetaMask.

// 3. Call the generateReviewLink function of the ReviewSystem contract and pass in the product ID as an argument. This function will return a unique review link for the user to post a review.

// 4. Send the review link to the user. They can then click on the link and be taken to a review form where they can enter their review and submit it.

// 5. When the user submits their review, the review form sends a transaction to the addReview function of the ReviewSystem contract, passing in the review ID, product ID, rating, and review text as arguments.

// 6. The addReview function checks that the review does not already exist, then adds the review to the mapping and emits the NewReview event.

// 7. The user can then be rewarded for posting the review by calling the rewardReviewer function of the ReviewSystem contract and passing in the review ID as an argument. This function will transfer a certain amount of Ether to the user's address.

// I hope this helps! Let me know if you have any more questions.
