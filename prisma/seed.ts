import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log('Seeding database...');

  // Clear all tables
  await prisma.tickerItem.deleteMany();
  await prisma.stat.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.award.deleteMany();
  await prisma.leadershipRole.deleteMany();
  await prisma.writing.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.profile.deleteMany();

  // Profile
  await prisma.profile.create({
    data: {
      name: 'Ayorinde Alase',
      title: 'AI Scientist | PhD Candidate | CTO',
      bio: 'PhD Candidate in Electrical & Computer Engineering at UA Little Rock (4.0 GPA), researching deep learning applications in biomechanics under an NVIDIA Academic Research Grant. CTO at Kairos Nexus Global. 4 publications, 6 major awards. Building AI systems that matter.',
      email: 'ayorinde.alase@outlook.com',
      location: 'Little Rock, Arkansas, USA',
      linkedinUrl: 'https://www.linkedin.com/in/ayorinde-alase/',
      githubUrl: 'https://github.com/Ayorindealase',
      companyName: 'Kairos Nexus Global',
      companyUrl: 'https://www.kairosng.com',
      philosophy: "I am deeply passionate about AI, mentoring people, and investing in people's growth. I love to see people break every limitation and barrier. Inspiring my brothers keeps me going — I have invested in many people's careers and watching them thrive fuels everything I build.",
    },
  });

  // Experience
  await prisma.experience.createMany({
    data: [
      {
        role: 'AI Scientist / Engineer (GA)',
        company: 'University of Arkansas at Little Rock',
        location: 'Little Rock, AR, USA',
        period: 'May 2025 — Aug 2025',
        accentColor: 'cyan',
        highlights: [
          'Designed and deployed an AI-powered graduate advisor chatbot using Python, LangChain, and LangSmith with RAG from large-scale databases, significantly improving student access to program information and faculty resources.',
          'Engineered a fully autonomous food-ordering AI agent using Copilot Studio, integrating NLP pipelines, memory, and tool-use planning for real-world enterprise workflows.',
          'Leveraged embeddings, vector search, and retrieval pipelines to power intelligent document Q&A, improving response accuracy by 30%+ for campus queries.',
          'Explored student interaction data to iteratively refine prompts and tools, reducing chatbot fallback rates by 40%.',
        ],
        sortOrder: 0,
      },
      {
        role: 'Data Scientist / ML Engineer',
        company: 'AXA Mansard Insurance Plc',
        location: 'Lagos, Nigeria',
        period: 'Feb 2022 — Jul 2024',
        accentColor: 'green',
        highlights: [
          'Built a traffic accident prediction model using geospatial and telematics data — 15% decrease in accident rates for local municipalities.',
          'Developed a real-time fraud detection system with Kafka + PySpark. AWS Lambda triggered alerts in <5 seconds, reducing response time from 3 hours to 5 minutes.',
          'Designed a cross-sell solution for health and group life insurance using NLP and LSH — 30% improvement in cross-sell rate within 4 months.',
          'Built a recommendation engine using collaborative filtering — 45%+ increase in transactions.',
          'Developed an AI-powered CRM Assistant leveraging NLP, sentiment analysis, and ML.',
        ],
        sortOrder: 1,
      },
      {
        role: 'Data Scientist',
        company: 'Complab',
        location: 'London, UK',
        period: 'Nov 2020 — Jan 2022',
        accentColor: 'amber',
        highlights: [
          'Developed and deployed an ML recommendation system (Next Best Journey) to optimize marketing interactions based on multi-channel engagement data.',
          'Built end-to-end data pipelines with Snowflake + AWS SageMaker.',
          'Leveraged AWS EventBridge for automated data orchestration. Implemented Lambda for real-time triggering.',
          'Managed CI/CD with Azure DevOps.',
        ],
        sortOrder: 2,
      },
    ],
  });

  // Education
  await prisma.education.createMany({
    data: [
      {
        degree: 'PhD',
        field: 'Electrical & Computer Engineering',
        institution: 'University of Arkansas at Little Rock',
        location: 'Little Rock, AR, USA',
        gpa: '4.0/4.0',
        period: '2024 — Present',
        sortOrder: 0,
      },
      {
        degree: 'B.Eng',
        field: 'Electrical/Electronics Engineering',
        institution: 'Olabisi Onabanjo University',
        location: 'Nigeria',
        gpa: '4.52/5.0',
        period: '2016 — 2022',
        sortOrder: 1,
      },
    ],
  });

  // Publications
  await prisma.publication.createMany({
    data: [
      {
        title: 'Application of Advanced Data Mining and Computer Vision Techniques in License Plate Recognition',
        abstract: 'Published in IEEE proceedings (DOI: 10.1109/STCR62650.2025.11018987), this work presents a robust license plate recognition system combining advanced data mining with computer vision, validated on real-world traffic scenarios.',
        tags: ['Data Mining', 'Computer Vision', 'License Plate Recognition', 'IEEE'],
        type: 'publication',
        date: '2025',
        doiUrl: 'https://doi.org/10.1109/STCR62650.2025.11018987',
        sortOrder: 0,
      },
      {
        title: 'Comparative Analysis of Transfer Learning Architectures in X-Ray / Brain Tumour Classification Using MRI Images',
        abstract: 'A systematic comparison of state-of-the-art transfer learning architectures (VGG, ResNet, EfficientNet) applied to medical image classification tasks, achieving high accuracy in both X-Ray and MRI brain tumor detection.',
        tags: ['Transfer Learning', 'Medical Imaging', 'Computer Vision', 'MRI', 'Deep Learning'],
        type: 'publication',
        date: '2023',
        sortOrder: 1,
      },
      {
        title: 'Business Transformation with Salesforce Einstein Discovery — A Machine Learning Approach',
        abstract: "An examination of how Salesforce Einstein Discovery's AutoML capabilities can be applied to transform enterprise business processes, with case studies on predictive analytics implementation.",
        tags: ['Machine Learning', 'AutoML', 'Business Intelligence', 'Salesforce'],
        type: 'publication',
        date: '2023',
        sortOrder: 2,
      },
      {
        title: 'Counterfeit Currency Detection with CNN for Nigeria',
        abstract: 'A convolutional neural network-based approach to detecting counterfeit Nigerian currency notes using image processing and deep learning, achieving high precision through custom dataset collection and augmentation.',
        tags: ['CNN', 'Computer Vision', 'Currency Detection', 'Deep Learning'],
        type: 'publication',
        date: '2022',
        sortOrder: 3,
      },
    ],
  });

  // Writings (3 sample blog articles)
  await prisma.writing.createMany({
    data: [
      {
        title: 'Building RAG Systems That Actually Work',
        slug: 'building-rag-systems-that-actually-work',
        content: `# Building RAG Systems That Actually Work

When we set out to build an AI advisor chatbot for over 10,000 graduate students at UA Little Rock, we didn't realize how quickly "simple retrieval" becomes a systems problem.

## The Problem with Naive RAG

Most RAG tutorials show you the happy path: embed your documents, store them in a vector DB, retrieve top-k chunks, feed to LLM. It works beautifully — until it doesn't.

In production, we encountered three failure modes almost immediately:

**1. Semantic mismatch.** Students asking "how do I apply to the CS program" wouldn't match our chunks about "Computer Science MS application requirements" because they used different vocabulary.

**2. Context fragmentation.** When we chunked our faculty handbook at 512 tokens, important context about prerequisites and deadlines ended up in different chunks.

**3. Hallucination on gaps.** When the answer wasn't in our corpus, the LLM would confidently invent policy details.

## What We Actually Built

Using LangChain and LangSmith for observability, we implemented a multi-stage hybrid retrieval pipeline combining BM25 keyword search with dense vector retrieval.

## Results

After two iterations: response accuracy improved 30%+, fallback rate dropped 40%.`,
        abstract: 'Lessons from deploying an AI advisor chatbot for 10,000+ students — what works, what breaks, and how to build retrieval systems that hold up under real-world load.',
        tags: ['RAG', 'LangChain', 'AI Engineering', 'LLMs'],
        type: 'article',
        publishedDate: new Date('2025-04-01'),
        isPublished: true,
        readingTime: 8,
        sortOrder: 0,
      },
      {
        title: 'The Case for AI in Insurance',
        slug: 'the-case-for-ai-in-insurance',
        content: `# The Case for AI in Insurance

Insurance is not the sexiest industry for ML engineers. But if you want to build systems with immediate, measurable impact — fraud costs the global insurance industry over $80B annually — this is where the stakes are real.

## The Fraud Detection Challenge

When I joined AXA Mansard, the fraud investigation team was working with a 3-hour average response time. The existing system was rule-based and completely blind to novel fraud patterns.

## Building Real-Time Detection

We rebuilt the pipeline around event streaming: Claims Event → Kafka Topic → PySpark Streaming → ML Scoring → AWS Lambda → Alert.

Using an ensemble of gradient boosting, autoencoders, and graph-based features, we reduced average response time from 3 hours to 5 minutes.

## Results

Cross-sell recommendation engine: 30% improvement. Fraud detection: response time from 3 hours to 5 minutes. Recommendation engine: 45%+ increase in transactions.`,
        abstract: 'How ML transformed fraud detection and customer engagement at AXA Mansard — from 3-hour response windows to 5-minute alerts, and a 45% lift in transactions.',
        tags: ['Insurance', 'Fraud Detection', 'Machine Learning', 'Industry'],
        type: 'article',
        publishedDate: new Date('2024-01-15'),
        isPublished: true,
        readingTime: 6,
        sortOrder: 1,
      },
      {
        title: 'Why I Mentor: Investing in People as a Technical Leader',
        slug: 'why-i-mentor-investing-in-people',
        content: `# Why I Mentor: Investing in People as a Technical Leader

People ask me why I spend 10+ hours a week on mentoring when I'm also pursuing a PhD, leading a company, and running active research. The answer is simple: it's not charity. It's fuel.

## What Watching People Break Limitations Does to You

I have invested in many people's careers — people who were told they couldn't, who doubted themselves. Watching them get their first data science job, publish their first paper — there is no metric for what that does to you.

## NSBE and the Power of Community

Serving as President of the NSBE chapter at UA Little Rock isn't just a leadership role. Black engineers are underrepresented in AI research and leadership. That's not an abstract statistic to me.

## The Investment Mindset

I think of mentoring as compound interest. The time I put into someone today returns — in ways I can't predict — for years.`,
        abstract: 'On the philosophy of growing others, building community, and why watching people break their limitations fuels everything I build.',
        tags: ['Leadership', 'Mentoring', 'Community', 'NSBE'],
        type: 'article',
        publishedDate: new Date('2025-03-10'),
        isPublished: true,
        readingTime: 5,
        sortOrder: 2,
      },
    ],
  });

  // Leadership Roles
  await prisma.leadershipRole.createMany({
    data: [
      {
        title: 'President',
        organization: 'National Society of Black Engineers (NSBE) — UA Little Rock',
        description: 'Leading the NSBE chapter at UA Little Rock, building community for Black engineers, organizing career development programs, and fostering a culture of excellence and mutual support. RSO President of the Year 2026 and RSO of the Year 2026.',
        accentColor: 'cyan',
        sortOrder: 0,
      },
      {
        title: 'CTO',
        organization: 'Kairos Nexus Global',
        description: 'Chief Technology Officer at Kairos Nexus Global, leading the technical vision, architecture decisions, and engineering team. Building AI-first products at the intersection of innovation and impact.',
        accentColor: 'green',
        link: 'https://www.kairosng.com',
        sortOrder: 1,
      },
      {
        title: 'Student Vice President',
        organization: 'Phi Kappa Phi Honor Society — UA Little Rock',
        description: 'Serving as Student Vice President of the Phi Kappa Phi Honor Society chapter, recognizing and promoting academic excellence across all disciplines.',
        accentColor: 'amber',
        sortOrder: 2,
      },
      {
        title: 'Board Member',
        organization: 'Create Little Rock',
        description: 'Contributing to Create Little Rock as a board member, supporting initiatives that foster creativity, entrepreneurship, and economic development in the Little Rock community.',
        accentColor: 'cyan',
        sortOrder: 3,
      },
      {
        title: 'Incoming PhD Data Science Intern',
        organization: 'HERE Technologies',
        description: 'Selected as an incoming PhD Data Science Intern at HERE Technologies, applying advanced ML and data science techniques to location intelligence and mapping challenges.',
        accentColor: 'green',
        sortOrder: 4,
      },
    ],
  });

  // Awards
  await prisma.award.createMany({
    data: [
      { title: 'Pava La Pere Innovation Award Recipient — $50,000 Non-Dilutive Grant', year: '2026', sortOrder: 0 },
      { title: 'NSBE 25 Under 25 Honor Award', year: '2026', sortOrder: 1 },
      { title: 'NVIDIA Academic Research Grant', year: '2026', sortOrder: 2 },
      { title: 'Amazon ABW Grant', year: '2025', sortOrder: 3 },
      { title: 'RSO President of the Year', year: '2026', sortOrder: 4 },
      { title: 'RSO of the Year', year: '2026', sortOrder: 5 },
    ],
  });

  // Certifications
  await prisma.certification.createMany({
    data: [
      { title: 'Microsoft Certified: Fabric Analytics Engineer', certId: '3A3B69FC92AA3659', sortOrder: 0 },
      { title: 'NVIDIA Deep Learning by using PowerAI', certId: 'M0S7oiZMQcO9R966P9O6-Q', sortOrder: 1 },
      { title: '2022 MT Scholar', certId: '0.07% acceptance rate', sortOrder: 2 },
    ],
  });

  // Skills
  await prisma.skill.createMany({
    data: [
      // Core ML
      { name: 'Python', category: 'core_ml', sortOrder: 0 },
      { name: 'PyTorch', category: 'core_ml', sortOrder: 1 },
      { name: 'TensorFlow', category: 'core_ml', sortOrder: 2 },
      { name: 'Keras', category: 'core_ml', sortOrder: 3 },
      { name: 'Deep Learning', category: 'core_ml', sortOrder: 4 },
      { name: 'NLP', category: 'core_ml', sortOrder: 5 },
      { name: 'Computer Vision', category: 'core_ml', sortOrder: 6 },
      { name: 'Time Series Modeling', category: 'core_ml', sortOrder: 7 },
      // AI Systems
      { name: 'LangChain', category: 'ai_systems', sortOrder: 0 },
      { name: 'RAG', category: 'ai_systems', sortOrder: 1 },
      { name: 'LLMs', category: 'ai_systems', sortOrder: 2 },
      { name: 'Agentic AI', category: 'ai_systems', sortOrder: 3 },
      { name: 'Prompt Engineering', category: 'ai_systems', sortOrder: 4 },
      { name: 'Copilot Studio', category: 'ai_systems', sortOrder: 5 },
      // Data
      { name: 'SQL', category: 'data', sortOrder: 0 },
      { name: 'Spark', category: 'data', sortOrder: 1 },
      { name: 'Snowflake', category: 'data', sortOrder: 2 },
      { name: 'BigQuery', category: 'data', sortOrder: 3 },
      { name: 'Hadoop', category: 'data', sortOrder: 4 },
      { name: 'Power BI', category: 'data', sortOrder: 5 },
      { name: 'Tableau', category: 'data', sortOrder: 6 },
      // Infrastructure
      { name: 'AWS', category: 'infrastructure', sortOrder: 0 },
      { name: 'Docker', category: 'infrastructure', sortOrder: 1 },
      { name: 'SageMaker', category: 'infrastructure', sortOrder: 2 },
      { name: 'Lambda', category: 'infrastructure', sortOrder: 3 },
      { name: 'EventBridge', category: 'infrastructure', sortOrder: 4 },
      { name: 'Azure DevOps', category: 'infrastructure', sortOrder: 5 },
      { name: 'Git', category: 'infrastructure', sortOrder: 6 },
    ],
  });

  // Stats
  await prisma.stat.createMany({
    data: [
      { value: '5', suffix: '+', label: 'YEARS IN ML/AI', color: 'cyan', sortOrder: 0 },
      { value: '4', suffix: '', label: 'PUBLICATIONS', color: 'green', sortOrder: 1 },
      { value: '6', suffix: '', label: 'AWARDS 2025-26', color: 'amber', sortOrder: 2 },
      { value: '0.07', suffix: '%', label: 'MT SCHOLAR RATE', color: 'cyan', sortOrder: 3 },
    ],
  });

  // Ticker Items
  await prisma.tickerItem.createMany({
    data: [
      { text: 'NVIDIA ACADEMIC RESEARCH GRANT — ACTIVE', color: 'var(--green)', sortOrder: 0 },
      { text: 'PHD CANDIDATE • UNIVERSITY OF ARKANSAS AT LITTLE ROCK • GPA 4.0/4.0', color: 'var(--cyan)', sortOrder: 1 },
      { text: 'PAVA LA PERE INNOVATION AWARD — $50K NON-DILUTIVE GRANT', color: 'var(--amber)', sortOrder: 2 },
      { text: 'CTO • KAIROS NEXUS GLOBAL • KAIROSNG.COM', color: 'var(--cyan)', sortOrder: 3 },
      { text: 'NSBE 25 UNDER 25 HONOR AWARD 2026', color: 'var(--green)', sortOrder: 4 },
      { text: 'INCOMING PHD DATA SCIENCE INTERN • HERE TECHNOLOGIES', color: 'var(--amber)', sortOrder: 5 },
      { text: '4 PUBLICATIONS • 6 AWARDS 2025-26 • RSO PRESIDENT OF THE YEAR', color: 'var(--cyan)', sortOrder: 6 },
      { text: '2022 MT SCHOLAR • 0.07% ACCEPTANCE RATE', color: 'var(--amber)', sortOrder: 7 },
    ],
  });

  console.log('Seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
