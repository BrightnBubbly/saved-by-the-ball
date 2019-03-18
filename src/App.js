import React, { Component } from 'react';
import './App.css';
import sphero from "sphero";
import keypress from "keypress";

// init
const orb = sphero("/dev/tty.Sphero-ORG-AMP-SPP"); // change BLE address accordingly (get address by running ls -a /dev | grep tty.Sphero)

const stop = orb.roll.bind(orb, 0, 0);
const roll = orb.roll.bind(orb, 100);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      upButton: false,
      downButton: false,
      leftButton: false,
      rightButton: false,
    };
  }

  async init() {
    try {
      process.stdin.resume();
      await orb.connect(this.listen);

      // print system/battery state
      console.log(await this.battery());
    } catch (error) {
      console.log("::CONNECTION ERROR", error);
    }
  }

  async battery() {
    try {
      const state = await orb.getPowerState();
      const stats = {
        system: state.batteryState, // high-level state of the power system
        voltage: state.batteryVoltage + ' * 100 volts', // current battery voltage, scaled in 100ths of a volt
        charges: state.chargeCount + ' lifetime charges', // number of total charges to date
        lastCharged: (state.secondsSinceCharge / 60) + ' min ago'// minues since last charge
      };
      return stats;
    } catch (error) {
      console.log("BATTERY ERROR:", error);
    }
  };

  async whatsUp() {
    this.state = {upButton : true}
    roll(0);
    orb.color(0xe551ca);
    console.log("UP");
  };

  async getDown() {
    this.state = {downButton : true}
    roll(180);
    orb.color(0x03cae3);
    console.log("DOWN");
  };

  async rightOn() {
    this.state = {rightButton : true}
    roll(90);
    orb.color(0xa88ff4);
    console.log("RIGHT");
  };

  async getOverIt() {
    this.state = {leftButton : true}
    roll(270);
    orb.color(0xf1f798);
    console.log("LEFT");
  };


  async handle(ch, key) {
    try {

      if (key.ctrl && key.name === "c") {
        process.stdin.pause();
        process.exit(0);
      }

      if (key.name === "e") {
        orb.startCalibration();
        setTimeout(function() {
          orb.finishCalibration();
        }, 5000);
      }

      if (key.name === "up") {
        this.whatsUp();
      }

      if (key.name === "down") {
        this.getDown();
      }

      if (key.name === "left") {
        this.getOverIt();
      }

      if (key.name === "right") {
        this.rightOn();
      }

      if (key.name === "space") {
        stop();
      }

    } catch (error) {
      console.log("HANDLE ERROR", error);

      process.stdin.pause();
      process.exit(0);
    }
  }

  async listen() {
    try {
      keypress(process.stdin);
      process.stdin.on("keypress", this.handle);

      console.log("Starting to listen for arrow key presses...");

      process.stdin.setRawMode(true);
      process.stdin.resume();
    } catch (error) {
      console.log("::LISTEN ERROR", error);
    }
  }

  letsRoll = async (angle) => {

    console.log(typeof angle);
    console.log(angle);

    try {
      const roll = orb.roll.bind(orb, 100);
      roll(angle)
    } catch (error) {
      alert("Please enter a number between 0 and 360: ", error);

      process.stdin.pause();
      process.exit(0);
    }
  }

  render() {
    this.init();

    return (
      <div className="App">
        <header className="App-header">
          <h1>
            Saved by the Ball
          </h1>
        </header>
        <body>
          <div class= "content">
            <h2>
              Stats
            </h2>
            <p>
            </p>
          </div>
          <div class= "content">
            <h2>
              Make SPRK Roll Forward!
            </h2>
            <button>Roll</button>
          </div>
          <div class= "content">
            <h2>
              Make SPRK Roll Backward!
            </h2>
            <button>Roll</button>
          </div>
          <div class= "content">
            <h2>
              Make SPRK Roll to the Left!
            </h2>
            <button>Roll</button>
          </div>
          <div class= "content">
            <h2>
              Make SPRK Roll to the Right!
            </h2>
            <button>Roll</button>
          </div>
          <div class= "content">
            <h2>
              Which Direction Do You Want SPRK to Roll?
            </h2>
            <ul>
              <li>Please insert angle.</li>
              <li>An angle of 0 makes the SPRK roll forward and 180 makes the SPRK roll backward.</li>
              <li>An angle of 90 makes the SPRK roll right and 270 makes it roll left.</li>
              <li>Angles between any of these numbers will cause the SPRK to roll at an angle.</li>
            </ul>
            <input id="angle" placeholder="Enter a value between 0 and 360"/>
            <button>Roll</button>
          </div>
        </body>
        <footer>
          <p>
          Created by <a href="https://github.com/BrightnBubbly/">Kelsey</a>!
          </p>
        </footer>
      </div>

    );
  }
}

export default App;
