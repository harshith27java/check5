export type ExperienceState =
  | 'AUTH'                  // English or Spanish question
  | 'AUTH_TRANSITION'       // Heart beats -> particle big bang -> universe forms
  | 'UNIVERSE_OVERVIEW'     // Main 3D solar system with 5 planets
  | 'WORLD_1'               // Nature / Beginning
  | 'INTERLUDE_1'           // Message 1
  | 'WORLD_2'               // Ocean World
  | 'INTERLUDE_2'           // Message 2
  | 'WORLD_3'               // Galaxy / Constellation
  | 'INTERLUDE_3'           // Message 3
  | 'WORLD_4'               // Energy / Fragmented Memory
  | 'INTERLUDE_4'           // Message 4
  | 'WORLD_5_TRANSITION'    // Planet 5 cracks open to reveal gears
  | 'CLOCK_VIEW'            // Giant 3D Mechanical Clock + Live Timer
  | 'CLIMAX_0500'           // Hands animate to 05:00, clock explosion
  | 'FINAL_NUMBER_5'        // Particles assemble into giant number 5
  | 'FINAL_MESSAGE';        // Five months, five worlds, final anniversary letter

export interface MemoryData {
  id: number;
  worldNumber: number;
  title: string;
  theme: string;
  subtitle: string;
  date: string;
  shortDescription: string;
  message: string[];
  photos: string[];
  accentColor: string;
  planetColor: string;
  orbitRadius: number;
  orbitSpeed: number;
}

export interface InterludeData {
  id: number;
  title: string;
  subtitle?: string;
  paragraphs: string[];
}

export interface ExperienceConfig {
  meetingDate: string; // ISO 8601 string, e.g. "2026-04-30T00:00:00+05:30"
  memories: MemoryData[];
  interludes: InterludeData[];
  finalSequence: {
    leadIn: string[];
    mainMessage: string[];
    signature: string;
  };
  audioPaths: {
    background?: string;
    clock?: string;
    heart?: string;
    whoosh?: string;
    explosion?: string;
  };
  visualSettings: {
    particleCountMultiplier: number;
    enableBloom: boolean;
    reducedMotion: boolean;
  };
}
