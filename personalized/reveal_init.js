// More info about initialization & config:
// - https://revealjs.com/initialization/
// - https://revealjs.com/config/
Reveal.initialize({
    hash: true,
    center: false,
    mathjax3:{
        mathjax: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js'
    },
    // customcontrols: {
    // controls: [
    //         { icon: '<i class="fa fa-pen-square"></i>',
    //             title: 'Toggle chalkboard (B)',
    //             action: 'RevealChalkboard.toggleChalkboard();'
    //         },
    //         { icon: '<i class="fa fa-pen"></i>',
    //             title: 'Toggle notes canvas (C)',
    //             action: 'RevealChalkboard.toggleNotesCanvas();'
    //         }
    //     ]
    // },
    // Learn about plugins: https://revealjs.com/plugins/
    plugins: [RevealMarkdown, RevealHighlight, RevealNotes, RevealMath.MathJax3, RevealChalkboard, RevealCustomControls],
    // dependencies: [
    //     { src: '../reveal.js/plugin/accessibility/helper.js', async: true, condition: function() { 
    //     	return !!document.body.classList; 
    //     } 
    // }]
});
Reveal.configure({
    keyboard: {
        80: null // don't do anything when "P" is pressed (i.e. disable a reveal.js default binding)
    }
});