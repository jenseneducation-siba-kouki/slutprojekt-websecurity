const Datastore = require("nedb-promise");
require("dotenv").config();

const products = new Datastore({filename: "./data/products.db" ,autoload : true });


const productsJson = require("../products.json");
products.insert(productsJson);

module.exports = {
  async all() {
    return await products.find({});
  },

  async getOne(id) {
    return await products.findOne({ _id: id });
  },

  async create(body) {
    return await products.insert({
      _id: body.id,
      serial: body.serial,
      title: body.title,
      price: body.price,
      shortDesc: body.shortDesc,
      longDesc: body.longDesc,
      imgFile: body.imgFile
    });
  },

  async update(id, body) {
    const product = await products.findOne({ _id: id });
    product = await products.update(product, { $set: body });
    return product;
  },
  
  async delete(id) {
    return await products.delete({ _id: id });
  },
};
