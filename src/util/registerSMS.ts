const registerSMS = (otp) => {
  return (
    `Dear User,\n` +
    `${otp} is your otp for Phone Number Verfication. Please enter the OTP to verify your phone number.\n` +
    `Regards\n`
  );
};

export default registerSMS;
