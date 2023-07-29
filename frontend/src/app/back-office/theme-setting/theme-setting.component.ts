import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-theme-setting',
  templateUrl: './theme-setting.component.html',
  styleUrls: ['./theme-setting.component.css']
})
export class ThemeSettingComponent implements OnInit {
  comapnyForm: FormGroup;
  isEditing = false;
  isEditSetting: boolean = false;



  constructor(private fb: FormBuilder,) { 
    
  }

  ngOnInit() {
    this.defaultForm();
    this.comapnyForm.disable();
    this.getcomapnySetting();
  }
  defaultForm() {
    this.comapnyForm = this.fb.group({
      primaryBackgroundColor: [""],
      primaryBackgroundTextColor: [""],
      primaryTextColor: [""],
    });
  }
  getcomapnySetting() {
    let primaryBackgroundColor = localStorage.getItem("primaryBackgroundColor") ? localStorage.getItem("primaryBackgroundColor") : "#696cff"
    let primaryBackgroundTextColor = localStorage.getItem("primaryBackgroundTextColor") ? localStorage.getItem("primaryBackgroundTextColor") : "#ffffff"
    let primaryTextColor = localStorage.getItem("primaryTextColor") ? localStorage.getItem("primaryTextColor") : "#696cff"

    this.comapnyForm.controls.primaryBackgroundColor.setValue(primaryBackgroundColor)
    this.comapnyForm.controls.primaryBackgroundTextColor.setValue(primaryBackgroundTextColor)
    this.comapnyForm.controls.primaryTextColor.setValue(primaryTextColor)
  }
  editSetting() {
    this.comapnyForm.enable();
    this.isEditSetting = true
  }

  updateCompanySetting() {
    localStorage.setItem("primaryBackgroundColor",this.comapnyForm.value.primaryBackgroundColor);
    localStorage.setItem("primaryBackgroundTextColor",this.comapnyForm.value.primaryBackgroundTextColor);
    localStorage.setItem("primaryTextColor",this.comapnyForm.value.primaryTextColor);
    this.comapnyForm.disable();
    this.isEditSetting = false
    window.location.reload();
  }

  canclecompanySetting() {
    let primaryBackgroundColor = localStorage.getItem("primaryBackgroundColor")
    let primaryBackgroundTextColor = localStorage.getItem("primaryBackgroundTextColor")
    let primaryTextColor = localStorage.getItem("primaryTextColor")

    this.comapnyForm.controls.primaryBackgroundColor.setValue(primaryBackgroundColor);
    this.comapnyForm.controls.primaryBackgroundTextColor.setValue(primaryBackgroundTextColor);
    this.comapnyForm.controls.primaryTextColor.setValue(primaryTextColor);
    this.comapnyForm.disable();
    this.isEditSetting = false;
  }
}
