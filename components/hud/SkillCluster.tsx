import type { ComponentType } from 'react';
import type { SimpleIcon } from 'simple-icons';
import {
  siApachespark,
  siApachehadoop,
  siDocker,
  siGit,
  siGithubcopilot,
  siGooglebigquery,
  siKeras,
  siLangchain,
  siPython,
  siPytorch,
  siSnowflake,
  siTensorflow,
} from 'simple-icons';
import {
  Blocks,
  Bot,
  Brain,
  Cloud,
  CloudCog,
  Cpu,
  Database,
  FileBarChart2,
  Globe,
  Network,
  ScanSearch,
  Sparkles,
  TimerReset,
  Workflow,
} from 'lucide-react';

interface SkillGroup {
  category: string;
  label: string;
  color: string;
  skills: string[];
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'core_ml',
    label: 'Core ML',
    color: 'var(--cyan)',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'Keras', 'Deep Learning', 'NLP', 'Computer Vision', 'Time Series'],
  },
  {
    category: 'ai_systems',
    label: 'AI Systems',
    color: 'var(--green)',
    skills: ['LangChain', 'RAG', 'LLMs', 'Agentic AI', 'Prompt Engineering', 'Copilot Studio'],
  },
  {
    category: 'data',
    label: 'Data',
    color: 'var(--amber)',
    skills: ['SQL', 'Spark', 'Snowflake', 'BigQuery', 'Hadoop', 'Power BI', 'Tableau'],
  },
  {
    category: 'infrastructure',
    label: 'Infrastructure',
    color: 'var(--red)',
    skills: ['AWS', 'Docker', 'SageMaker', 'Lambda', 'EventBridge', 'Azure DevOps', 'Git'],
  },
];

interface SkillClusterProps {
  skills?: Array<{ name: string; category: string }>;
}

type SkillIcon = ComponentType<{ className?: string; strokeWidth?: number }>;
type SkillVisual = { type: 'brand'; icon: SimpleIcon } | { type: 'fallback'; icon: SkillIcon };

const skillIcons: Record<string, SkillVisual> = {
  Python: { type: 'brand', icon: siPython },
  PyTorch: { type: 'brand', icon: siPytorch },
  TensorFlow: { type: 'brand', icon: siTensorflow },
  Keras: { type: 'brand', icon: siKeras },
  'Deep Learning': { type: 'fallback', icon: Brain },
  NLP: { type: 'fallback', icon: Bot },
  'Computer Vision': { type: 'fallback', icon: ScanSearch },
  'Time Series': { type: 'fallback', icon: TimerReset },
  LangChain: { type: 'brand', icon: siLangchain },
  RAG: { type: 'fallback', icon: Blocks },
  LLMs: { type: 'fallback', icon: Sparkles },
  'Agentic AI': { type: 'fallback', icon: Bot },
  'Prompt Engineering': { type: 'fallback', icon: Sparkles },
  'Copilot Studio': { type: 'brand', icon: siGithubcopilot },
  SQL: { type: 'fallback', icon: Database },
  Spark: { type: 'brand', icon: siApachespark },
  Snowflake: { type: 'brand', icon: siSnowflake },
  BigQuery: { type: 'brand', icon: siGooglebigquery },
  Hadoop: { type: 'brand', icon: siApachehadoop },
  'Power BI': { type: 'fallback', icon: FileBarChart2 },
  Tableau: { type: 'fallback', icon: Globe },
  AWS: { type: 'fallback', icon: Cloud },
  Docker: { type: 'brand', icon: siDocker },
  SageMaker: { type: 'fallback', icon: Brain },
  Lambda: { type: 'fallback', icon: Workflow },
  EventBridge: { type: 'fallback', icon: Network },
  'Azure DevOps': { type: 'fallback', icon: CloudCog },
  Git: { type: 'brand', icon: siGit },
};

function BrandIcon({ icon, className }: { icon: SimpleIcon; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill={`#${icon.hex}`}
      role="img"
    >
      <path d={icon.path} />
    </svg>
  );
}

export function SkillCluster({ skills }: SkillClusterProps) {
  const groups = SKILL_GROUPS.map((g) => ({
    ...g,
    skills: skills
      ? skills.filter((s) => s.category === g.category).map((s) => s.name)
      : g.skills,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {groups.map((group) => (
        <div
          key={group.category}
          className="group relative overflow-hidden rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/14"
        >
          <div
            className="absolute right-0 top-0 h-24 w-24 rounded-full blur-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-35"
            style={{ background: group.color }}
          />
          <div className="relative">
            <div
              className="mb-3 font-mono-hud text-[11px] tracking-[0.22em] uppercase font-semibold"
              style={{ color: group.color }}
            >
              {group.label}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {group.skills.map((skill) => (
                <div
                  key={skill}
                  className="group/skill rounded-[22px] border p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.24)]"
                  style={{
                    borderColor: `${group.color}55`,
                    background: `linear-gradient(180deg, ${group.color}14, ${group.color}08)`,
                    boxShadow: `inset 0 0 0 1px ${group.color}10`,
                  }}
                >
                  <div className="flex flex-col items-start gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border transition-transform duration-200 group-hover/skill:scale-105"
                      style={{
                        borderColor: `${group.color}45`,
                        background: `${group.color}12`,
                        boxShadow: `0 0 24px ${group.color}16`,
                      }}
                    >
                      {(() => {
                        const visual = skillIcons[skill] ?? { type: 'fallback', icon: Cpu };
                        if (visual.type === 'brand') {
                          return <BrandIcon icon={visual.icon} className="h-5 w-5" />;
                        }

                        const Icon = visual.icon;
                        return <Icon className="h-5 w-5" strokeWidth={1.9} />;
                      })()}
                    </div>
                    <div className="font-body text-[14px] font-medium leading-5 text-white">
                      {skill}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
