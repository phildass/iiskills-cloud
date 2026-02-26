"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import QuizComponent from '../../../../components/QuizComponent';
import { getCurrentUser } from '../../../../lib/supabaseClient';
import { LessonContent } from '@iiskills/ui/content';

export default function LessonPage() {
  const router = useRouter();
  const { moduleId, lessonId } = router.query;
  const [lesson, setLesson] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (moduleId && lessonId) {
      // Reset quiz completion whenever the lesson changes (prevents SPA state bleed
      // when Next.js reuses the same page component without full unmount)
      setQuizCompleted(false);
      fetchLesson();
    }
  }, [moduleId, lessonId]);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const fetchLesson = async () => {
    try {
      setLesson({
        id: lessonId,
        module_id: moduleId,
        title: `Lesson ${lessonId}`,
        content: generateLessonContent(moduleId, lessonId),
        quiz: generateQuiz(moduleId, lessonId)
      });
    } catch (error) {
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  // Per-lesson content and quiz data, keyed by `${moduleId}_${lessonId}`.
  // Each entry provides unique chemistry content so no two lessons share the same body.
  // Fallback (below) is used for any key not explicitly defined.
  const LESSON_DATA = {
    // ── Module 1: Basic Concepts ──────────────────────────────────────────────
    '1_1': {
      title: 'What is Chemistry? The Central Science',
      content: `
        <h2>Module 1, Lesson 1: What is Chemistry? The Central Science</h2>
        <h3>Introduction</h3>
        <p>Chemistry is often called the "central science" because it connects and underpins every other natural science. It sits between physics (which studies energy and fundamental particles) and biology (which studies living systems), and contributes essential knowledge to geology, materials science, medicine, and environmental science.</p>
        <p>At its simplest, chemistry is the study of <strong>matter</strong> — what it is made of, how it behaves, and how it changes. Every object you can see, touch, taste, or smell is made of matter, and chemistry explains why it has the properties it does and how it can be transformed into something new.</p>
        <h3>Key Concepts</h3>
        <h4>Branches of Chemistry</h4>
        <p><strong>Organic chemistry</strong> studies carbon-containing compounds — the molecules of life and most pharmaceuticals. <strong>Inorganic chemistry</strong> covers non-carbon compounds including metals, salts, and minerals. <strong>Physical chemistry</strong> applies the laws of physics (thermodynamics, quantum mechanics) to chemical systems. <strong>Analytical chemistry</strong> develops methods to identify and measure substances. <strong>Biochemistry</strong> studies the chemical processes inside living organisms.</p>
        <h4>Why Chemistry Matters</h4>
        <p>Chemistry underpins medicine (drug design), agriculture (fertilisers and pesticides), energy (batteries, fuels), materials (plastics, alloys), and environmental science (pollution, climate). Every manufactured object — from a smartphone to a chair — exists because chemists understood and manipulated matter at the molecular level.</p>
        <h3>Example</h3>
        <p>When iron rusts, it reacts with oxygen and water to form iron(III) oxide (Fe₂O₃). This is a chemical change — a new substance with different properties is formed. Chemistry lets us understand this process, predict its rate, and design ways to prevent it (e.g., galvanising with zinc).</p>
        <h3>Exercise</h3>
        <p>List three objects in the room around you. For each, identify one chemical property (e.g., flammability, corrosion resistance, solubility) that makes it suitable for its purpose.</p>
        <h3>Summary</h3>
        <p>Chemistry is the central science connecting all natural sciences. It studies matter and its transformations across five main branches: organic, inorganic, physical, analytical, and biochemistry. Its applications span every aspect of modern life.</p>
      `,
      quiz: [
        { question: "Why is chemistry called the 'central science'?", options: ["It is the oldest science", "It connects and underpins every other natural science", "It only studies living organisms", "It focuses solely on energy"], correct_answer: 1 },
        { question: "Which branch of chemistry studies carbon-containing compounds?", options: ["Inorganic chemistry", "Analytical chemistry", "Organic chemistry", "Physical chemistry"], correct_answer: 2 },
        { question: "What does chemistry study?", options: ["Only living organisms", "Only energy and forces", "Matter — what it is made of, how it behaves, and how it changes", "Only the structure of the universe"], correct_answer: 2 },
        { question: "When iron rusts, what type of change occurs?", options: ["A physical change only", "A nuclear reaction", "A chemical change — a new substance is formed", "No change at all"], correct_answer: 2 },
        { question: "Which branch of chemistry develops methods to identify and measure substances?", options: ["Organic chemistry", "Analytical chemistry", "Biochemistry", "Inorganic chemistry"], correct_answer: 1 },
      ],
    },
    '1_2': {
      title: 'Matter and Its Properties',
      content: `
        <h2>Module 1, Lesson 2: Matter and Its Properties</h2>
        <h3>Introduction</h3>
        <p>Matter is anything that has mass and occupies space. Chemists classify and describe matter using two categories of properties: <strong>physical properties</strong> (observed without changing the substance's identity) and <strong>chemical properties</strong> (describe how a substance reacts or transforms into a different substance).</p>
        <h3>Key Concepts</h3>
        <h4>Physical Properties</h4>
        <p>Physical properties include colour, density, melting point, boiling point, hardness, electrical conductivity, and solubility. These can be measured without changing what the substance is. For example, water boils at 100 °C at standard pressure — this is a physical property.</p>
        <h4>Chemical Properties</h4>
        <p>Chemical properties describe a substance's tendency to undergo chemical reactions: flammability (does it burn?), reactivity with acids, oxidation potential, and toxicity. For example, hydrogen gas is highly flammable — this is a chemical property because observing it requires burning (chemically changing) the hydrogen.</p>
        <h4>Intensive vs. Extensive Properties</h4>
        <p>Intensive properties (temperature, density, boiling point) do not depend on the amount of matter. Extensive properties (mass, volume, energy) do depend on the amount. Density is intensive: a small piece of gold and a large piece both have the same density (19.3 g/cm³).</p>
        <h3>Example</h3>
        <p>A copper wire is shiny (physical), conducts electricity (physical), and reacts slowly with oxygen to form green copper carbonate (chemical — verdigris). All three properties help identify and predict the behaviour of copper.</p>
        <h3>Exercise</h3>
        <p>Classify each property as physical or chemical: (a) water freezing at 0 °C, (b) wood burning, (c) gold's density of 19.3 g/cm³, (d) iron reacting with acid to produce hydrogen gas.</p>
        <h3>Summary</h3>
        <p>Matter has physical properties (observable without chemical change) and chemical properties (describe reactivity). Properties are also classified as intensive (amount-independent) or extensive (amount-dependent). These distinctions are fundamental to identifying and working with substances.</p>
      `,
      quiz: [
        { question: "Which of the following is a physical property of water?", options: ["It reacts with sodium metal", "It has a boiling point of 100 °C at standard pressure", "It is flammable", "It corrodes iron"], correct_answer: 1 },
        { question: "What is a chemical property?", options: ["A property that can be observed without changing the substance", "A property that describes how a substance changes into a different substance", "The colour or shape of a substance", "The density of a material"], correct_answer: 1 },
        { question: "Which of the following is an intensive property?", options: ["Mass", "Volume", "Density", "Length"], correct_answer: 2 },
        { question: "The flammability of ethanol is an example of a:", options: ["Physical property", "Extensive property", "Chemical property", "Intensive property"], correct_answer: 2 },
        { question: "Which property does NOT depend on the amount of substance present?", options: ["Mass", "Volume", "Boiling point", "Number of moles"], correct_answer: 2 },
      ],
    },
    '1_3': {
      title: 'Physical and Chemical Changes',
      content: `
        <h2>Module 1, Lesson 3: Physical and Chemical Changes</h2>
        <h3>Introduction</h3>
        <p>Matter is constantly undergoing change. Understanding the difference between <strong>physical changes</strong> (which alter the form of matter without changing its chemical identity) and <strong>chemical changes</strong> (which produce new substances with different chemical identities) is one of the first critical skills in chemistry.</p>
        <h3>Key Concepts</h3>
        <h4>Physical Changes</h4>
        <p>In a physical change, no new substance is created. Examples include melting ice (liquid water is still H₂O), dissolving sugar in water (both substances are still present and can be recovered by evaporation), cutting a piece of paper (still paper), and bending a wire (still the same metal). Physical changes are often reversible.</p>
        <h4>Chemical Changes</h4>
        <p>In a chemical change, bonds in the reactants are broken and new bonds form, creating products with different identities. Signs of a chemical change include: production of gas (bubbling), colour change, formation of a precipitate, temperature change (heat released or absorbed), and production of light or sound. Examples: burning wood, baking bread, rusting iron, digesting food.</p>
        <h4>Conservation of Mass</h4>
        <p>Antoine Lavoisier's Law of Conservation of Mass states: in a chemical reaction, the total mass of reactants equals the total mass of products. Atoms are rearranged but not created or destroyed. This principle is the basis for balancing chemical equations.</p>
        <h3>Example</h3>
        <p>Baking a cake involves both: dissolving ingredients (physical) and baking soda reacting with acids to release CO₂ gas (chemical — the baking soda is consumed and new substances form, making the cake rise).</p>
        <h3>Exercise</h3>
        <p>Identify each change as physical or chemical: (a) boiling water, (b) frying an egg, (c) crushing a can, (d) burning magnesium with a bright white flame, (e) dissolving salt in water.</p>
        <h3>Summary</h3>
        <p>Physical changes alter the form or state of matter without creating new substances; chemical changes produce new substances with new properties. The Law of Conservation of Mass applies to both — mass is always conserved.</p>
      `,
      quiz: [
        { question: "Which of the following is a chemical change?", options: ["Melting ice", "Dissolving sugar in water", "Burning wood", "Cutting paper"], correct_answer: 2 },
        { question: "What does the Law of Conservation of Mass state?", options: ["Mass is created during chemical reactions", "The total mass of reactants equals the total mass of products", "Mass is destroyed in exothermic reactions", "Products always have more mass than reactants"], correct_answer: 1 },
        { question: "Which observation most strongly suggests a chemical change has occurred?", options: ["The substance changes shape", "The substance changes state from solid to liquid", "A new gas is produced and the colour changes permanently", "The substance is dissolved in water"], correct_answer: 2 },
        { question: "Dissolving sugar in water is classified as:", options: ["A chemical change because sugar disappears", "A physical change because the sugar can be recovered by evaporation", "A nuclear change", "An irreversible change"], correct_answer: 1 },
        { question: "Who formulated the Law of Conservation of Mass?", options: ["John Dalton", "Antoine Lavoisier", "Marie Curie", "Dmitri Mendeleev"], correct_answer: 1 },
      ],
    },
    // ── Module 2: Atomic Structure ────────────────────────────────────────────
    '2_1': {
      title: 'Historical Models of the Atom',
      content: `
        <h2>Module 2, Lesson 1: Historical Models of the Atom</h2>
        <h3>Introduction</h3>
        <p>Our understanding of the atom has evolved dramatically over the past 200 years through a series of experiments and theoretical breakthroughs. Each model improved on the last, guided by new experimental evidence.</p>
        <h3>Key Concepts</h3>
        <h4>Dalton's Atomic Theory (1808)</h4>
        <p>John Dalton proposed that all matter consists of indivisible, indestructible atoms; atoms of the same element are identical in mass and properties; atoms combine in whole-number ratios to form compounds; and in chemical reactions, atoms are rearranged but not created or destroyed. This was the first scientifically rigorous atomic theory, but it could not explain the existence of electrons or the internal structure of atoms.</p>
        <h4>Thomson's Plum Pudding Model (1897)</h4>
        <p>J.J. Thomson discovered the electron using cathode ray experiments, proving atoms are not indivisible. He proposed the "plum pudding" model: electrons (negatives) embedded in a diffuse sphere of positive charge — like plums in a pudding. This was overturned by Rutherford's gold foil experiment.</p>
        <h4>Rutherford's Nuclear Model (1911)</h4>
        <p>Ernest Rutherford fired alpha particles at a thin gold foil. Most passed straight through, but some deflected at large angles and a few bounced back. This was only possible if the atom's positive charge and most of its mass were concentrated in a tiny, dense <strong>nucleus</strong>, with electrons orbiting at a distance in mostly empty space.</p>
        <h4>Bohr's Model (1913)</h4>
        <p>Niels Bohr proposed that electrons orbit the nucleus in fixed energy levels (shells). Electrons can only jump between shells by absorbing or emitting specific amounts of energy (photons). This explained hydrogen's line spectrum — one of the first quantum phenomena in chemistry.</p>
        <h3>Example</h3>
        <p>When a neon sign glows orange-red, electrons in neon atoms absorb electrical energy, jump to higher energy levels, then fall back and emit photons of specific wavelengths — exactly as Bohr's model predicts for quantised energy levels.</p>
        <h3>Summary</h3>
        <p>Atomic models progressed from Dalton (indivisible atom) → Thomson (electrons in positive sphere) → Rutherford (dense nucleus, electrons orbiting) → Bohr (electrons in fixed energy levels). Each model was driven by experimental evidence.</p>
      `,
      quiz: [
        { question: "Who discovered the electron?", options: ["John Dalton", "Niels Bohr", "J.J. Thomson", "Ernest Rutherford"], correct_answer: 2 },
        { question: "What did Rutherford's gold foil experiment prove?", options: ["Electrons are embedded in a diffuse positive sphere", "Atoms have a tiny, dense, positively charged nucleus", "Atoms are indivisible", "Electrons orbit in fixed energy levels"], correct_answer: 1 },
        { question: "In Bohr's model, how do electrons move between energy levels?", options: ["Gradually and continuously", "By absorbing or emitting specific amounts of energy (photons)", "By splitting the nucleus", "By changing their mass"], correct_answer: 1 },
        { question: "What was the main limitation of Dalton's atomic theory?", options: ["It could not explain atomic mass", "It could not explain the internal structure of atoms or the existence of electrons", "It did not describe chemical reactions", "It was not based on any experiments"], correct_answer: 1 },
        { question: "What model did Rutherford's experiment disprove?", options: ["Dalton's solid sphere", "Bohr's energy-level model", "Thomson's plum pudding model", "The quantum mechanical model"], correct_answer: 2 },
      ],
    },
    '2_2': {
      title: 'Protons, Neutrons, and Electrons',
      content: `
        <h2>Module 2, Lesson 2: Protons, Neutrons, and Electrons</h2>
        <h3>Introduction</h3>
        <p>Atoms are made of three types of subatomic particles — protons, neutrons, and electrons. Their properties (charge, mass, and location) determine every chemical behaviour of an element.</p>
        <h3>Key Concepts</h3>
        <h4>Protons</h4>
        <p>Protons carry a <strong>+1 charge</strong> and a relative mass of approximately 1 atomic mass unit (amu). They reside in the nucleus. The number of protons in an atom — the <strong>atomic number (Z)</strong> — uniquely defines the element. Carbon always has 6 protons; oxygen always has 8.</p>
        <h4>Neutrons</h4>
        <p>Neutrons carry <strong>no charge</strong> and a relative mass of approximately 1 amu. They also reside in the nucleus. Neutrons provide nuclear stability by reducing repulsion between protons. The number of neutrons can vary within the same element (isotopes).</p>
        <h4>Electrons</h4>
        <p>Electrons carry a <strong>−1 charge</strong> and a mass approximately 1/1836 that of a proton (effectively negligible for mass calculations). Electrons occupy the space around the nucleus in energy levels (shells). In a neutral atom, the number of electrons equals the number of protons. Electrons are responsible for all chemical bonding.</p>
        <h3>Example</h3>
        <p>A carbon-12 atom has: 6 protons (defines it as carbon), 6 neutrons (makes total mass = 12 amu), and 6 electrons (neutral atom). If it loses one electron, it becomes a C⁺ ion with 5 electrons.</p>
        <h3>Exercise</h3>
        <p>For a sodium (Na) atom with atomic number 11 and mass number 23: (a) How many protons? (b) How many neutrons? (c) How many electrons if neutral? (d) How many electrons if it forms Na⁺?</p>
        <h3>Summary</h3>
        <p>Protons (+1, nucleus) define the element via atomic number. Neutrons (0 charge, nucleus) contribute to mass. Electrons (−1, shells) determine chemical behaviour. In a neutral atom, protons = electrons.</p>
      `,
      quiz: [
        { question: "What is the charge of a proton?", options: ["-1", "0", "+1", "+2"], correct_answer: 2 },
        { question: "Which subatomic particle is responsible for chemical bonding?", options: ["Protons", "Neutrons", "Electrons", "Positrons"], correct_answer: 2 },
        { question: "Where are protons and neutrons located in an atom?", options: ["In the electron shells", "In the nucleus", "Evenly distributed throughout the atom", "Outside the nucleus"], correct_answer: 1 },
        { question: "A sodium atom (Na) has 11 protons. How many electrons does a neutral sodium atom have?", options: ["10", "11", "12", "23"], correct_answer: 1 },
        { question: "What is the approximate mass of an electron compared to a proton?", options: ["Equal mass", "Twice the mass", "About 1/1836 the mass", "About 100 times less mass"], correct_answer: 2 },
      ],
    },
    // ── Module 3: Chemical Bonding ────────────────────────────────────────────
    '3_1': {
      title: 'Ionic Bonding and Ionic Compounds',
      content: `
        <h2>Module 3, Lesson 1: Ionic Bonding and Ionic Compounds</h2>
        <h3>Introduction</h3>
        <p>When atoms with very different electronegativities interact — typically a metal and a non-metal — one or more electrons transfer completely from the metal to the non-metal. The resulting oppositely charged ions attract each other, forming an <strong>ionic bond</strong>.</p>
        <h3>Key Concepts</h3>
        <h4>Electron Transfer and Ion Formation</h4>
        <p>Metals (low ionisation energy) lose electrons easily, forming positive <strong>cations</strong>. Non-metals (high electron affinity) gain electrons, forming negative <strong>anions</strong>. Sodium (2,8,1 electron configuration) loses its one outer electron to achieve the stable neon configuration; chlorine (2,8,7) gains one electron to achieve the stable argon configuration. The result: Na⁺ and Cl⁻.</p>
        <h4>Crystal Lattice Structure</h4>
        <p>Ionic compounds form <strong>crystal lattices</strong> — regular, three-dimensional arrangements in which each cation is surrounded by anions and vice versa. The NaCl lattice has each Na⁺ surrounded by 6 Cl⁻ and each Cl⁻ surrounded by 6 Na⁺. This maximises electrostatic attraction and minimises repulsion, giving ionic compounds high melting points and hardness.</p>
        <h4>Properties of Ionic Compounds</h4>
        <p>Ionic compounds are: (1) solids at room temperature with high melting points (e.g., NaCl melts at 801 °C); (2) brittle (layers shift, aligning like charges repel and the crystal shatters); (3) good conductors of electricity when dissolved in water or melted (ions are free to move); (4) often soluble in polar solvents like water.</p>
        <h3>Example</h3>
        <p>Magnesium oxide (MgO) is formed when Mg (Group 2, loses 2e⁻) reacts with oxygen (Group 16, gains 2e⁻): Mg → Mg²⁺ + 2e⁻ and O + 2e⁻ → O²⁻. The resulting MgO lattice has a melting point of 2852 °C, much higher than NaCl, because the doubly charged ions attract more strongly.</p>
        <h3>Summary</h3>
        <p>Ionic bonds form by electron transfer from metal to non-metal, creating oppositely charged ions held together in a crystal lattice. Ionic compounds have high melting points, are brittle, and conduct electricity when dissolved or melted.</p>
      `,
      quiz: [
        { question: "How does an ionic bond form?", options: ["By sharing electrons between two non-metals", "By electron transfer from a metal to a non-metal", "By the overlap of atomic orbitals", "By van der Waals attractions"], correct_answer: 1 },
        { question: "Why do ionic compounds have high melting points?", options: ["They have weak covalent bonds", "Strong electrostatic attractions between oppositely charged ions require large energy to break", "They are all solids", "Their molecules are very large"], correct_answer: 1 },
        { question: "Why are ionic compounds brittle?", options: ["They have no chemical bonds", "When layers shift, like charges align and repel, shattering the crystal", "Their electrons are delocalised", "They dissolve in water"], correct_answer: 1 },
        { question: "Which condition allows ionic compounds to conduct electricity?", options: ["When they are solid", "When they are dissolved in water or melted (ions free to move)", "When they are frozen", "When they are mixed with oil"], correct_answer: 1 },
        { question: "In the formation of MgO, magnesium loses:", options: ["1 electron", "2 electrons", "3 electrons", "No electrons — it gains electrons"], correct_answer: 1 },
      ],
    },
    // ── Module 4: States of Matter ────────────────────────────────────────────
    '4_1': {
      title: 'The Solid State: Structure and Properties',
      content: `
        <h2>Module 4, Lesson 1: The Solid State — Structure and Properties</h2>
        <h3>Introduction</h3>
        <p>Solids are the state of matter in which particles are packed tightly together in a fixed arrangement, giving them a definite shape and volume. Understanding solids at the molecular level explains their mechanical, thermal, and electrical properties.</p>
        <h3>Key Concepts</h3>
        <h4>Crystalline Solids</h4>
        <p>In <strong>crystalline solids</strong>, particles (atoms, ions, or molecules) are arranged in a highly ordered, repeating pattern called a <strong>crystal lattice</strong>. Examples: table salt (NaCl), diamond, copper, ice. Crystalline solids have sharp melting points because all bonds break simultaneously at the same temperature. They can be ionic (NaCl), covalent network (diamond), metallic (iron), or molecular (ice).</p>
        <h4>Amorphous Solids</h4>
        <p><strong>Amorphous solids</strong> lack long-range order — their particles are arranged randomly. Examples: glass, rubber, many plastics. Amorphous solids soften over a range of temperatures rather than melting sharply, because bonds of varying strengths break at different temperatures.</p>
        <h4>Properties Explained by Structure</h4>
        <p>Diamond is the hardest natural substance because each carbon atom is covalently bonded to four others in a three-dimensional network — there are no weak points. Metals are malleable and ductile because layers of metal ions can slide over each other within the electron sea without disrupting bonding. Ionic crystals are brittle because sliding shifts like charges into alignment, causing repulsion.</p>
        <h3>Example</h3>
        <p>Silicon dioxide (SiO₂ — quartz) is a covalent network solid: every Si is bonded to 4 oxygen atoms, every oxygen to 2 silicon atoms, forming an infinite network. Its melting point is 1713 °C. Compare this to ice (molecular solid, hydrogen bonds only) which melts at 0 °C — the difference reflects the much stronger covalent bonds in SiO₂.</p>
        <h3>Summary</h3>
        <p>Crystalline solids have ordered lattices and sharp melting points; amorphous solids lack order and soften over a range. The mechanical and thermal properties of solids are directly explained by their bonding and structure.</p>
      `,
      quiz: [
        { question: "What distinguishes a crystalline solid from an amorphous solid?", options: ["Crystalline solids are always harder", "Crystalline solids have an ordered, repeating particle arrangement; amorphous solids do not", "Amorphous solids always conduct electricity", "Crystalline solids are always ionic"], correct_answer: 1 },
        { question: "Why does diamond have the highest hardness of any natural substance?", options: ["It is made of the heaviest atoms", "Every carbon atom is covalently bonded to four others in a 3D network with no weak points", "It has metallic bonding", "It is an amorphous solid"], correct_answer: 1 },
        { question: "How do amorphous solids differ from crystalline solids when heated?", options: ["They have a higher melting point", "They soften over a range of temperatures rather than melting at a sharp point", "They explode when heated", "They do not melt at all"], correct_answer: 1 },
        { question: "Which of the following is an example of a molecular solid?", options: ["Iron", "Diamond", "Ice (H₂O)", "Sodium chloride (NaCl)"], correct_answer: 2 },
        { question: "Why are metals malleable and ductile?", options: ["Because they have ionic bonds", "Because layers of metal ions can slide over each other within the delocalised electron sea", "Because they are amorphous solids", "Because they have very weak bonds"], correct_answer: 1 },
      ],
    },
    // ── Module 5: Chemical Reactions ─────────────────────────────────────────
    '5_1': {
      title: 'Writing and Balancing Chemical Equations',
      content: `
        <h2>Module 5, Lesson 1: Writing and Balancing Chemical Equations</h2>
        <h3>Introduction</h3>
        <p>A chemical equation is a shorthand description of a chemical reaction. It uses chemical formulas and symbols to show the reactants (starting materials) on the left and the products on the right of an arrow. Balancing equations ensures the Law of Conservation of Mass is respected — the same number of each type of atom must appear on both sides.</p>
        <h3>Key Concepts</h3>
        <h4>Writing Chemical Equations</h4>
        <p>A word equation like "hydrogen reacts with oxygen to form water" is translated to a skeletal (unbalanced) equation: H₂ + O₂ → H₂O. State symbols are often added: (g) gas, (l) liquid, (s) solid, (aq) aqueous. The arrow (→) means "produces" or "yields". For reversible reactions, a double arrow (⇌) is used.</p>
        <h4>Balancing by Inspection</h4>
        <p>To balance H₂ + O₂ → H₂O: count atoms on each side. Left: 2H, 2O. Right: 2H, 1O. Oxygen is unbalanced. Place a coefficient of 2 before H₂O: H₂ + O₂ → 2H₂O. Now left: 2H, 2O; right: 4H, 2O. Hydrogen is unbalanced. Place 2 before H₂: 2H₂ + O₂ → 2H₂O. Left: 4H, 2O; right: 4H, 2O. Balanced! Coefficients are always placed before formulas — never change subscripts in formulas.</p>
        <h4>Balancing Polyatomic Ion Equations</h4>
        <p>When a polyatomic ion (e.g., SO₄²⁻, NO₃⁻) appears unchanged on both sides, treat it as a single unit rather than counting individual atoms. This simplifies balancing significantly.</p>
        <h3>Example</h3>
        <p>Balance: Fe + O₂ → Fe₂O₃. Step 1: 4Fe + 3O₂ → 2Fe₂O₃. Check: left 4Fe + 6O; right 4Fe + 6O. ✓ Balanced.</p>
        <h3>Exercise</h3>
        <p>Balance the following: (a) CH₄ + O₂ → CO₂ + H₂O; (b) Al + HCl → AlCl₃ + H₂; (c) Ca(OH)₂ + H₃PO₄ → Ca₃(PO₄)₂ + H₂O.</p>
        <h3>Summary</h3>
        <p>Chemical equations represent reactions using formulas and symbols. Balancing — by adjusting coefficients, never subscripts — ensures atom counts are equal on both sides, satisfying conservation of mass.</p>
      `,
      quiz: [
        { question: "When balancing a chemical equation, what must you never change?", options: ["The coefficients", "The subscripts within chemical formulas", "The state symbols", "The arrow direction"], correct_answer: 1 },
        { question: "What does the state symbol (aq) indicate?", options: ["The substance is a gas", "The substance is dissolved in water (aqueous solution)", "The substance is a solid", "The substance is a liquid"], correct_answer: 1 },
        { question: "What law requires chemical equations to be balanced?", options: ["Boyle's Law", "Gay-Lussac's Law", "The Law of Conservation of Mass", "Dalton's Law"], correct_answer: 2 },
        { question: "In the equation 2H₂ + O₂ → 2H₂O, what are the coefficients?", options: ["2, 1, and 2", "H, O, and H₂O", "The subscripts in the formulas", "The state symbols"], correct_answer: 0 },
        { question: "How should you balance 'Fe + O₂ → Fe₂O₃'?", options: ["Fe + O₂ → Fe₂O₃", "4Fe + 3O₂ → 2Fe₂O₃", "2Fe + O₂ → Fe₂O₃", "Fe + 3O₂ → Fe₂O₃"], correct_answer: 1 },
      ],
    },
    // ── Module 6: Stoichiometry ───────────────────────────────────────────────
    '6_1': {
      title: 'The Mole and Avogadro\'s Number',
      content: `
        <h2>Module 6, Lesson 1: The Mole and Avogadro's Number</h2>
        <h3>Introduction</h3>
        <p>Atoms and molecules are extraordinarily small — a single water molecule has a mass of about 3 × 10⁻²³ grams. To make chemistry practical in the laboratory, chemists use the <strong>mole</strong> as a counting unit that bridges the atomic scale and the laboratory scale.</p>
        <h3>Key Concepts</h3>
        <h4>The Mole</h4>
        <p>One mole (mol) contains exactly <strong>6.022 × 10²³</strong> particles — this is <strong>Avogadro's number (Nₐ)</strong>. A mole of anything contains this many units: atoms, molecules, ions, or electrons. The mole is defined such that one mole of carbon-12 atoms has a mass of exactly 12 grams.</p>
        <h4>Molar Mass</h4>
        <p>The <strong>molar mass</strong> (M) of an element equals its relative atomic mass in g/mol. For a compound, add up the molar masses of all atoms in the formula. Water (H₂O): M = 2(1.008) + 16.00 = 18.016 g/mol. So 1 mole of water has a mass of 18.016 g and contains 6.022 × 10²³ water molecules.</p>
        <h4>Mole Conversions</h4>
        <p>The three-way conversion: <strong>n = m / M</strong> (moles = mass ÷ molar mass). Also: number of particles = n × Nₐ. Example: How many moles in 36 g of water? n = 36 / 18 = 2 mol. How many molecules? 2 × 6.022 × 10²³ = 1.204 × 10²⁴ molecules.</p>
        <h3>Example</h3>
        <p>If you have 5.0 g of NaCl (molar mass = 58.44 g/mol): n = 5.0 / 58.44 = 0.0856 mol. This contains 0.0856 × 6.022 × 10²³ = 5.15 × 10²² formula units of NaCl.</p>
        <h3>Summary</h3>
        <p>The mole is the SI unit for amount of substance: 1 mol = 6.022 × 10²³ particles (Avogadro's number). Molar mass (g/mol) = relative atomic/formula mass. Use n = m/M to convert between mass, moles, and number of particles.</p>
      `,
      quiz: [
        { question: "What is Avogadro's number?", options: ["3.14 × 10²³", "6.022 × 10²³", "1.602 × 10⁻¹⁹", "9.109 × 10⁻³¹"], correct_answer: 1 },
        { question: "How many moles are in 36 g of water (M = 18 g/mol)?", options: ["0.5 mol", "1 mol", "2 mol", "18 mol"], correct_answer: 2 },
        { question: "The molar mass of CO₂ (C=12, O=16) is:", options: ["28 g/mol", "32 g/mol", "44 g/mol", "48 g/mol"], correct_answer: 2 },
        { question: "Which formula correctly relates moles, mass, and molar mass?", options: ["n = m × M", "n = M / m", "n = m / M", "M = n + m"], correct_answer: 2 },
        { question: "How many molecules are in 1 mole of oxygen gas (O₂)?", options: ["3.011 × 10²³", "6.022 × 10²³", "1.204 × 10²⁴", "12.044 × 10²³"], correct_answer: 1 },
      ],
    },
    // ── Module 7: Organic Chemistry ───────────────────────────────────────────
    '7_1': {
      title: 'Introduction to Organic Chemistry',
      content: `
        <h2>Module 7, Lesson 1: Introduction to Organic Chemistry</h2>
        <h3>Introduction</h3>
        <p>Organic chemistry is the study of carbon-containing compounds. Carbon is unique because it can form four strong covalent bonds, bond to itself in long chains and rings, and form single, double, and triple bonds. This gives rise to millions of structurally distinct organic compounds — far more than all inorganic compounds combined.</p>
        <h3>Key Concepts</h3>
        <h4>Why Carbon is Special</h4>
        <p>Carbon (atomic number 6, electron configuration 2,4) has four valence electrons and forms four bonds. It can bond to H, O, N, S, halogens, and other carbons. Carbon-carbon chains can be straight, branched, or cyclic; bonds can be single (C–C), double (C=C), or triple (C≡C). This versatility produces the extraordinary structural diversity of organic chemistry.</p>
        <h4>Hydrocarbons: The Simplest Organic Compounds</h4>
        <p>Hydrocarbons contain only carbon and hydrogen. <strong>Alkanes</strong> (CₙH₂ₙ₊₂) have only single C–C bonds (methane CH₄, ethane C₂H₆, propane C₃H₈). <strong>Alkenes</strong> (CₙH₂ₙ) contain one or more C=C double bonds (ethene C₂H₄). <strong>Alkynes</strong> (CₙH₂ₙ₋₂) contain C≡C triple bonds (ethyne C₂H₂). <strong>Aromatic compounds</strong> contain a benzene ring (C₆H₆) with delocalised electrons.</p>
        <h4>Functional Groups</h4>
        <p>A functional group is a specific atom or group of atoms attached to the carbon skeleton that determines the compound's chemical reactivity. Common functional groups include: –OH (hydroxyl, alcohols), –COOH (carboxyl, carboxylic acids), –NH₂ (amine), –CHO (aldehyde), C=O (ketone), –COOR (ester). The same functional group in different molecules undergoes similar reactions — this is the power of the functional group concept.</p>
        <h3>Example</h3>
        <p>Ethanol (CH₃CH₂OH) is an alcohol — its –OH group makes it polar, miscible with water, and able to undergo oxidation to form acetic acid (CH₃COOH). The –OH functional group is responsible for these properties, not the carbon chain.</p>
        <h3>Summary</h3>
        <p>Organic chemistry studies carbon compounds. Carbon's ability to form four bonds and chain with itself produces millions of compounds. Hydrocarbons are the simplest; functional groups determine reactivity. These principles underpin pharmaceuticals, polymers, and biochemistry.</p>
      `,
      quiz: [
        { question: "How many covalent bonds can a carbon atom form?", options: ["2", "3", "4", "6"], correct_answer: 2 },
        { question: "What is the general formula for alkanes?", options: ["CₙH₂ₙ", "CₙH₂ₙ₊₂", "CₙH₂ₙ₋₂", "CₙHₙ"], correct_answer: 1 },
        { question: "Which functional group is present in alcohols?", options: ["–COOH", "–NH₂", "–OH", "–CHO"], correct_answer: 2 },
        { question: "What distinguishes alkenes from alkanes?", options: ["Alkenes contain only single C–C bonds", "Alkenes contain one or more C=C double bonds", "Alkenes contain C≡C triple bonds", "Alkenes contain nitrogen atoms"], correct_answer: 1 },
        { question: "Why do organic compounds with the same functional group undergo similar reactions?", options: ["Because they have the same molecular mass", "Because the functional group determines chemical reactivity regardless of the carbon chain", "Because they are all hydrocarbons", "Because they all dissolve in water"], correct_answer: 1 },
      ],
    },
    // ── Module 8: Chemical Kinetics ───────────────────────────────────────────
    '8_1': {
      title: 'Reaction Rate: Definition and Measurement',
      content: `
        <h2>Module 8, Lesson 1: Reaction Rate — Definition and Measurement</h2>
        <h3>Introduction</h3>
        <p>Not all chemical reactions occur at the same speed. Some (like explosions) are nearly instantaneous; others (like iron rusting) take years. <strong>Chemical kinetics</strong> is the study of reaction rates — how fast reactants are consumed and products are formed.</p>
        <h3>Key Concepts</h3>
        <h4>Defining Reaction Rate</h4>
        <p>The <strong>rate of reaction</strong> is the change in concentration of a reactant or product per unit time. For a reaction A → B: Rate = −Δ[A]/Δt = +Δ[B]/Δt. The negative sign for [A] reflects that reactant is consumed (decreasing); the positive sign for [B] reflects product formation. Units are typically mol/L/s (M/s).</p>
        <h4>Average vs. Instantaneous Rate</h4>
        <p>The <strong>average rate</strong> is calculated over a time interval: average rate = Δ[A]/Δt. The <strong>instantaneous rate</strong> is the rate at a specific moment — it equals the slope of the concentration-time graph at that instant (the derivative). The instantaneous rate decreases over time for most reactions as reactant concentration falls.</p>
        <h4>Measuring Reaction Rates</h4>
        <p>Methods include: measuring gas volume produced over time (e.g., collecting CO₂); measuring colour change by spectrophotometry; monitoring pH for acid-producing reactions; measuring electrical conductivity. The key is selecting a measurable property that changes as the reaction proceeds.</p>
        <h3>Example</h3>
        <p>In the decomposition of H₂O₂: 2H₂O₂ → 2H₂O + O₂. If [H₂O₂] decreases from 0.80 M to 0.40 M in 500 s, the average rate = (0.80 − 0.40)/500 = 8 × 10⁻⁴ M/s. (Rate of O₂ production = half this, because 2 mol H₂O₂ gives 1 mol O₂.)</p>
        <h3>Summary</h3>
        <p>Reaction rate measures how fast reactants are consumed or products form (mol/L/s). Average rate is calculated over a time interval; instantaneous rate is the rate at a specific moment. Various experimental methods are used to monitor concentration changes over time.</p>
      `,
      quiz: [
        { question: "What is the reaction rate?", options: ["The temperature at which a reaction occurs", "The change in concentration of reactant or product per unit time", "The energy released in a reaction", "The number of moles of reactant used"], correct_answer: 1 },
        { question: "For the reaction A → B, why is the rate expressed as −Δ[A]/Δt?", options: ["Because [A] is increasing", "Because [A] is decreasing as reactant is consumed (hence the negative sign to give a positive rate)", "Because [B] is negative", "To indicate an endothermic reaction"], correct_answer: 1 },
        { question: "What are the typical units for reaction rate?", options: ["mol/L (concentration only)", "g/s (grams per second)", "mol/L/s (molarity per second)", "kJ/mol (energy per mole)"], correct_answer: 2 },
        { question: "How does instantaneous rate relate to a concentration-time graph?", options: ["It is the total area under the graph", "It is the average of all rates on the graph", "It equals the slope (gradient) of the graph at a specific point in time", "It is the maximum y-value on the graph"], correct_answer: 2 },
        { question: "Which method can be used to measure the rate of a gas-producing reaction?", options: ["Measuring the boiling point", "Collecting and measuring the volume of gas produced over time", "Measuring the electrical resistance of the solution", "Weighing the reactants before the reaction"], correct_answer: 1 },
      ],
    },
    // ── Module 9: Thermochemistry ─────────────────────────────────────────────
    '9_1': {
      title: 'Energy, Heat, and Work in Chemical Systems',
      content: `
        <h2>Module 9, Lesson 1: Energy, Heat, and Work in Chemical Systems</h2>
        <h3>Introduction</h3>
        <p>Every chemical reaction involves an exchange of energy. Understanding thermochemistry — the study of heat changes in chemical reactions — is essential for predicting whether reactions will occur spontaneously, how much energy they release or absorb, and how to harness chemical energy for practical purposes.</p>
        <h3>Key Concepts</h3>
        <h4>The First Law of Thermodynamics</h4>
        <p>Energy is neither created nor destroyed — it is only converted from one form to another. In chemistry: ΔE = q + w, where ΔE is the change in internal energy of the system, q is heat (positive when absorbed, negative when released), and w is work (work done on the system is positive; work done by the system is negative).</p>
        <h4>Heat and Enthalpy</h4>
        <p>At constant pressure (typical laboratory conditions), the heat change equals the change in <strong>enthalpy</strong> (ΔH). <strong>Exothermic reactions</strong> release heat to the surroundings (ΔH < 0) — the system loses energy (e.g., combustion, neutralisation). <strong>Endothermic reactions</strong> absorb heat from the surroundings (ΔH > 0) — the system gains energy (e.g., photosynthesis, dissolving ammonium nitrate).</p>
        <h4>System and Surroundings</h4>
        <p>In thermodynamics, the <strong>system</strong> is the part of the universe being studied (typically the reaction mixture); the <strong>surroundings</strong> is everything else. Heat flows from hot to cold: in an exothermic reaction, heat flows from the system (hot reaction) to the surroundings, which warm up. In an endothermic reaction, heat flows from (warm) surroundings into the system, which cools the surroundings.</p>
        <h3>Example</h3>
        <p>When methane burns in oxygen: CH₄ + 2O₂ → CO₂ + 2H₂O, ΔH = −890 kJ/mol. The reaction is exothermic: 890 kJ of heat is released per mole of methane burned. This is why natural gas is a useful fuel — it releases large amounts of usable energy.</p>
        <h3>Summary</h3>
        <p>The First Law: energy is conserved (ΔE = q + w). At constant pressure, heat change equals ΔH. Exothermic reactions (ΔH < 0) release heat; endothermic reactions (ΔH > 0) absorb heat. The system/surroundings distinction is essential for thermochemical analysis.</p>
      `,
      quiz: [
        { question: "What does the First Law of Thermodynamics state?", options: ["Energy flows from cold to hot", "Energy is neither created nor destroyed — only converted between forms", "Entropy always increases", "Reactions always release heat"], correct_answer: 1 },
        { question: "For an exothermic reaction, what is the sign of ΔH?", options: ["ΔH > 0 (positive)", "ΔH = 0 (zero)", "ΔH < 0 (negative)", "ΔH is undefined"], correct_answer: 2 },
        { question: "At constant pressure, what does the enthalpy change (ΔH) equal?", options: ["The change in temperature only", "The heat exchanged between the system and surroundings", "The work done by the system", "The total internal energy"], correct_answer: 1 },
        { question: "Which of the following is an example of an endothermic process?", options: ["Combustion of methane", "Neutralisation of acid and base", "Dissolving ammonium nitrate in water", "Condensation of steam"], correct_answer: 2 },
        { question: "In an exothermic reaction, heat flows:", options: ["From the surroundings into the system", "From the system to the surroundings", "In no direction — heat is created", "Equally in both directions"], correct_answer: 1 },
      ],
    },
    // ── Module 10: Advanced Topics ────────────────────────────────────────────
    '10_1': {
      title: 'Chemical Equilibrium and Le Chatelier\'s Principle',
      content: `
        <h2>Module 10, Lesson 1: Chemical Equilibrium and Le Chatelier's Principle</h2>
        <h3>Introduction</h3>
        <p>Many chemical reactions do not go to completion — they reach a state of <strong>chemical equilibrium</strong> where the forward and reverse reactions occur at equal rates. Understanding equilibrium is essential for industrial chemistry, biochemistry, and environmental science.</p>
        <h3>Key Concepts</h3>
        <h4>Dynamic Equilibrium</h4>
        <p>At equilibrium, concentrations of reactants and products remain constant — but the forward and reverse reactions are still occurring at equal rates. This is a <strong>dynamic</strong> (not static) equilibrium: the system is in constant motion at the molecular level, even though macroscopic properties are unchanging.</p>
        <h4>The Equilibrium Constant K</h4>
        <p>For the reaction aA + bB ⇌ cC + dD, the equilibrium constant Kc = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ. Products are in the numerator; reactants in the denominator; exponents = stoichiometric coefficients. A large K (K >> 1) means equilibrium favours products; small K (K << 1) means equilibrium favours reactants.</p>
        <h4>Le Chatelier's Principle</h4>
        <p>If a system at equilibrium is subjected to a change (stress), the system shifts to partially counteract that change and re-establish equilibrium. Stresses include: (1) concentration change — adding reactant shifts equilibrium to produce more product; (2) pressure change — increasing pressure shifts equilibrium toward the side with fewer moles of gas; (3) temperature change — for an exothermic reaction, increasing temperature shifts equilibrium towards reactants (since it favours the endothermic reverse).</p>
        <h3>Example</h3>
        <p>The Haber process: N₂(g) + 3H₂(g) ⇌ 2NH₃(g), ΔH = −92 kJ/mol. To maximise NH₃: (1) high pressure (4 moles gas → 2 moles gas); (2) remove NH₃ as it forms; (3) compromise temperature (~450 °C) — low T favours equilibrium but slows rate; catalyst used to achieve acceptable rate.</p>
        <h3>Summary</h3>
        <p>Chemical equilibrium is a dynamic state where forward and reverse rates are equal. The equilibrium constant K quantifies the position of equilibrium. Le Chatelier's principle predicts how equilibrium shifts in response to concentration, pressure, and temperature changes.</p>
      `,
      quiz: [
        { question: "What is chemical equilibrium?", options: ["A reaction that goes to completion", "A state where the forward and reverse reactions occur at equal rates, giving constant concentrations", "A reaction that releases all its energy", "A state where no reactions are occurring"], correct_answer: 1 },
        { question: "For the equilibrium N₂ + 3H₂ ⇌ 2NH₃, what is the correct expression for Kc?", options: ["Kc = [N₂][H₂]³ / [NH₃]²", "Kc = [NH₃]² / ([N₂][H₂]³)", "Kc = [NH₃] / ([N₂] + [H₂])", "Kc = 2[NH₃] / 4([N₂][H₂])"], correct_answer: 1 },
        { question: "According to Le Chatelier's principle, what happens when more reactant is added to a system at equilibrium?", options: ["The equilibrium shifts to produce more reactant", "The equilibrium shifts to produce more product", "The equilibrium constant K increases", "The reaction stops completely"], correct_answer: 1 },
        { question: "For an exothermic reaction at equilibrium, increasing the temperature:", options: ["Shifts equilibrium toward products", "Shifts equilibrium toward reactants", "Has no effect on equilibrium", "Increases K"], correct_answer: 1 },
        { question: "In the Haber process (N₂ + 3H₂ ⇌ 2NH₃), why is high pressure used?", options: ["To increase the equilibrium constant K", "Because 4 moles of gas on the left produce 2 moles on the right — high pressure favours less gas (products)", "To keep the catalyst active", "To increase the temperature"], correct_answer: 1 },
      ],
    },
  };

  const generateLessonContent = (modId, lessId) => {
    const key = `${modId}_${lessId}`;
    const data = LESSON_DATA[key];
    if (data) return data.content;
    // Fallback: content unique to this module/lesson by describing the specific module topic
    const moduleNames = {
      1: 'Basic Concepts', 2: 'Periodic Table', 3: 'Chemical Bonding',
      4: 'States of Matter', 5: 'Chemical Reactions', 6: 'Stoichiometry',
      7: 'Organic Chemistry', 8: 'Chemical Kinetics', 9: 'Thermochemistry',
      10: 'Advanced Topics',
    };
    const moduleName = moduleNames[modId] || `Module ${modId}`;
    return `
      <h2>Module ${modId}, Lesson ${lessId}: ${moduleName} — Part ${lessId}</h2>
      <h3>Introduction</h3>
      <p>This lesson continues your study of <strong>${moduleName}</strong>, building on the concepts introduced in earlier lessons of this module. Each lesson in this module covers a distinct subtopic that deepens your understanding of ${moduleName.toLowerCase()} principles.</p>
      <h3>Key Concepts</h3>
      <p>In this lesson, Lesson ${lessId} of ${moduleName}, you will explore the specific concepts, equations, and applications that form a distinct and important part of this module's curriculum. Work through the following quiz to test your understanding before advancing.</p>
      <h3>Practical Application</h3>
      <p>The concepts covered in Module ${modId}, Lesson ${lessId} have real-world applications in chemistry research, industry, and everyday life. Understanding these topics will prepare you for more advanced study in ${moduleName.toLowerCase()}.</p>
      <h3>Summary</h3>
      <p>You have completed Lesson ${lessId} of the ${moduleName} module. Ensure you can answer the quiz questions below before moving on to Lesson ${parseInt(lessId) + 1}.</p>
    `;
  };

  const generateQuiz = (modId, lessId) => {
    const key = `${modId}_${lessId}`;
    const data = LESSON_DATA[key];
    if (data) return data.quiz;
    // Deterministic fallback quiz — rotates questions so each lesson gets a different starting question
    const fallbackPool = [
      { question: "What is the Law of Conservation of Mass?", options: ["Mass is created in reactions", "The total mass of reactants equals total mass of products", "Mass decreases in exothermic reactions", "Mass is converted to energy"], correct_answer: 1 },
      { question: "What does a chemical formula represent?", options: ["The colour of a compound", "The number and types of atoms in a substance", "The state of matter", "The temperature at which a reaction occurs"], correct_answer: 1 },
      { question: "What is the difference between an element and a compound?", options: ["No difference", "An element has one type of atom; a compound has two or more types chemically combined", "A compound is always a gas", "An element is always a metal"], correct_answer: 1 },
      { question: "What is a catalyst?", options: ["A substance consumed in a reaction to speed it up", "A substance that increases reaction rate without being consumed", "A type of product formed in every reaction", "A measure of reaction energy"], correct_answer: 1 },
      { question: "What is electronegativity?", options: ["The ability of an atom in a bond to attract electrons toward itself", "The number of electrons in an atom", "The charge on an ion", "The mass of an atom"], correct_answer: 0 },
    ];
    const offset = (parseInt(lessId, 10) - 1) % fallbackPool.length;
    return [...fallbackPool.slice(offset), ...fallbackPool.slice(0, offset)];
  };

  const handleQuizComplete = async (passed, score) => {
    setQuizCompleted(passed);
    
    if (passed) {
      try {
        await fetch('/api/assessments/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lesson_id: lessonId,
            module_id: moduleId,
            score: score
          })
        });
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  const goToNextLesson = () => {
    const nextLessonId = parseInt(lessonId) + 1;
    if (nextLessonId <= 10) {
      router.push(`/modules/${moduleId}/lesson/${nextLessonId}`);
    } else {
      const nextModuleId = parseInt(moduleId) + 1;
      if (nextModuleId <= 10) {
        router.push(`/modules/${moduleId}/final-test`);
      } else {
        router.push('/curriculum');
      }
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading lesson...</p>
          </div>
        </div>
    );
  }

  return (
    <>
      <Head>
        <title>{lesson?.title} - Learn Chemistry</title>
        <meta name="description" content={`Learn Chemistry - Module ${moduleId}, Lesson ${lessonId}`} />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <button
              onClick={() => router.push('/curriculum')}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Curriculum
            </button>
          </div>

          <div className="card mb-8">
            <div className="mb-6">
              <span className="text-sm text-gray-500">Module {moduleId}</span>
              <h1 className="text-3xl font-bold mt-2">{lesson?.title}</h1>
            </div>

            <LessonContent html={lesson?.content} />
          </div>

          {lesson?.quiz && (
            <QuizComponent 
              questions={lesson.quiz}
              onComplete={handleQuizComplete}
            />
          )}

          {quizCompleted && (
            <div className="card bg-green-50 border-2 border-green-500">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                🎉 Quiz Passed!
              </h3>
              <p className="text-gray-700 mb-4">
                Congratulations! You've successfully completed this lesson.
              </p>
              <button
                onClick={goToNextLesson}
                className="btn-primary"
              >
                Continue to Next Lesson
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
