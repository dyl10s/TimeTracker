(function () {
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  (window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"], {
    /***/
    "/kjZ":
    /*!*****************************************************!*\
      !*** ./src/app/views/auth/login/login.component.ts ***!
      \*****************************************************/

    /*! exports provided: LoginComponent */

    /***/
    function kjZ(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "LoginComponent", function () {
        return LoginComponent;
      });
      /* harmony import */


      var _angular_forms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/forms */
      "3Pt+");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _core_services_auth_auth_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ../../../core/services/auth/auth-api.service */
      "8OAW");
      /* harmony import */


      var _core_services_auth_jwt_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ../../../core/services/auth/jwt.service */
      "E2yI");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");
      /* harmony import */


      var _nebular_theme__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! @nebular/theme */
      "aceb");
      /* harmony import */


      var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! @angular/common */
      "ofXK");

      function LoginComponent_p_10_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "p", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        }

        if (rf & 2) {
          var ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r0.error);
        }
      }

      var LoginComponent = /*#__PURE__*/function () {
        function LoginComponent(authService, JwtService, router) {
          _classCallCheck(this, LoginComponent);

          this.authService = authService;
          this.JwtService = JwtService;
          this.router = router;
          this.loginForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormGroup"]({
            email: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"](''),
            password: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"]('')
          });
          this.isLoading = false;
        }

        _createClass(LoginComponent, [{
          key: "ngOnInit",
          value: function ngOnInit() {}
        }, {
          key: "login",
          value: function login(loginForm) {
            var _this = this;

            this.error = '';
            this.isLoading = true;

            if (!loginForm.email || !loginForm.password) {
              this.error = "Please enter email and password.";
              this.isLoading = false;
              return;
            }

            this.authService.login({
              Email: loginForm.email,
              Password: loginForm.password
            }).subscribe(function (response) {
              if (response.success) {
                // Handle Successful Login
                _this.JwtService.setTokens(response.data.accessToken, response.data.refreshToken); // TODO: Remove alert and route to dashboard


                _this.router.navigate(['/dashboard/profile']);
              } else {
                _this.loginForm.controls['password'].reset();

                _this.error = response.message;
              }

              _this.isLoading = false;
            }, function (error) {
              _this.error = 'API Not Connected.';
              _this.isLoading = false;
            });
          }
        }]);

        return LoginComponent;
      }();

      LoginComponent.ɵfac = function LoginComponent_Factory(t) {
        return new (t || LoginComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_auth_auth_api_service__WEBPACK_IMPORTED_MODULE_2__["AuthApiService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_auth_jwt_service__WEBPACK_IMPORTED_MODULE_3__["JwtService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]));
      };

      LoginComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
        type: LoginComponent,
        selectors: [["app-login"]],
        decls: 19,
        vars: 4,
        consts: [[1, "column"], [1, "login-container"], [1, "text-black"], [3, "formGroup"], [1, "form-group"], ["type", "email", "nbInput", "", "fullWidth", "", "status", "primary", "placeholder", "Email address", "formControlName", "email"], ["type", "password", "nbInput", "", "fullWidth", "", "status", "primary", "placeholder", "Password", "formControlName", "password"], ["class", "error", 4, "ngIf"], ["nbButton", "", "fullWidth", "", "status", "success", "nbSpinnerStatus", "success", 3, "nbSpinner", "disabled", "click"], ["routerLink", "/auth/register", 1, "clickable"], [1, "error"]],
        template: function LoginComponent_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "nb-layout-column", 0);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "nb-card", 1);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "nb-card-header");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "h4", 2);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Login");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "nb-card-body", 3);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 4);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](7, "input", 5);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "div", 4);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](9, "input", 6);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](10, LoginComponent_p_10_Template, 2, 1, "p", 7);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "div", 4);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "button", 8);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function LoginComponent_Template_button_click_12_listener() {
              return ctx.login(ctx.loginForm.value);
            });

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, " Login ");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "nb-actions");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "nb-action");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "Not a member? ");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "span", 9);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, "Register");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          }

          if (rf & 2) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroup", ctx.loginForm);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.error);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("nbSpinner", ctx.isLoading)("disabled", ctx.isLoading);
          }
        },
        directives: [_nebular_theme__WEBPACK_IMPORTED_MODULE_5__["NbLayoutColumnComponent"], _nebular_theme__WEBPACK_IMPORTED_MODULE_5__["NbCardComponent"], _nebular_theme__WEBPACK_IMPORTED_MODULE_5__["NbCardHeaderComponent"], _nebular_theme__WEBPACK_IMPORTED_MODULE_5__["NbCardBodyComponent"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormGroupDirective"], _nebular_theme__WEBPACK_IMPORTED_MODULE_5__["NbInputDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControlName"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], _nebular_theme__WEBPACK_IMPORTED_MODULE_5__["NbButtonComponent"], _nebular_theme__WEBPACK_IMPORTED_MODULE_5__["NbSpinnerDirective"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterLink"]],
        styles: [".header[_ngcontent-%COMP%] {\n  background-color: #232d9a;\n}\n\n.form-group[_ngcontent-%COMP%] {\n  padding: 10px;\n}\n\n.login-container[_ngcontent-%COMP%] {\n  margin: auto;\n  text-align: center;\n}\n\n.error[_ngcontent-%COMP%] {\n  color: red;\n}\n\n\n\n@media only screen and (min-width: 660px) {\n  .login-container[_ngcontent-%COMP%] {\n    margin: auto;\n    width: 500px;\n    text-align: center;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcbG9naW4uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSx5QkFBQTtBQUNKOztBQUVBO0VBQ0ksYUFBQTtBQUNKOztBQUVBO0VBQ0ksWUFBQTtFQUNBLGtCQUFBO0FBQ0o7O0FBRUE7RUFDSSxVQUFBO0FBQ0o7O0FBRUEsdUZBQUE7O0FBQ0E7RUFDSTtJQUNJLFlBQUE7SUFDQSxZQUFBO0lBQ0Esa0JBQUE7RUFDTjtBQUNGIiwiZmlsZSI6ImxvZ2luLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmhlYWRlciB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMjMyZDlhO1xyXG59XHJcblxyXG4uZm9ybS1ncm91cCB7XHJcbiAgICBwYWRkaW5nOiAxMHB4O1xyXG59XHJcblxyXG4ubG9naW4tY29udGFpbmVyIHtcclxuICAgIG1hcmdpbjogYXV0bztcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjsgIFxyXG59XHJcblxyXG4uZXJyb3Ige1xyXG4gICAgY29sb3I6IHJlZDtcclxufVxyXG5cclxuLyogTWVkaWEgcXVlcnkgZm9yIHRhYmxldCB2aWV3cG9ydCB0YXJnZXRzIHNjcmVlbiBzaXplIHdpdGggYSBtaW5pbXVtIHdpZHRoIG9mIDY2MHB4LiAqL1xyXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDY2MHB4KSB7XHJcbiAgICAubG9naW4tY29udGFpbmVyIHtcclxuICAgICAgICBtYXJnaW46IGF1dG87XHJcbiAgICAgICAgd2lkdGg6IDUwMHB4OyBcclxuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7ICBcclxuICAgIH1cclxufVxyXG5cclxuIl19 */"]
      });
      /***/
    },

    /***/
    0:
    /*!***************************!*\
      !*** multi ./src/main.ts ***!
      \***************************/

    /*! no static exports found */

    /***/
    function _(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(
      /*! C:\Users\j\Desktop\TimeTracker\frontend\src\main.ts */
      "zUnb");
      /***/
    },

    /***/
    "6+iD":
    /*!*****************************************************************!*\
      !*** ./src/app/core/services/auth/token-interceptor.service.ts ***!
      \*****************************************************************/

    /*! exports provided: TokenInterceptorService */

    /***/
    function iD(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "TokenInterceptorService", function () {
        return TokenInterceptorService;
      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _jwt_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./jwt.service */
      "E2yI");

      var TokenInterceptorService = /*#__PURE__*/function () {
        function TokenInterceptorService(jwtService) {
          _classCallCheck(this, TokenInterceptorService);

          this.jwtService = jwtService;
        }

        _createClass(TokenInterceptorService, [{
          key: "intercept",
          value: function intercept(request, next) {
            if (this.jwtService.isAuthenticated()) {
              request = request.clone({
                setHeaders: {
                  Authorization: "Bearer ".concat(this.jwtService.getJWT())
                }
              });
              return next.handle(request);
            } else {
              return next.handle(request);
            }
          }
        }]);

        return TokenInterceptorService;
      }();

      TokenInterceptorService.ɵfac = function TokenInterceptorService_Factory(t) {
        return new (t || TokenInterceptorService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_jwt_service__WEBPACK_IMPORTED_MODULE_1__["JwtService"]));
      };

      TokenInterceptorService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
        token: TokenInterceptorService,
        factory: TokenInterceptorService.ɵfac,
        providedIn: 'root'
      });
      /***/
    },

    /***/
    "8OAW":
    /*!********************************************************!*\
      !*** ./src/app/core/services/auth/auth-api.service.ts ***!
      \********************************************************/

    /*! exports provided: AuthApiService */

    /***/
    function OAW(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "AuthApiService", function () {
        return AuthApiService;
      });
      /* harmony import */


      var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ../../../../environments/environment */
      "AytR");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/common/http */
      "tk/3");

      var AuthApiService = /*#__PURE__*/function () {
        function AuthApiService(http) {
          _classCallCheck(this, AuthApiService);

          this.http = http;
          this.api = _environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].api;
        }

        _createClass(AuthApiService, [{
          key: "login",
          value: function login(loginUser) {
            return this.http.post("".concat(this.api, "/Auth/Login"), loginUser);
          }
        }, {
          key: "register",
          value: function register(registerUser) {
            return this.http.post("".concat(this.api, "/Auth/Register"), registerUser);
          }
        }, {
          key: "refresh",
          value: function refresh(_refresh) {
            return this.http.post("".concat(this.api, "/Auth/Refresh"), _refresh);
          }
        }]);

        return AuthApiService;
      }();

      AuthApiService.ɵfac = function AuthApiService_Factory(t) {
        return new (t || AuthApiService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]));
      };

      AuthApiService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
        token: AuthApiService,
        factory: AuthApiService.ɵfac,
        providedIn: 'root'
      });
      /***/
    },

    /***/
    "AytR":
    /*!*****************************************!*\
      !*** ./src/environments/environment.ts ***!
      \*****************************************/

    /*! exports provided: environment */

    /***/
    function AytR(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "environment", function () {
        return environment;
      }); // This file can be replaced during build by using the `fileReplacements` array.
      // `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
      // The list of file replacements can be found in `angular.json`.


      var environment = {
        production: false,
        api: 'https://localhost:5001'
      };
      /*
       * For easier debugging in development mode, you can import the following file
       * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
       *
       * This import should be commented out in production mode because it will have a negative impact
       * on performance if an error is thrown.
       */
      // import 'zone.js/dist/zone-error';  // Included with Angular CLI.

      /***/
    },

    /***/
    "E2yI":
    /*!***************************************************!*\
      !*** ./src/app/core/services/auth/jwt.service.ts ***!
      \***************************************************/

    /*! exports provided: JwtService */

    /***/
    function E2yI(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "JwtService", function () {
        return JwtService;
      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @auth0/angular-jwt */
      "Nm8O");

      var JwtService = /*#__PURE__*/function () {
        function JwtService(jwtHelper) {
          _classCallCheck(this, JwtService);

          this.jwtHelper = jwtHelper;
        }

        _createClass(JwtService, [{
          key: "setTokens",
          value: function setTokens(jwt, refresh) {
            localStorage.setItem('accessToken', jwt);
            localStorage.setItem('refreshToken', refresh);
          }
        }, {
          key: "decode",
          value: function decode() {
            try {
              return this.jwtHelper.decodeToken(localStorage.getItem('accessToken'));
            } catch (_a) {
              return null;
            }
          }
        }, {
          key: "getJWT",
          value: function getJWT() {
            return localStorage.getItem('accessToken');
          }
        }, {
          key: "isAuthenticated",
          value: function isAuthenticated() {
            var accessToken = localStorage.getItem('accessToken');

            try {
              return !this.jwtHelper.isTokenExpired(accessToken);
            } catch (_a) {
              return false;
            }
          }
        }, {
          key: "logout",
          value: function logout() {
            localStorage.clear();
          }
        }]);

        return JwtService;
      }();

      JwtService.ɵfac = function JwtService_Factory(t) {
        return new (t || JwtService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_1__["JwtHelperService"]));
      };

      JwtService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
        token: JwtService,
        factory: JwtService.ɵfac,
        providedIn: 'root'
      });
      /***/
    },

    /***/
    "GJs9":
    /*!*******************************************************!*\
      !*** ./src/app/views/auth/logout/logout.component.ts ***!
      \*******************************************************/

    /*! exports provided: LogoutComponent */

    /***/
    function GJs9(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "LogoutComponent", function () {
        return LogoutComponent;
      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");
      /* harmony import */


      var src_app_core_services_auth_jwt_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! src/app/core/services/auth/jwt.service */
      "E2yI");

      var LogoutComponent = /*#__PURE__*/function () {
        function LogoutComponent(router, jwtService) {
          _classCallCheck(this, LogoutComponent);

          this.router = router;
          this.jwtService = jwtService;
        }

        _createClass(LogoutComponent, [{
          key: "ngOnInit",
          value: function ngOnInit() {
            this.jwtService.logout();
            this.router.navigate(['/auth/login']);
          }
        }]);

        return LogoutComponent;
      }();

      LogoutComponent.ɵfac = function LogoutComponent_Factory(t) {
        return new (t || LogoutComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](src_app_core_services_auth_jwt_service__WEBPACK_IMPORTED_MODULE_2__["JwtService"]));
      };

      LogoutComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
        type: LogoutComponent,
        selectors: [["app-logout"]],
        decls: 2,
        vars: 0,
        template: function LogoutComponent_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Logging Out...");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          }
        },
        encapsulation: 2
      });
      /***/
    },

    /***/
    "LN9C":
    /*!***********************************************************!*\
      !*** ./src/app/views/auth/register/register.component.ts ***!
      \***********************************************************/

    /*! exports provided: RegisterComponent */

    /***/
    function LN9C(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "RegisterComponent", function () {
        return RegisterComponent;
      });
      /* harmony import */


      var _angular_forms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/forms */
      "3Pt+");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _core_services_auth_auth_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ../../../core/services/auth/auth-api.service */
      "8OAW");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");
      /* harmony import */


      var _nebular_theme__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @nebular/theme */
      "aceb");
      /* harmony import */


      var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! @angular/common */
      "ofXK");

      function RegisterComponent_p_16_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "p", 13);

          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        }

        if (rf & 2) {
          var ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r0.error);
        }
      }

      var RegisterComponent = /*#__PURE__*/function () {
        function RegisterComponent(authService, router, activatedRoute) {
          _classCallCheck(this, RegisterComponent);

          this.authService = authService;
          this.router = router;
          this.activatedRoute = activatedRoute;
          this.registerForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormGroup"]({
            firstName: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"](''),
            lastName: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"](''),
            email: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"](''),
            password: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"](''),
            confirmPassword: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"](''),
            inviteCode: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"]('')
          });
          this.isLoading = false;
        }

        _createClass(RegisterComponent, [{
          key: "ngOnInit",
          value: function ngOnInit() {
            this.registerForm.patchValue({
              inviteCode: this.activatedRoute.snapshot.queryParamMap.get('inviteCode')
            });
          }
        }, {
          key: "register",
          value: function register(registerForm) {
            var _this2 = this;

            this.error = '';
            this.isLoading = true;

            if (!registerForm.firstName || !registerForm.lastName || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
              this.error = "Please enter all fields.";
              this.isLoading = false;
              return;
            }

            this.authService.register({
              Email: registerForm.email,
              Password: registerForm.password,
              Name: "".concat(registerForm.firstName.trim(), " ").concat(registerForm.lastName.trim()),
              InviteCode: registerForm.inviteCode
            }).subscribe(function (response) {
              if (response.success) {
                // Handle Successful Registration
                _this2.router.navigate(['/auth/login']);
              } else {
                _this2.error = response.message;
              }

              _this2.isLoading = false;
            }, function (error) {
              _this2.error = 'API Not Connected.';
              _this2.isLoading = false;
            });
          }
        }]);

        return RegisterComponent;
      }();

      RegisterComponent.ɵfac = function RegisterComponent_Factory(t) {
        return new (t || RegisterComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_auth_auth_api_service__WEBPACK_IMPORTED_MODULE_2__["AuthApiService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"]));
      };

      RegisterComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
        type: RegisterComponent,
        selectors: [["app-register"]],
        decls: 25,
        vars: 4,
        consts: [[1, "column"], [1, "register-container"], [1, "text-black"], [3, "formGroup"], [1, "form-group"], ["type", "name", "nbInput", "", "fullWidth", "", "status", "primary", "placeholder", "First Name", "formControlName", "firstName"], ["type", "name", "nbInput", "", "fullWidth", "", "status", "primary", "placeholder", "Last Name", "formControlName", "lastName"], ["type", "email", "nbInput", "", "fullWidth", "", "status", "primary", "placeholder", "Email address", "formControlName", "email"], ["type", "password", "nbInput", "", "fullWidth", "", "status", "primary", "placeholder", "Password", "formControlName", "password"], ["type", "password", "nbInput", "", "fullWidth", "", "status", "primary", "placeholder", "Confirm Password", "formControlName", "confirmPassword"], ["class", "error", 4, "ngIf"], ["nbButton", "", "fullWidth", "", "status", "success", "nbSpinnerStatus", "success", 3, "nbSpinner", "disabled", "click"], ["routerLink", "/auth/login", 1, "clickable"], [1, "error"]],
        template: function RegisterComponent_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "nb-layout-column", 0);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "nb-card", 1);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "nb-card-header");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "h4", 2);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Register");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "nb-card-body", 3);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 4);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](7, "input", 5);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "div", 4);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](9, "input", 6);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "div", 4);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](11, "input", 7);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "div", 4);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](13, "input", 8);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "div", 4);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](15, "input", 9);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](16, RegisterComponent_p_16_Template, 2, 1, "p", 10);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "div", 4);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "button", 11);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function RegisterComponent_Template_button_click_18_listener() {
              return ctx.register(ctx.registerForm.value);
            });

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, " Register ");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "nb-actions");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "nb-action");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, "Already a member? ");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "span", 12);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](24, "Login");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          }

          if (rf & 2) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroup", ctx.registerForm);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](11);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.error);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("nbSpinner", ctx.isLoading)("disabled", ctx.isLoading);
          }
        },
        directives: [_nebular_theme__WEBPACK_IMPORTED_MODULE_4__["NbLayoutColumnComponent"], _nebular_theme__WEBPACK_IMPORTED_MODULE_4__["NbCardComponent"], _nebular_theme__WEBPACK_IMPORTED_MODULE_4__["NbCardHeaderComponent"], _nebular_theme__WEBPACK_IMPORTED_MODULE_4__["NbCardBodyComponent"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormGroupDirective"], _nebular_theme__WEBPACK_IMPORTED_MODULE_4__["NbInputDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControlName"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], _nebular_theme__WEBPACK_IMPORTED_MODULE_4__["NbButtonComponent"], _nebular_theme__WEBPACK_IMPORTED_MODULE_4__["NbSpinnerDirective"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterLink"]],
        styles: [".header[_ngcontent-%COMP%] {\n  background-color: #232d9a;\n}\n\n.form-group[_ngcontent-%COMP%] {\n  padding: 10px;\n}\n\n.register-container[_ngcontent-%COMP%] {\n  margin: auto;\n  text-align: center;\n}\n\n.error[_ngcontent-%COMP%] {\n  color: red;\n}\n\n\n\n@media only screen and (min-width: 660px) {\n  .register-container[_ngcontent-%COMP%] {\n    margin: auto;\n    width: 500px;\n    text-align: center;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxccmVnaXN0ZXIuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSx5QkFBQTtBQUNKOztBQUVBO0VBQ0ksYUFBQTtBQUNKOztBQUVBO0VBQ0ksWUFBQTtFQUNBLGtCQUFBO0FBQ0o7O0FBRUE7RUFDSSxVQUFBO0FBQ0o7O0FBRUEsdUZBQUE7O0FBQ0E7RUFDSTtJQUNJLFlBQUE7SUFDQSxZQUFBO0lBQ0Esa0JBQUE7RUFDTjtBQUNGIiwiZmlsZSI6InJlZ2lzdGVyLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmhlYWRlciB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMjMyZDlhO1xyXG59XHJcblxyXG4uZm9ybS1ncm91cCB7XHJcbiAgICBwYWRkaW5nOiAxMHB4O1xyXG59XHJcblxyXG4ucmVnaXN0ZXItY29udGFpbmVyIHtcclxuICAgIG1hcmdpbjogYXV0bztcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjsgIFxyXG59XHJcblxyXG4uZXJyb3Ige1xyXG4gICAgY29sb3I6IHJlZDtcclxufVxyXG5cclxuLyogTWVkaWEgcXVlcnkgZm9yIHRhYmxldCB2aWV3cG9ydCB0YXJnZXRzIHNjcmVlbiBzaXplIHdpdGggYSBtaW5pbXVtIHdpZHRoIG9mIDY2MHB4LiAqL1xyXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDY2MHB4KSB7XHJcbiAgICAucmVnaXN0ZXItY29udGFpbmVyIHtcclxuICAgICAgICBtYXJnaW46IGF1dG87XHJcbiAgICAgICAgd2lkdGg6IDUwMHB4OyBcclxuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7ICBcclxuICAgIH1cclxuXHJcbn1cclxuIl19 */"]
      });
      /***/
    },

    /***/
    "MpY8":
    /*!**************************************************************!*\
      !*** ./src/app/views/dashboard/profile/profile.component.ts ***!
      \**************************************************************/

    /*! exports provided: ProfileComponent */

    /***/
    function MpY8(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "ProfileComponent", function () {
        return ProfileComponent;
      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _nebular_theme__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @nebular/theme */
      "aceb");

      var ProfileComponent = /*#__PURE__*/function () {
        function ProfileComponent() {
          _classCallCheck(this, ProfileComponent);
        }

        _createClass(ProfileComponent, [{
          key: "ngOnInit",
          value: function ngOnInit() {}
        }]);

        return ProfileComponent;
      }();

      ProfileComponent.ɵfac = function ProfileComponent_Factory(t) {
        return new (t || ProfileComponent)();
      };

      ProfileComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
        type: ProfileComponent,
        selectors: [["app-profile"]],
        decls: 51,
        vars: 0,
        consts: [[1, "container"], [1, "line"], [1, "row"], [1, "form"], [1, "col-25"], ["for", "firstName"], [1, "col-75"], ["type", "text", "id", "firstName", "nbInput", "", "placeholder", "First Name"], ["for", "lastName"], ["type", "text", "id", "lastName", "nbInput", "", "placeholder", "Last Name"], ["for", "email"], ["type", "email", "id", "email", "nbInput", "", "placeholder", "Email", "disabled", ""], ["nbButton", "", "status", "success"], ["type", "password", "nbInput", "", "fullWidth", "", "status", "primary", "placeholder", "Current Password"], ["type", "password", "nbInput", "", "fullWidth", "", "status", "primary", "placeholder", "New Password"], ["type", "password", "nbInput", "", "fullWidth", "", "status", "primary", "placeholder", "Verify New Password"], ["nbButton", "", "status", "control"]],
        template: function ProfileComponent_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "nb-layout-column");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "h3");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Basic Info");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 1);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 2);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "nb-card-body", 3);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 4);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "label", 5);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "First Name");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 6);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](11, "input", 7);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 2);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "nb-card-body", 3);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 4);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "label", 8);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "Last Name");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 6);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](18, "input", 9);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "div", 2);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "nb-card-body", 3);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 4);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "label", 10);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "Email");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 6);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](25, "input", 11);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "div", 2);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "nb-card-body");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "div", 4);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "button", 12);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, "Update Info");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "div", 1);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "div", 2);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "nb-card-body");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "h4");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35, "Change Password");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "div", 6);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](37, "input", 13);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "div", 2);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "nb-card-body");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "div", 6);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](41, "input", 14);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "div", 2);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "nb-card-body");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "div", 6);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](45, "input", 15);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "div", 2);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "nb-card-body");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "div", 4);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "button", 16);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, "Change Password");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          }
        },
        directives: [_nebular_theme__WEBPACK_IMPORTED_MODULE_1__["NbLayoutColumnComponent"], _nebular_theme__WEBPACK_IMPORTED_MODULE_1__["NbCardBodyComponent"], _nebular_theme__WEBPACK_IMPORTED_MODULE_1__["NbInputDirective"], _nebular_theme__WEBPACK_IMPORTED_MODULE_1__["NbButtonComponent"]],
        styles: [".line[_ngcontent-%COMP%] {\n  border-top: 1px solid black;\n  margin-bottom: 20px !important;\n}\n\ninput[_ngcontent-%COMP%], textarea[_ngcontent-%COMP%], button[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 12px;\n  border: 1px solid gray !important;\n  resize: vertical;\n}\n\ninput[_ngcontent-%COMP%]:focus, textarea[_ngcontent-%COMP%]:focus {\n  border: 2px solid black !important;\n  border-radius: 4px;\n}\n\nlabel[_ngcontent-%COMP%] {\n  padding: 10px 10px 10px 5px;\n  display: inline-block;\n}\n\n.container[_ngcontent-%COMP%] {\n  border-radius: 5px;\n  padding: 0px 20px 20px 20px;\n}\n\n.col-25[_ngcontent-%COMP%], .col-75[_ngcontent-%COMP%] {\n  float: left;\n  width: 100%;\n  margin-top: 0;\n}\n\n.row[_ngcontent-%COMP%]:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n\nbutton[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: 13px !important;\n  margin-bottom: 5px !important;\n}\n\n.header[_ngcontent-%COMP%] {\n  background-color: transparent;\n}\n\n\n\n@media only screen and (min-width: 660px) {\n  .colored-column-success[_ngcontent-%COMP%] {\n    background-color: white;\n  }\n\n  button[_ngcontent-%COMP%] {\n    width: unset;\n  }\n\n  \n  .col-25[_ngcontent-%COMP%] {\n    float: left;\n    width: 25%;\n    margin-top: 6px;\n  }\n\n  \n  .col-75[_ngcontent-%COMP%] {\n    float: left;\n    width: 75%;\n    margin-top: 6px;\n  }\n\n  .form[_ngcontent-%COMP%] {\n    padding: unset;\n  }\n\n  .row[_ngcontent-%COMP%] {\n    padding: 10px;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxccHJvZmlsZS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUNFLDJCQUFBO0VBQ0EsOEJBQUE7QUFBRjs7QUFHQTs7O0VBR0UsV0FBQTtFQUNBLGFBQUE7RUFDQSxpQ0FBQTtFQUNBLGdCQUFBO0FBQUY7O0FBR0E7O0VBRUUsa0NBQUE7RUFDQSxrQkFBQTtBQUFGOztBQUdBO0VBQ0UsMkJBQUE7RUFDQSxxQkFBQTtBQUFGOztBQUdBO0VBQ0Usa0JBQUE7RUFDQSwyQkFBQTtBQUFGOztBQUdBOztFQUVFLFdBQUE7RUFDQSxXQUFBO0VBQ0EsYUFBQTtBQUFGOztBQUdBO0VBQ0UsV0FBQTtFQUNBLGNBQUE7RUFDQSxXQUFBO0FBQUY7O0FBRUE7RUFDRSxXQUFBO0VBQ0EsMkJBQUE7RUFDQSw2QkFBQTtBQUNGOztBQUVBO0VBQ0UsNkJBQUE7QUFDRjs7QUFFQSx1RkFBQTs7QUFDQTtFQUVFO0lBQ0UsdUJBQUE7RUFBRjs7RUFHQTtJQUNFLFlBQUE7RUFBRjs7RUFHQSwwQ0FBQTtFQUNBO0lBQ0UsV0FBQTtJQUNBLFVBQUE7SUFDQSxlQUFBO0VBQUY7O0VBR0EsMENBQUE7RUFDQTtJQUNFLFdBQUE7SUFDQSxVQUFBO0lBQ0EsZUFBQTtFQUFGOztFQUdBO0lBQ0UsY0FBQTtFQUFGOztFQUdBO0lBQ0UsYUFBQTtFQUFGO0FBQ0Y7O0FBR0EsK0VBQUEiLCJmaWxlIjoicHJvZmlsZS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4ubGluZSB7XHJcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIGJsYWNrO1xyXG4gIG1hcmdpbi1ib3R0b206IDIwcHggIWltcG9ydGFudDtcclxufVxyXG5cclxuaW5wdXQsXHJcbnRleHRhcmVhLFxyXG5idXR0b24ge1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIHBhZGRpbmc6IDEycHg7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgZ3JheSAhaW1wb3J0YW50O1xyXG4gIHJlc2l6ZTogdmVydGljYWw7XHJcbn1cclxuXHJcbmlucHV0OmZvY3VzLFxyXG50ZXh0YXJlYTpmb2N1cyB7XHJcbiAgYm9yZGVyOiAycHggc29saWQgYmxhY2sgIWltcG9ydGFudDtcclxuICBib3JkZXItcmFkaXVzOiA0cHg7XHJcbn1cclxuXHJcbmxhYmVsIHtcclxuICBwYWRkaW5nOiAxMHB4IDEwcHggMTBweCA1cHg7XHJcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG59XHJcblxyXG4uY29udGFpbmVyIHtcclxuICBib3JkZXItcmFkaXVzOiA1cHg7XHJcbiAgcGFkZGluZzogMHB4IDIwcHggMjBweCAyMHB4O1xyXG59XHJcblxyXG4uY29sLTI1LFxyXG4uY29sLTc1IHtcclxuICBmbG9hdDogbGVmdDtcclxuICB3aWR0aDogMTAwJTtcclxuICBtYXJnaW4tdG9wOiAwO1xyXG59XHJcblxyXG4ucm93OmFmdGVyIHtcclxuICBjb250ZW50OiBcIlwiO1xyXG4gIGRpc3BsYXk6IHRhYmxlO1xyXG4gIGNsZWFyOiBib3RoO1xyXG59XHJcbmJ1dHRvbiB7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgbWFyZ2luLXRvcDogMTNweCAhaW1wb3J0YW50O1xyXG4gIG1hcmdpbi1ib3R0b206IDVweCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4uaGVhZGVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcclxufVxyXG5cclxuLyogTWVkaWEgcXVlcnkgZm9yIHRhYmxldCB2aWV3cG9ydCB0YXJnZXRzIHNjcmVlbiBzaXplIHdpdGggYSBtaW5pbXVtIHdpZHRoIG9mIDY2MHB4LiAqL1xyXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDY2MHB4KSB7XHJcbiAgXHJcbiAgLmNvbG9yZWQtY29sdW1uLXN1Y2Nlc3Mge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XHJcbiAgfVxyXG5cclxuICBidXR0b24ge1xyXG4gICAgd2lkdGg6IHVuc2V0O1xyXG4gIH1cclxuXHJcbiAgLyogRmxvYXRpbmcgY29sdW1uIGZvciBsYWJlbHM6IDI1JSB3aWR0aCAqL1xyXG4gIC5jb2wtMjUge1xyXG4gICAgZmxvYXQ6IGxlZnQ7XHJcbiAgICB3aWR0aDogMjUlO1xyXG4gICAgbWFyZ2luLXRvcDogNnB4O1xyXG4gIH1cclxuXHJcbiAgLyogRmxvYXRpbmcgY29sdW1uIGZvciBpbnB1dHM6IDc1JSB3aWR0aCAqL1xyXG4gIC5jb2wtNzUge1xyXG4gICAgZmxvYXQ6IGxlZnQ7XHJcbiAgICB3aWR0aDogNzUlO1xyXG4gICAgbWFyZ2luLXRvcDogNnB4O1xyXG4gIH1cclxuXHJcbiAgLmZvcm0ge1xyXG4gICAgcGFkZGluZzogdW5zZXQ7XHJcbiAgfVxyXG5cclxuICAucm93IHtcclxuICAgIHBhZGRpbmc6IDEwcHg7XHJcbiAgfVxyXG59XHJcblxyXG4vKiBNZWRpYSBxdWVyeSBmb3IgZGVza3RvcCB2aWV3cG9ydCB0YXJnZXRzIHNjcmVlbnMgYSBtaW5pbXVtIHdpZHRoIG9mIDgzMHB4LiAqL1xyXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDgzMHB4KSB7XHJcbn1cclxuIl19 */"]
      });
      /***/
    },

    /***/
    "NUQi":
    /*!*******************************************!*\
      !*** ./src/app/core/guards/auth.guard.ts ***!
      \*******************************************/

    /*! exports provided: AuthGuard */

    /***/
    function NUQi(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "AuthGuard", function () {
        return AuthGuard;
      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");
      /* harmony import */


      var _services_auth_jwt_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ../services/auth/jwt.service */
      "E2yI");

      var AuthGuard = /*#__PURE__*/function () {
        function AuthGuard(router, jwtService) {
          _classCallCheck(this, AuthGuard);

          this.router = router;
          this.jwtService = jwtService;
        }

        _createClass(AuthGuard, [{
          key: "canActivate",
          value: function canActivate(next, state) {
            var isAuth = next.data.isAuth || false;

            if (isAuth && !this.jwtService.isAuthenticated()) {
              // is not logged in
              return true;
            }

            if (isAuth && this.jwtService.isAuthenticated()) {
              // logged in true and isAuth
              this.router.navigate(['/dashboard/profile']);
              return false;
            }

            if (this.jwtService.isAuthenticated()) {
              // logged in so return true
              return true;
            } // not logged in so redirect to login page with the return url


            this.router.navigate(['/auth/login'], {
              queryParams: {
                returnUrl: state.url
              }
            });
            return false;
          }
        }]);

        return AuthGuard;
      }();

      AuthGuard.ɵfac = function AuthGuard_Factory(t) {
        return new (t || AuthGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_services_auth_jwt_service__WEBPACK_IMPORTED_MODULE_2__["JwtService"]));
      };

      AuthGuard.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
        token: AuthGuard,
        factory: AuthGuard.ɵfac,
        providedIn: 'root'
      });
      /***/
    },

    /***/
    "Sy1n":
    /*!**********************************!*\
      !*** ./src/app/app.component.ts ***!
      \**********************************/

    /*! exports provided: AppComponent */

    /***/
    function Sy1n(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "AppComponent", function () {
        return AppComponent;
      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _nebular_theme__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @nebular/theme */
      "aceb");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");

      var AppComponent = function AppComponent() {
        _classCallCheck(this, AppComponent);
      };

      AppComponent.ɵfac = function AppComponent_Factory(t) {
        return new (t || AppComponent)();
      };

      AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
        type: AppComponent,
        selectors: [["app-root"]],
        decls: 4,
        vars: 0,
        template: function AppComponent_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "nb-layout");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "nb-layout-header");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "nb-layout-column");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "router-outlet");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          }
        },
        directives: [_nebular_theme__WEBPACK_IMPORTED_MODULE_1__["NbLayoutComponent"], _nebular_theme__WEBPACK_IMPORTED_MODULE_1__["NbLayoutHeaderComponent"], _nebular_theme__WEBPACK_IMPORTED_MODULE_1__["NbLayoutColumnComponent"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterOutlet"]],
        styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhcHAuY29tcG9uZW50LnNjc3MifQ== */"]
      });
      /***/
    },

    /***/
    "ZAI4":
    /*!*******************************!*\
      !*** ./src/app/app.module.ts ***!
      \*******************************/

    /*! exports provided: tokenGetter, AppModule */

    /***/
    function ZAI4(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "tokenGetter", function () {
        return tokenGetter;
      });
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "AppModule", function () {
        return AppModule;
      });
      /* harmony import */


      var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/platform-browser */
      "jhN1");
      /* harmony import */


      var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/common */
      "ofXK");
      /* harmony import */


      var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/common/http */
      "tk/3");
      /* harmony import */


      var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! @angular/forms */
      "3Pt+");
      /* harmony import */


      var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/platform-browser/animations */
      "R1ws");
      /* harmony import */


      var _nebular_eva_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! @nebular/eva-icons */
      "tR1z");
      /* harmony import */


      var _views_dashboard_profile_profile_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! ./views/dashboard/profile/profile.component */
      "MpY8");
      /* harmony import */


      var _nebular_theme__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
      /*! @nebular/theme */
      "aceb");
      /* harmony import */


      var _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
      /*! @auth0/angular-jwt */
      "Nm8O");
      /* harmony import */


      var _app_routing_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
      /*! ./app-routing.module */
      "vY5A");
      /* harmony import */


      var _app_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
      /*! ./app.component */
      "Sy1n");
      /* harmony import */


      var _views_auth_login_login_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
      /*! ./views/auth/login/login.component */
      "/kjZ");
      /* harmony import */


      var _views_auth_register_register_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(
      /*! ./views/auth/register/register.component */
      "LN9C");
      /* harmony import */


      var _core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(
      /*! ./core/guards/auth.guard */
      "NUQi");
      /* harmony import */


      var _core_services_auth_token_interceptor_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(
      /*! ./core/services/auth/token-interceptor.service */
      "6+iD");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");

      function tokenGetter() {
        return localStorage.getItem('token');
      }

      var AppModule = function AppModule() {
        _classCallCheck(this, AppModule);
      };

      AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵdefineNgModule"]({
        type: AppModule,
        bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_10__["AppComponent"]]
      });
      AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵdefineInjector"]({
        factory: function AppModule_Factory(t) {
          return new (t || AppModule)();
        },
        providers: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_13__["AuthGuard"], {
          provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HTTP_INTERCEPTORS"],
          useClass: _core_services_auth_token_interceptor_service__WEBPACK_IMPORTED_MODULE_14__["TokenInterceptorService"],
          multi: true
        }],
        imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"], _app_routing_module__WEBPACK_IMPORTED_MODULE_9__["AppRoutingModule"], _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__["BrowserAnimationsModule"], _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbThemeModule"].forRoot({
          name: 'default'
        }), _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbLayoutModule"], _nebular_eva_icons__WEBPACK_IMPORTED_MODULE_5__["NbEvaIconsModule"], _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbIconModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"], _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbSidebarModule"].forRoot(), _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbButtonModule"], _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbMenuModule"].forRoot(), _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbTabsetModule"], _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbRouteTabsetModule"], _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbInputModule"], _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbCardModule"], _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_8__["JwtModule"].forRoot({
          config: {
            tokenGetter: tokenGetter
          }
        }), _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbSpinnerModule"]]]
      });

      (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵsetNgModuleScope"](AppModule, {
          declarations: [_app_component__WEBPACK_IMPORTED_MODULE_10__["AppComponent"], _views_auth_login_login_component__WEBPACK_IMPORTED_MODULE_11__["LoginComponent"], _views_auth_register_register_component__WEBPACK_IMPORTED_MODULE_12__["RegisterComponent"], _views_dashboard_profile_profile_component__WEBPACK_IMPORTED_MODULE_6__["ProfileComponent"]],
          imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"], _app_routing_module__WEBPACK_IMPORTED_MODULE_9__["AppRoutingModule"], _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__["BrowserAnimationsModule"], _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbThemeModule"], _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbLayoutModule"], _nebular_eva_icons__WEBPACK_IMPORTED_MODULE_5__["NbEvaIconsModule"], _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbIconModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"], _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbSidebarModule"], // NbSidebarModule.forRoot(), //if this is your app.module
          _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbButtonModule"], _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbMenuModule"], _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbTabsetModule"], _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbRouteTabsetModule"], _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbInputModule"], _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbCardModule"], _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_8__["JwtModule"], _nebular_theme__WEBPACK_IMPORTED_MODULE_7__["NbSpinnerModule"]]
        });
      })();
      /***/

    },

    /***/
    "vY5A":
    /*!***************************************!*\
      !*** ./src/app/app-routing.module.ts ***!
      \***************************************/

    /*! exports provided: AppRoutingModule */

    /***/
    function vY5A(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function () {
        return AppRoutingModule;
      });
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");
      /* harmony import */


      var _views_auth_logout_logout_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./views/auth/logout/logout.component */
      "GJs9");
      /* harmony import */


      var _views_auth_login_login_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ./views/auth/login/login.component */
      "/kjZ");
      /* harmony import */


      var _views_auth_register_register_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ./views/auth/register/register.component */
      "LN9C");
      /* harmony import */


      var _views_dashboard_profile_profile_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! ./views/dashboard/profile/profile.component */
      "MpY8");
      /* harmony import */


      var _core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! ./core/guards/auth.guard */
      "NUQi");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");

      var routes = [{
        path: 'auth',
        canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_5__["AuthGuard"]],
        data: {
          isAuth: true
        },
        children: [{
          path: 'login',
          component: _views_auth_login_login_component__WEBPACK_IMPORTED_MODULE_2__["LoginComponent"]
        }, {
          path: 'register',
          component: _views_auth_register_register_component__WEBPACK_IMPORTED_MODULE_3__["RegisterComponent"]
        }]
      }, {
        path: 'logout',
        component: _views_auth_logout_logout_component__WEBPACK_IMPORTED_MODULE_1__["LogoutComponent"]
      }, {
        path: 'dashboard',
        canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_5__["AuthGuard"]],
        children: [{
          path: 'profile',
          component: _views_dashboard_profile_profile_component__WEBPACK_IMPORTED_MODULE_4__["ProfileComponent"]
        }]
      }, {
        path: '**',
        redirectTo: ''
      } //Make sure this object is the last item in the array. Add all new routes above this one.
      ];

      var AppRoutingModule = function AppRoutingModule() {
        _classCallCheck(this, AppRoutingModule);
      };

      AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({
        type: AppRoutingModule
      });
      AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjector"]({
        factory: function AppRoutingModule_Factory(t) {
          return new (t || AppRoutingModule)();
        },
        imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]]
      });

      (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](AppRoutingModule, {
          imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]],
          exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]]
        });
      })();
      /***/

    },

    /***/
    "zUnb":
    /*!*********************!*\
      !*** ./src/main.ts ***!
      \*********************/

    /*! no exports provided */

    /***/
    function zUnb(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony import */


      var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/platform-browser */
      "jhN1");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ./app/app.module */
      "ZAI4");
      /* harmony import */


      var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ./environments/environment */
      "AytR");

      if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
      }

      _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])["catch"](function (err) {
        return console.error(err);
      });
      /***/

    },

    /***/
    "zn8P":
    /*!******************************************************!*\
      !*** ./$$_lazy_route_resource lazy namespace object ***!
      \******************************************************/

    /*! no static exports found */

    /***/
    function zn8P(module, exports) {
      function webpackEmptyAsyncContext(req) {
        // Here Promise.resolve().then() is used instead of new Promise() to prevent
        // uncaught exception popping up in devtools
        return Promise.resolve().then(function () {
          var e = new Error("Cannot find module '" + req + "'");
          e.code = 'MODULE_NOT_FOUND';
          throw e;
        });
      }

      webpackEmptyAsyncContext.keys = function () {
        return [];
      };

      webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
      module.exports = webpackEmptyAsyncContext;
      webpackEmptyAsyncContext.id = "zn8P";
      /***/
    }
  }, [[0, "runtime", "vendor"]]]);
})();
//# sourceMappingURL=main-es5.js.map