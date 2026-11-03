import type { ProjectCategory } from "@/lib/contact-schema";

export type IllustrationKey = "robotics" | "design" | "simulation" | "automation";

export type Expertise = {
  slug: "robotics" | "engineering-design" | "simulation" | "automation";
  /** Name used in navigation and cards */
  title: string;
  cardTitle: string;
  summary: string;
  headline: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  illustration: IllustrationKey;
  contactCategory: ProjectCategory;
  capabilities: { title: string; text: string }[];
  challenges: string[];
  applications: { title: string; text: string }[];
  workflow: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
};

export const expertise: Expertise[] = [
  {
    slug: "robotics",
    title: "Robotics",
    cardTitle: "Robotics & Automation",
    summary: "Custom robotics, motion systems, intelligent machines, and industrial automation.",
    headline: "Intelligent Motion. Engineered Precision.",
    intro:
      "We design custom robotic systems and precision mechanisms — from the kinematic concept and actuator selection to control architecture and working prototypes.",
    seoTitle: "Custom Robotics Engineering in France",
    seoDescription:
      "Custom robotic systems, precision motion mechanisms, robotic control and prototyping by Synthea Advanced Technologies, France.",
    illustration: "robotics",
    contactCategory: "robotics",
    capabilities: [
      {
        title: "Custom robotic systems",
        text: "Application-specific robots designed around your task, workspace and constraints rather than adapted from a catalogue.",
      },
      {
        title: "Precision motion mechanisms",
        text: "Linear axes, gantries, articulated arms and compact mechanisms with attention to stiffness, backlash and repeatability.",
      },
      {
        title: "Kinematics & motion planning",
        text: "Forward and inverse kinematics, trajectory generation and workspace analysis to define how the system should move.",
      },
      {
        title: "Robotic control systems",
        text: "Control architecture, motor and drive selection, sensors and the integration of motion controllers with software.",
      },
      {
        title: "Robotic product design",
        text: "Turning a robotic concept into a coherent product: enclosure, ergonomics, serviceability and manufacturability.",
      },
      {
        title: "Prototyping",
        text: "Functional prototypes to test mechanisms and control strategies early, before committing to production tooling.",
      },
    ],
    challenges: [
      "A manual or repetitive task needs to become precise, consistent and automated.",
      "Off-the-shelf robots do not fit the workspace, payload or process.",
      "A robotic concept exists, but the mechanics and control have not been engineered.",
      "An existing mechanism lacks accuracy, stiffness or reliability.",
    ],
    applications: [
      { title: "Food production", text: "Controlled deposition, handling and decoration processes where precision and hygiene matter." },
      { title: "Laboratory automation", text: "Repeatable positioning, dispensing and sample handling for research environments." },
      { title: "Light industrial handling", text: "Pick-and-place, transfer and positioning tasks for small and medium production." },
      { title: "Research platforms", text: "Custom robotic test benches for experiments, validation and teaching." },
    ],
    workflow: [
      { title: "Task analysis", text: "Define motions, payloads, workspace, cycle and environment." },
      { title: "Kinematic concept", text: "Select architecture — Cartesian, SCARA, articulated or custom." },
      { title: "Mechanical & control design", text: "CAD, actuator sizing, sensors and control architecture." },
      { title: "Simulation", text: "Check motion, reach and structural behaviour virtually." },
      { title: "Prototype & test", text: "Build, tune and evaluate against the agreed requirements." },
    ],
    faqs: [
      {
        q: "Do you build complete robots or only design them?",
        a: "Both are possible. We can deliver the engineering design package for your manufacturer, or develop a functional prototype. The scope is agreed per project.",
      },
      {
        q: "Can you work with an existing robot or machine?",
        a: "Yes. We can design end-effectors, fixtures, additional axes or mechanical improvements around existing equipment.",
      },
      {
        q: "What information do you need to start?",
        a: "A description of the task, the objects or materials involved, the space available and any constraints you already know. Sketches, photos or videos help.",
      },
      {
        q: "Is my project information kept confidential?",
        a: "Yes. We are happy to sign a non-disclosure agreement before detailed technical discussions.",
      },
    ],
  },
  {
    slug: "engineering-design",
    title: "Engineering Design",
    cardTitle: "Engineering Design",
    summary: "Mechanical engineering, industrial product design, CAD, and prototype development.",
    headline: "Designed with Precision. Built for Purpose.",
    intro:
      "From first concept to manufacturing-ready drawings, we engineer mechanical products, assemblies and custom machines that are robust, efficient and buildable.",
    seoTitle: "Mechanical Engineering Design Services",
    seoDescription:
      "Mechanical product design, 3D CAD modeling, assemblies, technical drawings, custom machines and design for manufacturing by Synthea, France.",
    illustration: "design",
    contactCategory: "mechanical-design",
    capabilities: [
      { title: "Mechanical product design", text: "Functional, manufacturable products designed from requirements through to detailed parts." },
      { title: "3D CAD modeling", text: "Parametric part and assembly models structured so they stay easy to modify." },
      { title: "Assemblies & mechanisms", text: "Multi-part assemblies, motion mechanisms, interfaces and tolerance considerations." },
      { title: "Technical drawings", text: "Manufacturing drawings with dimensions, tolerances and notes for suppliers." },
      { title: "Custom machines & equipment", text: "Special-purpose industrial equipment, fixtures and test rigs." },
      { title: "Design for manufacturing", text: "Choosing processes, materials and geometries that reduce cost and production risk." },
    ],
    challenges: [
      "An idea needs to become a credible, manufacturable product.",
      "An existing design is expensive, heavy or difficult to assemble.",
      "A supplier needs complete CAD models and drawings to produce parts.",
      "The feasibility of a concept is uncertain and needs an engineering assessment.",
    ],
    applications: [
      { title: "Industrial equipment", text: "Machine frames, enclosures, handling devices and process equipment." },
      { title: "Product development", text: "Mechanical design for start-ups and entrepreneurs developing new devices." },
      { title: "Test benches", text: "Experimental rigs and fixtures for research and quality testing." },
      { title: "Redesign & optimization", text: "Improving existing parts for weight, cost, stiffness or assembly time." },
    ],
    workflow: [
      { title: "Requirements", text: "Functions, loads, environment, standards and budget." },
      { title: "Concepts", text: "Alternative architectures compared on clear criteria." },
      { title: "Detailed CAD", text: "Parts, assemblies, materials and interfaces." },
      { title: "Analysis", text: "Simulation where it reduces risk — structural, thermal or motion." },
      { title: "Drawings & prototype", text: "Manufacturing documentation and prototype support." },
    ],
    faqs: [
      {
        q: "Which file formats can you deliver?",
        a: "Native CAD files and neutral formats such as STEP, along with PDF drawings. Tell us what your manufacturer uses and we will align with it.",
      },
      {
        q: "Can you start from a sketch?",
        a: "Yes. Many projects start from a sketch, a photo or a verbal description. The first phase clarifies requirements and feasibility.",
      },
      {
        q: "Do you help with manufacturing?",
        a: "We prepare documentation for manufacturing and can support discussions with your suppliers and the assembly of prototypes.",
      },
      {
        q: "Who owns the design?",
        a: "Intellectual property terms are agreed in writing for each project before work begins.",
      },
    ],
  },
  {
    slug: "simulation",
    title: "Simulation",
    cardTitle: "Simulation & Modeling",
    summary: "Multiphysics simulation, thermal analysis, structural modeling, and virtual validation.",
    headline: "Understand Complexity. Design with Confidence.",
    intro:
      "We use computational simulation to understand heat transfer, fluid flow, structural behaviour and coupled physics — so design decisions are based on insight, not guesswork.",
    seoTitle: "Computational Simulation & Multiphysics Engineering",
    seoDescription:
      "Thermal simulation, CFD, finite element analysis, multiphysics modeling, digital twins and process modeling by Synthea Advanced Technologies.",
    illustration: "simulation",
    contactCategory: "simulation",
    capabilities: [
      { title: "Heat transfer & thermal analysis", text: "Conduction, convection and radiation in components, equipment and thermal processes." },
      { title: "Computational fluid dynamics", text: "Flow fields, pressure losses, mixing and convective heat transfer." },
      { title: "Finite element analysis", text: "Stress, deformation and stiffness of parts and assemblies under load." },
      { title: "Multiphysics simulation", text: "Coupled thermal, fluid, structural and process phenomena." },
      { title: "Digital twins", text: "Virtual representations of equipment or processes to explore behaviour and scenarios." },
      { title: "Process modeling", text: "Models of thermal and industrial processes to understand and improve them." },
    ],
    challenges: [
      "A component overheats, deforms or fails and the root cause is unclear.",
      "Physical tests are expensive, slow or difficult to instrument.",
      "Several design options need to be compared before building a prototype.",
      "A thermal or industrial process needs to be understood and optimized.",
    ],
    applications: [
      { title: "Thermal processes", text: "Heating, cooling and thermal treatment of products and materials." },
      { title: "Equipment design", text: "Cooling of electronics and machines, heat exchangers and enclosures." },
      { title: "Structural verification", text: "Brackets, frames and mechanisms checked under expected loads." },
      { title: "Research support", text: "Modeling studies that complement experimental programmes." },
    ],
    workflow: [
      { title: "Define the question", text: "What decision should the simulation support?" },
      { title: "Model setup", text: "Geometry, physics, materials and boundary conditions." },
      { title: "Verification", text: "Mesh studies and sanity checks on the numerical model." },
      { title: "Validation", text: "Comparison with measurements or reference data where available." },
      { title: "Insight & recommendations", text: "Clear results and engineering recommendations." },
    ],
    faqs: [
      {
        q: "Can simulation replace physical testing?",
        a: "Simulation reduces the number of tests and helps focus them, but it does not remove the need for validation. We are explicit about model assumptions and uncertainty.",
      },
      {
        q: "What do you need to set up a simulation?",
        a: "Geometry (CAD or drawings), materials, operating conditions and the question you want answered. Measurement data is valuable for validation.",
      },
      {
        q: "Which simulation software do you use?",
        a: "Tools are selected according to the physics and the project. We will discuss the approach and deliverables during scoping.",
      },
      {
        q: "What does a simulation deliverable look like?",
        a: "Typically a technical report with the model description, assumptions, results, visualizations and recommendations.",
      },
    ],
  },
  {
    slug: "automation",
    title: "Automation",
    cardTitle: "Intelligent Engineering",
    summary: "Digital design workflows, computational optimization, and engineering software.",
    headline: "Smarter Systems. Seamless Operations.",
    intro:
      "We design automation architectures, intelligent equipment and digital engineering workflows that make processes more consistent, traceable and efficient.",
    seoTitle: "Industrial Automation & Intelligent Engineering",
    seoDescription:
      "Industrial automation architecture, motion systems, intelligent machine design, digital workflows and process optimization by Synthea, France.",
    illustration: "automation",
    contactCategory: "automation",
    capabilities: [
      { title: "Automation architecture", text: "Structuring sensors, actuators, controllers and software into a coherent system." },
      { title: "Motion systems", text: "Axes, drives and motion sequences for automated equipment." },
      { title: "Intelligent machine design", text: "Equipment that senses, adapts and reports — designed for real operating conditions." },
      { title: "Digital engineering workflows", text: "Connecting design data, parameters and production to reduce manual steps." },
      { title: "AI-assisted design", text: "Computational and data-driven methods to explore design options faster." },
      { title: "Custom engineering interfaces", text: "Software interfaces for configuring, operating and monitoring equipment." },
    ],
    challenges: [
      "A process depends on manual steps that introduce variability.",
      "Equipment works, but it is not connected to the digital design data.",
      "Engineers spend too much time on repetitive calculations or configurations.",
      "A new automated process needs to be defined from scratch.",
    ],
    applications: [
      { title: "Production processes", text: "Automating dosing, positioning, handling or inspection steps." },
      { title: "Digital-to-physical workflows", text: "From a digital design file directly to machine motion." },
      { title: "Engineering tools", text: "Calculation tools and configurators tailored to your products." },
      { title: "Process improvement", text: "Analysing a process and identifying where automation adds value." },
    ],
    workflow: [
      { title: "Process mapping", text: "Understand the current process and the target." },
      { title: "Architecture", text: "Define hardware, control and software structure." },
      { title: "Design", text: "Mechanical, electrical concept and software interfaces." },
      { title: "Integration", text: "Assemble, connect and test the system step by step." },
      { title: "Evaluation", text: "Verify behaviour and refine with operators." },
    ],
    faqs: [
      {
        q: "Do you integrate with existing production lines?",
        a: "We can design equipment and interfaces intended to fit existing lines. Integration requirements are reviewed at the start of each project.",
      },
      {
        q: "Can you develop software as well as hardware?",
        a: "Yes, for engineering interfaces, motion sequences and digital workflows connected to the equipment we design.",
      },
      {
        q: "Is automation worthwhile for small production volumes?",
        a: "Sometimes. A short feasibility study helps determine whether partial automation, tooling or full automation makes sense.",
      },
      {
        q: "How do you handle safety?",
        a: "Safety is considered from the concept stage. Compliance and certification requirements depend on the application and are scoped explicitly.",
      },
    ],
  },
];

export function getExpertise(slug: string) {
  return expertise.find((e) => e.slug === slug);
}
