/* global io, feathers, moment */
// Establish a Socket.io connection
const socket = io()
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers()

client.configure(feathers.socketio(socket))
// Use localStorage to store our login token
client.configure(feathers.authentication())

// Login screen
const loginTemplate = (error) => `<div class="login flex min-h-screen bg-neutral justify-center items-center">
<div class="card w-full max-w-sm bg-base-100 px-4 py-8 shadow-xl">
  <div class="px-4"><i alt="" class="h-32 w-32 block mx-auto i-logos-feathersjs invert"></i>
    <h1 class="text-5xl font-bold text-center my-5 bg-clip-text bg-gradient-to-br">
      Charging Stations
    </h1>
  </div>
  <form class="card-body pt-2">
    ${
      error
        ? `<div class="alert alert-error justify-start">
      <i class="i-feather-alert-triangle"></i>
      <span class="flex-grow">${error.message}</span>
    </div>`
        : ''
    }
    <div class="form-control">
      <label for="email" class="label"><span class="label-text">Email</span></label>
      <input type="text" name="email" placeholder="enter email" class="input input-bordered">
    </div>
    <div class="form-control mt-0">
      <label for="password" class="label"><span class="label-text">Password</span></label>
      <input type="password" name="password" placeholder="enter password" class="input input-bordered">
    </div>
    <div class="form-control mt-6"><button id="login" type="button" class="btn">Login</button></div>
    <div class="form-control mt-6"><button id="signup" type="button" class="btn">Signup</button></div>
    <div class="form-control mt-6"><a href="/oauth/github" id="github" class="btn">Login with GitHub</a></div>
  </form>
</div>
</div>`

// Main feedback view
const feedbackTemplate =
  () => `<div class="drawer drawer-mobile"><input id="drawer-left" type="checkbox" class="drawer-toggle">
  <div class="drawer-content flex flex-col">
    <div class="navbar w-full">
      <div class="navbar-start">
        <label for="drawer-left" class="btn btn-square btn-ghost lg:hidden drawer-button">
          <i class="i-feather-menu text-lg"></i>
        </label>
      </div>
      <div class="navbar-center flex flex-col">
        <p>Charging Station Feedback</p>
        <label for="drawer-right" class="text-xs cursor-pointer">
          <span class="online-count">0</span> User(s) online
        </label>
      </div>
      <div class="navbar-end">
        <div class="tooltip tooltip-left" data-tip="Logout">
        <button type="button" id="logout" class="btn btn-ghost"><i class="i-feather-log-out text-lg"></i></button>
      </div>
      </div>
    </div>
    <div id="map" class="h-full overflow-y-auto px-3" style="height: 600;"></div>
    <div class="form-control w-full py-2 px-3">
      <form class="input-group overflow-hidden" id="find-chargers">
        <input name="location" type="text" placeholder="Find Chargers" class="input input-bordered w-full">
        <button type="submit" class="btn">Search</button>
      </form>
    </div>
    <div id="feedback" class="h-full overflow-y-auto px-3"></div>
    <div class="form-control w-full py-2 px-3">
      <form class="input-group overflow-hidden" id="send-feedback">
        <input name="chargerId" type="text" placeholder="Charger ID" class="input input-bordered w-30">
        <input name="rating" type="text" placeholder="Rating" class="input input-bordered w-30">
        <input name="text" type="text" placeholder="Write feedback" class="input input-bordered w-full">
        <button type="submit" class="btn">Send</button>
      </form>
    </div>
  </div>
  <div class="drawer-side"><label for="drawer-left" class="drawer-overlay"></label>
    <ul class="menu user-list compact p-2 overflow-y-auto w-60 bg-base-300 text-base-content">
      <li class="menu-title"><span>Users</span></li>
    </ul>
  </div>
</div>`

// Helper to safely escape HTML
const escapeHTML = (str) => str.replace(/&/g, '&amp').replace(/</g, '&lt').replace(/>/g, '&gt')

const formatDate = (timestamp) =>
  new Intl.DateTimeFormat('en-US', {
    timeStyle: 'short',
    dateStyle: 'medium'
  }).format(new Date(timestamp))

// Add a new user to the list
const addUser = (user) => {
  const userList = document.querySelector('.user-list')

  if (userList) {
    // Add the user to the list
    userList.innerHTML += `<li class="user">
      <a>
        <div class="avatar indicator">
          <div class="w-6 rounded"><img src="${user.avatar}" alt="${user.email}"></div>
        </div><span>${user.email}</span>
      </a>
    </li>`

    // Update the number of users
    const userCount = document.querySelectorAll('.user-list li.user').length

    document.querySelector('.online-count').innerHTML = userCount
  }
}

