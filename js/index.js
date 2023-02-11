function openSideBar() {
    document.getElementById("sidebar").style.display = "flex";
    document.getElementById("overlay").style.display = "block";
}

function closeSideBar() {
    document.getElementById("sidebar").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function openModal(modalId) {
    closeSideBar();
    document.getElementById(modalId).style.display = "flex";
    if(modalId == "stats-modal"){
        gtag('event', 'statsOpened', {
            'Type': 'statsOpened'
          });
    }
    else if(modalId == "help-modal"){
        gtag('event', 'helpOpened', {
            'Type': 'helpOpened'
          });
    }
    else if(modalId == "archive-modal"){
        gtag('event', 'archiveOpened', {
            'Type': 'archiveOpened'
          });
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

function BackToGame() {

    isArchive = false;
    sortable.option("disabled", false);

    document.querySelector(".game-number").innerHTML = `#${Day
        }`;
        document.querySelector(".game-mode").innerHTML = dailyDicele;

    document.querySelectorAll(".nav-left").forEach((element, index) => {
        if (index == 1) {
            element.style.display = "none";
        }
        else {
            element.style.display = "block";
        }
    })

    openModal("archive-modal");
    closeModal("finish-modal");
    
    solution = Array.from(SolutionArr[Day]);
    UpdateSums();

    state = Array.from(SpawnArr[Day])
    playTime = 0;
    moves = 21;
    document.querySelector(".moves-number").innerHTML = `${21}`;

    if (localStorage.LastResumeDate) {
        date = new Date(localStorage.LastResumeDate)
        if (dateDiffInDays(currentDate, date) == 0) {
            
            const tempArr = JSON.parse(localStorage.save_State);

            for (var i = 0; i < 25; i++) {
                state[i] = tempArr[i % 5][4 - Math.floor(i / 5)];
            }

            playTime = Number(localStorage.TodayPlayTime);
            moves = Number(localStorage.TodaySwapCount);

            document.querySelector(".moves-number").innerHTML = `${localStorage.TodaySwapCount
                }`;

            if (localStorage.LastSolveDate) {
                if (dateDiffInDays(currentDate, new Date(localStorage.LastSolveDate)) == 0) {
                    sortable.option("disabled", true);
                    showFinishModal();
                }
            }
        }
    }

    writeBoard(board, state, solution);

    function showFinishModal() {
        if (localStorage.IsSolved == "false") {
            document.querySelector(".win-container").style.display = "none";
            document.querySelector(".win-text").style.display = "none";
            document.querySelector(".lose-container").style.display = "contents";
        }
        else {
            document.querySelector(".win-container").style.display = "contents";
            document.querySelector(".win-text").style.display = "inline";
            document.querySelector(".lose-container").style.display = "none";
        }


        document.querySelectorAll(".share-timer").forEach((element, index) => {
            element.style.display = "flex";
        })

        document.querySelector(".visit-tomorrow").style.display = "block";

        let stars = "";
        if (localStorage.TodaySwapCount > 0) {
            stars = stars.concat(
                '<img src="/images/star.png" class="finish-star" />'
            );
        } else {
            stars = stars.concat(
                '<img src="/images/no_star.png" class="finish-star" />'
            );
        }
        if (localStorage.TodaySwapCount > 1) {
            stars = stars.concat(
                '<img src="/images/star.png" class="finish-star" />'
            );
        } else {
            stars = stars.concat(
                '<img src="/images/no_star.png" class="finish-star" />'
            );
        }
        if (localStorage.TodaySwapCount > 2) {
            stars = stars.concat(
                '<img src="/images/star.png" class="finish-star" />'
            );
        } else {
            stars = stars.concat(
                '<img src="/images/no_star.png" class="finish-star" />'
            );
        }
        if (localStorage.TodaySwapCount > 3) {
            stars = stars.concat(
                '<img src="/images/star.png" class="finish-star" />'
            );
        } else {
            stars = stars.concat(
                '<img src="/images/no_star.png" class="finish-star" />'
            );
        }
        if (localStorage.TodaySwapCount > 4) {
            stars = stars.concat(
                '<img src="/images/star.png" class="finish-star" />'
            );
        } else {
            stars = stars.concat(
                '<img src="/images/no_star.png" class="finish-star" />'
            );
        }

        document.querySelector("[data-field=win-stars]").innerHTML = stars;

        document.querySelector("[data-field=win-comment]").innerHTML =
            winComment;

        document.querySelector("[data-field=finish-moves]").innerHTML = `${21 - localStorage.TodaySwapCount
            }/21`;

        document.querySelector(".moves-number").innerHTML = `${localStorage.TodaySwapCount
            }`;
            document.querySelector("[data-field=finish-time]").innerHTML = `${Math.floor(localStorage.TodayPlayTime/60)
        }m` + " " + `${localStorage.TodayPlayTime%60}s`;

        document.querySelector(".finish-stats-container").style.display = "flex";
        document.getElementById("finish-timer").style.display = "flex";

        setRemainingTime();

        openModal("finish-modal");

    }

}


function setArchiveList(finishStates, stars) {
    const list = finishStates.map((state, index) => {
        var temp;
        if(stars[index] > 5){
            temp = 5;
        }
        else{
            temp = stars[index];
        }
        const date = new Date(startDate.getTime() + (index + 1) * 86400 * 1000);
        const formattedDate = new Intl.DateTimeFormat("en-in").format(date);
        if (Number(state) === 0)
            return `<div class="archive-list-item" onclick="StartArchiveGame(${index})">
                        <div class="archive-list-item-left">
                            <div class="archive-list-item-number">#${index + 1
                }</div>
                            <div class="archive-list-item-date">${formattedDate}</div>
                        </div>
                        <div class="archive-list-item-right">
                            <span class="archive-list-unattempted"
                                >${unattempted}</span
                            >
                        </div>
                    </div>`;

        if (Number(state) === 1)
            return `<div class="archive-list-item" onclick="StartArchiveGame(${index})">
                        <div class="archive-list-item-left">
                            <div class="archive-list-item-number">#${index + 1
                }</div>
                            <div class="archive-list-item-date">${formattedDate}</div>
                        </div>
                        <div class="archive-list-item-right">
                            <img
                                src="/images/heart_broken.png"
                                class="archive-list-item-right-icon"
                            />
                        </div>
                    </div>`;

        if (Number(state) === 2)
            return `<div class="archive-list-item" onclick="StartArchiveGame(${index})">
                        <div class="archive-list-item-left">
                            <div class="archive-list-item-number">#${index + 1
                }</div>
                            <div class="archive-list-item-date">${formattedDate}</div>
                        </div>
                        <div class="archive-list-item-right">${`
                            <img
                                src="/images/star.png"
                                class="archive-list-item-right-icon"
                            />`.repeat(temp) +
                `
                            <img
                                src="/images/no_star.png"
                                class="archive-list-item-right-icon"
                            />`.repeat(5 - temp)
                }
                        </div>
                    </div>`;
    }).reverse().join('');
    document.getElementById('archive-list').innerHTML = list;
}



function StartArchiveGame(index) {


    gtag('event', 'gameOpen', {
        'LevelType': 'Archive',
        'LevelNum': '' + (index + 1) + ''
      });


    isArchive = true;
    archiveNum = index;

    state = Array.from(SpawnArr[archiveNum+1])
    solution = Array.from(SolutionArr[archiveNum + 1])

    UpdateSums();
    writeBoard(board, state, solution);
    closeModal("archive-modal");
    closeModal("finish-modal");
    document.querySelector(".tut-hand").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    
    closeSideBar();
    sortable.option("disabled", false);
    moves = 21;
    playTime = 0;

    document.querySelector(".game-number").innerHTML = `#${index + 1
        }`;
    document.querySelector(".game-mode").innerHTML = dicele;

    document.querySelector(".moves-number").innerHTML = `${moves
        }`;
    document.querySelectorAll(".nav-left").forEach((element, index) => {
        if (index == 0) {
            element.style.display = "none";
        }
        else {
            element.style.display = "block";
        }
    })


}



function gameFinish(won, movesRemaining, state, timeSpent) {


    var finalArr = new Array(5);
    for (var i = 0; i < 5; i++) {
        finalArr[i] = new Array(5);
        for (var j = 0; j < 5; j++) {
            finalArr[i][j] = state[(4 - j) * 5 + i]
        }
    }

    var LastSolveDate = new Date();
    localStorage.setItem("LastSolveDate", LastSolveDate);
    localStorage.setItem("IsSolved", won);
    localStorage.setItem("TodaySwapCount", movesRemaining);
    localStorage.setItem("TodayPlayTime", timeSpent);
    localStorage.setItem("save_State", JSON.stringify(finalArr));

    if (FirstTime) {
        localStorage.setItem("GamesPlayed", 1);
        var freqArr = [0, 0, 0, 0, 0, 0];
        if (movesRemaining >= 5) {
            localStorage.setItem("StarsCollected", 5);
            freqArr[5] = 1;
        }
        else {
            localStorage.setItem("StarsCollected", (movesRemaining))
            if (won) {
                freqArr[movesRemaining] = 1;
            }

        }
        if (won) {
            localStorage.setItem("CurrentStreak", 1);
            localStorage.setItem("HighestStreak", 1);
        }
        else {
            localStorage.setItem("CurrentStreak", 0);
            localStorage.setItem("HighestStreak", 0);
        }

        localStorage.setItem("freqArr", JSON.stringify(freqArr));
    }
    else {
        localStorage.GamesPlayed = Number(localStorage.GamesPlayed) + 1;
        var freqArr = JSON.parse(localStorage.freqArr);
        if (movesRemaining >= 5) {
            localStorage.StarsCollected = Number(localStorage.StarsCollected) + 5;
            freqArr[5] += 1;
        }
        else {
            localStorage.StarsCollected = Number(localStorage.StarsCollected) + movesRemaining;
            if (won) {
                freqArr[movesRemaining] += 1;
            }
        }
        if (won) {
            localStorage.CurrentStreak = Number(localStorage.CurrentStreak) + 1;
            if (Number(localStorage.CurrentStreak) > Number(localStorage.HighestStreak)) {
                localStorage.HighestStreak = Number(localStorage.CurrentStreak);
            }
        }
        else {
            localStorage.CurrentStreak = 0;
        }

        localStorage.setItem("freqArr", JSON.stringify(freqArr));
    }


    document.querySelectorAll("[data-field=games-played]").forEach(element => element.innerText = `${localStorage.GamesPlayed
        }`)
    document.querySelectorAll("[data-field=win-percent]").forEach(element => element.innerText = `${Math.round((freqArr[0] + freqArr[1] + freqArr[2] + freqArr[3] + freqArr[4] + freqArr[5]) * 100 / localStorage.GamesPlayed)
        }`)
    document.querySelectorAll("[data-field=stars-count]").forEach(element => element.innerText = `${localStorage.StarsCollected
        }`)
    document.querySelectorAll("[data-field=current-streak]").forEach(element => element.innerText = `${localStorage.CurrentStreak
        }`)
    document.querySelectorAll("[data-field=highest-streak]").forEach(element => element.innerText = `${localStorage.HighestStreak
        }`)


    document.querySelector("[data-field=finish-moves]").innerHTML = `${21 - localStorage.TodaySwapCount
        }/21`;
        document.querySelector("[data-field=finish-time]").innerHTML = `${Math.floor(localStorage.TodayPlayTime/60)
            }m` + " " + `${localStorage.TodayPlayTime%60}s`;


    document.querySelectorAll(".stars-progress-count").forEach((element, index) => {
        element.innerText = `${freqArr[index]
            }`
    })


    document.querySelectorAll(".stars-progress-bar").forEach((element, index) => {
        element.style.width = `${Math.round(freqArr[index] * 100 / localStorage.GamesPlayed)
            }%`
    })

    document.querySelector(".invite-friends").style.display = "none";

    openModal("finish-modal");
    document.querySelector(".finish-stats-container").style.display = "flex";
    document.getElementById("finish-timer").style.display = "flex";

    if (won) {
        document.querySelector(".win-container").style.display = "contents";
        document.querySelector(".win-text").style.display = "inline";
        document.querySelector(".lose-container").style.display = "none";
        party.confetti(document.querySelector(".finish-banner-win"), {
            count: 100,
        });
        let stars = "";
        if (movesRemaining > 0) {
            stars = stars.concat(
                '<img src="/images/star.png" class="finish-star" />'
            );
        } else {
            stars = stars.concat(
                '<img src="/images/no_star.png" class="finish-star" />'
            );
        }
        if (movesRemaining > 1) {
            stars = stars.concat(
                '<img src="/images/star.png" class="finish-star" />'
            );
        } else {
            stars = stars.concat(
                '<img src="/images/no_star.png" class="finish-star" />'
            );
        }
        if (movesRemaining > 2) {
            stars = stars.concat(
                '<img src="/images/star.png" class="finish-star" />'
            );
        } else {
            stars = stars.concat(
                '<img src="/images/no_star.png" class="finish-star" />'
            );
        }
        if (movesRemaining > 3) {
            stars = stars.concat(
                '<img src="/images/star.png" class="finish-star" />'
            );
        } else {
            stars = stars.concat(
                '<img src="/images/no_star.png" class="finish-star" />'
            );
        }
        if (movesRemaining > 4) {
            stars = stars.concat(
                '<img src="/images/star.png" class="finish-star" />'
            );
        } else {
            stars = stars.concat(
                '<img src="/images/no_star.png" class="finish-star" />'
            );
        }
        document.querySelector("[data-field=win-stars]").innerHTML = stars;
        document.querySelector("[data-field=win-comment]").innerHTML =
            winComment;
    } else {
        document.querySelector(".win-container").style.display = "none";
        document.querySelector(".win-text").style.display = "none";
        document.querySelector(".lose-container").style.display = "contents";
    }
    document.querySelector("[data-field=finish-moves]").innerHTML = `${21 - movesRemaining
        }/21`;


    document.querySelectorAll(".share-timer").forEach((element, index) => {
        element.style.display = "flex";
    })

    document.querySelector(".visit-tomorrow").style.display = "block";

    setRemainingTime();

    MakeAndStoreShareMsg(won);
    archiveNum = Day - 1;
    gameArchiveFinish(won);

}

function gameArchiveFinish(won) {

    if(!won){
        gtag('event', 'gameEnd', {
        'Status': 'Lose',
        'GameTime': '' + playTime + '',
        'movesCount': '' + (21-moves) + '',
        'matchcount': '' + matches + ''
      });
      }
      else{
        gtag('event', 'gameEnd', {
        'Status': 'Win',
        'GameTime': '' + playTime + '',
        'movesCount': '' + (21-moves) + '',
        'matchcount': '' + matches + ''
      });
      }

    if (localStorage.ArchiveList) {
        var ArchiveList = JSON.parse(localStorage.ArchiveList);
        var ArchiveSwapList = JSON.parse(localStorage.ArchiveSwapList);

        if (won) {
            ArchiveList[archiveNum] = 2;
                ArchiveSwapList[archiveNum] = moves;
        }
        else if (ArchiveList[archiveNum] != 2) {
            ArchiveList[archiveNum] = 1;
        }

        localStorage.ArchiveList = JSON.stringify(ArchiveList);
        localStorage.ArchiveSwapList = JSON.stringify(ArchiveSwapList);
    }
    else {
        var ArchiveList = [];
        (ArchiveList = []).length = Day;
        ArchiveList.fill(0);
        if (won) {
            ArchiveList[archiveNum] = 2;
        }
        else {
            ArchiveList[archiveNum] = 1;
        }

        var ArchiveSwapList = [];
        (ArchiveSwapList = []).length = Day;
        ArchiveSwapList.fill(0);
        ArchiveSwapList[archiveNum] = moves;


        localStorage.setItem("ArchiveList", JSON.stringify(ArchiveList));
        localStorage.setItem("ArchiveSwapList", JSON.stringify(ArchiveSwapList));

    }
    if (archiveNum != Day - 1) {
        setArchiveList(JSON.parse(localStorage.ArchiveList).slice(0, -1), JSON.parse(localStorage.ArchiveSwapList).slice(0, -1))
        setArchiveStats(JSON.parse(localStorage.ArchiveList).slice(0, -1), JSON.parse(localStorage.ArchiveSwapList).slice(0, -1))




        document.querySelector("[data-field=finish-moves]").innerHTML = `${21 - moves
            }/21`;
        document.querySelector("[data-field=finish-time]").innerHTML = `${Math.floor(playTime/60)
            }m` + " " + `${playTime%60}s`;



        if (won) {
            document.querySelector(".win-container").style.display = "contents";
            document.querySelector(".win-text").style.display = "none";
            document.querySelector(".lose-container").style.display = "none";
            let stars = "";
            if (moves > 0) {
                stars = stars.concat(
                    '<img src="/images/star.png" class="finish-star" />'
                );
            } else {
                stars = stars.concat(
                    '<img src="/images/no_star.png" class="finish-star" />'
                );
            }
            if (moves > 1) {
                stars = stars.concat(
                    '<img src="/images/star.png" class="finish-star" />'
                );
            } else {
                stars = stars.concat(
                    '<img src="/images/no_star.png" class="finish-star" />'
                );
            }
            if (moves > 2) {
                stars = stars.concat(
                    '<img src="/images/star.png" class="finish-star" />'
                );
            } else {
                stars = stars.concat(
                    '<img src="/images/no_star.png" class="finish-star" />'
                );
            }
            if (moves > 3) {
                stars = stars.concat(
                    '<img src="/images/star.png" class="finish-star" />'
                );
            } else {
                stars = stars.concat(
                    '<img src="/images/no_star.png" class="finish-star" />'
                );
            }
            if (moves > 4) {
                stars = stars.concat(
                    '<img src="/images/star.png" class="finish-star" />'
                );
            } else {
                stars = stars.concat(
                    '<img src="/images/no_star.png" class="finish-star" />'
                );
            }
            document.querySelector("[data-field=win-stars]").innerHTML = stars;
            document.querySelector("[data-field=win-comment]").innerHTML =
                winComment;
        } else {
            document.querySelector(".win-container").style.display = "none";
            document.querySelector(".win-text").style.display = "none";
            document.querySelector(".lose-container").style.display = "contents";
        }
        document.querySelector("[data-field=finish-moves]").innerHTML = `${21 - moves
            }/21`;

        setRemainingTime();
        document.querySelector(".finish-stats-container").style.display = "none";
        document.getElementById("finish-timer").style.display = "none";

        document.querySelector(".invite-friends").style.display = "block";
        openModal("finish-modal");
    }

}


function setArchiveStats(states, stars) {

    document.querySelector("[data-title=games-played").innerHTML = `${states.filter(x => x != 0).length}/${Day - 1} (${Math.round(states.filter(x => x != 0).length * 100 / (Day - 1))}%)`
    document.querySelector("[data-title=games-completed").innerHTML = `${states.filter(x => x === 2).length}/${Day - 1} (${Math.round(states.filter(x => x === 2).length * 100 / (Day - 1))}%)`
    document.querySelector("[data-title=games-maxed").innerHTML = `${stars.filter(x => x >= 5).length}/${Day - 1} (${Math.round(stars.filter(x => x >= 5).length * 100 / (Day - 1))}%)`

}

function setRemainingTime() {
    const remainingTime = 86400 - (((Date.now() - (new Date()).getTimezoneOffset() * 60 * 1000) / 1000) % 86400);
    const hours = Math.floor(remainingTime / 3600);
    const mins = Math.floor((remainingTime % 3600) / 60)
        .toString()
        .padStart(2, "0");
    const secs = Math.floor(remainingTime % 60)
        .toString()
        .padStart(2, "0");
    const time = `${hours}:${mins}:${secs}`;
    document.querySelectorAll('[data-field=timer-time]').forEach(element => element.innerHTML = time);
    setTimeout(setRemainingTime, 750 - (Date.now() % 1000));
}



function MakeLoseShareMSG(state, solution) {

    var Msg = "";

    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {

            if ((i == 1 && j == 1) || (i == 3 && j == 1) || (i == 1 && j == 3) || (i == 3 && j == 3)) {
                Msg = Msg + "⬜";
            }
            else if (state[5 * i + j] == solution[5 * i + j]) {
                Msg = Msg + "🟩";
            }
            else {
                Msg = Msg + "⬛";
            }

        }
        Msg = Msg + "\n";
    }

    return Msg;

}



function MakeWinShare(star_count) {

    var ShareMsg = "";
    if (star_count == 0) {
        ShareMsg = "🟩🟩🟩🟩🟩\n🟩⬜🟩⬜🟩\n🟩🟩🟩🟩🟩\n🟩⬜🟩⬜🟩\n🟩🟩🟩🟩🟩";
    }
    else if (star_count == 1) {
        ShareMsg = "🟩🟩🟩🟩🟩\n🟩⬜🟩⬜🟩\n🟩🟩⭐🟩🟩\n🟩⬜🟩⬜🟩\n🟩🟩🟩🟩🟩";
    }
    else if (star_count == 2) {
        ShareMsg = "🟩🟩🟩🟩🟩\n🟩⭐🟩⬜🟩\n🟩🟩🟩🟩🟩\n🟩⬜🟩⭐🟩\n🟩🟩🟩🟩🟩";
    }
    else if (star_count == 3) {
        ShareMsg = "🟩🟩🟩🟩🟩\n🟩⭐🟩⬜🟩\n🟩🟩⭐🟩🟩\n🟩⬜🟩⭐🟩\n🟩🟩🟩🟩🟩";
    }
    else if (star_count == 4) {
        ShareMsg = "🟩🟩🟩🟩🟩\n🟩⭐🟩⭐🟩\n🟩🟩🟩🟩🟩\n🟩⭐🟩⭐🟩\n🟩🟩🟩🟩🟩";
    }
    else {
        ShareMsg = "🟩🟩🟩🟩🟩\n🟩⭐🟩⭐🟩\n🟩🟩⭐🟩🟩\n🟩⭐🟩⭐🟩\n🟩🟩🟩🟩🟩";
    }

    return ShareMsg;
}




function MakeAndStoreShareMsg(won) {
    var Msg;

    if (won) {
        Msg = MakeWinShare(moves);
    }
    else {
        Msg = MakeLoseShareMSG(state, solution);
    }

    localStorage.setItem("ShareMsg", Msg);
}

function Share() {

    gtag('event', 'gameShare', {
        'Type': 'ResultShare'
      });

    var toCopy = "";

    if (isArchive) {

        if (matches == 21) {
            var Msg = MakeWinShare(moves);
        }
        else {
            var Msg = MakeLoseShareMSG(state, solution);
        }

        toCopy = "#Dicele " + (archiveNum + 1) + "\n" + "⭐ = " + (moves > 5 ? 5 : moves).toString() + "\n" + "🎲 = " + (21 - moves) + " ⏳ = " + parseInt(playTime / 60) + ":" + playTime % 60 + "\n" + Msg + "\n\n" + "dicele.com";


    }
    else {

        toCopy = "#Dicele " + Day + "\n" + "⭐ = " + (Number(localStorage.TodaySwapCount) > 5 ? 5 : Number(localStorage.TodaySwapCount)).toString() + "\n" + "🎲 = " + (21 - Number(localStorage.TodaySwapCount)).toString() + " ⏳ = " + parseInt(localStorage.TodayPlayTime / 60) + ":" + localStorage.TodayPlayTime % 60 + "\n" + localStorage.ShareMsg + "\n\n" + "dicele.com"

    }


    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(toCopy).then(function () {
            console.debug("Copied to clipboard navigator: " + toCopy);
        }, function (error) {
            console.error("Failed to copy to clipboard navigator", error);
        });
    }


    const isMobileOrTablet = () => {
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };
    if (isMobileOrTablet() && navigator.share) {
        navigator.share({
            text: toCopy
        }).finally(() =>
            document.getElementById("background").click()
        );
    }

}

function statShare() {

    gtag('event', 'gameShare', {
        'Type': 'StatsShare'
      });

    const toCopy = "#Dicele stats" + "\n\n" + "🎮 played - " + localStorage.GamesPlayed + "\n" + "👍win % - " + (Math.round((JSON.parse(localStorage.freqArr)).reduce((partialSum, a) => partialSum + a, 0) * 100 / localStorage.GamesPlayed)) + "\n" + "⭐ stars - " + localStorage.StarsCollected + "\n" + "🔥 streak - " + localStorage.CurrentStreak + "\n\n" + "dicele.com 🎲"

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(toCopy).then(function () {
            console.debug("Copied to clipboard navigator: " + toCopy);
        }, function (error) {
            console.error("Failed to copy to clipboard navigator", error);
        });
    }


    const isMobileOrTablet = () => {
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };
    if (isMobileOrTablet() && navigator.share) {
        navigator.share({
            text: toCopy
        }).finally(() =>
            document.getElementById("background").click()
        );
    }

}

