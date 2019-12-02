/* global fetch, Headers */

// Define important constants and variables
const debug = true
const debugUser = 'lumi'
const debugPassword = 'lumi@factry87634'
const debugButtonId = 'loginDemo'

const authUrl = 'https://demo.factry.io/hiringchallenge/auth/login'
const dataUrl = 'https://demo.factry.io/hiringchallenge/historian/collectors'

// Script to run for easy testing
if (debug) {
  // Do a bad login attempt to show error messages.
  // login('non-existing-user', 'and-a-bad-password')
  // Do a correct login with the debug user.
  // login()

  // Send some data.
}

// Add our event listeners.
window.addEventListener('load', function () {
  // Login via form, sanitize input.
  const loginElement = document.getElementById('login')
  loginElement.addEventListener('submit', function (event) {
    if (debug) console.log(event)
    event.preventDefault()

    const triggerElement = event.explicitOriginalTarget
    if (triggerElement.id === debugButtonId) {
      login()
    } else {
      const user = document.getElementById('username')
      const password = document.getElementById('password')
      login(user, password)
    }
  })
})

// Main login function
function login (user = debugUser, password = debugPassword) {
  const headers = new Headers()
  headers.append('content-type', 'application/x-www-form-urlencoded')

  fetch(authUrl, {
    method: 'POST',
    headers: headers,
    body: 'username=' + user + '&password=' + password
  })
    .then(response => {
      response.text()
        .then(token => {
          if (debug) console.log(token)
          showFeedback('Login successful')
          // Get our data with the token we just received.
          getData(token)
        })
    })
    .catch(error => {
      console.error(error)
      showFeedback('Login unsuccessful', 'error')
    })
}

// curl -X GET \
//   https://demo.factry.io/hiringchallenge/historian/collectors \
//   -H 'Authorization: Bearer mysecretJWTtoken'

function getData (token) {
  const headers = new Headers()
  headers.append('Authorization', 'Bearer ' + token)

  fetch(dataUrl, {
    method: 'GET',
    headers: headers
  })
    .then(response => console.log(response))
    .catch(error => console.error(error))
}

// Post data
// curl -X POST \
//    https://demo.factry.io/hiringchallenge/historian/collectors \
//   -H 'Authorization: Bearer mytoken \
//   -H 'Content-Type: application/json' \
//   -d '{"Name":"NewCollector","Description":"NewDescription"}'

function showFeedback (message, type = 'success') {
  const messagesElement = document.getElementById('messages')

  // Clean up our classes before adding new ones to be safe.
  messagesElement.classList.remove('messages-success', 'messages-error')

  switch (type) {
    case 'error':
      messagesElement.classList.add('messages-error')
      break
    default:
      messagesElement.classList.add('messages-success')
      break
  }
}
