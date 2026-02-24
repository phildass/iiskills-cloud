// Enhanced Learn Developer Curriculum with Full AI-Generated Content
// Implements 3-tier progression, cross-app sync, and 30% pass-gate unlocks

export const enhancedCurriculumData = {
  // TIER 1: BASICS (Beginner)
  modules: [
    {
      id: 1,
      moduleId: 'logic-algorithms',
      tier: 'basics',
      title: "Logic & Control Flow",
      subtitle: "SHARED MODULE - Syncs with Learn AI",
      isSyncModule: true,
      syncTarget: 'learn-ai',
      syncModuleId: 'logic-algorithms',
      difficulty: "Beginner",
      deepDive: `Think of programming logic as teaching a very literal friend. They do EXACTLY what you say—no more, no less. If/else statements are like giving instructions with alternatives: "If it's raining, take an umbrella. Else, wear sunglasses."

Loops are your repetition tool. Instead of writing "console.log(i)" 100 times, you write it once inside a loop. For loops are like "do this 10 times." While loops are "keep doing this until condition X becomes false." The danger? Infinite loops—forgetting to update your condition is like saying "keep running until you're tired" but never getting tired!

Here's where it gets cool: The same logic patterns exist in AI! Chain-of-Thought prompting is like writing explicit if/else logic for AI: "If the user is asking about weather, provide forecast. If asking about time, provide current time." AI models internally use similar decision trees.

Big O notation (algorithm efficiency) matters in both worlds. An O(n²) loop in code is slow. An O(n²) attention mechanism in AI (like in transformers) is expensive. Same concept, different application!

**Pro Tip:** Master control flow in code, and you'll understand how AI "thinks" step-by-step. See Learn AI Module: Chain-of-Thought Prompting to see this concept from the AI side!`,
      
      codeExample: `// Control Flow Examples in JavaScript

// IF/ELSE - Decision Making
function greetUser(timeOfDay, userName) {
  if (timeOfDay === 'morning') {
    return \`Good morning, \${userName}! ☀️\`;
  } else if (timeOfDay === 'afternoon') {
    return \`Good afternoon, \${userName}! 🌤️\`;
  } else if (timeOfDay === 'evening') {
    return \`Good evening, \${userName}! 🌙\`;
  } else {
    return \`Hello, \${userName}!\`;
  }
}

// FOR LOOP - Iterate with counter
function sumNumbers(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

console.log(sumNumbers(100)); // 5050

// WHILE LOOP - Iterate based on condition
function countdown(seconds) {
  while (seconds > 0) {
    console.log(seconds);
    seconds--; // CRITICAL: Must update condition!
  }
  console.log('Blastoff! 🚀');
}

// ARRAY ITERATION - Modern JavaScript
const numbers = [1, 2, 3, 4, 5];

// forEach - Execute for each element
numbers.forEach(num => console.log(num * 2));

// map - Transform array
const doubled = numbers.map(num => num * 2); // [2, 4, 6, 8, 10]

// filter - Select elements
const evens = numbers.filter(num => num % 2 === 0); // [2, 4]

// reduce - Accumulate value
const total = numbers.reduce((sum, num) => sum + num, 0); // 15

// REAL-WORLD: API Data Processing
async function processUserData(users) {
  // Filter active users
  const activeUsers = users.filter(user => user.isActive);
  
  // Transform data structure
  const userEmails = activeUsers.map(user => ({
    id: user.id,
    email: user.email,
    fullName: \`\${user.firstName} \${user.lastName}\`
  }));
  
  // Count by category
  const counts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});
  
  return { userEmails, counts };
}`,

      lessons: [
        {
          id: 1,
          title: "Writing Rock-Solid If/Else Branches",
          content: `
            <h2>Lesson 1: Writing Rock-Solid If/Else Branches</h2>
            
            <h3>Introduction</h3>
            <p>Conditional logic is the brain of your code. Every decision—from showing a login button to processing payment—relies on if/else statements. Master this, and you control the flow of your entire application.</p>
            
            <p>Think of if/else as a bouncer at a club: "If you're on the list, come in. Else, sorry buddy." Simple, right? But in code, the devil is in the details: comparing values correctly, handling edge cases, and avoiding common pitfalls like assignment (=) vs. comparison (==, ===).</p>
            
            <h3>Core Concepts</h3>
            
            <h4>1. Basic If/Else Syntax</h4>
            <pre><code>if (condition) {
  // Execute if condition is true
} else {
  // Execute if condition is false
}</code></pre>
            
            <p><strong>Key Rules:</strong></p>
            <ul>
              <li>Condition must evaluate to true or false (boolean)</li>
              <li>Curly braces {} are optional for single statements BUT always use them (prevents bugs)</li>
              <li>Else is optional—you can have if without else</li>
            </ul>
            
            <h4>2. Else If - Multiple Conditions</h4>
            <pre><code>if (temperature > 30) {
  console.log('Hot! 🔥');
} else if (temperature > 20) {
  console.log('Warm 🌤️');
} else if (temperature > 10) {
  console.log('Cool 🍂');
} else {
  console.log('Cold ❄️');
}</code></pre>
            
            <p>Conditions are checked in order. First match wins—subsequent conditions are skipped!</p>
            
            <h4>3. The === vs == Trap</h4>
            <pre><code>// DANGER: Loose equality (==) with type coercion
if (5 == '5') {
  // TRUE - JavaScript converts string to number
}

// SAFE: Strict equality (===) - no type coercion
if (5 === '5') {
  // FALSE - different types (number vs string)
}</code></pre>
            
            <div class="pro-tip">
              <strong>Pro Tip:</strong> Always use === and !== to avoid type coercion bugs. In 99% of cases, you want strict equality. In AI prompts, ambiguity = unexpected outputs. Same principle!
            </div>
            
            <h4>4. Truthy and Falsy Values</h4>
            <p>JavaScript has "truthy" and "falsy" values—values that coerce to true or false in conditionals:</p>
            
            <p><strong>Falsy values (coerce to false):</strong></p>
            <ul>
              <li><code>false</code></li>
              <li><code>0</code></li>
              <li><code>""</code> (empty string)</li>
              <li><code>null</code></li>
              <li><code>undefined</code></li>
              <li><code>NaN</code></li>
            </ul>
            
            <p><strong>Everything else is truthy!</strong></p>
            
            <pre><code>const userName = "";

if (userName) {
  console.log(\`Hello, \${userName}\`);
} else {
  console.log("Hello, guest!"); // Executes (empty string is falsy)
}</code></pre>
            
            <h4>5. Nested If/Else and Guard Clauses</h4>
            <pre><code>// BAD: Nested hell
function processPayment(user) {
  if (user) {
    if (user.hasPaymentMethod) {
      if (user.balance > 0) {
        // Process payment
      } else {
        console.log("Insufficient funds");
      }
    } else {
      console.log("No payment method");
    }
  } else {
    console.log("No user");
  }
}

// GOOD: Guard clauses (early returns)
function processPayment(user) {
  if (!user) {
    console.log("No user");
    return;
  }
  
  if (!user.hasPaymentMethod) {
    console.log("No payment method");
    return;
  }
  
  if (user.balance <= 0) {
    console.log("Insufficient funds");
    return;
  }
  
  // Process payment - happy path at the bottom!
  console.log("Payment processed ✅");
}</code></pre>
            
            <h3>Practical Applications</h3>
            
            <h4>Real-World Example: User Authentication</h4>
            <pre><code>function authenticateUser(username, password) {
  // Guard clauses for missing inputs
  if (!username || !password) {
    return { success: false, message: "Username and password required" };
  }
  
  // Check user exists
  const user = database.findUser(username);
  if (!user) {
    return { success: false, message: "User not found" };
  }
  
  // Check password
  if (user.password !== hashPassword(password)) {
    return { success: false, message: "Incorrect password" };
  }
  
  // Check account status
  if (user.isSuspended) {
    return { success: false, message: "Account suspended" };
  }
  
  // All checks passed!
  return { 
    success: true, 
    message: "Login successful", 
    user: { id: user.id, username: user.username } 
  };
}</code></pre>
            
            <h3>AI Connection: Chain-of-Thought Prompting</h3>
            <p>If/else logic in code is identical to how you structure AI prompts for decision-making:</p>
            
            <p><strong>Code:</strong></p>
            <pre><code>if (userIntent === "weather") {
  getWeatherForecast();
} else if (userIntent === "time") {
  getCurrentTime();
}</code></pre>
            
            <p><strong>AI Prompt (Chain-of-Thought):</strong></p>
            <pre><code>"If the user is asking about weather, provide the forecast.
If the user is asking about time, provide the current time.
Otherwise, provide a general greeting."</code></pre>
            
            <div class="cross-app-link">
              <strong>🔗 Jump to Learn AI:</strong> See how this exact pattern works in <a href="/learn-ai/modules/logic-algorithms">Chain-of-Thought Prompting</a> to understand AI reasoning!
            </div>
            
            <h3>Common Pitfalls</h3>
            
            <h4>1. Assignment in Condition (The = vs == Bug)</h4>
            <pre><code>// WRONG - Assignment instead of comparison
if (user = null) { // Sets user to null, then checks if null (always false)
  console.log("No user");
}

// CORRECT
if (user === null) {
  console.log("No user");
}</code></pre>
            
            <h4>2. Missing Curly Braces</h4>
            <pre><code>// DANGEROUS - Only first line is in if block!
if (isLoggedIn)
  console.log("Welcome!");
  showDashboard(); // ALWAYS executes (not in if block)

// SAFE - Always use braces
if (isLoggedIn) {
  console.log("Welcome!");
  showDashboard();
}</code></pre>
            
            <h3>Exercise: Build a Grade Calculator</h3>
            <p><strong>Challenge:</strong> Write a function that takes a score (0-100) and returns a letter grade:</p>
            <ul>
              <li>A: 90-100</li>
              <li>B: 80-89</li>
              <li>C: 70-79</li>
              <li>D: 60-69</li>
              <li>F: Below 60</li>
            </ul>
            
            <pre><code>function getGrade(score) {
  // Your code here
}

console.log(getGrade(95)); // Should return "A"
console.log(getGrade(73)); // Should return "C"
console.log(getGrade(50)); // Should return "F"</code></pre>
            
            <h3>Key Takeaways</h3>
            <ul>
              <li>✅ Use === for strict equality (avoid == type coercion bugs)</li>
              <li>✅ Always use curly braces {} even for single-line if blocks</li>
              <li>✅ Prefer guard clauses over nested if/else for readability</li>
              <li>✅ Understand truthy/falsy values to write concise conditionals</li>
              <li>✅ Same logic patterns apply to AI prompting (Chain-of-Thought)</li>
            </ul>
          `
        },
        {
          id: 2,
          title: "Loop Patterns—From For to While and Beyond",
          content: `
            <h2>Lesson 2: Loop Patterns—From For to While and Beyond</h2>
            
            <h3>Introduction</h3>
            <p>Loops are your automation superpower. Instead of writing repetitive code, you write it once and let the loop handle iteration. But loops come with power AND danger—infinite loops can crash your app, inefficient loops can kill performance.</p>
            
            <p>In this lesson, you'll master for loops, while loops, and modern JavaScript array methods. You'll also learn when to use each and how to avoid common traps.</p>
            
            <h3>Core Concepts</h3>
            
            <h4>1. For Loop - The Classic</h4>
            <pre><code>for (initialization; condition; increment) {
  // Code to execute
}

// Example: Sum 1 to 100
let sum = 0;
for (let i = 1; i <= 100; i++) {
  sum += i;
}
console.log(sum); // 5050</code></pre>
            
            <p><strong>Three parts of a for loop:</strong></p>
            <ol>
              <li><strong>Initialization:</strong> let i = 1 (runs once before loop starts)</li>
              <li><strong>Condition:</strong> i <= 100 (checked before each iteration)</li>
              <li><strong>Increment:</strong> i++ (runs after each iteration)</li>
            </ol>
            
            <h4>2. While Loop - Condition-Based</h4>
            <pre><code>while (condition) {
  // Code to execute
  // MUST update condition inside loop!
}

// Example: Countdown
let seconds = 10;
while (seconds > 0) {
  console.log(seconds);
  seconds--; // CRITICAL: Must update!
}
console.log('Blastoff! 🚀');</code></pre>
            
            <div class="warning">
              <strong>⚠️ DANGER: Infinite Loops</strong>
              <pre><code>// INFINITE LOOP - Never updates condition!
let x = 0;
while (x < 10) {
  console.log(x); // Prints 0 forever
  // Missing: x++
}</code></pre>
              <p>Always ensure your loop condition will eventually become false!</p>
            </div>
            
            <h4>3. Do-While Loop - Executes At Least Once</h4>
            <pre><code>do {
  // Code to execute
} while (condition);

// Example: User input validation
let password;
do {
  password = prompt("Enter password:");
} while (password.length < 8);</code></pre>
            
            <p>Key difference: do-while runs the body BEFORE checking the condition. Useful when you need at least one execution.</p>
            
            <h4>4. Loop Control: break and continue</h4>
            <pre><code>// break - Exit loop early
for (let i = 0; i < 100; i++) {
  if (i === 50) {
    break; // Stops loop immediately
  }
  console.log(i); // Prints 0-49
}

// continue - Skip to next iteration
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) {
    continue; // Skip even numbers
  }
  console.log(i); // Prints only odd: 1, 3, 5, 7, 9
}</code></pre>
            
            <h3>Modern JavaScript: Array Methods</h3>
            
            <h4>forEach - Execute for Each Element</h4>
            <pre><code>const fruits = ['apple', 'banana', 'cherry'];

fruits.forEach((fruit, index) => {
  console.log(\`\${index + 1}. \${fruit}\`);
});
// 1. apple
// 2. banana
// 3. cherry</code></pre>
            
            <h4>map - Transform Array</h4>
            <pre><code>const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Real-world: Extract user emails
const users = [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' }
];
const emails = users.map(user => user.email);
// ['alice@example.com', 'bob@example.com']</code></pre>
            
            <h4>filter - Select Elements</h4>
            <pre><code>const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evens = numbers.filter(num => num % 2 === 0);
console.log(evens); // [2, 4, 6, 8, 10]

// Real-world: Filter active users
const activeUsers = users.filter(user => user.isActive);</code></pre>
            
            <h4>reduce - Accumulate Value</h4>
            <pre><code>const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((accumulator, current) => {
  return accumulator + current;
}, 0); // 0 is initial value
console.log(sum); // 15

// Real-world: Count occurrences
const votes = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple'];
const counts = votes.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
console.log(counts); // { apple: 3, banana: 2, cherry: 1 }</code></pre>
            
            <h3>When to Use Which Loop?</h3>
            
            <table>
              <thead>
                <tr>
                  <th>Loop Type</th>
                  <th>When to Use</th>
                  <th>Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>for</td>
                  <td>Known number of iterations</td>
                  <td>Loop 0 to 100</td>
                </tr>
                <tr>
                  <td>while</td>
                  <td>Unknown iterations, based on condition</td>
                  <td>Loop until user enters valid input</td>
                </tr>
                <tr>
                  <td>do-while</td>
                  <td>At least one execution needed</td>
                  <td>Prompt for input at least once</td>
                </tr>
                <tr>
                  <td>forEach</td>
                  <td>Execute code for each array element (no return value)</td>
                  <td>Log each user</td>
                </tr>
                <tr>
                  <td>map</td>
                  <td>Transform array to new array</td>
                  <td>Extract emails from users</td>
                </tr>
                <tr>
                  <td>filter</td>
                  <td>Select subset of array</td>
                  <td>Get active users</td>
                </tr>
                <tr>
                  <td>reduce</td>
                  <td>Accumulate/aggregate values</td>
                  <td>Sum numbers, count occurrences</td>
                </tr>
              </tbody>
            </table>
            
            <h3>Exercise: Sum Numbers 1–100</h3>
            <p><strong>Challenge:</strong> Write a function that sums all numbers from 1 to 100 using:</p>
            <ol>
              <li>A for loop</li>
              <li>A while loop</li>
              <li>The reduce method</li>
            </ol>
            
            <pre><code>// Method 1: For loop
function sumWithFor() {
  // Your code here
}

// Method 2: While loop
function sumWithWhile() {
  // Your code here
}

// Method 3: Reduce
function sumWithReduce() {
  const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
  // Your code here
}

console.log(sumWithFor()); // 5050
console.log(sumWithWhile()); // 5050
console.log(sumWithReduce()); // 5050</code></pre>
            
            <h3>AI Connection: Iteration in Machine Learning</h3>
            <p>Loops are fundamental in AI training too! Neural networks train through iterations (epochs), just like loops:</p>
            
            <pre><code>// Code: Training loop concept
for (let epoch = 0; epoch < 100; epoch++) {
  // Forward pass
  // Calculate loss
  // Backward pass (backpropagation)
  // Update weights
}

// AI: Training iterations
// Epoch 1: Loss = 0.85
// Epoch 2: Loss = 0.72 (getting better!)
// ...
// Epoch 100: Loss = 0.05 (converged!)</code></pre>
            
            <div class="cross-app-link">
              <strong>🔗 Jump to Learn AI:</strong> See how training loops work in <a href="/learn-ai/modules/neural-networks">Neural Networks: Backpropagation</a>!
            </div>
            
            <h3>Performance Considerations</h3>
            
            <h4>Big O Notation (Algorithm Efficiency)</h4>
            <pre><code>// O(n) - Linear time (good)
const findUser = (users, id) => {
  for (let user of users) {
    if (user.id === id) return user;
  }
};

// O(n²) - Quadratic time (BAD - avoid nested loops when possible!)
const findDuplicates = (array) => {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] === array[j]) {
        // Found duplicate
      }
    }
  }
};</code></pre>
            
            <div class="pro-tip">
              <strong>Pro Tip:</strong> Nested loops multiply complexity. One million items with O(n²) = 1 trillion operations! In AI, transformer attention is O(n²)—that's why long contexts are expensive. Same principle!
            </div>
            
            <h3>Key Takeaways</h3>
            <ul>
              <li>✅ For loops: known iterations, counter-based</li>
              <li>✅ While loops: condition-based, unknown iterations</li>
              <li>✅ Always update loop condition to avoid infinite loops</li>
              <li>✅ Modern JS: Use map/filter/reduce for cleaner, declarative code</li>
              <li>✅ Beware of nested loops (O(n²))—optimize when possible</li>
              <li>✅ Same iteration concepts power AI training loops</li>
            </ul>
          `
        },
        {
          id: 3,
          title: "Algorithm Thinking Basics",
          content: `
            <h2>Lesson 3: Algorithm Thinking Basics</h2>
            
            <h3>Introduction</h3>
            <p>An algorithm is a step-by-step recipe for solving a problem. Cooking is an algorithm: "Boil water, add pasta, cook 10 minutes, drain." Code is the same: break complex problems into simple, ordered steps.</p>
            
            <p>In this lesson, you'll learn to think algorithmically—a skill that applies to BOTH coding AND AI prompting. You'll master common algorithm patterns, understand efficiency (Big O notation), and see how these concepts power everything from search engines to neural networks.</p>
            
            <h3>Core Concepts</h3>
            
            <h4>1. What Makes an Algorithm?</h4>
            <p>Every algorithm has three properties:</p>
            <ol>
              <li><strong>Input:</strong> What data does it receive?</li>
              <li><strong>Process:</strong> What steps does it take?</li>
              <li><strong>Output:</strong> What result does it produce?</li>
            </ol>
            
            <pre><code>// Algorithm: Find maximum number in array
function findMax(numbers) {  // Input: array of numbers
  let max = numbers[0];       // Step 1: Assume first is max
  
  for (let i = 1; i < numbers.length; i++) {  // Step 2: Check each
    if (numbers[i] > max) {   // Step 3: If bigger, update
      max = numbers[i];
    }
  }
  
  return max;  // Output: maximum number
}

console.log(findMax([3, 7, 2, 9, 1])); // 9</code></pre>
            
            <h4>2. Common Algorithm Patterns</h4>
            
            <h5>a) Search</h5>
            <pre><code>// Linear Search - Check each element
function linearSearch(array, target) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === target) {
      return i; // Found at index i
    }
  }
  return -1; // Not found
}

// Binary Search - Efficient for sorted arrays
function binarySearch(sortedArray, target) {
  let left = 0;
  let right = sortedArray.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (sortedArray[mid] === target) {
      return mid; // Found!
    } else if (sortedArray[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  
  return -1; // Not found
}</code></pre>
            
            <h5>b) Sort</h5>
            <pre><code>// Bubble Sort - Simple but slow (O(n²))
function bubbleSort(array) {
  const n = array.length;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        // Swap
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
  }
  
  return array;
}

console.log(bubbleSort([64, 34, 25, 12, 22])); // [12, 22, 25, 34, 64]

// Modern JS - Use built-in sort (optimized)
const sorted = [64, 34, 25, 12, 22].sort((a, b) => a - b);</code></pre>
            
            <h5>c) Transform</h5>
            <pre><code>// Algorithm: Reverse a string
function reverseString(str) {
  return str.split('').reverse().join('');
}

// Algorithm: Convert to title case
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

console.log(toTitleCase('hello world')); // "Hello World"</code></pre>
            
            <h4>3. Big O Notation - Algorithm Efficiency</h4>
            <p>Big O describes how an algorithm's runtime grows as input size increases.</p>
            
            <table>
              <thead>
                <tr>
                  <th>Big O</th>
                  <th>Name</th>
                  <th>Example</th>
                  <th>1000 items</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>O(1)</td>
                  <td>Constant</td>
                  <td>Array access: arr[0]</td>
                  <td>1 operation</td>
                </tr>
                <tr>
                  <td>O(log n)</td>
                  <td>Logarithmic</td>
                  <td>Binary search</td>
                  <td>10 operations</td>
                </tr>
                <tr>
                  <td>O(n)</td>
                  <td>Linear</td>
                  <td>For loop, linear search</td>
                  <td>1,000 operations</td>
                </tr>
                <tr>
                  <td>O(n log n)</td>
                  <td>Linearithmic</td>
                  <td>Merge sort, quick sort</td>
                  <td>10,000 operations</td>
                </tr>
                <tr>
                  <td>O(n²)</td>
                  <td>Quadratic</td>
                  <td>Nested loops, bubble sort</td>
                  <td>1,000,000 operations</td>
                </tr>
                <tr>
                  <td>O(2ⁿ)</td>
                  <td>Exponential</td>
                  <td>Recursive Fibonacci</td>
                  <td>Basically forever</td>
                </tr>
              </tbody>
            </table>
            
            <pre><code>// O(1) - Constant time
function getFirstElement(array) {
  return array[0]; // Same time regardless of array size
}

// O(n) - Linear time
function findElement(array, target) {
  for (let item of array) {
    if (item === target) return true;
  }
  return false;
}

// O(n²) - Quadratic time (nested loops)
function findDuplicates(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] === array[j]) {
        console.log('Duplicate:', array[i]);
      }
    }
  }
}

// O(log n) - Logarithmic (binary search)
function binarySearch(sortedArray, target) {
  // Each iteration cuts search space in half
  // 1000 items → 500 → 250 → 125 → ... → 1
}</code></pre>
            
            <div class="pro-tip">
              <strong>Pro Tip:</strong> O(n) is usually fine. O(n²) is problematic for large datasets. O(n³) or worse? Rethink your approach! In AI, transformer attention is O(n²)—that's why longer prompts cost more!
            </div>
            
            <h3>Practical Applications</h3>
            
            <h4>Real-World Algorithm: Autocomplete Search</h4>
            <pre><code>// Autocomplete: Filter array based on prefix
function autocomplete(allOptions, userInput) {
  const lowerInput = userInput.toLowerCase();
  
  return allOptions
    .filter(option => option.toLowerCase().startsWith(lowerInput))
    .slice(0, 10); // Limit to 10 suggestions
}

const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
console.log(autocomplete(cities, 'new')); // ['New York']
console.log(autocomplete(cities, 'los')); // ['Los Angeles']</code></pre>
            
            <h4>Real-World Algorithm: Pagination</h4>
            <pre><code>// Paginate array of items
function paginate(items, page, itemsPerPage) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    data: items.slice(startIndex, endIndex),
    currentPage: page,
    totalPages: Math.ceil(items.length / itemsPerPage),
    totalItems: items.length
  };
}

const users = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, name: \`User \${i + 1}\` }));
console.log(paginate(users, 1, 10)); // First 10 users
console.log(paginate(users, 2, 10)); // Users 11-20</code></pre>
            
            <h3>AI Connection: Algorithms in Machine Learning</h3>
            <p>The same algorithm patterns you use in code power AI:</p>
            
            <ul>
              <li><strong>Search:</strong> Neural networks use gradient descent (search) to find optimal weights</li>
              <li><strong>Sort:</strong> Ranking algorithms sort search results by relevance</li>
              <li><strong>Transform:</strong> Transformers (GPT, BERT) transform input tokens to output predictions</li>
              <li><strong>Big O:</strong> AI models scale with data—O(n²) attention in transformers is expensive for long contexts!</li>
            </ul>
            
            <pre><code>// Code: Binary search
function binarySearch(array, target) {
  let left = 0, right = array.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (array[mid] === target) return mid;
    if (array[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}

// AI: Gradient descent (similar search pattern)
// Start with random weights
// Loop:
//   Calculate error
//   Adjust weights in direction of less error
//   Repeat until error is minimized
// Found optimal weights!</code></pre>
            
            <div class="cross-app-link">
              <strong>🔗 Jump to Learn AI:</strong> See how search algorithms power <a href="/learn-ai/modules/neural-networks">Neural Network Training: Gradient Descent</a>!
            </div>
            
            <h3>Exercise: FizzBuzz Challenge</h3>
            <p>FizzBuzz is a classic algorithm challenge. Write a function that:</p>
            <ul>
              <li>Prints numbers 1 to 100</li>
              <li>For multiples of 3, print "Fizz" instead</li>
              <li>For multiples of 5, print "Buzz" instead</li>
              <li>For multiples of both 3 and 5, print "FizzBuzz"</li>
            </ul>
            
            <pre><code>function fizzBuzz() {
  // Your code here
}

fizzBuzz();
// Output:
// 1
// 2
// Fizz
// 4
// Buzz
// Fizz
// ...
// 14
// FizzBuzz
// ...</code></pre>
            
            <h3>Key Takeaways</h3>
            <ul>
              <li>✅ Algorithms are step-by-step solutions: Input → Process → Output</li>
              <li>✅ Common patterns: Search, Sort, Transform</li>
              <li>✅ Big O measures efficiency: O(1) best, O(n²) problematic, O(2ⁿ) impossible</li>
              <li>✅ Same algorithm thinking powers both code AND AI</li>
              <li>✅ Always consider time/space complexity for large datasets</li>
              <li>✅ Practice with challenges (FizzBuzz, reverse string, etc.)</li>
            </ul>
          `
        }
      ],
      
      test: [
        {
          question: "What happens if your loop never updates its variable?",
          options: [
            "Program halts",
            "Infinite loop",
            "Error in syntax",
            "Returns undefined"
          ],
          correctAnswer: 1,
          rationale: "Without updating the condition variable, the loop condition never becomes false, causing an infinite loop.",
          deepDive: "Infinite loops are a classic bug in both code and AI workflows—in AI, this is like a model that never converges during training. Set stop conditions! See Learn AI: Neural Network Training to understand convergence."
        },
        {
          question: "Which operator checks strict equality in JavaScript?",
          options: [
            "=",
            "==",
            "===",
            "!="
          ],
          correctAnswer: 2,
          rationale: "=== checks both value AND type without type coercion. == performs type coercion, which can lead to unexpected results.",
          deepDive: "Always use === to avoid bugs like '5' == 5 being true. In AI prompts, precision matters too—ambiguous prompts = unexpected outputs! See Learn AI: Prompt Engineering for precision techniques."
        },
        {
          question: "What's the output of: `for(let i=0; i<3; i++) { console.log(i); }`?",
          options: [
            "0, 1, 2",
            "1, 2, 3",
            "0, 1, 2, 3",
            "Error"
          ],
          correctAnswer: 0,
          rationale: "Loop starts at 0 (i=0), runs while i<3 (0, 1, 2), incrementing i after each iteration.",
          deepDive: "Off-by-one errors are common in loops. Similarly, AI context windows have boundaries—exceed them and you lose data! See Learn AI: Context Window Management."
        },
        {
          question: "Which loop is best for iterating over an array in modern JavaScript?",
          options: [
            "for loop",
            "while loop",
            "forEach or map",
            "do-while"
          ],
          correctAnswer: 2,
          rationale: "forEach, map, filter, and reduce are declarative and more readable than traditional for loops.",
          deepDive: "Modern JS favors declarative over imperative. In AI, declarative prompts (tell what you want) beat imperative (tell how to do it)! See Learn AI: Effective Prompting Styles."
        },
        {
          question: "What does Big O notation describe?",
          options: [
            "Code size",
            "Algorithm efficiency",
            "Syntax errors",
            "Variable types"
          ],
          correctAnswer: 1,
          rationale: "Big O describes how an algorithm's runtime or space usage grows relative to input size.",
          deepDive: "O(n) means linear time. AI models also scale—GPT-4's attention is O(n²)! Learn more in Learn AI: Neural Network Efficiency and Scaling."
        },
        {
          question: "What's a common use case for nested if/else?",
          options: [
            "Multiple condition checks",
            "Faster execution",
            "Smaller file size",
            "Database queries"
          ],
          correctAnswer: 0,
          rationale: "Nested if/else allows checking multiple conditions in sequence, though guard clauses are often cleaner.",
          deepDive: "Nested conditions can get messy—refactor into guard clauses or switch statements. AI tip: Break complex prompts into sub-prompts! See Learn AI: Prompt Decomposition Strategies."
        },
        {
          question: "Which is NOT a valid JavaScript loop?",
          options: [
            "for",
            "while",
            "do-while",
            "repeat-until"
          ],
          correctAnswer: 3,
          rationale: "repeat-until exists in some languages (like Lua) but not in JavaScript.",
          deepDive: "Different languages have different syntax. In AI, different models have different 'syntax'—learn to adapt your prompts! See Learn AI: Multi-Model Prompting."
        },
        {
          question: "What's the purpose of the break statement?",
          options: [
            "Exit a loop early",
            "Pause execution",
            "Skip to next iteration",
            "Throw an error"
          ],
          correctAnswer: 0,
          rationale: "break immediately exits the current loop, useful for optimization when you've found what you're looking for.",
          deepDive: "break optimizes by stopping unnecessary iterations. In AI, early stopping prevents overfitting during training—similar concept! See Learn AI: Regularization Techniques."
        },
        {
          question: "What's the difference between for and forEach?",
          options: [
            "No difference",
            "for is more flexible, forEach is cleaner",
            "forEach is faster",
            "for doesn't work on arrays"
          ],
          correctAnswer: 1,
          rationale: "for allows break/continue and is more flexible. forEach is cleaner for simple iteration but can't be interrupted.",
          deepDive: "forEach can't use break/continue, but it's more readable. Trade-offs exist everywhere—AI prompt length vs. clarity, too! See Learn AI: Balancing Prompt Complexity."
        },
        {
          question: "What triggers an infinite loop?",
          options: [
            "Condition never becomes false",
            "Too many iterations",
            "Missing semicolon",
            "Wrong variable type"
          ],
          correctAnswer: 0,
          rationale: "If the loop condition never evaluates to false, the loop runs forever.",
          deepDive: "Always ensure your loop condition will eventually fail. In AI, infinite loops = runaway costs! Set max tokens to prevent this. See Learn AI: Cost Management & Token Limits."
        }
      ]
    }
    
    // ... Additional modules would follow the same pattern ...
    // Module 2: HTML5 & Semantic Structure
    // Module 3: CSS3 Styling & Responsive Design
    // Module 4: JavaScript Fundamentals
    // Module 5: Data Structures (SHARED)
    // Module 6: React & Component-Based Architecture
    // Module 7: Backend Development with Node.js
    // Module 8: Databases & Data Persistence
    // Module 9: API Management (SHARED)
    // Module 10: Deployment, CI/CD, and DevOps
  ]
};

export default enhancedCurriculumData;
