import { rest } from 'msw'
import { api } from '../service/api'

export const handlers = [
  // Jobs endpoints
  rest.get('/jobs', async (req, res, ctx) => {
    try {
      const url = new URL(req.url)
      const params = {
        page: url.searchParams.get('page'),
        pageSize: url.searchParams.get('pageSize'),
        status: url.searchParams.get('status'),
        search: url.searchParams.get('search'),
        sort: url.searchParams.get('sort')
      }
      
      const result = await api.getJobs(params)
      return res(ctx.json(result))
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }))
    }
  }),

  rest.get('/jobs/:id', async (req, res, ctx) => {
    try {
      const job = await api.getJob(req.params.id)
      if (!job) {
        return res(ctx.status(404), ctx.json({ error: 'Job not found' }))
      }
      return res(ctx.json(job))
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }))
    }
  }),

  rest.post('/jobs', async (req, res, ctx) => {
    try {
      const jobData = await req.json()
      const job = await api.createJob(jobData)
      return res(ctx.status(201), ctx.json(job))
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }))
    }
  }),

  rest.patch('/jobs/:id', async (req, res, ctx) => {
    try {
      const updates = await req.json()
      const job = await api.updateJob(req.params.id, updates)
      return res(ctx.json(job))
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }))
    }
  }),

  rest.patch('/jobs/:id/reorder', async (req, res, ctx) => {
    try {
      const { fromOrder, toOrder } = await req.json()
      const jobs = await api.reorderJobs(fromOrder, toOrder)
      return res(ctx.json(jobs))
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }))
    }
  }),

  // Candidates endpoints
  rest.get('/candidates', async (req, res, ctx) => {
    try {
      const url = new URL(req.url)
      const params = {
        stage: url.searchParams.get('stage'),
        search: url.searchParams.get('search'),
        page: url.searchParams.get('page'),
        pageSize: url.searchParams.get('pageSize'),
        jobId: url.searchParams.get('jobId')
      }
      
      const result = await api.getCandidates(params)
      return res(ctx.json(result))
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }))
    }
  }),

  rest.get('/candidates/:id', async (req, res, ctx) => {
    try {
      const candidate = await api.getCandidate(req.params.id)
      if (!candidate) {
        return res(ctx.status(404), ctx.json({ error: 'Candidate not found' }))
      }
      return res(ctx.json(candidate))
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }))
    }
  }),

  rest.post('/candidates', async (req, res, ctx) => {
    try {
      const candidateData = await req.json()
      const candidate = await api.createCandidate(candidateData)
      return res(ctx.status(201), ctx.json(candidate))
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }))
    }
  }),

  rest.patch('/candidates/:id', async (req, res, ctx) => {
    try {
      const updates = await req.json()
      const candidate = await api.updateCandidate(req.params.id, updates)
      return res(ctx.json(candidate))
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }))
    }
  }),

  rest.get('/candidates/:id/timeline', async (req, res, ctx) => {
    try {
      const timeline = await api.getCandidateTimeline(req.params.id)
      return res(ctx.json(timeline))
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }))
    }
  }),

  // Assessments endpoints
  rest.get('/assessments/:jobId', async (req, res, ctx) => {
    try {
      const assessments = await api.getAssessments(req.params.jobId)
      return res(ctx.json(assessments))
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }))
    }
  }),

  rest.put('/assessments/:jobId', async (req, res, ctx) => {
    try {
      const assessmentData = await req.json()
      const assessment = await api.updateAssessment(req.params.jobId, assessmentData)
      return res(ctx.json(assessment))
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }))
    }
  }),

  rest.post('/assessments/:jobId/submit', async (req, res, ctx) => {
    try {
      const { candidateId, responses } = await req.json()
      const result = await api.submitAssessmentResponse(req.params.jobId, candidateId, responses)
      return res(ctx.json(result))
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }))
    }
  })
]
