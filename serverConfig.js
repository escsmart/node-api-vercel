const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export default {
  headerParcel: {
    "Content-Type": "application/json",
    Cookie: "PHPSESSID=0cknfav3b8e7tbmj4q6fukef81",
  },
  headerParcelAut: (token) => {
    return {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      // Authorization: "Bearer " + token.value,
      Cookie: "PHPSESSID=tm5jss1hm88cjq2bc7i0l0i7ao",
    };
  },
  headerParcelAut2: async () => {
    // const tokens = await prisma.config.findFirst({
    //   select: {
    //     value: true,
    //   },
    //   where: {
    //     id: 1,
    //   },
    // });
    return {
      "Content-Type": "application/json",
      Authorization: "Bearer 12341",
      Cookie: "PHPSESSID=tm5jss1hm88cjq2bc7i0l0i7ao",
    };
  },
};
