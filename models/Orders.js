const Datastore = require("nedb-promise");
const User = require("./Users");
const orders = new Datastore({ filename: "./data/orders.db" , autoload : true });


module.exports = {
      // find the orders
  async all() {
    return await orders.find({});
  },
    // find one order 
  async getOne(userId) {
    return await orders.findOne({ owner: userId });
  },
    // create new order
  async create(body, userId) {
    const order = {
      owner: userId,
      timeStamp: Date.now(),
      status: "inProcess",
      items: body.items
    };
         //  lägga till order in array
    const newOrder = await orders.insert(order);
    await User.payment(userId, body.payment);
    await User.order(userId, newOrder._id);
    return newOrder;
  }
};
