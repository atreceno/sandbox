'use strict';
var fs = require('fs');
var csv = require('dsv').csv;

// Process dt_partic messages
var p_map = {};
csv.parseRows(
    fs.readFileSync('data/raw/dt_partic_teams.csv', 'utf-8'),
    function (d, i) {
        p_map[d[2]] = d;
    }
);

// Get rid of keys
var p_rowparsed = [];
p_rowparsed.push(['timestamp','index','code','name','gender','organisation',
'active','players','tournaments']);
for (var code in p_map) {
    p_rowparsed.push(p_map[code]);
}
var pf = csv.formatRows(p_rowparsed);
//fs.writeFileSync('allteams.csv', pf);

// Filter teams
var p = csv.parse(pf, function (d, i) {
    if (d.active === 'true') {
        return {
            code:         d.code,
            name:         d.name,
            gender:       d.gender,
            orgatisation: d.organisation,
            players:      d.players.split(':'),
            tournaments:  d.tournaments.split(':')
        };
    }
});
//fs.writeFileSync('data/teams.csv', csv.format(p));
fs.writeFileSync('data/teams.json', JSON.stringify(p, null, 4));
