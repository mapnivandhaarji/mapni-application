import { HttpClient, HttpHeaders } from "@angular/common/http";
import { jsDocComment } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { CommonService } from "app/shared/common.service";

@Injectable({
  providedIn: "root",
})
export class AdminLayoutService {
  environment: any;
  constructor(private commonService: CommonService, private http: HttpClient) { }


  // login api for password reset with otp
  changePassword(updatechangepwdData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.post(this.commonService.rootData.rootUrl + 'adminUser/ChangePasswordForUser', updatechangepwdData, { headers: headers });
  }
  forgotPassword(forgotpwdData: any) {
    return this.http.post(this.commonService.rootData.rootUrl + 'adminUser/forgotPassworForUser', forgotpwdData);
  }
  reSendOtp(forgotpwdData: any) {
    return this.http.post(this.commonService.rootData.rootUrl + 'adminUser/resendOtpUser', forgotpwdData);
  }
  otpVerification(forgotpwdData: any) {
    return this.http.post(this.commonService.rootData.rootUrl + 'adminUser/checkOtpVerificationForUser', forgotpwdData);
  }
  resetPassword(resetpwdData: any) {
    return this.http.post(this.commonService.rootData.rootUrl + 'adminUser/passwordResetForUser', resetpwdData);
  }

  // ============== Sarve Master START =========== //
  getSarveMasterActiveList() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.get(this.commonService.rootData.rootUrl + 'sarveMaster/activeSarveMasterList', { headers: headers });
  }
  getSarveMaster() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.get(this.commonService.rootData.rootUrl + 'sarveMaster/sarveMasterList', { headers: headers });
  }
  SaveSarveMaster(createSarveMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.post(this.commonService.rootData.rootUrl + 'sarveMaster/sarveMasterCreate', createSarveMasterData, { headers: headers });
  }
  getSarveMasterById(data: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.get(this.commonService.rootData.rootUrl + 'sarveMaster/sarveMasterDetailsById', { params: data, headers: headers });
  }
  UpdateSarveMaster(updateSarveeMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.post(this.commonService.rootData.rootUrl + 'sarveMaster/sarveMasterUpdate', updateSarveeMasterData, { headers: headers });
  }
  StatusSarveMaster(updatestatusSarveMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.post(this.commonService.rootData.rootUrl + 'sarveMaster/sarveMasterActiveDeactive', updatestatusSarveMasterData, { headers: headers });
  }
  // ============== Sarve Master END =========== //


  // ============== Application Master START =========== //
  yearListforNotAssign(data) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.get(this.commonService.rootData.rootUrl + 'applicationMaster/uniqueYearList', { params: data, headers: headers });
  }
  yearListforAssignData(data) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.get(this.commonService.rootData.rootUrl + 'applicationMaster/uniqueYearListForAssignPerson', { params: data, headers: headers });
  }
  yearList(data) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.get(this.commonService.rootData.rootUrl + 'applicationMaster/uniqueYearList', { params: data, headers: headers });
  }
  talukaList() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.get(this.commonService.rootData.rootUrl + 'districtTalukaVillageExcel/talukaList', { headers: headers });
  }
  uniquetalukaListForNotAssign(data) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.get(this.commonService.rootData.rootUrl + 'districtTalukaVillageExcel/uniqueTalukaList', { params: data, headers: headers });
  }
  uniqueVillageListForNotAssign(data) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.get(this.commonService.rootData.rootUrl + 'districtTalukaVillageExcel/uniqueVillageList', { params: data, headers: headers });
  }
  uniquetalukaListForAssignData(data) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.get(this.commonService.rootData.rootUrl + 'districtTalukaVillageExcel/uniqueAssignTalukaList', { params: data, headers: headers });
  }
  uniqueVillageListForAssignData(data) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.get(this.commonService.rootData.rootUrl + 'districtTalukaVillageExcel/uniqueAssignVillageList', { params: data, headers: headers });
  }
  uniquetalukaList() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.get(this.commonService.rootData.rootUrl + 'districtTalukaVillageExcel/uniqueTalukaList', { headers: headers });
  }
  villageListByTalukaID(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.get(this.commonService.rootData.rootUrl + 'districtTalukaVillageExcel/talukaWiseVillageList', { params: params, headers: headers });
  }
  getApplicationMaster(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.post(this.commonService.rootData.rootUrl + 'applicationMaster/applicationMasterList', params, { headers: headers });
  }
  SaveApplicationMaster(createApplicationMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.post(this.commonService.rootData.rootUrl + 'applicationMaster/applicationMasterCreate', createApplicationMasterData, { headers: headers });
  }
  getApplicationMasterById(data: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.get(this.commonService.rootData.rootUrl + 'applicationMaster/applicationMasterDetailsById', { params: data, headers: headers });
  }
  UpdateApplicationMaster(updateApplicationeMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.post(this.commonService.rootData.rootUrl + 'applicationMaster/applicationMasterUpdate', updateApplicationeMasterData, { headers: headers });
  }
  rejectApplicationByApplicationId(updatestatusApplicationMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.post(this.commonService.rootData.rootUrl + 'applicationMaster/rejectApplicationMaster', updatestatusApplicationMasterData, { headers: headers });
  }
  assignApplicationIDFromSarveyer(data: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.post(this.commonService.rootData.rootUrl + 'applicationMaster/assignApplicationMaster', data, { headers: headers });
  }
  getAssignedApplicationList(query: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.post(this.commonService.rootData.rootUrl + 'applicationMaster/applicationMasterListforAssign', query, { headers: headers });
  }
  getSarveyerDetailsByApplicationId(query: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.get(this.commonService.rootData.rootUrl + 'applicationMaster/assignHistorybyApplicationId', { params: query, headers: headers });
  }
  applicationExcelUpload(createApplicationMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.post(this.commonService.rootData.rootUrl + 'applicationMaster/applicationExcelUpload', createApplicationMasterData, { headers: headers });
  }
  // ============== Application Master END =========== //


  // ============== Application Master START =========== //
  getDashboardCountList() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.get(this.commonService.rootData.rootUrl + 'applicationMaster/applicationMasterCountforDashboard', { headers: headers });
  }
  // ============== Application Master END =========== //

  getApplicationExcelDownload(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${LoginUserData.myToken}`,
    });
    return this.http.get(this.commonService.rootData.rootUrl + 'applicationMaster/applicationMasterExport', { params: params, headers: headers });
  }


}



