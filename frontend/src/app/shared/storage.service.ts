import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

    getValue(key: any): any {
        return localStorage.getItem(key);
    }

    setValue(key: any, value: any): void {
        localStorage.setItem(key, value);
    }

    removeValue(key: any): void {
        localStorage.removeItem(key);
    }
}

export class StorageKey {

  public static myToken = 'myToken';
  public static roleId = 'roleId';
  public static contact = 'contact';
  public static reference = 'reference';
  public static aadharcardNo = 'aadharcardNo';
  public static lastName = 'lastName';
  public static email = 'email';
  public static full_name = 'name';
  public static roleName = 'roleName';
  public static utsav_decor_logo = 'utsav_decor_logo';
  public static isUtsavDecoreLogin = 'isUtsavDecoreLogin';

}

