// ==UserScript==
// @name         Blacket Router Util
// @namespace    https://blacket.org
// @version      1.0.3
// @description  A router for Blacket to improve loading times with a darker theme included!
// @author       Piotr
// @icon         https://blacket.org/content/logo.png
// @grant        none
// @match        https://blacket.org/*
// ==/UserScript==




// This isn't my best work this sucks lmao
(async function() {
    'use strict';

    let wait = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) };
    await wait(1000)
    function setTheme() {
        function themes(node) {
            if (getComputedStyle(node).backgroundColor == "rgb(159, 159, 159)") node.style.backgroundColor = "rgb(143, 143, 143)";
            else if (getComputedStyle(node).backgroundColor == "rgb(143, 143, 143)") node.style.backgroundColor = "rgb(127, 127, 127)";
            else if (getComputedStyle(node).backgroundColor == "rgb(127, 127, 127)") node.style.backgroundColor = "rgb(111, 111, 111)";
            else if (getComputedStyle(node).backgroundColor == "rgb(111, 111, 111)") node.style.backgroundColor = "rgb(95, 95, 95)";
            else if (getComputedStyle(node).backgroundColor == "rgb(95, 95, 95)") node.style.backgroundColor = "rgb(79, 79, 79)";
            else if (getComputedStyle(node).backgroundColor == "rgb(79, 79, 79)") node.style.backgroundColor = "rgb(63, 63, 63)";
            else if (getComputedStyle(node).backgroundColor == "rgb(63, 63, 63)") node.style.backgroundColor = "rgb(47, 47, 47)";
            else if (getComputedStyle(node).backgroundColor == "rgb(47, 47, 47)") node.style.backgroundColor = "rgb(31, 31, 31)";
            else if (getComputedStyle(node).backgroundColor == "rgb(31, 31, 31)") node.style.backgroundColor = "rgb(15, 15, 15)";
            else if (getComputedStyle(node).backgroundColor == "rgb(15, 15, 15)") node.style.backgroundColor = "rgb(0, 0, 0)";
        }

        $("body").find("*").each((i, e) => themes(e));

        $("body").append(`
    <style>
    .styles__background___2J-JA-camelCase {
        background-color: #2f2f2f !important;
    }
    styles__sidebar___1XqWi-camelCase {
        background-color: #1d1d1d !important;
    }
    .styles__blooksBackground___3oQ7Y-camelCase {
        opacity: 0.075 !important;
    }
    </style>
    `);
    }

    async function setRouter() {
        document.querySelectorAll('a[href]').forEach(link => {
            link.onclick = () => {
                event.preventDefault();
                blacket.startLoading();
                console.log(`Loading ${link.href}...`);
                blacket.config.path = link.href.split('/')[3];
                history.pushState("Loading", "Loading", link.href);
                document.title = `${blacket.config.path[0].toUpperCase() + blacket.config.path.slice(1)} | ${blacket.config.name}`;
                fetch(link.href).then(x => {return x.text()}).then(res => {
                    const pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
                    document.querySelector('body').innerHTML = pattern.exec(res)[1];
                    for (let i = 0; i < document.querySelectorAll('script').length; i++) {
                        let scr = document.querySelectorAll('script')[i];
                        if (scr.src.includes('/lib/js/') && scr.src.includes('/dist/phaser-arcade-physics.min.js') && !scr.src.includes(`/lib/js/${link.href.split('/')[link.href.split('/').length-1]}.js`)) {
                            new Promise((resolve, reject) => {
                                const script = document.createElement('script')
                                script.src = scr.src;
                                scr.remove();
                                document.querySelector('head').appendChild(script);
                            });
                        }
                    }
                    new Promise((resolve, reject) => {
                        const script = document.createElement('script')
                        document.querySelector('head').appendChild(script);
                        script.src = `/lib/js/${location.pathname.includes('/clans/discover') ? 'clans/discover' : location.pathname == '/clans' ? 'clans/my-clan' : location.pathname.split('/')[location.pathname.split('/').length-1]}.js`;
                    });
                    $.getScript('/lib/js/game.js', async function() {
                        console.log(`Successfully routed to ${link.href}`)
                        if (!location.pathname.includes('/leaderboard')) {
                            while (document.querySelectorAll('a[href]').length < 10) {
                                await wait(10);
                            }
                        } else {
                            while (document.querySelectorAll('a[href]').length < 30) {
                                await wait(10);
                            }
                        }
                        setRouter();
                        setTheme();
                    });
                })
            }
        })
    }

    setRouter();
    setTheme();
})();
