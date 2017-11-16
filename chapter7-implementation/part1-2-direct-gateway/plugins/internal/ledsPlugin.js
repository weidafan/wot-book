var resources = require('./../../resources/model');

var objPoly = require('object.observe');

var actuator, interval;
var model = resources.pi.actuators.leds['1'];
var pluginName = model.name;
var localParams = {'simulate': false, 'frequency': 2000};

exports.start = function (params) {
  localParams = params;
  //observe(model); //#A

  if (localParams.simulate) {
    simulate();
  } else {
    var value = model.value;
    simulate(value);  }
};

exports.stop = function () {
  if (localParams.simulate) {
    clearInterval(interval);
  } else {
    actuator.unexport();
  }
  console.info('%s plugin stopped!', pluginName);
};


//obj.observe(what);
// function observer(what) {
//   objPoly.observe(what, function (changes) {
//     console.info('Change detected by plugin for %s...', pluginName);
//     switchOnOff(model.value); //#B
//   });
// };


// function observe(what) {
//   Object.observe(what, function (changes) {
//     console.info('Change detected by plugin for %s...', pluginName);
//     switchOnOff(model.value); //#B
//   });
// };

function switchOnOff(value) {

  interval = setInterval(function () {

    if (!localParams.simulate) {
      actuator.write(value === true ? 1 : 0, function () { //#C
        console.info('Changed value of %s to %s', pluginName, value);
      });
    }
    // Switch value on a regular basis
  }, localParams.frequency);
 
};

function connectHardware() {
  interval = setInterval(function () {
  var Gpio = require('onoff').Gpio;
  actuator = new Gpio(model.gpio, 'out'); //#D
  console.info('Hardware %s actuator started!', pluginName);
  actuator.write(value === true ? 1 : 0, function () { //#C
    console.info('Changed value of %s to %s', pluginName, value);
  });
}, localParams.frequency);
};

function simulate(value) {
  interval = setInterval(function () {
    // Switch value on a regular basis
    var Gpio = require('onoff').Gpio;
    actuator = new Gpio(model.gpio, 'out'); //#D
      actuator.write(value === true ? 1 : 0, function () { //#C
        console.info('Changed value of %s to %s', pluginName, value);
      });   
  }, localParams.frequency);
  console.info('Simulated %s actuator started!', pluginName);
};

//#A Observe the model for the LEDs
//#B Listen for model changes, on changes call switchOnOff
//#C Change the LED state by changing the GPIO state
//#D Connect the GPIO in write (output) mode

