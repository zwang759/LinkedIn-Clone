const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const redisClient = redis.createClient({host: REDIS_HOST, port: REDIS_PORT});

redisClient.on("connect", () => {
  console.log(`connected to redis`);
});
redisClient.on("error", err => {
  console.log(`Error: ${err}`);
});

redisClient.get = util.promisify(redisClient.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
  this.enableCache = true;
  this.hashKey = JSON.stringify(options.key || "default");
  return this;
};

mongoose.Query.prototype.exec = async function() {
  if (!this.enableCache) {
    console.log("Data Source: Database");
    return await exec.apply(this, arguments);
  }

  const key = this.hashKey;

  const cachedValue = await redisClient.get(key);

  if (cachedValue) {
    const parsedCache = JSON.parse(cachedValue);

    console.log("Data Source: Cache");

    return parsedCache;
  }
  try {
    const result = await exec.apply(this, arguments);

    // Prevent cache penetration by setting non-exist key value as null with short expire time
    if (!result) {
      await redisClient.set(key, "", "EX", 20);
    } else {
      // prevent cache avalanche by setting random expire time
      await redisClient.set(key, JSON.stringify(result), "EX", Math.floor(60 * Math.random()));
    }
    console.log("Data Source: Database");
    return result;
  } catch (err) {
    console.error(err.message);
    redisClient.set(key, "", "EX", 20);
  }
};

const clearCache = (hashKey) => {
  console.log("Cache cleaned");
  redisClient.del(hashKey);
};

module.exports = {clearCache, redisClient};