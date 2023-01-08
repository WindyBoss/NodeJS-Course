# Password Hashing

**Never collect passwords in in pure view (the same as user left) - always hash the passwords**
- Password hashing - unreserved operation (from password is possible to make hash, but from hash => no password) of data spoil for increasing of data security.
- In case of password, comparison of passwords are made by comparing hashed passwords. Hashing is always the same for the same passwords. If user text different password from those, which he/she used during registration - hashing will be different, and system won't allow to use account
- Additionally, it is good practice to use 'salt' for stronger password hashing for preventing password matching in rainbow table (table of already created hashing combinations) used by hackers. It works in the next way: 

```javascript
saltedHashedPassword = hash(password + salt) 
// or
saltedHashedPasswordSecondLevel = hash(hash(password) + salt)
saltedHashedPasswordThirdLevel = hash(hash(hash(password)) + salt) 
// salt is different every time
...
```

- For hashing is used library [bcrypt](https://www.npmjs.com/package/bcrypt)


[More information](https://yura.stryi.com/2012-10-15/plain-text-passwords/)


# User Interaction points

## Registration

**There are 2 types of registration:**
- normal form registration
- OAuth/OAuth2 registration (using FB or Google account)



## Verification
- Usually is made by email or phone number verification (send email or SMS) - There special libraries for that:
+ [email-verification](https://www.npmjs.com/package/email-verification)
+ [email-verification-code](https://www.npmjs.com/package/email-verification-code)
+ [nexmo](https://openbase.com/js/nexmo) - sms verification
+ [sms-number-verifier](https://openbase.com/js/sms-number-verifier)


## Authentication
**Process of checking is the user - an owner of account**
Types of authentication are the same as registration

Authentication is based on generation of token and sending to user, which will take part in any operation made by user during the session.

*There couple of approaches of token generation:*
1. generate single token, which will work limited time (e.g. 30 minutes)
2. generate 2 tokens: 1 - session token | 2 - refresh token
In such case session token, works only for 1 session (e.g. 1 hour), and refresh token can work couple of days (e.g. FB, Google)

### Token
[Token Example](img/token_element_example.jpeg)
Token elements:
- Header: The way of token creation
- Payload: information, which user add to token
- Verify signature: hashed by key payload (unique signature, which different to each token)

Main token standard - library [JWT (Json Web Token)](https://www.npmjs.com/package/jsonwebtoken)
This standard is build on [BASE64 decoding](https://www.base64decode.org/)
Additional: [secure password generator](https://passwordsgenerator.net/)

### OAuth
The next picture presents how authentication/registration process works by OAuth
[OAuth example](img/OAuth_registration_example.jpeg)

Stages: 
1. User(C) click on OAuth button (Authenticate by FB/Google) => sends fetch to site server ( C => S )
2. Server(S) has contract with OAuth Provider (FB, Google)(F) => sends fetch with (ClientID, ClientSecret (here client is Server(S), but not user(C)) and callback URL) ( S => F )
3. Provider(F) sends back oAuthLink to website server(S) ( F => S )
4. Server(S) sends oAuthLink to User(C)
5. User(C) is authenticates in Provider(F) account ( C <=> F )
6. User(C) is redirected to Server(S) website ( F => S )
7. User(C) makes operations in Server(S) website

For OAuth is used [passport lib](https://www.passportjs.org/)


## Authorization
**Authorization - allowance of account or group of account to make some operations in those accounts, and also checking if those accounts have rights to make those operations**

Good example here is differentiation of accounts: premium | lite | free.
The rights of those accounts are different, so lite & free and more limited than premium as on backend, as on frontend (hide/show some routes)