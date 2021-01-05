# Cinema Apps Deployment

The cinema apps deployment is a simple exercise that illustrates how easy is to deploy a microservice architecture to Kubernetes when using Shipa.

The whole suite is composed by 6 NodeJS applications interacting between each other to provide different sets of data that combined together populate a given UI. Each application talks to a different MongoDB database to retrieve the desired information and exposes REST API endpoints to be consumed by the UI. The UI requests data from different endpoints and offer a simple interface to users to see the information generated in these independent apps.

The whole suite is defined by the following applications:

- Movies <- REST API that connects to a MongoDB database and retrieves a list of movies
- Cinema Catalog <- REST API that connects to a MongoDB database and retrieves a list of movie theaters
- Payment <- REST API that connects to a third-party payment service (Stripe) and retrieves results of payment operations
- Notification <- REST API that receives details of a certain transaction and sends them to user by email (fake emailing process)
- Booking <- REST API that connects to Payment and Notifications to register purchase of certain movies.
- UI (future) <- Web application that talks to all previous services and offers a cinema like e-commerce experience to book movies.

## Databases - MongoDB Service

Some of the previous applications require a database to persist/read information that will be exposed later on by the API; therefore, having access to a MongoDB service is required.

**Shipa Testing MongoDB**
Host: 34.83.231.158
Port: 27017
User: shipa
Pass: shipa2020

Log into the service posted above and create the DBs required for every case

### Movies DB

```sh
mongo -u shipa 34.83.231.158:27017

# Verify if databases already exist
show dbs

# Create your "movies" DB
use movies

# Create a user for the DB
db.createUser(
   {
     user: "shipau",
     pwd: "shipapass"
     roles: [
       { role: 'userAdmin', db: 'movies' },
       { role: 'dbAdmin', db: 'movies' },
       { role: 'readWrite', db: 'movies' }
       ]
   }
)

# Exit the current user and log with the recently created one
exit

mongo -u shipau 34.83.231.158:27017/movies

# Insert some DB records
db.movies.insertMany([
  {"id" : "1", "title" : "Assasins Creed", "runtime" : 115, "format" : "IMAX", "plot" : "Lorem ipsum dolor sit amet", "releaseYear" : 2017, "releaseMonth" : 1, "releaseDay" : 6 }
  {"id" : "2", "title" : "Aliados", "runtime" : 124, "format" : "IMAX", "plot" : "Lorem ipsum dolor sit amet", "releaseYear" : 2017, "releaseMonth" : 1, "releaseDay" : 13 }
  {"id" : "3", "title" : "xXx: Reactivado", "runtime" : 107, "format" : "IMAX", "plot" : "Lorem ipsum dolor sit amet", "releaseYear" : 2017, "releaseMonth" : 1, "releaseDay" : 20 }
  {"id" : "4", "title" : "Resident Evil: Capitulo Final", "runtime" : 107, "format" : "IMAX", "plot" : "Lorem ipsum dolor sit amet", "releaseYear" : 2017, "releaseMonth" : 1, "releaseDay" : 27 }
  {"id" : "5", "title" : "Moana: Un Mar de Aventuras", "runtime" : 114, "format" : "IMAX", "plot" : "Lorem ipsum dolor sit amet", "releaseYear" : 2016, "releaseMonth" : 12, "releaseDay" : 2 }
])
```

### Cinema DB

Required DB only if the endpoint to list movie theaters will be tested.

