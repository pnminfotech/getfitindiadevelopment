const otpStorage = new Map();

export const sendOtp = async (mobile) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStorage.set(mobile, otp);
    console.log(`OTP for ${mobile}: ${otp}`);
};

export const verifyOtpCode = (mobile, otp) =>{
    return otpStorage.get(mobile) === otp;
};