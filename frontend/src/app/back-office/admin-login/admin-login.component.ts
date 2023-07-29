import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { StorageKey, StorageService } from "app/shared/storage.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "app/shared/common.service";
import { LoginLayoutService } from "app/layouts/login-layout/login-layout.service";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CoreHelperService } from "app/Providers/core-helper/core-helper.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-admin-login",
  templateUrl: "./admin-login.component.html",
  styleUrls: ["./admin-login.component.css"],
})
export class AdminLoginComponent implements OnInit {
  loginForm: FormGroup | any;
  activeTab = 1;
  hide1 = false;
  hide2 = false;
  forgotpwdForm: FormGroup | any;
  forgotpwdData = false;
  get fForgotpwdData() {
    return this.forgotpwdForm.controls;
  }
  get fLoginData() {
    return this.loginForm.controls;
  }
  submittedLoginData = false;
  otp: string = "";
  config = {
    allowNumbersOnly: false,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: "",
    inputStyles: {
      width: "50px",
      height: "50px",
    },
  };

  otpForm: FormGroup;
  submittedOtpFormData = false;
  otpMessage: string = "";
  get fOtpData() {
    return this.otpForm.controls;
  }

  resetpwdForm: FormGroup | any;
  submittedresetpwdFormData = false;
  get fResetpwdData() {
    return this.resetpwdForm.controls;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    public storageService: StorageService,
    public loginLayoutService: LoginLayoutService,
    public commonService: CommonService,
    public adminLayoutService: AdminLayoutService,
    private coreHelper: CoreHelperService
  ) { }

  ngOnInit(): void {
    this.defaultloginForm();
    this.defaultForgotpwdForm();
    this.defaultOtpForm();
    this.defaultresetpwdForm();
  }

