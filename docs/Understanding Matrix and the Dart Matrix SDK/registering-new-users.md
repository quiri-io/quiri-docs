# Registering New Users
For Quiri, we want to register users with a username and an email. Luckily, we can reference how Fluffychat does this!

[Choosing an avatar and username](https://gitlab.com/famedly/fluffychat/-/blob/5212d7ce4d66fd1465e851aee788ca9f4f6537b8/lib/pages/connect/connect_page.dart#L31-97)

[Provide email and choose a password](https://gitlab.com/famedly/fluffychat/-/blob/e88ce8e91cc992885a109a39270558503aaa455f/lib/pages/sign_up/signup.dart#L76-125)

Lets find the associated REST calls in the [matrix API spec](https://playground.matrix.org/#overview)

## Check if username is available
[Matrix spec](https://playground.matrix.org/#get-/_matrix/client/v3/register/available)
- no auth required
- fluffychat doesn't use this maybe because it doesn't reserve the username?
- should be useful for username selection screen


## Register
[SDK code](https://github.com/famedly/matrix-dart-sdk/blob/544888fe33a14e0610b2916b5069656a06aeb299/lib/src/client.dart#L450-L490) | [Matrix Spec](https://playground.matrix.org/#post-/_matrix/client/v3/register)
- no auth required
- when hitting the `matrix.org` server with only a username, it returns a `401` with a response body that tells you the "authentication flows" that are available to you for this endpoint on this server.
```
{
    "session": "jgIeMOlHYubxOZYzaFSMCFqJ",
    "flows": [
        {
            "stages": [
                "m.login.recaptcha",
                "m.login.terms",
                "m.login.email.identity"
            ]
        }
    ],
    "params": {
        "m.login.recaptcha": {
            "public_key": "6LcgI54UAAAAABGdGmruw6DdOocFpYVdjYBRe4zb"
        },
        "m.login.terms": {
            "policies": {
                "privacy_policy": {
                    "version": "1.0",
                    "en": {
                        "name": "Terms and Conditions",
                        "url": "https://matrix-client.matrix.org/_matrix/consent?v=1.0"
                    }
                }
            }
        }
    }
}
``` 
In this case the "authentication" is the steps that you will need to go through in order to register on this server; pass recaptcha, agree to terms and conditions and go through an email verification flow (receive an email and click the button in it)

On my local dockerized synapse instance I wanted to start with the simplest [configuration](https://matrix-org.github.io/synapse/latest/usage/configuration/config_documentation.html) and build up from there. 

The basic configuration does not allow any registrations.
Adding `enable_registration: true` will get you a startup error telling you that you shouldn't allow registrations without some additional measures to confirm identity (like the steps above that matrix.org makes you go through). Otherwise people can spam requests to create accounts.

On my local though, it tells me that I can add `enable_registration_without_verification: true` to allow such registrations anyways.

After doing that I naively try to submit a registration request with just a username and an email:
```
curl --location 'localhost:8008/_matrix/client/v3/register' \
--header 'Content-Type: application/json' \
--data '{
    "username": "cheeeeky_monkey",
    "password": "password"
}'
```
I get back this cryptic response and it does not register a user.
```
{
    "session": "bFygXrPrCVAOztdAJyjjDOim",
    "flows": [
        {
            "stages": [
                "m.login.dummy"
            ]
        }
    ],
    "params": {}
}
```

After reading through the [User-Interactive Authentication API docs](https://spec.matrix.org/v1.9/client-server-api/#user-interactive-authentication-api) I learned that this is my server telling me that I have one flow that I can take to authenticate this registration request. And that path is to perform no flow! All I have to do is add the auth parameter to my registration request.
```
{
    "password": "ilovebananas",
    "username": "cheeky_monkey",
    "auth": {
        "session": "qRFAzYnVJgHQdobMkUhOQlUU",
        "type": "m.login.dummy"
    }
}
```

The session is optional in this case because the flow only has a single step (multiple step flows will require sending the same session token). Including the `m.login.dummy` auth type basically is just a little hoop we have to jump through to make this request without going through any actual flow.

We registered a user! But as per that earlier error's advice, we can't go public with this configuration. For Quiri we want to register users with their emails so it's time to figure out how to configure the server to require email for registration and also configure it to send the emails!


## Registering a user with an email

### Setting up a dev email server
At first I was looking into different services like SendGrid (will probably use this for the actual deployment) but then I realized I should be able to use an SMTP server hosted in a local docker container!

So I am trying [smtp4dev](https://github.com/rnwood/smtp4dev)

### Get the registration token
- [API doc](https://playground.matrix.org/#post-/_matrix/client/v3/register/email/requestToken)
```
curl --location 'localhost:8008/_matrix/client/v3/register/email/requestToken' \
--header 'Content-Type: application/json' \
--data-raw '{
  "client_secret": "monkeys_are_GREAT",
  "email": "alice@example.org",
  "next_link": "https://example.org/congratulations.html",
  "send_attempt": 1
}'
```
- the client secret is any string invented by the client
- this sends the email with the validation link!
- the response is an sid
    ```
    {
        "sid": "WurCLwjxFYIGiTIz"
    }
    ```

### Click the verification link
- you cannot continue with registration until that link is clicked
- go to `localhost:5005` for the smtp4dev interface and open the email
- the link is currently https, which won't work
    - I should figure out how to make it use http for the link
    - for now just copy paste it from the email into the browser and edit to `http`
    - it will redirect to a 404 page because I haven't set up a redirect page yet
    - but it did succeed!

### Complete the registration
```
curl --location 'localhost:8008/_matrix/client/v3/register' \
--header 'Content-Type: application/json' \
--data '{
    "device_id": "GHTYAJCE",
    "inhibit_login": false,
    "initial_device_display_name": "Jungle Phone",
    "password": "ilovebananas",
    "refresh_token": false,
    "username": "cheeky_monkey_email",
    "auth": {
        "session": "bdZxZeFmpPxdAuSVoGalmiPC",
        "type": "m.login.email.identity",
        "threepid_creds": {
            "sid": "ygxQvHncMIMQzFTk",
            "client_secret": "monkeys_are_GREAT"
        }
    }
}'
```
- the sid is from the previous email registration request
- the client_secret was provided in the previous email registration request
- this will fail if the user has not yet clicked the link in their email
- if they have clicked that link, the user is now registered, your first token is returned and we're off!

## Email Registration User Experience
- User is asked for email and password
    - random client_secret is generated by client and stored in localstorage
    - request is sent to matrix to send verification email
        - sid of response is held in local storage
    - password is held in local storage?
        - security risk?
- User is taken to a page informing them that they must click the link in the email to continue
    - include button to resend the request
- when the button is clicked in the email, we should try to send them into the app?
    - or just give them a message that they should go back to the app to continue
- whenever they return to the "check your email" page, try to register them with no password
    - if they have yet to have validated, it will respond with EMAIL_NOT_VALIDATED
    - if they have validated it will respond with NO_PASSWORD
- once the NO_PASSWORD response comes up, move the user through the username selection process
- once they have selected a username, send the final registration request with username, password, email token (sid)
    - an access token will be returned and the user is on their merry way
- make sure to remove the password from local storage!

Throughout the above process, if the user closes the app and re-opens they should be brought back to the screen that they were at. The information that they provide needs to be stored in "localstorage" until they make the final registration call.
