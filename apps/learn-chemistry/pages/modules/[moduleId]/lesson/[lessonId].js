"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Footer from '../../../../components/Footer';
import QuizComponent from '../../../../components/QuizComponent';
import { getCurrentUser } from '../../../../lib/supabaseClient';

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
      fetchLesson();
    }
  }, [moduleId, lessonId]);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser && process.env.NEXT_PUBLIC_DISABLE_AUTH !== 'true') {
      router.push('/register');
      return;
    }
    setUser(currentUser);
  };

  const fetchLesson = async () => {
    try {
      setLesson({
        id: lessonId,
        module_id: moduleId,
        title: `Lesson ${lessonId}`,
        content: generateLessonContent(moduleId, lessonId),
        quiz: generateQuiz()
      });
    } catch (error) {
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateLessonContent = (modId, lessId) => {
    return `
      <h2>Module ${modId}, Lesson ${lessId}: Foundations of Chemistry</h2>

      <h3>Introduction</h3>
      <p>Chemistry is the central science — a bridge between physics and biology, between the pure mathematical description of particles and the complex self-organising systems of life. It is the study of matter: what it is made of, how it is structured, how it behaves, and how it transforms. Every material object you encounter — the food you eat, the medicines you take, the plastics, metals, and composites that form your environment — is a product of chemical processes.</p>
      <p>The history of chemistry is a history of humanity learning to manipulate matter. From ancient alchemists seeking to transmute lead into gold, to the 18th-century discovery of oxygen by Lavoisier, to 20th-century developments in polymer chemistry, pharmaceuticals, and nuclear chemistry, the field has continually expanded the boundaries of what is possible. Today, chemistry is at the forefront of addressing humanity's greatest challenges: designing drugs to fight emerging diseases, developing new battery materials for clean energy storage, creating biodegradable plastics to reduce environmental impact.</p>
      <p>This lesson introduces the five foundational pillars of chemistry: atomic structure, chemical bonding, chemical reactions, stoichiometry, and thermochemistry. Together these provide the conceptual scaffolding for everything that follows in this course.</p>

      <h3>Key Concepts</h3>
      <h4>1. Atomic Structure: The Architecture of Matter</h4>
      <p>All matter is composed of atoms — the smallest units of a chemical element that retain that element's chemical identity. An atom consists of a dense nucleus containing protons (positively charged) and neutrons (no charge), surrounded by electrons (negatively charged) arranged in shells or energy levels. The number of protons defines the element; the number of electrons determines its chemical behaviour.</p>
      <p>The periodic table organises all known elements by atomic number (number of protons) and by chemical properties. Elements in the same vertical column (group) share similar valence electron configurations and therefore similar chemical behaviours. Metals, non-metals, and metalloids occupy characteristic regions. Understanding the periodic table is not about memorisation — it is about recognising patterns: ionisation energies increase across a period; atomic radii decrease across a period; reactivity of alkali metals increases down Group 1.</p>
      <p>The quantum mechanical model of the atom replaced the simplified Bohr model. Electrons occupy orbitals (probability distributions, not defined orbits), described by four quantum numbers. The filling of orbitals follows the Aufbau principle, Hund's rule, and the Pauli exclusion principle — rules that explain the electron configurations that ultimately determine all chemical behaviour.</p>

      <h4>2. Chemical Bonding: How Atoms Connect</h4>
      <p>Atoms form bonds to achieve more stable electron configurations — typically a complete outer shell (octet rule for most elements; duet for hydrogen and helium). The three main bond types have fundamentally different characters:</p>
      <p><strong>Ionic bonds</strong> involve the complete transfer of electrons from a metal (which loses electrons to form a positive cation) to a non-metal (which gains electrons to form a negative anion). The electrostatic attraction between opposite charges holds the ions together in a crystal lattice. Common table salt (NaCl) is the archetypal ionic compound: high melting point, brittle, conducts electricity when dissolved in water.</p>
      <p><strong>Covalent bonds</strong> involve the sharing of electron pairs between atoms. They can be single (one shared pair), double, or triple bonds, each with increasing bond strength and decreasing bond length. Organic chemistry — the chemistry of carbon-containing compounds — is built almost entirely on covalent bonding. The extraordinary versatility of carbon arises from its ability to form four covalent bonds in tetrahedral, trigonal planar, or linear geometries.</p>
      <p><strong>Metallic bonds</strong> consist of a lattice of positive metal ions surrounded by a "sea" of delocalised electrons. This explains the characteristic properties of metals: electrical conductivity, thermal conductivity, malleability, and lustrous appearance.</p>

      <h4>3. Chemical Reactions: Transformation of Matter</h4>
      <p>A chemical reaction involves the breaking of bonds in reactants and the formation of new bonds in products. Matter is conserved (Lavoisier's Law of Conservation of Mass); atoms are rearranged, not created or destroyed. Reactions are classified by type: synthesis (A + B → AB), decomposition (AB → A + B), single displacement (A + BC → AC + B), double displacement (AB + CD → AD + CB), and combustion (fuel + O₂ → CO₂ + H₂O).</p>
      <p>Reaction rates depend on temperature, concentration, surface area, and the presence of catalysts. Collision theory explains that reactions occur when particles collide with sufficient energy (activation energy) and correct orientation. A catalyst provides an alternative reaction pathway with lower activation energy, increasing the reaction rate without being consumed — the principle behind enzyme catalysis in living systems and industrial chemical processes.</p>

      <h4>4. Stoichiometry: The Quantitative Language of Reactions</h4>
      <p>Stoichiometry is the calculation of the relative quantities of reactants and products in chemical reactions. The mole (approximately 6.022 × 10²³ particles — Avogadro's number) is the bridge between the atomic scale and the laboratory scale. A mole of carbon-12 atoms has a mass of exactly 12 grams; a mole of water (H₂O) has a molar mass of 18 g/mol.</p>
      <p>Balanced chemical equations provide molar ratios that serve as conversion factors for stoichiometric calculations. If 2 moles of hydrogen react with 1 mole of oxygen to produce 2 moles of water, then to produce 10 moles of water you need exactly 10 moles of hydrogen and 5 moles of oxygen. The limiting reagent (the one that is fully consumed first) determines the maximum yield of product. Percentage yield compares actual yield to theoretical yield, reflecting the inefficiencies of real reactions.</p>

      <h4>5. Thermochemistry: Energy in Chemical Reactions</h4>
      <p>Chemical reactions absorb or release energy, primarily as heat. Exothermic reactions release heat (combustion, neutralisation); endothermic reactions absorb heat (photosynthesis, dissolving ammonium nitrate in water). Enthalpy (H) is the thermodynamic quantity that measures the heat content of a system at constant pressure. The enthalpy change of a reaction (ΔH) is the heat released (negative ΔH for exothermic) or absorbed (positive ΔH for endothermic).</p>
      <p>Hess's Law states that the total enthalpy change of a reaction is independent of the path taken — it depends only on the initial and final states. This allows the calculation of enthalpy changes for reactions that are difficult to measure directly, by combining known enthalpy values for related reactions. Standard enthalpies of formation (ΔHf°) are tabulated for thousands of compounds and serve as the reference data for thermochemical calculations.</p>

      <h3>Practical Applications</h3>
      <p><strong>Pharmaceuticals:</strong> Drug molecules are designed through understanding of chemical bonding and molecular geometry. A drug must fit precisely into a target receptor (the "lock and key" model) to trigger a biological response. Chirality — the property of a molecule that exists in two non-superimposable mirror-image forms — is critical: one enantiomer may be therapeutic while the other is inert or even harmful.</p>
      <p><strong>Materials Science:</strong> Polymers (plastics, rubbers, fibres) are large molecules built from repeating monomer units through addition or condensation polymerisation. Understanding polymer chemistry enables the design of materials with specific properties: high strength, flexibility, transparency, conductivity, or biodegradability. Advanced composites, aerogels, and conductive polymers are driving innovations in aerospace, construction, and electronics.</p>
      <p><strong>Environmental Chemistry:</strong> The chemical reactions driving climate change (CO₂ and the greenhouse effect), acid rain (NOₓ and SOₓ reacting with atmospheric water), and ozone depletion (chlorofluorocarbons catalysing ozone destruction) are all understood through the principles in this lesson. Environmental remediation — cleaning contaminated soil and water — uses chemistry to neutralise, break down, or sequester pollutants.</p>
      <p><strong>Food and Nutrition:</strong> The Maillard reaction (responsible for the browning and flavour development when cooking meat and bread) is a complex series of chemical reactions between amino acids and reducing sugars. Understanding the chemistry of fats, carbohydrates, proteins, vitamins, and minerals is the scientific foundation of nutrition, food technology, and culinary science.</p>

      <h3>Summary</h3>
      <p>Chemistry is the science of transformation — of understanding how matter is structured and how it changes. In this lesson you have covered: atomic structure and the organisation of the periodic table; the three types of chemical bonding and their properties; chemical reaction types and kinetics; the quantitative framework of stoichiometry; and the thermochemistry of energy changes in reactions.</p>
      <p>These foundational concepts recur throughout every branch of chemistry and every application field, from drug design to materials engineering to environmental science. As you progress through this course, you will build increasingly sophisticated chemical knowledge on this foundation — developing the analytical mindset and technical fluency of a true chemist.</p>
    `;
  };

  const generateQuiz = () => {
    return [
      {
        question: "What is an atom?",
        options: [
          "The smallest unit of a chemical element that retains its chemical properties",
          "A group of molecules bonded together",
          "A type of chemical reaction",
          "A unit of measurement for energy"
        ],
        correct_answer: 0
      },
      {
        question: "What type of bond involves the sharing of electrons between atoms?",
        options: [
          "Ionic bond",
          "Metallic bond",
          "Covalent bond",
          "Hydrogen bond"
        ],
        correct_answer: 2
      },
      {
        question: "What does the pH scale measure?",
        options: [
          "The temperature of a solution",
          "The concentration of hydrogen ions (acidity or alkalinity)",
          "The density of a liquid",
          "The pressure of a gas"
        ],
        correct_answer: 1
      },
      {
        question: "What is a chemical reaction?",
        options: [
          "A physical change in the state of matter",
          "A process where substances are transformed into new substances with different properties",
          "The mixing of two liquids",
          "The boiling of water"
        ],
        correct_answer: 1
      },
      {
        question: "What is the Periodic Table?",
        options: [
          "A calendar of chemistry experiments",
          "A table of chemical reactions",
          "An organized arrangement of all known chemical elements by atomic number",
          "A list of laboratory safety rules"
        ],
        correct_answer: 2
      }
    ];
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
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading lesson...</p>
          </div>
        </div>
        <Footer />
      </>
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

            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson?.content }} />
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

      <Footer />
    </>
  );
}
