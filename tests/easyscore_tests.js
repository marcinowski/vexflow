/**
 * VexFlow - EasyScore Tests
 * Copyright Mohit Muthanna 2010 <mohit@muthanna.com>
 */

Vex.Flow.Test.EasyScore = (function() {
  var EasyScore = {
    Start: function() {
      QUnit.module("EasyScore");
      var VFT = Vex.Flow.Test;
      QUnit.test("Basic", VFT.EasyScore.basic);
      QUnit.test("Accidentals", VFT.EasyScore.accidentals);
      QUnit.test("Durations", VFT.EasyScore.durations);
      QUnit.test("Chords", VFT.EasyScore.chords);
      QUnit.test("Dots", VFT.EasyScore.dots);
      QUnit.test("Options", VFT.EasyScore.options);
      VFT.runTests("Draw Basic", VFT.EasyScore.drawBasicTest);
      VFT.runTests("Draw Beams", VFT.EasyScore.drawBeamsTest);
      VFT.runTests("Draw Tuplets", VFT.EasyScore.drawTupletsTest);
      VFT.runTests("Draw Options", VFT.EasyScore.drawOptionsTest);
    },

    basic: function(assert) {
      var score = new VF.EasyScore();
      var mustPass = ['c4', 'c#4', 'c4/r', 'c#5', 'c3/x', 'c3//x'];
      var mustFail = ['', '()', '7', '(c#4 e5 g6'];

      mustPass.forEach(function(line) { assert.equal(score.parse(line).success, true, line); });
      mustFail.forEach(function(line) { assert.equal(score.parse(line).success, false, line); });
    },

    accidentals: function(assert) {
      var score = new VF.EasyScore();
      var mustPass = ['c3', 'c##3, cb3', 'Cn3', 'f3//x', '(c##3 cbb3 cn3), cb3'];
      var mustFail = ['ct3', 'cd7', '(cq cbb3 cn3), cb3', '(cd7 cbb3 cn3), cb3'];

      mustPass.forEach(function(line) { assert.equal(score.parse(line).success, true, line); });
      mustFail.forEach(function(line) { assert.equal(score.parse(line).success, false, line); });
    },

    durations: function(assert) {
      var score = new VF.EasyScore();
      var mustPass = ['c3/4', 'c##3/w, cb3', 'c##3/w, cb3/q', 'c##3/q, cb3/32', '(c##3 cbb3 cn3), cb3'];
      var mustFail = ['Cn3/]', '/', '(cq cbb3 cn3), cb3', '(cd7 cbb3 cn3), cb3'];

      mustPass.forEach(function(line) { assert.equal(score.parse(line).success, true, line); });
      mustFail.forEach(function(line) { assert.equal(score.parse(line).success, false, line); });
    },

    chords: function(assert) {
      var score = new VF.EasyScore();
      var mustPass = [
        '(c5)', '(c3 e0 g9)',
        '(c##4 cbb4 cn4)/w, (c#5 cb2 a3)/32',
        '(d##4 cbb4 cn4)/w/r, (c#5 cb2 a3)',
        '(c##4 cbb4 cn4)/4, (c#5 cb2 a3)', 
        '(c##4 cbb4 cn4)/x, (c#5 cb2 a3)',
      ];
      var mustFail = ['(c)'];

      mustPass.forEach(function(line) { assert.equal(score.parse(line).success, true, line); });
      mustFail.forEach(function(line) { assert.equal(score.parse(line).success, false, line); });
    },

    dots: function(assert) {
      var score = new VF.EasyScore();
      var mustPass = [
        'c3/4.',
        'c##3/w.., cb3',
        'f##3/s, cb3/q...',
        'c##3/q, cb3/32',
        '(c##3 cbb3 cn3)., cb3',
        '(c5).',
        '(c##4 cbb4 cn4)/w.., (c#5 cb2 a3)/32',
      ];
      var mustFail = ['.', 'c.#', 'c#4./4'];

      mustPass.forEach(function(line) { assert.equal(score.parse(line).success, true, line); });
      mustFail.forEach(function(line) { assert.equal(score.parse(line).success, false, line); }); 
    },

    types: function(assert) {
      var score = new VF.EasyScore();
      var mustPass = [
        'c3/4/x.',
        'c##3//r.., cb3',
        'c##3/x.., cb3',
        'c##3/r.., cb3',
        'd##3/w/s, cb3/q...',
        'c##3/q, cb3/32',
        '(c##3 cbb3 cn3)., cb3',
        '(c5).',
        '(c##4 cbb4 cn4)/w.., (c#5 cb2 a3)/32',
      ];
      var mustFail = ['c4/q/U', '(c##4, cbb4 cn4)/w.., (c#5 cb2 a3)/32'];

      mustPass.forEach(function(line) { assert.equal(score.parse(line).success, true, line); });
      mustFail.forEach(function(line) { assert.equal(score.parse(line).success, false, line); });
    },

    options: function(assert) {
      var score = new VF.EasyScore();
      var mustPass = [
        'c3/4.[foo="bar"]',
        'c##3/w.., cb3[id="blah"]',
        'c##3/q, cb3/32',
        '(c##3 cbb3 cn3).[blah="bod4o"], cb3',
        '(c5)[fooooo="booo"]',
        'c#5[id="foobar"]',
      ];
      var mustFail = ['.[', 'f##3/w[], cb3/q...'];

      mustPass.forEach(function(line) { assert.equal(score.parse(line).success, true, line); });
      mustFail.forEach(function(line) { assert.equal(score.parse(line).success, false, line); });
    },

    drawBasicTest: function(options) {
      var vf = VF.Test.makeFactory(options, 600, 350);
      var score = vf.EasyScore();
      var system = vf.System();

      var voice = score.voice.bind(score);
      var notes = score.notes.bind(score);

      system.addStave({
        voices: [
          voice(notes('(c4 e4 g4)/q, c4/q, c4/q/r, c4/q', {stem: 'down'})),
          voice(notes('c#5/h., c5/q', {stem: 'up'})),
        ]
      }).addClef('treble');

      system.addStave({
        voices: [ voice(notes('c#4/q, cn4/q, bb4/q, d##4/q')) ]
      }).addClef('bass');
      system.addConnector().setType(VF.StaveConnector.type.BRACKET);

      vf.draw();
      expect(0);
    },

    drawBeamsTest: function(options) {
      var vf = VF.Test.makeFactory(options, 600, 250);
      const score = vf.EasyScore();
      const system = vf.System();

      var voice = score.voice.bind(score);
      var notes = score.notes.bind(score);
      var beam = score.beam.bind(score);

      system.addStave({
        voices: [
          voice(notes('(c4 e4 g4)/q, c4/q, c4/q/r, c4/q', {stem: 'down'})),
          voice(notes('c#5/h.', {stem: 'up'}).concat(beam(notes('c5/8, c5/8', {stem: 'up'}))))
      ]}).addClef('treble');

      vf.draw();
      expect(0);
    },

    drawTupletsTest: function(options) {
      var vf = VF.Test.makeFactory(options, 600, 250);
      const score = vf.EasyScore();
      const system = vf.System();

      var voice = score.voice.bind(score);
      var notes = score.notes.bind(score);
      var tuplet = score.tuplet.bind(score);
      var beam = score.beam.bind(score);

      system.addStave({
        voices: [
          voice(
            tuplet(
              notes('(c4 e4 g4)/q, cbb4/q, c4/q', {stem: 'down'}),
              {location: VF.Tuplet.LOCATION_BOTTOM}
            ).concat(notes('c4/h', {stem: 'down'}))
          ),
          voice(
            notes('c#5/h.', {stem: 'up'})
              .concat(tuplet(beam(notes('cb5/8, cn5/8, c5/8', {stem: 'up'}))))
          ),
        ]
      }).addClef('treble');

      vf.draw();
      expect(0);
    },

    drawOptionsTest: function(options) {
      var vf = VF.Test.makeFactory(options, 100, 100);
      const score = vf.EasyScore();
      var notes = score.notes('C#5[id="foobar"]');
      options.assert.equal(notes[0].getAttribute('id'), 'foobar');
      expect(1);
    }
  };

  return EasyScore;  
})();