import { connect } from "programming-game";
import { config } from "dotenv";
import { UNIT_TYPE } from "programming-game/types";

config({
  path: ".env",
});

const assertEnv = (key: string): string => {
  const val = process.env[key];
  if (!val) {
    throw new Error(
      `Missing env var ${key}, please check your .env file, you can get these values from https://programming-game.com/dashboard`,
    );
  }
  return val;
};

connect({
  credentials: {
    userId: assertEnv("USER_ID"),
    apiKey: assertEnv("API_KEY"),
  },
  onTick(heartbeat) {
    const { player } = heartbeat;

    // if we're dead, respawn
    if (player.hp <= 0) {
      return player.respawn();
    }

    for (const unitId in heartbeat.units) {
      const unit = heartbeat.units[unitId];
      // attack the first monster we see
      if (unit.type === UNIT_TYPE.monster) {
        return player.attack(unit);
      }
    }

    // continue to explore... run to the right
    return player.move({
      x: player.position.x + 10,
      y: 0,
    });
  },
});
