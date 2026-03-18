"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import ModuleFinalTestComponent from "../../../components/ModuleFinalTestComponent";
import { getCurrentUser } from "../../../lib/supabaseClient";

const APP_KEY = "learn-developer";
const APP_DISPLAY = "Learn Developer";
const NO_BADGES_KEY = "learn-developer-noBadges";

// Per-module final test question bank — 20 real questions per module
const FINAL_TEST_QUESTIONS = {
  1: [
    {
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Transfer Markup Language",
        "Hyper Transfer Machine Language",
        "Home Tool Markup Language",
      ],
      correct_answer: 0,
    },
    {
      question: "Which HTML tag is used for the largest heading?",
      options: ["<head>", "<h6>", "<h1>", "<title>"],
      correct_answer: 2,
    },
    {
      question: "Which CSS property controls text colour?",
      options: ["font-color", "text-color", "color", "foreground-color"],
      correct_answer: 2,
    },
    {
      question: "What does CSS stand for?",
      options: [
        "Creative Style Sheets",
        "Cascading Style Sheets",
        "Computer Style Sheets",
        "Colorful Style Sheets",
      ],
      correct_answer: 1,
    },
    {
      question: "Which HTML element is used to link an external CSS file?",
      options: ["<style>", "<script>", "<link>", "<css>"],
      correct_answer: 2,
    },
    {
      question: "What is the correct HTML attribute for specifying a link URL?",
      options: ["link", "src", "href", "url"],
      correct_answer: 2,
    },
    {
      question: "Which CSS property is used to control the spacing inside an element's border?",
      options: ["margin", "border-spacing", "padding", "spacing"],
      correct_answer: 2,
    },
    {
      question: "In the CSS box model, which layer is outermost?",
      options: ["Content", "Padding", "Border", "Margin"],
      correct_answer: 3,
    },
    {
      question: "Which HTML5 element is used for navigation links?",
      options: ["<nav>", "<menu>", "<header>", "<section>"],
      correct_answer: 0,
    },
    {
      question: "What does the 'display: flex' CSS property do?",
      options: [
        "Hides the element",
        "Creates a block-level container with a flexible layout model for its children",
        "Creates a grid layout",
        "Makes the element invisible but takes up space",
      ],
      correct_answer: 1,
    },
    {
      question:
        "What is the purpose of HTML semantic elements like <article>, <section>, and <aside>?",
      options: [
        "They only affect visual styling",
        "They give meaning to the structure of content, improving accessibility and SEO",
        "They replace CSS layout techniques",
        "They are required by HTML5 validators",
      ],
      correct_answer: 1,
    },
    {
      question: "Which CSS selector selects an element by its id?",
      options: [".myId", "#myId", "myId", "*myId"],
      correct_answer: 1,
    },
    {
      question: "Which CSS selector selects elements by class?",
      options: ["#myClass", "*myClass", ".myClass", "&myClass"],
      correct_answer: 2,
    },
    {
      question: "What is CSS specificity?",
      options: [
        "How specific a CSS rule looks visually",
        "A ranking system determining which CSS rule applies when multiple rules target the same element",
        "The order in which CSS files are loaded",
        "The number of properties in a CSS rule",
      ],
      correct_answer: 1,
    },
    {
      question: "What does 'responsive web design' mean?",
      options: [
        "A website that responds quickly to user actions",
        "A design approach where layout adapts to different screen sizes using flexible grids, images, and media queries",
        "Using JavaScript to make elements move on screen",
        "Designing websites with no images",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a CSS media query used for?",
      options: [
        "Querying data from a server",
        "Applying different CSS rules based on device characteristics such as screen width",
        "Searching for CSS properties in a stylesheet",
        "Adding video to a webpage",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of the HTML <form> element?",
      options: [
        "To format text on the page",
        "To create a user input form that collects and submits data",
        "To display a data table",
        "To embed external content",
      ],
      correct_answer: 1,
    },
    {
      question: "What does the CSS 'position: absolute' property do?",
      options: [
        "Fixes an element at the browser window",
        "Positions an element relative to its nearest positioned ancestor, removing it from normal document flow",
        "Positions relative to itself",
        "Makes an element sticky while scrolling",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of alt text on HTML images?",
      options: [
        "It sets the image file name",
        "It provides a text description for accessibility and as fallback when the image cannot be displayed",
        "It adds a caption below the image",
        "It sets the image title shown on hover",
      ],
      correct_answer: 1,
    },
    {
      question: "Which HTML attribute is used to uniquely identify an element on a page?",
      options: ["class", "name", "id", "key"],
      correct_answer: 2,
    },
  ],
  2: [
    {
      question: "What is JavaScript primarily used for?",
      options: [
        "Styling web pages",
        "Adding interactivity and dynamic behaviour to web pages",
        "Structuring HTML content",
        "Managing server databases",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between 'let', 'const', and 'var' in JavaScript?",
      options: [
        "They are identical",
        "var is function-scoped and hoisted; let is block-scoped; const is block-scoped and cannot be reassigned",
        "const is function-scoped; let is hoisted; var is block-scoped",
        "let and const are ES5; var is ES6",
      ],
      correct_answer: 1,
    },
    {
      question: "What does DOM stand for?",
      options: [
        "Document Object Model",
        "Data Output Module",
        "Document Order Management",
        "Dynamic Object Method",
      ],
      correct_answer: 0,
    },
    {
      question: "How do you select an element by ID in JavaScript?",
      options: [
        "document.querySelector('id')",
        "document.getElement('myId')",
        "document.getElementById('myId')",
        "document.select('#myId')",
      ],
      correct_answer: 2,
    },
    {
      question: "What is an event listener in JavaScript?",
      options: [
        "A method that listens to server events",
        "A function attached to a DOM element that executes when a specified event (e.g. click) occurs",
        "A system for monitoring network requests",
        "A logging function for browser events",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between == and === in JavaScript?",
      options: [
        "They are identical",
        "== checks value only (with type coercion); === checks both value and type (strict equality)",
        "=== checks value only; == checks type only",
        "== is for strings; === is for numbers",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a callback function?",
      options: [
        "A function that calls back to the server",
        "A function passed as an argument to another function and executed at a later time or when a specific event occurs",
        "A function that resets variables to their default value",
        "A function triggered when the page loads",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a Promise in JavaScript?",
      options: [
        "A variable that is guaranteed to have a value",
        "An object representing the eventual completion or failure of an asynchronous operation",
        "A type of loop for asynchronous tasks",
        "A performance guarantee for a function",
      ],
      correct_answer: 1,
    },
    {
      question: "What is async/await in JavaScript?",
      options: [
        "A method for synchronising CSS animations",
        "Syntactic sugar over Promises that allows asynchronous code to be written in a more synchronous, readable style",
        "A way to run code in parallel threads",
        "A browser API for making HTTP requests",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the fetch API used for?",
      options: [
        "Fetching local files from a computer",
        "Making HTTP requests to a server and receiving responses (replacing XMLHttpRequest)",
        "Fetching DOM elements from the page",
        "Loading CSS stylesheets dynamically",
      ],
      correct_answer: 1,
    },
    {
      question: "What is JSON and why is it important in web development?",
      options: [
        "JavaScript Object Notation — a lightweight data format used for exchanging data between client and server",
        "Java Standard Object Node — a Java data format",
        "A type of database used by JavaScript",
        "A compression format for web images",
      ],
      correct_answer: 0,
    },
    {
      question: "What does 'this' refer to in a regular JavaScript function?",
      options: [
        "The function itself",
        "Depends on context — in a method, it refers to the object calling it; globally, it refers to the global object (window in browsers)",
        "Always the global window object",
        "The parent HTML element",
      ],
      correct_answer: 1,
    },
    {
      question: "What is an arrow function in JavaScript?",
      options: [
        "A function that points to an object",
        "A concise function syntax using => that also lexically binds 'this' to the surrounding context",
        "A function that always returns an arrow",
        "A graphical function in the Canvas API",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the JavaScript event loop?",
      options: [
        "A loop that handles user mouse events",
        "The mechanism that allows JavaScript to perform non-blocking async operations by processing the call stack and task queue",
        "A for loop that listens for events",
        "A browser loop for rendering animation frames",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of localStorage in the browser?",
      options: [
        "Temporary storage cleared when the tab closes",
        "A browser-based key-value storage that persists data even after the browser is closed, without expiration",
        "Storing server-side session data",
        "A local file system storage",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a closure in JavaScript?",
      options: [
        "A way to close browser windows",
        "A function that retains access to variables from its outer (lexical) scope even after the outer function has returned",
        "A method for closing database connections",
        "An event that fires when a modal is closed",
      ],
      correct_answer: 1,
    },
    {
      question: "What is destructuring in JavaScript?",
      options: [
        "Breaking down a data structure for analysis",
        "A syntax that unpacks values from arrays or properties from objects into distinct variables",
        "Removing elements from the DOM",
        "A method for deconstructing functions",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the spread operator (...) used for in JavaScript?",
      options: [
        "Spreading variables across multiple files",
        "Expanding an iterable (array, string, object) into individual elements",
        "Adding comments to code",
        "Spreading asynchronous operations across threads",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of the Map object in JavaScript?",
      options: [
        "Displaying geographic maps on a webpage",
        "A built-in data structure holding key-value pairs where keys can be any type, with guaranteed insertion order",
        "A method for mapping array elements",
        "A replacement for the JSON format",
      ],
      correct_answer: 1,
    },
    {
      question: "What is event bubbling in the DOM?",
      options: [
        "Creating animated bubble effects with JavaScript",
        "When an event triggered on a child element propagates up through its ancestor elements in the DOM",
        "A method for adding multiple event listeners",
        "The process of creating new DOM elements",
      ],
      correct_answer: 1,
    },
  ],
  3: [
    {
      question: "What is React.js?",
      options: [
        "A server-side JavaScript framework",
        "A JavaScript library for building user interfaces through reusable components",
        "A CSS framework for responsive design",
        "A JavaScript testing framework",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a React component?",
      options: [
        "A CSS class in a React application",
        "A reusable, self-contained piece of UI that can accept input (props) and return React elements to render",
        "A Redux store slice",
        "A JavaScript module that exports HTML",
      ],
      correct_answer: 1,
    },
    {
      question: "What is JSX?",
      options: [
        "A JavaScript XML parser",
        "A syntax extension for JavaScript that looks like HTML and is compiled to React.createElement() calls",
        "A new JavaScript standard",
        "A CSS-in-JS solution",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the virtual DOM in React?",
      options: [
        "A virtual reality interface for the DOM",
        "A lightweight in-memory representation of the real DOM that React uses to efficiently compute and apply only necessary changes",
        "A backup of the browser's DOM",
        "The server-side rendered version of the DOM",
      ],
      correct_answer: 1,
    },
    {
      question: "What are props in React?",
      options: [
        "CSS properties applied to React components",
        "Read-only inputs passed from a parent component to a child component",
        "State variables in a component",
        "Methods defined inside a class component",
      ],
      correct_answer: 1,
    },
    {
      question: "What is state in React?",
      options: [
        "Global variables in a JavaScript application",
        "Mutable data managed within a component that, when changed, causes the component to re-render",
        "Props passed from a parent component",
        "The application's Redux store",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the useState hook?",
      options: [
        "A hook for managing async state",
        "A React hook that adds state to functional components, returning the current state value and a setter function",
        "A hook for fetching data from APIs",
        "A hook for managing global application state",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the useEffect hook used for?",
      options: [
        "Improving performance of React applications",
        "Performing side effects (data fetching, subscriptions, DOM manipulations) in functional components after rendering",
        "Accessing context values in functional components",
        "Creating custom hooks",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of keys in React lists?",
      options: [
        "Keys are CSS class names for list items",
        "Keys help React identify which items have changed, been added, or removed when rendering lists efficiently",
        "Keys are used to sort list items",
        "Keys are required IDs in the HTML output",
      ],
      correct_answer: 1,
    },
    {
      question: "What is React Context?",
      options: [
        "The context in which React was created",
        "A way to pass data through the component tree without passing props manually at every level",
        "The file context of a React component file",
        "A type of Redux middleware",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between controlled and uncontrolled components in React?",
      options: [
        "Controlled components are class components; uncontrolled are functional",
        "In a controlled component, form data is managed by React state; in uncontrolled, data is managed by the DOM itself",
        "Controlled components use useEffect; uncontrolled use useState",
        "Uncontrolled components are deprecated in React 18",
      ],
      correct_answer: 1,
    },
    {
      question: "What is React Router used for?",
      options: [
        "Managing server-side routing in Node.js",
        "Enabling client-side routing in a React application, allowing navigation between different views without full page reloads",
        "Managing state between pages",
        "Lazy loading React components",
      ],
      correct_answer: 1,
    },
    {
      question: "What is lifting state up in React?",
      options: [
        "Moving state to the Redux store",
        "Moving shared state to the nearest common ancestor component so multiple child components can access it via props",
        "Moving a component higher in the component tree",
        "Updating state from a child component",
      ],
      correct_answer: 1,
    },
    {
      question: "What is React.memo used for?",
      options: [
        "Memoising API call results",
        "A higher-order component that prevents unnecessary re-renders of a component when its props have not changed",
        "A hook for caching expensive calculations",
        "Storing component instances in memory",
      ],
      correct_answer: 1,
    },
    {
      question: "What is useCallback?",
      options: [
        "A hook for creating callback-based APIs",
        "A hook that memoises a function, preventing it from being recreated on every render unless its dependencies change",
        "A hook for handling async callbacks",
        "A hook that creates a ref to a callback function",
      ],
      correct_answer: 1,
    },
    {
      question: "What is useMemo?",
      options: [
        "A hook for memoising component state",
        "A hook that memoises the result of an expensive calculation, recomputing it only when its dependencies change",
        "The same as useCallback",
        "A hook for optimising useEffect",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a custom React hook?",
      options: [
        "A hook provided by the React team but not yet in the official docs",
        "A reusable function starting with 'use' that extracts and shares stateful logic between components",
        "A third-party library hook",
        "A class method in a React class component",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of useRef in React?",
      options: [
        "Creating a reference to the Redux store",
        "Storing a mutable value that persists across renders without causing re-renders, and for accessing DOM elements directly",
        "Referencing global CSS variables",
        "Creating a reference to an imported module",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Next.js and how does it extend React?",
      options: [
        "A CSS framework built on top of React",
        "A React framework providing server-side rendering, static site generation, file-based routing, and API routes out of the box",
        "A state management library for React",
        "A testing framework for React applications",
      ],
      correct_answer: 1,
    },
    {
      question: "What is code splitting in React?",
      options: [
        "Splitting CSS code into multiple files",
        "Dividing the application bundle into smaller chunks that are loaded on demand, reducing initial load time",
        "Separating React components into individual files",
        "Splitting logic between client and server",
      ],
      correct_answer: 1,
    },
  ],
  4: [
    {
      question: "What is Node.js?",
      options: [
        "A front-end JavaScript framework",
        "A JavaScript runtime built on Chrome's V8 engine that enables running JavaScript on the server side",
        "A relational database system",
        "A CSS preprocessing tool",
      ],
      correct_answer: 1,
    },
    {
      question: "What is npm?",
      options: [
        "Node Package Manager — the default package manager for Node.js used to install, share, and manage JavaScript packages",
        "A Node programming module",
        "Network Protocol Manager",
        "A testing framework for Node.js",
      ],
      correct_answer: 0,
    },
    {
      question: "What is Express.js?",
      options: [
        "A fast CSS framework",
        "A minimal and flexible Node.js web application framework providing routing and middleware capabilities",
        "A JavaScript testing library",
        "A database ORM for Node.js",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a REST API?",
      options: [
        "An API using XML exclusively",
        "An architectural style for designing networked APIs using HTTP methods (GET, POST, PUT, DELETE) and stateless communication",
        "A real-time streaming API",
        "A type of GraphQL implementation",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of middleware in Express.js?",
      options: [
        "Software that bridges the operating system and applications",
        "Functions that have access to the request and response objects in the request-response cycle, used for logging, authentication, parsing, etc.",
        "A type of database query layer",
        "The layer between the front end and back end",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a relational database?",
      options: [
        "A database where all data is stored as key-value pairs",
        "A database organised into tables with defined relationships between them, using SQL to query data",
        "A document-based database like MongoDB",
        "A database where tables are unrelated",
      ],
      correct_answer: 1,
    },
    {
      question: "What is SQL?",
      options: [
        "Structured Query Language — a language for managing and querying relational databases",
        "A server-side scripting language",
        "A standard for REST APIs",
        "A JavaScript library for database connections",
      ],
      correct_answer: 0,
    },
    {
      question: "What is a NoSQL database?",
      options: [
        "A database that does not use SQL or tables, instead using flexible document, key-value, graph, or column-based data models",
        "A broken SQL database",
        "A database with no structured data",
        "An SQL database without foreign keys",
      ],
      correct_answer: 0,
    },
    {
      question: "What is MongoDB?",
      options: [
        "A relational database using SQL",
        "A popular document-based NoSQL database storing data as BSON (JSON-like) documents",
        "A graph database",
        "A cloud-only database service",
      ],
      correct_answer: 1,
    },
    {
      question: "What is an ORM (Object-Relational Mapper)?",
      options: [
        "A tool for creating database tables",
        "A tool that maps database records to programming language objects, allowing developers to interact with databases using code rather than raw SQL",
        "A type of REST API middleware",
        "A framework for converting JSON to SQL",
      ],
      correct_answer: 1,
    },
    {
      question: "What is JWT (JSON Web Token)?",
      options: [
        "A JavaScript testing tool",
        "A compact, self-contained token used for securely transmitting information between parties, commonly used for authentication",
        "A type of JSON data format",
        "A web framework extension",
      ],
      correct_answer: 1,
    },
    {
      question: "What is authentication vs. authorisation?",
      options: [
        "They are the same process",
        "Authentication verifies who you are; authorisation determines what you are allowed to do",
        "Authorisation verifies identity; authentication controls access",
        "Authentication is client-side; authorisation is server-side",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of environment variables in a Node.js application?",
      options: [
        "Setting system PATH variables",
        "Storing configuration values (API keys, database URLs) outside the codebase to keep them secure and configurable across environments",
        "JavaScript variables with global scope",
        "Variables that control Node.js runtime behaviour",
      ],
      correct_answer: 1,
    },
    {
      question: "What is CORS (Cross-Origin Resource Sharing)?",
      options: [
        "A type of CSS for cross-browser compatibility",
        "A browser security mechanism that controls which web origins can access resources from a server",
        "A Node.js routing framework",
        "A method for sharing data between databases",
      ],
      correct_answer: 1,
    },
    {
      question: "What is WebSockets and when would you use them?",
      options: [
        "A type of HTTP request",
        "A protocol providing full-duplex communication over a single TCP connection, used for real-time features like chat or live updates",
        "A security protocol for web servers",
        "A method for compressing web responses",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a package.json file?",
      options: [
        "A JSON file for styling packages",
        "A file describing a Node.js project's metadata, dependencies, scripts, and configuration",
        "A configuration file for CSS preprocessors",
        "A database schema file",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the event-driven architecture of Node.js?",
      options: [
        "A programming pattern where events trigger functions (callbacks/handlers), enabling efficient handling of I/O operations without blocking",
        "Node.js processes one request at a time",
        "Node.js uses multiple threads for each request",
        "An architecture for frontend event listeners only",
      ],
      correct_answer: 0,
    },
    {
      question: "What is rate limiting in an API?",
      options: [
        "Limiting the size of API responses",
        "Restricting the number of requests a client can make to an API within a given time window to prevent abuse",
        "Caching API responses for performance",
        "A database query optimisation technique",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Prisma in the Node.js ecosystem?",
      options: [
        "A CSS animation library",
        "A next-generation ORM for Node.js and TypeScript providing type-safe database access with schema-based models",
        "A testing framework for Express.js",
        "A deployment platform for Node.js apps",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between synchronous and asynchronous code in Node.js?",
      options: [
        "Synchronous code is newer than asynchronous",
        "Synchronous code blocks execution until complete; asynchronous code initiates an operation and continues executing other code while waiting",
        "Asynchronous code is faster but less reliable",
        "They are the same in Node.js due to the event loop",
      ],
      correct_answer: 1,
    },
  ],
  5: [
    {
      question: "What is TypeScript?",
      options: [
        "A new programming language unrelated to JavaScript",
        "A statically typed superset of JavaScript that compiles to JavaScript, adding type safety and developer tooling",
        "A JavaScript runtime like Node.js",
        "A testing framework for JavaScript",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the main benefit of using TypeScript over JavaScript?",
      options: [
        "TypeScript is always faster than JavaScript",
        "TypeScript adds static type checking that catches errors at compile time rather than runtime, improving code reliability",
        "TypeScript enables new JavaScript features",
        "TypeScript eliminates the need for testing",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a TypeScript interface?",
      options: [
        "A visual UI component",
        "A TypeScript construct defining the shape (structure) of an object, used for type checking",
        "A class with only abstract methods",
        "A TypeScript module export",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between a TypeScript type alias and an interface?",
      options: [
        "They are completely identical",
        "Both define shapes, but type aliases can represent unions, primitives, and tuples; interfaces are primarily for object shapes and can be merged (declaration merging)",
        "Interfaces support generics; type aliases do not",
        "Type aliases are deprecated in TypeScript 5",
      ],
      correct_answer: 1,
    },
    {
      question: "What are TypeScript generics?",
      options: [
        "Generic error messages in TypeScript",
        "A feature allowing functions, classes, and interfaces to work with any type while preserving type information",
        "Default values for TypeScript parameters",
        "A type that accepts any value like 'any'",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the 'any' type in TypeScript and why should it be used sparingly?",
      options: [
        "A built-in TypeScript type for arrays",
        "A type that disables type checking for a variable — overusing it defeats the purpose of TypeScript's type safety",
        "The default type for all TypeScript variables",
        "A type representing numeric values of any size",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a union type in TypeScript?",
      options: [
        "A type merging two classes together",
        "A type that can be one of several types, written as Type1 | Type2",
        "A TypeScript feature for combining modules",
        "A type representing an array of mixed types",
      ],
      correct_answer: 1,
    },
    {
      question: "What is TypeScript's strict mode?",
      options: [
        "A mode that prevents all errors from compiling",
        "A compiler option enabling a set of strict type-checking rules that catch more potential runtime errors",
        "A mode that enforces coding style conventions",
        "A mode disabling all JavaScript interoperability",
      ],
      correct_answer: 1,
    },
    {
      question: "What is type inference in TypeScript?",
      options: [
        "TypeScript inferring code performance characteristics",
        "TypeScript's ability to automatically determine the type of a variable based on its value, without explicit annotation",
        "Inferring type from a parent class",
        "A feature for guessing API response types",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a TypeScript enum?",
      options: [
        "A list of enumerated CSS values",
        "A data structure that defines a set of named constants, making code more readable when working with fixed sets of related values",
        "A type for iterating over arrays",
        "A JavaScript class with limited methods",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the 'unknown' type in TypeScript?",
      options: [
        "A type for variables with no assigned value",
        "A safer alternative to 'any' — a variable of type 'unknown' cannot be used without first narrowing its type",
        "A type for undefined variables",
        "An error type for unhandled exceptions",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a TypeScript decorator?",
      options: [
        "A CSS-like styling annotation",
        "A special declaration that can be attached to a class, method, or property to modify its behaviour, commonly used in frameworks like Angular",
        "A comment style in TypeScript files",
        "A type annotation for function parameters",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the tsconfig.json file used for?",
      options: [
        "Configuring TypeScript testing",
        "Configuring the TypeScript compiler options for a project, including target JavaScript version, strict mode, and path aliases",
        "Managing TypeScript package versions",
        "Defining TypeScript module exports",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a tuple in TypeScript?",
      options: [
        "A set of unique values",
        "An array type where the number of elements and the type of each element are fixed: e.g. [string, number]",
        "A pair of related objects",
        "An unordered collection of types",
      ],
      correct_answer: 1,
    },
    {
      question: "What is type narrowing in TypeScript?",
      options: [
        "Reducing the number of types in a union",
        "The process of refining a type to a more specific type using type guards (e.g. typeof, instanceof, or custom guards)",
        "A TypeScript compiler optimisation",
        "Removing optional properties from a type",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the readonly modifier in TypeScript?",
      options: [
        "Making a file read-only in the filesystem",
        "A modifier preventing a property from being reassigned after initialisation",
        "A modifier for read-only database access",
        "Making a TypeScript module unable to be imported",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a discriminated union in TypeScript?",
      options: [
        "A union type used for database queries",
        "A union where each member has a common literal property (discriminant) enabling TypeScript to narrow the type in switch/if statements",
        "A type combining two interfaces with a shared method",
        "A union requiring all types to be compatible",
      ],
      correct_answer: 1,
    },
    {
      question: "What are utility types in TypeScript?",
      options: [
        "Types from the TypeScript standard library for arrays",
        "Built-in generic types (e.g. Partial<T>, Required<T>, Pick<T,K>, Omit<T,K>) that transform existing types",
        "Helper functions for type checking",
        "Types for Node.js utility modules",
      ],
      correct_answer: 1,
    },
    {
      question: "What does Partial<T> utility type do?",
      options: [
        "Makes all properties of T required",
        "Creates a type with all properties of T made optional",
        "Picks a subset of properties from T",
        "Makes T a read-only type",
      ],
      correct_answer: 1,
    },
    {
      question:
        "What is the difference between null and undefined in TypeScript with strictNullChecks enabled?",
      options: [
        "They are interchangeable in TypeScript",
        "undefined means a variable has been declared but not assigned a value; null is an intentional absence of a value — both must be explicitly handled",
        "null is forbidden in TypeScript strict mode",
        "undefined is a TypeScript keyword; null is a JavaScript primitive",
      ],
      correct_answer: 1,
    },
  ],
  6: [
    {
      question: "What is version control?",
      options: [
        "Managing software version numbers",
        "A system for tracking changes to files over time, enabling collaboration and the ability to revert to previous versions",
        "A method for updating software to the latest version",
        "A system for managing database schema versions",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Git?",
      options: [
        "A cloud-based repository hosting service",
        "A distributed version control system for tracking changes in source code during software development",
        "A programming language",
        "A software deployment tool",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between Git and GitHub?",
      options: [
        "They are the same tool",
        "Git is the version control system; GitHub is a cloud-based hosting platform for Git repositories with collaboration features",
        "GitHub is the open-source version of Git",
        "Git is for teams; GitHub is for individuals",
      ],
      correct_answer: 1,
    },
    {
      question: "What does 'git clone' do?",
      options: [
        "Creates a new empty repository",
        "Creates a local copy of a remote repository",
        "Copies a file within the repository",
        "Creates a new branch of the current repository",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a Git branch?",
      options: [
        "A backup copy of the main codebase",
        "A lightweight, movable pointer to a commit, enabling isolated development of features or fixes without affecting the main branch",
        "A forked version of a repository",
        "A directory within a Git repository",
      ],
      correct_answer: 1,
    },
    {
      question: "What does 'git commit' do?",
      options: [
        "Pushes changes to a remote repository",
        "Saves a snapshot of staged changes to the repository's history with a descriptive message",
        "Merges changes from two branches",
        "Downloads the latest changes from a remote",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a pull request (PR) in GitHub?",
      options: [
        "A request to download the latest code",
        "A proposal to merge code changes from one branch into another, enabling code review and discussion before merging",
        "A request to pull changes from a remote to local",
        "An automated deployment pipeline",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a Git merge conflict?",
      options: [
        "When two developers work on the same repository",
        "When Git cannot automatically reconcile differences between two branches being merged, requiring manual resolution",
        "When a branch cannot be merged due to permissions",
        "A conflict between local and remote repository versions",
      ],
      correct_answer: 1,
    },
    {
      question: "What does 'git rebase' do?",
      options: [
        "Removes all commits from a branch",
        "Replays commits from one branch onto another, creating a linear history instead of a merge commit",
        "Reverts the last commit",
        "Creates a new branch based on an existing one",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a .gitignore file used for?",
      options: [
        "Listing files to commit",
        "Specifying files and directories that should not be tracked by Git (e.g. node_modules, .env files)",
        "Configuring Git user settings",
        "Defining branch protection rules",
      ],
      correct_answer: 1,
    },
    {
      question: "What is CI/CD in software development?",
      options: [
        "Continuous Intelligence and Continuous Deployment",
        "Continuous Integration (automatically building and testing code on each commit) and Continuous Delivery/Deployment (automating release to production)",
        "Code Inspection and Code Deployment tools",
        "A project management methodology",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of code review?",
      options: [
        "To find and punish developers for mistakes",
        "To improve code quality by having peers examine code for correctness, clarity, security, and adherence to standards before merging",
        "To measure developer productivity",
        "To replace automated testing",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a Git tag?",
      options: [
        "A comment attached to a commit",
        "A reference to a specific commit used to mark important points like release versions",
        "A branch that cannot be deleted",
        "A label added to a GitHub issue",
      ],
      correct_answer: 1,
    },
    {
      question: "What is semantic versioning (SemVer)?",
      options: [
        "Version numbers that describe software semantics",
        "A versioning scheme using MAJOR.MINOR.PATCH numbers — major for breaking changes, minor for new features, patch for bug fixes",
        "A system for describing API endpoints by version",
        "A Git branching strategy",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of 'git stash'?",
      options: [
        "Storing permanent code changes",
        "Temporarily saving uncommitted changes without committing them, allowing you to switch branches with a clean working directory",
        "Deleting unwanted branches",
        "Archiving old commits",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a monorepo?",
      options: [
        "A single-module repository",
        "A single version control repository containing multiple related projects or packages, managed together",
        "A repository with a single contributor",
        "A repository that is never forked",
      ],
      correct_answer: 1,
    },
    {
      question: "What is DevOps?",
      options: [
        "A programming language used by operations teams",
        "A set of practices combining software development and IT operations to shorten the systems development life cycle and improve delivery frequency",
        "A type of agile methodology",
        "A cloud computing platform",
      ],
      correct_answer: 1,
    },
    {
      question: "What is infrastructure as code (IaC)?",
      options: [
        "Writing code for embedded systems",
        "Managing and provisioning computing infrastructure through machine-readable configuration files rather than manual processes",
        "Documenting server infrastructure in code comments",
        "A type of low-code development platform",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a Git fork?",
      options: [
        "A branch of a repository",
        "A personal copy of another user's repository that allows you to experiment and contribute back via pull requests",
        "A conflict between two branches",
        "Merging two separate repositories",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the trunk-based development branching strategy?",
      options: [
        "Maintaining long-lived feature branches",
        "A strategy where developers commit small, frequent changes directly to a shared main branch (trunk) to minimise integration complexity",
        "Using a separate trunk branch for production only",
        "A strategy for managing database migrations",
      ],
      correct_answer: 1,
    },
  ],
  7: [
    {
      question: "What is web performance optimisation?",
      options: [
        "Making a website visually attractive",
        "The practice of improving the speed and responsiveness of a website to enhance user experience and SEO rankings",
        "Using compression for all website images",
        "Reducing the number of pages on a website",
      ],
      correct_answer: 1,
    },
    {
      question: "What is accessibility (a11y) in web development?",
      options: [
        "The speed at which a website loads",
        "Designing and building websites that can be used by all people, including those with disabilities",
        "Making a website available in multiple languages",
        "Restricting website access to authorised users only",
      ],
      correct_answer: 1,
    },
    {
      question: "What are Web Core Vitals?",
      options: [
        "Essential security metrics",
        "Google's set of key performance metrics measuring real-world user experience: Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS)",
        "Accessibility standards for web content",
        "The minimum requirements for a web server",
      ],
      correct_answer: 1,
    },
    {
      question: "What is lazy loading?",
      options: [
        "A slow website loading problem",
        "A performance technique deferring the loading of non-critical resources (images, scripts) until they are needed, reducing initial load time",
        "Loading data only from cache",
        "A technique for loading a website on low-bandwidth connections",
      ],
      correct_answer: 1,
    },
    {
      question: "What is WCAG and why does it matter?",
      options: [
        "A web hosting protocol",
        "Web Content Accessibility Guidelines — an internationally recognised standard for making web content accessible to people with disabilities",
        "A web caching protocol",
        "A security vulnerability assessment framework",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a Content Delivery Network (CDN)?",
      options: [
        "A network of web content creators",
        "A distributed network of servers that delivers content to users from the server closest to them, reducing latency",
        "A database distribution system",
        "A network for managing content management systems",
      ],
      correct_answer: 1,
    },
    {
      question: "What is HTTPS and why is it important?",
      options: [
        "Hypertext Transfer Protocol Secure — encrypts data between browser and server, protecting user data and establishing trust",
        "A faster version of HTTP",
        "A type of SSL certificate",
        "The protocol used by APIs only",
      ],
      correct_answer: 0,
    },
    {
      question: "What is SEO (Search Engine Optimisation)?",
      options: [
        "A paid advertising strategy",
        "The practice of optimising a website's content, structure, and technical aspects to rank higher in organic search engine results",
        "The process of submitting a website to search engines",
        "A strategy for social media marketing",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of semantic HTML for SEO and accessibility?",
      options: [
        "It makes the website look better",
        "Using meaningful HTML elements helps search engines understand content and enables assistive technologies to interpret the page correctly",
        "It reduces the size of HTML files",
        "It is required by modern browsers",
      ],
      correct_answer: 1,
    },
    {
      question: "What is image optimisation in web performance?",
      options: [
        "Making images visually sharper",
        "Reducing image file sizes using compression, choosing appropriate formats (WebP, AVIF), and serving appropriately sized images for each device",
        "Removing all images from a webpage",
        "Replacing images with CSS-based designs",
      ],
      correct_answer: 1,
    },
    {
      question: "What is code minification?",
      options: [
        "Writing very short code",
        "The process of removing unnecessary characters (whitespace, comments) from code without changing functionality, reducing file size",
        "Compressing JavaScript files into a single file",
        "A process for code review and simplification",
      ],
      correct_answer: 1,
    },
    {
      question: "What is tree shaking in JavaScript bundling?",
      options: [
        "Removing deeply nested components",
        "A dead code elimination technique removing unused JavaScript code from the final bundle",
        "Optimising the component hierarchy in React",
        "A way to reduce the size of the DOM tree",
      ],
      correct_answer: 1,
    },
    {
      question: "What is browser caching?",
      options: [
        "A browser extension for caching websites",
        "Storing copies of web assets (HTML, CSS, JS, images) in the browser so returning visitors don't need to re-download them",
        "Server-side caching of database queries",
        "A DNS caching mechanism",
      ],
      correct_answer: 1,
    },
    {
      question: "What is ARIA (Accessible Rich Internet Applications)?",
      options: [
        "A set of HTML attributes that improve accessibility for dynamic content and custom UI widgets for assistive technologies",
        "An advanced routing internet architecture",
        "A type of rich media content",
        "An API for building voice interfaces",
      ],
      correct_answer: 0,
    },
    {
      question: "What is the purpose of meta tags in HTML?",
      options: [
        "Styling the page header",
        "Providing metadata about a webpage (description, viewport, charset) used by browsers and search engines",
        "Creating navigation menus",
        "Defining CSS variables",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a service worker?",
      options: [
        "A background process for managing web workers",
        "A JavaScript file that runs in the background in the browser, enabling features like push notifications, background sync, and offline caching (PWAs)",
        "A server-side worker process",
        "A web server management tool",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a Progressive Web App (PWA)?",
      options: [
        "A web app developed progressively for different browsers",
        "A web application that uses modern web capabilities to deliver an app-like experience, including offline support, push notifications, and home screen installation",
        "An app that progressively adds features over time",
        "A mobile-first web design approach",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the viewport meta tag used for?",
      options: [
        "Setting the page background colour",
        "Controlling how a webpage scales on mobile devices — ensuring it renders at the correct width for the device screen",
        "Defining the language of the webpage",
        "Setting the page title in the browser tab",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of a robots.txt file?",
      options: [
        "Blocking malicious robots from a website",
        "Instructing search engine crawlers which pages or sections of the website they may or may not access",
        "A security file for server access control",
        "A file listing all pages on the website",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a sitemap.xml used for?",
      options: [
        "Displaying a visual map of the website to users",
        "Helping search engines discover and index all important pages on a website",
        "Defining the website's URL structure",
        "Managing website navigation menus",
      ],
      correct_answer: 1,
    },
  ],
  8: [
    {
      question: "What is web security?",
      options: [
        "Locking down web server hardware",
        "The practice of protecting websites, web applications, and web services from threats that could compromise data, availability, or integrity",
        "Using HTTPS on a website",
        "Restricting website access by IP address",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Cross-Site Scripting (XSS)?",
      options: [
        "Cross-browser scripting differences",
        "An injection attack where malicious scripts are injected into a trusted website and executed in a victim's browser",
        "A type of SQL injection attack",
        "Cross-site resource sharing vulnerability",
      ],
      correct_answer: 1,
    },
    {
      question: "What is SQL injection?",
      options: [
        "A method for optimising SQL queries",
        "An attack where malicious SQL code is inserted into an input field to manipulate or access a database unauthorised",
        "A method for injecting test data into a database",
        "A type of XSS attack targeting databases",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Cross-Site Request Forgery (CSRF)?",
      options: [
        "Forging HTTP requests to a different origin",
        "An attack where a malicious site tricks a user's browser into making an authenticated request to another site where the user is logged in",
        "A form of XSS attack",
        "A man-in-the-middle attack on web requests",
      ],
      correct_answer: 1,
    },
    {
      question: "What is input validation and why is it critical?",
      options: [
        "Checking that user input looks visually correct",
        "Verifying and sanitising all user-provided data before processing to prevent injection attacks and ensure data integrity",
        "Validating HTML form attributes",
        "Checking input character limits only",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the principle of least privilege?",
      options: [
        "Giving all users minimal access to all systems",
        "Granting users and processes only the minimum permissions necessary to perform their functions",
        "Using the simplest security measures",
        "Limiting server privileges to reduce costs",
      ],
      correct_answer: 1,
    },
    {
      question: "What is HTTPS and how does TLS/SSL protect it?",
      options: [
        "HTTPS uses SSH tunneling for security",
        "HTTPS uses TLS (Transport Layer Security) to encrypt communication between browser and server, protecting against eavesdropping and tampering",
        "HTTPS is secured by firewalls only",
        "HTTPS hashes all data before transmission",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a Content Security Policy (CSP)?",
      options: [
        "A policy for managing website content editorial standards",
        "An HTTP header allowing servers to specify which sources of content the browser is allowed to execute or display, mitigating XSS attacks",
        "A firewall rule for web servers",
        "A cookie management policy",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the OWASP Top 10?",
      options: [
        "The ten most popular web frameworks",
        "A regularly updated list of the most critical web application security risks",
        "Ten performance benchmarks for web apps",
        "Ten best practices for web development",
      ],
      correct_answer: 1,
    },
    {
      question: "What is bcrypt used for?",
      options: [
        "Encrypting data in transit",
        "A password hashing function that is deliberately slow and resistant to brute-force attacks, used to securely store passwords",
        "A symmetric encryption algorithm",
        "A JSON Web Token signing algorithm",
      ],
      correct_answer: 1,
    },
    {
      question: "What is OAuth 2.0?",
      options: [
        "An authentication protocol for creating user accounts",
        "An authorisation framework allowing third-party applications to access resources on behalf of a user without exposing credentials",
        "An open-source web security framework",
        "An HTTP-based encryption standard",
      ],
      correct_answer: 1,
    },
    {
      question: "What is rate limiting and how does it improve security?",
      options: [
        "Limits the speed of database queries",
        "Restricting the number of requests from a client within a time window to prevent brute-force attacks and denial-of-service",
        "Restricting the size of API responses",
        "A method of encrypting high-frequency requests",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a man-in-the-middle (MITM) attack?",
      options: [
        "A social engineering attack",
        "An attack where a third party intercepts and potentially alters communication between two parties who believe they are communicating directly",
        "An SQL injection variant",
        "An attack targeting database administrators",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a zero-day vulnerability?",
      options: [
        "A vulnerability discovered on day zero of a software release",
        "A previously unknown security flaw that has no available patch and is being actively exploited before the developer is even aware of it",
        "A vulnerability with zero risk",
        "A security flaw intentionally introduced by developers",
      ],
      correct_answer: 1,
    },
    {
      question: "What is cookie security and what attributes should a cookie have?",
      options: [
        "All cookies should be public and accessible to JavaScript",
        "Secure cookies should have HttpOnly (preventing JS access), Secure (HTTPS only), and SameSite attributes to prevent CSRF and XSS exploitation",
        "Cookies should be stored in localStorage for better security",
        "Cookies should be encrypted using bcrypt",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a dependency vulnerability?",
      options: [
        "A critical feature that depends on another library",
        "A security flaw in a third-party library or package used by an application, potentially exploitable if not updated",
        "A performance issue caused by too many dependencies",
        "A vulnerability in the application's dependency injection framework",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a penetration test (pen test)?",
      options: [
        "Testing the performance of a web server under load",
        "An authorised simulated attack on a system to identify security vulnerabilities before malicious actors can exploit them",
        "A security audit of source code only",
        "A vulnerability scan run by automated tools",
      ],
      correct_answer: 1,
    },
    {
      question: "What is environment variable security best practice?",
      options: [
        "Storing secrets in source code for easy access",
        "Storing sensitive values (API keys, database passwords) in environment variables outside the codebase and never committing them to version control",
        "Encrypting all environment variables in the codebase",
        "Using a single .env file shared across all environments",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between encoding, encryption, and hashing?",
      options: [
        "They are all the same process",
        "Encoding transforms data for transmission (reversible, no key); encryption transforms data for confidentiality (reversible with key); hashing is one-way and produces a fixed digest",
        "Hashing is reversible; encryption is not",
        "Encoding is the most secure of the three",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a WAF (Web Application Firewall)?",
      options: [
        "A standard network firewall for web servers",
        "A security tool that monitors and filters HTTP traffic to protect web applications from attacks like XSS, SQL injection, and CSRF",
        "A tool for blocking unwanted emails",
        "A type of CDN with security features",
      ],
      correct_answer: 1,
    },
  ],
  9: [
    {
      question: "What is software testing?",
      options: [
        "Writing documentation for code",
        "The process of evaluating software to identify defects, ensure it meets requirements, and verify expected behaviour",
        "Reviewing code for style and readability",
        "Deploying code to a staging environment",
      ],
      correct_answer: 1,
    },
    {
      question: "What is unit testing?",
      options: [
        "Testing the entire application end-to-end",
        "Testing individual, isolated units of code (functions, methods, components) to verify they produce the correct output",
        "Testing the integration between modules",
        "Performance testing of a single server unit",
      ],
      correct_answer: 1,
    },
    {
      question: "What is integration testing?",
      options: [
        "Testing individual functions in isolation",
        "Testing how multiple components or modules work together when integrated",
        "Testing the full user journey through the application",
        "Testing third-party API integrations only",
      ],
      correct_answer: 1,
    },
    {
      question: "What is end-to-end (E2E) testing?",
      options: [
        "Testing the beginning and ending states of a function",
        "Testing a complete user workflow through the application from the user interface to the backend to simulate real user behaviour",
        "Testing all unit tests in sequence",
        "Integration testing with multiple databases",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Jest?",
      options: [
        "A Node.js web framework",
        "A popular JavaScript testing framework for unit and integration tests, providing a test runner, assertion library, and mocking capabilities",
        "A test runner for browser-based tests only",
        "An end-to-end testing framework",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Playwright?",
      options: [
        "A browser scripting language",
        "A modern end-to-end testing framework that automates browser interactions across Chromium, Firefox, and WebKit",
        "A React component testing library",
        "A performance testing tool",
      ],
      correct_answer: 1,
    },
    {
      question: "What is test-driven development (TDD)?",
      options: [
        "Writing tests after code is complete",
        "A development approach where tests are written before the code, following the Red-Green-Refactor cycle",
        "Developing tests using a test framework only",
        "Having a separate QA team write tests",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a mock in testing?",
      options: [
        "A simplified copy of a real component",
        "A test double that simulates the behaviour of a real dependency, enabling isolated testing of a unit without its actual dependencies",
        "A staging environment for testing",
        "A temporary test dataset",
      ],
      correct_answer: 1,
    },
    {
      question: "What is code coverage?",
      options: [
        "The documentation coverage of a codebase",
        "A metric measuring the percentage of code lines, branches, or statements executed during testing",
        "The number of tests written for each function",
        "The percentage of bugs caught by tests",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the testing pyramid?",
      options: [
        "A prioritisation of the most important tests",
        "A model suggesting the majority of tests should be fast, isolated unit tests, with fewer integration tests, and even fewer slow E2E tests at the top",
        "A hierarchy of testing teams in an organisation",
        "A triangle diagram showing test coverage percentage",
      ],
      correct_answer: 1,
    },
    {
      question: "What is snapshot testing in React?",
      options: [
        "Taking a screenshot of a React component",
        "A testing technique that captures a 'snapshot' of a component's rendered output and compares it to future renders to detect unintended changes",
        "A method for testing animations",
        "A performance baseline for component rendering",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a stub in testing?",
      options: [
        "A simplified component placeholder in the UI",
        "A test double that provides controlled responses to function calls, used to replace real functions with predictable outputs in tests",
        "An incomplete test case",
        "A mock of an entire module",
      ],
      correct_answer: 1,
    },
    {
      question: "What is regression testing?",
      options: [
        "Testing new features only",
        "Testing to ensure that recent code changes have not broken existing functionality",
        "Testing the performance of the application over time",
        "A type of security testing",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of a testing environment?",
      options: [
        "An environment used by developers to write code",
        "A dedicated environment that mirrors production and is used to run tests safely without affecting real users or data",
        "A cloud environment for running automated tests",
        "A staging environment for client demonstrations",
      ],
      correct_answer: 1,
    },
    {
      question: "What is performance testing?",
      options: [
        "Testing that a developer works efficiently",
        "Testing how an application behaves under various load conditions to identify performance bottlenecks",
        "Unit testing of performance-critical functions",
        "Testing the rendering speed of CSS animations",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Cypress?",
      options: [
        "A Node.js testing library for unit tests",
        "A JavaScript-based end-to-end testing framework designed for modern web applications, running in the browser with a visual test runner",
        "A load testing tool",
        "A static code analysis tool",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the 'Arrange, Act, Assert' (AAA) pattern in unit testing?",
      options: [
        "A three-step deployment process",
        "A test structure where you Arrange the inputs/mocks, Act by calling the unit under test, and Assert that the output matches expectations",
        "A three-tier application architecture",
        "A code review framework",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a flaky test?",
      options: [
        "A poorly written test",
        "A test that passes and fails intermittently without code changes, often due to timing issues, async problems, or external dependencies",
        "A test that always fails",
        "A test with incomplete assertions",
      ],
      correct_answer: 1,
    },
    {
      question: "What is static code analysis?",
      options: [
        "Analysing code that has no dynamic behaviour",
        "Automatically examining source code without executing it to identify bugs, code smells, security issues, and style violations",
        "Measuring the static size of a codebase",
        "Manual code review by a human reviewer",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the React Testing Library philosophy?",
      options: [
        "Test implementation details like state and props directly",
        "Test components as users would use them — interacting via accessible roles and text rather than internal implementation details",
        "Only write snapshot tests for React components",
        "Write tests only for complex business logic components",
      ],
      correct_answer: 1,
    },
  ],
  10: [
    {
      question: "What is cloud computing?",
      options: [
        "Computing done on computers in cold climates",
        "The delivery of computing services (servers, storage, databases, software) over the internet on a pay-as-you-go basis",
        "A type of distributed operating system",
        "A networking protocol for data centres",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between IaaS, PaaS, and SaaS?",
      options: [
        "They are different pricing models",
        "IaaS provides raw infrastructure; PaaS provides a development platform; SaaS provides a complete application — each offering more abstraction than the last",
        "IaaS is for large enterprises; PaaS for SMEs; SaaS for individuals",
        "They are different cloud provider categories",
      ],
      correct_answer: 1,
    },
    {
      question: "What is containerisation and what is Docker?",
      options: [
        "Packaging physical hardware",
        "Containerisation packages an application and its dependencies into a portable unit; Docker is the leading tool for creating and managing containers",
        "Docker is a type of virtual machine",
        "Docker is a cloud hosting service",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Kubernetes?",
      options: [
        "A type of container image format",
        "An open-source container orchestration platform for automating deployment, scaling, and management of containerised applications",
        "A CI/CD tool for managing pipelines",
        "A cloud-native programming language",
      ],
      correct_answer: 1,
    },
    {
      question: "What is serverless computing?",
      options: [
        "Computing without any servers involved",
        "A cloud execution model where the cloud provider manages server infrastructure, and developers deploy functions that run on demand",
        "A type of container-based architecture",
        "A development environment with no local servers",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a microservices architecture?",
      options: [
        "Building very small web applications",
        "An architectural style structuring an application as a collection of small, independently deployable services each responsible for a specific function",
        "Using micro-sized containers",
        "A development methodology for solo developers",
      ],
      correct_answer: 1,
    },
    {
      question: "What is horizontal vs. vertical scaling?",
      options: [
        "Scaling width vs. height of a server rack",
        "Vertical scaling adds more power to a single server; horizontal scaling adds more servers to distribute load",
        "Both mean the same thing — adding more resources",
        "Horizontal scaling is only for databases; vertical for web servers",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a load balancer?",
      options: [
        "A tool for measuring server load",
        "A system that distributes incoming network traffic across multiple servers to ensure reliability and performance",
        "A network switch connecting data centres",
        "A database query optimiser",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Vercel and for what type of projects is it commonly used?",
      options: [
        "A container orchestration platform",
        "A cloud platform optimised for deploying frontend frameworks (especially Next.js), offering edge functions, automatic CI/CD, and global CDN",
        "A backend API hosting service",
        "A database hosting solution",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Infrastructure as Code (IaC) and which tools support it?",
      options: [
        "Writing scripts for manual server setup",
        "Managing infrastructure through machine-readable config files; tools include Terraform, AWS CloudFormation, and Pulumi",
        "Writing code that runs on infrastructure hardware",
        "A method for documenting server architecture",
      ],
      correct_answer: 1,
    },
    {
      question: "What is observability in production systems?",
      options: [
        "Watching servers run in a data centre",
        "The ability to understand the internal state of a system from its external outputs — comprising metrics, logs, and distributed traces",
        "Monitoring user behaviour on a website",
        "A security practice for auditing system access",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a GitHub Action?",
      options: [
        "An action button in the GitHub UI",
        "An automated workflow triggered by repository events (e.g. push, PR) to perform CI/CD tasks like testing, building, and deploying",
        "A GitHub feature for managing issues",
        "A plugin for GitHub Copilot",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of a staging environment?",
      options: [
        "Staging physical server hardware",
        "A pre-production environment that mirrors production and is used to test releases before they are deployed to real users",
        "An environment for writing and testing code during development",
        "A backup environment activated during outages",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a reverse proxy?",
      options: [
        "A proxy running on the client side",
        "A server that sits in front of web servers, forwarding client requests to the appropriate backend server, used for load balancing, SSL termination, and caching",
        "A way to reverse a database query",
        "A VPN for accessing internal servers",
      ],
      correct_answer: 1,
    },
    {
      question: "What is an SLA (Service Level Agreement) in cloud services?",
      options: [
        "A software licence agreement",
        "A commitment by a cloud provider specifying guaranteed uptime, performance levels, and remedies if those levels are not met",
        "A security audit agreement",
        "A software support contract",
      ],
      correct_answer: 1,
    },
    {
      question: "What is blue-green deployment?",
      options: [
        "A deployment using blue and green server types",
        "A release strategy running two identical production environments (blue = current, green = new), switching traffic to green once verified",
        "A colour-coded branching strategy",
        "A deployment method for blue-team security tests",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a feature flag?",
      options: [
        "A flag in the codebase indicating a beta feature",
        "A technique enabling specific features to be toggled on or off without code deployment, allowing gradual rollouts and A/B testing",
        "A Git flag for marking feature branches",
        "A flag in a Docker container configuration",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the CAP theorem in distributed systems?",
      options: [
        "A theorem about compute, availability, and performance",
        "A theorem stating that a distributed system can only guarantee two of three properties: Consistency, Availability, and Partition tolerance simultaneously",
        "A theorem about CPU, application, and programming performance",
        "A cloud architecture principle",
      ],
      correct_answer: 1,
    },
    {
      question: "What is edge computing?",
      options: [
        "Computing at the edge of a network cable",
        "Processing data close to the source (end user or device) rather than in a centralised data centre, reducing latency",
        "A type of cloud computing for financial edge cases",
        "Computing performed on edge browser extensions",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the twelve-factor app methodology?",
      options: [
        "An app development method using twelve programming languages",
        "A set of twelve best practices for building scalable, maintainable, cloud-native applications covering config, dependencies, logs, processes, and more",
        "A twelve-step agile development process",
        "A methodology for twelve-person development teams",
      ],
      correct_answer: 1,
    },
  ],
};

function generateFinalTestQuestions(moduleId) {
  const id = parseInt(moduleId, 10);
  if (!FINAL_TEST_QUESTIONS[id]) {
    console.warn(`No final test questions found for module ${moduleId}, falling back to module 1`);
  }
  return FINAL_TEST_QUESTIONS[id] || FINAL_TEST_QUESTIONS[1];
}

export default function ModuleFinalTestPage() {
  const router = useRouter();
  const { moduleId } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passed, setPassed] = useState(false);
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [noBadges, setNoBadges] = useState(false);

  // Load noBadges flag from localStorage on mount
  useEffect(() => {
    try {
      setNoBadges(localStorage.getItem(NO_BADGES_KEY) === "true");
    } catch {
      // localStorage unavailable (SSR or private mode)
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleComplete = async (testPassed, score) => {
    setPassed(testPassed);
    if (user) {
      try {
        await fetch("/api/module-final-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ moduleId, appKey: APP_KEY, score, userId: user.id }),
        });
      } catch (err) {
        console.error("Error saving final test result:", err);
      }
    }
  };

  const goToNextModule = () => {
    const nextModuleId = parseInt(moduleId) + 1;
    if (nextModuleId <= 10) {
      router.push(`/modules/${nextModuleId}/lesson/1`);
    } else {
      router.push("/curriculum");
    }
  };

  const confirmSkip = () => {
    try {
      localStorage.setItem(NO_BADGES_KEY, "true");
    } catch {
      // localStorage unavailable
    }
    setNoBadges(true);
    setShowSkipDialog(false);
    goToNextModule();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          Module {moduleId} Final Test – {APP_DISPLAY}
        </title>
      </Head>
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Skip-mode banner */}
          {noBadges && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-yellow-400 bg-yellow-50 px-4 py-3 text-yellow-800 text-sm"
            >
              ⚠️ <strong>You&apos;re in Skip mode.</strong> You can continue without quizzes, but
              you won&apos;t earn badges or a certificate for this course.
            </div>
          )}

          <div className="mb-6">
            <button
              onClick={() => router.push(`/modules/${moduleId}/lesson/1`)}
              className="text-purple-600 hover:text-purple-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Module
            </button>
          </div>

          <div className="card mb-8">
            <h1 className="text-3xl font-bold mb-2">Module {moduleId} – Final Test</h1>
            <p className="text-gray-600">
              Complete all 20 questions. You need to score 14/20 or higher to pass and unlock the
              next level.
            </p>
          </div>

          <ModuleFinalTestComponent
            questions={generateFinalTestQuestions(moduleId)}
            moduleId={moduleId}
            appKey={APP_KEY}
            onComplete={handleComplete}
          />

          {/* Skip quiz button — shown below test when not yet passed */}
          {!passed && !noBadges && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowSkipDialog(true)}
                className="text-sm text-gray-500 underline hover:text-gray-700"
              >
                Skip quiz and continue
              </button>
            </div>
          )}

          {/* Skip mode: Continue without taking the test */}
          {noBadges && !passed && (
            <div className="card bg-yellow-50 border-2 border-yellow-400 mt-6">
              <p className="text-gray-700 mb-4">Continue to the next module.</p>
              <button onClick={goToNextModule} className="btn-primary">
                Continue to Next Module
              </button>
            </div>
          )}

          {passed && (
            <div className="card bg-green-50 border-2 border-green-500 mt-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                🎉 Module Complete – Next Level Unlocked!
              </h3>
              <button onClick={() => router.push("/curriculum")} className="btn-primary">
                Continue to Curriculum
              </button>
            </div>
          )}

          {/* Skip confirmation dialog */}
          {showSkipDialog && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="skip-dialog-title"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6">
                <h2 id="skip-dialog-title" className="text-xl font-semibold mb-3">
                  Skip quizzes?
                </h2>
                <p className="text-gray-700 mb-6">
                  You can continue to the next module, but you won&apos;t earn badges or a
                  certificate for this course. <strong>This cannot be undone.</strong>
                </p>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setShowSkipDialog(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button onClick={confirmSkip} className="btn-primary">
                    Skip
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
