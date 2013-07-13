'use scrict';
var dsv = require('dsv');
var fs = require('fs');

var s = [];
var t = [];
var p = [];
var f = [];

var s_map = {};
dsv.tsv.parseRows(
    fs.readFileSync('data/raw/14_discipline.txt', 'utf-8'), 
    function(d, i) {
        // Filter: nonsport = 'N' and scheduled = 'Y'
        if (d[3] === 'N' && d[6] === 'Y') {
            s.push({code: d[0], name: d[1]});
            s_map[d[0]] = d[1];
        }
    }
);
dsv.tsv.parseRows(
    fs.readFileSync('data/raw/23_event.txt', 'utf-8'),
    function(d, i) {
        // Filter: gender != '0' and event != '000'
        if (i === 0) {
            return;
        }
        if (d[1] !== '0' && d[2] !== '000') {
            t.push({code: d[0]+d[1]+d[2], name: d[4]});
        }
    }
);
dsv.tsv.parseRows(
    fs.readFileSync('data/raw/25_phase.txt', 'utf-8'),
    function(d, i) {
        // Filter: phasetype = 3 (competition)
        if (d[4] === '3') {
            p.push({code: d[0]+d[1]+d[2]+d[3], name: d[5]});
        }
    }
);
dsv.tsv.parseRows(
    fs.readFileSync('data/raw/28_eventunit.txt', 'utf-8'),
    function(d, i) {
        // Filter: gender != '0', event != '000',
        // phase != 'N', unit != '00', scheduled = 'Y'
        if (d[1]!=='0' && d[2]!=='000' && d[3]!=='N' && d[4]!=='00' &&
            d[5]==='Y') {
            f.push({
                code: d[0]+d[1]+d[2]+d[3]+d[4],
                name: d[7], date: new Date(),
                type: d[11]
            });
        }
    }
);

console.log(s.length + ' sports');
console.log(t.length + ' tournaments');
console.log(p.length + ' phases');
console.log(f.length + ' fixtures');

// Add phases to tournaments
for (var i=0; i<t.length; i++) {
    t[i].sport = s_map[t[i].code.slice(0,2)];
    t[i].phases = [];
    t[i].description = "Dominus Quixotus senex erat cui placebat libros de " +
    "equitibus legere.";
    t[i].location = "London, UK";
    t[i].startDate = "2013-08-01";
    for (var j=0; j<p.length; j++) {
        if (t[i].code === p[j].code.slice(0,6)) {
            t[i]['phases'].push(p[j]);
        }
    }
}

// Add fixtures to phases
for (var i=0; i<t.length; i++) {
    for (var j=0; j<t[i].phases.length; j++) {
        t[i].phases[j].fixtures = [];
        for (var k=0; k<f.length; k++) {
            if (t[i].phases[j].code === f[k].code.slice(0,7)) {
                t[i].phases[j].fixtures.push(f[k]);
            }
        }
    }
}

// Add tournament type
var types = {
    'ATH': 'Individuals',
    'COUP': 'Couples',
    'NOC': 'Teams',
    'TEAM': 'Teams',
    'HATH': 'Individuals head to head',
    'HCOUP': 'Couples head to head',
    'HNOC': 'Teams head to head',
    'HTEAM': 'Teams head to head'
};
for (var i=0; i<t.length; i++) {
    for (var j=0; j<t[i].phases.length; j++) {
        if (t[i].phases[j].fixtures[0]) {
            if (t[i].type) {
                break;
            }
            var ftype;
            for (var k=0; k<t[i].phases[j].fixtures.length; k++) {
                // Look for the first fixture != 'NONE'
                ftype = t[i].phases[j].fixtures[k].type;
                if (ftype !== 'NONE') {
                    t[i].type = types[ftype];
                    break;
                }
            }
        }
    }
}

fs.writeFile('data/sports.json', JSON.stringify(s,null,4));
fs.writeFile('data/tournaments.json', JSON.stringify(t,null,4));
//fs.writeFile('data/phases.json', JSON.stringify(p,null,4));
//fs.writeFile('data/fixtures.json', JSON.stringify(f,null,4));
