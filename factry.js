/* global fetch, Headers */

// Define important constants and variables.
const debug = true
const debugUser = 'lumi'
const debugPassword = 'lumi@factry87634'
const debugButtonId = 'loginDemo'

const authUrl = 'https://demo.factry.io/hiringchallenge/auth/login'
const dataUrl = 'https://demo.factry.io/hiringchallenge/historian/collectors'
let token = false

let loginElement = false
let dataElement = false
let messagesElement = false
let spinnerElement = false

// Script to run for easy testing.
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
  loginElement = document.getElementById('login')
  loginElement.addEventListener('submit', function (event) {
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

  dataElement = document.getElementsByClassName('section-data')[0]

  messagesElement = document.getElementsByClassName('messages')[0]
  // TODO: These animation resets need some more testing and tweaking.
  messagesElement.addEventListener('animationend', cleanFeedback())
  messagesElement.addEventListener('animationcancel', cleanFeedback())

  // Everything is loaded so hide the spinner.
  spinnerElement = document.getElementsByClassName('spinner')[0]
  spinner('hide')
})

function spinner (show = 'show') {
  if (show === 'show') {
    spinnerElement.classList.remove('hidden')
    spinnerElement.classList.add('visible')
  } else {
    spinnerElement.classList.remove('visible')
    spinnerElement.classList.add('hidden')
  }
}

// Main login function.
function login (user = debugUser, password = debugPassword) {
  spinner('show')

  const headers = new Headers()
  headers.append('content-type', 'application/x-www-form-urlencoded')

  fetch(authUrl, {
    method: 'POST',
    headers: headers,
    body: 'username=' + user + '&password=' + password
  })
    .then(response => {
      const contentType = response.headers.get('content-type')

      if (contentType.includes('text/plain')) {
        // Text means we got a token returned.
        response.text()
          .then(text => {
            token = text
            showFeedback('Login successful')
            // Get our data with the token we just received.
            getData()
          })
      } else if (contentType.includes('application/json')) {
        // JSON means we probably got an invalid login.
        response.json()
          .then(json => {
            spinner('hide')
            showFeedback(json.message || 'Login unsuccessful', 'error')
          })
      } else {
        throw new TypeError('Unexpected data received')
      }
    })
    .catch(error => {
      console.error(error)
      spinner('hide')
      showFeedback('Login unsuccessful', 'error')
    })
}

// Main data fetch function.
function getData () {
  const headers = new Headers()
  headers.append('Authorization', 'Bearer ' + token)

  fetch(dataUrl, {
    method: 'GET',
    headers: headers
  })
    .then(response => {
      if (debug) console.log(response)
      spinner('hide')
      response.json()
        .then(json => {
          if (debug) console.log(json)
          loginElement.parentElement.classList.add('hidden')
          displayData(json)
        })
    })
    .catch(error => console.error(error))
}

function displayData (json) {
  json.forEach(item => {
    if (debug) console.log(item)
    const itemOutput = document.createElement('div')
    itemOutput.id = item.ID
    itemOutput.classList.add('data-item')
    itemOutput.innerHTML = '<h3>' + item.Name + '</h3>' +
    '<div class="item-description">' + item.Description + '</div>' +
    '<div class="item-meta">' +
    '<div class="item-type"><span>Type:</span>' + item.Type + '</div>' +
    '<div class="item-version"><span>Version:</span>' + item.Version + '</div>' +
    '<div class="item-status"><span>Status:</span>' + item.Status + '</div>' +
    '</div>' +
    '<div class="item-dates">' +
    '<div class="item-createdby">' + formatUser(item.CreatedBy) + '</div>' +
    '<div class="item-createat">' + formatDate(item.CreatedAt) + '</div>' +
    '<div class="item-updatedby">' + formatUser(item.UpdatedBy) + '</div>' +
    '<div class="item-updatedat">' + formatDate(item.UpdatedAt) + '</div>' +
    '</div>'

    dataElement.appendChild(itemOutput)
  })
}

// Get user by id or return Unknown.
function formatUser (user) {
  return user || 'Unknown'
}

function formatDate (date) {
  date = new Date(Date.parse(date))
  const dd = date.getDate()
  const mm = date.getMonth()
  const yyyy = date.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

// Main post data function.
function postData () {

}

// Main feedback function towards the user.
function showFeedback (message, type = 'success') {
  messagesElement.innerText = message

  // Clean up our classes before adding new ones to be safe.
  cleanFeedback()
  switch (type) {
    case 'error':
      messagesElement.classList.add('messages-error')
      break
    default:
      messagesElement.classList.add('messages-success')
      break
  }
}

// Remove any classes to reset the animation.
function cleanFeedback () {
  messagesElement.classList.remove('messages-success', 'messages-error')
}
