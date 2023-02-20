
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
    if (!isRewardGranted && isRewardedAdClosedByUser) {
    // call function for not earning reward (failure case)
        _triggerReason = ''
        rewardInstance = window.GlanceGamingAdInterface.loadRewardedAd(rewardObj, rewardedCallbacks);
        console.log('replay retry game rewardInstance added new ');
    } else {
        if (_triggerReason === 'replay') {
            console.log('replay TryAgain ',isRewardGranted, isRewardedAdClosedByUser);
            initBoard();
            closeModal("lose-modal");
            // call function for replay
            _triggerReason = ''
            rewardInstance = window.GlanceGamingAdInterface.loadRewardedAd(rewardObj, rewardedCallbacks);
            console.log('replay retry game rewardInstance added new ');
        } else if (_triggerReason === 'Reward') {
            console.log('replay AddMoves ',isRewardGranted, isRewardedAdClosedByUser);
            document.querySelector(".moves-number").innerHTML = moves + 5 * adCount;
            closeModal("lose-modal");
            // call function for earned reward  (success case)
            _triggerReason = ''
            rewardInstance = window.GlanceGamingAdInterface.loadRewardedAd(rewardObj, rewardedCallbacks);
            console.log('replay rewardInstance added new ');
        } else if (_triggerReason == 'Retry') {
            console.log('replay Retry ',isRewardGranted, isRewardedAdClosedByUser);
            level--;
            initBoard();
            closeModal("win-modal");
            // call function for Retry
            _triggerReason = ''
            rewardInstance = window.GlanceGamingAdInterface.loadRewardedAd(rewardObj, rewardedCallbacks);
            console.log('replay Retry rewardInstance added new ');
        } else if (_triggerReason == 'NextGame') {
            console.log('replay NextGame ',isRewardGranted, isRewardedAdClosedByUser);
            initBoard();
            closeModal("win-modal");

            sendCustomAnalyticsEvent('game_level', {level: level});
            console.log("game_level event added");
            
            // call function for NextGame
            _triggerReason = ''
            rewardInstance = window.GlanceGamingAdInterface.loadRewardedAd(rewardObj, rewardedCallbacks);
            console.log('replay NextGame rewardInstance added new ');
        }
    }
  }


  function replayEvent() { 
    _triggerReason = 'replay'
    if(!is_replay_noFill){
        window.GlanceGamingAdInterface.showRewarededAd(replayInstance);
    }else{
        runOnAdClosed();
    }
  
    // LBBannerInstance.destroyAd();
    
    $("#div-gpt-ad-1").html("");
    
  
}

