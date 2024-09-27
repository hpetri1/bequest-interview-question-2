# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal server or database is breached.

**1. How does the client ensure that their data has not been tampered with?**
There are several techniques that can help clients ensure their data remains tamper-proof.
**This poject includes some of those:**

1. Client-Side and also Server-Side Validation, eg. Type Checking, Input Validation and Sanitization.
2. A SHA-256 hashing algorithms has been added to maintain data integrity.
3. Data Encryption to secure data in transit to prevent unauthorized modifications

**2. If the data has been tampered with, how can the client recover the lost data?**
There are several robust preventative measures combined with effective recovery strategies, that
can ensure that the system maintains the integrity of critical user data.
**This poject includes a very simple one:**

1. The user is able to reset their previous data, if it has been changed, once they click the 'Verify Data' button and confirm the action.

Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:

`npm run start` in both the frontend and backend

## To make a submission:

1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance
