'use strict';
var fs = require('fs');
var csv = require('dsv').csv;

// Process dt_partic messages
var p_map = {};
csv.parseRows(
    fs.readFileSync('data/raw/dt_partic.csv', 'utf-8'),
    function (d, i) {
        p_map[d[2]] = d;
    }
);

// Get rid of keys
var p_rowparsed = [];
p_rowparsed.push(['timestamp','index','code','firstName','lastName','gender',
'birthDate','weight','height','organisation','role','active','accreditation',
'tournaments']);
for (var code in p_map) {
    p_rowparsed.push(p_map[code]);
}
var pf = csv.formatRows(p_rowparsed);
//fs.writeFileSync('allparticipants.csv', pf);

// Filter participants
var p = csv.parse(pf, function (d, i) {
    if (d.role === 'AA01' && d.active === 'true' &&
        d.accreditation === 'ACCRED') {
        return {
            code:         d.code,
            firstName:    d.firstName,
            lastName:     d.lastName,
            gender:       d.gender,
            birthDate:    d.birthDate,
            weight:       d.weight,
            height:       d.height,
            orgatisation: d.organisation,
            tournaments:  d.tournaments.split(':')
        };
    }
});
//fs.writeFileSync('players.csv', csv.format(p));
fs.writeFileSync('data/players.json', JSON.stringify(p, null, 4));
