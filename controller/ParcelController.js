const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const request = require("request");
const { default: serverConfig } = require("../serverConfig");
const axios = require("axios");

module.exports = {
  list: async (req, res) => {
    try {
      const results = await prisma.BookingList.findMany({
        select: {
          trackingCode: true,
          courierCode: true,
        },
        where: {
          memberId: parseInt(req.body.memberId),
        },
      });
      return res.send({ message: "success", results: results });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  checkPrice: async (req, res) => {
    try {
      const token = await prisma.config.findFirst({
        select: {
          value: true,
        },
        where: {
          id: 1,
        },
      });
      var options = {
        method: "POST",
        url: "https://app.easyparcel.biz/api/v1/shipment/pricelist",
        headers: serverConfig.headerParcelAut(token.value),
        body: JSON.stringify(req.body.data),
      };

      //เรียกเอา cost rate
      const memberData = await prisma.member.findFirst({
        select: {
          shopType: true,
          costRate: true,
          saleRate: true,
        },
        where: {
          id: parseInt(req.body.member_id),
        },
      });

      request(options, function (error, response) {
        if (error) throw new Error(error);
        const myData = JSON.parse(response.body);
        if (myData.status == "success") {
          const results = [];
          const pData = Object.values(myData.data);
          for (let i = 0; i < pData.length; i++) {
            if (pData[i].available == true) {
              const standardPrice = parseInt(pData[i].standardPrice); // ราคาซื้อขาย
              const customerPrice = parseInt(pData[i].customerPrice); // ราคาต้นทุน ไม่ให้ใครเห็นทั้งนั้น

              // ส่วนแสดงให้ผู้ใช้
              let buy = 0; // ราคาต้นทุน แสดงเฉพาะ SHOP
              let sale = 0; // ราคาซื้อขาย

              if ((standardPrice - customerPrice) < 5 && memberData.shopType == "shop") {
                buy = standardPrice + 10;
              } else if (standardPrice - customerPrice < 10) {
                buy = standardPrice + 7;
              } else {
                buy = standardPrice;
              }

              sale = buy + (buy * memberData.saleRate) / 100;
              
              let allPrice = {
                sale: Math.floor(sale),
                fuelFee: pData[i].fuelFee, //ค่าน้ำมันนำส่ง
                insuranceServiceFee: pData[i].insuranceServiceFee, //ค่าประกันพัสดุ ถ้าซื้อ
                remoteAreaFee: pData[i].remoteAreaFee, //ค่าพื้นที่ห่างไกล ถ้ามี
                codFee: pData[i].codFee, //ค่าบริการ cod ถ้ามี
                serviceFee: pData[i].serviceFee, //ค่าบริการอื่นๆ
              };

              if (memberData.shopType == "shop") {
                allPrice.buy = Math.ceil(buy);
                allPrice.bonusShop = 1;
              } else {
                allPrice.buy = Math.ceil(sale),
                allPrice.bonusShop = 0;
              }

              results.push({
                allPrice: allPrice,
                standardPrice: pData[i].standardPrice, // ราคาซื้อขาย
                customerPrice: pData[i].customerPrice, // ราคาต้นทุน
                courierCode: pData[i].courierCode,
                courierName: pData[i].courierName,
                estimateTime: pData[i].estimateTime,
                remark: pData[i].remark.toString(),
              });
            }
          }

          return res.send({
            message: "success",
            results: results,
            shopType: memberData.shopType,
          });
        } else {
          return res.send(myData);
        }
      });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  postCode: async (req, res) => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "https://app.easyparcel.biz/api/v1/address/" + req.params.search,
        headers: {
          Cookie: "PHPSESSID=0r83o551r2ehr2b9prlroh8v94",
        },
      };

      axios
        .request(config)
        .then((response) => {
          return res.send({ result: response.data });
        })
        .catch((error) => {
          return res.send(error);
        });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  getLabel: async (req, res) => {
    try {
      const token = await prisma.config.findFirst({
        select: {
          value: true,
        },
        where: {
          id: 1,
        },
      });

      var options = {
        method: "POST",
        url: "https://app.easyparcel.biz/api/v1/shipment/label",
        headers: serverConfig.headerParcelAut(token.value),
        body: JSON.stringify(req.body),
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        return res.send(response.body);
      });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  createOrder: async (req, res) => {
    try {
      const token = await prisma.config.findFirst({
        select: {
          value: true,
        },
        where: {
          id: 1,
        },
      });
      const pickupAddressId = await prisma.member.findFirst({
        select: {
          pickupId: true,
        },
        where: {
          id: parseInt(req.body.member_id),
        },
      });
      const payload = req.body.data;
      payload.pickupAddressId = pickupAddressId.pickupId;
      var options = {
        method: "POST",
        url: "https://app.easyparcel.biz/api/v1/shipment/create",
        headers: serverConfig.headerParcelAut(token.value),
        body: JSON.stringify(payload),
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        const myObj = JSON.parse(response.body);
        if (myObj.status == "success") {
          const pData = myObj.data;
          valueData = {
            memberId: parseInt(req.body.member_id),
            userId: parseInt(req.body.user_id),
            trackingCode: pData.courierTrackingCode,
            courierCode: pData.courierCode,
            courierName: pData.courierName,
            parcelData: "3843,209,950,18x25x10",
            srvCost: 5,
            priceCost: 10,
            priceSale: 15,
            priceArea: 0,
            codAmount: 0,
            codService: 0,
          };
          return res.send({ status: "success", valueData });
        }
      });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  cancel: async (req, res) => {
    try {
      const token = await prisma.config.findFirst({
        select: {
          value: true,
        },
        where: {
          id: 1,
        },
      });
      var options = {
        method: "POST",
        url: "https://app.easyparcel.biz/api/v1/shipment/cancel",
        headers: serverConfig.headerParcelAut(token.value),
        body: JSON.stringify(req.body),
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        return res.send(response.body);
      });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  createOrderToDB: async (req, res) => {
    try {
      const result = await prisma.bookingList.create({
        data: req.body,
      });
      return res.send(result);
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
};
