import type { InquiryType } from "@/lib/contact-schema";

export const engineeringServices: {
  index: string;
  title: string;
  text: string;
  type: InquiryType;
  cta: string;
}[] = [
  {
    index: "01",
    title: "Machine Design",
    text: "Engineering design of special-purpose machines and equipment — food-tech, automation cells, test rigs — from concept to manufacturing drawings.",
    type: "engineering-design",
    cta: "Design a machine",
  },
  {
    index: "02",
    title: "Custom Robotics Development",
    text: "Application-specific robots, mechanisms and motion systems engineered from concept to prototype.",
    type: "robotics",
    cta: "Request a Consultation",
  },
  {
    index: "03",
    title: "Mechanical & Product Design",
    text: "3D CAD, assemblies, technical drawings and design for manufacturing for products and equipment.",
    type: "engineering-design",
    cta: "Request a Consultation",
  },
  {
    index: "04",
    title: "Simulation & Engineering Analysis",
    text: "Thermal, fluid, structural and multiphysics simulation to understand and improve designs.",
    type: "simulation",
    cta: "Request a Consultation",
  },
  {
    index: "05",
    title: "Industrial Automation",
    text: "Automation architectures, intelligent equipment and digital workflows for real processes.",
    type: "automation",
    cta: "Request a Consultation",
  },
  {
    index: "06",
    title: "Prototyping & Validation",
    text: "Functional prototypes, experimental testing and evaluation against defined requirements.",
    type: "prototype",
    cta: "Request a Consultation",
  },
  {
    index: "07",
    title: "Research & Development",
    text: "Applied research, feasibility studies, concept validation and research collaborations.",
    type: "research",
    cta: "Request a Consultation",
  },
  {
    index: "08",
    title: "Product Rental",
    text: "Rent our chocolate 3D printer, ice-cream robot, cookie automation machine or delivery robots for your event or venue.",
    type: "rent",
    cta: "Rent a product",
  },
];

export type ProcessStage = "discover" | "design" | "simulate" | "prototype" | "validate";

export const processSteps: { id: ProcessStage; index: string; title: string; text: string; detail: string[] }[] = [
  {
    id: "discover",
    index: "01",
    title: "Discover",
    text: "We start with the problem, not the solution: the material to dispense, the required precision, the workspace and the production context.",
    detail: ["Requirements & constraints", "Process understanding", "Feasibility assessment"],
  },
  {
    id: "design",
    index: "02",
    title: "Design",
    text: "The mechanism takes shape in CAD — a gantry, a dosing head and a nozzle — with interfaces, materials and manufacturability considered from the start.",
    detail: ["3D CAD & assemblies", "Kinematic concept", "Design for manufacturing"],
  },
  {
    id: "simulate",
    index: "03",
    title: "Simulate",
    text: "Before anything is built, simulation explores how the structure deflects, how heat spreads in the dosing head and how material flows through the nozzle.",
    detail: ["Structural behaviour", "Thermal management", "Flow through the nozzle"],
  },
  {
    id: "prototype",
    index: "04",
    title: "Prototype",
    text: "A functional prototype turns the model into hardware, so motion, dosing and control can be tested under real conditions.",
    detail: ["Functional build", "Control integration", "Iterative refinement"],
  },
  {
    id: "validate",
    index: "05",
    title: "Validate",
    text: "The system is evaluated against the requirements defined in the first step — repeatability, deposition quality and reliability — and refined where needed.",
    detail: ["Test protocols", "Evaluation against requirements", "Documented results"],
  },
];

export type SimulationMode = "thermal" | "structural" | "fluid";

export const simulationModes: { id: SimulationMode; label: string; title: string; text: string; legend: [string, string] }[] = [
  {
    id: "thermal",
    label: "Thermal",
    title: "Heat distribution in a finned component",
    text: "Thermal analysis shows how heat spreads from a source through a component and into its surroundings — essential for cooling, heating processes and material behaviour.",
    legend: ["Cooler", "Hotter"],
  },
  {
    id: "structural",
    label: "Structural",
    title: "Stress distribution in a loaded bracket",
    text: "Finite element analysis reveals where stress concentrates in a part under load, guiding material placement, fillets and reinforcement before manufacturing.",
    legend: ["Lower stress", "Higher stress"],
  },
  {
    id: "fluid",
    label: "Fluid Dynamics",
    title: "Velocity field around an obstacle",
    text: "Computational fluid dynamics describes how a fluid accelerates, separates and mixes — informing nozzle geometry, cooling channels and process equipment.",
    legend: ["Slower", "Faster"],
  },
];