  defaultloginForm() {
    this.loginForm = this.fb.group({
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
          ),
        ],
      ],
      pwd: ["", [Validators.required]],
    });
  }
  defaultForgotpwdForm() {
    this.forgotpwdForm = this.fb.group({
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
          ),
        ],
      ],
    });
  }
  defaultOtpForm() {
    this.otpForm = this.fb.group({
      userId: [""],
    });
  }
  defaultresetpwdForm() {
    this.resetpwdForm = this.fb.group(
      {
        userId: [""],
        pwd: [
          "",
          [Validators.required, this.coreHelper.patternPasswordValidator()],
        ],
        confirmPwd: ["", [Validators.required]],
      },
      {
        validator: [this.coreHelper.MustMatch("pwd", "confirmPwd")],
      }
    );
  }

  backtoLogin() {
    this.activeTab = 1;
  }
  forgotPassword() {
    this.activeTab = 2;
  }


  // login api calling
  login() {
    this.submittedLoginData = true;
    if (this.loginForm.invalid) {
      return;
    }
    let loginObj = {
      email: this.loginForm.value.email,
      pwd: this.loginForm.value.pwd,
    };
    this.loginLayoutService.userLogin(loginObj).subscribe(
      (Response: any) => {
        console.log(loginObj);
        if (Response.meta.code == 200) {
          localStorage.setItem("LoginUserData", JSON.stringify(Response.data));
          localStorage.setItem("IsLogin", "true");
          this.router.navigate(["/admin/dashboard"]);
          Swal.fire({
            icon: "success",
            // title: 'Oops...',
            text: "Login Successfully.",
            timer: 1500,
            showCancelButton: false,
            showConfirmButton: false,
            // footer: '<a href="">Why do I have this issue?</a>'
          });
          // this.commonService.notifier.notify("success", Response.meta.message);
        } else if (Response.meta.code === 1012) {
          Swal.fire({
            icon: "error",
            // title: 'Oops...',
            text: Response.meta.message,
            timer: 1500,
            showCancelButton: false,
            showConfirmButton: false,
            // footer: '<a href="">Why do I have this issue?</a>'
          });
          // this.commonService.notifier.notify("error", Response.meta.message);
        } else {
          Swal.fire({
            icon: "error",
            // title: 'Oops...',
            text: Response.meta.message,
            timer: 1500,
            showCancelButton: false,
            showConfirmButton: false,
            // footer: '<a href="">Why do I have this issue?</a>'
          });
          // this.commonService.notifier.notify("error", Response.meta.message);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }


  // otp send using email
  sendOtp() {
    this.forgotpwdData = true;

    if (this.forgotpwdForm.invalid) {
      return;
    }
    let forgotpwdObj = {
      email: this.forgotpwdForm.value.email,
    };
    this.adminLayoutService.forgotPassword(forgotpwdObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.otpForm.controls.userId.setValue(Response.data._id);
          this.forgotpwdData = false;
          this.defaultForgotpwdForm();
          Swal.fire({
            icon: "success",
            // title: 'Oops...',
            text: "OTP Send Successfully.",
            timer: 1500,
            showCancelButton: false,
            showConfirmButton: false,
            // footer: '<a href="">Why do I have this issue?</a>'
          });
          // this.commonService.notifier.notify(
          //   "success",
          //   "OTP Send Successfully."
          // );
          this.activeTab = 3;
        } else {
          Swal.fire({
            icon: "error",
            // title: 'Oops...',
            text: Response.meta.message,
            timer: 1500,
            showCancelButton: false,
            showConfirmButton: false,
            // footer: '<a href="">Why do I have this issue?</a>'
          });
          this.commonService.notifier.notify("error", Response.meta.message);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  resendOtp() {
    let otpFormObj = {
      userId: this.otpForm.controls.userId.value,
      activity: 2
    };
    this.adminLayoutService.reSendOtp(otpFormObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          Swal.fire({
            icon: "success",
            // title: 'Oops...',
            text: "Resend OTP Successfully.",
            timer: 1500,
            showCancelButton: false,
            showConfirmButton: false,
            // footer: '<a href="">Why do I have this issue?</a>'
          });
          // this.commonService.notifier.notify("success", Response.meta.message);
        } else {
          Swal.fire({
            icon: "error",
            // title: 'Oops...',
            text: Response.meta.message,
            timer: 1500,
            showCancelButton: false,
            showConfirmButton: false,
            // footer: '<a href="">Why do I have this issue?</a>'
          });
          // this.commonService.notifier.notify("error", Response.meta.message);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  otpVerify() {
    this.submittedOtpFormData = true;
    this.otp.length;
    if (this.otp.length != 4) {
      this.otpMessage = "OTP is Required.";
    }
    if (this.otp.length == 4) {
      this.otpMessage = "";
    }
    if (
      this.otpForm.invalid ||
      this.otp == "" ||
      !this.otp ||
      this.otp.length != 4
    ) {
      return;
    }
    let otpObj = {
      userId: this.otpForm.controls.userId.value,
      OTP: this.otp,
    };

    this.adminLayoutService.otpVerification(otpObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.submittedOtpFormData = false;
          this.defaultForgotpwdForm();
          this.resetpwdForm.controls.userId.setValue(Response.data._id);
          Swal.fire({
            icon: "success",
            // title: 'Oops...',
            text: "OTP Verify Successfully.",
            timer: 1500,
            showCancelButton: false,
            showConfirmButton: false,
            // footer: '<a href="">Why do I have this issue?</a>'
          });
          // this.commonService.notifier.notify(
          //   "success",
          //   "OTP Verify Successfully."
          // );
          this.activeTab = 4;
        } else {
          Swal.fire({
            icon: "error",
            // title: 'Oops...',
            text: Response.meta.message,
            timer: 1500,
            showCancelButton: false,
            showConfirmButton: false,
            // footer: '<a href="">Why do I have this issue?</a>'
          });
          // this.commonService.notifier.notify("error", Response.meta.message);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onOtpChange(otp) {
    this.otp = otp;
    if (this.otp.length == 4) {
      this.otpMessage = "";
    }
  }

  resetpassword() {
    this.submittedresetpwdFormData = true;
    if (this.resetpwdForm.invalid) {
      return;
    }
    let resetpwdObj = {
      userId: this.resetpwdForm.value.userId,
      pwd: this.resetpwdForm.value.pwd,
    };
    this.adminLayoutService.resetPassword(resetpwdObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.submittedresetpwdFormData = false;
          this.defaultresetpwdForm();
          Swal.fire({
            icon: "success",
            // title: 'Oops...',
            text: "Password Reset Successfully.",
            timer: 1500,
            showCancelButton: false,
            showConfirmButton: false,
            // footer: '<a href="">Why do I have this issue?</a>'
          });
          // this.commonService.notifier.notify(
          //   "success",
          //   "Password Reset Successfully."
          // );
          this.activeTab = 1;
        } else {
          Swal.fire({
            icon: "error",
            // title: 'Oops...',
            text: Response.meta.message,
            timer: 1500,
            showCancelButton: false,
            showConfirmButton: false,
            // footer: '<a href="">Why do I have this issue?</a>'
          });
          // this.commonService.notifier.notify("error", Response.meta.message);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  handleKeyUp(e: any) {
    if (e.keyCode === 13) {
      if (this.activeTab === 1) {
        this.login();
      } else if (this.activeTab === 3) {
        this.sendOtp();
      } else if (this.activeTab === 5) {
        this.otpVerify();
      }
    }
  }

}
