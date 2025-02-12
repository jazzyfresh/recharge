# Recharge

A demo app for displaying electric vehicle charging stations

## UI

### Charger Dashboard
<img width="1900" alt="Screenshot 2025-02-10 at 06 37 19" src="https://github.com/user-attachments/assets/f54d146b-eb15-4d07-b43d-5b3ad184aae1" />

* address search bar
* search queries fuel station api to get chargers
* chargers become markers on map and list of charger detail

### Responsive layout for mobile screens
<img width="534" alt="Screenshot 2025-02-10 at 06 45 09" src="https://github.com/user-attachments/assets/341d29ab-abe6-460c-a5dd-39ab2fc754ec" />

### Drop down feedback form
#### feedback button in charger detail card
<img width="435" alt="Screenshot 2025-02-10 at 06 46 24" src="https://github.com/user-attachments/assets/75a29fde-81fd-4ca6-82c8-dd39e104c3cb" />

#### clicking feedback button expands into feedback form
<img width="433" alt="Screenshot 2025-02-10 at 14 46 15" src="https://github.com/user-attachments/assets/8fd56196-7220-4f4f-a9ff-5be8fba9e024" />

#### form validation with zod
<img width="427" alt="Screenshot 2025-02-10 at 15 12 56" src="https://github.com/user-attachments/assets/2da02546-211f-4b7a-8234-4a705a2fb7cd" />

#### action fulfilled successfully means http post succeeded
<img width="511" alt="Screenshot 2025-02-10 at 14 41 05" src="https://github.com/user-attachments/assets/ff57a4be-3789-4700-87a8-5572452d907d" />

#### see the newly created document in the mongodb collection
<img width="629" alt="Screenshot 2025-02-10 at 14 41 30" src="https://github.com/user-attachments/assets/317f9687-53fd-4846-adbe-1c13a691b71d" />


### Favorites star
<img width="422" alt="Screenshot 2025-02-10 at 06 47 28" src="https://github.com/user-attachments/assets/b6106370-c31c-4909-8add-84f6fa3bcdd6" />
<img width="428" alt="Screenshot 2025-02-10 at 06 47 36" src="https://github.com/user-attachments/assets/8efe3b05-65aa-45f6-8d91-23c512829bfc" />





## API

/users [GET, POST]
/users/:id [GET, PUT, DELETE]
/favorites [GET, POST]
/favorites/:id [GET, DELETE]
/feedback [GET, POST]
/feedback/:id [GET, PUT, DELETE]

### Simple CRUD
<img width="1147" alt="Screenshot 2025-02-10 at 05 40 00" src="https://github.com/user-attachments/assets/ea6b3d4c-4bfa-49bb-829a-2362e859ef8c" /> 

### Schema Validation
<img width="1151" alt="Screenshot 2025-02-10 at 05 43 51" src="https://github.com/user-attachments/assets/3c3b67e1-da77-4d16-b064-db04f3dde62c" />

### Indexes
#### Unique Index on User Fields
<img width="1150" alt="Screenshot 2025-02-10 at 05 45 09" src="https://github.com/user-attachments/assets/045cff71-fa01-494d-b20b-e3e3a646ed86" />

#### Unique Compound Index on Favorites
<img width="1149" alt="Screenshot 2025-02-10 at 15 38 31" src="https://github.com/user-attachments/assets/243efcc3-452e-433a-9874-1fc93ea6cc6f" />


## Next Steps
* [ ] Better styling/responsiveness for mobile devices
  - TailwindCSS has been a force-multiplier for rapidly prototyping designs
* [ ] Implement better testing with Vitest
  - Jest is the industry standard, but only has experimental support for ES Modules
* [ ] Implement JWT authentication with Passport.js
  - Considered using a completely managed auth service like Clerk or Auth0, which would have been fine for my use case, but I wanted to implement JWT authentication flow from first principles
