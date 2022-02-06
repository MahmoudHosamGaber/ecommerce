var createError = require("http-errors");
var express = require("express");
var fs = require("fs");
var path = require("path");
var alert = require("alert");
const session = require("express-session");
var { createHash } = require("crypto");

const { errorMonitor } = require("events");
const { render } = require("ejs");
var app = express();
var currentUser = null;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", function (req, res) {
  if (req.session.currentUser != null) {
    res.render("home");
  } else {
    res.render("login", { flag: "false" });
  }
});
app.get("/login", function (req, res) {
  if (req.session.currentUser != null) {
    res.render("home");
  } else {
    res.render("login", { flag: "true" });
  }
});
app.get("/registration", function (req, res) {
  res.render("registration", { flag: "0" });
});
app.get("/register", function (req, res) {
  res.redirect("/registration");
  res.render("registration", { flag: "0" });
});

app.get("/books", function (req, res) {
  if (req.session.currentUser == null) {
    res.redirect("/");
    res.render("login", { flag: "login" });
  } else res.render("books");
});

app.get("/boxing", function (req, res) {
  if (req.session.currentUser == null) {
    res.redirect("/");
    res.render("login", { flag: "login" });
  } else res.render("boxing", { flag: "0" });
});

app.get("/cart", async function (req, res) {
  // res.render("cart", { CART: cartarray, flag: "false" });
  if (req.session.currentUser == null) {
    res.redirect("/");
  } else {
    var { MongoClient } = require("mongodb");
    var uri =
      "mongodb+srv://Admin:Admin@cluster0.eohrb.mongodb.net/MyDB?retryWrites=true&w=majority";
    var client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    var array = await client.db("MyDB").collection("Cart").find().toArray();
    var cartarray = new Array();
    array.forEach((element) => {
      if (element.username == req.session.currentUser.username) {
        cartarray.push(element.product);
      }
    });
    res.render("cart", { CART: cartarray, flag: "false" });
  }
});

app.get("/galaxy", function (req, res) {
  if (req.session.currentUser == null) {
    res.redirect("/");
    res.render("login", { flag: "login" });
  } else res.render("galaxy", { flag: "0" });
});
app.get("/home", function (req, res) {
  if (req.session.currentUser == null) {
    res.redirect("/");
    res.render("login", { flag: "login" });
  } else res.render("home");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/iphone", function (req, res) {
  if (req.session.currentUser == null) {
    res.redirect("/");
    res.render("login", { flag: "login" });
  } else res.render("iphone", { flag: "0" });
});

app.get("/leaves", function (req, res) {
  if (req.session.currentUser == null) {
    res.redirect("/");
    res.render("login", { flag: "login" });
  } else res.render("leaves", { flag: "0" });
});

app.get("/phones", function (req, res) {
  if (req.session.currentUser == null) {
    res.redirect("/");
    res.render("login", { flag: "login" });
  } else res.render("phones");
});

app.get("/sports", function (req, res) {
  if (req.session.currentUser == null) {
    res.redirect("/");
    res.render("login", { flag: "login" });
  } else res.render("sports");
});

app.get("/sun", function (req, res) {
  if (req.session.currentUser == null) {
    res.redirect("/");
    res.render("login", { flag: "login" });
  } else res.render("sun", { flag: "0" });
});

app.get("/tennis", function (req, res) {
  if (req.session.currentUser == null) {
    res.redirect("/");
    res.render("login", { flag: "login" });
  } else res.render("tennis", { flag: "0" });
});

app.get("/AddToCartSun", async function (req, res) {
  var { MongoClient } = require("mongodb");
  var uri =
    "mongodb+srv://Admin:Admin@cluster0.eohrb.mongodb.net/MyDB?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  var cartItem = { username: req.session.currentUser.username, product: "sun" };

  var array = await client.db("MyDB").collection("Cart").find().toArray();
  var flag = true;
  array.forEach((element) => {
    if (
      element.username == cartItem.username &&
      element.product == cartItem.product
    ) {
      res.render("sun", { flag: "fail" });
      flag = false;
    }
  });
  if (flag == true) {
    await client.db("MyDB").collection("Cart").insertOne(cartItem);
    res.render("sun", { flag: "success" });
  }
  client.close();
});

app.get("/AddToCartBoxing", async function (req, res) {
  var { MongoClient } = require("mongodb");
  var uri =
    "mongodb+srv://Admin:Admin@cluster0.eohrb.mongodb.net/MyDB?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  var cartItem = {
    username: req.session.currentUser.username,
    product: "boxing",
  };
  var array = await client.db("MyDB").collection("Cart").find().toArray();
  var flag = true;
  array.forEach((element) => {
    if (
      element.username == cartItem.username &&
      element.product == cartItem.product
    ) {
      res.render("boxing", { flag: "fail" });
      flag = false;
    }
  });
  if (flag == true) {
    await client.db("MyDB").collection("Cart").insertOne(cartItem);
    res.render("boxing", { flag: "success" });
  }
  client.close();
});

app.get("/AddToCartIphone", async function (req, res) {
  var { MongoClient } = require("mongodb");
  var uri =
    "mongodb+srv://Admin:Admin@cluster0.eohrb.mongodb.net/MyDB?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  var cartItem = {
    username: req.session.currentUser.username,
    product: "iphone",
  };
  var array = await client.db("MyDB").collection("Cart").find().toArray();
  var flag = true;
  array.forEach((element) => {
    if (
      element.username == cartItem.username &&
      element.product == cartItem.product
    ) {
      res.render("iphone", { flag: "fail" });
      flag = false;
    }
  });
  if (flag == true) {
    await client.db("MyDB").collection("Cart").insertOne(cartItem);
    res.render("iphone", { flag: "success" });
  }
  client.close();
});

