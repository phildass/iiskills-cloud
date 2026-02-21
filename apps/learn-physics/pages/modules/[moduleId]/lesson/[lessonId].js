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
      <h2>Module ${modId}, Lesson ${lessId}: Foundations of Physics</h2>

      <h3>Introduction</h3>
      <p>Physics is the most fundamental of the natural sciences. It seeks to understand the basic laws governing matter, energy, space, and time — the very fabric of reality. From the subatomic world of quarks and leptons to the cosmological scale of galaxies and black holes, physics provides the language and tools to describe, predict, and ultimately harness the behaviour of the universe.</p>
      <p>Every technology you use today has physics at its core. The smartphone in your pocket relies on quantum mechanics (semiconductor physics), electromagnetism (wireless transmission), and materials science (glass, silicon). The car you drive uses classical mechanics, thermodynamics, and fluid dynamics. Even the food you eat was grown using physics principles — from solar energy conversion by photosynthesis to the engineering of irrigation systems and agricultural machinery.</p>
      <p>This lesson introduces four grand domains of classical physics: mechanics, thermodynamics, electromagnetism, and waves. These domains represent centuries of human discovery and remain as relevant today as when they were first articulated.</p>

      <h3>Key Concepts</h3>
      <h4>1. Mechanics: Forces, Motion, and Energy</h4>
      <p>Classical mechanics, built on Newton's three laws, describes how objects move under the influence of forces. <strong>Newton's First Law</strong> (Law of Inertia) states that an object remains at rest or in uniform motion unless acted upon by an external net force. This elegant law explains why you slide forward when a car brakes suddenly, and why satellites can orbit without any fuel once in motion.</p>
      <p><strong>Newton's Second Law</strong> quantifies this: F = ma (Force = mass × acceleration). If you double the force on an object of fixed mass, you double its acceleration. This relationship is used in every engineering calculation involving loads and dynamics. <strong>Newton's Third Law</strong> states that for every action there is an equal and opposite reaction — the principle behind jet propulsion, rocket launches, and even walking (you push backward on the ground; the ground pushes you forward).</p>
      <p>Energy is the capacity to do work. Kinetic energy (KE = ½mv²) is the energy of motion; potential energy is stored energy (gravitational PE = mgh). The conservation of energy principle states that the total energy in an isolated system remains constant — it transforms from one form to another but is never created or destroyed. This is one of the most powerful and widely applied principles in all of science.</p>

      <h4>2. Thermodynamics: Heat, Temperature, and Entropy</h4>
      <p>Thermodynamics studies energy in the form of heat and its transformations. The <strong>First Law of Thermodynamics</strong> is the energy conservation law applied to thermal systems: the change in internal energy of a system equals heat added minus work done by the system. This law governs the efficiency of every heat engine — from steam turbines to car engines to jet engines.</p>
      <p>The <strong>Second Law of Thermodynamics</strong> introduces entropy — a measure of disorder or randomness in a system. The law states that the total entropy of an isolated system can never decrease over time. This has profound implications: it explains why heat spontaneously flows from hot to cold (never the reverse), why perpetual motion machines are impossible, and why the universe tends toward increasing disorder. The concept of entropy is also fundamental to information theory, statistical mechanics, and even biology.</p>
      <p>The <strong>Third Law</strong> states that as a system approaches absolute zero temperature (0 Kelvin, -273.15°C), its entropy approaches a minimum. This places a physical limit on how cold anything can get and has implications for quantum computing and low-temperature physics research.</p>

      <h4>3. Electromagnetism: Electric and Magnetic Fields</h4>
      <p>Electricity and magnetism were unified by James Clerk Maxwell in the 19th century into a single theory described by four differential equations (Maxwell's equations). These equations showed that electric and magnetic fields are two aspects of a single electromagnetic field, and that oscillating electromagnetic fields propagate through space as waves — light itself being an electromagnetic wave.</p>
      <p>Coulomb's Law describes the force between electric charges: like charges repel, opposite charges attract, with force inversely proportional to the square of distance. Ohm's Law (V = IR) relates voltage, current, and resistance in electrical circuits — the foundation of all electronics. Faraday's Law of Induction explains how changing magnetic fields induce electric currents — the principle behind electric generators and transformers that power the electricity grid.</p>

      <h4>4. Waves: Oscillations and Wave Phenomena</h4>
      <p>A wave is a disturbance that transfers energy through a medium (or through vacuum, in the case of electromagnetic waves) without transferring matter. Waves are characterised by amplitude (maximum displacement), wavelength (distance between peaks), frequency (oscillations per second), and speed (wavelength × frequency). Sound waves are longitudinal mechanical waves; ocean waves are transverse mechanical waves; light is a transverse electromagnetic wave.</p>
      <p>Wave phenomena include reflection (bouncing off surfaces), refraction (bending when passing between media of different density), diffraction (bending around obstacles), and interference (waves combining to reinforce or cancel each other). Destructive interference — the principle by which noise-cancelling headphones work — is a remarkable example of waves being used to eliminate other waves. The double-slit experiment, in which particles such as electrons produce interference patterns, was one of the pivotal demonstrations of wave-particle duality and the quantum nature of matter.</p>

      <h3>Practical Applications</h3>
      <p><strong>Engineering Design:</strong> Structural engineers use mechanics to calculate loads, stresses, and deflections in bridges and buildings. Mechanical engineers apply thermodynamics to design efficient engines and HVAC systems. Electrical engineers rely on electromagnetic theory to design circuits, antennas, and power systems.</p>
      <p><strong>Medical Technology:</strong> MRI machines use nuclear magnetic resonance (quantum mechanics + electromagnetism). Ultrasound imaging uses high-frequency sound waves and their reflections. X-rays and CT scans use high-energy electromagnetic radiation. Laser surgery uses the principles of stimulated emission developed from quantum mechanics.</p>
      <p><strong>Renewable Energy:</strong> Solar panels convert photons (light) directly into electricity via the photoelectric effect — a quantum mechanical phenomenon that Einstein explained in 1905. Wind turbines convert kinetic energy of wind into electrical energy. Understanding the physics of energy conversion is essential for designing and optimising clean energy systems.</p>
      <p><strong>Modern Computing:</strong> Transistors — the building blocks of every computer chip — operate based on semiconductor physics and quantum tunnelling. Moore's Law has driven decades of computing progress, but as transistors approach atomic scales, quantum effects become dominant, driving interest in quantum computing as the next paradigm.</p>

      <h3>Summary</h3>
      <p>Physics is the foundation upon which all other natural sciences and much of engineering is built. In this lesson you have covered: classical mechanics and Newton's laws of motion; the three laws of thermodynamics and the concept of entropy; the unification of electricity and magnetism through Maxwell's equations; and the properties and phenomena of wave motion.</p>
      <p>These classical physics concepts explain the vast majority of everyday phenomena and remain indispensable even as modern physics (quantum mechanics and relativity) has extended our understanding to extreme scales. As you progress through this course, you will develop both the conceptual understanding and the quantitative problem-solving skills to apply these ideas with confidence — whether your goal is an engineering career, scientific research, or simply a deeper appreciation of the physical world you inhabit.</p>
    `;
  };

  const generateQuiz = () => {
    return [
      {
        question: "What is Newton's First Law of Motion?",
        options: [
          "Force equals mass times acceleration",
          "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force",
          "For every action there is an equal and opposite reaction",
          "Energy can neither be created nor destroyed"
        ],
        correct_answer: 1
      },
      {
        question: "What is the SI unit of force?",
        options: [
          "Joule",
          "Watt",
          "Newton",
          "Pascal"
        ],
        correct_answer: 2
      },
      {
        question: "What does the Law of Conservation of Energy state?",
        options: [
          "Energy is always lost as heat",
          "Energy can be created from nothing",
          "The total energy of an isolated system remains constant",
          "Kinetic energy always exceeds potential energy"
        ],
        correct_answer: 2
      },
      {
        question: "What is the relationship between frequency and wavelength of a wave?",
        options: [
          "They are directly proportional",
          "They are inversely proportional",
          "They have no relationship",
          "They are always equal"
        ],
        correct_answer: 1
      },
      {
        question: "What is the formula for kinetic energy?",
        options: [
          "KE = mgh",
          "KE = Fd",
          "KE = ½mv²",
          "KE = mc²"
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
        <title>{lesson?.title} - Learn Physics</title>
        <meta name="description" content={`Learn Physics - Module ${moduleId}, Lesson ${lessonId}`} />
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
