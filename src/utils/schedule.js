// const schedule = require("node-schedule");

// let adminModel = require("../models/2.admin");
// let shopModel = require("../models/5.shop");
// let workerModel = require("../models/10.worker");
// // let adModel = require("../models/12.ads");
// schedule.scheduleJob({ hour: 0, minute: 0 }, async () => {
//   let date = new Date();
//   date.setHours(date.getHours() + 5);
//   date.setFullYear(date.getFullYear() + 5);
//   console.log(date);
//   let condition = {
//     expired: {
//       $lte: date,
//     },
//   };

//   let data = {
//     work_status: "blocked",
//   };

//   console.log(await adminModel.updateMany(condition, data));
//   console.log(await shopModel.updateMany(condition, data));
//   console.log(await adModel.updateMany(condition, data));
//   console.log(await workerModel.updateMany(condition, data));
//   //   shopModel.updateMany(condition, data);
//   //   adModel.updateMany(condition, data);
//   //   workerModel.updateMany(condition, data);
// });
