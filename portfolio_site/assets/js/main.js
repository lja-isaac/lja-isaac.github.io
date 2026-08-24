// import { animate, createTimer, createTimeline , utils, onScroll } from window.anime;
const { animate, createTimer, createTimeline, utils, onScroll } = anime;

// Portfolio main JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');

    document.getElementsByTagName("main")[0].style.marginTop = -navbar.clientHeight + "px";

    // Initially hide navbar
    const navbarHiddenThreshold = window.innerHeight * 0.8;
    navbar.classList.add('hidden');

    window.addEventListener('scroll', (e) => {
        const currentScrollY = window.scrollY;

        // // Navbar visibility logic
        if (currentScrollY > navbarHiddenThreshold) {
            navbar.classList.remove('hidden');
        } else {
            navbar.classList.add('hidden');
        }
    });

    // Fade-in animation logic
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(section => {
        observer.observe(section);
    });

    animateSkills();
});

const divSkills = document.querySelector('#div-all-skills');
let skillObjs = [
    {
        "id": "java",
        "name": "Java",
        "level": 7 / 10,
        "iconClass": "devicon-java-plain"
    },
    {
        "id": "csharp",
        "name": "C#",
        "level": 8 / 10,
        "iconClass": "devicon-csharp-plain"
    },
    {
        "id": "html",
        "name": "HTML",
        "level": 7 / 10,
        "iconClass": "devicon-html5-plain"
    },
    {
        "id": "css",
        "name": "CSS",
        "level": 6 / 10,
        "iconClass": "devicon-css3-plain"
    },
    {
        "id": "javascript",
        "name": "Javascript",
        "level": 6 / 10,
        "iconClass": "devicon-javascript-plain"
    },
    {
        "id": "python",
        "name": "Python",
        "level": 5 / 10,
        "iconClass": "devicon-python-plain"
    },
];

function animateSkills() {
    // const [container] = utils.$('#div-skills');
    const container = null;
    const debug = true;

    const circle = utils.$('.skills-circle-animated');

    const circumference = 2 * Math.PI * 90;

    const timeline = createTimeline({
        easing: "easeInOutCubic",
        delay: 500,
        defaults: { duration: 750 },
        autoplay: onScroll({
            target: circle,
            container,
            debug
        })
    });

    timeline.add(
        circle,
        {
            strokeDashoffset: 0,
        }
    );
    timeline.add(
        circle,
        {
            fillOpacity: 1,
            duration: 250
        }
    );

    for (let skill of skillObjs) {
        let skillObjElemStr = `<div id="skill-${skill.id}" class="d-inline-block flex-column text-center div-skills">
                            <i class="${skill.iconClass} colored display-4"></i>
                            <p>${skill.name}</p>
                        </div>`;
        divSkills.innerHTML += skillObjElemStr;
    }

    const radius = 180;
    const total = skillObjs.length;
    const angleOffset = -Math.PI / 2;
    for (const [index, skill] of skillObjs.entries()) {

        const angle = angleOffset + (index / total) * Math.PI * 2;

        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        let skillAnimation = animate(`#skill-${skill.id}`, {
            x: x,
            y: y,
            opacity: 1,
            duration: 1000
        });

        skill.x = x;
        skill.y = y;
        timeline.sync(skillAnimation, 1000);
    }

    // timeline.onComplete = animateJsFloatRandomly;
}

function animateJsFloatRandomly() {
    for (const [index, skill] of skillObjs.entries()) {
        animate(
            `#skill-${skill.id}`,
            {
                x: (skill.x + utils.random(-8, 8)),
                y: (skill.y + utils.random(-8, 8)),

                duration: utils.random(8000, 10000),
                // easing: 'easeInOutSine',
                onComplete: animateJsFloatRandomly
            }
        );
    }
}
