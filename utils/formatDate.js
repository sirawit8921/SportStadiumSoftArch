const moment = require("moment-timezone");

// แปลงวันที่เป็นรูปแบบไทย
const formatDate = (date) => {
  if (!date) return null;

  return moment(date)
    .tz("Asia/Bangkok") // timezone Bangkok
    .format("DD/MM/YYYY HH:mm");
};

module.exports = formatDate;
