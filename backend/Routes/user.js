const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const accountSid = 'AC93d034b91d5c578b1389e76fdf054260';
const authToken = '2477af420d855cb73501428e4e936f62';
const twilioPhoneNumber = '8296751565';

module.exports = (db) => {
  const client = twilio(accountSid, authToken); // Use the 'twilio' function, not 'new twilio.Twilio'

  const generateOTP = () => {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  };

  router.post('/api/forgotpassword', (req, res) => {
    const { phoneNumber } = req.body;

    // Query the database to check if the phone number exists
    const query = 'SELECT * FROM user WHERE PhoneNo = ?';

    db.query(query, [phoneNumber], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        res.status(500).json({ message: 'error' });
      } else if (results.length > 0) {
        // Generate a random OTP
        const generatedOTP = generateOTP();

        // Send the OTP via Twilio
        client.messages
          .create({
            body: `Your OTP is: ${generatedOTP}`,
            from: twilioPhoneNumber,
            to: phoneNumber,
          })
          .then(() => {
            // Send the OTP to the user (mock response)
            res.json({ message: 'present', otp: generatedOTP });
          })
          .catch((error) => {
            console.error('Error sending SMS:', error);
            res.status(500).json({ message: 'error' });
          });
      } else {
        res.json({ message: 'invalid' });
      }
    });
  });

  return router;
};
