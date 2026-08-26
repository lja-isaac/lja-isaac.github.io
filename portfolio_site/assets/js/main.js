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
    const debug = false;

    const circle = utils.$('.skill-circle-animated');

    const circumference = 2 * Math.PI * 90;

    const timeline = createTimeline({
        easing: "easeInOutCubic",
        delay: 100,
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
        skill.elemId = `skill-${skill.id}`;
        let skillObjElemStr = `<div id="${skill.elemId}" class="d-inline-block flex-column text-center div-skills">
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
        let skillAnimation = animate(`#${skill.elemId}`, {
            x: x,
            y: y,
            opacity: 1,
            duration: 1000
        });

        skill.x = x;
        skill.y = y;
        timeline.sync(skillAnimation, 1000);
    }

    timeline.add(`.skill-bar-empty`, {
        opacity: 1
    })

    // timeline.onComplete = animateJsFloatRandomly;
    timeline.onComplete = () => {
        document.querySelectorAll(".div-skills").forEach((element) => {
            element.addEventListener("mouseenter", (event) => {
                OnMouseEnterSkill(event);
            });
            element.addEventListener("mouseleave", (event) => {
                OnMouseLeaveSkill(event);
            });
        });
    };
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

const skillDescription = document.getElementById("skill-description");
function OnMouseEnterSkill(e) {
    let skill = null;
    let skillId = e.target.id;
    for (const currSkill of skillObjs) {
        if (skillId == currSkill.elemId) {
            skill = currSkill;
            break;
        }
    }

    if (skill == null) {
        return;
    }

    skillDescription.innerHTML = skill.name;
    // $(skillBars[0]).attr('x2', clamp(skill.level, 0, 0.5) * 200);
    // $(skillBars[1]).attr('x2', clamp(skill.level - 0.5, 0, 0.5) * 200);


    // if (skillBarTimeline != null && skillBarTimeline.began && !skillBarTimeline.paused && !skillBarTimeline.completed) {
    //     skillBarTimeline.pause();
    //     skillBarTimeline.reset();
    //     skillBarTimeline.cancel();
    // }
    // skillBarTimeline = createTimeline({
    //     easing: "easeInOutSine",
    //     defaults: { duration: 200 },
    // });

    // const skillBar1 = clamp(skill.level, 0, 0.5) * 5;
    // const skillBar2 = clamp(skill.level - 0.5, 0, 0.5) * 5;

    // skillBarTimeline.add(utils.$(skillBars[0]), {
    //     x2: skillBar1 * 40,
    //     duration: (skillBar1 * 60)
    // })
    // skillBarTimeline.add(utils.$(skillBars[1]), {
    //     x2: skillBar2 * 40,
    //     duration: (skillBar2 * 60)
    // })

    SkillBarAnimation(skill.level);
}

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

function OnMouseLeaveSkill(e) {
    skillDescription.innerHTML = "";

    // if (skillBarTimeline != null && skillBarTimeline.began && !skillBarTimeline.paused && !skillBarTimeline.completed) {
    //     skillBarTimeline.pause();
    //     skillBarTimeline.reset();
    //     skillBarTimeline.cancel();
    // }
    // skillBarTimeline = createTimeline({
    //     easing: "easeInOutSine",
    //     defaults: { duration: 100 },
    // });
    // skillBarTimeline.add(utils.$(skillBars[1]), {
    //     x2: 0
    // })
    // skillBarTimeline.add(utils.$(skillBars[0]), {
    //     x2: 0
    // })

    SkillBarAnimation(0);
}

const skillBars = $(".skill-bar-level");
let skillBarTimeline = null;
let skillBarSeekAnimation = null;
let previousLevel = 0;
function SkillBarAnimation(targetLevel) {
    if (skillBarTimeline == null) {
        skillBarTimeline = createTimeline({
            autoplay: false,
            ease: "linear",
            defaults: {
                ease: "linear",
                duration: 5000
            }
        });
        skillBarTimeline.add(utils.$(skillBars[0]), {
            x2: 100,
        })
        skillBarTimeline.add(utils.$(skillBars[1]), {
            x2: 100,
        })
    }

    targetLevel = Math.max(0, Math.min(1, targetLevel));
    const targetTime = targetLevel * skillBarTimeline.duration;
    const currentTime = skillBarTimeline.currentTime;

    // Cancel the previous seek interpolation
    if (skillBarSeekAnimation) {
        skillBarSeekAnimation.cancel();
    }

    const seekValue = {
        time: currentTime
    };

    skillBarSeekAnimation = animate(seekValue, {
        time: targetTime,
        duration: 300,
        easing: "easeInOutSine",

        onUpdate: () => {
            skillBarTimeline.seek(seekValue.time);
        },

        onComplete: () => {
            skillBarTimeline.seek(targetTime);
            seekAnimation = null;
        }
    });
}