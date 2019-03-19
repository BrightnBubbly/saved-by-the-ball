import React, { Component } from 'react';
import './App.css';
import sphero from "sphero";
import keypress from "keypress";
// import serialport from "serialport";

// init
const orb = sphero("/dev/tty.Sphero-ORG-AMP-SPP"); // change BLE address accordingly (get address by running ls -a /dev | grep tty.Sphero)

const stop = orb.roll.bind(orb, 0, 0);
const roll = orb.roll.bind(orb, 100);

class App extends Component {
  constructor(props) {
    super(props);

    this.init = this.init.bind(this);
    // this.whatsUp = this.whatsUp.bind(this);
    // this.getDown = this.getDown.bind(this);
    // this.getOverIt = this.getOverIt.bind(this);
    // this.rightOn = this.rightOn.bind(this);
    this.letsRoll = this.letsRoll.bind(this);

    this.state = {
      batteryStats: [],
      angle: ''
    };
  }

  async init() {
    try {
      // process.stdin.resume();
      await orb.connect(this.listen);

      // print system/battery state
      console.log(await this.battery());
    } catch (error) {
      console.log("::CONNECTION ERROR", error);
      console.log(this.state.batteryStats)
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
      this.setState({ batteryStats: stats });
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

  letsRoll = async (e) => {

    e.preventDefault();

    const angle = document.getElementById("angle").value
    console.log(typeof angle);
    console.log(angle);

    try {
      roll(angle)
    } catch (error) {
      alert("Please enter a number between 0 and 360: ", error);

      process.stdin.pause();
      process.exit(0);
    }
  }

  componentWillMount() {
    this.init()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>
            Saved by the Ball
          </h1>
        </header>
        <body>
          <div className= "content">
            <h2>
              Stats
            </h2>
            {this.state.batteryStats.length > 0 ? this.state.batteryStats.map((stat) => (
              <ul>
                <li>{stat.system}</li>
                <li>{stat.voltage}</li>
                <li>{stat.charges}</li>
                <li>{stat.lastCharged}</li>
              </ul>
            )) : <p>Please connect the SPRK to see battery stats</p>}
          </div>
          <div className= "content">
            <h2>
              Make SPRK Roll Forward!
            </h2>
            <button>Roll</button>
          </div>
          <div className= "content">
            <h2>
              Make SPRK Roll Backward!
            </h2>
            <button>Roll</button>
          </div>
          <div className= "content">
            <h2>
              Make SPRK Roll to the Left!
            </h2>
            <button>Roll</button>
          </div>
          <div className= "content">
            <h2>
              Make SPRK Roll to the Right!
            </h2>
            <button>Roll</button>
          </div>
          <div className= "content">
            <h2>
              Which Direction Do You Want SPRK to Roll?
            </h2>
            <ul>
              <li>Please insert angle.</li>
              <li>An angle of 0 makes the SPRK roll forward and 180 makes the SPRK roll backward.</li>
              <li>An angle of 90 makes the SPRK roll right and 270 makes it roll left.</li>
              <li>Angles between any of these numbers will cause the SPRK to roll at an angle.</li>
            </ul>
            <form onSubmit={this.letsRoll}>
              <input id="angle" placeholder="Enter a value between 0 and 360"/>
              <button type="submit">Roll</button>
            </form>
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
