/* global fetch, Headers */

// Define important constants and variables
const debug = true
const debugUser = 'lumi'
const debugPassword = 'lumi@factry87634'

const authUrl = 'https://demo.factry.io/hiringchallenge/auth/login'
const dataUrl = 'https://demo.factry.io/hiringchallenge/historian/collectors'

// Script to run for easy testing
if (debug) {
  login()
}

// Login via form, sanitize input and/or provide feedback.
function loginViaForm () {

}

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
          // Get our data with the token we just received.
          getData(token)
        })
    })
    .catch(error => console.error(error))
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
