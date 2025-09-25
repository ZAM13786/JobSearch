import Dexie from 'dexie'

export const db = new Dexie('TalentFlowDB')

db.version(1).stores({
  jobs: '++id, title, slug, status, createdAt, order, tags',
  candidates: '++id, name, email, jobId, stage, createdAt',
  assessments: '++id, jobId, title, questions, createdAt',
  candidateNotes: '++id, candidateId, content, createdAt, author',
  assessmentResponses: '++id, candidateId, assessmentId, responses, submittedAt',
  candidateTimeline: '++id, candidateId, stage, timestamp, notes'
})

// Add version 2 to ensure proper indexing
db.version(2).stores({
  jobs: '++id, title, slug, status, createdAt, order, tags',
  candidates: '++id, name, email, jobId, stage, createdAt',
  assessments: '++id, jobId, title, questions, createdAt',
  candidateNotes: '++id, candidateId, content, createdAt, author',
  assessmentResponses: '++id, candidateId, assessmentId, responses, submittedAt',
  candidateTimeline: '++id, candidateId, stage, timestamp, notes'
})

// Seed initial data with exact requirements from assignment
db.on('ready', async () => {
  const jobCount = await db.jobs.count()
  
  if (jobCount === 0) {
    // Seed 25 jobs (mixed active/archived) as required
    const jobs = Array.from({ length: 25 }, (_, i) => ({
      title: `${['Senior', 'Junior', 'Mid-level', 'Lead', 'Staff'][i % 5]} ${['Frontend Developer', 'Backend Engineer', 'Full Stack Developer', 'Product Manager', 'UI/UX Designer', 'Data Scientist', 'DevOps Engineer', 'Mobile Developer', 'QA Engineer', 'Technical Writer'][i % 10]}`,
      slug: `job-${i + 1}`,
      description: `Join our team as a ${['Senior', 'Junior', 'Mid-level', 'Lead', 'Staff'][i % 5]} professional. We're looking for talented individuals to help build amazing products.`,
      status: Math.random() > 0.4 ? 'active' : 'archived', // Mixed active/archived
      tags: ['Engineering', 'Full-time', 'Remote', 'Onsite', 'Contract', 'Senior Level', 'Junior Level'].slice(0, Math.floor(Math.random() * 4) + 1),
      requirements: ['Bachelor\'s degree', '3+ years experience', 'Technical proficiency', 'Team collaboration'],
      salary: `$${60000 + Math.floor(Math.random() * 80000)}`,
      location: ['New York', 'San Francisco', 'Remote', 'London', 'Austin', 'Seattle', 'Boston'][Math.floor(Math.random() * 7)],
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
      order: i
    }))
    
    await db.jobs.bulkAdd(jobs)
    
    // Seed 1000+ candidates as required
    const stages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected']
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emma', 'Chris', 'Lisa', 'Tom', 'Anna', 'Mark', 'Kate', 'Ryan', 'Amy', 'Jake', 'Mary', 'Paul', 'Lucy', 'Sam', 'Beth']
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']
    
    const candidates = Array.from({ length: 1200 }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      return {
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        jobId: Math.floor(Math.random() * 25) + 1, // Randomly assigned to jobs
        stage: stages[Math.floor(Math.random() * stages.length)], // Randomly distributed across stages
        resume: `https://example.com/resume-${i}.pdf`,
        experience: `${Math.floor(Math.random() * 10) + 1} years`,
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker', 'Git', 'Agile', 'TypeScript'].slice(0, Math.floor(Math.random() * 6) + 2),
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date()
      }
    })
    
    const candidateIds = await db.candidates.bulkAdd(candidates)
    
    // Seed timeline entries for candidates using actual IDs
    const timelineEntries = candidateIds.map((candidateId, index) => ({
      candidateId: candidateId,
      stage: candidates[index].stage,
      timestamp: candidates[index].createdAt,
      notes: 'Application submitted'
    }))
    await db.candidateTimeline.bulkAdd(timelineEntries)
    
    // Seed at least 3 assessments with 10+ questions each as required
    const assessments = [
      {
        jobId: 1,
        title: 'Frontend Developer Technical Assessment',
        description: 'Comprehensive technical evaluation for frontend development skills',
        questions: [
          { id: 1, type: 'single-choice', question: 'What is React?', options: ['Library', 'Framework', 'Language', 'Database'], required: true },
          { id: 2, type: 'multi-choice', question: 'Which are JavaScript frameworks?', options: ['React', 'Vue', 'Angular', 'Laravel', 'Django'], required: true },
          { id: 3, type: 'text', question: 'Describe your experience with JavaScript', maxLength: 500, required: true },
          { id: 4, type: 'textarea', question: 'Explain the difference between var, let, and const', required: true },
          { id: 5, type: 'number', question: 'How many years of React experience do you have?', min: 0, max: 20, required: true },
          { id: 6, type: 'single-choice', question: 'Which CSS preprocessor do you prefer?', options: ['Sass', 'Less', 'Stylus', 'PostCSS'], required: false },
          { id: 7, type: 'file', question: 'Upload a sample of your code', required: false },
          { id: 8, type: 'text', question: 'What is your favorite development tool?', required: false },
          { id: 9, type: 'multi-choice', question: 'Which testing frameworks have you used?', options: ['Jest', 'Mocha', 'Cypress', 'Selenium', 'Puppeteer'], required: false },
          { id: 10, type: 'textarea', question: 'Describe a challenging project you worked on', required: true },
          { id: 11, type: 'single-choice', question: 'How do you handle state management?', options: ['Redux', 'Context API', 'Zustand', 'MobX'], required: true },
          { id: 12, type: 'number', question: 'Rate your CSS skills (1-10)', min: 1, max: 10, required: true }
        ],
        createdAt: new Date()
      },
      {
        jobId: 2,
        title: 'Backend Engineer System Design Assessment',
        description: 'Evaluate system design and backend development capabilities',
        questions: [
          { id: 1, type: 'textarea', question: 'Design a scalable URL shortener like bit.ly', required: true },
          { id: 2, type: 'single-choice', question: 'Which database would you choose for high-read workloads?', options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'], required: true },
          { id: 3, type: 'multi-choice', question: 'Which caching strategies have you implemented?', options: ['Redis', 'Memcached', 'CDN', 'Application-level', 'Database'], required: true },
          { id: 4, type: 'text', question: 'What is your preferred programming language for backend?', required: true },
          { id: 5, type: 'textarea', question: 'Explain microservices architecture', required: true },
          { id: 6, type: 'single-choice', question: 'Which message queue would you use?', options: ['RabbitMQ', 'Apache Kafka', 'AWS SQS', 'Redis Pub/Sub'], required: true },
          { id: 7, type: 'number', question: 'Years of experience with cloud platforms', min: 0, max: 15, required: true },
          { id: 8, type: 'multi-choice', question: 'Which cloud services have you used?', options: ['AWS', 'Azure', 'GCP', 'Digital Ocean', 'Heroku'], required: true },
          { id: 9, type: 'textarea', question: 'How do you ensure API security?', required: true },
          { id: 10, type: 'file', question: 'Upload system design diagram', required: false },
          { id: 11, type: 'single-choice', question: 'Preferred containerization tool', options: ['Docker', 'Podman', 'LXC', 'rkt'], required: true },
          { id: 12, type: 'text', question: 'Most complex system you have designed', required: true }
        ],
        createdAt: new Date()
      },
      {
        jobId: 3,
        title: 'Product Manager Strategy Assessment',
        description: 'Evaluate product management skills and strategic thinking',
        questions: [
          { id: 1, type: 'textarea', question: 'How would you prioritize features for a new mobile app?', required: true },
          { id: 2, type: 'single-choice', question: 'Which framework do you use for product strategy?', options: ['Jobs-to-be-Done', 'OKRs', 'RICE', 'Kano Model'], required: true },
          { id: 3, type: 'multi-choice', question: 'Which metrics are most important for SaaS products?', options: ['CAC', 'LTV', 'Churn Rate', 'MRR', 'DAU', 'NPS'], required: true },
          { id: 4, type: 'text', question: 'Describe your experience with A/B testing', required: true },
          { id: 5, type: 'textarea', question: 'How do you gather and validate user requirements?', required: true },
          { id: 6, type: 'number', question: 'How many product launches have you managed?', min: 0, max: 50, required: true },
          { id: 7, type: 'single-choice', question: 'Preferred user research method', options: ['Interviews', 'Surveys', 'Analytics', 'Usability Testing'], required: true },
          { id: 8, type: 'multi-choice', question: 'Which tools do you use for product management?', options: ['Jira', 'Asana', 'Trello', 'Notion', 'Linear', 'ProductPlan'], required: true },
          { id: 9, type: 'textarea', question: 'Describe a product failure and lessons learned', required: true },
          { id: 10, type: 'file', question: 'Upload a product roadmap sample', required: false },
          { id: 11, type: 'text', question: 'How do you work with engineering teams?', required: true },
          { id: 12, type: 'single-choice', question: 'Most important skill for a PM', options: ['Communication', 'Analytics', 'Technical Knowledge', 'User Empathy'], required: true }
        ],
        createdAt: new Date()
      }
    ]
    
    await db.assessments.bulkAdd(assessments)
    
    // Check for duplicates after seeding
    await checkForDuplicates()
  }
})

// Function to clear and reseed database (for debugging)
export const clearAndReseed = async () => {
  await db.delete()
  console.log('Database cleared. Refresh the page to reseed.')
}

// Function to check for duplicate candidates
export const checkForDuplicates = async () => {
  const candidates = await db.candidates.toArray()
  const ids = candidates.map(c => c.id)
  const uniqueIds = new Set(ids)
  console.log(`Total candidates: ${candidates.length}, Unique IDs: ${uniqueIds.size}`)
  if (ids.length !== uniqueIds.size) {
    console.warn('Duplicate candidate IDs found!')
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index)
    console.log('Duplicate IDs:', duplicates)
  }
}

export default db
