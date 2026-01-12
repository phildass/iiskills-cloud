import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getCurrentUser, signOutUser, getUserProfile, isAdmin } from "../lib/supabaseClient";
import UserProtectedRoute from "../components/UserProtectedRoute";

// Chemistry curriculum structure: 3 levels, 7-10 modules per level, 5 lessons per module
const CHEMISTRY_CURRICULUM = {
  levels: [
    {
      id: "level-1",
      name: "Foundational Chemistry",
      description: "Master the fundamental concepts of chemistry",
      modules: [
        {
          id: "mod-1-1",
          name: "Introduction to Chemistry",
          lessons: [
            { id: "les-1-1-1", name: "What is Chemistry?", completed: false },
            { id: "les-1-1-2", name: "Matter and Its Properties", completed: false },
            { id: "les-1-1-3", name: "Classification of Matter", completed: false },
            { id: "les-1-1-4", name: "Measurements in Chemistry", completed: false },
            { id: "les-1-1-5", name: "Scientific Method", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-1-2",
          name: "Atomic Structure",
          lessons: [
            { id: "les-1-2-1", name: "Structure of the Atom", completed: false },
            { id: "les-1-2-2", name: "Subatomic Particles", completed: false },
            { id: "les-1-2-3", name: "Atomic Number and Mass", completed: false },
            { id: "les-1-2-4", name: "Isotopes and Ions", completed: false },
            { id: "les-1-2-5", name: "Electronic Configuration", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-1-3",
          name: "Periodic Table",
          lessons: [
            { id: "les-1-3-1", name: "History of the Periodic Table", completed: false },
            { id: "les-1-3-2", name: "Periods and Groups", completed: false },
            { id: "les-1-3-3", name: "Periodic Trends", completed: false },
            { id: "les-1-3-4", name: "Metals, Nonmetals, and Metalloids", completed: false },
            { id: "les-1-3-5", name: "Special Groups of Elements", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-1-4",
          name: "Chemical Bonding",
          lessons: [
            { id: "les-1-4-1", name: "Types of Chemical Bonds", completed: false },
            { id: "les-1-4-2", name: "Ionic Bonding", completed: false },
            { id: "les-1-4-3", name: "Covalent Bonding", completed: false },
            { id: "les-1-4-4", name: "Metallic Bonding", completed: false },
            { id: "les-1-4-5", name: "Lewis Structures", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-1-5",
          name: "Chemical Formulas and Equations",
          lessons: [
            { id: "les-1-5-1", name: "Chemical Formulas", completed: false },
            { id: "les-1-5-2", name: "Writing Chemical Equations", completed: false },
            { id: "les-1-5-3", name: "Balancing Equations", completed: false },
            { id: "les-1-5-4", name: "Types of Chemical Reactions", completed: false },
            { id: "les-1-5-5", name: "Stoichiometry Basics", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-1-6",
          name: "States of Matter",
          lessons: [
            { id: "les-1-6-1", name: "Solids, Liquids, and Gases", completed: false },
            { id: "les-1-6-2", name: "Phase Changes", completed: false },
            { id: "les-1-6-3", name: "Gas Laws", completed: false },
            { id: "les-1-6-4", name: "Kinetic Molecular Theory", completed: false },
            { id: "les-1-6-5", name: "Plasma and Other States", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-1-7",
          name: "Solutions and Mixtures",
          lessons: [
            { id: "les-1-7-1", name: "Solutions and Solubility", completed: false },
            { id: "les-1-7-2", name: "Concentration Units", completed: false },
            { id: "les-1-7-3", name: "Factors Affecting Solubility", completed: false },
            { id: "les-1-7-4", name: "Colligative Properties", completed: false },
            { id: "les-1-7-5", name: "Colloids and Suspensions", completed: false },
          ],
          testAvailable: true,
        },
      ],
    },
    {
      id: "level-2",
      name: "Intermediate Chemistry",
      description: "Explore deeper chemical concepts and reactions",
      modules: [
        {
          id: "mod-2-1",
          name: "Thermochemistry",
          lessons: [
            { id: "les-2-1-1", name: "Energy and Heat", completed: false },
            { id: "les-2-1-2", name: "Enthalpy and Calorimetry", completed: false },
            { id: "les-2-1-3", name: "Hess's Law", completed: false },
            { id: "les-2-1-4", name: "Bond Energies", completed: false },
            { id: "les-2-1-5", name: "Spontaneity and Entropy", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-2-2",
          name: "Chemical Kinetics",
          lessons: [
            { id: "les-2-2-1", name: "Reaction Rates", completed: false },
            { id: "les-2-2-2", name: "Rate Laws and Orders", completed: false },
            { id: "les-2-2-3", name: "Collision Theory", completed: false },
            { id: "les-2-2-4", name: "Activation Energy", completed: false },
            { id: "les-2-2-5", name: "Catalysts and Mechanisms", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-2-3",
          name: "Chemical Equilibrium",
          lessons: [
            { id: "les-2-3-1", name: "Reversible Reactions", completed: false },
            { id: "les-2-3-2", name: "Equilibrium Constant", completed: false },
            { id: "les-2-3-3", name: "Le Chatelier's Principle", completed: false },
            { id: "les-2-3-4", name: "ICE Tables", completed: false },
            { id: "les-2-3-5", name: "Equilibrium Calculations", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-2-4",
          name: "Acids and Bases",
          lessons: [
            { id: "les-2-4-1", name: "Acid-Base Theories", completed: false },
            { id: "les-2-4-2", name: "pH and pOH", completed: false },
            { id: "les-2-4-3", name: "Strong and Weak Acids/Bases", completed: false },
            { id: "les-2-4-4", name: "Buffer Solutions", completed: false },
            { id: "les-2-4-5", name: "Titrations", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-2-5",
          name: "Electrochemistry",
          lessons: [
            { id: "les-2-5-1", name: "Oxidation and Reduction", completed: false },
            { id: "les-2-5-2", name: "Balancing Redox Equations", completed: false },
            { id: "les-2-5-3", name: "Electrochemical Cells", completed: false },
            { id: "les-2-5-4", name: "Standard Electrode Potentials", completed: false },
            { id: "les-2-5-5", name: "Electrolysis", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-2-6",
          name: "Organic Chemistry Basics",
          lessons: [
            { id: "les-2-6-1", name: "Introduction to Organic Chemistry", completed: false },
            { id: "les-2-6-2", name: "Hydrocarbons", completed: false },
            { id: "les-2-6-3", name: "Functional Groups", completed: false },
            { id: "les-2-6-4", name: "Isomerism", completed: false },
            { id: "les-2-6-5", name: "Nomenclature Basics", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-2-7",
          name: "Nuclear Chemistry",
          lessons: [
            { id: "les-2-7-1", name: "Radioactivity", completed: false },
            { id: "les-2-7-2", name: "Types of Radiation", completed: false },
            { id: "les-2-7-3", name: "Half-Life", completed: false },
            { id: "les-2-7-4", name: "Nuclear Reactions", completed: false },
            { id: "les-2-7-5", name: "Applications of Nuclear Chemistry", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-2-8",
          name: "Coordination Chemistry",
          lessons: [
            { id: "les-2-8-1", name: "Complex Ions", completed: false },
            { id: "les-2-8-2", name: "Ligands and Coordination Number", completed: false },
            { id: "les-2-8-3", name: "Nomenclature of Complexes", completed: false },
            { id: "les-2-8-4", name: "Crystal Field Theory", completed: false },
            { id: "les-2-8-5", name: "Applications of Coordination Compounds", completed: false },
          ],
          testAvailable: true,
        },
      ],
    },
    {
      id: "level-3",
      name: "Advanced Chemistry",
      description: "Master advanced chemical principles and applications",
      modules: [
        {
          id: "mod-3-1",
          name: "Advanced Organic Chemistry",
          lessons: [
            { id: "les-3-1-1", name: "Reaction Mechanisms", completed: false },
            { id: "les-3-1-2", name: "Stereochemistry", completed: false },
            { id: "les-3-1-3", name: "Aromatic Compounds", completed: false },
            { id: "les-3-1-4", name: "Carbonyl Chemistry", completed: false },
            { id: "les-3-1-5", name: "Polymers", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-3-2",
          name: "Analytical Chemistry",
          lessons: [
            { id: "les-3-2-1", name: "Spectroscopy Techniques", completed: false },
            { id: "les-3-2-2", name: "Chromatography", completed: false },
            { id: "les-3-2-3", name: "Mass Spectrometry", completed: false },
            { id: "les-3-2-4", name: "NMR Spectroscopy", completed: false },
            { id: "les-3-2-5", name: "Quantitative Analysis", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-3-3",
          name: "Physical Chemistry",
          lessons: [
            { id: "les-3-3-1", name: "Quantum Mechanics Basics", completed: false },
            { id: "les-3-3-2", name: "Wave Functions and Orbitals", completed: false },
            { id: "les-3-3-3", name: "Molecular Spectroscopy", completed: false },
            { id: "les-3-3-4", name: "Statistical Thermodynamics", completed: false },
            { id: "les-3-3-5", name: "Surface Chemistry", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-3-4",
          name: "Biochemistry",
          lessons: [
            { id: "les-3-4-1", name: "Amino Acids and Proteins", completed: false },
            { id: "les-3-4-2", name: "Carbohydrates", completed: false },
            { id: "les-3-4-3", name: "Lipids and Membranes", completed: false },
            { id: "les-3-4-4", name: "Nucleic Acids", completed: false },
            { id: "les-3-4-5", name: "Enzymes and Metabolism", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-3-5",
          name: "Inorganic Chemistry",
          lessons: [
            { id: "les-3-5-1", name: "Transition Metals", completed: false },
            { id: "les-3-5-2", name: "Organometallic Chemistry", completed: false },
            { id: "les-3-5-3", name: "Bioinorganic Chemistry", completed: false },
            { id: "les-3-5-4", name: "Main Group Chemistry", completed: false },
            { id: "les-3-5-5", name: "Solid State Chemistry", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-3-6",
          name: "Environmental Chemistry",
          lessons: [
            { id: "les-3-6-1", name: "Atmospheric Chemistry", completed: false },
            { id: "les-3-6-2", name: "Water Chemistry", completed: false },
            { id: "les-3-6-3", name: "Soil Chemistry", completed: false },
            { id: "les-3-6-4", name: "Pollution and Remediation", completed: false },
            { id: "les-3-6-5", name: "Green Chemistry", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-3-7",
          name: "Industrial Chemistry",
          lessons: [
            { id: "les-3-7-1", name: "Chemical Process Engineering", completed: false },
            { id: "les-3-7-2", name: "Petrochemistry", completed: false },
            { id: "les-3-7-3", name: "Pharmaceutical Chemistry", completed: false },
            { id: "les-3-7-4", name: "Materials Science", completed: false },
            { id: "les-3-7-5", name: "Nanotechnology", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-3-8",
          name: "Computational Chemistry",
          lessons: [
            { id: "les-3-8-1", name: "Molecular Modeling", completed: false },
            { id: "les-3-8-2", name: "Quantum Chemical Calculations", completed: false },
            { id: "les-3-8-3", name: "Molecular Dynamics", completed: false },
            { id: "les-3-8-4", name: "Cheminformatics", completed: false },
            { id: "les-3-8-5", name: "AI in Chemistry", completed: false },
          ],
          testAvailable: true,
        },
        {
          id: "mod-3-9",
          name: "Advanced Topics in Chemistry",
          lessons: [
            { id: "les-3-9-1", name: "Supramolecular Chemistry", completed: false },
            { id: "les-3-9-2", name: "Photochemistry", completed: false },
            { id: "les-3-9-3", name: "Catalysis", completed: false },
            { id: "les-3-9-4", name: "Chemical Synthesis Strategies", completed: false },
            { id: "les-3-9-5", name: "Research Frontiers", completed: false },
          ],
          testAvailable: true,
        },
      ],
    },
  ],
};

/**
 * Main Learning Page for Chemistry
 *
 * Users can navigate through levels, modules, and lessons
 * Protected Route: Requires authentication (FREE - no payment required)
 */
function LearnContent() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [selectedModule, setSelectedModule] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();

      if (currentUser) {
        setUser(currentUser);
        setUserProfile(getUserProfile(currentUser));
        // Check if user is admin
        const hasAdminAccess = await isAdmin(currentUser);
        setUserIsAdmin(hasAdminAccess);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    const { success } = await signOutUser();
    if (success) {
      setUser(null);
      router.push("/");
    }
  };

  const calculateProgress = (level) => {
    const totalLessons = level.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
    const completedLessons = level.modules.reduce(
      (sum, mod) => sum + mod.lessons.filter((l) => l.completed).length,
      0
    );
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-xl text-charcoal">Loading...</p>
        </div>
      </div>
    );
  }

  const currentLevel = CHEMISTRY_CURRICULUM.levels[selectedLevel];

  return (
    <>
      <Head>
        <title>Learn Chemistry - iiskills.cloud</title>
        <meta name="description" content="Master chemistry through AI-driven learning" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-primary mb-4">
                  Welcome, {userProfile?.firstName || "Learner"}! 🧪
                </h1>
                <p className="text-xl text-charcoal mb-4">
                  Ready to master chemistry through AI-driven learning?
                </p>
                <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
                  <p className="text-gray-700">
                    <strong>Account:</strong> {user?.email || "Unknown"}
                  </p>
                  <p className="text-gray-700 mt-1">
                    <strong>FREE ACCESS</strong> - Complete all levels at your own pace!
                  </p>
                </div>
              </div>

              {userIsAdmin && (
                <button
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="bg-accent text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition"
                >
                  {showAdminPanel ? "Hide" : "Show"} Admin Panel
                </button>
              )}
            </div>
          </div>

          {/* Admin Panel */}
          {showAdminPanel && userIsAdmin && (
            <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-lg shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-charcoal mb-4">🛠️ Admin Panel</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button className="bg-primary text-white px-4 py-3 rounded font-semibold hover:bg-blue-700 transition">
                  Manage Content
                </button>
                <button className="bg-primary text-white px-4 py-3 rounded font-semibold hover:bg-blue-700 transition">
                  Generate AI Lessons
                </button>
                <button className="bg-primary text-white px-4 py-3 rounded font-semibold hover:bg-blue-700 transition">
                  Create Quizzes
                </button>
                <button className="bg-primary text-white px-4 py-3 rounded font-semibold hover:bg-blue-700 transition">
                  Generate Tests
                </button>
                <button className="bg-primary text-white px-4 py-3 rounded font-semibold hover:bg-blue-700 transition">
                  View Analytics
                </button>
                <button className="bg-primary text-white px-4 py-3 rounded font-semibold hover:bg-blue-700 transition">
                  User Management
                </button>
              </div>
            </div>
          )}

          {/* Level Selector */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-primary mb-6">Select Your Level</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {CHEMISTRY_CURRICULUM.levels.map((level, index) => {
                const progress = calculateProgress(level);
                return (
                  <div
                    key={level.id}
                    onClick={() => {
                      setSelectedLevel(index);
                      setSelectedModule(null);
                    }}
                    className={`p-6 rounded-2xl cursor-pointer transition transform hover:scale-105 ${
                      selectedLevel === index
                        ? "bg-gradient-to-br from-primary to-blue-600 text-white shadow-xl"
                        : "bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 hover:border-primary"
                    }`}
                  >
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">
                        {index === 0 ? "🔬" : index === 1 ? "⚗️" : "🧬"}
                      </div>
                      <h3
                        className={`text-2xl font-bold mb-2 ${selectedLevel === index ? "text-white" : "text-primary"}`}
                      >
                        {level.name}
                      </h3>
                      <p
                        className={`text-sm ${selectedLevel === index ? "text-blue-100" : "text-gray-600"}`}
                      >
                        {level.description}
                      </p>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span
                          className={selectedLevel === index ? "text-blue-100" : "text-gray-600"}
                        >
                          Progress
                        </span>
                        <span
                          className={`font-bold ${selectedLevel === index ? "text-white" : "text-primary"}`}
                        >
                          {progress}%
                        </span>
                      </div>
                      <div
                        className={`w-full h-3 rounded-full ${selectedLevel === index ? "bg-blue-200" : "bg-gray-200"}`}
                      >
                        <div
                          className={`h-3 rounded-full ${selectedLevel === index ? "bg-white" : "bg-primary"}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div
                      className={`mt-4 text-center text-sm ${selectedLevel === index ? "text-blue-100" : "text-gray-600"}`}
                    >
                      {level.modules.length} Modules
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modules Grid */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-primary mb-6">{currentLevel.name} - Modules</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentLevel.modules.map((module, modIndex) => {
                const completedLessons = module.lessons.filter((l) => l.completed).length;
                const moduleProgress = Math.round((completedLessons / module.lessons.length) * 100);

                return (
                  <div
                    key={module.id}
                    onClick={() => setSelectedModule(selectedModule === modIndex ? null : modIndex)}
                    className={`p-6 rounded-xl cursor-pointer transition transform hover:scale-105 ${
                      selectedModule === modIndex
                        ? "bg-gradient-to-br from-accent to-purple-600 text-white shadow-xl"
                        : "bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 hover:border-accent"
                    }`}
                  >
                    <h3
                      className={`text-xl font-bold mb-3 ${selectedModule === modIndex ? "text-white" : "text-primary"}`}
                    >
                      Module {modIndex + 1}: {module.name}
                    </h3>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span
                          className={
                            selectedModule === modIndex ? "text-purple-100" : "text-gray-600"
                          }
                        >
                          {completedLessons}/{module.lessons.length} Lessons
                        </span>
                        <span
                          className={`font-bold ${selectedModule === modIndex ? "text-white" : "text-accent"}`}
                        >
                          {moduleProgress}%
                        </span>
                      </div>
                      <div
                        className={`w-full h-2 rounded-full ${selectedModule === modIndex ? "bg-purple-200" : "bg-gray-200"}`}
                      >
                        <div
                          className={`h-2 rounded-full ${selectedModule === modIndex ? "bg-white" : "bg-accent"}`}
                          style={{ width: `${moduleProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    {module.testAvailable && (
                      <div
                        className={`text-sm ${selectedModule === modIndex ? "text-purple-100" : "text-gray-600"}`}
                      >
                        ✓ Test Available
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lessons List */}
          {selectedModule !== null && (
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold text-primary mb-6">
                {currentLevel.modules[selectedModule].name} - Lessons
              </h2>
              <div className="space-y-4">
                {currentLevel.modules[selectedModule].lessons.map((lesson, lesIndex) => (
                  <div
                    key={lesson.id}
                    className={`p-4 rounded-lg border-2 transition ${
                      lesson.completed
                        ? "bg-green-50 border-green-400"
                        : "bg-gray-50 border-gray-300 hover:border-primary"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`text-2xl mr-4 ${lesson.completed ? "✅" : "📝"}`}>
                          {lesson.completed ? "✅" : "📝"}
                        </span>
                        <div>
                          <h4 className="text-lg font-bold text-charcoal">
                            Lesson {lesIndex + 1}: {lesson.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            AI-generated content • Interactive learning
                          </p>
                        </div>
                      </div>
                      <button
                        className={`px-6 py-2 rounded font-semibold transition ${
                          lesson.completed
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-primary text-white hover:bg-blue-700"
                        }`}
                      >
                        {lesson.completed ? "Review" : "Start Lesson"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {currentLevel.modules[selectedModule].testAvailable && (
                <div className="mt-8 p-6 bg-gradient-to-r from-accent to-purple-600 text-white rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">Module Test</h3>
                  <p className="mb-4">
                    Test your knowledge of {currentLevel.modules[selectedModule].name} with an
                    AI-generated assessment.
                  </p>
                  <button className="bg-white text-accent px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
                    Take Module Test
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default function Learn() {
  return (
    <UserProtectedRoute>
      <LearnContent />
    </UserProtectedRoute>
  );
}
