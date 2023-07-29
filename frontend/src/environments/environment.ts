// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  //Local  
  // WebAPIUrl: "http://localhost:3050/v1/",
  // uploadsUrl: "http://localhost:3050/uploads/",
  // uploadedUrl: "http://localhost:3050/uploads/photos/",

  WebAPIUrl: "http://122.170.0.3:3020/v1/",
  uploadsUrl: "http://122.170.0.3:3020/uploads/",
  uploadedUrl: "http://122.170.0.3:3020/uploads/photos/",

  //Server 3
  // WebAPIUrl: "http://122.170.0.3:5050/v1/",
  // uploadsUrl: "http://122.170.0.3:5050/uploads/",
  // uploadedUrl: "http://122.170.0.3:5050/uploads/photos/",

  //Server 1
  // WebAPIUrl: "http://122.170.111.66:5050/v1/",
  // uploadsUrl: "http://122.170.111.66:5050/uploads/",
  // uploadedUrl: "http://122.170.111.66:5050/uploads/photos/",


  frontendUrl: "http://localhost:4200/",
  backendUrl: "http://localhost:4200/admin/",


};
