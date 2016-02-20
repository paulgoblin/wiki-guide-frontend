"use strict";function _toConsumableArray(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}var app=angular.module("wikiApp",["ui.bootstrap","ui.router","LocalStorageModule"]);app.constant("CONST",{API_URL:"http://desolate-sea-75202.herokuapp.com",INITIAL_SEARCH_RAD:"10",MAX_SEARCH_RAD:"1281",REFRESH_DIST:"1"}),app.constant("HELPERS",{calcDist:function(e,r){var t=2,o=69.2,n=(e["long"]-r["long"])*((180-Math.abs(e.lat))/180),i=e.lat-r.lat,c=Math.pow(n,2),l=Math.pow(i,2),s=Math.sqrt(c+l)*o;return s.toPrecision(t)}}),app.run(["UserSrvc","LoginSrvc",function(e,r){e.locate(),r.init(e.requestMe)}]),app.config(["$stateProvider","$urlRouterProvider","localStorageServiceProvider",function(e,r,t){t.setPrefix("userApp"),e.state("main",{url:"/main?login",template:"<main-page></main-page>"}).state("resource",{url:"/resource/:resourceId",template:"<resource-page></resource-page>"}).state("list",{url:"/list",template:"<list-page></list-page>"}),r.otherwise("main")}]),app.controller("appCtrl",["$scope","CONST","UserSrvc","ResourceSrvc","LoginSrvc",function(e,r,t,o,n){n.listen("tokenChange",e,function(){u()}),t.listen("coords",e,function(){o.requestDeck(t.me,t.coords,c())}),t.listen("me",e,function(){return t.me?void o.requestDeck(t.me,t.coords,c()):n.logout()}),o.listen("deck",e,function(){i()&&a()});var i=function(){return o.deck.length<=0},c=function(){return s*r.INITIAL_SEARCH_RAD},l=function(){return c()>r.MAX_SEARCH_RAD},s=1,a=function d(){return s+=s,l()?o.stopSearch():void o.requestDeck(t.me,t.coords,c(),function(e,r){i()&&d()})},u=function(){var e=n.token;if(!e)return t.deleteMe();var r=JSON.parse(atob(e.split(".")[1]));t.requestMe(r.id)}}]),app.service("LoginSrvc",["CONST","$http","$rootScope","$state","localStorageService",function(e,r,t,o,n){var i=this;this.logout=function(){var e=n.get("token");e&&(n.remove("token"),i.token=null,c("tokenChange")),o.go("main",{login:!0})},this.login=function(t){return r.post(e.API_URL+"/users/login",t).success(function(e){l(e)})},this.register=function(t){return r.post(e.API_URL+"/users/register",t).success(function(e){l(e)})},this.listen=function(e,r,o){var n=t.$on(e,o);r.$on("$destroy",n)},this.init=function(e){if(i.token=n.get("token")||null,!i.token)return void o.go("main",{login:!0});try{var t=JSON.parse(atob(i.token.split(".")[1]))}catch(c){return o.go("main",{login:!0}),n.remove("token")}return t.exp<Date.now()/1e3?(console.log("exp",t.exp,Date.now()/1e3),o.go("main",{login:!0}),n.remove("token")):(r.defaults.headers.common.Authorization=i.token,window.location.hash=window.location.hash.replace(/\?.*/,""),void e(t.id))};var c=function(e){t.$emit(e)},l=function(e){i.token="Bearer "+e,n.set("token","Bearer "+e),r.defaults.headers.common.Authorization=e,c("tokenChange")}}]),app.service("ResourceSrvc",["CONST","$http","$rootScope",function(e,r,t){var o=this;this.well=null,this.deck=null,this.requestDeck=function(t,o,n,i){if(t&&o.lat&&o["long"]&&n){i=i||function(){};var l=e.API_URL+"/resources/getDeck"+("/"+n+"/"+o.lat+"/"+o["long"]),s={user:t};return r.post(l,s).success(function(e){c(e),i(null,e)}).error(function(e){console.log("error getting deck",e),i(e)})}},this.addLike=function(t,o){return i(t),o?r.post(e.API_URL+"/users/likeResource/"+t._id).error(function(e){console.log("error liking",e)}):void 0},this.addStrike=function(t,o){return i(t),o?r.post(e.API_URL+"/users/strikeResource/"+t._id).error(function(e){console.log("error striking",e)}):void 0},this.stopSearch=function(){c([{}])},this.setWell=function(e){o.well=e},this.listen=function(e,r,o){var n=t.$on(e,o);r.$on("$destroy",n)};var n=function(e){t.$emit(e)},i=function(e){var r=o.deck.indexOf(e);-1!==r&&(o.deck.splice(r,1),n("deck"))},c=function(e){o.deck=e,o.well||(o.well=e[0]),n("deck")}}]),app.service("UserSrvc",["CONST","HELPERS","$http","$rootScope",function(e,r,t,o){var n=this,i=e.REFRESH_DIST;this.me=null,this.likesDistDict={},this.coords={lat:null,"long":null},this.locationWatcher=null,this.nearby=null,this.locate=function(){"geolocation"in navigator&&(navigator.geolocation.clearWatch(n.locationWatcher),n.locationWatcher=navigator.geolocation.watchPosition(function(e){d(e)>i&&(u(e),c())},function(e){console.log("couldn't find geolocation",e)}))},this.requestMe=function(r,o){o=o||function(){};var i=e.API_URL+"/users/user/"+r;return t.get(i).success(function(e){a(e),c(),o(null,e)}).error(function(e){n.deleteMe(),o(e)})},this.like=function(e,r){return n.me.likes.some(function(r){return r._id===e._id})?r(e):(n.likesDistDict[e.pageid]=l(e),n.me.likes.unshift(e),r(e,"updateDb"),void s("vote"))},this.strike=function(e,r){return n.me.strikes.some(function(r){return r===e._id})?r(e):(n.me.strikes.push(e._id),r(e,"updateDb"),void s("vote"))},this.listen=function(e,r,t){var n=o.$on(e,t);r.$on("$destroy",n)},this.deleteMe=function(){a(null)};var c=function(){n.me&&n.coords.lat&&n.me.likes.length&&(n.likesDistDict={},n.me.likes.forEach(function(e){n.likesDistDict[e.pageid]=l(e)}))},l=function(e){var t=10,o={lat:e.lat,"long":e["long"]};if(!o.lat||!o["long"]||!n.coords)return 0;var i=r.calcDist(o,n.coords),c=t>=i?(t-i)/t:0;return c},s=function(e){o.$emit(e)},a=function(e){n.me=e,s("me")},u=function(e){return e?(n.coords={lat:e.coords.latitude,"long":e.coords.longitude},void s("coords")):n.coords=null},d=function(e){if(!n.coords.lat||!n.coords["long"])return 1/0;var t={};t.lat=e.coords.latitude,t["long"]=e.coords.longitude,r.calcDist(n.coords,t)}}]),app.directive("alertBar",function(){return{restrict:"E",transclude:!0,replace:!0,controller:"alertBarCtrl",controllerAs:"ab",scope:!0,bindToController:{},templateUrl:"js/shared/alertBar/alertBar.html",link:function(e,r,t,o,n){r.append(n())}}}),app.controller("alertBarCtrl",function(){}),app.directive("cardDirective",function(){return{restrict:"A",controller:"cardCtrl",controllerAs:"cc",scope:!0,bindToController:{resource:"="},templateUrl:"js/shared/card/card.html"}}),app.controller("cardCtrl",["$scope","UserSrvc","HELPERS",function(e,r,t){var o=this;o.resourceCoords=function(){return{lat:o.resource.lat,"long":o.resource["long"]}},o.dist=function(){return t.calcDist(r.coords,o.resourceCoords())||""}}]),app.directive("deck",function(){return{restrict:"E",replace:!0,controller:"deckCtrl",controllerAs:"dc",scope:!0,bindToController:{deck:"="},templateUrl:"js/shared/deck/deck.html"}}),app.controller("deckCtrl",["$state","UserSrvc","ResourceSrvc","$timeout",function(e,r,t,o){var n=this,i=.34;n.deck=n.deck||[{}],n.movingCard=null,n.preLoad=function(){return n.deck[1]?n.deck[1].info.imgUrl:""},n.viewWell=function(r){t.well=r,e.go("resource",{resourceId:r._id})},n.like=function(e){n.movingCard||n.deck[0].info&&(c(),n.liked=!0,n.movingCard=angular.copy(e),r.like(e,t.addLike))},n.strike=function(e){n.movingCard||n.deck[0].info&&(c(),n.liked=!1,n.movingCard=angular.copy(e),r.strike(e,t.addStrike))};var c=function(){o(function(){n.movingCard=null},1e3*i)}}]),app.directive("listPage",function(){return{restrict:"E",replace:!0,controller:"listPageCtrl",controllerAs:"lp",scope:!0,bindToController:{},templateUrl:"js/shared/listPage/listPage.html"}}),app.controller("listPageCtrl",["$scope","$state","UserSrvc","ResourceSrvc","HELPERS",function(e,r,t,o,n){var i=this;i.me=t.me||{likes:[]},i.coords=t.coords.lat?t.coords:null,i.nearby=t.nearby,i.ratingScale=10,i.legend=[].concat(_toConsumableArray(Array(i.ratingScale))).map(function(e,r){return"rating"+(r+1)}),i.viewResource=function(e){o.setWell(e),r.go("resource",{resourceId:e._id})},i.sortOrder=function(e){return i.nearby?-t.likesDistDict[e.pageid]:"index"},i.ratingClass=function(e){if(i.nearby){var r=Math.ceil(i.ratingScale*t.likesDistDict[e.pageid]);return"rating"+r}},i.togNearby=function(){t.nearby=!t.nearby},t.listen("me",e,function(){i.me=t.me}),t.listen("coords",e,function(){i.coords=t.coords})}]),app.directive("loginModal",function(){return{restrict:"E",replace:!0,controller:"loginCtrl",controllerAs:"lm",scope:!0,bindToController:{},templateUrl:"js/shared/loginModal/loginModal.html"}}),app.controller("loginCtrl",["$scope","$state","LoginSrvc",function(e,r,t){var o=this;o.token=t.token,o.submitLogin=function(e){t.login(e).success(function(e){r.go("main",{login:null})}).error(function(e){o.loginAlert=e,console.log("error",e)})},o.submitRegister=function(e){t.register(e).success(function(e){r.go("main",{login:null})}).error(function(e){o.registerAlert=e,console.log("error",e)})},o.closeLoginModal=function(){window.location.hash=window.location.hash.replace(/\?.*/,"")},o.closeLoginAlert=function(){return o.loginAlert=null},o.closeRegisterAlert=function(){return o.registerAlert=null}}]),app.directive("navBar",function(){return{restrict:"E",replace:!0,controller:"navBarCtrl",controllerAs:"nb",scope:!0,bindToController:{},templateUrl:"js/shared/navBar/navBar.html"}}),app.controller("navBarCtrl",["LoginSrvc","UserSrvc","ResourceSrvc","$scope","$location",function(e,r,t,o,n){var i=this;i.logout=function(){e.logout()},r.listen("me",o,function(){i.me=r.me}),i.me=r.me,i.selected=window.location.hash.split("/")[1],window.addEventListener("hashchange",function(e){i.selected=window.location.hash.split("/")[1]})}]),app.directive("mainPage",function(){return{restrict:"E",replace:!0,controller:"mainPageCtrl",controllerAs:"mp",scope:!0,bindToController:{},templateUrl:"js/shared/mainPage/mainPage.html"}}),app.controller("mainPageCtrl",["$scope","$stateParams","ResourceSrvc",function(e,r,t){var o=this;o.showLogin=r.login,o.deck=t.deck,t.listen("deck",e,function(){o.deck=t.deck})}]),app.directive("resourcePage",function(){return{restrict:"E",replace:!0,controller:"resourcePageCtrl",controllerAs:"rp",scope:!0,bindToController:{},templateUrl:"js/shared/resourcePage/resourcePage.html"}}),app.controller("resourcePageCtrl",["$scope","$sce","ResourceSrvc","UserSrvc","HELPERS",function(e,r,t,o,n){var i=this,c="https://www.wikipedia.org/";i.well=t.well,i.iframeUrl=r.trustAsResourceUrl(i.well?i.well.info.url:c);var l=function(){if(i.well){var e={lat:i.well.lat,"long":i.well["long"]};return n.calcDist(o.coords,e)||""}};i.dist=l(),o.listen("coords",e,function(){i.dist=l()})}]);