var source;
var dest;
function makeTutorial(showOverlay) {


    source = document.querySelectorAll(`[data-value]`)[state.findIndex((value, index) => value != solution[index])];
    dest = document.querySelectorAll(`[data-value]`)[solution.findIndex((value, index) => value == source.getAttribute('data-value') && state[index] != solution[index])];

    if(showOverlay){
        /*document.getElementById('tut-overlay').style.display = "block";
        document.querySelector(".box-modal").style.left = (source.getBoundingClientRect().x - source.getBoundingClientRect().width) + "px";
        document.querySelector(".box-modal").style.top = (source.getBoundingClientRect().y - 70) + "px";
        document.querySelector(".box-modal").style.display = 'flex';*/
    }
    

    /*source.style.zIndex = "5";
    dest.style.zIndex = "5";
    document.querySelector(".box-modal").style.left = (source.getBoundingClientRect().x - source.getBoundingClientRect().width) + "px";
    document.querySelector(".box-modal").style.top = (source.getBoundingClientRect().y - 70) + "px";
    document.querySelector(".box-modal").style.display = 'flex';
    */

    document.querySelector(".tut-hand").style.left = (source.getBoundingClientRect().x + source.getBoundingClientRect().width / 2) + 'px';
    document.querySelector(".tut-hand").style.top = (source.getBoundingClientRect().y + source.getBoundingClientRect().height / 2) + 'px';
    document.querySelector(".tut-hand").style.display = 'block';
    document.querySelector(".tut-hand").style.setProperty('--translateX', `${dest.getBoundingClientRect().x - source.getBoundingClientRect().x}px`);
    document.querySelector(".tut-hand").style.setProperty('--translateY', `${dest.getBoundingClientRect().y - source.getBoundingClientRect().y}px`);

    isTutorial = true;

}

