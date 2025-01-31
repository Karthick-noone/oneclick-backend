const axios = require("axios");

// Function to send OTP via SMS
const sendOtpSms = async (number, otp) => {
  const smsApiUrl = `http://login.smsgatewayhub.com/api/mt/SendSMS`;
  const params = {
    user: "Seasensesoftwares",
    password: "Stripl@1",
    senderid: "SEASEN",
    channel: "Trans",
    DCS: 0,
    flashsms: 0,
    number,
    text: `Dear ${otp}, Many more happy returns of the day. With regards Sea Sense Group.`,
    route: 47,
    DLTTemplateId: "1707161044624969443",
    PEID: "1701159125640974053",
  };

  try {
    const response = await axios.get(smsApiUrl, { params });

  // Concatenate all parameters directly into the URL
  const smsApiUrl = `http://login.smsgatewayhub.com/api/mt/SendSMS?user=Seasensesoftwares&password=Stripl@1&senderid=SEASEN&channel=Trans&DCS=0&flashsms=0&number=${number}&text=Dear ${otp}, Many more happy returns of the day. With regards Sea Sense Group.&route=47&DLTTemplateId=1707161044624969443&PEID=1701159125640974053`;

  try {
    const response = await axios.get(smsApiUrl);
 edc03143eb4857b4da096577bb73ada5cc9c3d93
    console.log(`SMS sent to ${number} successfully. Response:`, response.data);
    return true;
  } catch (error) {
    console.error("Error sending SMS:", error.response?.data || error.message);
    throw new Error("Failed to send OTP via SMS");
  }
};

module.exports = sendOtpSms;