// Renders charging feedback to the page
const addFeedback = (review) => {
  // The user that wrote this review (added by the populate-user hook)
  const { user = {} } = review
  const feedback = document.querySelector('#feedback')
  // Escape HTML to prevent XSS attacks
  const text = escapeHTML(review.text)
  const charger = review.chargerId

        {/* <time class="text-xs opacity-50">${formatDate(review.createdAt)}</time> */}
  if (feedback) {
    feedback.innerHTML += `<div class="feedback feedback-start py-2">
      <div class="feedback-image avatar">
        <div class="w-10 rounded-full">
          <img src="${user.avatar}" />
        </div>
      </div>
      <div class="feedback-header pb-1">
        ${user.email}
      </div>
      <div class="feedback-bubble">
        <p>Charger ID: ${charger}</p>
        <p>Review: ${text}</p>
      </div>
    </div>`

    // Always scroll to the bottom of our feedback list
    feedback.scrollTop = feedback.scrollHeight - feedback.clientHeight
  }
}

// Show the login page
const showLogin = () => {
  document.getElementById('app').innerHTML = loginTemplate()
}

// Shows the chat page
const showFeedback = async () => {
  document.getElementById('app').innerHTML = feedbackTemplate()

  // Find the latest 25 reviews. They will come with the newest first
  const reviews = await client.service('feedback').find({
    query: {
      $sort: { createdAt: -1 },
      $limit: 25
    }
  })

  // We want to show the newest message last
  // TODO: show newest feedback first in station feedback modal
  reviews.data.reverse().forEach(addFeedback)

  // Find all users
  const users = await client.service('users').find()

  // Add each user to the list
  users.data.forEach(addUser)

}

const showMap = async () => {
  // Render map with charging station markers
  const DEFAULT_CENTER = [34.052235, -118.243683]
  // [34.01584, -118.49635]
  const MARKER = [34.073814, -118.240784]
  const ZOOM = 13

  window.map = L.map('map').setView(DEFAULT_CENTER, ZOOM)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(window.map)
  window.markers = []
}

const refreshMap = async (chargers) => {
  if (!chargers) {
    chargers = await client.service('chargers').find()
  }
  const ZOOM = 15
  const CENTER = [chargers.latitude, chargers.longitude]
  window.map.setView(CENTER, ZOOM)

  // clear existing markers
  window.markers.forEach((marker) => { window.map.removeLayer(marker) })
  window.markers = []

  // add new markers
  chargers.fuel_stations.forEach((charger) => {
    var marker = L.marker([charger.latitude, charger.longitude])
    window.map.addLayer(marker)
    window.markers.push(marker)
    marker.bindPopup(`<b>${charger.station_name}</b><br>ID: ${charger.id}<br>${charger.station_phone}<br>${charger.ev_network}`).openPopup();
  })
}

// Retrieve email/password object from the login/signup page
const getCredentials = () => {
  const user = {
    email: document.querySelector('[name="email"]').value,
    password: document.querySelector('[name="password"]').value
  }

  return user
}

// Log in either using the given email/password or the token from storage
const login = async (credentials) => {
  try {
    if (!credentials) {
      // Try to authenticate using an existing token
      await client.reAuthenticate()
    } else {
      // Otherwise log in with the `local` strategy using the credentials we got
      await client.authenticate({
        strategy: 'local',
        ...credentials
      })
    }

    // If successful, show the chat page
    showFeedback()
    showMap()
  } catch (error) {
    // If we got an error, show the login page
    showLogin(error)
  }
}
                                                                                                             
const addEventListener = (selector, event, handler) => {
  document.addEventListener(event, async (ev) => {
    if (ev.target.closest(selector)) {
      handler(ev)
    }
  })
}

// "Signup and login" button click handler
addEventListener('#signup', 'click', async () => {
  // For signup, create a new user and then log them in
  const credentials = getCredentials()

  // First create the user
  await client.service('users').create(credentials)
  // If successful log them in
  await login(credentials)
})

// "Login" button click handler
addEventListener('#login', 'click', async () => {
  const user = getCredentials()

  await login(user)
})

// "Logout" button click handler
addEventListener('#logout', 'click', async () => {
  await client.logout()

  document.getElementById('app').innerHTML = loginTemplate()
})

// "Send" feedback form submission handler
addEventListener('#send-feedback', 'submit', async (ev) => {
  // This is the feedback text input field
  const feedbackText = document.querySelector('[name="text"]')
  const feedbackCharger = document.querySelector('[name="chargerId"]')
  const feedbackRating = document.querySelector('[name="rating"]')

  ev.preventDefault()

  // Create a new review and then clear the input field
  await client.service('feedback').create({
    text: feedbackText.value,
    chargerId: Number(feedbackCharger.value),
    rating: Number(feedbackRating.value)
  })

  feedbackText.value = ''
  feedbackCharger.value = ''
  feedbackRating.value = ''
})

// Find chargers form submission handler
addEventListener('#find-chargers', 'submit', async (ev) => {
  // This is the feedback text input field
  const chargerLocation = document.querySelector('[name="location"]')

  ev.preventDefault()

  const chargers = await client.service('chargers').find({
    query: {
      location: chargerLocation.value
    }
  })
  refreshMap(chargers)
})

// Listen to created events and add the new reviews in real-time
client.service('feedback').on('created', addFeedback)

// We will also see when new users get created in real-time
client.service('users').on('created', addUser)

// Call login right away so we can show the chat window
// If the user can already be authenticated
login()

