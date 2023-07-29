import { Component, ElementRef, Input, OnInit } from "@angular/core";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
import { environment } from "environments/environment";
import { parseJSON } from "jquery";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
}
export const ROUTES: RouteInfo[] = [
  { path: "/admin/dashboard", title: "Dashboard" },
  { path: "/admin/sarve-list", title: "Sarveyer List" },
  { path: "/admin/application-list", title: "Application List" },
  { path: "/admin/assign-application-list", title: "Assigned Application List" },
  { path: "/admin/all-application-List", title: "All Application List" },
  { path: "/admin/taluka-village-list", title: "Taluka Village List" },
  // { path: "/admin/developer/theme-setting", title: "Theme Setting" },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  activeMenu: any;
  iconactive: boolean = false;
  isSettingOpen = {};
  istoggle: boolean | any = false;
  isSettingActive: boolean = false;
  noData: boolean;
  uploadedUrl: any;
  private toggleButton: any;
  navbar: any;
  constructor(
    public commonService: CommonService,
    private element: ElementRef,
    public adminLayoutService: AdminLayoutService
  ) { }

  isDeveloper: boolean = false;

  @Input() set navbarNativeElement(value: any) {
    if (!!value) {
      this.navbar = value.navbarNativeElement;
    }
  }
  iconDefaultURL = environment.uploadedUrl;
  iconActiveURL = environment.uploadedUrl;

  ngOnInit() {
    this.getsidemenuList();
    this.isDeveloper = parseJSON(localStorage.getItem('LoginUserData')).developerUser
  }

  sidebarClose() {
    //const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton =
      this.navbar.getElementsByClassName("layout-menu-toggle")[0];
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton.classList.remove("toggled");
    //this.sidebarVisible = false;
    body.classList.remove("layout-menu-expanded");
  }

  getsidemenuList() {

    this.menuItems = ROUTES

    // this.adminLayoutService.getSideMenuList().subscribe(
    //   (Response: any) => {
    //     if (Response.meta.code == 200) {
    //       // this.menuItems = .data;
    //       this.menuItems = Response.data.sort((a, b) => a.order - b.order);

    //       this.menuItems.filter((x) => {
    //         if (x.children.length > 0) {
    //           x.children.sort((a, b) => a.order - b.order);
    //         } else {
    //           return;
    //         }
    //       });

    //       this.noData = false;
    //     } else {
    //       this.noData = true;
    //     }

    //   },
    //   (error) => {
    //     console.log(error.error.Message);
    //   }
    // );
  }

  childrenMenu(index: any) {
    this.isSettingOpen[index] = !this.isSettingOpen[index];
  }
  toggle() {
    this.istoggle = !this.istoggle;
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
  isActive(menuName: any) {
    this.activeMenu = menuName;
    //this.isSettingActive = false;
  }
  isActivesetting(menuName: any) {
    this.activeMenu = menuName;
    this.isSettingActive = true;
  }

  reInializeChildMenu() {
    this.isSettingOpen = {};
  }
}
