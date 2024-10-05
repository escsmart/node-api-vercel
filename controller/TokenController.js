const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const request = require("request");
const { default: serverConfig } = require("../serverConfig");

module.exports = {
  get: async (req, res) => {
    try {
      const result = await prisma.config.findFirst({
        select: {
          value: true,
          value2: true,
        },
        where: {
          name: "expressToken",
          status: "used",
        },
      });
      if (result != null) {
        return res.send({ message: "success", result: result });
      } else {
        return res.ststus(401).send();
      }
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  update: async (req, res) => {
    var options = {
      method: "POST",
      url: "https://app.easyparcel.biz/api/v1/auth/token",
      headers: serverConfig.headerParcel,
      body: JSON.stringify({
        clientId: "0ee4ccf3940eaa05e5ac0539908ab306",
        clientSecret:
          "e2a841e24ea5ebfaeea6ca301335f96018815f45fb9e36f6099ab229c90427b4",
      }),
    };
    request(options, (err, resp) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        pData = JSON.parse(resp.body);
        return res.send({ message: "success", result: pData });
      }
    });
  },
  updateDB: async (req, res) => {
    try {
      const result = await prisma.config.update({
        data: req.body,
        where: {
          id: 1,
        },
      });
      return res.send({message: "success", result: result });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
};
