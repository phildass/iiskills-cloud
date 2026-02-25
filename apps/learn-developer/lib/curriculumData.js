export const curriculumData = {
  modules: [
    {
      id: 1,
      title: "The Web's DNA: HTTP, DNS, and Request/Response",
      deepDive: `Think of the internet as a massive city. DNS (Domain Name System) is the phone book—you don't memorize everyone's address; you look up "Google" and it translates to 142.250.80.46. When you type a URL, your browser is like a tourist asking for directions. DNS says, "Oh, you want Google? Take Route 142.250.80.46."

HTTP (HyperText Transfer Protocol) is the language spoken between your browser (the client) and the server (the restaurant). You don't just barge into a kitchen; you send a polite REQUEST: "GET me the homepage, please." The server responds with a RESPONSE: "Here's your HTML, with a side of CSS and JavaScript. Status: 200 OK!"

Request methods are like ordering at a drive-thru. GET means "show me the menu" (retrieve data). POST is "here's my order" (send data). PUT updates your order, DELETE cancels it. Status codes are the server's mood: 200s are happy ("OK!"), 300s are indecisive ("Try over there"), 400s blame you ("Bad Request, buddy"), and 500s blame themselves ("Internal Server Error—we messed up").

Headers are the metadata whisperers. They carry secret info: cookies (your VIP pass), content-type (is this JSON or HTML?), and authorization tokens (your security badge). The body is the actual payload—the data you're sending or receiving.

Mastering HTTP isn't just about memorizing codes; it's about understanding the conversation. Every click, every form submission, every API call is a request-response tango. When you grasp this flow, debugging becomes intuitive. "Why's my POST failing? Oh, I forgot the Content-Type header!" You're not just coding; you're orchestrating a symphony of data exchange. Welcome to the web's DNA—where every byte has a purpose!`,
      codeExample: `// Making HTTP requests with Fetch API
const fetchUserData = async (userId) => {
  try {
    // GET request - retrieve data
    const response = await fetch(\`https://api.example.com/users/\${userId}\`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here'
      }
    });

    if (!response.ok) {
      throw new Error(\`HTTP Error! Status: \${response.status}\`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
  }
};

// POST request - send data
const createUser = async (userData) => {
  const response = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  return await response.json();
};`,
      test: [
        {
          question: "What does DNS stand for and what is its primary function?",
          options: [
            "Domain Network System - manages network traffic",
            "Domain Name System - translates domain names to IP addresses",
            "Digital Name Service - encrypts domain requests",
            "Data Navigation System - routes packets efficiently"
          ],
          correctAnswer: 1
        },
        {
          question: "What HTTP status code indicates a successful request?",
          options: [
            "404 Not Found",
            "500 Internal Server Error",
            "200 OK",
            "301 Moved Permanently"
          ],
          correctAnswer: 2
        },
        {
          question: "Which HTTP method is used to retrieve data from a server?",
          options: [
            "POST",
            "GET",
            "PUT",
            "DELETE"
          ],
          correctAnswer: 1
        },
        {
          question: "What header specifies the format of data being sent?",
          options: [
            "Accept",
            "Authorization",
            "Content-Type",
            "User-Agent"
          ],
          correctAnswer: 2
        },
        {
          question: "What does a 404 status code indicate?",
          options: [
            "Server error",
            "Successful request",
            "Resource not found",
            "Unauthorized access"
          ],
          correctAnswer: 2
        }
      ]
    },
    {
      id: 2,
      title: "Structural Integrity: Semantic HTML5 & SEO",
      deepDive: `Imagine building a house. You could stack bricks randomly and call it a day, but architects use blueprints. HTML is your blueprint, and semantic HTML5 is the difference between a chaotic shack and a well-organized mansion.

In the old days, developers used <div> for everything—like labeling every room in your house as "space." Semantic HTML5 introduced meaningful tags: <header>, <nav>, <main>, <article>, <section>, <footer>. Now search engines and screen readers can understand: "Ah, THIS is the navigation, THAT's the main content." It's accessibility and SEO magic rolled into one.

Think of Google's crawler as a speed-reader skimming your resume. If you use <h1> for your name and <h2> for section headers, it gets the hierarchy instantly. But if everything's a <span> with custom styling, the crawler shrugs and moves on. Semantic tags are breadcrumbs for robots and humans alike.

SEO (Search Engine Optimization) isn't dark magic; it's about clarity. Use <title> and <meta> tags wisely—they're your billboard on Google's highway. Alt text on images isn't optional; it's both accessibility and SEO gold. Structured data with schema.org markup tells Google, "This is a recipe, not just text about food."

Semantic HTML also future-proofs your code. When browsers add new features or assistive technologies evolve, they rely on standards. A <button> is universally understood; a <div onclick="..."> is a hacky imposter. Semantics aren't pedantic—they're professional. Write HTML like you're explaining your site to a five-year-old and a search engine simultaneously. Clean structure = better rankings = happier users!`,
      codeExample: `// Semantic HTML5 Structure Example
const BlogPost = () => {
  return (
    <article className="blog-post">
      <header>
        <h1>Understanding Semantic HTML5</h1>
        <p className="meta">
          <time dateTime="2024-01-15">January 15, 2024</time>
          <span> by <span className="author">Jane Developer</span></span>
        </p>
      </header>

      <section className="content">
        <h2>Why Semantics Matter</h2>
        <p>
          Semantic HTML provides meaning to web content, improving 
          accessibility and SEO performance.
        </p>
        
        <figure>
          <img 
            src="/semantic-html.jpg" 
            alt="Diagram showing semantic HTML5 structure with header, nav, main, and footer sections"
          />
          <figcaption>HTML5 Semantic Structure</figcaption>
        </figure>
      </section>

      <footer>
        <nav aria-label="Article tags">
          <a href="/tags/html5">#HTML5</a>
          <a href="/tags/accessibility">#Accessibility</a>
        </nav>
      </footer>
    </article>
  );
};`,
      test: [
        {
          question: "What is the primary benefit of using semantic HTML5 tags?",
          options: [
            "Faster page load times",
            "Better styling options",
            "Improved accessibility and SEO",
            "Smaller file sizes"
          ],
          correctAnswer: 2
        },
        {
          question: "Which tag should be used for the main navigation menu?",
          options: [
            "<menu>",
            "<nav>",
            "<navigation>",
            "<div class='nav'>"
          ],
          correctAnswer: 1
        },
        {
          question: "What does SEO stand for?",
          options: [
            "Semantic Element Optimization",
            "Search Engine Optimization",
            "Structured Element Organization",
            "Site Enhancement Operations"
          ],
          correctAnswer: 1
        },
        {
          question: "Which tag represents a self-contained composition in a document?",
          options: [
            "<section>",
            "<div>",
            "<article>",
            "<container>"
          ],
          correctAnswer: 2
        },
        {
          question: "Why is alt text important for images?",
          options: [
            "It makes images load faster",
            "It's required by HTML validators",
            "It improves accessibility and SEO",
            "It adds copyright protection"
          ],
          correctAnswer: 2
        }
      ]
    },
    {
      id: 3,
      title: "Visual Artistry: Modern CSS (Grid/Flexbox/Variables)",
      deepDive: `CSS used to be like arranging furniture with duct tape and prayers. Float-based layouts? Nightmare. Modern CSS—Grid, Flexbox, and Variables—is like upgrading from a skateboard to a Tesla.

Flexbox is your one-dimensional layout wizard. Think of it as organizing books on a shelf. You can arrange items in a row or column, justify them (left, center, right, space-between), and align them vertically. Need a responsive navbar? Flexbox. Card layouts that adjust gracefully? Flexbox. It's the Swiss Army knife for UI elements that need to flow.

CSS Grid is the two-dimensional powerhouse. Imagine a chessboard—you control rows AND columns simultaneously. Defining a layout with grid-template-areas is like sketching a wireframe in code: "header header header / sidebar content content / footer footer footer." Suddenly, complex layouts that took hours now take minutes. Grid doesn't replace Flexbox; they're dance partners. Use Grid for page structure, Flexbox for components.

CSS Variables (Custom Properties) are game-changers for theming. Instead of hardcoding colors everywhere, define --primary-color: #3498db; once and reference it with var(--primary-color). Dark mode toggle? Change one variable, boom—entire site switches. Variables cascade like regular CSS, so you can override them contextually. It's DRY (Don't Repeat Yourself) principles applied to styling.

Modern CSS also embraces calc(), clamp(), and min()/max() functions—math in stylesheets! Responsive design without media queries? Use clamp(1rem, 2vw, 3rem) for fluid typography. The web is evolving from static layouts to dynamic, user-centric experiences. Master these tools, and you'll design interfaces that feel alive!`,
      codeExample: `// Modern CSS with Grid, Flexbox, and Variables
const ModernLayout = () => {
  return (
    <div className="app-layout">
      <header className="header">Navigation</header>
      <aside className="sidebar">Sidebar</aside>
      <main className="main-content">Main Content</main>
      <footer className="footer">Footer</footer>
    </div>
  );
};

/* CSS Styles */
/*
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --spacing: 1rem;
  --max-width: 1200px;
}

.app-layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar content content"
    "footer footer footer";
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: var(--spacing);
}

.header {
  grid-area: header;
  background: var(--primary-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing);
}

.sidebar {
  grid-area: sidebar;
  background: var(--secondary-color);
}

.main-content {
  grid-area: content;
  padding: var(--spacing);
}

.footer {
  grid-area: footer;
  text-align: center;
}

@media (max-width: 768px) {
  .app-layout {
    grid-template-areas:
      "header"
      "content"
      "sidebar"
      "footer";
    grid-template-columns: 1fr;
  }
}
*/`,
      test: [
        {
          question: "What is the main difference between Flexbox and Grid?",
          options: [
            "Flexbox is faster than Grid",
            "Flexbox is one-dimensional, Grid is two-dimensional",
            "Grid is deprecated, use Flexbox instead",
            "Flexbox only works with images"
          ],
          correctAnswer: 1
        },
        {
          question: "How do you reference a CSS variable?",
          options: [
            "$(variable-name)",
            "var(--variable-name)",
            "${variableName}",
            "@variable-name"
          ],
          correctAnswer: 1
        },
        {
          question: "Which property is used to create flexible items in Flexbox?",
          options: [
            "flex-grow",
            "flexible",
            "flex-item",
            "display: flexible"
          ],
          correctAnswer: 0
        },
        {
          question: "What does 'gap' property do in CSS Grid?",
          options: [
            "Creates space between grid items",
            "Defines grid line width",
            "Sets minimum height for rows",
            "Controls grid overflow"
          ],
          correctAnswer: 0
        },
        {
          question: "Where should CSS variables be defined for global access?",
          options: [
            "In the <head> tag",
            "In the :root selector",
            "In the body selector",
            "In a separate variables.css file"
          ],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 4,
      title: "The Scripting Engine: JavaScript Fundamentals (Logic/Loops)",
      deepDive: `JavaScript is the engine that transforms static HTML into living, breathing applications. If HTML is the skeleton and CSS is the skin, JavaScript is the nervous system—making everything interactive, dynamic, and smart.

Variables are your data containers. Use const for values that won't change (like PI or API URLs), let for reassignable values (counters, toggles), and avoid var like the plague (it's function-scoped and causes hoisting headaches). Destructuring is syntactic sugar: const { name, age } = user; extracts properties elegantly—no more user.name repetition.

Conditional logic (if/else, ternary operators, switch statements) lets your code make decisions. Think of it as a choose-your-own-adventure book: "If user is logged in, show dashboard; else, show login." Ternary operators condense simple conditions: isActive ? 'Online' : 'Offline'. Clean, readable, professional.

Loops are repetition masters. for loops are classic: iterate N times or through arrays with indices. forEach is functional and clean for array operations. map transforms arrays (return new values), filter selects elements (return booleans), and reduce aggregates data (sum totals, build objects). Modern JavaScript favors these over raw for loops—they're declarative, not imperative.

Functions are reusable logic blocks. Arrow functions (const add = (a, b) => a + b) are concise and lexically bind 'this'—perfect for callbacks. Regular functions have their place (methods, constructors), but arrows dominate modern code. Understanding scope, closures, and hoisting unlocks JavaScript's true power. You're not just scripting—you're architecting logic that scales!`,
      codeExample: `// JavaScript Fundamentals: Logic and Loops
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Conditional Logic with Ternary Operator
const checkEvenOdd = (num) => num % 2 === 0 ? 'Even' : 'Odd';

// Array Methods: Map, Filter, Reduce
const doubled = numbers.map(num => num * 2);
const evens = numbers.filter(num => num % 2 === 0);
const sum = numbers.reduce((acc, num) => acc + num, 0);

// Modern Loop Examples
const processUserData = (users) => {
  // Traditional for...of loop
  for (const user of users) {
    console.log(\`Processing: \${user.name}\`);
  }
  
  // forEach for side effects
  users.forEach((user, index) => {
    console.log(\`User #\${index + 1}: \${user.name}\`);
  });
  
  // Filter and Map combination
  const activeAdults = users
    .filter(user => user.age >= 18 && user.isActive)
    .map(user => ({
      fullName: \`\${user.firstName} \${user.lastName}\`,
      email: user.email
    }));
  
  return activeAdults;
};

// Switch statement for clarity
const getAccessLevel = (role) => {
  switch(role) {
    case 'admin':
      return 'full';
    case 'editor':
      return 'write';
    case 'viewer':
      return 'read';
    default:
      return 'none';
  }
};`,
      test: [
        {
          question: "What is the difference between 'let' and 'const'?",
          options: [
            "'let' is block-scoped, 'const' is function-scoped",
            "'const' cannot be reassigned, 'let' can be reassigned",
            "'let' is faster than 'const'",
            "There is no difference in modern JavaScript"
          ],
          correctAnswer: 1
        },
        {
          question: "Which array method transforms each element and returns a new array?",
          options: [
            "forEach()",
            "filter()",
            "map()",
            "reduce()"
          ],
          correctAnswer: 2
        },
        {
          question: "What does the filter() method return?",
          options: [
            "A single value",
            "A new array with elements that pass the test",
            "A boolean value",
            "The original array modified"
          ],
          correctAnswer: 1
        },
        {
          question: "What is the output of: true ? 'yes' : 'no'",
          options: [
            "'no'",
            "'yes'",
            "undefined",
            "Error"
          ],
          correctAnswer: 1
        },
        {
          question: "Which loop is best for iterating over array values (not indices)?",
          options: [
            "for (let i = 0; i < arr.length; i++)",
            "while loop",
            "for...of loop",
            "do...while loop"
          ],
          correctAnswer: 2
        }
      ]
    },
    {
      id: 5,
      title: "Asynchronous Flows: DOM, Promises, and Fetch API",
      deepDive: `Welcome to the asynchronous world, where JavaScript doesn't wait around like a patient customer—it multitasks like a caffeinated octopus.

The DOM (Document Object Model) is your browser's representation of HTML as a JavaScript object tree. Every <div>, <p>, and <button> becomes a node you can manipulate. document.querySelector('.my-class') selects elements, and .addEventListener() makes them interactive. The DOM is live—change it, and the page updates instantly. It's the bridge between your code and what users see.

Asynchronous JavaScript solves the blocking problem. Imagine ordering coffee—you don't stand frozen at the counter until it's ready; you wait off to the side. Callbacks were the original solution, but they led to "callback hell" (nested pyramids of doom). Promises emerged as saviors: they represent a value that WILL exist in the future. A Promise is either pending, fulfilled, or rejected—like a package delivery tracker.

The .then() chain handles success, .catch() handles errors, and .finally() runs cleanup code. But even better is async/await, which makes asynchronous code look synchronous. Slap async before a function, use await on Promises, and suddenly readability skyrockets. No more nesting—just clean, top-to-bottom logic.

The Fetch API is your HTTP request tool. fetch(url) returns a Promise that resolves to a Response object. Chain .then(res => res.json()) to parse JSON, or use async/await for elegance. Error handling is crucial—network fails, servers crash. Wrap fetch in try/catch blocks. Mastering async patterns isn't optional; it's essential. Modern apps are built on asynchronous foundations—APIs, databases, real-time updates. You're not just fetching data; you're orchestrating chaos into harmony!`,
      codeExample: `// Asynchronous JavaScript: Promises and Fetch API
const UserProfile = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Async/await approach
  const fetchUserProfile = async (userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(\`https://api.example.com/users/\${userId}\`);
      
      if (!response.ok) {
        throw new Error(\`HTTP Error: \${response.status}\`);
      }
      
      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Promise chain approach (alternative)
  const fetchUserProfileWithPromises = (userId) => {
    setLoading(true);
    
    fetch(\`https://api.example.com/users/\${userId}\`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      })
      .then(data => setUser(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    fetchUserProfile(123);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user data</p>;

  return <div>{user.name}</div>;
};`,
      test: [
        {
          question: "What does DOM stand for?",
          options: [
            "Data Object Model",
            "Document Object Model",
            "Dynamic Output Method",
            "Database Operation Manager"
          ],
          correctAnswer: 1
        },
        {
          question: "What are the three states of a Promise?",
          options: [
            "loading, success, failure",
            "pending, fulfilled, rejected",
            "waiting, complete, error",
            "start, processing, end"
          ],
          correctAnswer: 1
        },
        {
          question: "What does the 'await' keyword do?",
          options: [
            "Pauses execution until a Promise resolves",
            "Creates a new Promise",
            "Catches errors automatically",
            "Makes code run faster"
          ],
          correctAnswer: 0
        },
        {
          question: "What does fetch() return?",
          options: [
            "JSON data directly",
            "A Promise that resolves to a Response object",
            "A string of the response",
            "An error object"
          ],
          correctAnswer: 1
        },
        {
          question: "Which method is used to handle Promise rejections?",
          options: [
            ".then()",
            ".catch()",
            ".error()",
            ".fail()"
          ],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 6,
      title: "Component Architecture: React.js Fundamentals & State",
      deepDive: `React revolutionized web development by introducing component-based architecture. Think of it like LEGO blocks—each piece is self-contained, reusable, and snaps together to build complex structures.

Components are JavaScript functions that return JSX (JavaScript XML)—a syntax that looks like HTML but is actually JavaScript. Functional components replaced class components because they're simpler, cleaner, and leverage Hooks. A component should do ONE thing well. A Button component renders a button. A UserCard displays user info. Compose small components into larger ones—that's the React way.

Props (properties) are how components communicate. They're read-only inputs passed from parent to child: <Button text="Click Me" color="blue" />. Inside Button, you access props.text and props.color. Props flow DOWN the component tree—unidirectional data flow keeps things predictable. Want to send data UP? Pass callback functions as props.

State is component memory. When state changes, React re-renders the component. The useState Hook is your state manager: const [count, setCount] = useState(0). count is the current value, setCount updates it. Never mutate state directly—always use the setter function. State is local to a component unless lifted up to a parent for sharing.

Controlled components are forms where React owns the state. An input's value is tied to state, and onChange updates it—React is the "single source of truth." This pattern might feel verbose initially, but it gives you total control for validation, formatting, and complex interactions.

React's philosophy: UI is a function of state. When state changes, UI updates automatically. No manual DOM manipulation—just describe WHAT the UI should look like, and React figures out HOW to update it efficiently. You're not coding imperative instructions; you're declaring desired outcomes. That's the paradigm shift!`,
      codeExample: `// React Functional Component with Props and State
import React, { useState } from 'react';

// Simple reusable Button component
const Button = ({ text, onClick, variant = 'primary' }) => {
  return (
    <button 
      className={{\`btn btn-\${variant}\`}}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

// Counter component demonstrating state management
const Counter = () => {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const increment = () => setCount(prev => prev + step);
  const decrement = () => setCount(prev => prev - step);
  const reset = () => setCount(0);

  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      
      <div className="controls">
        <Button text="-" onClick={decrement} variant="danger" />
        <Button text="Reset" onClick={reset} variant="secondary" />
        <Button text="+" onClick={increment} variant="success" />
      </div>

      <div className="step-control">
        <label>
          Step: 
          <input 
            type="number" 
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
};

// Parent component demonstrating composition
const App = () => {
  const [showCounter, setShowCounter] = useState(true);

  return (
    <div>
      <Button 
        text={showCounter ? 'Hide Counter' : 'Show Counter'}
        onClick={() => setShowCounter(!showCounter)}
      />
      {showCounter && <Counter />}
    </div>
  );
};

export default App;`,
      test: [
        {
          question: "What is JSX?",
          options: [
            "A new programming language",
            "JavaScript XML - a syntax extension for JavaScript",
            "A CSS framework",
            "A database query language"
          ],
          correctAnswer: 1
        },
        {
          question: "How do you pass data from parent to child component?",
          options: [
            "Using state",
            "Using props",
            "Using context",
            "Using refs"
          ],
          correctAnswer: 1
        },
        {
          question: "What does useState return?",
          options: [
            "Only the current state value",
            "An array with current state and setter function",
            "An object with state properties",
            "A Promise"
          ],
          correctAnswer: 1
        },
        {
          question: "What is a controlled component in React?",
          options: [
            "A component that controls other components",
            "A form element whose value is controlled by React state",
            "A component that never re-renders",
            "A component with error boundaries"
          ],
          correctAnswer: 1
        },
        {
          question: "Can you modify props inside a component?",
          options: [
            "Yes, props are mutable",
            "No, props are read-only",
            "Only in class components",
            "Only with special functions"
          ],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 7,
      title: "Advanced UI Logic: React Hooks (useEffect, useContext)",
      deepDive: `Hooks transformed React from a component library into a full-fledged state management powerhouse. They let you "hook into" React features without writing classes—functional components got superpowers.

useEffect is your side effect manager. Side effects are anything that reaches outside the component: fetching data, setting up subscriptions, manually changing the DOM, timers. The basic pattern: useEffect(() => { /* effect code */ }, [dependencies]). The dependency array controls when effects run. Empty array []? Runs once after mount (like componentDidMount). Has values? Runs when those values change. No array? Runs after every render (use sparingly—it's expensive).

Cleanup is crucial. If you set up a subscription or timer, return a cleanup function: useEffect(() => { const timer = setTimeout(...); return () => clearTimeout(timer); }, []). React calls cleanup before re-running the effect or when the component unmounts—preventing memory leaks.

useContext solves prop drilling—the nightmare of passing props through 5+ layers of components. Create a Context with React.createContext(), provide it high in the tree with <ThemeContext.Provider value={theme}>, and consume it anywhere with const theme = useContext(ThemeContext). Suddenly, deeply nested components access shared state without props chains. It's elegant, scalable, and essential for themes, auth state, and global settings.

Custom Hooks are where magic happens. Extract reusable logic into functions starting with "use": useFetch, useAuth, useLocalStorage. They're composition at its finest—share stateful logic without wrapper components or render props. A custom Hook is just a function that uses other Hooks. React's Hook rules apply: only call at the top level, only in functional components or other Hooks.

Hooks aren't just convenience—they enable new patterns. Combine useEffect + useState for async data, useContext + useReducer for complex state management, useMemo + useCallback for performance optimization. You're not just using Hooks; you're architecting intelligent, reactive UIs!`,
      codeExample: `// Advanced React Hooks: useEffect and useContext
import React, { useState, useEffect, useContext, createContext } from 'react';

// Create Theme Context
const ThemeContext = createContext();

// Custom Hook for API data fetching
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Fetch failed');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function (if needed for AbortController)
    return () => {
      // cleanup code
    };
  }, [url]); // Re-run if URL changes

  return { data, loading, error };
};

// Theme Provider Component
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Component consuming context
const ThemedButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button 
      className={{\`btn btn-\${theme}\`}}
      onClick={toggleTheme}
    >
      Current theme: {theme}
    </button>
  );
};

// Component using custom Hook
const UserList = () => {
  const { data, loading, error } = useFetch('https://api.example.com/users');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {data?.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
};`,
      test: [
        {
          question: "When does useEffect run if the dependency array is empty []?",
          options: [
            "After every render",
            "Only once after the initial render",
            "Never",
            "Only when props change"
          ],
          correctAnswer: 1
        },
        {
          question: "What is the purpose of the cleanup function in useEffect?",
          options: [
            "To reset component state",
            "To prevent memory leaks and clean up side effects",
            "To improve performance",
            "To handle errors"
          ],
          correctAnswer: 1
        },
        {
          question: "What problem does useContext solve?",
          options: [
            "Performance optimization",
            "Prop drilling through multiple component layers",
            "State immutability",
            "Form validation"
          ],
          correctAnswer: 1
        },
        {
          question: "What must custom Hook names start with?",
          options: [
            "get",
            "use",
            "hook",
            "custom"
          ],
          correctAnswer: 1
        },
        {
          question: "What happens if you don't specify a dependency array in useEffect?",
          options: [
            "Effect runs once on mount",
            "Effect never runs",
            "Effect runs after every render",
            "React throws an error"
          ],
          correctAnswer: 2
        }
      ]
    },
    {
      id: 8,
      title: "Server-Side Command: Node.js & Express API Design",
      deepDive: `Node.js brought JavaScript to the server, and Express made building APIs feel like assembling furniture from IKEA—structured, modular, and surprisingly elegant (once you get past the instructions).

Node.js is a JavaScript runtime built on Chrome's V8 engine. It's event-driven and non-blocking—perfect for I/O-heavy operations like APIs, file systems, and databases. Instead of spawning threads for each request (expensive), Node uses an event loop. Think of a restaurant with one waiter (single-threaded) who takes orders and delivers food without waiting at the kitchen (non-blocking). It's efficient for handling thousands of concurrent connections.

Express is Node's minimalist web framework. At its core, it's middleware-based. Middleware functions are like assembly lines—each one processes the request, modifies it, and passes it to the next. app.use() registers middleware globally; route-specific middleware targets endpoints. Logging, authentication, parsing JSON—all middleware.

RESTful API design follows conventions: GET retrieves, POST creates, PUT/PATCH updates, DELETE removes. Routes should be nouns, not verbs: /users, not /getUsers. Use HTTP status codes correctly: 200 for success, 201 for created, 400 for bad requests, 401 for unauthorized, 404 for not found, 500 for server errors. Consistency is key—clients should predict your API's behavior.

Express routing is elegant: app.get('/users/:id', handler) captures dynamic parameters. Middleware like express.json() parses request bodies. Error handling middleware (four parameters: err, req, res, next) catches crashes gracefully. Async/await works beautifully—just wrap route handlers in try/catch.

Building APIs isn't just about CRUD operations; it's about designing interfaces that developers LOVE to use. Clear endpoints, predictable responses, helpful error messages—that's professional backend engineering. Node + Express is your toolkit; RESTful principles are your blueprint. You're not just writing servers; you're architecting scalable systems!`,
      codeExample: `// Node.js & Express API Design
const express = require('express');
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.path}\`);
  next();
});

// In-memory database (for demo)
let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];

// GET - Retrieve all users
app.get('/api/users', (req, res) => {
  res.json({ success: true, data: users });
});

// GET - Retrieve single user
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ 
      success: false, 
      error: 'User not found' 
    });
  }
  
  res.json({ success: true, data: user });
});

// POST - Create new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and email required' 
      });
    }
    
    const newUser = {
      id: users.length + 1,
      name,
      email
    };
    
    users.push(newUser);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// PUT - Update user
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ 
      success: false, 
      error: 'User not found' 
    });
  }
  
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  
  res.json({ success: true, data: user });
});

// DELETE - Remove user
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ 
      success: false, 
      error: 'User not found' 
    });
  }
  
  users.splice(index, 1);
  res.json({ success: true, message: 'User deleted' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!' 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
      test: [
        {
          question: "What is Node.js?",
          options: [
            "A JavaScript framework",
            "A JavaScript runtime built on Chrome's V8 engine",
            "A database system",
            "A CSS preprocessor"
          ],
          correctAnswer: 1
        },
        {
          question: "Which HTTP method is used to create a new resource?",
          options: [
            "GET",
            "PUT",
            "POST",
            "DELETE"
          ],
          correctAnswer: 2
        },
        {
          question: "What status code indicates successful resource creation?",
          options: [
            "200 OK",
            "201 Created",
            "204 No Content",
            "301 Moved Permanently"
          ],
          correctAnswer: 1
        },
        {
          question: "What is middleware in Express?",
          options: [
            "Database connection layer",
            "Functions that process requests before reaching route handlers",
            "Frontend components",
            "CSS styling system"
          ],
          correctAnswer: 1
        },
        {
          question: "How do you access URL parameters in Express?",
          options: [
            "req.query",
            "req.body",
            "req.params",
            "req.headers"
          ],
          correctAnswer: 2
        }
      ]
    },
    {
      id: 9,
      title: "Persistent Data: SQL vs. NoSQL (PostgreSQL/MongoDB)",
      deepDive: `Databases are your app's long-term memory. Choose wisely, because refactoring databases mid-project is like changing a plane's engine mid-flight—technically possible, but terrifying.

SQL databases (PostgreSQL, MySQL) are relational—think Excel spreadsheets on steroids. Tables have rows (records) and columns (fields). Relationships connect tables via foreign keys: Users table links to Posts via user_id. SQL (Structured Query Language) queries data: SELECT * FROM users WHERE age > 18. SQL databases enforce ACID properties (Atomicity, Consistency, Isolation, Durability)—transactions either fully succeed or fully fail. No half-updates. This rigidity is a feature, not a bug—banking apps need guarantees.

PostgreSQL is SQL's Swiss Army knife: JSONB support (store JSON natively!), full-text search, geospatial queries, and rock-solid reliability. Schemas are strictly defined—you declare columns and types upfront. Migrations handle changes. SQL is perfect for complex queries, joins, and data integrity constraints (unique emails, not-null fields).

NoSQL databases (MongoDB, DynamoDB) are document-based—think JSON objects as records. Collections replace tables, documents replace rows. No fixed schema—one user document can have different fields than another. This flexibility speeds development but sacrifices some guarantees. MongoDB stores data as BSON (Binary JSON), supports nested objects, and scales horizontally (shard across servers).

When to use SQL: Relational data (users and posts), complex queries with joins, ACID compliance critical (finance, healthcare). When to use NoSQL: Rapid iteration, flexible schemas, massive scale (social media, IoT), hierarchical data (nested comments). Many modern apps use BOTH—SQL for transactional data, NoSQL for logs/caching.

ORMs (Object-Relational Mappers) like Sequelize (SQL) or Mongoose (MongoDB) abstract raw queries into JavaScript. Instead of raw SQL, you write User.findAll(). They're convenient but add overhead—know when to drop to raw queries for performance. Mastering databases isn't memorizing syntax; it's understanding data modeling, indexing, and trade-offs!`,
      codeExample: `// PostgreSQL with Sequelize (SQL ORM)
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

// Define User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  age: DataTypes.INTEGER
});

// MongoDB with Mongoose (NoSQL ODM)
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  age: Number,
  profile: {
    bio: String,
    avatar: String
  },
  posts: [{
    title: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
  }]
});

const UserModel = mongoose.model('User', userSchema);

// CRUD Operations Example
const databaseOperations = {
  // CREATE
  createUser: async (userData) => {
    // SQL approach
    const sqlUser = await User.create(userData);
    
    // NoSQL approach
    const mongoUser = await UserModel.create(userData);
    
    return { sqlUser, mongoUser };
  },
  
  // READ
  findUsers: async () => {
    // SQL with conditions
    const activeUsers = await User.findAll({
      where: { age: { [Sequelize.Op.gte]: 18 } }
    });
    
    // NoSQL with query
    const verifiedUsers = await UserModel.find({ 
      age: { $gte: 18 } 
    });
    
    return { activeUsers, verifiedUsers };
  },
  
  // UPDATE
  updateUser: async (id, updates) => {
    // SQL
    await User.update(updates, { where: { id } });
    
    // NoSQL
    await UserModel.findByIdAndUpdate(id, updates);
  },
  
  // DELETE
  deleteUser: async (id) => {
    // SQL
    await User.destroy({ where: { id } });
    
    // NoSQL
    await UserModel.findByIdAndDelete(id);
  }
};`,
      test: [
        {
          question: "What does SQL stand for?",
          options: [
            "Simple Query Language",
            "Structured Query Language",
            "Sequential Query Logic",
            "Systematic Question Language"
          ],
          correctAnswer: 1
        },
        {
          question: "What is the main difference between SQL and NoSQL databases?",
          options: [
            "SQL is faster than NoSQL",
            "SQL is relational with fixed schemas, NoSQL is flexible with document-based storage",
            "NoSQL cannot handle large datasets",
            "SQL is only for web applications"
          ],
          correctAnswer: 1
        },
        {
          question: "What does ACID stand for in database transactions?",
          options: [
            "Automatic, Consistent, Isolated, Durable",
            "Atomicity, Consistency, Isolation, Durability",
            "Active, Complete, Independent, Distributed",
            "Adaptive, Concurrent, Integrated, Dedicated"
          ],
          correctAnswer: 1
        },
        {
          question: "Which database is document-based?",
          options: [
            "PostgreSQL",
            "MySQL",
            "MongoDB",
            "Oracle"
          ],
          correctAnswer: 2
        },
        {
          question: "What is an ORM?",
          options: [
            "Object-Relational Mapping - a tool to interact with databases using objects",
            "Online Resource Manager",
            "Optimized Response Method",
            "Operational Record Module"
          ],
          correctAnswer: 0
        }
      ]
    },
    {
      id: 10,
      title: "The DevOps Finish: Deployment, JWT Security, and CI/CD",
      deepDive: `DevOps is where your code meets the real world—deployment, security, automation. It's the difference between a prototype and a production-ready system that scales, secures, and self-heals.

Deployment isn't "git push and pray." Modern platforms like Vercel, Netlify, or AWS handle the heavy lifting, but you need to understand the pipeline. Build steps compile your code (Next.js builds, Webpack bundles), tests verify nothing broke, and deployment pushes to production servers. Environment variables (.env files) separate dev from production—API keys, database URLs, secret tokens. NEVER hardcode secrets; always use process.env.

JWT (JSON Web Tokens) revolutionized authentication. Instead of server-side sessions (which don't scale), JWTs are self-contained tokens. They have three parts: header (metadata), payload (user info), and signature (cryptographic proof). The server signs tokens with a secret key; clients send them in Authorization headers. Verify signatures to ensure authenticity. JWTs are stateless—the server doesn't store sessions, enabling horizontal scaling. But they can't be revoked easily, so use short expiration times and refresh tokens for long-lived sessions.

CI/CD (Continuous Integration/Continuous Deployment) automates the boring stuff. Push code, and GitHub Actions or CircleCI run tests, lint code, build, and deploy automatically. No manual FTP uploads. CI ensures code integrates smoothly (run tests on every commit). CD deploys passing builds to staging or production. It's reliability through automation—humans make mistakes; robots don't (usually).

Security isn't an afterthought. Sanitize inputs (prevent SQL injection), validate data, use HTTPS everywhere, implement rate limiting (stop DDoS attacks), and keep dependencies updated (npm audit for vulnerabilities). CORS headers control which domains can access your API. Helmet.js adds security headers in Express. Security is layers—no single solution; multiple defenses.

DevOps mindset: automate repetition, monitor everything, fail fast and recover faster. Deployment shouldn't be scary; it should be routine. You're not just shipping code—you're building resilient, secure, scalable systems that handle real users, real traffic, real stakes!`,
      codeExample: `// JWT Authentication & Security Best Practices
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

// Security middleware
app.use(helmet()); // Adds security headers
app.use(express.json({ limit: '10mb' })); // Prevent large payloads

// Rate limiting to prevent brute force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '1h';

// User registration with password hashing
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password || password.length < 8) {
      return res.status(400).json({ 
        error: 'Invalid email or password (min 8 chars)' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save user (pseudo-code)
    const user = { id: 1, email, password: hashedPassword };
    
    res.status(201).json({ 
      message: 'User created successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login with JWT generation
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user (pseudo-code)
    const user = { id: 1, email, password: '$hashed$' };
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.json({ 
      token, 
      user: { id: user.id, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Authentication middleware
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Protected route
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ 
    message: 'Access granted!', 
    user: req.user 
  });
});

// CI/CD Example: GitHub Actions workflow
/*
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: \${{ secrets.VERCEL_TOKEN }}
*/`,
      test: [
        {
          question: "What does JWT stand for?",
          options: [
            "JavaScript Web Token",
            "JSON Web Token",
            "Java Web Technology",
            "Just Web Transfer"
          ],
          correctAnswer: 1
        },
        {
          question: "What are the three parts of a JWT?",
          options: [
            "username, password, token",
            "header, payload, signature",
            "key, value, hash",
            "id, data, checksum"
          ],
          correctAnswer: 1
        },
        {
          question: "What does CI/CD stand for?",
          options: [
            "Code Integration/Code Deployment",
            "Continuous Integration/Continuous Deployment",
            "Central Intelligence/Central Database",
            "Client Interface/Client Design"
          ],
          correctAnswer: 1
        },
        {
          question: "Why should passwords be hashed before storing?",
          options: [
            "To make them shorter",
            "To prevent storing plain text passwords for security",
            "To speed up authentication",
            "It's required by law"
          ],
          correctAnswer: 1
        },
        {
          question: "What is the purpose of environment variables?",
          options: [
            "To store CSS styles",
            "To separate configuration from code and protect secrets",
            "To improve performance",
            "To enable debugging"
          ],
          correctAnswer: 1
        }
      ]
    }
  ],

  // Skills metadata for certificate
  skillsData: {
    title: "Full-Stack Web Developer",
    skills: [
      "HTTP/DNS Protocols & Request/Response Cycle",
      "Semantic HTML5 & SEO Best Practices",
      "Modern CSS (Grid, Flexbox, Variables)",
      "JavaScript ES6+ (Logic, Loops, Functions)",
      "Asynchronous JavaScript (Promises, Async/Await, Fetch API)",
      "React.js Component Architecture & State Management",
      "Advanced React Hooks (useEffect, useContext)",
      "Node.js & Express API Development",
      "Database Design (SQL & NoSQL)",
      "DevOps (Deployment, JWT Security, CI/CD)"
    ],
    certificationLevel: "Professional Developer Certification",
    institution: "iiskills Developer Academy"
  },

  // Certification messages
  certificationMessages: {
    failure: {
      threshold: 30,
      message: "Keep pushing forward! Full-stack development is a marathon, not a sprint. Review the modules, practice the code examples, and try again. Every expert was once a beginner who refused to give up. You've got this! 💪"
    },
    pass: {
      threshold: 70,
      message: "Congratulations! You've demonstrated solid understanding of full-stack development fundamentals. You're ready to build real-world applications. Keep coding, keep learning, and keep pushing boundaries! 🚀"
    },
    excellence: {
      threshold: 90,
      message: "Outstanding performance! You've mastered the full-stack developer curriculum with excellence. Your deep understanding of HTTP, React, Node.js, databases, and DevOps practices positions you as a professional developer. Build something amazing! 🌟"
    }
  }
};

export default curriculumData;