```sh
mongo -u shipa 34.83.231.158:27017

# Verify if databases already exist
show dbs

# Create your "cinema" DB
use cinema

# Create a user for the DB
db.createUser(
   {
     user: "shipau",
     pwd: "shipapass",
     roles: [
       { role: 'userAdmin', db: 'cinema' },
       { role: 'dbAdmin', db: 'cinema' },
       { role: 'readWrite', db: 'cinema' }
       ]
   }
)

# Exit the current user and log with the recently created one
exit

mongo -u shipau 34.83.231.158:27017/cinema

# Insert some DB records
mongoimport --jsonArray --db cinema --collection docs --file ~/your_path/cinema-catalog-service/src/mock/countries.json
mongoimport --jsonArray --db cinema --collection docs --file ~/your_path/cinema-catalog-service/src/mock/states.json
mongoimport --jsonArray --db cinema --collection docs --file ~/your_path/cinema-catalog-service/src/mock/cities.json
mongoimport --jsonArray --db cinema --collection docs --file ~/your_path/cinema-catalog-service/src/mock/cinemas.json
```

### Booking DB

```sh
mongo -u shipa 34.83.231.158:27017

# Verify if databases already exist
show dbs

# Create your "movies" DB
use booking

# Create a user for the DB
db.createUser(
   {
     user: "shipau",
     pwd: "shipapass",
     roles: [
       { role: 'userAdmin', db: 'booking' },
       { role: 'dbAdmin', db: 'booking' },
       { role: 'readWrite', db: 'booking' }
       ]
   }
)

# Exit the current user and log with the recently created one
exit
```

## Applications

To create/deploy all the applications required by this suite, please follow the instructions placed below.

As a summary, all applications will involve:

- Creating a Shipa application as a shell for your app
- Adding some ENV variables to them to connect them to databases/third-party services (Stripe)
- Deploying the application from a Docker hub image

**Note:** Consider that any of the steps can be achieved by using Shipa's Dashboard directly

### Movies

- Create an application called `movies` (https://hub.docker.com/repository/docker/dechegaray/movies)

```sh
shipa app create movies nodejs --team admin --pool shipa-pool --router traefik

shipa env-set -a movies DB_SERVER=34.83.231.158:27017 DB_USER=shipau DB_PASS=shipapass DB=movies

shipa app deploy -a movies -i dechegaray/movies
```

### Cinema catalog

- Create an application called `cinema` (https://hub.docker.com/repository/docker/dechegaray/cinema)

```sh
shipa app create cinema nodejs --team admin --pool shipa-pool --router traefik

shipa env-set -a cinema DB_SERVER=34.83.231.158:27017 DB_USER=shipau DB_PASS=shipapass DB=cinema

shipa app deploy -a cinema -i dechegaray/cinema
```

### Notifications

- Create an application called `notifications` (https://hub.docker.com/repository/docker/dechegaray/notifications)

```sh
shipa app create notifications nodejs --team admin --pool shipa-pool --router traefik

shipa app deploy -a notifications -i dechegaray/notifications
```

### Payment

- Create an application called `payment` (https://hub.docker.com/repository/docker/dechegaray/payments)

```sh
shipa app create payment nodejs --team admin --pool shipa-pool --router traefik

shipa env-set -a payment DB_SERVER=34.83.231.158:27017 DB_USER=shipau DB_PASS=shipapass DB=booking STRIPE_SECRET=your_secret STRIPE_PUBLIC=your_token

shipa app deploy -a payment -i dechegaray/payments
```

### Booking

- Create an application called `booking` (https://hub.docker.com/repository/docker/dechegaray/booking)

```sh
shipa app create booking nodejs --team admin --pool shipa-pool --router traefik

shipa env-set -a booking DB_SERVER=34.83.231.158:27017 DB_USER=shipau DB_PASS=shipapass DB=booking NOTIFICATION_API_HOST=your_app_endpoint PAYMENT_API_HOST=your_app_endpoint

shipa app deploy -a booking -i dechegaray/booking
```

**Optional:**

To give more security to applications handling sensitive data, you can set your own network policies so `payment` does not allow traffic from any other app different than `booking` as its ingress. If that's the case, you can use Shipa's internal DNS to connect `payment` and `booking` together:

- Re-set your ENV variable and use Shipa's internal DNS as the app endpoint

```sh
shipa env-set -a booking PAYMENT_API_HOST=app-payments.shipa-dev-istio.svc:3000
```

### UI (To be defined...)
