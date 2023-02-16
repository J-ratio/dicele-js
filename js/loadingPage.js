const gameInput = { gameName: 'MLib', publisherName: 'Sagaci', surface: 'test'};

$.getScript(

   
    "https://g.glance-cdn.com/public/content/games/xiaomi/gamesAd.js",
    "gpid.js",
    "loadingPage.js"

)
    .done(function (script, textStatus) {
        console.log(textStatus);
        window.GlanceGamingAdInterface.setupLibrary(gameInput, successCb, failCb);
    })
    .fail(function (jqxhr, settings, exception) {
        console.log("MLIB load failed, reason : ", exception);
    });


var LPBannerInstance, LBBannerInstance, StickyBannerInstance, replayInstance, GlanceGamingAdInstance, rewardInstance ,_triggerReason;
var is_replay_noFill = false
var is_rewarded_noFill = false
var isRewardGranted = false
var isRewardedAdClosedByUser = false

const LPMercObj = {
    adUnitName: "Sagaci_Dicele",
    pageName: 'Dicele',               //Game Name
    categoryName: 'google',           //Publisher Name
    placementName: 'Test_Banner',
    containerID: "div-gpt-ad-2",            //Div Id for banner
    height: 250,
    width: 300,
    xc: '12.0',
    yc: '3.0',
    impid: gpID,
}
const StickyObj = {
    adUnitName: "Sagaci_Dicele",
    pageName:'Dicele',                        //Game Name
    categoryName: 'google',                   //Publisher Name       
    placementName: 'Test_Banner',
    containerID: "banner-ad",            //Div Id for banner
    height: 50,
    width: 320,
    xc: '12.0',
    yc: '3.0',
    impid: gpID,
}

const LBBannerObj = {
    adUnitName: "Sagaci_Dicele",
    pageName: 'Dicele',               //Game Name
    categoryName: 'google',           //Publisher Name
    placementName: 'Test_Banner',
    containerID: "div-gpt-ad-1",            //Div Id for banner
    height: 250,
    width: 300,
    xc: '12.0',
    yc: '3.0',
    impid: gpID,
}

function successCb() {
    console.log("set up lib success")
    showBumperAd();
}
function failCb(reason) { }



const replayObj = {
    adUnitName: "Sagaci_Dicele",
    placementName: "Test_Rewarded",
    pageName: 'Dicele',
    categoryName: 'google',
    containerID: '',
    height: '',
    width: '',
    xc: '',
    yc: '',
    impid: gpID,
}
const rewardObj = {
    adUnitName: "Sagaci_Dicele",
    placementName: "Test_Rewarded",
    pageName: 'Dicele',
    categoryName: 'google',
    containerID: '',
    height: '',
    width: '',
    xc: '',
    yc: '',
    impid: gpID,
}


//bumperAd scripts start

const isBumperAd = typeof BumperAd !== "undefined" ? true : false;
const isSdkNew = typeof GlanceAndroidInterface !== "undefined" ? true : false;

let isNormalGame = true; //true means playing in browser
let bumperAdStatus = false;
let bumperCallback = false;
let isAdLoaded;

var isMRECEnabledOnLP = false;
try {
  isMRECEnabledOnLP = location.search.substring(1).split("&").find((a) => {return a.startsWith('LPMREC')}).split("=")[1];
} catch (error) {
  console.log("LoadingPage macro missing from URL - ",error); 
}

function sendCustomAnalyticsEvent(eventType, extras) {
  console.log("sendCustomAnalyticsEvent", eventType, extras);
  if (isSdkNew) {
    const data = JSON.stringify(extras);
    GlanceAndroidInterface.sendCustomAnalyticsEvent(eventType, data);
  }
}
function showBumperAd() {

  if(isMRECEnabledOnLP === 'true'){
    LPBannerInstance =  window?.GlanceGamingAdInterface?.showLoadingPageBannerAd(LPMercObj ,bannerCallbacks);
  } else {
    if (isBumperAd) {
      console.log("Bumper Ad...");
      isAdLoaded = BumperAd.isAdLoaded();
      sendCustomAnalyticsEvent("Game_loading_screen_start", {});
      isNormalGame = false;
      BumperAd.showAd();
    }
    else{
      LPBannerInstance =  window?.GlanceGamingAdInterface?.showLoadingPageBannerAd(LPMercObj ,bannerCallbacks);
    }
  }

}

