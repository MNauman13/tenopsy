export const VideoSlidesDummy = [
    {
        "slideId": "intro-and-setup-01",
        "slideIndex": 1,
        "title": "What is Python?",
        "subtitle": "Overview and common applications",
        "audioFileName": "intro-and-setup-01.mp3",
        "narration": {
            "fullText": "Python is a high-level, interpreted programming language known for its readable syntax and expressive style. It is widely used across many fields, including web development, data science, automation, and machine learning. Its extensive standard library and strong community support make it a dependable choice for both beginners and experienced developers."
        },
        "html": "<script src=\"https://cdn.tailwindcss.com\"></script>\n<div style=\"width:1280px;height:720px;\" class=\"flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans\">\n  <style>\n    .reveal { opacity:0; transform:translateY(12px); }\n    .reveal.is-on { opacity:1; transform:translateY(0); }\n    .card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015)); border: 1px solid rgba(255,255,255,0.04); }\n    .fade { transition: opacity 360ms ease, transform 360ms ease; }\n  </style>\n  <div class=\"w-[1200px] h-[640px] p-10 card rounded-xl shadow-xl\">\n    <header class=\"flex items-baseline justify-between mb-6\">\n      <div>\n        <div class=\"text-sm text-gray-300\">Python Fundamentals • Introduction &amp; Setup</div>\n        <h1 class=\"mt-2 text-3xl font-semibold\">What is Python?</h1>\n        <p class=\"text-gray-300 mt-1\">Overview and common applications</p>\n      </div>\n      <div class=\"text-xs text-gray-400\">Slide 1 of 3</div>\n    </header>\n    <main class=\"mt-6 grid grid-cols-1 gap-6\">\n      <p class=\"text-gray-200 max-w-2xl\">A quick summary to place Python in context, followed by typical use cases you may encounter as you begin learning.</p>\n      <ul class=\"mt-4 space-y-3\">\n        <li class=\"reveal fade p-4 rounded-lg\" data-reveal=\"r1\">\n          <div class=\"text-lg font-medium\">Readable, high-level language</div>\n          <div class=\"text-sm text-gray-300 mt-1\">Design focuses on clarity and concise code.</div>\n        </li>\n        <li class=\"reveal fade p-4 rounded-lg\" data-reveal=\"r2\">\n          <div class=\"text-lg font-medium\">Common use cases</div>\n          <div class=\"text-sm text-gray-300 mt-1\">Web apps, data analysis, automation, AI, scripting and more.</div>\n        </li>\n        <li class=\"reveal fade p-4 rounded-lg\" data-reveal=\"r3\">\n          <div class=\"text-lg font-medium\">Large ecosystem</div>\n          <div class=\"text-sm text-gray-300 mt-1\">Rich libraries and community support help you build quickly.</div>\n        </li>\n      </ul>\n    </main>\n  </div>\n</div>",
        "revelData": [
            "r1",
            "r2",
            "r3"
        ]
    },
    {
        "slideId": "intro-and-setup-02",
        "slideIndex": 2,
        "title": "Install & Run the Interpreter",
        "subtitle": "Set up Python and try it interactively",
        "audioFileName": "intro-and-setup-02.mp3",
        "narration": {
            "fullText": "To get started, download Python from python.org or use your system package manager like Homebrew or apt. Installation typically adds Python to your PATH and provides an interactive shell you can launch with python or python3. Once installed, open the interpreter to run commands and experiment in real time."
        },
        "html": "<script src=\"https://cdn.tailwindcss.com\"></script>\n<div style=\"width:1280px;height:720px;\" class=\"flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans\">\n  <style>\n    .reveal { opacity:0; transform:translateY(12px); }\n    .reveal.is-on { opacity:1; transform:translateY(0); }\n    .card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015)); border: 1px solid rgba(255,255,255,0.04); }\n    .fade { transition: opacity 360ms ease, transform 360ms ease; }\n    code { background: rgba(255,255,255,0.03); padding: 2px 6px; border-radius: 4px; }\n  </style>\n  <div class=\"w-[1200px] h-[640px] p-10 card rounded-xl shadow-xl\">\n    <header class=\"flex items-baseline justify-between mb-6\">\n      <div>\n        <div class=\"text-sm text-gray-300\">Python Fundamentals • Introduction &amp; Setup</div>\n        <h1 class=\"mt-2 text-3xl font-semibold\">Install &amp; Run the Interpreter</h1>\n        <p class=\"text-gray-300 mt-1\">Set up Python and try it interactively</p>\n      </div>\n      <div class=\"text-xs text-gray-400\">Slide 2 of 3</div>\n    </header>\n    <main class=\"mt-6 grid grid-cols-1 gap-6\">\n      <p class=\"text-gray-200 max-w-2xl\">Follow a few simple steps to install Python and verify your setup, then open the interpreter to explore commands directly.</p>\n      <ul class=\"mt-4 space-y-3\">\n        <li class=\"reveal fade p-4 rounded-lg\" data-reveal=\"r1\">\n          <div class=\"text-lg font-medium\">Choose an installer</div>\n          <div class=\"text-sm text-gray-300 mt-1\">Download from python.org or use Homebrew, apt, or your OS package manager.</div>\n        </li>\n        <li class=\"reveal fade p-4 rounded-lg\" data-reveal=\"r2\">\n          <div class=\"text-lg font-medium\">Verify the installation</div>\n          <div class=\"text-sm text-gray-300 mt-1\">Run <code>python --version</code> or <code>python3 --version</code> to confirm.</div>\n        </li>\n        <li class=\"reveal fade p-4 rounded-lg\" data-reveal=\"r3\">\n          <div class=\"text-lg font-medium\">Launch the interactive shell</div>\n          <div class=\"text-sm text-gray-300 mt-1\">Use <code>python</code> or <code>python3</code> to start experimenting immediately.</div>\n        </li>\n      </ul>\n    </main>\n  </div>\n</div>",
        "revelData": [
            "r1",
            "r2",
            "r3"
        ]
    },
    {
        "slideId": "intro-and-setup-03",
        "slideIndex": 3,
        "title": "Your First Program",
        "subtitle": "Write, run, and understand Hello World",
        "audioFileName": "intro-and-setup-03.mp3",
        "narration": {
            "fullText": "Writing a simple program lets you confirm your setup and see Python in action. Create a file named hello.py containing a print statement, then run it with the python command from your terminal. This Hello World example demonstrates file execution, basic output, and the workflow you'll use for future programs."
        },
        "html": "<script src=\"https://cdn.tailwindcss.com\"></script>\n<div style=\"width:1280px;height:720px;\" class=\"flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans\">\n  <style>\n    .reveal { opacity:0; transform:translateY(12px); }\n    .reveal.is-on { opacity:1; transform:translateY(0); }\n    .card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015)); border: 1px solid rgba(255,255,255,0.04); }\n    .fade { transition: opacity 360ms ease, transform 360ms ease; }\n    pre { background: rgba(0,0,0,0.35); padding: 12px; border-radius: 8px; }\n  </style>\n  <div class=\"w-[1200px] h-[640px] p-10 card rounded-xl shadow-xl\">\n    <header class=\"flex items-baseline justify-between mb-6\">\n      <div>\n        <div class=\"text-sm text-gray-300\">Python Fundamentals • Introduction &amp; Setup</div>\n        <h1 class=\"mt-2 text-3xl font-semibold\">Your First Program</h1>\n        <p class=\"text-gray-300 mt-1\">Write, run, and understand Hello World</p>\n      </div>\n      <div class=\"text-xs text-gray-400\">Slide 3 of 3</div>\n    </header>\n    <main class=\"mt-6 grid grid-cols-2 gap-6\">\n      <div>\n        <p class=\"text-gray-200\">A minimal program confirms your environment and shows the basic edit-run cycle used throughout development.</p>\n        <ul class=\"mt-4 space-y-3\">\n          <li class=\"reveal fade p-4 rounded-lg\" data-reveal=\"r1\">\n            <div class=\"text-lg font-medium\">Create the file</div>\n            <div class=\"text-sm text-gray-300 mt-1\">Save a file named <code>hello.py</code> with a print statement.</div>\n          </li>\n          <li class=\"reveal fade p-4 rounded-lg\" data-reveal=\"r2\">\n            <div class=\"text-lg font-medium\">Run the program</div>\n            <div class=\"text-sm text-gray-300 mt-1\">Use <code>python hello.py</code> to execute and view output in the terminal.</div>\n          </li>\n          <li class=\"reveal fade p-4 rounded-lg\" data-reveal=\"r3\">\n            <div class=\"text-lg font-medium\">What it teaches</div>\n            <div class=\"text-sm text-gray-300 mt-1\">Demonstrates file execution, I/O, and the simple feedback loop of coding.</div>\n          </li>\n        </ul>\n      </div>\n      <div class=\"flex items-center justify-center\">\n        <div class=\"w-full\">\n          <div class=\"text-sm text-gray-400 mb-2\">Example</div>\n          <pre class=\"p-4 rounded-lg\"># hello.py\nprint(\"Hello, World!\")</pre>\n        </div>\n      </div>\n    </main>\n  </div>\n</div>",
        "revelData": [
            "r1",
            "r2",
            "r3"
        ]
    }
]