app.get("/AddToCartLeaves", async function (req, res) {
  var { MongoClient } = require("mongodb");
  var uri =
    "mongodb+srv://Admin:Admin@cluster0.eohrb.mongodb.net/MyDB?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  var cartItem = {
    username: req.session.currentUser.username,
    product: "leaves",
  };
  var array = await client.db("MyDB").collection("Cart").find().toArray();
  var flag = true;
  array.forEach((element) => {
    if (
      element.username == cartItem.username &&
      element.product == cartItem.product
    ) {
      res.render("leaves", { flag: "fail" });
      flag = false;
    }
  });
  if (flag == true) {
    await client.db("MyDB").collection("Cart").insertOne(cartItem);
    res.render("leaves", { flag: "success" });
  }
  client.close();
});

app.get("/AddToCartTennis", async function (req, res) {
  var { MongoClient } = require("mongodb");
  var uri =
    "mongodb+srv://Admin:Admin@cluster0.eohrb.mongodb.net/MyDB?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  var cartItem = {
    username: req.session.currentUser.username,
    product: "tennis",
  };
  var array = await client.db("MyDB").collection("Cart").find().toArray();
  var flag = true;
  array.forEach((element) => {
    if (
      element.username == cartItem.username &&
      element.product == cartItem.product
    ) {
      res.render("tennis", { flag: "fail" });
      flag = false;
    }
  });
  if (flag == true) {
    await client.db("MyDB").collection("Cart").insertOne(cartItem);
    res.render("tennis", { flag: "success" });
  }
  client.close();
});

app.get("/AddToCartGalaxy", async function (req, res) {
  var { MongoClient } = require("mongodb");
  var uri =
    "mongodb+srv://Admin:Admin@cluster0.eohrb.mongodb.net/MyDB?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  var cartItem = {
    username: req.session.currentUser.username,
    product: "galaxy",
  };
  var array = await client.db("MyDB").collection("Cart").find().toArray();
  var flag = true;
  array.forEach((element) => {
    if (
      element.username == cartItem.username &&
      element.product == cartItem.product
    ) {
      res.render("galaxy", { flag: "fail" });
      flag = false;
    }
  });
  if (flag == true) {
    await client.db("MyDB").collection("Cart").insertOne(cartItem);
    res.render("galaxy", { flag: "success" });
  }
  client.close();
});

app.post("/register", async function (req, res) {
  var { MongoClient } = require("mongodb");
  var uri =
    "mongodb+srv://Admin:Admin@cluster0.eohrb.mongodb.net/MyDB?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  var pass = req.body.password;
  var array = await client.db("MyDB").collection("Users").find().toArray();
  var user = {
    username: req.body.username,
    password: createHash("sha256").update(pass).digest("hex"),
  };
  var flag = true;
  for (let i = 0; i < array.length; i++) {
    if (array[i].username === user.username) {
      flag = false;
    }
  }
  if (flag) {
    if (user.username == "") {
      res.render("registration", { flag: "invalid" });
      return;
    }
    await client.db("MyDB").collection("Users").insertOne(user);
    req.session.currentUser = user;
    res.render("home");
  } else {
    res.render("registration", { flag: "taken" });
  }
  client.close();
});

app.post("/", async function (req, res) {
  var { MongoClient } = require("mongodb");
  var uri =
    "mongodb+srv://Admin:Admin@cluster0.eohrb.mongodb.net/MyDB?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  var array = await client.db("MyDB").collection("Users").find().toArray();
  var pass = req.body.password;
  var user = {
    username: req.body.username,
    password: createHash("sha256").update(pass).digest("hex"),
  };
  for (let i = 0; i < array.length; i++) {
    if (
      array[i].username === user.username &&
      array[i].password === user.password
    ) {
      req.session.currentUser = array[i];
      res.render("home");
      return;
    }
  }
  res.render("login", { flag: "wrong" });
});

app.post("/login", async function (req, res) {
  var { MongoClient } = require("mongodb");
  var uri =
    "mongodb+srv://Admin:Admin@cluster0.eohrb.mongodb.net/MyDB?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  var array = await client.db("MyDB").collection("Users").find().toArray();
  var pass = req.body.password;
  var user = {
    username: req.body.username,
    password: createHash("sha256").update(pass).digest("hex"),
  };
  for (let i = 0; i < array.length; i++) {
    if (
      array[i].username === user.username &&
      array[i].password === user.password
    ) {
      req.session.currentUser = array[i];
      res.render("home");
      return;
    }
  }
  res.render("login", { flag: "wrong" });
});

app.post("/search", async (req, res) => {
  var { MongoClient } = require("mongodb");
  var uri =
    "mongodb+srv://Admin:Admin@cluster0.eohrb.mongodb.net/MyDB?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  var arr = await client.db("MyDB").collection("Items").find().toArray();
  var x = req.body.Search;
  var items = [];
  arr.forEach((e) => {
    if (e.name.toLocaleLowerCase().includes(x.toLocaleLowerCase()))
      items.push(e.name);
  });

  res.render("searchresults", { data: items });
});
if (process.env.PORT) {
  app.listen(process.env.PORT, function () {
    console.log("Server Started");
  });
} else {
  app.listen(3000, function () {
    console.log("Server Started on port 3000");
  });
}

module.exports = app;
