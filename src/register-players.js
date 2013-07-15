'use scrict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Connection to DB */
mongoose.connect('mongodb://localhost/stadion');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Oops! Connection error:'));
db.once('open', function cb() {
    console.log('Woohoo! Connected to DB');
    var dummy = Player.find(function (err, players) {
        if (err) {
            throw err;
        } else {
            registerPlayers(players);
        }
    });
});

/* Register each player on tournaments */
function registerPlayers(players) {
    for (var i=0; i<players.length; i++) {
        for (var t=0; t<players[i].tournaments.length; t++) {
            // Some players are not registered to any event
            if (!players[i].tournaments[t]) {
                break;
            }
            // Update tournament with the new player
            Tournament.update(
                {code: players[i].tournaments[t]},
                {$push: {players: players[i]._id}},
                function (err, num, raw) {
                    if (err) {
                        throw err;
                    }
                }
            );
        }
    }
}

/* Player Schema */
var playerSchema = new Schema({
    code: String,
    firstName: String,
    lastName: String,
    gender: String,
    birthDate: Date,
    weight: Number,
    height: Number,
    organisation: String,
    tournaments: [String]
}, {collection: 'players'});
var Player = mongoose.model('Player', playerSchema);

/* Tournament Schema */
var tournamentSchema = new Schema({
    code: String,
    name: String,
    sport: String,
    phases: Schema.Types.Mixed,
    description: String,
    location: String,
    startDate: Date,
    type: String,
    players: [{type: Schema.Types.ObjectId, ref: 'Player'}]
}, {collection: 'tournaments'});
var Tournament = mongoose.model('Tournament', tournamentSchema);

/* Some checks 

db.tournaments.find().size()
db.tournaments.find({players: {$exists: false}}).size()
db.tournaments.find({players: {$exists: false}}, {code: 1, _id: 0})
db.tournaments.find({phases: {$exists: true, $size: 0}}, {code: 1, _id: 0})
db.tournaments.find({sport: "Cycling Mountain Bike"}).pretty() 
db.players.find({tournaments: {$exists: true, $size: 1, $in: [""]}}).size()

*/