export const HeroPageCourse = [
    {
        id: 1,
        courseId: '69975e2a-fc91-4d3d-afa5-43e595655c33',
        courseName: 'React.js Basics: Components, JSX, Props & State',
        courseLayout: {
            courseId: "react-basics-components-jsx-props-state",
            courseName: "React.js Basics: Components, JSX, Props & State",
            courseDescription: "A beginner-friendly introduction to React covering components, JSX, props, and state. Learn key concepts with simple, hands-on examples to build interactive UI pieces.",
            level: "Beginner",
            totalChapters: 3,
            chapters: [
                {
                    chapterId: "react-ch1",
                    chapterTitle: "Getting Started with React",
                    subContent: [
                        "What React is and why it exists",
                        "Setting up your first React project with Vite",
                        "Understanding the component-based mindset",
                    ]
                },
                {
                    chapterId: "react-ch2",
                    chapterTitle: "Components, JSX & Props",
                    subContent: [
                        "Writing your first functional component",
                        "What JSX is and how it compiles",
                        "Passing data between components with props",
                    ]
                },
                {
                    chapterId: "react-ch3",
                    chapterTitle: "State & Interactivity",
                    subContent: [
                        "Managing changing data with useState",
                        "Handling user events like clicks and input",
                        "Conditional rendering based on state values",
                    ]
                }
            ]
        },
        bannerImage: '/banner/react.png'
    },
    {
        id: 3,
        courseId: '7ce88fbf-ab85-4ca3-b01b-314d8e79b90d',
        courseName: 'Python for Beginners: Variables to Simple Programs',
        courseLayout: {
            courseId: "python-beginners-essentials",
            courseName: "Python for Beginners: Variables to Simple Programs",
            courseDescription: "A clear, hands-on introduction to Python covering variables, data types, loops, functions, and small programs. Learn fundamental concepts and build simple programs you can run and modify.",
            level: "Beginner",
            totalChapters: 3,
            chapters: [
                {
                    chapterId: "python-ch1",
                    chapterTitle: "Introduction & Setup",
                    subContent: [
                        "What Python is and where it is used",
                        "Installing Python and opening the interpreter",
                        "Writing and running your first program",
                    ]
                },
                {
                    chapterId: "python-ch2",
                    chapterTitle: "Variables & Data Types",
                    subContent: [
                        "Storing values in variables",
                        "Numbers, strings, booleans, and None",
                        "Lists, tuples, and dictionaries at a glance",
                    ]
                },
                {
                    chapterId: "python-ch3",
                    chapterTitle: "Control Flow & Functions",
                    subContent: [
                        "Making decisions with if / elif / else",
                        "Repeating actions with for and while loops",
                        "Writing reusable code with functions",
                    ]
                }
            ]
        },
        bannerImage: '/banner/python.png'
    },
    {
        id: 2,
        courseId: '56e56b13-ee31-4d51-99c2-84d48185e47c',
        courseName: 'How to Build an AI App and Make Money',
        courseLayout: {
            courseId: "build-ai-app-monetize",
            courseName: "How to Build an AI App and Make Money",
            courseDescription: "A concise beginner course that guides you from idea to revenue. Learn to plan, build, deploy, and monetize an AI-powered app.",
            level: "Beginner",
            totalChapters: 3,
            chapters: [
                {
                    chapterId: "ai-ch1",
                    chapterTitle: "Planning Your AI App",
                    subContent: [
                        "Finding a real problem worth solving with AI",
                        "Choosing the right AI API for your use case",
                        "Designing a minimal, shippable first version",
                    ]
                },
                {
                    chapterId: "ai-ch2",
                    chapterTitle: "Building & Deploying",
                    subContent: [
                        "Integrating an AI API into a web app",
                        "Handling API keys and environment variables safely",
                        "Deploying to a live URL with Vercel or Railway",
                    ]
                },
                {
                    chapterId: "ai-ch3",
                    chapterTitle: "Growing & Monetizing",
                    subContent: [
                        "Getting your first users without a big audience",
                        "Choosing between subscriptions, one-time, and usage pricing",
                        "Iterating on feedback to reduce churn",
                    ]
                }
            ]
        },
        bannerImage: '/banner/ai.png'
    }
]