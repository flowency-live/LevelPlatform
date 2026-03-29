import { BenchmarkId } from '../domain/benchmark/BenchmarkId';

export interface Activity {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly benchmarkId: string;
}

export interface GatsbyBenchmark {
  readonly id: string;
  readonly name: string;
  readonly shortName: string;
  readonly description: string;
  readonly activities: ReadonlyArray<Activity>;
}

export const GATSBY_BENCHMARKS: Record<string, GatsbyBenchmark> = {
  GB1: {
    id: 'GB1',
    name: 'A stable careers programme',
    shortName: 'Careers Programme',
    description: 'Every school and college should have an embedded programme of career education and guidance that is known and understood by students, parents, teachers, governors and employers.',
    activities: [
      { id: 'GB1-01', name: 'My Career Plan introduction', description: 'Complete the introduction section of your career plan', benchmarkId: 'GB1' },
      { id: 'GB1-02', name: 'Set career goals', description: 'Identify and document your short and long-term career goals', benchmarkId: 'GB1' },
      { id: 'GB1-03', name: 'Review career progress', description: 'Regular review of career plan progress with tutor', benchmarkId: 'GB1' },
      { id: 'GB1-04', name: 'Update career plan', description: 'Make updates to your career plan based on new experiences', benchmarkId: 'GB1' },
    ],
  },
  GB2: {
    id: 'GB2',
    name: 'Learning from career and labour market information',
    shortName: 'Labour Market',
    description: 'Every student, and their parents, should have access to good quality information about future study options and labour market opportunities.',
    activities: [
      { id: 'GB2-01', name: 'Research job sectors', description: 'Explore different job sectors and industries', benchmarkId: 'GB2' },
      { id: 'GB2-02', name: 'Understand local opportunities', description: 'Learn about local employment opportunities', benchmarkId: 'GB2' },
      { id: 'GB2-03', name: 'Salary research', description: 'Research typical salaries for careers of interest', benchmarkId: 'GB2' },
      { id: 'GB2-04', name: 'Skills in demand', description: 'Identify skills that are in demand in the labour market', benchmarkId: 'GB2' },
    ],
  },
  GB3: {
    id: 'GB3',
    name: 'Addressing the needs of each pupil',
    shortName: 'Individual Needs',
    description: 'Students have different career guidance needs at different stages. Opportunities for advice and support need to be tailored to the needs of each student.',
    activities: [
      { id: 'GB3-01', name: 'Personal strengths assessment', description: 'Identify your personal strengths and qualities', benchmarkId: 'GB3' },
      { id: 'GB3-02', name: 'Learning styles', description: 'Understand your preferred learning style', benchmarkId: 'GB3' },
      { id: 'GB3-03', name: 'Support needs review', description: 'Review any additional support needs for your career journey', benchmarkId: 'GB3' },
      { id: 'GB3-04', name: 'Personalised action plan', description: 'Create a personalised career action plan', benchmarkId: 'GB3' },
    ],
  },
  GB4: {
    id: 'GB4',
    name: 'Linking curriculum learning to careers',
    shortName: 'Curriculum Links',
    description: 'All teachers should link curriculum learning with careers. STEM subject teachers should highlight the relevance of STEM subjects for a wide range of future career paths.',
    activities: [
      { id: 'GB4-01', name: 'Subject to career links', description: 'Connect your school subjects to potential careers', benchmarkId: 'GB4' },
      { id: 'GB4-02', name: 'STEM career exploration', description: 'Explore careers related to STEM subjects', benchmarkId: 'GB4' },
      { id: 'GB4-03', name: 'Skills from subjects', description: 'Identify transferable skills gained from your subjects', benchmarkId: 'GB4' },
      { id: 'GB4-04', name: 'Career day participation', description: 'Participate in subject-related career activities', benchmarkId: 'GB4' },
    ],
  },
  GB5: {
    id: 'GB5',
    name: 'Encounters with employers and employees',
    shortName: 'Employer Encounters',
    description: 'Every student should have multiple opportunities to learn from employers about work, employment and the skills that are valued in the workplace.',
    activities: [
      { id: 'GB5-01', name: 'Employer talk attendance', description: 'Attend a talk by an employer or employee', benchmarkId: 'GB5' },
      { id: 'GB5-02', name: 'Ask questions to employers', description: 'Prepare and ask questions to visiting employers', benchmarkId: 'GB5' },
      { id: 'GB5-03', name: 'Careers fair visit', description: 'Visit a careers fair and speak with employers', benchmarkId: 'GB5' },
      { id: 'GB5-04', name: 'Industry insight', description: 'Gain insight into a specific industry from professionals', benchmarkId: 'GB5' },
    ],
  },
  GB6: {
    id: 'GB6',
    name: 'Experiences of workplaces',
    shortName: 'Work Experience',
    description: 'Every student should have first-hand experiences of the workplace through work visits, work shadowing and/or work experience to help their exploration of career opportunities.',
    activities: [
      { id: 'GB6-01', name: 'Workplace visit', description: 'Visit a workplace to see professionals at work', benchmarkId: 'GB6' },
      { id: 'GB6-02', name: 'Work shadowing', description: 'Shadow a professional for a day', benchmarkId: 'GB6' },
      { id: 'GB6-03', name: 'Work experience placement', description: 'Complete a work experience placement', benchmarkId: 'GB6' },
      { id: 'GB6-04', name: 'Reflect on work experience', description: 'Reflect on and document your work experience learnings', benchmarkId: 'GB6' },
    ],
  },
  GB7: {
    id: 'GB7',
    name: 'Encounters with further and higher education',
    shortName: 'Education Pathways',
    description: 'All students should understand the full range of learning opportunities that are available to them. This includes both academic and vocational routes.',
    activities: [
      { id: 'GB7-01', name: 'College visit', description: 'Visit a further education college', benchmarkId: 'GB7' },
      { id: 'GB7-02', name: 'University exploration', description: 'Explore university options and courses', benchmarkId: 'GB7' },
      { id: 'GB7-03', name: 'Apprenticeship research', description: 'Research apprenticeship opportunities', benchmarkId: 'GB7' },
      { id: 'GB7-04', name: 'Post-16 options review', description: 'Review all post-16 education and training options', benchmarkId: 'GB7' },
    ],
  },
  GB8: {
    id: 'GB8',
    name: 'Personal guidance',
    shortName: 'Personal Guidance',
    description: 'Every student should have opportunities for guidance interviews with a career adviser, who could be internal (a+member of school staff) or external, provided they are trained to an appropriate level.',
    activities: [
      { id: 'GB8-01', name: 'Career guidance interview', description: 'Have a one-to-one career guidance interview', benchmarkId: 'GB8' },
      { id: 'GB8-02', name: 'Action plan from guidance', description: 'Create action points from career guidance session', benchmarkId: 'GB8' },
      { id: 'GB8-03', name: 'Follow-up review', description: 'Follow-up review of career guidance actions', benchmarkId: 'GB8' },
      { id: 'GB8-04', name: 'Transition planning', description: 'Plan for transition to next stage of education/employment', benchmarkId: 'GB8' },
    ],
  },
};

export function getBenchmark(id: BenchmarkId): GatsbyBenchmark {
  return GATSBY_BENCHMARKS[id.toString()];
}

export function getBenchmarkActivities(id: BenchmarkId): ReadonlyArray<Activity> {
  return GATSBY_BENCHMARKS[id.toString()].activities;
}

export function getAllBenchmarks(): GatsbyBenchmark[] {
  return ['GB1', 'GB2', 'GB3', 'GB4', 'GB5', 'GB6', 'GB7', 'GB8'].map(
    id => GATSBY_BENCHMARKS[id]
  );
}
