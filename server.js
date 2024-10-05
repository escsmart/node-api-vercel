const express = require("express");
const app = express();
const port = 3002;
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const userController = require("./controller/UserController");
const tokenController = require("./controller/TokenController");
const parcelController = require("./controller/ParcelController");

/* TOKEN */
app.get("/api/token/get", (req, res) => tokenController.get(req, res));
app.get("/api/token/update", (req, res) => tokenController.update(req, res));
app.put("/api/token/updateDB", (req, res) => tokenController.updateDB(req, res));

/* USER */
app.post("/api/user/signIn", (req, res) => userController.signIn(req, res));

/* PARCEL */
app.post("/api/parcel/list", (req, res) => parcelController.list(req, res));
app.post("/api/parcel/checkPrice", (req, res) => parcelController.checkPrice(req, res));
app.post("/api/parcel/createOrder", (req, res) => parcelController.createOrder(req, res));
app.post("/api/parcel/cancel", (req, res) => parcelController.cancel(req, res));
app.get("/api/parcel/postCode/:search", (req, res) => parcelController.postCode(req, res));
app.post("/api/parcel/createOrderToDB", (req, res) => parcelController.createOrderToDB(req, res));

/* LABEL */
app.post("/api/label/getLabel", (req, res) => parcelController.getLabel(req, res));

app.listen(port, () => {
  console.log("Parcel API Start On Port" + port);
});
