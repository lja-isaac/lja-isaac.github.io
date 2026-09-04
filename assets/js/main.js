// import { animate, createTimer, createTimeline , utils, onScroll } from window.anime;
const { animate, createTimer, createTimeline, utils, onScroll } = anime;

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

const demoModal = document.getElementById('modal-demo')
if (demoModal) {
    demoModal.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget
        // Extract info from data-bs-* attributes
        const name = button.getAttribute('data-demo-name')
        const url = button.getAttribute('data-demo-url')
        // If necessary, you could initiate an Ajax request here
        // and then do the updating in a callback.

        // Update the modal's content.
        const modalTitle = demoModal.querySelector('.modal-title')
        // const modalBodyInput = demoModal.querySelector('.modal-body input')
        const modalIframe = demoModal.querySelector('.modal-body iframe')

        modalTitle.textContent = `${name} Demo`
        // modalBodyInput.value = recipient
        modalIframe.src = url;
    })
}

// #region Animation
// Portfolio main JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');

    document.documentElement.style.setProperty('--navbar-height', navbar.clientHeight + 'px');

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

    animateSkillsAppearTimeline();
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
        "id": "cplus",
        "name": "C++",
        "level": 7 / 10,
        "iconClass": "devicon-cplusplus-plain"
    },
    {
        "id": "vb",
        "name": "VB",
        "level": 4 / 10,
        "iconClass": "devicon-visualbasic-plain"
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
        "id": "sass",
        "name": "SASS",
        "level": 5 / 10,
        "iconClass": "devicon-sass-plain"
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
        "level": 6 / 10,
        "iconClass": "devicon-python-plain"
    },
    {
        "id": "php",
        "name": "PHP",
        "level": 7 / 10,
        "iconClass": "devicon-php-plain"
    },
];

let noSkillHoveredAnimation = null;
let noSkillHoveredAnimationFirstIndex = 0;
function animateSkillsAppearTimeline() {
    // const [container] = utils.$('#div-skills');
    const container = null;
    const debug = false;

    const circle = utils.$('.skill-circle-animated circle');

    // const circumference = 2 * Math.PI * 90;

    const timeline = createTimeline({
        easing: "easeInOutCubic",
        delay: 100,
        defaults: { duration: 600 },
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
        let skillObjElemStr = `<div id="${skill.elemId}" class="d-flex flex-column text-center div-skills">
                            <i class="${skill.iconClass} colored display-4"></i>
                            <span class="d-inline-block">${skill.name}</span>
                        </div>`;
        divSkills.innerHTML += skillObjElemStr;
    }

    const skillObjRadius = 160;
    const total = skillObjs.length;
    const angleOffset = -Math.PI / 2;
    for (const [index, skill] of skillObjs.entries()) {

        const angle = angleOffset + (index / total) * Math.PI * 2;

        const x = skillObjRadius * Math.cos(angle);
        const y = skillObjRadius * Math.sin(angle);
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

        document.querySelector(".skill-circle-selected circle").style.opacity = 1;

        noSkillHoveredAnimationFirstIndex = 0;
        noSkillHoveredAnimation = createTimer({
            duration: 3000,
            autoplay: true,
            loop: true,
            onBegin: self => {
                const skill = skillObjs[(noSkillHoveredAnimationFirstIndex + self._currentIteration) % skillObjs.length];
                ShowSkillLevelAnimation(skill);
            },
            onLoop: self => {
                const skill = skillObjs[(noSkillHoveredAnimationFirstIndex + self._currentIteration) % skillObjs.length];
                ShowSkillLevelAnimation(skill);
            }
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
function GetSkillByElementId(elemId) {
    let skill = null;
    let skillIndex = null;
    for (const [currIndex, currSkill] of skillObjs.entries()) {
        if (elemId == currSkill.elemId) {
            skill = currSkill;
            skillIndex = currIndex;
            break;
        }
    }

    return [skill, skillIndex];
}
function OnMouseEnterSkill(e) {
    noSkillHoveredAnimation.pause();
    noSkillHoveredAnimation.reset();

    let skillId = e.target.id;
    let skill;
    [skill, noSkillHoveredAnimationFirstIndex] = GetSkillByElementId(skillId);

    ShowSkillLevelAnimation(skill);
}

function OnMouseLeaveSkill(e) {
    // ShowSkillLevelAnimation(null);

    noSkillHoveredAnimation.play();

}

function ShowSkillLevelAnimation(skill) {
    if (skill == null) {
        skillDescription.innerHTML = "";
        SkillBarAnimation(0);
        return;
    }

    skillDescription.innerHTML = "Proficiency";
    // skillDescription.innerHTML = skill.name;
    SkillBarAnimation(skill.level);

    const element = document.getElementById(skill.elemId);

    let selectedCircleAnimation = animate('.skill-circle-selected circle', {
        x: skill.x,
        y: skill.y - 10,
        duration: 300
    });
    let raiseSkillAnim = animate(`#${skill.elemId}`, {
        x: skill.x,
        y: skill.y - 10,
        duration: 300
    });

    for (const [currIndex, currSkill] of skillObjs.entries()) {
        if (currSkill.elemId != skill.elemId) {
            let resetOtherSkillsAnim = animate(`#${currSkill.elemId}`, {
                x: currSkill.x,
                y: currSkill.y,
                duration: 300
            });
        }
    }
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
// #endregion Animation

