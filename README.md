
# Project Description
Development backend of web applications about a sneakers E-commerce

---
## Technologies
- NestJS as backend framework
- MongoDB as a non-relational database
- Firebase storage as images storage
- Nodemailer as mail package
- Stripe as payment service
- Mongoose as MongoDB-ORM

---

## Installation
One you have this repository you should execute the next command to install the necesary packages

```bash
$ npm install
```
------

## Create your database
  ## You should consider, this project is working with MongoDB database
  ---

## Environment variables 
  ## Into env.template file
  - The first thing is to rename this file to just '.env'
  - Complete each of the variables with your data
      - ### MONGO_URL
          Once you have created your MongoDB database, copy the URL. I recommend saving your database user and the same way your password.

      - ### JWT_SECRET
          Here is easy, you need to write a complicated string as you wish the most complicated, most secure is your access token. I recommend using special characters like [!@#$%^&*()-{}+/~?><>], the same way use numbers and uppercase, lowercase characters.

      - ### STRIPE_API_KEY
          Go to the official Stripe website, you should create your account, once you have your own account sign in, and go to the API-key section and copy it.

      - ### NODE_MAILER_USER and NODE_MAILER_PASS
          In NODE_MAILER_USER just Select or create a new Google account to use. In NODE_MAILER_PASS once you have your account, go to the next link [applications pass](https://support.google.com/accounts/answer/185833?hl=en) and follow the steps.

      - ### FIREBASE VARIABLES SETTINGS
          Just follow the next video
          - Spanish: [video](https://www.youtube.com/watch?v=gKYjOkUhO1E)
          - English: [video](https://www.youtube.com/watch?v=-IFRVMEhZDc)
          
          Both of those videos, you should just copy the Firebase settings.

---

## Execute stripe service 
  - Just follow the official Stripe instructions on their [Stripe page](https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local).

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - Eder Yair Godinez Salazar