window.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("w3-modal") && evt.target.id != "finish-modal") {
        evt.target.style.display = "none";
    }
});



const _MS_PER_DAY = 1000 * 60 * 60 * 24;

var startDate = new Date(2022, 9, 25, 00, 00, 00);
var currentDate = new Date();
function dateDiffInDays(date1, date2) {

    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function dateDiffInSeconds(date1, date2) {

    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((utc2 - utc1) / 1000);
}

var Day = dateDiffInDays(startDate, currentDate);

gtag('event', 'gameOpen', {
    'LevelType': 'Daily',
    'LevelNum': '' + (Day) + ''
  });

document.querySelector(".game-number").innerHTML = `#${Day
    }`;

document.querySelectorAll(".nav-left").forEach((element, index) => {
    if (index == 1) {
        element.style.display = "none";
    }
})

document.querySelectorAll(".share-timer").forEach((element, index) => {
    if (index == 0) {
        element.style.display = "none";
    }
})

document.querySelector(".visit-tomorrow").style.display = "none";

const SpawnArr = [[2, 3, 2, 3, 2, 0, 6, 5, 6, 2, 1, 4, 4, 1, 5, 0, 6, 3, 6, 3, 5, 1, 4, 0, 0], [0, 1, 5, 1, 1, 0, 6, 3, 6, 2, 2, 5, 4, 2, 3, 5, 6, 3, 6, 4, 3, 0, 0, 4, 4], [2, 0, 0, 2, 2, 3, 6, 0, 6, 1, 4, 0, 3, 1, 1, 1, 6, 3, 6, 3, 5, 4, 4, 5, 5], [4, 0, 4, 3, 2, 0, 6, 1, 6, 1, 1, 3, 5, 2, 3, 4, 6, 0, 6, 5, 5, 3, 1, 2, 2], [3, 0, 2, 1, 1, 5, 6, 4, 6, 3, 4, 4, 0, 1, 2, 1, 6, 5, 6, 5, 0, 0, 2, 3, 3], [2, 4, 4, 0, 3, 0, 6, 3, 6, 4, 0, 5, 3, 1, 1, 3, 6, 5, 6, 1, 1, 2, 5, 2, 2], [3, 3, 5, 5, 4, 4, 6, 3, 6, 4, 0, 2, 2, 5, 0, 2, 6, 4, 6, 1, 1, 1, 1, 0, 0], [4, 3, 2, 3, 4, 0, 6, 1, 6, 2, 1, 0, 2, 4, 1, 1, 6, 5, 6, 3, 0, 5, 3, 5, 4], [4, 3, 4, 3, 5, 0, 6, 1, 6, 5, 5, 2, 2, 4, 2, 4, 6, 0, 6, 0, 3, 0, 1, 1, 1], [2, 5, 1, 0, 1, 3, 6, 2, 6, 5, 0, 0, 2, 5, 5, 0, 6, 1, 6, 1, 4, 3, 4, 3, 4], [2, 5, 2, 0, 0, 1, 6, 2, 6, 5, 0, 3, 1, 3, 4, 1, 6, 5, 6, 0, 3, 3, 4, 4, 5], [0, 3, 0, 4, 4, 4, 6, 2, 6, 1, 3, 0, 5, 3, 2, 2, 6, 5, 6, 1, 5, 0, 5, 1, 1], [4, 0, 2, 1, 1, 5, 6, 0, 6, 3, 0, 2, 5, 2, 3, 3, 6, 1, 6, 1, 4, 2, 4, 4, 5], [0, 0, 3, 5, 4, 3, 6, 5, 6, 0, 4, 0, 4, 1, 1, 2, 6, 1, 6, 5, 2, 2, 4, 3, 3], [0, 5, 5, 3, 0, 2, 6, 0, 6, 5, 4, 4, 2, 2, 1, 1, 6, 1, 6, 1, 4, 3, 2, 3, 3], [0, 1, 3, 5, 4, 4, 6, 3, 6, 1, 1, 5, 0, 2, 5, 4, 6, 0, 6, 1, 3, 2, 2, 2, 5], [1, 5, 0, 2, 5, 3, 6, 0, 6, 1, 3, 1, 3, 4, 2, 5, 6, 5, 6, 4, 4, 0, 2, 2, 1], [4, 5, 3, 0, 5, 0, 6, 3, 6, 5, 4, 4, 4, 1, 0, 0, 6, 1, 6, 1, 2, 2, 3, 2, 3], [4, 1, 3, 5, 3, 1, 6, 1, 6, 3, 1, 2, 5, 3, 4, 5, 6, 4, 6, 0, 0, 0, 0, 2, 2], [2, 3, 0, 0, 4, 5, 6, 2, 6, 3, 3, 5, 5, 1, 0, 1, 6, 0, 6, 2, 4, 2, 4, 1, 4], [4, 4, 5, 1, 1, 1, 6, 2, 6, 5, 5, 2, 3, 0, 0, 3, 6, 4, 6, 2, 0, 4, 3, 3, 0], [0, 1, 4, 5, 4, 2, 6, 4, 6, 5, 0, 5, 0, 2, 1, 3, 6, 2, 6, 2, 1, 4, 3, 1, 3], [5, 0, 2, 4, 3, 1, 6, 0, 6, 0, 5, 3, 3, 4, 4, 5, 6, 4, 6, 0, 1, 1, 2, 2, 2], [3, 3, 4, 5, 1, 4, 6, 4, 6, 5, 2, 3, 3, 5, 0, 0, 6, 1, 6, 5, 0, 1, 2, 1, 2], [1, 5, 1, 1, 0, 0, 6, 2, 6, 2, 4, 2, 3, 3, 3, 4, 6, 4, 6, 3, 4, 5, 5, 0, 0], [5, 1, 2, 1, 1, 5, 6, 0, 6, 3, 2, 2, 0, 0, 2, 3, 6, 1, 6, 0, 3, 4, 4, 5, 4], [5, 4, 2, 1, 5, 2, 6, 1, 6, 0, 3, 0, 0, 4, 2, 1, 6, 3, 6, 1, 5, 5, 3, 4, 4], [4, 2, 4, 5, 1, 0, 6, 3, 6, 1, 0, 5, 1, 2, 3, 0, 6, 3, 6, 3, 2, 5, 5, 2, 4], [5, 5, 1, 2, 2, 1, 6, 0, 6, 4, 0, 1, 2, 4, 0, 4, 6, 3, 6, 0, 5, 3, 3, 3, 4], [3, 0, 3, 1, 3, 2, 6, 4, 6, 5, 4, 5, 4, 5, 1, 1, 6, 2, 6, 4, 0, 1, 2, 0, 0], [3, 3, 2, 1, 0, 5, 6, 2, 6, 5, 5, 5, 1, 1, 4, 3, 6, 3, 6, 2, 4, 4, 0, 0, 0], [5, 1, 5, 5, 3, 1, 6, 1, 6, 4, 2, 0, 5, 3, 0, 0, 6, 4, 6, 3, 2, 2, 4, 2, 0], [0, 3, 3, 3, 4, 1, 6, 5, 6, 0, 2, 5, 0, 0, 4, 1, 6, 4, 6, 5, 1, 1, 2, 2, 2], [5, 4, 3, 5, 2, 4, 6, 1, 6, 0, 0, 5, 3, 1, 0, 0, 6, 2, 6, 4, 1, 3, 2, 1, 4], [4, 3, 3, 2, 1, 3, 6, 1, 6, 5, 2, 3, 4, 5, 4, 2, 6, 0, 6, 5, 0, 0, 1, 0, 1], [5, 5, 2, 5, 4, 1, 6, 0, 6, 2, 2, 4, 1, 5, 0, 4, 6, 0, 6, 2, 1, 0, 3, 3, 3], [4, 4, 3, 0, 1, 3, 6, 4, 6, 3, 5, 4, 0, 0, 0, 1, 6, 1, 6, 5, 5, 1, 2, 2, 2], [5, 2, 2, 4, 3, 1, 6, 5, 6, 4, 3, 5, 3, 3, 4, 0, 6, 2, 6, 0, 1, 5, 0, 1, 0], [4, 4, 2, 0, 4, 2, 6, 1, 6, 1, 3, 2, 0, 1, 0, 5, 6, 5, 6, 4, 5, 2, 3, 3, 3], [1, 3, 2, 2, 1, 2, 6, 0, 6, 1, 4, 3, 5, 5, 5, 3, 6, 5, 6, 0, 0, 4, 3, 4, 4], [4, 3, 3, 4, 3, 5, 6, 1, 6, 2, 1, 0, 4, 4, 5, 3, 6, 0, 6, 1, 0, 2, 1, 2, 5], [3, 4, 3, 5, 3, 4, 6, 0, 6, 4, 1, 1, 0, 1, 1, 2, 6, 4, 6, 5, 5, 2, 0, 2, 2], [0, 5, 1, 4, 0, 1, 6, 1, 6, 4, 2, 2, 2, 3, 3, 5, 6, 3, 6, 0, 2, 3, 4, 5, 5], [2, 4, 4, 3, 5, 4, 6, 5, 6, 0, 5, 0, 1, 3, 0, 0, 6, 2, 6, 1, 1, 1, 2, 3, 3], [0, 2, 2, 1, 0, 0, 6, 2, 6, 0, 3, 1, 1, 5, 4, 2, 6, 3, 6, 3, 4, 3, 4, 5, 5], [4, 0, 5, 2, 1, 1, 6, 5, 6, 2, 0, 2, 0, 1, 2, 3, 6, 4, 6, 3, 1, 5, 3, 5, 4], [4, 4, 4, 0, 5, 0, 6, 1, 6, 0, 5, 3, 3, 5, 2, 3, 6, 1, 6, 1, 1, 2, 2, 3, 2], [3, 3, 3, 4, 4, 5, 6, 5, 6, 1, 5, 2, 4, 0, 5, 0, 6, 0, 6, 2, 1, 0, 2, 2, 1], [0, 5, 5, 4, 2, 0, 6, 3, 6, 1, 0, 3, 4, 5, 0, 1, 6, 5, 6, 1, 1, 4, 2, 2, 3], [3, 2, 5, 5, 0, 0, 6, 1, 6, 3, 2, 0, 1, 2, 3, 4, 6, 3, 6, 5, 4, 4, 1, 1, 5], [4, 2, 2, 5, 0, 3, 6, 3, 6, 1, 5, 5, 3, 4, 4, 0, 6, 2, 6, 3, 0, 0, 1, 1, 5], [4, 3, 3, 1, 0, 5, 6, 1, 6, 1, 0, 5, 2, 3, 4, 2, 6, 4, 6, 2, 4, 3, 5, 5, 0], [0, 0, 1, 3, 5, 5, 6, 5, 6, 4, 3, 2, 2, 2, 4, 0, 6, 0, 6, 4, 3, 4, 1, 1, 1], [4, 3, 1, 2, 1, 1, 6, 2, 6, 0, 5, 2, 3, 5, 5, 2, 6, 5, 6, 0, 3, 0, 4, 4, 4], [4, 0, 4, 1, 0, 3, 6, 0, 6, 0, 2, 4, 1, 5, 2, 5, 6, 5, 6, 1, 3, 3, 5, 2, 2], [3, 3, 0, 0, 0, 1, 6, 1, 6, 0, 1, 5, 3, 2, 4, 5, 6, 2, 6, 4, 2, 4, 1, 5, 2], [5, 1, 1, 3, 2, 0, 6, 0, 6, 5, 3, 4, 2, 2, 2, 4, 6, 3, 6, 1, 5, 4, 4, 5, 0], [1, 4, 5, 5, 4, 5, 6, 5, 6, 0, 0, 1, 4, 4, 0, 1, 6, 2, 6, 3, 2, 3, 3, 2, 2], [2, 3, 0, 2, 3, 1, 6, 4, 6, 1, 1, 0, 3, 3, 4, 2, 6, 4, 6, 5, 5, 5, 0, 1, 4], [1, 4, 1, 1, 0, 1, 6, 4, 6, 0, 4, 3, 4, 2, 2, 5, 6, 2, 6, 0, 3, 3, 5, 5, 3], [0, 5, 2, 3, 4, 1, 6, 4, 6, 1, 2, 4, 2, 3, 5, 5, 6, 3, 6, 1, 0, 3, 0, 0, 1], [2, 2, 5, 3, 4, 3, 6, 0, 6, 4, 4, 0, 1, 4, 3, 3, 6, 0, 6, 5, 5, 1, 1, 1, 2], [4, 2, 1, 4, 3, 5, 6, 0, 6, 2, 2, 3, 4, 0, 1, 5, 6, 3, 6, 3, 5, 1, 0, 1, 0], [0, 4, 1, 4, 1, 5, 6, 3, 6, 5, 2, 0, 3, 3, 5, 4, 6, 2, 6, 0, 0, 5, 1, 2, 2], [5, 0, 5, 2, 0, 2, 6, 0, 6, 4, 1, 5, 1, 1, 1, 3, 6, 3, 6, 2, 3, 4, 4, 3, 4], [3, 3, 3, 4, 1, 2, 6, 5, 6, 4, 2, 4, 5, 5, 2, 0, 6, 4, 6, 1, 3, 0, 0, 1, 0], [1, 3, 1, 0, 2, 3, 6, 0, 6, 0, 2, 5, 4, 1, 1, 0, 6, 4, 6, 2, 3, 4, 4, 5, 5], [1, 0, 0, 0, 3, 1, 6, 2, 6, 4, 1, 3, 2, 2, 0, 3, 6, 2, 6, 4, 4, 5, 5, 5, 5], [1, 0, 4, 2, 0, 5, 6, 5, 6, 1, 4, 1, 0, 5, 5, 2, 6, 3, 6, 3, 4, 0, 3, 1, 2], [5, 1, 0, 5, 4, 3, 6, 2, 6, 4, 3, 5, 1, 3, 4, 0, 6, 1, 6, 1, 0, 0, 3, 2, 2], [3, 0, 1, 3, 2, 1, 6, 5, 6, 2, 3, 1, 4, 3, 0, 4, 6, 4, 6, 1, 2, 5, 0, 5, 4], [3, 4, 3, 4, 5, 0, 6, 1, 6, 3, 1, 0, 5, 0, 5, 4, 6, 1, 6, 2, 0, 1, 2, 2, 4], [0, 1, 1, 3, 3, 0, 6, 5, 6, 4, 0, 5, 4, 2, 1, 2, 6, 5, 6, 4, 0, 5, 2, 2, 3], [2, 4, 5, 3, 5, 3, 6, 0, 6, 2, 1, 3, 2, 5, 4, 0, 6, 4, 6, 1, 1, 0, 0, 4, 1], [1, 2, 2, 2, 5, 3, 6, 4, 6, 3, 3, 3, 1, 1, 5, 5, 6, 4, 6, 4, 5, 0, 4, 0, 0], [4, 0, 3, 2, 0, 1, 6, 4, 6, 5, 5, 5, 0, 1, 3, 1, 6, 4, 6, 2, 2, 2, 0, 3, 3], [1, 1, 2, 3, 2, 3, 6, 5, 6, 4, 1, 3, 2, 4, 4, 4, 6, 5, 6, 3, 5, 0, 0, 5, 0], [1, 4, 1, 4, 0, 0, 6, 0, 6, 4, 2, 2, 5, 1, 5, 0, 6, 2, 6, 3, 5, 2, 3, 3, 3], [0, 3, 5, 4, 4, 4, 6, 3, 6, 4, 1, 5, 5, 0, 1, 0, 6, 3, 6, 0, 1, 2, 2, 1, 2], [3, 4, 0, 1, 4, 3, 6, 1, 6, 4, 2, 0, 5, 2, 5, 1, 6, 0, 6, 0, 2, 3, 3, 5, 5], [5, 0, 0, 5, 0, 1, 6, 2, 6, 1, 4, 0, 1, 2, 3, 4, 6, 1, 6, 5, 5, 3, 3, 2, 4], [1, 0, 2, 1, 5, 3, 6, 1, 6, 3, 1, 0, 0, 2, 2, 5, 6, 5, 6, 4, 3, 3, 4, 4, 4], [3, 3, 5, 0, 4, 1, 6, 0, 6, 4, 5, 2, 0, 2, 3, 3, 6, 1, 6, 1, 2, 4, 2, 5, 5], [4, 5, 4, 5, 2, 2, 6, 3, 6, 4, 0, 3, 2, 3, 3, 5, 6, 4, 6, 0, 0, 1, 1, 1, 1], [3, 2, 2, 1, 1, 3, 6, 2, 6, 4, 3, 0, 4, 3, 4, 5, 6, 1, 6, 4, 2, 5, 5, 0, 0], [2, 1, 1, 0, 5, 5, 6, 4, 6, 2, 2, 0, 1, 4, 3, 0, 6, 2, 6, 0, 3, 3, 1, 4, 5], [2, 2, 0, 5, 0, 3, 6, 0, 6, 2, 4, 1, 1, 2, 4, 3, 6, 3, 6, 1, 4, 5, 4, 5, 5], [1, 5, 5, 1, 2, 1, 6, 5, 6, 2, 2, 5, 0, 2, 3, 4, 6, 1, 6, 0, 4, 4, 3, 3, 0], [3, 4, 2, 4, 3, 5, 6, 1, 6, 0, 3, 2, 3, 5, 4, 0, 6, 5, 6, 5, 0, 1, 1, 2, 0], [5, 4, 2, 2, 2, 3, 6, 0, 6, 5, 3, 4, 4, 4, 0, 1, 6, 3, 6, 5, 1, 1, 0, 5, 1], [4, 3, 1, 1, 3, 2, 6, 2, 6, 2, 0, 1, 3, 0, 2, 5, 6, 4, 6, 4, 3, 4, 5, 5, 0], [1, 4, 3, 1, 5, 5, 6, 1, 6, 2, 1, 0, 3, 4, 5, 0, 6, 5, 6, 2, 4, 5, 0, 2, 4], [5, 1, 3, 4, 3, 4, 6, 2, 6, 5, 5, 5, 0, 2, 0, 0, 6, 1, 6, 2, 1, 3, 1, 4, 4], [0, 1, 1, 4, 5, 4, 6, 4, 6, 1, 0, 3, 3, 5, 0, 3, 6, 2, 6, 5, 0, 2, 2, 5, 3], [2, 5, 3, 4, 5, 2, 6, 5, 6, 1, 5, 0, 4, 0, 1, 0, 6, 1, 6, 1, 2, 3, 3, 3, 4], [3, 2, 0, 0, 5, 3, 6, 3, 6, 3, 1, 1, 5, 4, 0, 4, 6, 4, 6, 5, 1, 2, 5, 1, 2], [5, 0, 3, 4, 1, 1, 6, 0, 6, 4, 5, 5, 2, 3, 1, 0, 6, 2, 6, 5, 2, 3, 4, 4, 3], [4, 0, 0, 5, 3, 4, 6, 3, 6, 2, 2, 2, 5, 3, 0, 3, 6, 4, 6, 5, 1, 1, 1, 0, 1], [5, 4, 2, 1, 1, 4, 6, 2, 6, 5, 3, 3, 0, 5, 3, 0, 6, 4, 6, 2, 4, 1, 0, 3, 2], [1, 3, 3, 3, 3, 5, 6, 5, 6, 2, 4, 2, 4, 1, 4, 5, 6, 5, 6, 2, 0, 0, 1, 0, 0], [4, 3, 2, 4, 5, 0, 6, 4, 6, 0, 2, 0, 1, 0, 2, 3, 6, 5, 6, 4, 1, 3, 1, 5, 5], [5, 4, 1, 4, 1, 2, 6, 0, 6, 3, 5, 0, 1, 0, 1, 4, 6, 2, 6, 5, 2, 5, 3, 3, 3], [1, 3, 1, 2, 2, 4, 6, 3, 6, 5, 5, 4, 0, 3, 5, 0, 6, 2, 6, 3, 4, 0, 4, 1, 1], [0, 3, 2, 3, 4, 3, 6, 5, 6, 4, 5, 2, 5, 0, 5, 4, 6, 4, 6, 2, 2, 0, 1, 1, 1], [1, 2, 0, 5, 5, 5, 6, 0, 6, 4, 0, 2, 2, 1, 2, 3, 6, 1, 6, 1, 3, 3, 3, 4, 4], [5, 2, 2, 1, 3, 2, 6, 3, 6, 0, 4, 0, 4, 4, 0, 5, 6, 5, 6, 1, 1, 2, 5, 3, 3], [2, 4, 1, 3, 4, 5, 6, 3, 6, 5, 5, 4, 4, 0, 0, 2, 6, 0, 6, 0, 3, 1, 1, 2, 3], [2, 0, 5, 0, 0, 1, 6, 2, 6, 5, 1, 2, 1, 4, 3, 2, 6, 4, 6, 3, 4, 3, 3, 5, 4], [3, 5, 5, 2, 2, 3, 6, 1, 6, 4, 5, 4, 2, 3, 4, 1, 6, 0, 6, 2, 1, 0, 3, 0, 0], [0, 2, 4, 1, 5, 2, 6, 5, 6, 0, 3, 3, 5, 0, 2, 0, 6, 1, 6, 1, 3, 1, 3, 4, 4], [0, 4, 2, 0, 4, 3, 6, 0, 6, 2, 5, 1, 1, 5, 5, 1, 6, 0, 6, 4, 3, 2, 3, 5, 3], [0, 5, 4, 3, 3, 1, 6, 2, 6, 5, 2, 5, 1, 0, 1, 3, 6, 1, 6, 0, 2, 4, 4, 4, 3], [0, 2, 2, 2, 4, 4, 6, 3, 6, 2, 3, 5, 5, 5, 5, 1, 6, 4, 6, 4, 3, 0, 0, 1, 1], [0, 3, 1, 5, 5, 3, 6, 4, 6, 2, 4, 4, 4, 1, 0, 5, 6, 3, 6, 0, 1, 0, 2, 2, 3], [2, 0, 0, 5, 0, 4, 6, 1, 6, 3, 4, 2, 5, 3, 4, 1, 6, 4, 6, 5, 1, 2, 5, 1, 3], [1, 1, 1, 2, 5, 3, 6, 5, 6, 0, 2, 4, 2, 0, 4, 0, 6, 5, 6, 3, 0, 3, 4, 4, 1], [2, 3, 4, 5, 2, 4, 6, 1, 6, 0, 5, 5, 5, 4, 0, 2, 6, 1, 6, 1, 2, 3, 0, 3, 3], [4, 2, 5, 5, 5, 3, 6, 3, 6, 0, 1, 1, 0, 0, 1, 2, 6, 1, 6, 3, 4, 2, 4, 0, 3], [4, 0, 4, 0, 5, 3, 6, 1, 6, 3, 1, 5, 0, 5, 2, 1, 6, 4, 6, 2, 2, 1, 3, 4, 2], [5, 3, 2, 5, 1, 0, 6, 5, 6, 0, 0, 2, 3, 1, 4, 4, 6, 5, 6, 3, 1, 2, 4, 3, 1], [0, 3, 4, 2, 1, 0, 6, 0, 6, 2, 0, 5, 2, 5, 3, 1, 6, 1, 6, 3, 4, 4, 4, 5, 5], [0, 0, 0, 3, 1, 4, 6, 1, 6, 1, 2, 5, 1, 3, 2, 2, 6, 4, 6, 0, 3, 5, 3, 4, 5], [0, 3, 3, 2, 4, 5, 6, 2, 6, 3, 1, 5, 1, 2, 1, 3, 6, 4, 6, 5, 5, 0, 0, 4, 0], [5, 2, 0, 4, 4, 0, 6, 1, 6, 0, 5, 3, 1, 5, 0, 2, 6, 4, 6, 2, 3, 5, 1, 3, 4], [2, 4, 0, 0, 0, 5, 6, 2, 6, 3, 5, 3, 2, 3, 1, 3, 6, 2, 6, 5, 4, 4, 5, 1, 1], [1, 0, 1, 4, 0, 3, 6, 1, 6, 1, 2, 4, 4, 2, 0, 4, 6, 5, 6, 2, 3, 5, 5, 3, 3], [1, 0, 5, 0, 5, 4, 6, 1, 6, 3, 3, 1, 3, 4, 2, 4, 6, 2, 6, 2, 2, 0, 4, 3, 5], [3, 5, 5, 0, 2, 1, 6, 3, 6, 4, 4, 4, 5, 5, 0, 0, 6, 4, 6, 3, 1, 1, 1, 2, 2], [3, 5, 3, 3, 1, 1, 6, 5, 6, 0, 2, 0, 1, 4, 2, 5, 6, 5, 6, 4, 4, 2, 1, 0, 2], [1, 5, 2, 5, 4, 3, 6, 4, 6, 0, 1, 5, 2, 1, 2, 0, 6, 3, 6, 4, 0, 0, 2, 4, 3], [5, 5, 5, 4, 4, 0, 6, 4, 6, 2, 0, 2, 0, 3, 1, 0, 6, 3, 6, 3, 2, 3, 1, 1, 1], [2, 5, 3, 2, 2, 0, 6, 5, 6, 1, 0, 0, 3, 3, 5, 4, 6, 3, 6, 1, 1, 4, 4, 5, 0], [1, 0, 3, 4, 2, 2, 6, 4, 6, 0, 0, 5, 2, 5, 4, 0, 6, 5, 6, 2, 3, 1, 3, 5, 1], [3, 4, 0, 4, 3, 4, 6, 2, 6, 3, 3, 0, 2, 0, 1, 5, 6, 5, 6, 2, 5, 1, 1, 2, 5], [1, 3, 2, 4, 3, 5, 6, 5, 6, 0, 2, 2, 3, 4, 1, 4, 6, 0, 6, 0, 1, 5, 4, 0, 1], [2, 5, 3, 0, 4, 3, 6, 1, 6, 3, 2, 1, 0, 5, 5, 0, 6, 1, 6, 2, 5, 3, 4, 4, 4], [1, 2, 1, 3, 5, 1, 6, 5, 6, 0, 4, 5, 4, 0, 1, 2, 6, 3, 6, 0, 3, 3, 4, 2, 2], [0, 4, 4, 0, 4, 5, 6, 3, 6, 3, 5, 3, 3, 5, 1, 0, 6, 0, 6, 2, 1, 1, 1, 2, 2], [3, 3, 0, 1, 1, 0, 6, 1, 6, 3, 4, 2, 5, 0, 4, 4, 6, 0, 6, 1, 5, 5, 5, 2, 2], [2, 3, 1, 1, 1, 3, 6, 4, 6, 3, 4, 0, 2, 0, 2, 2, 6, 0, 6, 4, 5, 4, 5, 5, 0], [1, 3, 4, 1, 1, 5, 6, 2, 6, 0, 0, 4, 3, 2, 3, 5, 6, 0, 6, 5, 2, 2, 5, 4, 4], [4, 1, 0, 5, 3, 2, 6, 1, 6, 2, 3, 5, 3, 0, 0, 4, 6, 1, 6, 4, 5, 2, 2, 5, 1], [1, 1, 5, 0, 0, 1, 6, 4, 6, 5, 2, 0, 2, 4, 3, 3, 6, 4, 6, 0, 2, 5, 5, 3, 3], [3, 3, 1, 5, 4, 2, 6, 4, 6, 4, 4, 2, 0, 0, 5, 3, 6, 0, 6, 2, 5, 1, 5, 1, 1], [4, 4, 4, 1, 0, 1, 6, 3, 6, 2, 5, 5, 0, 1, 5, 5, 6, 2, 6, 0, 1, 2, 3, 3, 3], [3, 3, 5, 5, 3, 3, 6, 0, 6, 4, 0, 5, 2, 1, 1, 1, 6, 4, 6, 2, 0, 4, 1, 2, 0], [0, 1, 5, 2, 2, 3, 6, 2, 6, 5, 1, 0, 3, 1, 5, 0, 6, 3, 6, 4, 4, 1, 4, 4, 0], [4, 3, 5, 3, 0, 4, 6, 5, 6, 0, 3, 0, 1, 2, 2, 1, 6, 4, 6, 0, 2, 1, 5, 4, 1], [0, 3, 4, 5, 4, 0, 6, 1, 6, 0, 5, 4, 0, 2, 2, 1, 6, 5, 6, 3, 2, 1, 2, 3, 5], [0, 4, 4, 2, 3, 2, 6, 4, 6, 0, 5, 0, 1, 1, 5, 2, 6, 5, 6, 3, 5, 1, 3, 4, 1]]

const SolutionArr = [[0, 1, 3, 1, 2, 2, 6, 2, 6, 2, 1, 3, 3, 5, 5, 3, 6, 4, 6, 0, 4, 4, 5, 0, 0], [5, 0, 0, 2, 3, 5, 6, 5, 6, 4, 3, 4, 2, 4, 1, 3, 6, 2, 6, 3, 0, 1, 4, 0, 1], [5, 5, 3, 0, 0, 5, 6, 2, 6, 3, 3, 0, 0, 2, 2, 1, 6, 1, 6, 3, 4, 1, 1, 4, 4], [3, 3, 1, 1, 1, 0, 6, 3, 6, 2, 5, 2, 0, 1, 3, 2, 6, 0, 6, 4, 2, 4, 5, 4, 5], [2, 5, 1, 0, 2, 2, 6, 0, 6, 4, 1, 1, 3, 5, 4, 0, 6, 3, 6, 3, 3, 4, 5, 0, 1], [1, 4, 0, 1, 0, 4, 6, 0, 6, 3, 5, 3, 2, 5, 4, 2, 6, 5, 6, 1, 1, 2, 2, 3, 3], [1, 5, 4, 2, 2, 2, 6, 3, 6, 4, 4, 1, 4, 5, 5, 3, 6, 3, 6, 0, 0, 0, 0, 1, 1], [5, 2, 1, 5, 1, 2, 6, 0, 6, 1, 2, 5, 0, 4, 0, 1, 6, 3, 6, 3, 3, 3, 4, 4, 4], [0, 2, 3, 2, 2, 4, 6, 1, 6, 4, 0, 3, 1, 0, 4, 0, 6, 3, 6, 1, 1, 4, 5, 5, 5], [1, 3, 0, 2, 1, 3, 6, 0, 6, 2, 1, 4, 4, 1, 5, 4, 6, 2, 6, 5, 3, 5, 5, 0, 0], [3, 4, 1, 3, 5, 1, 6, 2, 6, 2, 2, 0, 0, 0, 3, 3, 6, 4, 6, 4, 5, 5, 5, 0, 1], [5, 5, 5, 2, 5, 3, 6, 0, 6, 1, 0, 4, 2, 4, 4, 1, 6, 3, 6, 0, 0, 1, 1, 3, 2], [0, 5, 5, 0, 4, 3, 6, 4, 6, 3, 5, 4, 4, 0, 1, 1, 6, 1, 6, 1, 2, 2, 2, 2, 3], [5, 3, 0, 4, 2, 0, 6, 0, 6, 2, 3, 2, 0, 3, 3, 1, 6, 4, 6, 5, 4, 1, 4, 5, 1], [5, 0, 3, 3, 2, 3, 6, 3, 6, 5, 4, 4, 1, 1, 2, 0, 6, 0, 6, 5, 4, 2, 1, 2, 1], [1, 4, 5, 2, 1, 3, 6, 4, 6, 3, 0, 1, 5, 4, 3, 2, 6, 1, 6, 0, 2, 0, 2, 5, 5], [2, 2, 2, 4, 5, 2, 6, 4, 6, 1, 0, 0, 0, 3, 3, 3, 6, 4, 6, 5, 5, 1, 1, 5, 1], [1, 0, 2, 3, 4, 2, 6, 3, 6, 5, 3, 2, 1, 0, 4, 5, 6, 0, 6, 1, 3, 0, 4, 4, 5], [1, 5, 2, 4, 0, 0, 6, 0, 6, 5, 0, 1, 4, 2, 2, 4, 6, 5, 6, 1, 1, 3, 3, 3, 3], [1, 0, 4, 4, 1, 1, 6, 2, 6, 3, 3, 5, 3, 4, 4, 0, 6, 5, 6, 5, 0, 0, 2, 2, 2], [0, 5, 3, 4, 2, 2, 6, 1, 6, 3, 1, 3, 0, 1, 3, 0, 6, 4, 6, 2, 4, 4, 0, 5, 5], [1, 4, 3, 4, 2, 5, 6, 4, 6, 5, 0, 1, 0, 3, 0, 2, 6, 1, 6, 1, 2, 2, 5, 3, 4], [1, 3, 1, 0, 2, 5, 6, 4, 6, 5, 1, 5, 0, 3, 2, 4, 6, 2, 6, 2, 3, 4, 4, 0, 0], [1, 1, 3, 2, 1, 3, 6, 3, 6, 4, 1, 2, 4, 0, 5, 3, 6, 2, 6, 5, 4, 5, 5, 0, 0], [1, 5, 1, 4, 1, 2, 6, 5, 6, 0, 5, 4, 2, 0, 4, 2, 6, 3, 6, 0, 3, 3, 0, 3, 4], [2, 4, 0, 2, 1, 0, 6, 5, 6, 0, 1, 4, 5, 4, 5, 2, 6, 0, 6, 2, 1, 1, 3, 3, 3], [0, 1, 0, 1, 5, 2, 6, 0, 6, 2, 2, 4, 3, 4, 3, 3, 6, 4, 6, 4, 5, 5, 5, 1, 1], [3, 1, 4, 1, 3, 5, 6, 1, 6, 0, 5, 3, 0, 0, 5, 5, 6, 2, 6, 2, 3, 2, 2, 4, 4], [5, 2, 0, 4, 2, 1, 6, 1, 6, 2, 4, 3, 0, 3, 3, 3, 6, 4, 6, 4, 5, 5, 0, 0, 1], [4, 3, 0, 4, 1, 0, 6, 3, 6, 1, 1, 4, 1, 2, 0, 4, 6, 5, 6, 5, 2, 0, 5, 2, 3], [1, 2, 1, 0, 0, 5, 6, 0, 6, 4, 4, 4, 5, 2, 3, 2, 6, 3, 6, 3, 3, 5, 5, 0, 1], [4, 1, 0, 4, 1, 4, 6, 3, 6, 0, 0, 5, 3, 5, 5, 3, 6, 5, 6, 2, 0, 1, 2, 2, 2], [1, 5, 5, 2, 2, 3, 6, 0, 6, 4, 4, 5, 2, 2, 0, 0, 6, 0, 6, 3, 3, 4, 1, 1, 1], [4, 1, 0, 5, 5, 2, 6, 2, 6, 4, 4, 5, 3, 0, 0, 0, 6, 1, 6, 1, 3, 2, 1, 3, 4], [3, 4, 0, 1, 1, 5, 6, 3, 6, 0, 1, 2, 2, 4, 3, 2, 6, 0, 6, 1, 3, 4, 5, 5, 0], [0, 0, 5, 3, 2, 2, 6, 5, 6, 2, 2, 3, 4, 4, 3, 4, 6, 5, 6, 5, 0, 0, 1, 1, 1], [5, 0, 0, 2, 0, 1, 6, 0, 6, 2, 2, 3, 1, 5, 5, 4, 6, 4, 6, 3, 3, 4, 1, 1, 4], [4, 5, 0, 3, 2, 3, 6, 3, 6, 2, 0, 0, 5, 5, 3, 4, 6, 2, 6, 5, 4, 1, 0, 1, 1], [3, 4, 2, 5, 2, 1, 6, 5, 6, 4, 1, 1, 2, 4, 5, 3, 6, 2, 6, 3, 3, 4, 0, 0, 0], [3, 1, 5, 1, 3, 1, 6, 0, 6, 4, 5, 2, 4, 4, 3, 2, 6, 3, 6, 4, 2, 5, 5, 0, 0], [3, 2, 2, 3, 5, 1, 6, 0, 6, 2, 1, 0, 3, 3, 0, 4, 6, 1, 6, 1, 4, 4, 4, 5, 5], [2, 5, 2, 3, 3, 0, 6, 2, 6, 4, 2, 3, 5, 5, 0, 4, 6, 1, 6, 4, 4, 0, 1, 1, 1], [5, 5, 5, 3, 4, 1, 6, 0, 6, 4, 4, 3, 3, 5, 3, 2, 6, 0, 6, 0, 2, 2, 1, 1, 2], [3, 3, 0, 5, 4, 2, 6, 5, 6, 1, 3, 5, 4, 0, 2, 4, 6, 1, 6, 2, 0, 0, 3, 1, 1], [2, 2, 4, 4, 2, 3, 6, 2, 6, 4, 5, 5, 0, 3, 5, 1, 6, 3, 6, 0, 3, 0, 0, 1, 1], [4, 5, 4, 1, 0, 3, 6, 1, 6, 1, 5, 0, 0, 3, 1, 2, 6, 2, 6, 3, 2, 4, 5, 2, 5], [1, 0, 5, 2, 1, 2, 6, 5, 6, 5, 1, 0, 2, 4, 1, 2, 6, 3, 6, 3, 0, 3, 3, 4, 4], [4, 2, 2, 0, 2, 2, 6, 3, 6, 1, 0, 4, 4, 0, 3, 0, 6, 3, 6, 1, 5, 5, 5, 5, 1], [2, 3, 4, 3, 5, 3, 6, 0, 6, 0, 2, 1, 0, 2, 1, 1, 6, 0, 6, 4, 1, 4, 5, 5, 5], [2, 4, 1, 4, 3, 2, 6, 2, 6, 3, 1, 0, 5, 3, 5, 3, 6, 4, 6, 5, 0, 5, 1, 1, 0], [1, 1, 0, 3, 3, 5, 6, 1, 6, 2, 4, 0, 2, 3, 3, 4, 6, 4, 6, 2, 5, 5, 5, 0, 0], [3, 5, 5, 5, 1, 2, 6, 0, 6, 1, 5, 1, 2, 4, 0, 0, 6, 2, 6, 3, 3, 3, 4, 4, 4], [2, 4, 3, 1, 5, 3, 6, 2, 6, 0, 2, 1, 0, 0, 3, 4, 6, 1, 6, 4, 5, 0, 4, 1, 5], [2, 4, 5, 4, 5, 3, 6, 3, 6, 3, 0, 1, 2, 1, 2, 0, 6, 2, 6, 4, 0, 5, 1, 4, 5], [2, 5, 3, 0, 3, 1, 6, 0, 6, 0, 4, 2, 1, 4, 3, 0, 6, 5, 6, 1, 2, 5, 2, 4, 5], [0, 1, 1, 4, 5, 0, 6, 1, 6, 3, 4, 2, 1, 3, 2, 3, 6, 2, 6, 4, 0, 5, 0, 2, 5], [3, 1, 5, 1, 2, 4, 6, 4, 6, 4, 2, 0, 1, 2, 2, 5, 6, 3, 6, 3, 4, 5, 5, 0, 0], [0, 3, 1, 4, 5, 4, 6, 2, 6, 1, 4, 3, 2, 0, 3, 4, 6, 1, 6, 2, 5, 2, 5, 5, 0], [1, 5, 4, 3, 1, 0, 6, 2, 6, 5, 5, 3, 0, 1, 2, 2, 6, 1, 6, 0, 3, 4, 3, 4, 4], [0, 3, 5, 4, 4, 2, 6, 2, 6, 5, 2, 4, 3, 4, 5, 3, 6, 0, 6, 0, 3, 1, 1, 1, 1], [5, 4, 4, 2, 1, 0, 6, 3, 6, 0, 1, 2, 4, 0, 2, 3, 6, 5, 6, 0, 5, 1, 3, 1, 3], [2, 2, 2, 0, 3, 4, 6, 5, 6, 0, 0, 1, 1, 5, 3, 3, 6, 3, 6, 4, 4, 4, 1, 5, 1], [2, 1, 2, 5, 5, 2, 6, 0, 6, 1, 1, 4, 3, 4, 3, 4, 6, 5, 6, 1, 3, 3, 0, 0, 0], [3, 4, 3, 2, 4, 5, 6, 5, 6, 2, 2, 4, 1, 2, 3, 5, 6, 5, 6, 0, 0, 0, 1, 0, 1], [3, 5, 3, 3, 5, 4, 6, 5, 6, 3, 0, 2, 4, 4, 4, 0, 6, 0, 6, 2, 1, 1, 1, 1, 2], [0, 5, 1, 1, 4, 5, 6, 1, 6, 4, 2, 2, 0, 2, 3, 3, 6, 0, 6, 0, 3, 3, 4, 4, 5], [0, 2, 1, 3, 1, 4, 6, 3, 6, 0, 4, 4, 5, 5, 2, 0, 6, 3, 6, 0, 5, 2, 1, 4, 1], [4, 4, 5, 3, 0, 5, 6, 3, 6, 3, 1, 0, 5, 4, 1, 5, 6, 1, 6, 0, 0, 2, 2, 2, 2], [0, 2, 0, 3, 2, 4, 6, 5, 6, 0, 1, 1, 2, 4, 1, 1, 6, 3, 6, 3, 4, 0, 5, 5, 5], [5, 2, 4, 3, 3, 2, 6, 0, 6, 3, 5, 2, 0, 5, 4, 4, 6, 0, 6, 0, 1, 1, 3, 1, 1], [0, 4, 0, 3, 4, 0, 6, 2, 6, 1, 3, 4, 3, 3, 5, 1, 6, 2, 6, 1, 2, 4, 1, 5, 5], [1, 2, 2, 1, 4, 5, 6, 5, 6, 3, 3, 2, 1, 5, 4, 0, 6, 3, 6, 0, 4, 4, 0, 0, 1], [5, 5, 2, 4, 5, 2, 6, 0, 6, 2, 1, 1, 3, 1, 3, 0, 6, 2, 6, 4, 3, 5, 4, 0, 0], [5, 2, 1, 1, 1, 0, 6, 2, 6, 3, 1, 3, 4, 0, 2, 3, 6, 4, 6, 5, 4, 4, 5, 0, 0], [0, 1, 0, 1, 4, 1, 6, 5, 6, 2, 2, 4, 4, 2, 4, 5, 6, 5, 6, 3, 3, 5, 0, 3, 3], [2, 1, 2, 3, 1, 0, 6, 4, 6, 3, 5, 5, 5, 3, 3, 0, 6, 4, 6, 4, 1, 0, 0, 2, 2], [0, 0, 1, 0, 1, 1, 6, 5, 6, 2, 2, 2, 4, 3, 3, 5, 6, 3, 6, 3, 4, 4, 4, 5, 5], [1, 3, 0, 3, 3, 2, 6, 1, 6, 3, 2, 5, 4, 1, 2, 0, 6, 4, 6, 5, 2, 4, 5, 0, 0], [3, 5, 0, 3, 0, 0, 6, 0, 6, 5, 4, 1, 2, 2, 5, 1, 6, 2, 6, 1, 4, 1, 3, 4, 4], [1, 0, 3, 0, 0, 0, 6, 3, 6, 1, 4, 4, 3, 5, 2, 1, 6, 2, 6, 2, 3, 4, 5, 5, 5], [4, 2, 2, 2, 3, 5, 6, 1, 6, 1, 3, 5, 5, 1, 0, 3, 6, 1, 6, 4, 0, 4, 5, 0, 0], [0, 3, 5, 0, 3, 1, 6, 4, 6, 5, 4, 5, 0, 3, 1, 4, 6, 4, 6, 1, 1, 2, 2, 3, 2], [4, 2, 5, 0, 0, 0, 6, 1, 6, 4, 5, 1, 2, 1, 5, 3, 6, 2, 6, 2, 3, 3, 3, 4, 5], [5, 4, 5, 0, 3, 0, 6, 0, 6, 3, 4, 1, 2, 1, 1, 5, 6, 1, 6, 2, 2, 3, 3, 4, 4], [5, 0, 5, 1, 1, 0, 6, 2, 6, 2, 5, 3, 2, 3, 0, 4, 6, 1, 6, 3, 2, 3, 4, 4, 4], [5, 2, 4, 2, 3, 4, 6, 3, 6, 5, 0, 1, 0, 1, 4, 5, 6, 3, 6, 2, 0, 0, 1, 1, 2], [1, 3, 5, 5, 0, 0, 6, 5, 6, 4, 1, 4, 2, 0, 3, 4, 6, 2, 6, 1, 3, 4, 5, 2, 2], [2, 2, 1, 5, 2, 2, 6, 5, 6, 1, 3, 5, 3, 4, 5, 3, 6, 4, 6, 1, 0, 0, 4, 0, 1], [2, 0, 5, 5, 4, 4, 6, 0, 6, 3, 1, 3, 2, 2, 3, 5, 6, 3, 6, 1, 4, 0, 5, 0, 1], [0, 1, 4, 2, 4, 1, 6, 2, 6, 2, 5, 3, 3, 3, 4, 4, 6, 5, 6, 5, 1, 0, 0, 5, 1], [5, 2, 5, 0, 5, 0, 6, 4, 6, 0, 2, 1, 3, 3, 1, 4, 6, 1, 6, 3, 3, 2, 2, 4, 4], [0, 4, 4, 5, 5, 0, 6, 4, 6, 0, 3, 1, 2, 5, 3, 5, 6, 1, 6, 1, 2, 5, 1, 4, 2], [0, 0, 4, 1, 0, 2, 6, 2, 6, 3, 3, 1, 2, 1, 1, 3, 6, 4, 6, 4, 4, 5, 5, 5, 5], [0, 0, 3, 2, 4, 1, 6, 3, 6, 1, 1, 4, 2, 4, 5, 2, 6, 3, 6, 0, 5, 5, 3, 5, 0], [5, 1, 0, 1, 1, 0, 6, 1, 6, 2, 2, 0, 4, 4, 2, 3, 6, 3, 6, 5, 3, 3, 5, 4, 5], [4, 4, 5, 5, 3, 4, 6, 5, 6, 1, 2, 5, 0, 2, 2, 3, 6, 0, 6, 1, 3, 1, 0, 3, 1], [2, 1, 5, 2, 1, 5, 6, 1, 6, 3, 0, 0, 5, 2, 0, 3, 6, 3, 6, 5, 3, 4, 4, 4, 4], [0, 5, 2, 2, 2, 1, 6, 1, 6, 3, 1, 1, 3, 4, 0, 3, 6, 3, 6, 4, 4, 5, 5, 0, 0], [5, 2, 1, 4, 0, 2, 6, 0, 6, 5, 2, 2, 0, 1, 5, 4, 6, 4, 6, 1, 4, 3, 3, 3, 3], [0, 1, 5, 5, 1, 0, 6, 0, 6, 1, 2, 5, 5, 2, 2, 3, 6, 3, 6, 3, 3, 4, 0, 4, 4], [1, 2, 2, 3, 3, 5, 6, 5, 6, 2, 3, 4, 5, 1, 1, 4, 6, 4, 6, 4, 5, 0, 0, 0, 0], [2, 3, 4, 1, 4, 5, 6, 5, 6, 2, 0, 2, 5, 0, 5, 4, 6, 1, 6, 3, 3, 3, 0, 1, 1], [4, 0, 0, 1, 3, 3, 6, 1, 6, 2, 3, 2, 4, 2, 4, 0, 6, 1, 6, 5, 5, 4, 1, 3, 5], [5, 2, 0, 5, 1, 1, 6, 4, 6, 4, 2, 1, 4, 2, 5, 4, 6, 3, 6, 2, 3, 5, 3, 0, 0], [0, 4, 0, 5, 5, 4, 6, 2, 6, 0, 3, 1, 5, 3, 1, 1, 6, 3, 6, 3, 2, 4, 1, 2, 2], [4, 2, 2, 4, 2, 2, 6, 3, 6, 5, 0, 5, 0, 0, 5, 3, 6, 3, 6, 1, 1, 1, 3, 4, 5], [3, 3, 0, 5, 3, 4, 6, 2, 6, 1, 4, 3, 0, 4, 2, 0, 6, 2, 6, 5, 0, 4, 5, 1, 1], [4, 3, 2, 5, 1, 0, 6, 1, 6, 5, 2, 1, 3, 2, 2, 3, 6, 3, 6, 4, 4, 4, 0, 5, 0], [2, 5, 2, 1, 1, 2, 6, 0, 6, 0, 3, 3, 5, 4, 0, 0, 6, 1, 6, 2, 3, 4, 3, 4, 5], [5, 5, 2, 3, 1, 3, 6, 0, 6, 4, 4, 4, 3, 5, 0, 3, 6, 0, 6, 0, 1, 2, 1, 1, 2], [1, 0, 1, 3, 3, 2, 6, 0, 6, 4, 2, 1, 0, 4, 2, 3, 6, 0, 6, 4, 3, 5, 5, 5, 5], [0, 4, 3, 1, 4, 5, 6, 1, 6, 4, 1, 1, 5, 2, 2, 4, 6, 5, 6, 0, 2, 3, 3, 3, 0], [2, 2, 1, 5, 5, 2, 6, 3, 6, 0, 5, 5, 2, 3, 4, 3, 6, 4, 6, 4, 1, 4, 1, 0, 0], [5, 5, 0, 0, 4, 4, 6, 3, 6, 4, 3, 2, 2, 2, 4, 3, 6, 5, 6, 3, 0, 1, 0, 1, 1], [2, 0, 2, 5, 5, 1, 6, 3, 6, 4, 1, 1, 3, 5, 0, 2, 6, 3, 6, 0, 4, 4, 1, 4, 5], [4, 4, 0, 3, 4, 0, 6, 4, 6, 2, 3, 2, 3, 2, 1, 5, 6, 5, 6, 5, 0, 0, 1, 1, 1], [5, 0, 3, 2, 1, 3, 6, 4, 6, 5, 5, 4, 4, 3, 5, 1, 6, 0, 6, 0, 3, 2, 1, 2, 2], [5, 1, 1, 1, 1, 2, 6, 3, 6, 2, 2, 5, 3, 5, 0, 3, 6, 3, 6, 0, 4, 0, 4, 0, 4], [1, 4, 3, 2, 5, 2, 6, 5, 6, 3, 4, 0, 5, 2, 1, 0, 6, 3, 6, 4, 0, 1, 1, 2, 4], [0, 2, 2, 1, 4, 5, 6, 1, 6, 0, 1, 1, 0, 2, 3, 3, 6, 5, 6, 3, 3, 4, 4, 5, 5], [4, 1, 0, 5, 3, 2, 6, 2, 6, 5, 4, 0, 1, 0, 1, 4, 6, 4, 6, 5, 0, 5, 3, 2, 3], [1, 1, 0, 2, 0, 0, 6, 1, 6, 2, 3, 3, 2, 1, 0, 4, 6, 3, 6, 3, 4, 4, 5, 5, 5], [2, 0, 4, 3, 1, 1, 6, 0, 6, 5, 0, 3, 0, 1, 5, 3, 6, 5, 6, 2, 4, 3, 2, 4, 5], [3, 1, 1, 0, 5, 4, 6, 0, 6, 4, 3, 4, 0, 0, 5, 1, 6, 3, 6, 4, 5, 2, 2, 5, 2], [1, 1, 2, 4, 4, 5, 6, 2, 6, 0, 4, 5, 0, 5, 0, 3, 6, 2, 6, 3, 3, 5, 1, 3, 2], [0, 4, 5, 2, 3, 1, 6, 3, 6, 1, 0, 2, 4, 5, 3, 5, 6, 0, 6, 4, 1, 3, 1, 2, 4], [5, 5, 4, 5, 0, 3, 6, 1, 6, 3, 2, 0, 0, 1, 1, 2, 6, 2, 6, 2, 3, 4, 4, 3, 4], [0, 0, 0, 4, 3, 3, 6, 2, 6, 2, 1, 5, 4, 1, 3, 1, 6, 1, 6, 2, 4, 4, 5, 5, 5], [2, 5, 5, 0, 2, 3, 6, 0, 6, 0, 1, 5, 5, 4, 1, 2, 6, 1, 6, 2, 1, 4, 3, 3, 4], [0, 0, 1, 4, 1, 4, 6, 0, 6, 0, 4, 1, 3, 5, 2, 2, 6, 2, 6, 4, 2, 3, 5, 3, 5], [4, 4, 4, 3, 0, 5, 6, 5, 6, 5, 1, 0, 2, 0, 3, 0, 6, 1, 6, 1, 1, 2, 2, 3, 3], [4, 2, 0, 5, 2, 0, 6, 4, 6, 1, 4, 2, 5, 1, 3, 3, 6, 0, 6, 1, 0, 3, 3, 5, 5], [2, 2, 2, 4, 2, 3, 6, 3, 6, 1, 1, 3, 0, 1, 5, 4, 6, 4, 6, 5, 5, 5, 0, 0, 0], [5, 0, 2, 1, 2, 4, 6, 1, 6, 1, 3, 3, 2, 0, 5, 3, 6, 2, 6, 3, 4, 4, 5, 5, 0], [0, 2, 2, 3, 1, 3, 6, 2, 6, 5, 3, 1, 1, 0, 4, 0, 6, 4, 6, 4, 0, 4, 5, 5, 1], [3, 2, 3, 3, 0, 5, 6, 0, 6, 4, 3, 4, 4, 5, 5, 1, 6, 5, 6, 0, 1, 4, 1, 2, 2], [3, 5, 0, 2, 4, 1, 6, 4, 6, 4, 3, 5, 3, 1, 2, 5, 6, 1, 6, 0, 2, 2, 0, 1, 3], [4, 2, 0, 3, 1, 4, 6, 0, 6, 1, 4, 2, 3, 2, 0, 5, 6, 5, 6, 3, 5, 3, 0, 1, 1], [4, 1, 5, 3, 3, 5, 6, 5, 6, 1, 4, 3, 4, 0, 0, 1, 6, 1, 6, 5, 0, 0, 2, 2, 2], [4, 2, 1, 0, 1, 2, 6, 0, 6, 2, 1, 5, 5, 2, 0, 3, 6, 0, 6, 3, 4, 3, 4, 4, 5], [4, 3, 2, 5, 1, 0, 6, 5, 6, 5, 3, 4, 2, 5, 2, 0, 6, 0, 6, 2, 1, 4, 4, 1, 3], [3, 0, 4, 4, 2, 1, 6, 2, 6, 3, 0, 2, 4, 5, 5, 5, 6, 5, 6, 0, 1, 1, 1, 3, 2], [4, 2, 4, 1, 3, 0, 6, 4, 6, 1, 5, 5, 5, 2, 5, 3, 6, 2, 6, 1, 3, 3, 0, 0, 0], [0, 0, 5, 2, 3, 1, 6, 3, 6, 4, 0, 1, 5, 1, 2, 1, 6, 3, 6, 2, 4, 5, 4, 4, 5], [0, 5, 5, 2, 5, 5, 6, 0, 6, 1, 0, 1, 1, 2, 1, 2, 6, 3, 6, 3, 3, 3, 4, 4, 4], [0, 1, 3, 3, 5, 5, 6, 4, 6, 3, 3, 5, 4, 0, 4, 0, 6, 2, 6, 2, 0, 1, 1, 1, 2], [0, 2, 1, 1, 0, 4, 6, 0, 6, 4, 0, 1, 4, 5, 5, 4, 6, 5, 6, 1, 2, 2, 3, 3, 3], [1, 4, 1, 1, 2, 4, 6, 5, 6, 0, 2, 3, 2, 1, 5, 3, 6, 4, 6, 0, 3, 5, 0, 4, 0], [4, 2, 0, 2, 2, 1, 6, 0, 6, 5, 2, 0, 3, 5, 1, 4, 6, 1, 6, 5, 0, 4, 3, 5, 3], [0, 0, 4, 3, 2, 3, 6, 0, 6, 3, 1, 5, 5, 4, 1, 4, 6, 2, 6, 1, 1, 2, 5, 4, 5]]


//solution of that day
var solution = Array.from(SolutionArr[Day])
//state of that day
var state = Array.from(SpawnArr[Day])

var FirstTime = false;
var isArchive = false;
var isTutorial = false;
var archiveNum;


if (localStorage.ArchiveList) {
    if (JSON.parse(localStorage.ArchiveList).length < Day) {
        while (JSON.parse(localStorage.ArchiveList).length < Day) {
            localStorage.ArchiveList = localStorage.ArchiveList.slice(0, -1) + ",0]";
            localStorage.ArchiveSwapList = localStorage.ArchiveSwapList.slice(0, -1) + ",0]";
        }
    }
    setArchiveList(JSON.parse(localStorage.ArchiveList).slice(0, -1), JSON.parse(localStorage.ArchiveSwapList).slice(0, -1))
    setArchiveStats(JSON.parse(localStorage.ArchiveList).slice(0, -1), JSON.parse(localStorage.ArchiveSwapList).slice(0, -1))
}
else {
    var ArchiveList = [];
    (ArchiveList = []).length = Day;
    ArchiveList.fill(0);

    var ArchiveSwapList = [];
    (ArchiveSwapList = []).length = Day;
    ArchiveSwapList.fill(0);
    setArchiveList(ArchiveList.slice(0, -1), ArchiveSwapList.slice(0, -1))
    setArchiveStats(ArchiveList.slice(0, -1), ArchiveSwapList.slice(0, -1))
}




let moves = 21;
let matches = 0;
let playTime = 0;


if (localStorage.LastSolveDate) {

    var date = new Date(localStorage.LastSolveDate);
    var date1 = new Date(localStorage.LastResumeDate);

    if (dateDiffInDays(date, currentDate) == 0) {

        if (localStorage.IsSolved == "false") {
            document.querySelector(".win-container").style.display = "none";
            document.querySelector(".win-text").style.display = "none";
            document.querySelector(".lose-container").style.display = "contents";
        }
        else {
            document.querySelector(".win-container").style.display = "contents";
            document.querySelector(".win-text").style.display = "inline";
            document.querySelector(".lose-container").style.display = "none";
        }


        document.querySelectorAll(".share-timer").forEach((element, index) => {
            element.style.display = "flex";
        })

        document.querySelector(".visit-tomorrow").style.display = "block";

        let stars = "";
        if (localStorage.TodaySwapCount > 0) {
            stars = stars.concat(
                '<img src="/images/star.png" class="finish-star" />'
            );
        } else {
            stars = stars.concat(
                '<img src="/images/no_star.png" class="finish-star" />'
            );
        }
        if (localStorage.TodaySwapCount > 1) {
            stars = stars.concat(
                '<img src="/images/star.png" class="finish-star" />'
            );
        } else {
            stars = stars.concat(
                '<img src="/images/no_star.png" class="finish-star" />'
            );
        }
        if (localStorage.TodaySwapCount > 2) {
            stars = stars.concat(
                '<img src="/images/star.png" class="finish-star" />'
            );
        } else {
            stars = stars.concat(
                '<img src="/images/no_star.png" class="finish-star" />'
            );
        }
        if (localStorage.TodaySwapCount > 3) {
            stars = stars.concat(
                '<img src="/images/star.png" class="finish-star" />'
            );
        } else {
            stars = stars.concat(
                '<img src="/images/no_star.png" class="finish-star" />'
            );
        }
        if (localStorage.TodaySwapCount > 4) {
            stars = stars.concat(
                '<img src="/images/star.png" class="finish-star" />'
            );
        } else {
            stars = stars.concat(
                '<img src="/images/no_star.png" class="finish-star" />'
            );
        }

        document.querySelector("[data-field=win-stars]").innerHTML = stars;

        document.querySelector("[data-field=win-comment]").innerHTML =
            winComment;

        document.querySelector("[data-field=finish-moves]").innerHTML = `${21 - localStorage.TodaySwapCount
            }/21`;

        document.querySelector(".moves-number").innerHTML = `${localStorage.TodaySwapCount
            }`;
            document.querySelector("[data-field=finish-time]").innerHTML = `${Math.floor(localStorage.TodayPlayTime/60)
        }m` + " " + `${localStorage.TodayPlayTime%60}s`;

        const tempArr = JSON.parse(localStorage.save_State);

        for (var i = 0; i < 25; i++) {
            state[i] = tempArr[i % 5][4 - Math.floor(i / 5)];
        }

        setRemainingTime();

        openModal("finish-modal");

    }
    else if (dateDiffInDays(currentDate, date1) == 0) {

        const tempArr = JSON.parse(localStorage.save_State);

        for (var i = 0; i < 25; i++) {
            state[i] = tempArr[i % 5][4 - Math.floor(i / 5)];
        }

        playTime = Number(localStorage.TodayPlayTime);
        moves = Number(localStorage.TodaySwapCount);

        document.querySelector(".moves-number").innerHTML = `${localStorage.TodaySwapCount
            }`;
    }
    else {
        localStorage.removeItem("IsSolved");
        localStorage.removeItem("TodaySwapCount");
        localStorage.removeItem("TodayPlayTime");
        localStorage.removeItem("save_State");
        localStorage.removeItem("ShareMsg");
        if (dateDiffInDays(date, currentDate) > 1) {
            localStorage.CurrentStreak = 0;
        }
    }

    var freqArr = JSON.parse(localStorage.freqArr);

    document.querySelectorAll("[data-field=games-played]").forEach(element => element.innerText = `${localStorage.GamesPlayed
        }`)
    document.querySelectorAll("[data-field=win-percent]").forEach(element => element.innerText = `${Math.round(freqArr.reduce((partialSum, a) => partialSum + a, 0) * 100 / localStorage.GamesPlayed)
        }`)
    document.querySelectorAll("[data-field=stars-count]").forEach(element => element.innerText = `${localStorage.StarsCollected
        }`)
    document.querySelectorAll("[data-field=current-streak]").forEach(element => element.innerText = `${localStorage.CurrentStreak
        }`)
    document.querySelectorAll("[data-field=highest-streak]").forEach(element => element.innerText = `${localStorage.HighestStreak
        }`)


    document.querySelectorAll(".stars-progress-count").forEach((element, index) => {
        element.innerText = `${freqArr[index]
            }`
    })


    document.querySelectorAll(".stars-progress-bar").forEach((element, index) => {
        element.style.width = `${Math.round(freqArr[index] * 100 / localStorage.GamesPlayed)
            }%`
    })
}
else {
    FirstTime = true;
    var date = new Date(localStorage.LastResumeDate);
    if (localStorage.LastResumeDate) {
        if (dateDiffInDays(currentDate, date) == 0) {

            const tempArr = JSON.parse(localStorage.save_State);

            for (var i = 0; i < 25; i++) {
                state[i] = tempArr[i % 5][4 - Math.floor(i / 5)];
            }

            playTime = Number(localStorage.TodayPlayTime);
            moves = Number(localStorage.TodaySwapCount);

            document.querySelector(".moves-number").innerHTML = `${localStorage.TodaySwapCount
                }`;

        }
    }
    else {
        openModal("help-modal");
    }
}

setInterval(addOneToGameTime, 1000);




function UpdateSums() {
 document.querySelectorAll(".sum").forEach((element, index) => {
    switch (index) {
        case 0:
            element.innerHTML =
                solution[0] +
                solution[1] +
                solution[2] +
                solution[3] +
                solution[4] +
                5;
            break;
        case 1:
            element.innerHTML = solution[5] + solution[7] + solution[9] + 3;
            break;
        case 2:
            element.innerHTML =
                solution[10] +
                solution[11] +
                solution[12] +
                solution[13] +
                solution[14] +
                5;
            break;
        case 3:
            element.innerHTML = solution[15] + solution[17] + solution[19] + 3;
            break;
        case 4:
            element.innerHTML =
                solution[20] +
                solution[21] +
                solution[22] +
                solution[23] +
                solution[24] +
                5;
            break;
        case 5:
            element.innerHTML =
                solution[0] +
                solution[5] +
                solution[10] +
                solution[15] +
                solution[20] +
                5;
            break;
        case 6:
            element.innerHTML = solution[1] + solution[11] + solution[21] + 3;
            break;
        case 7:
            element.innerHTML =
                solution[2] +
                solution[7] +
                solution[12] +
                solution[17] +
                solution[22] +
                5;
            break;
        case 8:
            element.innerHTML = solution[3] + solution[13] + solution[23] + 3;
            break;
        case 9:
            element.innerHTML =
                solution[4] +
                solution[9] +
                solution[14] +
                solution[19] +
                solution[24] +
                5;
            break;
    }
});
}
UpdateSums();

function check(index, solution, state) {
    const value = Number(state[index]);
    if (value === solution[index]) {
        return "success";
    }
    const row = Math.floor(index / 5);
    const column = index % 5;
    const yellows = new Set();
    [0, 1, 2, 3, 4].forEach((element) => {
        yellows.add(row * 5 + element);
        yellows.add(element * 5 + column);
    });
    yellows.delete(index);
    if (
        Array.from(yellows).some(
            (element) =>
                value === solution[element] &&
                solution[element] !== state[element]
        )
    ) {
        return "warning";
    }
    return "none";
}

function checkMatched() {
    matches = 0
    for (var i = 0; i < 25; i++) {
        if (solution[i] == state[i]) {
            matches++;
        }
    }
    matches -= 4;
}

function addOneToGameTime() {
    if (!(moves == 0 || matches == 21))
        playTime += 1;
}

function SaveGameStates() {

    var finalArr = new Array(5);
    for (var i = 0; i < 5; i++) {
        finalArr[i] = new Array(5);
        for (var j = 0; j < 5; j++) {
            finalArr[i][j] = state[(4 - j) * 5 + i]
        }
    }


    localStorage.setItem("TodaySwapCount", moves);
    localStorage.setItem("TodayPlayTime", playTime);
    localStorage.setItem("save_State", JSON.stringify(finalArr));

    localStorage.LastResumeDate = new Date();

}

function writeBoard(boardElement, state, solution) {
    Array.from(boardElement.children).forEach((dice, index) => {
        if (state[index] !== 6) {
            dice.setAttribute('data-value', state[index]);
            dice.setAttribute('data-state', check(index, solution, state));
            dice.className = `dice${check(index, solution, state) === "success"
                ? " no-drag"
                : ""
                }`
            dice.innerHTML = `<img src="/images/${check(
                index,
                solution,
                state
            )}-${state[index] + 1}.svg">`
            dice.style = "";
        }
    });
}

const board = document.getElementById("board");
writeBoard(board, state, solution);

var sortable = Sortable.create(board, {
    swap: true,
    animation: 250,
    filter: ".no-drag",
    dragClass: "dice-drag",
    swapClass: "dice-drop",
    ghostClass: "dice-ghost",
    onMove: function (evt) {
        return (
            evt.related.className.indexOf("no-drag") === -1 &&
            evt.related.getAttribute("data-value") !==
            evt.dragged.getAttribute("data-value")
        );
    },
    onUpdate: function (evt) {
        moves--;
        const temp = state[evt.oldIndex];
        state[evt.oldIndex] = state[evt.newIndex];
        state[evt.newIndex] = temp;
        writeBoard(board, state, solution);

        document.querySelector(".moves-number").innerHTML = moves;

        checkMatched();

        if(moves == 20){
            if(isArchive){
                gtag('event', 'gameStart', {
                    'LevelType': 'Archive'
                  });
            }
            else{
                gtag('event', 'gameStart', {
                    'LevelType': 'Daily'
                  });
            }
        }

        if (!isArchive) {
            SaveGameStates();

            if (matches == 21) {
                gameFinish(true, moves, state, playTime);
                sortable.option("disabled", true);

            }
            if (moves == 0 && matches != 21) {
                gameFinish(false, 0, state, playTime);
                sortable.option("disabled", true);
            }
        }
        else {

            if (matches == 21) {
                gameArchiveFinish(true);
                sortable.option("disabled", true);

            }
            if (moves == 0 && matches != 21) {
                gameArchiveFinish(false);
                sortable.option("disabled", true);
            }

        }

        if (isTutorial) {
            if(moves == 20){
                document.querySelector(".tut-hand").style.display = 'none';
                /*source.style.zIndex = "2";
                document.querySelector(".box-modal").style.left = (source.getBoundingClientRect().x - source.getBoundingClientRect().width/2) + "px";
                document.querySelector(".box-modal").style.top = (source.getBoundingClientRect().y - 70) + "px";
                document.querySelectorAll(".tutMsg")[0].style.display = "none";
                document.querySelectorAll(".tutMsg")[1].innerHTML = "MATCHED";

                setTimeout(resumeGame,2000);*/
                
            }
            else{
                document.querySelector(".tut-hand").style.display = 'none';
                /*source.style.zIndex = "4";
                resumeGame();*/
            }

            isTutorial = false;
            
        }

        if (FirstTime && !isArchive && moves > 18) {
            SetWaitTimer();
        }

    },
});

if (localStorage.LastSolveDate) {
    if (dateDiffInDays(date, currentDate) == 0) {
        sortable.option("disabled", true);
    }
}

if (FirstTime && !isArchive) {
    if(moves > 18){
        setTimeout(makeTutorial,2000);
        var waitTime = 0
    }
}


function resumeGame() {
    document.getElementById('tut-overlay').style.display = "none";
    document.querySelector(".box-modal").innerHTML = boxModalContent;
    document.querySelector(".box-modal").style.display = "none"
}

function SetWaitTimer(){
    setTimeout(checkTutorial,5000);
}

function checkTutorial(){
    if(moves > 18 && !isArchive){
        makeTutorial(false);
    }
}






