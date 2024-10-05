const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  signIn: async (req, res) => {
    try {
      const result = await prisma.user.findFirst({
        select: {
          id: true,
          name: true,
          member : {
            select : {
              id: true,
              shopType : true
            }
          }
        },
        where: {
          usr: req.body.usr,
          pwd: req.body.pwd,
        },
      });
      if (result != null) {
        const key = process.env.SECRET_KEY;
        const token = jwt.sign(result, key, { expiresIn: "30d" });
        res.send({
          result: result,
          token: token,
        });
      } else {
        return res.status(401).send();
      }
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
};
