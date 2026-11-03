/**
 * Portfolio entries. Edit freely — every field is rendered on /projects and
 * /projects/[slug].
 *
 * Rules for this file:
 * - `status` must state honestly whether an entry is a prototype, a project
 *   in development, a concept or an illustrative showcase.
 * - Only add items to `outcomes` once they are verified. An empty list is
 *   rendered as "no verified outcomes published yet".
 * - Only reference real, approved photographs in `images`. Visuals listed in
 *   `visuals` are labelled concept/illustrative diagrams.
 */
export type ProjectStatus = "Prototype" | "Development project" | "Concept" | "Illustrative technical showcase";

export type ProjectVisual = "designer-robot" | "delivery" | "simulation" | "robot-render";

export type Project = {
  slug: string;
  title: string;
  status: ProjectStatus;
  summary: string;
  challenge: string;
  approach: string[];
  disciplines: string[];
  stage: string;
  visuals: { key: ProjectVisual; caption: string }[];
  /** Approved photographs: { src: "/images/projects/…", alt: "…" } */
  images: { src: string; alt: string; width: number; height: number }[];
  outcomes: string[];
};

export const projects: Project[] = [
  {
    slug: "designer-robot",
    title: "Designer Robot",
    status: "Development project",
    summary:
      "A robotic platform being developed for precision food design, controlled deposition and digital-to-physical manufacturing workflows.",
    challenge:
      "Creative food design — decorations, patterns and shaped deposits — is often manual, difficult to reproduce and hard to connect to digital design tools. The challenge is to translate a digital design into precise, repeatable physical deposition of edible materials.",
    approach: [
      "Define a motion architecture suited to accurate positioning over a working surface.",
      "Engineer a controlled deposition system for materials with different flow behaviour.",
      "Build a digital workflow that converts a design file into robot motion and dosing commands.",
      "Iterate through prototypes to evaluate motion, deposition and usability.",
    ],
    disciplines: ["Robotics", "Mechanical design", "Motion control", "Process engineering", "Software workflows"],
    stage: "In development — prototype engineering and evaluation are ongoing. Not commercially available.",
    visuals: [
      { key: "designer-robot", caption: "Concept illustration of a gantry-based deposition platform." },
      { key: "robot-render", caption: "Illustrative render of an articulated robotic mechanism." },
    ],
    images: [],
    outcomes: [],
  },
  {
    slug: "robotic-delivery-systems",
    title: "Robotic Delivery Systems",
    status: "Concept",
    summary:
      "Concept work on robotic mechanisms that move, position and deliver items or materials accurately within a defined workspace.",
    challenge:
      "Many processes require objects or materials to be transferred and placed reliably — between stations, onto a surface or into a container. Doing this accurately with compact, cost-aware mechanisms is the central engineering question.",
    approach: [
      "Analyse transfer tasks: paths, payloads, positioning tolerances and cycle constraints.",
      "Compare kinematic architectures — linear axes, articulated arms and hybrid mechanisms.",
      "Develop conceptual CAD models and motion paths to assess reach and clearances.",
      "Identify sensing and control requirements for reliable placement.",
    ],
    disciplines: ["Robotics", "Kinematics", "Mechanical design", "Automation"],
    stage: "Concept — architectures and motion studies. No physical system is presented as built.",
    visuals: [{ key: "delivery", caption: "Conceptual diagram of a robotic transfer path between stations." }],
    images: [],
    outcomes: [],
  },
  {
    slug: "simulation-driven-engineering",
    title: "Simulation-Driven Engineering",
    status: "Illustrative technical showcase",
    summary:
      "An illustration of how thermal, structural and fluid simulation are combined to inform engineering decisions before physical prototyping.",
    challenge:
      "Design choices such as material thickness, cooling geometry or nozzle shape are often made by trial and error. Computational simulation helps to understand the underlying physics and compare options virtually.",
    approach: [
      "Formulate the engineering question the simulation must answer.",
      "Build coupled models for heat transfer, structural loading and flow as needed.",
      "Verify numerical models and compare with experimental data when available.",
      "Translate results into concrete design recommendations.",
    ],
    disciplines: ["Heat transfer", "Computational fluid dynamics", "Finite element analysis", "Multiphysics modeling"],
    stage: "Illustrative showcase — the visualizations on this site are conceptual and are not validated simulation results.",
    visuals: [{ key: "simulation", caption: "Illustrative scalar fields: thermal, structural and flow." }],
    images: [],
    outcomes: [],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
