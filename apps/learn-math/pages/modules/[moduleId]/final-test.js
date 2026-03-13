"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import ModuleFinalTestComponent from "../../../components/ModuleFinalTestComponent";
import { getCurrentUser } from "../../../lib/supabaseClient";

const APP_KEY = "learn-math";
const APP_DISPLAY = "Learn Math";
const NO_BADGES_KEY = "learn-math-noBadges";

// Per-module final test question bank — 20 real questions per module
const FINAL_TEST_QUESTIONS = {
  1: [
    { question: "Which of the following is NOT a real number?", options: ["√2", "−5", "π", "√(−1)"], correct_answer: 3 },
    { question: "What is the value of 2³?", options: ["6", "8", "9", "12"], correct_answer: 1 },
    { question: "What is the absolute value of −7?", options: ["−7", "7", "49", "0"], correct_answer: 1 },
    { question: "Which set of numbers includes all integers AND fractions?", options: ["Natural numbers", "Whole numbers", "Rational numbers", "Prime numbers"], correct_answer: 2 },
    { question: "What is the result of 3/4 + 1/2?", options: ["4/6", "5/4", "7/8", "4/8"], correct_answer: 1 },
    { question: "What is the LCM of 4 and 6?", options: ["2", "12", "24", "8"], correct_answer: 1 },
    { question: "What is the GCF (HCF) of 12 and 18?", options: ["2", "3", "6", "9"], correct_answer: 2 },
    { question: "What is a prime number?", options: ["A number divisible by any number", "A number with exactly two factors: 1 and itself", "A number that is a perfect square", "An even number greater than 2"], correct_answer: 1 },
    { question: "What is the value of 5! (five factorial)?", options: ["25", "60", "120", "720"], correct_answer: 2 },
    { question: "Convert 0.75 to a fraction in lowest terms.", options: ["3/5", "75/100", "3/4", "7/10"], correct_answer: 2 },
    { question: "What is the result of (−3) × (−4)?", options: ["−12", "12", "−7", "7"], correct_answer: 1 },
    { question: "What is the square root of 144?", options: ["11", "12", "13", "14"], correct_answer: 1 },
    { question: "What is an irrational number?", options: ["A number that can be expressed as p/q where q ≠ 0", "A number that cannot be expressed as a ratio of two integers", "A negative integer", "A number greater than 1"], correct_answer: 1 },
    { question: "What is the result of 2⁻³?", options: ["−8", "−6", "1/8", "1/6"], correct_answer: 2 },
    { question: "What is the place value of 4 in the number 3,412?", options: ["Ones", "Tens", "Hundreds", "Thousands"], correct_answer: 2 },
    { question: "Which is the correct order of operations (BODMAS/PEMDAS)?", options: ["Left to right only", "Brackets/Parentheses, then Orders/Exponents, then Multiplication/Division, then Addition/Subtraction", "Addition before subtraction always", "Multiplication before brackets always"], correct_answer: 1 },
    { question: "What is the value of 10⁰?", options: ["0", "10", "1", "undefined"], correct_answer: 2 },
    { question: "What is 15% of 200?", options: ["15", "30", "45", "20"], correct_answer: 1 },
    { question: "If a = 3 and b = 4, what is a² + b²?", options: ["25", "12", "49", "7"], correct_answer: 0 },
    { question: "What is the difference between natural numbers and whole numbers?", options: ["They are the same set", "Whole numbers include 0; natural numbers start at 1", "Natural numbers include 0; whole numbers start at 1", "Whole numbers include negative integers"], correct_answer: 1 },
  ],
  2: [
    { question: "Solve for x: 2x + 5 = 13", options: ["3", "4", "5", "9"], correct_answer: 1 },
    { question: "What is the value of x if 3x − 7 = 14?", options: ["7", "3", "21", "2.3"], correct_answer: 0 },
    { question: "What is the distributive property?", options: ["a + b = b + a", "a(b + c) = ab + ac", "(a + b) + c = a + (b + c)", "(a × b) × c = a × (b × c)"], correct_answer: 1 },
    { question: "Simplify: 3x + 2y − x + 4y", options: ["4x + 2y", "2x + 6y", "4x + 6y", "2x + 2y"], correct_answer: 1 },
    { question: "What is a linear equation?", options: ["An equation with variables raised to the second power", "An equation that, when graphed, produces a straight line", "An equation with more than two variables", "An equation with absolute value signs"], correct_answer: 1 },
    { question: "Solve: 4(x − 3) = 2x + 6", options: ["x = 6", "x = 9", "x = 3", "x = 12"], correct_answer: 1 },
    { question: "What is the slope of the line y = 3x − 2?", options: ["−2", "3", "3x", "1/3"], correct_answer: 1 },
    { question: "What is the y-intercept of the line y = −x + 5?", options: ["−1", "5", "−5", "1"], correct_answer: 1 },
    { question: "What is the slope of a horizontal line?", options: ["Undefined", "1", "0", "−1"], correct_answer: 2 },
    { question: "What is the slope of a vertical line?", options: ["0", "1", "−1", "Undefined"], correct_answer: 3 },
    { question: "Which of the following is the slope-intercept form of a linear equation?", options: ["ax + by = c", "y = mx + b", "(y − y₁) = m(x − x₁)", "y − y₁ = (y₂ − y₁)/(x₂ − x₁)(x − x₁)"], correct_answer: 1 },
    { question: "Solve the system: x + y = 5 and x − y = 1", options: ["x=2, y=3", "x=3, y=2", "x=4, y=1", "x=1, y=4"], correct_answer: 1 },
    { question: "What is an expression?", options: ["A mathematical sentence with an equals sign", "A mathematical phrase containing numbers, variables, and operations but no equals sign", "A single number or variable", "An equation with two variables"], correct_answer: 1 },
    { question: "What is a coefficient?", options: ["The variable in a term", "The numerical factor multiplied by the variable in a term", "The exponent on a variable", "A constant term without a variable"], correct_answer: 1 },
    { question: "Simplify: (3x²)(2x³)", options: ["6x⁵", "5x⁶", "6x⁶", "5x⁵"], correct_answer: 0 },
    { question: "What does it mean for two expressions to be equivalent?", options: ["They look the same", "They produce the same value for all values of the variable", "They have the same number of terms", "They have the same variables"], correct_answer: 1 },
    { question: "Solve: |x − 3| = 5", options: ["x = 8 only", "x = −2 only", "x = 8 or x = −2", "x = 2 or x = 8"], correct_answer: 2 },
    { question: "What is an inequality?", options: ["An equation with no solution", "A mathematical statement that compares two expressions using <, >, ≤, or ≥", "An equation with two unknowns", "A negative equation"], correct_answer: 1 },
    { question: "Solve: 2x < 10", options: ["x < 5", "x > 5", "x ≤ 5", "x ≥ 5"], correct_answer: 0 },
    { question: "What is the additive inverse of 7?", options: ["1/7", "7", "−7", "0"], correct_answer: 2 },
  ],
  3: [
    { question: "What is the sum of interior angles of a triangle?", options: ["90°", "180°", "270°", "360°"], correct_answer: 1 },
    { question: "What is the Pythagorean theorem?", options: ["a² + b² = c² for a right triangle", "Area = base × height", "c = 2πr", "a + b = c"], correct_answer: 0 },
    { question: "What is the area of a rectangle with length 8 and width 5?", options: ["26", "13", "40", "80"], correct_answer: 2 },
    { question: "What is the circumference of a circle with radius 3? (Use π ≈ 3.14)", options: ["9.42", "18.84", "28.26", "6.28"], correct_answer: 1 },
    { question: "What is the area of a circle with radius 5?", options: ["10π", "15π", "25π", "50π"], correct_answer: 2 },
    { question: "How many degrees are in a right angle?", options: ["45°", "90°", "180°", "270°"], correct_answer: 1 },
    { question: "What is a scalene triangle?", options: ["A triangle with all three sides equal", "A triangle with two equal sides", "A triangle with no equal sides", "A triangle with all angles equal"], correct_answer: 2 },
    { question: "What is the perimeter of a square with side length 6?", options: ["12", "18", "24", "36"], correct_answer: 2 },
    { question: "What is the volume of a rectangular prism with length 4, width 3, and height 2?", options: ["9", "18", "24", "48"], correct_answer: 2 },
    { question: "What are supplementary angles?", options: ["Two angles that sum to 90°", "Two angles that sum to 180°", "Two angles that are equal", "Two angles that sum to 360°"], correct_answer: 1 },
    { question: "What are complementary angles?", options: ["Two angles that sum to 90°", "Two angles that sum to 180°", "Two angles that are equal", "Two angles that sum to 360°"], correct_answer: 0 },
    { question: "What is a parallelogram?", options: ["A quadrilateral with exactly one pair of parallel sides", "A quadrilateral with two pairs of parallel sides", "A quadrilateral with four equal angles", "A quadrilateral with four equal sides"], correct_answer: 1 },
    { question: "What is the surface area of a cube with side length 3?", options: ["27", "36", "54", "18"], correct_answer: 2 },
    { question: "What is the sum of interior angles of a quadrilateral?", options: ["180°", "270°", "360°", "540°"], correct_answer: 2 },
    { question: "What theorem states that the three medians of a triangle meet at a single point?", options: ["Pythagorean theorem", "The centroid theorem", "The triangle inequality theorem", "Thales' theorem"], correct_answer: 1 },
    { question: "What is a chord in a circle?", options: ["The distance from the centre to the circumference", "A line segment joining two points on a circle", "Half the circumference", "The longest diagonal"], correct_answer: 1 },
    { question: "If two angles in a triangle are 40° and 70°, what is the third angle?", options: ["60°", "70°", "80°", "110°"], correct_answer: 1 },
    { question: "What is congruence in geometry?", options: ["Two shapes that are similar but different sizes", "Two shapes that are identical in shape and size", "Two shapes that have the same area only", "Two shapes that have the same perimeter only"], correct_answer: 1 },
    { question: "What is the hypotenuse of a right triangle?", options: ["Either of the two shorter sides", "The side opposite the right angle (the longest side)", "The side adjacent to the right angle", "The side with the largest angle"], correct_answer: 1 },
    { question: "What is the area of a triangle with base 10 and height 6?", options: ["60", "30", "16", "24"], correct_answer: 1 },
  ],
  4: [
    { question: "In a right triangle, sin(θ) equals:", options: ["adjacent/hypotenuse", "opposite/hypotenuse", "opposite/adjacent", "hypotenuse/opposite"], correct_answer: 1 },
    { question: "In a right triangle, cos(θ) equals:", options: ["opposite/hypotenuse", "adjacent/hypotenuse", "opposite/adjacent", "hypotenuse/adjacent"], correct_answer: 1 },
    { question: "In a right triangle, tan(θ) equals:", options: ["opposite/hypotenuse", "adjacent/hypotenuse", "opposite/adjacent", "hypotenuse/opposite"], correct_answer: 2 },
    { question: "What is sin(90°)?", options: ["0", "0.5", "1", "undefined"], correct_answer: 2 },
    { question: "What is cos(0°)?", options: ["0", "1", "−1", "undefined"], correct_answer: 1 },
    { question: "What is tan(45°)?", options: ["0", "0.5", "1", "undefined"], correct_answer: 2 },
    { question: "Convert 180° to radians.", options: ["π/2", "π", "2π", "3π"], correct_answer: 1 },
    { question: "Convert π/4 radians to degrees.", options: ["30°", "45°", "60°", "90°"], correct_answer: 1 },
    { question: "What is the Pythagorean identity?", options: ["sin²θ + cos²θ = 1", "sin²θ − cos²θ = 1", "sinθ + cosθ = 1", "tanθ = sinθ − cosθ"], correct_answer: 0 },
    { question: "What is the period of the function y = sin(x)?", options: ["π", "2π", "π/2", "4π"], correct_answer: 1 },
    { question: "What is the amplitude of y = 3sin(x)?", options: ["1", "3", "6", "π"], correct_answer: 1 },
    { question: "What is sin(30°)?", options: ["√3/2", "1/2", "1", "0"], correct_answer: 1 },
    { question: "What is cos(60°)?", options: ["√3/2", "1/2", "1", "0"], correct_answer: 1 },
    { question: "Which trig function is positive in the second quadrant?", options: ["cos", "tan", "sin", "sec"], correct_answer: 2 },
    { question: "What is the Law of Sines?", options: ["a² = b² + c² − 2bc·cos(A)", "a/sin(A) = b/sin(B) = c/sin(C)", "sin²A + cos²A = 1", "a + b + c = 180°"], correct_answer: 1 },
    { question: "What is the Law of Cosines?", options: ["a/sin(A) = b/sin(B)", "a² = b² + c² − 2bc·cos(A)", "sin²A + cos²A = 1", "tan(A) = sin(A)/cos(A)"], correct_answer: 1 },
    { question: "What is the inverse function of sin?", options: ["cos", "arcsin (sin⁻¹)", "csc", "sec"], correct_answer: 1 },
    { question: "What is the range of arcsin?", options: ["[0, π]", "[−π, π]", "[−π/2, π/2]", "[0, 2π]"], correct_answer: 2 },
    { question: "What is sin(180°)?", options: ["1", "0", "−1", "undefined"], correct_answer: 1 },
    { question: "What is tan(90°)?", options: ["0", "1", "−1", "undefined"], correct_answer: 3 },
  ],
  5: [
    { question: "What is the standard form of a quadratic equation?", options: ["y = mx + b", "ax² + bx + c = 0", "y = a(x − h)² + k", "x = (−b ± √(b²−4ac)) / 2a"], correct_answer: 1 },
    { question: "What is the quadratic formula?", options: ["x = −b ± √(b² + 4ac) / 2a", "x = (−b ± √(b² − 4ac)) / 2a", "x = (b ± √(b² − 4ac)) / 2a", "x = −b/2a"], correct_answer: 1 },
    { question: "What is the discriminant of ax² + bx + c = 0?", options: ["b² − 4ac", "−b/2a", "b² + 4ac", "√(b² − 4ac)"], correct_answer: 0 },
    { question: "If the discriminant is negative, the quadratic has:", options: ["Two real roots", "One real root (repeated)", "No real roots (two complex roots)", "Infinitely many roots"], correct_answer: 2 },
    { question: "Factor: x² + 5x + 6", options: ["(x + 2)(x + 3)", "(x + 1)(x + 6)", "(x + 2)(x + 4)", "(x − 2)(x − 3)"], correct_answer: 0 },
    { question: "What are the roots of x² − 4 = 0?", options: ["x = 4 and x = −4", "x = 2 only", "x = 2 and x = −2", "x = ±4"], correct_answer: 2 },
    { question: "What is the vertex form of a quadratic?", options: ["ax² + bx + c", "y = mx + b", "y = a(x − h)² + k", "y = ax³ + bx²"], correct_answer: 2 },
    { question: "What is the vertex of y = (x − 3)² + 5?", options: ["(−3, 5)", "(3, 5)", "(3, −5)", "(−3, −5)"], correct_answer: 1 },
    { question: "What is a polynomial?", options: ["An expression with only one term", "An expression consisting of variables and coefficients with non-negative integer exponents", "An equation with a square root", "Any algebraic expression"], correct_answer: 1 },
    { question: "What is the degree of the polynomial 3x⁴ − 2x² + x − 7?", options: ["1", "2", "3", "4"], correct_answer: 3 },
    { question: "Divide (x² − 9) by (x − 3):", options: ["x − 3", "x + 3", "x + 9", "x − 9"], correct_answer: 1 },
    { question: "What is the Remainder Theorem?", options: ["If p(x) is divided by (x − a), the remainder is p(a)", "Every polynomial of degree n has exactly n complex roots", "Polynomials with real coefficients have complex roots in conjugate pairs", "A polynomial can be factored if its discriminant is positive"], correct_answer: 0 },
    { question: "What is the Fundamental Theorem of Algebra?", options: ["Every polynomial has real roots", "Every polynomial of degree n > 0 has exactly n roots (counting multiplicity) in the complex numbers", "Every polynomial can be factored into linear factors", "Every polynomial function is continuous"], correct_answer: 1 },
    { question: "What is a rational function?", options: ["A function with only rational coefficients", "A function expressed as the ratio of two polynomials P(x)/Q(x)", "A polynomial with rational roots", "A function that produces rational outputs"], correct_answer: 1 },
    { question: "What is an asymptote?", options: ["The x-intercept of a graph", "A line that a curve approaches but never reaches", "The highest point on a graph", "The centre of a circle"], correct_answer: 1 },
    { question: "What is an even function?", options: ["f(x) = f(−x) for all x — symmetric about the y-axis", "f(−x) = −f(x) for all x — symmetric about the origin", "A function with an even number of roots", "A function with even-degree terms only"], correct_answer: 0 },
    { question: "What is an odd function?", options: ["f(x) = f(−x) for all x", "f(−x) = −f(x) for all x — symmetric about the origin", "A function with an odd number of roots", "A function with only odd-degree terms in its polynomial"], correct_answer: 1 },
    { question: "What is the domain of f(x) = 1/(x − 2)?", options: ["All real numbers", "All real numbers except x = 2", "All real numbers except x = 0", "x > 2 only"], correct_answer: 1 },
    { question: "What is a composite function?", options: ["A function of two variables", "A function formed by applying one function to the output of another: (f ∘ g)(x) = f(g(x))", "A function that combines addition and multiplication", "A polynomial with complex roots"], correct_answer: 1 },
    { question: "What is the inverse of the function f(x) = 2x + 1?", options: ["f⁻¹(x) = x/2 − 1", "f⁻¹(x) = (x − 1)/2", "f⁻¹(x) = 2x − 1", "f⁻¹(x) = 1/(2x+1)"], correct_answer: 1 },
  ],
  6: [
    { question: "What is a limit in calculus?", options: ["The maximum value of a function", "The value that a function approaches as the input approaches a given value", "The derivative at a specific point", "The area under a curve"], correct_answer: 1 },
    { question: "What is a derivative?", options: ["The area under a curve", "The instantaneous rate of change of a function at a given point", "The antiderivative of a function", "The limit of a function at infinity"], correct_answer: 1 },
    { question: "Using the power rule, what is d/dx(xⁿ)?", options: ["xⁿ⁻¹", "nxⁿ⁻¹", "nxⁿ", "(n+1)xⁿ⁺¹"], correct_answer: 1 },
    { question: "What is the derivative of a constant?", options: ["1", "The constant itself", "0", "undefined"], correct_answer: 2 },
    { question: "What is d/dx(sin x)?", options: ["−cos x", "cos x", "−sin x", "tan x"], correct_answer: 1 },
    { question: "What is d/dx(cos x)?", options: ["sin x", "−sin x", "cos x", "−cos x"], correct_answer: 1 },
    { question: "What is d/dx(eˣ)?", options: ["xeˣ⁻¹", "eˣ", "eˣ⁻¹", "xeˣ"], correct_answer: 1 },
    { question: "What is d/dx(ln x)?", options: ["1/x", "ln x / x", "x", "eˣ"], correct_answer: 0 },
    { question: "What is the product rule?", options: ["d/dx(fg) = f'g − fg'", "d/dx(fg) = f'g + fg'", "d/dx(f/g) = (f'g − fg')/g²", "d/dx(fg) = f(x)g(x)"], correct_answer: 1 },
    { question: "What is the quotient rule?", options: ["d/dx(f/g) = f'g + fg'", "d/dx(f/g) = (f'g − fg') / g²", "d/dx(f/g) = f'/g'", "d/dx(f/g) = (fg' − f'g) / g²"], correct_answer: 1 },
    { question: "What is the chain rule?", options: ["d/dx[f(g(x))] = f'(g(x)) · g'(x)", "d/dx[f(g(x))] = f'(g(x)) + g'(x)", "d/dx[f(g(x))] = f'(x) · g'(x)", "d/dx[f(g(x))] = f(g'(x))"], correct_answer: 0 },
    { question: "What does the first derivative test determine?", options: ["The concavity of the function", "Whether a critical point is a local maximum, minimum, or neither", "The inflection points of the function", "The domain of the function"], correct_answer: 1 },
    { question: "At a local maximum, the first derivative:", options: ["Is positive", "Is negative", "Is zero (and changes from positive to negative)", "Is undefined"], correct_answer: 2 },
    { question: "What does the second derivative tell you about a function?", options: ["Its rate of change at a point", "The concavity of the function (concave up if f'' > 0, concave down if f'' < 0)", "The area under the curve", "The x-intercepts of the function"], correct_answer: 1 },
    { question: "What is an inflection point?", options: ["The maximum of a function", "A point where the concavity changes (f'' changes sign)", "The x-intercept of the tangent line", "A point where the derivative is zero"], correct_answer: 1 },
    { question: "What is a critical point?", options: ["A point where the second derivative equals zero", "A point where the first derivative equals zero or is undefined", "The global maximum of a function", "An asymptote"], correct_answer: 1 },
    { question: "What does L'Hôpital's Rule state?", options: ["If f is continuous on a closed interval, it attains its maximum and minimum", "If lim f/g gives 0/0 or ∞/∞, then lim f/g = lim f'/g' (under appropriate conditions)", "The derivative of an inverse function", "The limit of a sum equals the sum of limits"], correct_answer: 1 },
    { question: "What is the derivative of x²?", options: ["x", "2x", "2x²", "x³/3"], correct_answer: 1 },
    { question: "What is the slope of the tangent line to y = x³ at x = 2?", options: ["6", "8", "12", "4"], correct_answer: 2 },
    { question: "What is the Extreme Value Theorem?", options: ["All polynomials have a global minimum", "A continuous function on a closed interval attains both a maximum and a minimum value", "A function with derivative zero is constant", "Every differentiable function is continuous"], correct_answer: 1 },
  ],
  7: [
    { question: "What is an integral?", options: ["The instantaneous rate of change of a function", "The area under a curve, or the antiderivative of a function", "The limit of a function at a point", "The slope of the tangent line"], correct_answer: 1 },
    { question: "What is the antiderivative (indefinite integral) of 2x?", options: ["2", "x²", "x² + C", "2x² + C"], correct_answer: 2 },
    { question: "What is the Fundamental Theorem of Calculus (Part 1)?", options: ["Every continuous function has an antiderivative", "If F is the antiderivative of f, then ∫ₐᵇ f(x)dx = F(b) − F(a)", "The derivative of an integral returns the integrand", "Differentiation and integration are inverse operations in general"], correct_answer: 1 },
    { question: "What is ∫ xⁿ dx (n ≠ −1)?", options: ["nxⁿ⁻¹ + C", "xⁿ⁺¹/(n+1) + C", "xⁿ/n + C", "xⁿ⁺¹ + C"], correct_answer: 1 },
    { question: "What is ∫ eˣ dx?", options: ["xeˣ + C", "eˣ + C", "eˣ/x + C", "eˣ⁻¹ + C"], correct_answer: 1 },
    { question: "What is ∫ sin(x) dx?", options: ["cos(x) + C", "−cos(x) + C", "−sin(x) + C", "sin(x) + C"], correct_answer: 1 },
    { question: "What is the substitution method (u-substitution) used for?", options: ["Integrating by parts", "Simplifying an integral by substituting u = g(x) to apply the chain rule in reverse", "Finding the volume of a solid of revolution", "Evaluating improper integrals"], correct_answer: 1 },
    { question: "What is integration by parts?", options: ["∫ uv dx = u∫v dx + v∫u dx", "∫ u dv = uv − ∫ v du", "∫ f(g(x))g'(x)dx = F(g(x)) + C", "∫ f·g dx = ∫f dx · ∫g dx"], correct_answer: 1 },
    { question: "How is the area between two curves y = f(x) and y = g(x) (where f ≥ g) on [a,b] calculated?", options: ["∫ₐᵇ f(x) dx", "∫ₐᵇ [f(x) + g(x)] dx", "∫ₐᵇ [f(x) − g(x)] dx", "∫ₐᵇ [f(x) · g(x)] dx"], correct_answer: 2 },
    { question: "What is a definite integral?", options: ["The antiderivative of a function", "The integral evaluated between two specific limits, producing a numeric value", "An integral with no limits of integration", "The integral of an unbounded function"], correct_answer: 1 },
    { question: "What is the disc method in volume calculation?", options: ["Volume = ∫ₐᵇ 2πx f(x) dx", "Volume = ∫ₐᵇ π[f(x)]² dx — rotating a region about the x-axis", "Volume = ∫ₐᵇ [f(x)]² dx", "Volume = π∫ₐᵇ f(x) dx"], correct_answer: 1 },
    { question: "What is a convergent improper integral?", options: ["An integral with finite limits", "An integral over an infinite interval (or with an infinite discontinuity) that evaluates to a finite value", "An integral that equals zero", "An integral of a decreasing function"], correct_answer: 1 },
    { question: "What is the average value of f(x) on [a, b]?", options: ["f(a) + f(b) / 2", "(1/(b−a)) ∫ₐᵇ f(x) dx", "∫ₐᵇ f(x) dx / f(b)", "f((a+b)/2)"], correct_answer: 1 },
    { question: "What is the arc length formula for y = f(x) on [a, b]?", options: ["∫ₐᵇ f(x) dx", "∫ₐᵇ √(1 + [f'(x)]²) dx", "∫ₐᵇ [f(x)]² dx", "∫ₐᵇ 2πf(x) dx"], correct_answer: 1 },
    { question: "What is a Taylor series?", options: ["A geometric series", "An infinite polynomial representation of a function based on its derivatives at a single point", "A series that always converges to a finite value", "A Fourier series variant"], correct_answer: 1 },
    { question: "What is a Maclaurin series?", options: ["A Taylor series centred at x = 1", "A Taylor series centred at x = 0", "A series for trigonometric functions only", "A convergent power series"], correct_answer: 1 },
    { question: "What does the integral ∫ₐᵇ f(x) dx represent geometrically?", options: ["The slope of f between a and b", "The net signed area between the curve y = f(x) and the x-axis from x = a to x = b", "The average value of f", "The length of the curve"], correct_answer: 1 },
    { question: "What is ∫ (1/x) dx?", options: ["x⁻² + C", "ln|x| + C", "1/x² + C", "eˣ + C"], correct_answer: 1 },
    { question: "What is the shell method for volume of revolution?", options: ["Volume = ∫ₐᵇ π[f(x)]² dx", "Volume = ∫ₐᵇ 2πx·f(x) dx — rotating a region about the y-axis", "Volume = ∫ₐᵇ [f(x) − g(x)] dx", "Volume = 2π∫ₐᵇ f(x) dx"], correct_answer: 1 },
    { question: "What is partial fraction decomposition used for?", options: ["Integrating polynomials", "Breaking a rational function into simpler fractions to make integration easier", "Finding derivatives of rational functions", "Solving differential equations by separation"], correct_answer: 1 },
  ],
  8: [
    { question: "What is probability?", options: ["A measure of the frequency of past events", "A measure of the likelihood that an event will occur, between 0 and 1 inclusive", "The number of possible outcomes of an experiment", "The average of a set of data"], correct_answer: 1 },
    { question: "What is the probability of rolling a 3 on a fair six-sided die?", options: ["1/3", "1/4", "1/6", "1/2"], correct_answer: 2 },
    { question: "What is the mean of a dataset?", options: ["The most frequent value", "The middle value when sorted", "The sum of all values divided by the number of values", "The difference between max and min"], correct_answer: 2 },
    { question: "What is the median?", options: ["The average of all values", "The middle value (or average of the two middle values) when data is sorted in order", "The most common value", "The value halfway between the minimum and maximum"], correct_answer: 1 },
    { question: "What is the mode?", options: ["The average of all values", "The middle value", "The most frequently occurring value in a dataset", "The range of the data"], correct_answer: 2 },
    { question: "What is variance?", options: ["The average deviation from the mean", "The average of the squared deviations from the mean, measuring data spread", "The square root of the standard deviation", "The range divided by the mean"], correct_answer: 1 },
    { question: "What is standard deviation?", options: ["The square of the variance", "The square root of the variance — a measure of how spread out data is around the mean", "The average absolute deviation", "The difference between the maximum and minimum values"], correct_answer: 1 },
    { question: "What is a normal distribution?", options: ["A distribution where all outcomes are equally likely", "A symmetric bell-shaped probability distribution described by mean and standard deviation", "A distribution where the mean is zero", "A distribution used only for large datasets"], correct_answer: 1 },
    { question: "In a standard normal distribution, what percentage of data falls within one standard deviation of the mean?", options: ["50%", "68%", "95%", "99.7%"], correct_answer: 1 },
    { question: "What is the complement rule in probability?", options: ["P(A and B) = P(A) × P(B)", "P(not A) = 1 − P(A)", "P(A or B) = P(A) + P(B)", "P(A|B) = P(A∩B)/P(B)"], correct_answer: 1 },
    { question: "What are mutually exclusive events?", options: ["Events that must both occur", "Events that cannot occur simultaneously — P(A and B) = 0", "Events with equal probability", "Events that are independent of each other"], correct_answer: 1 },
    { question: "What is conditional probability P(A|B)?", options: ["P(A) × P(B)", "The probability of event A given that B has already occurred: P(A∩B)/P(B)", "P(A) + P(B) − P(A∩B)", "P(not B given A)"], correct_answer: 1 },
    { question: "What is a random variable?", options: ["A variable that changes randomly in an equation", "A variable whose value is determined by the outcome of a random experiment", "Any unknown in a statistical formula", "The sample mean of a dataset"], correct_answer: 1 },
    { question: "What is a binomial distribution?", options: ["A distribution for continuous data", "The probability distribution of the number of successes in n independent trials with probability p of success each", "A distribution of two datasets", "A normal distribution with two parameters"], correct_answer: 1 },
    { question: "What is the central limit theorem?", options: ["The mean of a sample equals the population mean", "Regardless of the population distribution, the sampling distribution of the sample mean approaches a normal distribution as sample size increases", "Large datasets always follow a normal distribution", "The median equals the mean in symmetric distributions"], correct_answer: 1 },
    { question: "What is hypothesis testing?", options: ["Testing a new mathematical formula", "A statistical method for testing whether there is enough evidence to reject a null hypothesis", "Testing data quality", "Comparing two datasets by eye"], correct_answer: 1 },
    { question: "What is a p-value in hypothesis testing?", options: ["The probability that the null hypothesis is true", "The probability of observing results at least as extreme as the data, assuming the null hypothesis is true", "The significance level", "The power of the test"], correct_answer: 1 },
    { question: "What is correlation?", options: ["A causal relationship between two variables", "A statistical measure of the strength and direction of the linear relationship between two variables", "The regression slope coefficient", "A measure of how one variable changes the other"], correct_answer: 1 },
    { question: "What is simple linear regression?", options: ["Fitting a curve to data", "A method for modelling the linear relationship between a dependent variable and one independent variable: y = mx + b", "Calculating the correlation coefficient", "Finding the mean and variance of a dataset"], correct_answer: 1 },
    { question: "What is an outlier in statistics?", options: ["Any data point greater than the mean", "A data point that lies far from the other observations and may indicate an error or unusual occurrence", "The maximum value in a dataset", "The median value in a dataset"], correct_answer: 1 },
  ],
  9: [
    { question: "What is a vector?", options: ["A number with magnitude only", "A mathematical object with both magnitude and direction", "A matrix with one row", "A scalar quantity"], correct_answer: 1 },
    { question: "What is a matrix?", options: ["A one-dimensional array of numbers", "A rectangular array of numbers arranged in rows and columns", "A vector with more than two components", "A type of equation system"], correct_answer: 1 },
    { question: "What is the dot product of vectors a and b?", options: ["A vector perpendicular to both a and b", "A scalar equal to |a||b|cos(θ) where θ is the angle between them", "The sum of a and b", "The product of their magnitudes"], correct_answer: 1 },
    { question: "When is the dot product of two non-zero vectors equal to zero?", options: ["When they are parallel", "When they are perpendicular (orthogonal)", "When they have the same magnitude", "When they point in the same direction"], correct_answer: 1 },
    { question: "What is the cross product of two vectors?", options: ["A scalar equal to the dot product", "A vector perpendicular to both input vectors, with magnitude |a||b|sin(θ)", "The angle between two vectors", "The sum of components of both vectors"], correct_answer: 1 },
    { question: "What is matrix multiplication?", options: ["Multiplying every element in one matrix by a scalar", "Combining two matrices by taking the dot products of rows from the first with columns from the second", "Adding corresponding elements of two matrices", "Transposing a matrix"], correct_answer: 1 },
    { question: "What is the determinant of a 2×2 matrix [[a,b],[c,d]]?", options: ["a + d", "ad + bc", "ad − bc", "ac − bd"], correct_answer: 2 },
    { question: "What is an identity matrix?", options: ["A matrix of all ones", "A square matrix with ones on the main diagonal and zeros elsewhere", "A matrix with all zeros", "A matrix equal to its own inverse"], correct_answer: 1 },
    { question: "What is the inverse of a matrix?", options: ["The transpose of the matrix", "A matrix A⁻¹ such that A · A⁻¹ = I (identity matrix)", "The matrix with negated elements", "The cofactor matrix"], correct_answer: 1 },
    { question: "When does a matrix have no inverse?", options: ["When it is square", "When its determinant is zero (it is singular)", "When it has more rows than columns", "When all entries are positive"], correct_answer: 1 },
    { question: "What is an eigenvalue?", options: ["The determinant of a matrix", "A scalar λ such that Av = λv for some non-zero vector v (eigenvector)", "The trace of a matrix", "An element on the main diagonal"], correct_answer: 1 },
    { question: "What is a linear transformation?", options: ["A transformation that changes non-linear curves to lines", "A mapping between vector spaces that preserves addition and scalar multiplication", "Any function applied to a matrix", "A rotation by a fixed angle"], correct_answer: 1 },
    { question: "What is the rank of a matrix?", options: ["The number of rows in the matrix", "The dimension of the column space (number of linearly independent columns)", "The number of non-zero entries", "The number of eigenvalues"], correct_answer: 1 },
    { question: "What are linearly independent vectors?", options: ["Vectors pointing in the same direction", "Vectors where no vector in the set can be written as a linear combination of the others", "Orthogonal vectors", "Vectors with the same magnitude"], correct_answer: 1 },
    { question: "What is the span of a set of vectors?", options: ["The maximum value in the vector set", "The set of all vectors that can be written as linear combinations of the given vectors", "The length of the longest vector", "The subspace orthogonal to the vector set"], correct_answer: 1 },
    { question: "What is a basis of a vector space?", options: ["Any set of vectors in the space", "A linearly independent set of vectors that spans the space", "The set of all unit vectors", "The eigenvectors of the space"], correct_answer: 1 },
    { question: "What is Gaussian elimination used for?", options: ["Finding eigenvalues of a matrix", "Solving systems of linear equations by reducing the augmented matrix to row echelon form", "Computing the determinant only", "Finding the inverse using cofactors"], correct_answer: 1 },
    { question: "What is the transpose of a matrix?", options: ["The matrix with its determinant computed", "The matrix obtained by flipping rows and columns (element aᵢⱼ becomes aⱼᵢ)", "The inverse of the matrix", "The matrix with negated elements"], correct_answer: 1 },
    { question: "What is a null space (kernel) of a matrix A?", options: ["The set of all zero vectors", "The set of all vectors x such that Ax = 0", "The set of all right-hand sides Ax for all x", "The set of all eigenvectors of A"], correct_answer: 1 },
    { question: "What is principal component analysis (PCA) fundamentally based on?", options: ["Fourier analysis", "Linear algebra — specifically eigendecomposition of the covariance matrix to find directions of maximum variance", "Logistic regression", "Differential equations"], correct_answer: 1 },
  ],
  10: [
    { question: "What is an ordinary differential equation (ODE)?", options: ["An equation with two variables", "An equation involving a function and one or more of its derivatives with respect to a single variable", "A polynomial equation of high degree", "An equation with partial derivatives"], correct_answer: 1 },
    { question: "What is a separable ODE?", options: ["An ODE that has only one solution", "An ODE that can be written as g(y) dy = f(x) dx, allowing separation of variables", "An ODE with constant coefficients", "An ODE that can be solved by substitution only"], correct_answer: 1 },
    { question: "What is the general solution of a differential equation?", options: ["The unique solution satisfying initial conditions", "The family of all solutions, typically containing one or more arbitrary constants", "The numerical approximation of the solution", "The particular solution with C = 0"], correct_answer: 1 },
    { question: "What is a first-order linear ODE?", options: ["An ODE of the form y' + P(x)y = Q(x)", "An ODE with one independent variable", "An ODE with degree 1 when graphed", "An ODE whose solution is a straight line"], correct_answer: 0 },
    { question: "What is Euler's method?", options: ["An analytical method for solving ODEs exactly", "A numerical method for approximating solutions to ODEs using small step sizes", "A method for solving systems of linear equations", "A technique for computing Fourier series"], correct_answer: 1 },
    { question: "What is the characteristic equation used for?", options: ["Solving separable ODEs", "Finding solutions to linear ODEs with constant coefficients by substituting y = eʳˣ", "Solving partial differential equations", "Finding the particular solution of a nonhomogeneous ODE"], correct_answer: 1 },
    { question: "What is a partial differential equation (PDE)?", options: ["An ODE with non-integer derivatives", "An equation involving partial derivatives of a function of two or more variables", "An ODE with partial fractions", "A numerical approximation of an ODE"], correct_answer: 1 },
    { question: "What is the Laplace transform used for?", options: ["Finding eigenvalues of differential operators", "Converting an ODE into an algebraic equation in the frequency domain, simplifying its solution", "Transforming a PDE into an ODE", "Plotting solutions of ODEs numerically"], correct_answer: 1 },
    { question: "What is a complex number?", options: ["A number that is not real", "A number of the form a + bi where a, b are real numbers and i = √(−1)", "A number with both a real and imaginary reciprocal", "Any irrational number"], correct_answer: 1 },
    { question: "What is Euler's formula in complex analysis?", options: ["e^(iπ) + 1 = 0", "eⁱθ = cos θ + i sin θ", "i² = −1", "a + bi = r(cos θ + i sin θ) always"], correct_answer: 1 },
    { question: "What is the modulus (absolute value) of a complex number a + bi?", options: ["a + b", "a − b", "√(a² + b²)", "a² + b²"], correct_answer: 2 },
    { question: "What is the argument (angle) of a complex number?", options: ["Its modulus", "The angle θ it makes with the positive real axis in the complex plane", "Its real part", "The sum of its real and imaginary parts"], correct_answer: 1 },
    { question: "What is De Moivre's theorem?", options: ["(cos θ + i sin θ)ⁿ = cos(nθ) + i sin(nθ)", "e^(iπ) = −1", "|a + bi|ⁿ = |a|ⁿ + |b|ⁿ", "(a + bi)(a − bi) = a² − b²"], correct_answer: 0 },
    { question: "What is a Fourier series?", options: ["A Taylor series for periodic functions", "A representation of a periodic function as a sum of sine and cosine terms", "A power series for exponential functions", "A series of complex numbers"], correct_answer: 1 },
    { question: "What is an analytic function in complex analysis?", options: ["A function that can be differentiated in the real sense", "A function that is complex-differentiable throughout its domain (holomorphic)", "A function with a real-valued output", "A rational function"], correct_answer: 1 },
    { question: "What are the Cauchy-Riemann equations?", options: ["Conditions for a complex function f = u + iv to be holomorphic: ∂u/∂x = ∂v/∂y and ∂u/∂y = −∂v/∂x", "Conditions for convergence of a complex series", "Equations governing heat flow", "Conditions for a function to be continuous at a point"], correct_answer: 0 },
    { question: "What is the Residue Theorem in complex analysis?", options: ["The sum of residues equals zero for any closed contour", "A contour integral of an analytic function with isolated singularities equals 2πi times the sum of enclosed residues", "A theorem about convergence of power series", "A method for evaluating real integrals by Fourier transform"], correct_answer: 1 },
    { question: "What is a Laplace equation?", options: ["A first-order linear ODE", "The PDE ∇²u = 0, whose solutions are called harmonic functions and describe steady-state phenomena", "An equation for the Laplace transform", "A differential equation for exponential growth"], correct_answer: 1 },
    { question: "What is the heat equation?", options: ["An equation describing the propagation of waves", "A PDE describing how temperature distribution in a region evolves over time: ∂u/∂t = α∇²u", "An equation for chemical reaction rates", "A thermochemistry formula"], correct_answer: 1 },
    { question: "What is the wave equation?", options: ["A differential equation used in fluid dynamics only", "A PDE describing wave propagation: ∂²u/∂t² = c²∇²u", "An equation for oscillating springs only", "The equation e^(iωt) = cos(ωt) + i sin(ωt)"], correct_answer: 1 },
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
              you won&apos;t earn badges for this course.
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
                  You can continue to the next module, but you won&apos;t earn badges for this
                  course. <strong>This cannot be undone.</strong>
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