function gameReady() {
  // console.log("gameReady",bumperCallback," ",bumperAdStatus, " ", BumperAd.isAdLoaded()) ;
  if (isBumperAd) {
    if ((bumperCallback && !bumperAdStatus) || !isAdLoaded) {
      $("#blankScreen").css("display", "block");
      sendCustomAnalyticsEvent("game_load", {});
      $("#gotoGame").trigger("click");
    }

    bumperAdStatus = true;
    BumperAd.gameReady();
    // setTimeout(function(){ }, 1500);
  }
}

function onBumperAdError() {
  bumperCallback = true;
  console.log("onBumperAdError");
  if (bumperAdStatus) {
    $("#blankScreen").css("display", "block");
    sendCustomAnalyticsEvent("Game_loading_Screen_end", {});
    $("#gotoGame").trigger("click");
  }
  // else {
  //     $("#blankScreen").css("display", 'block')
  // }
}

function onBumperAdSkipped() {
  bumperCallback = true;
  console.log("onBumperAdSkipped");
  if (bumperAdStatus) {
    $("#blankScreen").css("display", "block");
    sendCustomAnalyticsEvent("Game_loading_Screen_end", {});
    $("#gotoGame").trigger("click");
  }
  // else {
  //     $("#blankScreen").css("display", 'block')
  // }
}

function onBumperAdCompleted() {
  bumperCallback = true;
  console.log("onBumperAdCompleted");
  if (bumperAdStatus) {
    $("#blankScreen").css("display", "block");
    sendCustomAnalyticsEvent("Game_loading_Screen_end", {});
    $("#gotoGame").trigger("click");
  }
  // else {
  //     $("#blankScreen").css("display", 'block')
  // }
}

//bumperAd scripts end

//loader scripts start

//This function will add the loader UI
function addLoader() {
  var loaderUI = `<div id="blankScreen"></div>
        <div id="gotoGame"></div>
        <div id="replayGame"></div>
          <div id="loaderPage">
              <div id = "loaderPageContent">
                  <img src="images/loadingText.png" />

                  <div class="progress-bar">
                      <div class="progress-barnew">
                          <img id = "progressBarImg" src="images/loader.png" />
                      </div>
                  </div>
              </div>
              <div id="div-gpt-ad-2">
             
              
            </div>
          </div>`;

  $("body").append($(loaderUI));
  console.log("loader added...");
  displayLoader();
}

//This function can be called to display the loader
function displayLoader(){
    jQuery(document).ready(function () {
        if (isNormalGame) {
          document.getElementById("loaderPage").style.display = "flex";
        }	
      });
}

//This function will show the progress bar on the loading screen
function progressBar(unityInstance, progress){
  console.log('progressBar ', progress)
  let percentage = progress
  $(".progress-barnew").css("width", percentage + "%");

    if(percentage >= 100){
      goToGame();
      // analytics_game_Load();
    }
}

//setTimeoutSeconds param can be used to delay the transition. By default its value is set to 0.
function goToGame(setTimeoutSeconds=0){
    $("#gotoGame").click(() => {
      
      console.log("GotoGame calling");
      setTimeout(() => {
          $("#blankScreen").fadeOut("slow");
      }, setTimeoutSeconds);

    });
  
    if (!isNormalGame) {
			
        gameReady();
    } else {
       
        setTimeout(() => {
            $("#loaderPage").fadeOut("slow");
        }, setTimeoutSeconds);
        
    }

    
}


//loader scripts end