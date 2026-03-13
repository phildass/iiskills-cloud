"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import ModuleFinalTestComponent from "../../../components/ModuleFinalTestComponent";
import { getCurrentUser } from "../../../lib/supabaseClient";

const APP_KEY = "learn-chemistry";
const APP_DISPLAY = "Learn Chemistry";
const NO_BADGES_KEY = "learn-chemistry-noBadges";

// Per-module final test question bank — 20 real questions per module
const FINAL_TEST_QUESTIONS = {
  1: [
    { question: "What is chemistry?", options: ["The study of living organisms", "The scientific study of the composition, structure, properties, and reactions of matter", "The study of forces and motion", "The study of Earth's geological layers"], correct_answer: 1 },
    { question: "What is the smallest unit of a chemical element that retains its chemical properties?", options: ["Molecule", "Compound", "Atom", "Ion"], correct_answer: 2 },
    { question: "What does the atomic number of an element represent?", options: ["The number of neutrons in the nucleus", "The number of protons in the nucleus", "The mass of an atom", "The number of electrons in the outer shell"], correct_answer: 1 },
    { question: "What is the periodic table?", options: ["A calendar of chemistry experiments", "An organised arrangement of all known elements in order of increasing atomic number", "A list of all chemical reactions", "A table of molecular weights"], correct_answer: 1 },
    { question: "What is a compound?", options: ["A mixture of elements that can be separated physically", "A substance made from two or more different elements chemically bonded in a fixed ratio", "A single element in its pure form", "A solution of dissolved substances"], correct_answer: 1 },
    { question: "What is a mixture?", options: ["A substance with a fixed chemical formula", "Two or more substances physically combined but not chemically bonded, retaining individual properties", "An element that contains more than one isotope", "A compound dissolved in a solvent"], correct_answer: 1 },
    { question: "What are the three states of matter?", options: ["Element, compound, and mixture", "Solid, liquid, and gas", "Ionic, covalent, and metallic", "Atom, molecule, and ion"], correct_answer: 1 },
    { question: "What is the Law of Conservation of Mass?", options: ["Energy cannot be created or destroyed", "In a chemical reaction, the total mass of reactants equals the total mass of products", "Every action has an equal and opposite reaction", "Mass decreases during exothermic reactions"], correct_answer: 1 },
    { question: "What is an isotope?", options: ["An atom with a different number of protons than a neutral atom", "An atom of the same element with the same number of protons but a different number of neutrons", "A molecule with the same formula but different structure", "A radioactive form of any element"], correct_answer: 1 },
    { question: "What is the difference between a physical change and a chemical change?", options: ["There is no difference", "A physical change alters form without changing chemical composition; a chemical change produces a new substance", "A physical change is permanent; a chemical change is reversible", "A chemical change changes colour; a physical change does not"], correct_answer: 1 },
    { question: "What is the pH scale used to measure?", options: ["The boiling point of a solution", "The concentration of hydrogen ions — the acidity or alkalinity of a solution", "The electrical conductivity of a solution", "The density of a liquid"], correct_answer: 1 },
    { question: "What is a neutral pH value?", options: ["0", "7", "14", "1"], correct_answer: 1 },
    { question: "Which group in the periodic table contains the noble gases?", options: ["Group 1", "Group 7 (or 17)", "Group 8 (or 18)", "Group 2"], correct_answer: 2 },
    { question: "What are metals generally characterised by?", options: ["Poor conductivity of heat and electricity", "High electrical and thermal conductivity, malleability, and ductility", "Being brittle and transparent", "Being gases at room temperature"], correct_answer: 1 },
    { question: "What is Avogadro's number?", options: ["6.022 × 10²³ — the number of particles in one mole of a substance", "The number of electrons in the outer shell of a noble gas", "The speed of light in a vacuum", "The universal gas constant"], correct_answer: 0 },
    { question: "What are halogens?", options: ["Metals in Group 2 of the periodic table", "Highly reactive non-metals in Group 7 (17) including fluorine, chlorine, and bromine", "Radioactive elements at the bottom of the periodic table", "Noble gases with full outer shells"], correct_answer: 1 },
    { question: "What does the mass number of an atom represent?", options: ["The number of protons only", "The total number of protons and neutrons in the nucleus", "The number of electrons", "The atomic weight in grams"], correct_answer: 1 },
    { question: "What is the difference between an element and a compound?", options: ["An element is made of molecules; a compound is made of atoms", "An element contains only one type of atom; a compound contains two or more different elements chemically bonded", "An element can be separated physically; a compound cannot", "An element is always a solid; a compound is always a liquid"], correct_answer: 1 },
    { question: "What is the difference between ionic and covalent compounds?", options: ["They are the same type of compound", "Ionic compounds form between metals and non-metals via electron transfer; covalent compounds form between non-metals via electron sharing", "Covalent compounds always contain oxygen; ionic compounds do not", "Ionic compounds are always liquids; covalent compounds are always gases"], correct_answer: 1 },
    { question: "What is a chemical element?", options: ["A substance made of two or more different atoms bonded together", "A pure substance consisting of only one type of atom, which cannot be broken down by chemical means", "A mixture of two pure substances", "A compound with a fixed molecular formula"], correct_answer: 1 },
  ],
  2: [
    { question: "What are the three subatomic particles and their charges?", options: ["Proton (+), neutron (0), electron (−)", "Proton (+), electron (+), neutron (0)", "Proton (−), neutron (0), electron (+)", "Proton (0), neutron (+), electron (−)"], correct_answer: 0 },
    { question: "Where are protons and neutrons located in an atom?", options: ["In the electron cloud surrounding the nucleus", "In the nucleus at the centre of the atom", "In the outermost shell of the atom", "Equally distributed throughout the atom"], correct_answer: 1 },
    { question: "What is the Bohr model of the atom?", options: ["A model showing electrons as a cloud of probability", "A model with electrons orbiting the nucleus in fixed energy levels (shells)", "A model with electrons embedded in a positive sphere", "A quantum mechanical model of the atom"], correct_answer: 1 },
    { question: "How many electrons can the first shell of an atom hold?", options: ["8", "18", "2", "4"], correct_answer: 2 },
    { question: "What is the electron configuration of a carbon atom (atomic number 6)?", options: ["2, 4", "2, 6", "1, 5", "3, 3"], correct_answer: 0 },
    { question: "What is an atomic orbital?", options: ["The fixed circular path of an electron", "A region of space where there is a high probability of finding an electron", "The nucleus of an atom", "The outermost electron shell"], correct_answer: 1 },
    { question: "What are the four types of atomic orbitals?", options: ["s, p, d, f", "a, b, c, d", "1, 2, 3, 4", "alpha, beta, gamma, delta"], correct_answer: 0 },
    { question: "What is Rutherford's gold foil experiment famous for?", options: ["Discovering the electron", "Demonstrating that the atom has a tiny, dense, positively charged nucleus", "Proving that atoms are solid spheres", "Discovering radioactivity"], correct_answer: 1 },
    { question: "What is the Pauli Exclusion Principle?", options: ["No two electrons in the same atom can have the same four quantum numbers", "Electrons fill orbitals of the same energy individually before pairing", "Electrons are attracted to the nucleus by Coulombic forces", "Atoms seek to have a full outer shell of electrons"], correct_answer: 0 },
    { question: "What is Hund's Rule?", options: ["Electrons fill the lowest energy orbitals first", "Electrons occupy degenerate orbitals singly before pairing, with parallel spins", "The maximum number of electrons per shell is 2n²", "No two electrons can have the same quantum numbers"], correct_answer: 1 },
    { question: "What is the Aufbau principle?", options: ["Electrons fill the highest energy orbitals first", "Electrons fill available orbitals in order of increasing energy", "Electrons in the same orbital must have opposite spins", "Each orbital can hold a maximum of two electrons"], correct_answer: 1 },
    { question: "What is electronegativity?", options: ["The tendency of an atom to lose electrons", "The measure of an atom's ability to attract electrons in a chemical bond toward itself", "The charge on an atom after ionisation", "The energy required to remove an electron from an atom"], correct_answer: 1 },
    { question: "What is ionisation energy?", options: ["The energy released when an atom forms an ion", "The energy required to remove the outermost electron from a gaseous atom", "The energy of an electron in its ground state", "The energy holding protons and neutrons together in the nucleus"], correct_answer: 1 },
    { question: "What is a cation?", options: ["A negatively charged ion formed by gaining electrons", "A positively charged ion formed by losing electrons", "A neutral atom with extra neutrons", "An atom with an unpaired electron"], correct_answer: 1 },
    { question: "What is an anion?", options: ["A positively charged ion", "A negatively charged ion formed by gaining electrons", "An atom with a full outer shell", "A neutral particle in the nucleus"], correct_answer: 1 },
    { question: "What does the term 'valence electrons' mean?", options: ["Electrons in the innermost shell of an atom", "Electrons in the outermost shell of an atom that participate in chemical bonding", "Electrons shared between two atoms in a covalent bond", "All electrons surrounding the nucleus"], correct_answer: 1 },
    { question: "What is a spectral line?", options: ["Lines on pH paper indicating acidity", "Specific wavelengths of light emitted or absorbed by electrons moving between energy levels in an atom", "Lines in a chromatography experiment", "The colour of a flame produced by burning a compound"], correct_answer: 1 },
    { question: "What is nuclear binding energy?", options: ["The energy released when atoms form molecules", "The energy holding protons and neutrons together in the nucleus, equivalent to the mass defect via E=mc²", "The energy required to ionise an atom", "The energy of electrons in the ground state"], correct_answer: 1 },
    { question: "What is a quantum number?", options: ["A number describing the position of an element in the periodic table", "One of four numbers (n, l, mₗ, mₛ) that uniquely describe the quantum state of an electron in an atom", "The number of neutrons in an atom", "The number of valence electrons"], correct_answer: 1 },
    { question: "What is the quantum mechanical model of the atom?", options: ["The Bohr model with updated energy levels", "A model describing electron positions as probability distributions in orbitals, based on quantum mechanics", "A model proposed by Rutherford after gold foil experiments", "A model with electrons in fixed circular orbits"], correct_answer: 1 },
  ],
  3: [
    { question: "What is a chemical bond?", options: ["The colour change during a chemical reaction", "A force of attraction holding two or more atoms together to form a molecule or compound", "A physical interaction between atoms that does not change their composition", "The energy released during a chemical reaction"], correct_answer: 1 },
    { question: "What is an ionic bond?", options: ["A bond formed by sharing electrons between two non-metals", "A bond formed by the electrostatic attraction between oppositely charged ions after electron transfer from metal to non-metal", "A weak attraction between molecules", "A triple bond between carbon atoms"], correct_answer: 1 },
    { question: "What is a covalent bond?", options: ["A bond formed by electron transfer between a metal and non-metal", "A bond formed by two atoms sharing one or more pairs of electrons", "A metallic bond in transition metals", "A bond between ions in a crystal lattice"], correct_answer: 1 },
    { question: "What is a metallic bond?", options: ["A covalent bond between two metal atoms", "A bond formed by a 'sea' of delocalised electrons surrounding positive metal ions", "An ionic bond between two metals", "A hydrogen bond between metal atoms"], correct_answer: 1 },
    { question: "What is a polar covalent bond?", options: ["A bond between atoms of exactly equal electronegativity", "A covalent bond where electrons are shared unequally due to a difference in electronegativity, creating partial charges", "A bond that only occurs at the poles of a magnet", "A type of ionic bond"], correct_answer: 1 },
    { question: "What is VSEPR theory used for?", options: ["Predicting the colour of compounds", "Predicting the 3D shape of molecules based on the repulsion between electron pairs around the central atom", "Calculating bond energies", "Determining the melting point of ionic compounds"], correct_answer: 1 },
    { question: "What is the shape of a water molecule (H₂O)?", options: ["Linear", "Trigonal planar", "Tetrahedral", "Bent (V-shaped)"], correct_answer: 3 },
    { question: "What is the shape of a carbon dioxide molecule (CO₂)?", options: ["Bent", "Linear", "Trigonal planar", "Tetrahedral"], correct_answer: 1 },
    { question: "What is a hydrogen bond?", options: ["A covalent bond in hydrogen gas", "A relatively strong intermolecular attraction between a hydrogen atom bonded to N, O, or F and a lone pair on another electronegative atom", "An ionic bond involving hydrogen", "A bond formed when hydrogen loses its electron"], correct_answer: 1 },
    { question: "What are van der Waals forces?", options: ["The strong forces holding atoms together in a covalent bond", "Weak intermolecular forces including London dispersion forces and dipole-dipole interactions", "Forces between ions in an ionic lattice", "Forces between protons in a nucleus"], correct_answer: 1 },
    { question: "What is the octet rule?", options: ["Atoms always bond in groups of eight", "Atoms tend to gain, lose, or share electrons to achieve a full outer shell of eight electrons", "The maximum number of bonds any atom can form is eight", "Elements in Period 8 have the most stable configuration"], correct_answer: 1 },
    { question: "What is sp³ hybridisation?", options: ["Hybridisation producing two hybrid orbitals with linear geometry", "Hybridisation of one s and three p orbitals producing four equivalent orbitals; associated with tetrahedral geometry", "Hybridisation producing three orbitals with trigonal planar geometry", "A type of hybridisation in benzene"], correct_answer: 1 },
    { question: "What is a network covalent solid?", options: ["A solid with discrete covalent molecules held by van der Waals forces", "A solid where atoms are covalently bonded throughout in a continuous 3D network, such as diamond or quartz", "An ionic solid in crystal lattice form", "A metallic solid with delocalised electrons"], correct_answer: 1 },
    { question: "What determines the strength of an ionic bond?", options: ["The number of covalent bonds involved", "The size and charge of the ions — higher charge and smaller ions produce stronger ionic bonds", "The temperature at which the compound forms", "The colour of the compound"], correct_answer: 1 },
    { question: "What is a coordinate (dative covalent) bond?", options: ["A bond where electrons are transferred from one atom to another", "A covalent bond where both electrons in the shared pair are donated by the same atom", "A bond between two atoms of identical electronegativity", "A bond formed at high temperature only"], correct_answer: 1 },
    { question: "Why do noble gases generally not form chemical bonds?", options: ["They are too small to bond with other atoms", "They have a full outer electron shell and very high ionisation energy, making them extremely unreactive", "They have too many protons", "Their electrons move too fast to form bonds"], correct_answer: 1 },
    { question: "What is a sigma (σ) bond?", options: ["A bond formed by the side-on overlap of p orbitals", "A bond formed by the head-on overlap of orbitals along the bond axis; the first bond formed between atoms", "A bond only found in aromatic compounds", "A bond requiring three pairs of shared electrons"], correct_answer: 1 },
    { question: "What is a pi (π) bond?", options: ["The first bond formed between two atoms", "A bond formed by side-on overlap of p orbitals, found in double and triple bonds in addition to a sigma bond", "A bond only in benzene rings", "A single bond between non-metals"], correct_answer: 1 },
    { question: "What property of metals is explained by the delocalised electron model?", options: ["Their high melting points only", "Their electrical conductivity, thermal conductivity, malleability, and lustre", "Their tendency to form covalent bonds", "Their reactivity with water"], correct_answer: 1 },
    { question: "What is hybridisation in chemical bonding?", options: ["Mixing different compounds together", "The mixing of atomic orbitals on a central atom to form new hybrid orbitals for bonding", "The process of forming ionic compounds", "A type of covalent bond in organic chemistry"], correct_answer: 1 },
  ],
  4: [
    { question: "What is the kinetic molecular theory of gases?", options: ["Gas molecules are stationary and evenly distributed", "Gas molecules are in constant random motion; collisions are elastic; intermolecular forces are negligible", "Gas molecules attract each other strongly", "All gases condense at the same temperature"], correct_answer: 1 },
    { question: "What is Boyle's Law?", options: ["At constant temperature, the volume of a gas is directly proportional to pressure", "At constant temperature, the volume of a gas is inversely proportional to pressure (P₁V₁ = P₂V₂)", "At constant pressure, volume is inversely proportional to temperature", "The pressure of a gas mixture equals the sum of partial pressures"], correct_answer: 1 },
    { question: "What is Charles's Law?", options: ["At constant pressure, the volume of a gas is inversely proportional to temperature", "At constant pressure, the volume of a gas is directly proportional to absolute temperature (V/T = constant)", "At constant temperature, pressure and volume are inversely proportional", "Gas pressure depends on the number of collisions with container walls"], correct_answer: 1 },
    { question: "What is the ideal gas law?", options: ["PV = nRT, where P is pressure, V is volume, n is moles, R is the gas constant, and T is absolute temperature", "PV = RT for one mole of any gas", "P₁V₁ = P₂V₂ at constant temperature", "P/T = constant at fixed volume"], correct_answer: 0 },
    { question: "What is Dalton's Law of Partial Pressures?", options: ["The pressure of a gas is proportional to its temperature", "The total pressure of a gas mixture equals the sum of the partial pressures of each component gas", "Equal volumes of gases at the same temperature contain equal numbers of molecules", "The volume of a gas is independent of temperature"], correct_answer: 1 },
    { question: "What is vapour pressure?", options: ["The atmospheric pressure above a liquid", "The pressure exerted by the vapour of a liquid in equilibrium with its liquid phase at a given temperature", "The pressure needed to convert a gas to a liquid", "The pressure inside a gas cylinder"], correct_answer: 1 },
    { question: "What is the normal boiling point of a substance?", options: ["The temperature at which a substance melts at 1 atm", "The temperature at which the vapour pressure of the liquid equals 1 atm (standard atmospheric pressure)", "The temperature at which all intermolecular forces break down", "The highest temperature at which a liquid can exist"], correct_answer: 1 },
    { question: "What is a phase diagram?", options: ["A flowchart of chemical reactions", "A graph showing the conditions of temperature and pressure at which a substance exists as solid, liquid, or gas", "A diagram of molecular orbital levels", "A diagram showing electron configurations"], correct_answer: 1 },
    { question: "What is the triple point?", options: ["The temperature at which three isotopes of an element coexist", "The unique combination of temperature and pressure at which all three phases of a substance coexist in equilibrium", "The point at which a solid melts into a liquid", "The highest temperature at which a gas can be liquefied"], correct_answer: 1 },
    { question: "What is sublimation?", options: ["The transition from liquid to gas", "The direct transition from solid to gas without passing through the liquid phase", "The transition from gas to solid", "The dissolving of a solid in a liquid"], correct_answer: 1 },
    { question: "What is viscosity?", options: ["The tendency of a liquid to evaporate", "A measure of a fluid's resistance to flow, caused by intermolecular attractions", "The surface area of a liquid", "The compressibility of a liquid"], correct_answer: 1 },
    { question: "What is surface tension?", options: ["The resistance of a surface to scratching", "The tendency of a liquid surface to contract and minimise surface area due to unequal intermolecular forces at the surface", "The pressure exerted on the walls of a container by liquid", "The energy required to boil a liquid"], correct_answer: 1 },
    { question: "What is a crystal lattice?", options: ["A random arrangement of ions in a solid", "A regular, repeating three-dimensional arrangement of atoms, ions, or molecules in a solid", "A liquid crystal display structure", "A type of polymer chain"], correct_answer: 1 },
    { question: "What is a supercritical fluid?", options: ["A fluid that flows faster than the speed of sound", "A substance above its critical temperature and pressure, exhibiting properties of both liquid and gas", "A very pure liquid with no dissolved gases", "A plasma state of matter"], correct_answer: 1 },
    { question: "How does adding a solute (e.g. salt) affect the boiling point of water?", options: ["It lowers the boiling point", "It has no effect on boiling point", "It raises the boiling point (boiling point elevation)", "It prevents the water from boiling at all"], correct_answer: 2 },
    { question: "What is freezing point depression?", options: ["The lowering of a solution's freezing point compared to the pure solvent, caused by dissolved solute particles", "The increase in melting point due to applied pressure", "The freezing of water at a temperature lower than −10 °C", "The decrease in melting point of metals when alloyed"], correct_answer: 0 },
    { question: "What is an amorphous solid?", options: ["A crystalline solid with a regular lattice", "A solid that lacks a regular repeating structure, such as glass or rubber", "A solid composed of a single element", "A metallic solid"], correct_answer: 1 },
    { question: "What is Henry's Law?", options: ["The solubility of a gas in a liquid is directly proportional to the partial pressure of that gas above the liquid", "The pressure of a gas is inversely proportional to its volume", "The volume of a gas is directly proportional to temperature", "Equal volumes of gases contain equal numbers of molecules"], correct_answer: 0 },
    { question: "What happens to intermolecular forces as a substance changes from gas to liquid?", options: ["They become weaker", "They become stronger as molecules are closer together and attractions become more significant", "They remain the same", "They disappear entirely"], correct_answer: 1 },
    { question: "What is deposition in phase transitions?", options: ["The settling of a solid from a solution", "The direct transition from gas to solid without passing through the liquid phase", "The conversion of liquid to gas", "The freezing of a liquid"], correct_answer: 1 },
  ],
  5: [
    { question: "What is a chemical reaction?", options: ["A physical change in the state of a substance", "A process in which reactants are transformed into new substances (products) with different properties", "The dissolving of one substance in another", "A change in temperature of a substance"], correct_answer: 1 },
    { question: "What is a synthesis (combination) reaction?", options: ["One compound breaking into two or more simpler substances", "Two or more reactants combining to form a single product (A + B → AB)", "One element replacing another in a compound", "Two ionic compounds exchanging ions"], correct_answer: 1 },
    { question: "What is a decomposition reaction?", options: ["A single compound breaking down into two or more simpler products", "Two substances combining to form one product", "Combustion of an organic compound", "A metal reacting with an acid"], correct_answer: 0 },
    { question: "What is a combustion reaction?", options: ["A reaction producing an oxide and water vapour only", "A reaction in which a substance reacts rapidly with oxygen to produce heat and light, typically forming CO₂ and H₂O", "The decomposition of a compound by heat", "A reaction between two metals"], correct_answer: 1 },
    { question: "What is an oxidation-reduction (redox) reaction?", options: ["A reaction involving only acids and bases", "A reaction in which electrons are transferred from one species to another", "A reaction producing a precipitate", "A reaction involving noble gases"], correct_answer: 1 },
    { question: "What is oxidation in terms of electrons?", options: ["Gaining electrons", "Losing electrons (OIL — Oxidation Is Loss)", "Gaining protons", "Losing neutrons"], correct_answer: 1 },
    { question: "What is reduction in terms of electrons?", options: ["Losing electrons", "Gaining electrons (RIG — Reduction Is Gain)", "Losing protons", "Gaining neutrons"], correct_answer: 1 },
    { question: "What is a precipitation reaction?", options: ["A reaction that releases a gas", "A reaction in which two aqueous solutions react to form an insoluble solid (precipitate)", "A reaction between an acid and a base", "A reaction involving evaporation"], correct_answer: 1 },
    { question: "What is a neutralisation reaction?", options: ["A redox reaction between metals", "A reaction between an acid and a base to produce water and a salt", "A reaction producing a precipitate", "A reaction that absorbs heat"], correct_answer: 1 },
    { question: "What is the purpose of balancing a chemical equation?", options: ["To make the equation look symmetrical", "To ensure the number of atoms of each element is equal on both sides, satisfying the Law of Conservation of Mass", "To make the coefficients as large as possible", "To show which reaction is faster"], correct_answer: 1 },
    { question: "What is a catalyst?", options: ["A reactant consumed during a chemical reaction", "A substance that increases the rate of a chemical reaction without being permanently changed or consumed", "A product formed in a side reaction", "A substance that starts an endothermic reaction"], correct_answer: 1 },
    { question: "What is activation energy?", options: ["The energy released by a chemical reaction", "The minimum energy required for reactants to overcome the energy barrier and undergo a chemical reaction", "The energy stored in chemical bonds", "The heat absorbed from the surroundings"], correct_answer: 1 },
    { question: "What is an exothermic reaction?", options: ["A reaction that absorbs heat from the surroundings", "A reaction that releases heat energy to the surroundings, resulting in a decrease in enthalpy (ΔH < 0)", "A reaction that requires constant heating to proceed", "A reaction at extremely high temperatures"], correct_answer: 1 },
    { question: "What is an endothermic reaction?", options: ["A reaction that releases heat", "A reaction that absorbs heat energy from the surroundings, increasing the enthalpy of the system (ΔH > 0)", "A reaction that occurs spontaneously at room temperature", "A reaction between two exothermic species"], correct_answer: 1 },
    { question: "What does Le Chatelier's Principle state?", options: ["Equal volumes of gases at the same conditions contain the same number of molecules", "If a stress is applied to a system in equilibrium, the system shifts to counteract that stress and re-establish equilibrium", "The rate of a reaction doubles for every 10 °C rise in temperature", "The pressure of a gas is proportional to temperature"], correct_answer: 1 },
    { question: "What is the oxidation state (number)?", options: ["The charge of an ion in solution", "A hypothetical charge assigned to an atom assuming all bonds are ionic, used to track electron transfer in redox reactions", "The number of electrons in the outermost shell", "The position of an element in the periodic table"], correct_answer: 1 },
    { question: "What is a reducing agent?", options: ["A substance that gains electrons and is oxidised", "A substance that donates electrons to another species, causing it to be reduced while itself being oxidised", "A substance that removes oxygen from a compound", "An acid that reduces pH"], correct_answer: 1 },
    { question: "What is a double displacement (metathesis) reaction?", options: ["A reaction where one element replaces another in a compound", "A reaction where the cations and anions of two ionic compounds switch partners to form two new compounds", "Two atoms combining to form a diatomic molecule", "An organic synthesis reaction"], correct_answer: 1 },
    { question: "What does the symbol Δ above a reaction arrow typically indicate?", options: ["A catalyst is used", "Heat is applied to the reaction", "The reaction is fast", "A pressure change is required"], correct_answer: 1 },
    { question: "What are the main types of chemical reactions?", options: ["Hot, cold, and neutral reactions", "Synthesis, decomposition, single displacement, double displacement, and combustion", "Ionic, covalent, and metallic reactions", "Exothermic, endothermic, and thermoneutral reactions"], correct_answer: 1 },
  ],
  6: [
    { question: "What is stoichiometry?", options: ["The study of atomic structure", "The quantitative relationship between reactants and products in a chemical reaction, based on balanced equations", "The study of chemical reaction rates", "A method for measuring temperature changes in reactions"], correct_answer: 1 },
    { question: "What is a mole in chemistry?", options: ["A small burrowing animal used as a chemistry mascot", "The SI unit of amount of substance, equal to 6.022 × 10²³ particles of a substance", "The mass of one atom in grams", "A measure of concentration in solution"], correct_answer: 1 },
    { question: "What is molar mass?", options: ["The number of moles in a kilogram of substance", "The mass in grams of one mole of a substance, numerically equal to its relative formula mass", "The density of a substance per mole", "The volume of one mole of any substance"], correct_answer: 1 },
    { question: "How do you calculate the number of moles from mass?", options: ["Moles = mass × molar mass", "Moles = mass ÷ molar mass", "Moles = molar mass ÷ mass", "Moles = mass × Avogadro's number"], correct_answer: 1 },
    { question: "What is the limiting reagent in a chemical reaction?", options: ["The reagent in the greatest quantity", "The reactant that is completely consumed first, determining the maximum amount of product that can be formed", "The most expensive chemical in the reaction", "The reagent added last to the reaction mixture"], correct_answer: 1 },
    { question: "What is the theoretical yield?", options: ["The actual amount of product obtained in a lab experiment", "The maximum amount of product calculated from stoichiometry, assuming complete conversion of the limiting reagent", "The minimum amount of reactants needed", "The yield reported in a scientific paper"], correct_answer: 1 },
    { question: "How is percentage yield calculated?", options: ["(Actual yield ÷ theoretical yield) × 100%", "(Theoretical yield ÷ actual yield) × 100%", "(Actual yield − theoretical yield) × 100%", "Actual yield × molar mass × 100%"], correct_answer: 0 },
    { question: "What is empirical formula?", options: ["The formula showing the exact number of each type of atom in a molecule", "The simplest whole-number ratio of atoms of each element in a compound", "The formula derived from the molecular weight only", "The structural formula showing bonds between atoms"], correct_answer: 1 },
    { question: "What is molecular formula?", options: ["The simplest ratio of atoms in a compound", "The actual number of each type of atom in one molecule of a substance", "The name of a compound based on IUPAC rules", "A formula showing the 3D structure of a molecule"], correct_answer: 1 },
    { question: "What is concentration of a solution expressed in mol/L (molarity)?", options: ["Mass of solute per litre of solution", "Number of moles of solute dissolved per litre of solution", "Mass of solute per gram of solvent", "Volume of solute per litre of solvent"], correct_answer: 1 },
    { question: "What is titration used for?", options: ["Measuring the melting point of a substance", "Determining the unknown concentration of a solution by reacting it with a standard solution of known concentration", "Separating a mixture by boiling point", "Testing the pH of a solution"], correct_answer: 1 },
    { question: "What is the mole ratio?", options: ["The ratio of mass to volume in a reaction", "The ratio of moles of one substance to another as given by the coefficients in a balanced chemical equation", "The ratio of reactants to products by mass", "The proportion of a substance in a mixture"], correct_answer: 1 },
    { question: "What is a standard solution?", options: ["A very dilute solution", "A solution of precisely known concentration, used in titrations and analytical chemistry", "The most common concentration used in a laboratory", "A solution at standard temperature and pressure"], correct_answer: 1 },
    { question: "What is the molar volume of an ideal gas at STP (0 °C, 1 atm)?", options: ["11.2 L/mol", "22.4 L/mol", "24.0 L/mol", "44.8 L/mol"], correct_answer: 1 },
    { question: "What is percentage composition?", options: ["The percentage of a compound that is the limiting reagent", "The mass percentage of each element in a compound, calculated from the formula", "The percentage yield of a reaction", "The proportion of solute in a mixture"], correct_answer: 1 },
    { question: "How many grams are in 2 moles of water (H₂O, molar mass = 18 g/mol)?", options: ["9 g", "18 g", "36 g", "72 g"], correct_answer: 2 },
    { question: "What is the excess reagent?", options: ["The reagent that is completely consumed", "The reactant that remains after the limiting reagent has been completely consumed", "The product in the highest quantity", "A byproduct of the reaction"], correct_answer: 1 },
    { question: "What is gravimetric analysis?", options: ["Measuring gas volumes in a reaction", "An analytical technique that determines the amount of a substance by converting it to a product of known composition and measuring its mass", "Analysing substances using spectroscopy", "Measuring the density of solutions"], correct_answer: 1 },
    { question: "What is the equivalence point in a titration?", options: ["The point at which the indicator changes colour", "The point at which the moles of titrant added exactly equal the moles of analyte — stoichiometric completion of the reaction", "The halfway point in the titration", "The point at which the solution becomes neutral"], correct_answer: 1 },
    { question: "What is the actual yield?", options: ["The calculated theoretical amount of product", "The amount of product actually obtained in a chemical reaction, which is typically less than the theoretical yield", "The amount of excess reagent remaining", "The yield after accounting for safety margins"], correct_answer: 1 },
  ],
  7: [
    { question: "What is organic chemistry?", options: ["The chemistry of living organisms only", "The branch of chemistry studying carbon-containing compounds and their properties, reactions, and synthesis", "The study of naturally occurring minerals", "The chemistry of environmentally friendly substances"], correct_answer: 1 },
    { question: "What makes carbon unique in forming organic compounds?", options: ["Carbon has 8 electrons in its outer shell", "Carbon can form four stable covalent bonds and chain with other carbon atoms to create diverse structures", "Carbon is the lightest element that forms compounds", "Carbon can exist as a positive and negative ion"], correct_answer: 1 },
    { question: "What are hydrocarbons?", options: ["Compounds containing only hydrogen and oxygen", "Organic compounds containing only carbon and hydrogen atoms", "Compounds made entirely of hydrogen", "All carbon-containing compounds"], correct_answer: 1 },
    { question: "What is the difference between alkanes, alkenes, and alkynes?", options: ["They differ in carbon chain length only", "Alkanes have only single C−C bonds; alkenes have at least one C=C double bond; alkynes have at least one C≡C triple bond", "They differ in the number of hydrogen atoms only", "Alkanes are gases; alkenes are liquids; alkynes are solids"], correct_answer: 1 },
    { question: "What is the general formula for alkanes?", options: ["CₙH₂ₙ", "CₙH₂ₙ₋₂", "CₙH₂ₙ₊₂", "CₙHₙ"], correct_answer: 2 },
    { question: "What is an isomer?", options: ["Two compounds with different molecular formulas", "Two or more compounds with the same molecular formula but different structural arrangements", "A polymer made of identical repeating units", "An isotope found in organic compounds"], correct_answer: 1 },
    { question: "What is a functional group?", options: ["A carbon chain in an organic molecule", "A specific atom or group of atoms in an organic molecule responsible for its characteristic chemical reactions", "The longest chain in an organic molecule", "Any atom other than carbon and hydrogen in a molecule"], correct_answer: 1 },
    { question: "What functional group characterises alcohols?", options: ["−COOH (carboxyl group)", "−NH₂ (amino group)", "−OH (hydroxyl group)", "−CHO (aldehyde group)"], correct_answer: 2 },
    { question: "What functional group characterises carboxylic acids?", options: ["−OH", "−COOH (carboxyl group)", "−CO− (ketone group)", "−NH₂"], correct_answer: 1 },
    { question: "What is an ester and how is it formed?", options: ["A compound formed when two alcohols react", "A compound formed by the reaction of a carboxylic acid with an alcohol (esterification), releasing water", "A compound formed from an amine and an acid", "A polymer of glucose units"], correct_answer: 1 },
    { question: "What is addition polymerisation?", options: ["Monomers with double bonds joining together repeatedly without losing any atoms to form a long-chain polymer", "Monomers joining with the release of small molecules such as water", "A type of condensation reaction", "Polymers breaking down into smaller units"], correct_answer: 0 },
    { question: "What is benzene significant for in organic chemistry?", options: ["A simple alkane with six carbons", "A cyclic, aromatic hydrocarbon with a delocalised ring of electrons, representing the archetypal aromatic compound", "A type of alcohol used in industrial processes", "An alkene with a benzene-shaped structure"], correct_answer: 1 },
    { question: "What is a substitution reaction in organic chemistry?", options: ["A reaction where one reactant is substituted for another entirely", "A reaction where an atom or group in a molecule is replaced by another atom or group", "A reaction adding atoms to a double bond", "A reaction removing water from a molecule"], correct_answer: 1 },
    { question: "What is an addition reaction?", options: ["A reaction adding atoms across a double or triple bond, increasing the number of single bonds", "A reaction replacing one atom with another", "A reaction eliminating a small molecule from a substrate", "A reaction forming a ring structure"], correct_answer: 0 },
    { question: "What is saponification?", options: ["The formation of esters from alcohols and acids", "The alkaline hydrolysis of esters (especially fats) to produce glycerol and the salt of a fatty acid (soap)", "The oxidation of alcohols to aldehydes", "The reduction of carboxylic acids to alcohols"], correct_answer: 1 },
    { question: "What is chirality in organic molecules?", options: ["The ability of a compound to absorb light", "The property of a molecule that cannot be superimposed on its mirror image due to a non-symmetric carbon atom", "The ability to rotate plane-polarised light to the right", "The geometry around a carbon-carbon double bond"], correct_answer: 1 },
    { question: "What is an amino acid?", options: ["A compound containing an amine and an acid group on separate molecules", "A bifunctional organic molecule containing both an amine (−NH₂) and a carboxyl (−COOH) group, the building block of proteins", "An amino group attached to a benzene ring", "A fatty acid found in cell membranes"], correct_answer: 1 },
    { question: "What is IUPAC nomenclature used for?", options: ["Describing the shape of organic molecules", "A systematic international naming convention for organic and inorganic compounds based on structural features", "Classifying compounds by molecular weight", "Listing functional groups in order of priority"], correct_answer: 1 },
    { question: "What is condensation polymerisation?", options: ["Monomers with double bonds adding together directly", "Polymerisation where monomers join by forming covalent bonds with the release of small molecules (typically water)", "A type of addition reaction", "Polymers condensing at low temperature"], correct_answer: 1 },
    { question: "What is an organic polymer?", options: ["A very large organic molecule formed from repeating small monomer units linked by covalent bonds", "A mixture of many different organic compounds", "A large ionic compound", "Any large organic molecule found in nature"], correct_answer: 0 },
  ],
  8: [
    { question: "What is chemical kinetics?", options: ["The study of the energy of chemical reactions", "The study of the rates of chemical reactions and the factors that affect them", "The study of equilibrium in chemical systems", "The study of molecular structure"], correct_answer: 1 },
    { question: "What is reaction rate?", options: ["The temperature at which a reaction occurs", "The change in concentration of a reactant or product per unit time", "The energy released by a chemical reaction", "The number of moles of product formed"], correct_answer: 1 },
    { question: "What factors affect the rate of a chemical reaction?", options: ["Only temperature affects reaction rate", "Concentration, temperature, surface area, catalyst, and nature of reactants", "Only the presence of a catalyst", "Only pH and concentration"], correct_answer: 1 },
    { question: "How does increasing temperature generally affect reaction rate?", options: ["It decreases the rate by reducing molecular motion", "It increases the rate by providing more molecules with energy above the activation energy", "It has no effect on reaction rate", "It only affects the rate if a catalyst is present"], correct_answer: 1 },
    { question: "What is the Arrhenius equation used for?", options: ["Calculating the heat of a reaction", "Describing how reaction rate constant k depends on temperature and activation energy: k = Ae^(−Ea/RT)", "Determining the equilibrium constant", "Balancing redox equations"], correct_answer: 1 },
    { question: "What is the order of a reaction?", options: ["The number of steps in the reaction mechanism", "The sum of the exponents in the rate law, indicating how rate depends on reactant concentrations", "The sequence of reactants added", "The position of the reaction in the periodic table"], correct_answer: 1 },
    { question: "What is a zero-order reaction?", options: ["A reaction with no reactants", "A reaction whose rate is independent of reactant concentration", "A reaction that cannot be catalysed", "A reaction requiring no activation energy"], correct_answer: 1 },
    { question: "What is the half-life of a first-order reaction?", options: ["The time to complete the reaction", "The time for the concentration of a reactant to decrease to half its initial value; for first-order reactions, t₁/₂ = 0.693/k", "Half the time of a second-order reaction", "The time to reach equilibrium"], correct_answer: 1 },
    { question: "What is a reaction mechanism?", options: ["The equipment used to carry out a reaction", "The step-by-step sequence of elementary reactions through which reactants are converted to products", "The balanced overall equation for a reaction", "The catalyst pathway in an industrial process"], correct_answer: 1 },
    { question: "What is the rate-determining step?", options: ["The fastest step in a reaction mechanism", "The slowest step in a reaction mechanism, which determines the overall rate of the reaction", "The step with the lowest activation energy", "The first step in any reaction mechanism"], correct_answer: 1 },
    { question: "How does a catalyst affect activation energy?", options: ["It increases activation energy, making the reaction faster", "It lowers the activation energy by providing an alternative reaction pathway, increasing rate without being consumed", "It has no effect on activation energy", "It eliminates the need for activation energy entirely"], correct_answer: 1 },
    { question: "What is a reaction intermediate?", options: ["The product of the overall reaction", "A species formed in one step and consumed in a subsequent step; it does not appear in the overall equation", "The catalyst in a reaction mechanism", "A reactant that is partially converted during a reaction"], correct_answer: 1 },
    { question: "What is the collision theory of reaction rates?", options: ["Reactions occur whenever molecules come close to each other", "Reactions occur when molecules collide with sufficient energy and correct orientation to overcome the activation energy barrier", "Reaction rate depends only on the number of collisions per second", "Reactions occur when the temperature exceeds the boiling point"], correct_answer: 1 },
    { question: "What is a homogeneous catalyst?", options: ["A catalyst in the same phase as the reactants", "A catalyst in a different phase from the reactants", "A catalyst made of a single element", "A biological catalyst (enzyme)"], correct_answer: 0 },
    { question: "What is enzyme catalysis?", options: ["A type of heterogeneous catalysis", "Biological catalysis by protein enzymes that lower activation energy and dramatically increase reaction rates in living systems", "Catalysis at very high temperatures in industry", "Catalysis using metal surfaces"], correct_answer: 1 },
    { question: "What is the integrated rate law for a first-order reaction?", options: ["[A]t = [A]₀ − kt", "ln[A]t = ln[A]₀ − kt", "1/[A]t = 1/[A]₀ + kt", "[A]t² = [A]₀² − 2kt"], correct_answer: 1 },
    { question: "What is a photochemical reaction?", options: ["A reaction requiring a metal catalyst", "A reaction initiated or sustained by the absorption of light (photons) by reactant molecules", "A reaction occurring at very high temperatures", "A reaction in the presence of an acid or base"], correct_answer: 1 },
    { question: "What is the effect of increasing concentration on a second-order reaction rate?", options: ["Rate doubles when concentration doubles", "Rate quadruples when concentration doubles (rate ∝ [A]²)", "Rate is unaffected by concentration", "Rate increases linearly with concentration regardless of order"], correct_answer: 1 },
    { question: "What is a rate law (rate equation)?", options: ["An equation describing how concentration changes with time", "An equation expressing rate as a function of the concentrations of reactants: rate = k[A]ˣ[B]ʸ", "The equation used to balance chemical equations", "An empirical formula for activation energy"], correct_answer: 1 },
    { question: "What is an elementary reaction?", options: ["A very simple chemical reaction", "A single-step reaction in a mechanism that occurs through a single molecular event", "A reaction involving only one reactant", "A reaction at room temperature"], correct_answer: 1 },
  ],
  9: [
    { question: "What is thermochemistry?", options: ["The study of temperature measurement", "The branch of chemistry studying the heat energy changes that accompany chemical reactions and phase transitions", "The study of kinetic energy in chemical reactions", "The study of nuclear energy"], correct_answer: 1 },
    { question: "What does ΔH represent in thermochemistry?", options: ["The change in temperature during a reaction", "The enthalpy change — the heat absorbed or released by a reaction at constant pressure", "The heat capacity of a substance", "The activation energy of a reaction"], correct_answer: 1 },
    { question: "What does a negative ΔH indicate?", options: ["The reaction is endothermic (absorbs heat)", "The reaction is exothermic (releases heat to the surroundings)", "The reaction has no enthalpy change", "The reaction requires high temperature"], correct_answer: 1 },
    { question: "What is Hess's Law?", options: ["The total enthalpy change for a reaction is path-dependent", "The total enthalpy change for a reaction is the same regardless of the route taken, as long as initial and final states are the same", "Enthalpy and entropy always change in opposite directions", "The heat of formation equals the heat of combustion"], correct_answer: 1 },
    { question: "What is the standard enthalpy of formation (ΔH°f)?", options: ["The enthalpy change when one mole of a compound decomposes into its elements", "The enthalpy change when one mole of a compound is formed from its elements in their standard states at 298 K", "The heat released when one gram of a substance burns", "The enthalpy of one mole of atoms in the gas phase"], correct_answer: 1 },
    { question: "What is entropy (S)?", options: ["A measure of the heat energy of a system", "A measure of the disorder or randomness in a system", "The free energy available for work at constant temperature", "The change in enthalpy divided by temperature"], correct_answer: 1 },
    { question: "What does the Second Law of Thermodynamics state?", options: ["Energy is conserved in all processes", "The total entropy of the universe always increases in a spontaneous process", "Heat flows from cold to hot bodies", "All spontaneous reactions are exothermic"], correct_answer: 1 },
    { question: "What is Gibbs free energy (G)?", options: ["The total heat content of a system", "A thermodynamic function (G = H − TS) whose change predicts the spontaneity of a reaction at constant temperature and pressure", "The kinetic energy of reacting molecules", "The enthalpy per mole of reaction"], correct_answer: 1 },
    { question: "When is a reaction spontaneous according to ΔG?", options: ["When ΔG > 0", "When ΔG < 0 (negative)", "When ΔG = 0", "When ΔH < 0 and ΔS < 0"], correct_answer: 1 },
    { question: "What is calorimetry?", options: ["The study of calorie content of food", "The experimental technique for measuring heat changes in chemical reactions using a calorimeter", "The measurement of heat capacity of metals", "A method for calculating Gibbs energy"], correct_answer: 1 },
    { question: "What is specific heat capacity?", options: ["The heat needed to melt one gram of a substance", "The energy required to raise the temperature of one gram of a substance by one degree Celsius", "The heat released by one mole during combustion", "The ratio of heat absorbed to mass gained"], correct_answer: 1 },
    { question: "What is the standard enthalpy of combustion?", options: ["The energy released when one mole of a substance is formed from its elements", "The enthalpy change when one mole of a substance completely combusts in excess oxygen under standard conditions", "The energy to heat one mole of a gas by 1 K", "The heat released when one mole of bonds is broken"], correct_answer: 1 },
    { question: "What is the relationship between ΔG, ΔH, and ΔS?", options: ["ΔG = ΔH + TΔS", "ΔG = ΔH − TΔS", "ΔG = TΔS − ΔH", "ΔG = ΔH × TΔS"], correct_answer: 1 },
    { question: "What is the Third Law of Thermodynamics?", options: ["Energy cannot be created or destroyed", "The entropy of a perfect crystalline substance at absolute zero (0 K) is zero", "All reactions eventually reach equilibrium", "Entropy always increases in spontaneous processes"], correct_answer: 1 },
    { question: "What does it mean when ΔG = 0?", options: ["The reaction is non-spontaneous", "The system is at equilibrium — no further change in composition occurs", "The reaction is strongly exothermic", "No reaction occurs at any temperature"], correct_answer: 1 },
    { question: "What is bond enthalpy (bond energy)?", options: ["The energy required to break one mole of a specific bond in the gas phase", "The energy released when a bond is formed only", "The stability of an ionic crystal lattice", "The heat of combustion per bond broken"], correct_answer: 0 },
    { question: "What is the lattice enthalpy?", options: ["The heat released when an ionic compound dissolves in water", "The energy required to completely separate one mole of an ionic solid into its gaseous ions", "The enthalpy of formation of a covalent crystal", "The heat absorbed during the phase change from solid to liquid"], correct_answer: 1 },
    { question: "What is the Born-Haber cycle?", options: ["A cycle showing how polymers are formed", "A thermodynamic cycle applying Hess's Law to calculate the lattice enthalpy of ionic compounds", "A cycle describing the water cycle in thermochemistry", "A cycle of bond breaking and forming in combustion"], correct_answer: 1 },
    { question: "What is enthalpy (H)?", options: ["The total kinetic energy of molecules", "A thermodynamic quantity representing the heat content of a system at constant pressure", "The measure of disorder in a system", "The free energy available to do work"], correct_answer: 1 },
    { question: "What is the heat of solution (enthalpy of dissolution)?", options: ["The heat required to bring a solution to its boiling point", "The enthalpy change when one mole of a solute dissolves in a large amount of solvent", "The heat released when ions form from elements", "The heat capacity of an aqueous solution"], correct_answer: 1 },
  ],
  10: [
    { question: "What is electrochemistry?", options: ["The study of electrical circuits", "The branch of chemistry studying the relationship between chemical reactions and electrical energy", "The study of electrons in atomic orbitals", "The study of electrostatic forces between ions"], correct_answer: 1 },
    { question: "What is a galvanic (voltaic) cell?", options: ["A cell that requires electrical energy to drive a non-spontaneous reaction", "An electrochemical cell that converts spontaneous chemical energy into electrical energy", "A cell used to purify metals by electrolysis", "A biological cell generating ATP"], correct_answer: 1 },
    { question: "What is electrolysis?", options: ["The spontaneous generation of electricity from a chemical reaction", "A process using electrical energy to drive a non-spontaneous chemical reaction at electrodes", "The dissolution of an ionic compound in water", "The decomposition of water by heat"], correct_answer: 1 },
    { question: "What is the anode in electrochemistry?", options: ["The electrode where reduction occurs", "The electrode where oxidation occurs", "The electrode always connected to the positive terminal of a battery", "The electrode submerged in electrolyte"], correct_answer: 1 },
    { question: "What is the cathode?", options: ["The electrode where oxidation occurs", "The electrode where reduction occurs", "A negatively charged ion in solution", "The separator membrane in a fuel cell"], correct_answer: 1 },
    { question: "What is Faraday's First Law of Electrolysis?", options: ["The mass of substance deposited is independent of current", "The mass of substance deposited at an electrode is proportional to the quantity of charge passed (m ∝ Q)", "The current determines only the rate, not the amount, of deposition", "All elements deposit at the same rate for the same charge"], correct_answer: 1 },
    { question: "What is the standard electrode potential (E°)?", options: ["The voltage of a battery at standard conditions", "The potential of a half-cell under standard conditions relative to the standard hydrogen electrode (SHE, 0 V)", "The electrical resistance of an electrode material", "The activation energy expressed in volts"], correct_answer: 1 },
    { question: "What is the Nernst equation used for?", options: ["Calculating the enthalpy of an electrochemical reaction", "Calculating the cell potential under non-standard conditions as a function of concentration", "Determining the equilibrium constant from enthalpy", "Calculating the rate of an electrochemical reaction"], correct_answer: 1 },
    { question: "What is nuclear chemistry?", options: ["The chemistry of very small molecules", "The study of reactions involving changes in the nucleus, including radioactive decay, fission, and fusion", "The chemistry of electrons in atomic orbitals", "The study of nuclear magnetic resonance (NMR) spectroscopy"], correct_answer: 1 },
    { question: "What is radioactive decay?", options: ["The breakdown of a compound by radiation", "The spontaneous transformation of an unstable nucleus into a more stable one, emitting radiation", "The absorption of radiation by a stable atom", "The splitting of a heavy nucleus into two lighter nuclei"], correct_answer: 1 },
    { question: "What is nuclear fission?", options: ["The fusion of two light nuclei into one", "The splitting of a heavy nucleus into two lighter nuclei upon absorption of a neutron, releasing large amounts of energy", "The spontaneous decay of a radioactive isotope", "The emission of an alpha particle from a nucleus"], correct_answer: 1 },
    { question: "What is nuclear fusion?", options: ["The splitting of a uranium nucleus", "The combining of two light nuclei into one heavier nucleus, releasing enormous amounts of energy — the process powering stars", "The process in a nuclear reactor generating electricity", "A type of radioactive decay"], correct_answer: 1 },
    { question: "What is NMR (Nuclear Magnetic Resonance) spectroscopy used for?", options: ["Detecting radioactive elements", "Determining the structure of organic molecules by observing how atomic nuclei respond to a magnetic field", "Measuring the melting points of crystals", "Identifying elements by their emission spectra"], correct_answer: 1 },
    { question: "What is quantum chemistry?", options: ["The study of atoms smaller than electrons", "The application of quantum mechanics to explain chemical bonding, molecular structure, and spectroscopy", "A branch of nuclear physics", "The study of quantum computers using chemistry"], correct_answer: 1 },
    { question: "What is computational chemistry?", options: ["Using calculators for stoichiometry calculations", "The use of computer modelling and simulation to study molecular structures, reactions, and properties", "Data analysis in a laboratory setting", "Programming for chemical databases"], correct_answer: 1 },
    { question: "What is green chemistry?", options: ["Chemistry focused on plant-based reactions", "The design of chemical products and processes that reduce or eliminate the use and generation of hazardous substances", "Chemistry using only renewable raw materials", "Environmental chemistry of ecosystems"], correct_answer: 1 },
    { question: "What is materials chemistry?", options: ["The chemistry of construction materials like concrete", "A field of chemistry concerned with the design, synthesis, and characterisation of new materials with specific properties", "The recycling of chemical compounds", "The chemistry of natural polymers"], correct_answer: 1 },
    { question: "What is nanotechnology in the context of chemistry?", options: ["Technology using very small computers", "The manipulation and application of materials at the nanoscale (1–100 nm), exploiting unique properties that emerge at that scale", "The study of nano-organisms", "Miniaturised laboratory equipment"], correct_answer: 1 },
    { question: "What is superconductivity?", options: ["Extremely high electrical conductivity in hot materials", "A phenomenon in which certain materials conduct electricity with zero resistance below a critical temperature", "Conductivity of electrons in ionic solutions", "Extremely rapid chemical reactions at absolute zero"], correct_answer: 1 },
    { question: "What is the Schrödinger equation used for in chemistry?", options: ["Calculating reaction rates", "Describing the quantum mechanical behaviour of electrons in atoms and molecules to determine their wave functions and energy levels", "Predicting the products of a chemical reaction", "Describing the motion of large molecules"], correct_answer: 1 },
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
                  You can continue to the next module, but you won&apos;t earn badges for this course. <strong>This cannot be undone.</strong>
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
