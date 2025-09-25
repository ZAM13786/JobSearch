import { db } from './storage'

// Inject artificial latency (200–1200ms) and 5–10% error rate as required
const delay = () => new Promise(resolve => 
  setTimeout(resolve, 200 + Math.random() * 1000)
)

const shouldFail = () => Math.random() < 0.08 // 8% error rate

export const api = {
  // Jobs API - GET /jobs?search=&status=&page=&pageSize=&sort=
  async getJobs(params = {}) {
    await delay()
    if (shouldFail()) throw new Error('Network error')
    
    let jobs = await db.jobs.orderBy('order').toArray()
    
    // Apply filters
    if (params.status && params.status !== 'all') {
      jobs = jobs.filter(job => job.status === params.status)
    }
    
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }
    
    // Apply sorting
    if (params.sort) {
      const [field, direction] = params.sort.split('-')
      jobs.sort((a, b) => {
        const aVal = a[field] || ''
        const bVal = b[field] || ''
        return direction === 'desc' 
          ? bVal.localeCompare(aVal) 
          : aVal.localeCompare(bVal)
      })
    }
    
    // Apply pagination
    const page = parseInt(params.page) || 1
    const pageSize = parseInt(params.pageSize) || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      jobs: jobs.slice(start, end),
      total: jobs.length,
      page,
      totalPages: Math.ceil(jobs.length / pageSize),
      pageSize
    }
  },

  async getJob(id) {
    await delay()
    if (shouldFail()) throw new Error('Network error')
    return await db.jobs.get(parseInt(id))
  },

  // POST /jobs
  async createJob(jobData) {
    await delay()
    if (shouldFail()) throw new Error('Failed to create job')
    
    const job = {
      ...jobData,
      slug: jobData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      createdAt: new Date(),
      order: await db.jobs.count()
    }
    
    const id = await db.jobs.add(job)
    return await db.jobs.get(id)
  },

  // PATCH /jobs/:id
  async updateJob(id, updates) {
    await delay()
    if (shouldFail()) throw new Error('Failed to update job')
    
    await db.jobs.update(parseInt(id), {
      ...updates,
      updatedAt: new Date()
    })
    return await db.jobs.get(parseInt(id))
  },

  // PATCH /jobs/:id/reorder - occasionally return 500 to test rollback
  async reorderJobs(fromOrder, toOrder) {
    await delay()
    if (Math.random() < 0.15) throw new Error('Reorder failed - testing rollback') // 15% failure for rollback testing
    
    const jobs = await db.jobs.orderBy('order').toArray()
    
    // Update order for affected jobs
    if (fromOrder < toOrder) {
      // Moving down
      for (const job of jobs) {
        if (job.order > fromOrder && job.order <= toOrder) {
          await db.jobs.update(job.id, { order: job.order - 1 })
        } else if (job.order === fromOrder) {
          await db.jobs.update(job.id, { order: toOrder })
        }
      }
    } else {
      // Moving up
      for (const job of jobs) {
        if (job.order >= toOrder && job.order < fromOrder) {
          await db.jobs.update(job.id, { order: job.order + 1 })
        } else if (job.order === fromOrder) {
          await db.jobs.update(job.id, { order: toOrder })
        }
      }
    }
    
    return await db.jobs.orderBy('order').toArray()
  },

  // GET /candidates?search=&stage=&page=
  async getCandidates(params = {}) {
    await delay()
    if (shouldFail()) throw new Error('Network error')
    
    let candidates = await db.candidates.orderBy('createdAt').reverse().toArray()
    
    // Apply filters
    if (params.stage && params.stage !== 'all') {
      candidates = candidates.filter(candidate => candidate.stage === params.stage)
    }
    
    if (params.search) {
      const search = params.search.toLowerCase()
      candidates = candidates.filter(candidate => 
        candidate.name.toLowerCase().includes(search) ||
        candidate.email.toLowerCase().includes(search)
      )
    }
    
    if (params.jobId) {
      candidates = candidates.filter(candidate => candidate.jobId === parseInt(params.jobId))
    }
    
    // Apply pagination for virtualized list support
    const page = parseInt(params.page) || 1
    const pageSize = parseInt(params.pageSize) || 50
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      candidates: candidates.slice(start, end),
      total: candidates.length,
      page,
      totalPages: Math.ceil(candidates.length / pageSize)
    }
  },

  async getCandidate(id) {
    await delay()
    if (shouldFail()) throw new Error('Network error')
    return await db.candidates.get(parseInt(id))
  },

  // POST /candidates
  async createCandidate(candidateData) {
    await delay()
    if (shouldFail()) throw new Error('Failed to create candidate')
    
    const candidate = {
      ...candidateData,
      createdAt: new Date(),
      lastUpdated: new Date()
    }
    
    const id = await db.candidates.add(candidate)
    
    // Add to timeline
    await db.candidateTimeline.add({
      candidateId: id,
      stage: candidate.stage,
      timestamp: new Date(),
      notes: 'Application submitted'
    })
    
    return await db.candidates.get(id)
  },

  // PATCH /candidates/:id (stage transitions)
  async updateCandidate(id, updates) {
    await delay()
    if (shouldFail()) throw new Error('Failed to update candidate')
    
    const oldCandidate = await db.candidates.get(parseInt(id))
    const candidate = {
      ...updates,
      lastUpdated: new Date()
    }
    
    await db.candidates.update(parseInt(id), candidate)
    
    // Add to timeline if stage changed
    if (updates.stage && updates.stage !== oldCandidate.stage) {
      await db.candidateTimeline.add({
        candidateId: parseInt(id),
        stage: updates.stage,
        timestamp: new Date(),
        notes: `Moved to ${updates.stage} stage`
      })
    }
    
    return await db.candidates.get(parseInt(id))
  },

  // GET /candidates/:id/timeline
  async getCandidateTimeline(id) {
    await delay()
    if (shouldFail()) throw new Error('Network error')
    return await db.candidateTimeline
      .where('candidateId')
      .equals(parseInt(id))
      .orderBy('timestamp')
      .toArray()
  },

  // GET /assessments/:jobId
  async getAssessments(jobId) {
    await delay()
    if (shouldFail()) throw new Error('Network error')
    
    if (jobId) {
      return await db.assessments.where('jobId').equals(parseInt(jobId)).toArray()
    }
    
    return await db.assessments.toArray()
  },

  // PUT /assessments/:jobId
  async updateAssessment(jobId, assessmentData) {
    await delay()
    if (shouldFail()) throw new Error('Failed to update assessment')
    
    const assessment = {
      ...assessmentData,
      jobId: parseInt(jobId),
      updatedAt: new Date()
    }
    
    const existing = await db.assessments.where('jobId').equals(parseInt(jobId)).first()
    
    if (existing) {
      await db.assessments.update(existing.id, assessment)
      return await db.assessments.get(existing.id)
    } else {
      assessment.createdAt = new Date()
      const id = await db.assessments.add(assessment)
      return await db.assessments.get(id)
    }
  },

  // POST /assessments/:jobId/submit (store response locally)
  async submitAssessmentResponse(jobId, candidateId, responses) {
    await delay()
    if (shouldFail()) throw new Error('Failed to submit assessment')
    
    const response = {
      candidateId: parseInt(candidateId),
      assessmentId: parseInt(jobId), // Using jobId as assessmentId for simplicity
      responses,
      submittedAt: new Date()
    }
    
    const id = await db.assessmentResponses.add(response)
    return await db.assessmentResponses.get(id)
  }
}
