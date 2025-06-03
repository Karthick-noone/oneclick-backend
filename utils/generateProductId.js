const generateProductId = () => {
    const prefix = "PRD";
    const randomDigits = Math.floor(10000 + Math.random() * 90000); // generates a random 5-digit number
    return `${prefix}${randomDigits}`;
  };
  
  module.exports = generateProductId;