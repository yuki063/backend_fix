const resetSMS = (otp) => {
  return (
    `Dear User,\n` +
    `${otp} is your otp for Reset Password.Please Enter the OTP to proceed.\n` +
    `Regards\n`
  );
};
export default resetSMS;
