const gameInput = { gameName: 'Dicele', publisherName: 'Sagaci' };

$.getScript(
    "https://g.glance-cdn.com/public/content/games/xiaomi/gamesAd.js", 
    "gpid.js"
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
    adUnitName: "Sagaci_Dicele_Gameload_Bottom",
    pageName: 'Sagaci_Dicele',               //Game Name
    categoryName: 'Sagaci',           //Publisher Name
    placementName: 'Gameload',
    containerID: "div-gpt-ad-2",            //Div Id for banner
    height: 250,
    width: 300,
    xc: '12.0',
    yc: '3.0',
    impid: gpID,
}
const StickyObj = {
    adUnitName: "Sagaci_Dicele_Ingame_Bottom",
    pageName: 'Sagaci_Dicele',               //Game Name
    categoryName: 'Sagaci',           //Publisher Name
    placementName: 'Ingame',
    containerID: "banner-ad",            //Div Id for banner
    height: 50,
    width: 320,
    xc: '12.0',
    yc: '3.0',
    impid: gpID,
}

const LBBannerObj = {
    adUnitName: "Sagaci_Dicele_Leaderboard_Top",
    pageName: 'Sagaci_Dicele',               //Game Name
    categoryName: 'Sagaci',           //Publisher Name
    placementName: 'Leaderboard',
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
    adUnitName: "Sagaci_Dicele_FsReplay_Replay",
    placementName: "FsReplay",
    pageName: 'Sagaci_Dicele',
    categoryName: 'Sagaci',
    containerID: '',
    height: '',
    width: '',
    xc: '',
    yc: '',
    impid: gpID,
}
const rewardObj = {
    adUnitName: "Sagaci_Dicele_FsRewarded_Reward",
    placementName: "FsRewarded",
    pageName: 'Sagaci_Dicele',
    categoryName: 'Sagaci',
    containerID: '',
    height: '',
    width: '',
    xc: '',
    yc: '',
    impid: gpID,
}

function bannerCallbacks(obj) {
    
   
    obj.adInstance?.registerCallback('onAdLoadSucceed', (data) => {
        console.log('onAdLoadSucceeded CALLBACK', data);

        if (obj.adUnitName === LBBannerObj.adUnitName ) {
            $("#div-gpt-ad-1").css("display", "flex")
            $(".gameOverDiv").css("margin-top", "0px");
        }
    });

    obj.adInstance?.registerCallback('onAdLoadFailed', (data) => {
        console.log('onAdLoadFailed  CALLBACK', data);


        if (obj.adUnitName === LBBannerObj.adUnitName ) {
            $("#div-gpt-ad-1").css("display", "none")
            $(".gameOverDiv").css("margin-top", "100px");

        }
    });

    obj.adInstance?.registerCallback('onAdDisplayed', (data) => {
        console.log('onAdDisplayed  CALLBACK', data);
    });

   
}






function rewardedCallbacks(obj) {
   
   

    obj.adInstance?.registerCallback('onAdLoadSucceed', (data) => {
        console.log('onAdLoadSucceeded Rewarded CALLBACK', data);
        if (obj.adUnitName === replayObj.adUnitName) {
            is_replay_noFill = false
        }
        if (obj.adUnitName === rewardObj.adUnitName) {
            is_rewarded_noFill = false
        }


    });

    obj.adInstance?.registerCallback('onAdLoadFailed', (data) => {
        console.log('onAdLoadFailed Rewarded CALLBACK', data);
        if (obj.adUnitName ===replayObj.adUnitName) {
            is_replay_noFill = true
        }
        if (obj.adUnitName === rewardObj.adUnitName) {
            is_rewarded_noFill = true
        }


    });

    obj.adInstance?.registerCallback('onAdDisplayed', (data) => {
        console.log('onAdDisplayed Rewarded CALLBACK', data);


    });

   

    obj.adInstance?.registerCallback('onAdClosed', (data) => {
        console.log('onAdClosed Rewarded CALLBACK', data);
    
        if (obj.adUnitName == rewardObj.adUnitName) {
            isRewardedAdClosedByUser = true
        }
        runOnAdClosed();
        isRewardGranted = false
        isRewardedAdClosedByUser = false
    

      
    });

    obj.adInstance?.registerCallback('onAdClicked', (data) => {
        console.log('onAdClicked Rewarded CALLBACK', data);
    });

    obj.adInstance?.registerCallback('onRewardsUnlocked', (data) => {
        console.log('onRewardsUnlocked Rewarded CALLBACK', data);
        
        adCount++;
        updateLocalStorage();
        console.log('replay rewarded the user, updating moves', obj.adUnitName, rewardObj.adUnitName);
        
        if (obj.adUnitName === rewardObj.adUnitName) {
            isRewardGranted = true
        }

    });

}

function runOnAdClosed() {
    console.log('replay runOnAdClosed ', _triggerReason);
    if (_triggerReason === "replay" || _triggerReason === "Retry") {
        console.log('replay ', _triggerReason ,isRewardGranted, isRewardedAdClosedByUser);
        if (_triggerReason === "replay") {
            initBoard();
            closeModal("lose-modal");
            console.log('replay retry game rewardInstance added new ');
        } else if (_triggerReason === "Retry") {
            level--;
            initBoard();
            closeModal("win-modal");
            console.log('replay Retry rewardInstance added new ');
        }
        adCount = 0;
        loadReplayAd();
    } else if (_triggerReason === 'Reward') {
        if (!isRewardGranted && isRewardedAdClosedByUser) {
            adCount = 0;
        } else {
            console.log('replay Reward ',isRewardGranted, isRewardedAdClosedByUser);
            console.log('replay AddMoves ',isRewardGranted, isRewardedAdClosedByUser);
            document.querySelector(".moves-number").innerHTML = moves + 5 * adCount;
            closeModal("lose-modal");    
        }
        _triggerReason = ''
        rewardInstance = window.GlanceGamingAdInterface.loadRewardedAd(rewardObj, rewardedCallbacks);
        console.log('replay rewardInstance added new ');
    }  else if (_triggerReason == 'NextGame') {
        console.log('replay NextGame ',isRewardGranted, isRewardedAdClosedByUser);
        initBoard();
        closeModal("win-modal");

        sendCustomAnalyticsEvent('game_level', {level: level + 1});
        console.log("game_level event added");
        
        adCount = 0;

        // call function for NextGame
        _triggerReason = ''
        rewardInstance = window.GlanceGamingAdInterface.loadRewardedAd(rewardObj, rewardedCallbacks);
        console.log('replay NextGame rewardInstance added new ');
    }
  }

  function replayEvent() { 
    // _triggerReason = 'replay'
    console.log(_triggerReason, is_replay_noFill);
    if(!is_replay_noFill){
        window.GlanceGamingAdInterface.showRewarededAd(replayInstance);
    }else{
        runOnAdClosed();
    }
  
    // LBBannerInstance.destroyAd();
    
    $("#div-gpt-ad-1").html("");
    
  
}

