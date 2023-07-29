module.exports = {
    InternalServerError: { code: 1001, message: "Something went wrong!" },
    UserRegistrationSuccess: { code: 200, message: "Register Successfully." },
    UserSaveSuccess: { code: 200, message: "User Save Successfully." },

    ForgotPassword: { code: 200, message: "OTP Send to your registerd email Id." },



    UserUpdateFail: { code: 1010, message: "Failed to update user details. Please try after sometime. " },

    PasswordChangeSucess: { code: 200, message: "Password has been updated" },

    emailisnotverified: { code: 1012, message: "please verify your email." },
    InvalidCredential: { code: 1007, message: "Invalid Email or password." },
    UserUpdateFailed: {
        code: 1005,
        message: "Failed to update user details. Please try after sometime."
    },
    AllreadyExist: { code: 1005, message: "already exist." },
    NotFound: { code: 1010, message: "Not found" },
    NoUserFound: { code: 1006, message: "No user found." },
    InvalidOldPassword: { code: 1007, message: "Invalid old password." },
    LoginSuccess: { code: 200, message: "Login successfully." },
    LoginAgain: { code: 200, message: "Please login." },
    Success: { code: 200, message: "Success." },
    Fail: { code: 1010, message: "Fail....." },
    allReadyLike: { code: 1010, message: "already Like....." },
    allReadyDisLike: { code: 1010, message: "already DisLike....." },
    emailIsAlreadyVerify: { code: 1010, message: "your email is already verified" },
    yourPaymentAlreadyDone: { code: 1011, message: "your paid amount is more than remaining amount" },
    UserNotActivated: { code: 1012, message: "User is not activated yet." },
    SomethingWrong: { code: 1013, message: "Oops! something went wrong, please try again later." },
    MissingDeviceTokenParameter: { code: 1015, message: "Missing device token parameters." },
    InvalidPassword: { code: 1007, message: "Invalid password Please enter valid password." },
    OTPVerifyFail: {
        code: 1010,
        message: "OTP verification failed."
    },
    OTPExpired: {
        code: 1010,
        message: "OTP is expire."
    },

}
