import { Component, OnInit, ElementRef, EventEmitter, Output } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { CoreHelperService } from "app/Providers/core-helper/core-helper.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from 'app/shared/common.service';
import { AdminLayoutService } from 'app/layouts/admin-layout/admin-layout.service';
import { Title } from '@angular/platform-browser';
declare const $: any;
import Swal from "sweetalert2";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  changePasswordForm: FormGroup;
  hide1: boolean = false;
  hide2: boolean = false;
  hide3: boolean = false;

  submittedChangePasswordData = false;
  private listTitles: any[];
  location: Location;
  mobile_menu_visible: any = 0;
  //private toggleButton: any;
  private sidebarVisible: boolean;
  username: any;
  profileImage: any;
  get fLoginData() { return this.changePasswordForm.controls; }
  // searchTerm: any

  @Output() searchTerm = new EventEmitter();
  @Output() searchData = new EventEmitter();

  constructor(location: Location, private element: ElementRef, private router: Router, private fb: FormBuilder, private coreHelper: CoreHelperService, public commonService: CommonService, public adminLayoutService: AdminLayoutService, private titleService: Title) {
    this.location = location;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    this.defaultChangePasswordForm();
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    //this.toggleButton = navbar.getElementsByClassName('layout-menu-toggle')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
      //  var $layer: any = document.getElementsByClassName('close-layer')[0];
      //  if ($layer) {
      //    $layer.remove();
      //    this.mobile_menu_visible = 0;
      //  }
    });
    this.username = JSON.parse(localStorage.getItem('LoginUserData')).email
    this.profileImage = this.commonService.rootData.uploadsUrl + 'photos/' + JSON.parse(localStorage.getItem('LoginUserData')).profile_image
    console.log(this.username);

  }

  search() {
    this.searchData.emit();
  }

  sidebarOpen() {
    //const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];
    // setTimeout(function(){
    //     toggleButton.classList.add('toggled');
    // }, 500);

    body.classList.add('layout-menu-expanded');

    this.sidebarVisible = true;
  };
  sidebarClose() {
    const body = document.getElementsByTagName('body')[0];
    // this.toggleButton.classList.remove('toggled');
    // this.sidebarVisible = false;
    body.classList.remove('layout-menu-expanded');
  };
  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    var $toggle = document.getElementsByClassName('layout-menu-toggle')[0];

    //if (this.sidebarVisible === false) {
    this.sidebarOpen();
    // } else {
    //     this.sidebarClose();
    // }
    // const body = document.getElementsByTagName('body')[0];

    // if (this.mobile_menu_visible == 1) {
    //     // $('html').removeClass('nav-open');
    //     body.classList.remove('nav-open');
    //     if ($layer) {
    //         $layer.remove();
    //     }
    //     setTimeout(function() {
    //         $toggle.classList.remove('toggled');
    //     }, 400);

    //     this.mobile_menu_visible = 0;
    // } else {
    //     setTimeout(function() {
    //         $toggle.classList.add('toggled');
    //     }, 430);

    //     var $layer = document.createElement('div');
    //     $layer.setAttribute('class', 'close-layer');


    //     if (body.querySelectorAll('.main-panel')) {
    //         document.getElementsByClassName('main-panel')[0].appendChild($layer);
    //     }else if (body.classList.contains('off-canvas-sidebar')) {
    //         document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
    //     }

    //     setTimeout(function() {
    //         $layer.classList.add('visible');
    //     }, 100);

    //     $layer.onclick = function() { //asign a function
    //       body.classList.remove('nav-open');
    //       this.mobile_menu_visible = 0;
    //       $layer.classList.remove('visible');
    //       setTimeout(function() {
    //           $layer.remove();
    //           $toggle.classList.remove('toggled');
    //       }, 400);
    //     }.bind(this);

    //     body.classList.add('nav-open');
    //     this.mobile_menu_visible = 1;

    //}
  };

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }
    if (titlee.charAt(0) === '?') {
      titlee = titlee.slice(1);
    }
    if (titlee.includes('dashboard')) {
      return {
        pastPage: [],
        currentPageName: 'Dashboard'
      };
    }


  }
  handleKeyUp(e: any) {
    if (e.keyCode === 13) {
      this.changePassword();
    }
  }
  updateChangepwd() {

    this.submittedChangePasswordData = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    let changepwdObj = {
      "oldpwd": this.changePasswordForm.value.oldpwd,
      "newpwd": this.changePasswordForm.value.newpwd
    }
    this.adminLayoutService.changePassword(changepwdObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        $("#change-password-modal").modal("hide");
        this.submittedChangePasswordData = false;
        this.defaultChangePasswordForm();
        Swal.fire({
          icon: "success",
          // title: 'Oops...',
          text: "Password Change Successfully",
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false,
          // footer: '<a href="">Why do I have this issue?</a>'
        });
        // this.commonService.notifier.notify('success', Response.meta.message);
        this.logout();
      }
      else {
        Swal.fire({
          icon: "error",
          // title: 'Oops...',
          text: Response.meta.message,
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false,
          // footer: '<a href="">Why do I have this issue?</a>'
        });
        // this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  logout() {
    window.localStorage.clear();
    localStorage.removeItem('IsLogin');
    localStorage.removeItem('LoginUserData');
    this.router.navigate(["/admin-login/login"]);
  }

  defaultChangePasswordForm() {
    this.changePasswordForm = this.fb.group({
      oldpwd: ['', [Validators.required]],
      newpwd: ['', [Validators.required, this.coreHelper.patternPasswordValidator()]],
      confirmPwd: ['', [Validators.required]],
    }, {
      validator: [this.coreHelper.MustMatch('newpwd', 'confirmPwd')]
    });
  }
  changePassword() {
    this.submittedChangePasswordData = false;
    this.defaultChangePasswordForm();
    $("#change-password-modal").modal("show");
  }
  cancelchangePassword() {
    this.submittedChangePasswordData = false;
    this.defaultChangePasswordForm();
    $("#change-password-modal").modal("hide");
  }
}
