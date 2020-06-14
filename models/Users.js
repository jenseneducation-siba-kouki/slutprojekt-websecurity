const Datastore = require("nedb-promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const users = new Datastore({filename: "./data/users.db" ,autoload : true });


module.exports = {
  async register(body) {
    if (body.password === body.repeatPassword) {
      const user = await users.findOne({ email: body.email });
      if (user) {
        return false;
      // bcrypt password
      } else {
        const passwordHash = await bcrypt.hash(body.password, 10);
        // create new user
        const newId = {
          name: body.name,
          email: body.email,
          password: passwordHash,
          role: "customer",   // we change the role to change it from customer to admin
          adress: {
            street: body.adress.street,
            zip: body.adress.zip,
            city: body.adress.city
          },

          orderHistory: []
        };
        // insert new user
        return await users.insert(newId);
      }
    } else {
      return false;
    }
  },

  async login(body) {
    // find if the email in the database
    const user = await users.findOne({ email: body.email });
    // if the email is not there in database so it will return false 
    if (!user) {
      return false;
    } else {
      const passwordMatch = await bcrypt.compare(
        body.password,
        user.password
      );
      if (passwordMatch) {
        const payload = {
          email: user.email,
          role: user.role,
          userId: user._id
        };
        const secret = process.env.SECRET;
        const token = jwt.sign(payload, secret);

        const newUser = {
          token: token,
          user: {
            email: user.email,
            name: user.name,
            role: user.role,

            adress: {
              street: user.adress.street,
              city: user.adress.city,
              zip: user.adress.zip
            },
            orderHistory: user.orderHistory
          }
        };
        return newUser;
      } else {
        return false;
      }
    }
  },

  async auth(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
     return false;
    } else {
    try {
      const secret = process.env.SECRET;
      const verify = jwt.verify
      (token.replace("Bearer ", ""),
       secret);
      req.user = verify;
    } catch (error) {
      res.status(404).json({ message: "Error 404" });
    }

    next();
  }
  },
  async payment(userId, payment) {
    await users.update({ _id: userId },
       { $set: { payment: payment } });
  },
  async order(userId, _id) {
    await users.update({ _id: userId },
       { $push: { orderHistory: _id } });
  }
};
