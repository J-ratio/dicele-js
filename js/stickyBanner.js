

//This function will ad the stickyBanner UI
function addStickyBanner() {
    var stickyBannerDiv = `<div id="bannerOverlay">
                            <div id="banner-ad">
            
                            </div>
                        </div>`;

    $("body").append($(stickyBannerDiv));
    console.log("stickyBannerDiv added...");
}

function refreshStickyBannerAd() {
    console.log("refreshStickyBannerAd")
    addStickyBanner();
    showStickyBannerAd();
    StickyBannerInstance =  window.GlanceGamingAdInterface.showStickyBannerAd(StickyObj,bannerCallbacks);

    var timesRun = 0;
    const runInterval = setInterval(()=> {
       
        if(StickyBannerInstance){
			console.log( StickyBannerInstance,"if in interval")
			StickyBannerInstance.destroyAd();
		}
		
		StickyBannerInstance =  window.GlanceGamingAdInterface.showStickyBannerAd(StickyObj,bannerCallbacks);
    }, 30000);
}

function showStickyBannerAd(){
    console.log("showStickyBannerAd")
    $("#bannerOverlay").css("display","flex");
}