import React, { useState, useMemo, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import { api } from './service/api'
import './styles/global.css'

// Sample jobs data (assuming it's fetched from api or defined elsewhere)
const sampleJobs = [
  { id: 1, title: 'Senior Frontend Developer', status: 'active', location: 'Remote', salary: '$90,000 - $120,000', tags: ['React', 'JavaScript'] },
  { id: 2, title: 'Product Manager', status: 'active', location: 'San Francisco', salary: '$110,000 - $140,000', tags: ['Strategy', 'Analytics'] },
  { id: 3, title: 'UI/UX Designer', status: 'archived', location: 'New York', salary: '$70,000 - $95,000', tags: ['Design', 'Figma'] },
  { id: 4, title: 'Backend Engineer', status: 'active', location: 'Austin', salary: '$85,000 - $115,000', tags: ['Node.js', 'APIs'] },
  { id: 5, title: 'DevOps Engineer', status: 'active', location: 'Remote', salary: '$95,000 - $125,000', tags: ['AWS', 'Docker'] },
  { id: 6, title: 'Data Scientist', status: 'active', location: 'Seattle', salary: '$100,000 - $130,000', tags: ['Python', 'ML'] },
  { id: 7, title: 'Mobile Developer', status: 'active', location: 'Los Angeles', salary: '$80,000 - $110,000', tags: ['React Native', 'Flutter'] },
  { id: 8, title: 'QA Engineer', status: 'active', location: 'Chicago', salary: '$65,000 - $85,000', tags: ['Testing', 'Automation'] },
  { id: 9, title: 'Technical Writer', status: 'archived', location: 'Boston', salary: '$55,000 - $75,000', tags: ['Documentation', 'Communication'] },
  { id: 10, title: 'Security Engineer', status: 'active', location: 'Denver', salary: '$105,000 - $135,000', tags: ['Security', 'Compliance'] },
  { id: 11, title: 'Machine Learning Engineer', status: 'active', location: 'Remote', salary: '$110,000 - $140,000', tags: ['ML', 'Python'] },
  { id: 12, title: 'Sales Manager', status: 'active', location: 'Miami', salary: '$85,000 - $115,000', tags: ['Sales', 'Leadership'] },
  { id: 13, title: 'Marketing Specialist', status: 'active', location: 'Atlanta', salary: '$50,000 - $70,000', tags: ['Marketing', 'Digital'] },
  { id: 14, title: 'Business Analyst', status: 'active', location: 'Toronto', salary: '$70,000 - $90,000', tags: ['Analysis', 'Strategy'] },
  { id: 15, title: 'Cloud Architect', status: 'active', location: 'London', salary: '$120,000 - $150,000', tags: ['AWS', 'Architecture'] }
]


// Generate 1000+ candidates as required by the technical assignment
function generateCandidates() {
  const firstNames = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Chris', 'Lisa', 'Tom', 'Anna',
    'Mark', 'Kate', 'Ryan', 'Amy', 'Jake', 'Mary', 'Paul', 'Lucy', 'Sam', 'Beth',
    'Alex', 'Grace', 'Josh', 'Zoe', 'Matt', 'Claire', 'Ben', 'Lily', 'Nick', 'Eva',
    'Luke', 'Mia', 'Dan', 'Ella', 'Max', 'Chloe', 'Noah', 'Ava', 'Owen', 'Ruby',
    'Leo', 'Ivy', 'Adam', 'Maya', 'Jack', 'Nora', 'Liam', 'Sophia', 'Mason', 'Zara',
    'Ethan', 'Isabella', 'Oliver', 'Charlotte', 'James', 'Amelia', 'Benjamin', 'Harper',
    'Lucas', 'Evelyn', 'Henry', 'Abigail', 'Theodore', 'Emily', 'William', 'Elizabeth'
  ]

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
    'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
    'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
    'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker'
  ]

  const skills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'SQL', 'MongoDB',
    'AWS', 'Docker', 'Kubernetes', 'Git', 'Agile', 'TypeScript', 'Vue.js', 'Angular',
    'Express.js', 'PostgreSQL', 'Redis', 'GraphQL', 'REST API', 'Microservices',
    'DevOps', 'CI/CD', 'Jenkins', 'Terraform', 'Linux', 'Bash', 'PowerShell',
    'Machine Learning', 'Data Science', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch',
    'UI/UX Design', 'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator',
    'Project Management', 'Scrum', 'Kanban', 'Jira', 'Confluence', 'Slack',
    'Marketing', 'SEO', 'Google Analytics', 'Content Writing', 'Social Media'
  ]

  const stages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected']
  const locations = [
    'New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Austin', 'Seattle',
    'Boston', 'Denver', 'Atlanta', 'Miami', 'Remote', 'London', 'Toronto'
  ]

  return Array.from({ length: 1200 }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const candidateSkills = []
    
    // Generate 2-8 random skills per candidate
    for (let j = 0; j < Math.floor(Math.random() * 7) + 2; j++) {
      const skill = skills[Math.floor(Math.random() * skills.length)]
      if (!candidateSkills.includes(skill)) {
        candidateSkills.push(skill)
      }
    }

    return {
      id: i + 1,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@example.com`,
      phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      jobId: Math.floor(Math.random() * 15) + 1,
      jobTitle: sampleJobs[Math.floor(Math.random() * sampleJobs.length)]?.title || 'Software Engineer',
      stage: stages[Math.floor(Math.random() * stages.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      experience: `${Math.floor(Math.random() * 15) + 1} years`,
      skills: candidateSkills,
      salary: `$${50000 + Math.floor(Math.random() * 100000)}`,
      resume: `https://example.com/resume-${i + 1}.pdf`,
      appliedDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`
    }
  })
}

// Job Form Modal Component
function JobFormModal({ isOpen, onClose, job, onSave }) {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    location: job?.location || '',
    salary: job?.salary || '',
    status: job?.status || 'active'
  })

  // IMPROVEMENT: Reset form state when job prop changes
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        location: job.location,
        salary: job.salary,
        status: job.status,
      });
    } else {
      setFormData({ title: '', location: '', salary: '', status: 'active' });
    }
  }, [job]);


  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{job ? 'Edit Job' : 'Create New Job'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label">Job Title</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-input"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Salary Range</label>
            <input
              type="text"
              className="form-input"
              value={formData.salary}
              onChange={(e) => setFormData({...formData, salary: e.target.value})}
              required
            />
          </div>
          <div className="mb-6">
            <label className="form-label">Status</label>
            <select
              className="form-input"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex space-x-3">
            <button type="submit" className="btn btn-primary flex-1">
              {job ? 'Update Job' : 'Create Job'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Map UI stage labels to API values
const mapStageToApi = (stage) => {
    const mapping = {
      'Applied': 'applied',
      'Screening': 'screen',
      'Interview': 'tech',
      'Offer': 'offer',
      'Hired': 'hired',
      'Rejected': 'rejected',
    }
    return mapping[stage] || stage
}

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [jobs, setJobs] = useState([])
  const [jobsPage, setJobsPage] = useState(1)
  const [jobsTotalPages, setJobsTotalPages] = useState(1)
  const [jobSearch, setJobSearch] = useState('')
  const [jobSort, setJobSort] = useState('')
  const [jobFormModal, setJobFormModal] = useState({ isOpen: false, job: null })
  const [candidateFilter, setCandidateFilter] = useState('all')
  const [candidateSearch, setCandidateSearch] = useState('')
  const [candidates, setCandidates] = useState([])
  const [candidatesPage, setCandidatesPage] = useState(1)
  const [candidatesTotalPages, setCandidatesTotalPages] = useState(1)
  const [jobFilter, setJobFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [candidatesPerPage] = useState(50)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])
  
  // Generate candidates once and memoize (used for dashboard only)
  const allCandidates = useMemo(() => generateCandidates(), [])

  // Server-like candidates loading via API
  async function loadCandidates() {
    try {
      const result = await api.getCandidates({
        page: candidatesPage,
        pageSize: candidatesPerPage,
        stage: candidateFilter === 'all' ? 'all' : mapStageToApi(candidateFilter),
        search: candidateSearch
      })
      setCandidates(result.candidates)
      setCandidatesTotalPages(result.totalPages)
    } catch (e) {
      // ignore for now
    }
  }

  useEffect(() => {
    loadCandidates()
  }, [candidatesPage, candidateFilter, candidateSearch])

  const activeJobs = jobs.filter(job => job.status === 'active')
  const totalApplications = allCandidates.length
  const interviewStage = allCandidates.filter(c => c.stage === 'Interview' || c.stage === 'Screening').length
  const filteredJobs = jobs

  const handleJobSave = async (formData) => {
    try {
    if (jobFormModal.job) {
        await api.updateJob(jobFormModal.job.id, formData)
    } else {
        await api.createJob({ ...formData, tags: ['New'] })
      }
      await loadJobs()
    } catch (e) {
      // ignore for now
    }
  }

  const handleArchiveToggle = async (job) => {
    try {
      await api.updateJob(job.id, { status: job.status === 'active' ? 'archived' : 'active' })
      await loadJobs()
    } catch (e) {}
  }

  async function loadJobs() {
    try {
      const result = await api.getJobs({
        page: jobsPage,
        pageSize: 10,
        status: jobFilter,
        search: jobSearch,
        sort: jobSort
      })
      setJobs(result.jobs)
      setJobsTotalPages(result.totalPages)
    } catch (e) {
      // noop
    }
  }

  useEffect(() => {
    loadJobs()
  }, [jobsPage, jobFilter, jobSearch, jobSort])

  // Reset to first page when filters change
  React.useEffect(() => {
    setCandidatesPage(1)
  }, [candidateFilter, candidateSearch])

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950'>
      {/* Header */}
      <header className='bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <h1 className='text-2xl font-bold text-blue-600'>
                🎯 JobSearch
              </h1>
              <span className='ml-2 text-sm text-gray-500 dark:text-gray-400'>Mini Hiring Platform</span>
            </div>
            <div>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className='px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                aria-label='Toggle theme'
              >
                {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className='bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex space-x-8'>
            {[
              { path: '/', label: 'dashboard' },
              { path: '/jobs', label: 'jobs' },
              { path: '/candidates', label: 'candidates' },
              { path: '/assessments', label: 'assessments' }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  window.location.pathname === item.path
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <Routes>
            <Route path='/' element={
            (
            <div>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6'>Dashboard</h2>
              
              {/* Stats Cards */}
              <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
                <div className='bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border dark:border-gray-800'>
                  <div className='flex items-center'>
                    <div className='p-2 bg-blue-100 rounded-lg'>
                      <span className='text-blue-600 text-xl'>📋</span>
                    </div>
                    <div className='ml-4'>
                      <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Active Jobs</p>
                      <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{activeJobs.length}</p>
                    </div>
                  </div>
                </div>
                <div className='bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border dark:border-gray-800'>
                  <div className='flex items-center'>
                    <div className='p-2 bg-green-100 rounded-lg'>
                      <span className='text-green-600 text-xl'>👥</span>
                    </div>
                    <div className='ml-4'>
                      <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Total Candidates</p>
                      <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{totalApplications.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className='bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border dark:border-gray-800'>
                  <div className='flex items-center'>
                    <div className='p-2 bg-purple-100 rounded-lg'>
                      <span className='text-purple-600 text-xl'>📞</span>
                    </div>
                    <div className='ml-4'>
                      <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>In Process</p>
                      <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{interviewStage}</p>
                    </div>
                  </div>
                </div>
                <div className='bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border dark:border-gray-800'>
                  <div className='flex items-center'>
                    <div className='p-2 bg-orange-100 rounded-lg'>
                      <span className='text-orange-600 text-xl'>📝</span>
                    </div>
                    <div className='ml-4'>
                      <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Assessments</p>
                      <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>12</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className='bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800'>
                <div className='px-6 py-4 border-b dark:border-gray-800'>
                  <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>Recent Activity</h3>
                </div>
                <div className='p-6'>
                  <div className='space-y-4'>
                    {allCandidates.slice(0, 10).map((candidate, index) => (
                      <div key={candidate.id} className='flex items-center space-x-3'>
                        <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>
                          <span className='font-medium'>{candidate.name}</span> applied for <span className='font-medium'>{candidate.jobTitle}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            )} />

          <Route path='/jobs' element={
            <div>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-gray-900'>Jobs</h2>
                <div className='flex items-center space-x-3'>
                  <input
                    type='text'
                    placeholder='Search title or tag...'
                    value={jobSearch}
                    onChange={(e)=>{ setJobsPage(1); setJobSearch(e.target.value) }}
                    className='border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  />
                  <select
                    value={jobFilter}
                    onChange={(e) => { setJobsPage(1); setJobFilter(e.target.value) }}
                    className='border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                  <select
                    value={jobSort}
                    onChange={(e)=>{ setJobsPage(1); setJobSort(e.target.value) }}
                    className='border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  >
                    <option value=''>Sort</option>
                    <option value='title-asc'>Title A-Z</option>
                    <option value='title-desc'>Title Z-A</option>
                  </select>
                  <button
                    onClick={() => setJobFormModal({ isOpen: true, job: null })}
                    className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
                  >
                    Create New Job
                  </button>
                </div>
              </div>
              
              <div className='bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800'>
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-800'>
                    <thead className='bg-gray-50 dark:bg-gray-800 sticky top-0 z-10'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                          Job Title
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                          Location
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                          Salary
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                          Status
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                          Candidates
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800'>
                      {jobs.map((job) => {
                        const jobCandidates = allCandidates.filter(c => c.jobId === job.id)
                        return (
                          <tr key={job.id} className='hover:bg-gray-50 dark:hover:bg-gray-800'>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <Link to={`/jobs/${job.id}`} className='text-sm font-medium text-blue-600 hover:underline'>
                                {job.title}
                              </Link>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='text-sm text-gray-500 dark:text-gray-400'>{job.location}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='text-sm text-gray-500 dark:text-gray-400'>{job.salary}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                job.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {job.status}
                              </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='text-sm text-gray-900 dark:text-gray-100'>{jobCandidates.length}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                              <button
                                onClick={() => setJobFormModal({ isOpen: true, job })}
                                className='text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-4'
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleArchiveToggle(job)}
                                className='text-orange-600 hover:text-orange-900'
                              >
                                {job.status === 'active' ? 'Archive' : 'Unarchive'}
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Jobs Pagination */}
              {jobsTotalPages > 1 && (
                <div className='flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4'>
                  <div className='flex flex-1 justify-between sm:hidden'>
                    <button
                      onClick={() => setJobsPage(Math.max(1, jobsPage - 1))}
                      disabled={jobsPage === 1}
                      className='relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setJobsPage(Math.min(jobsTotalPages, jobsPage + 1))}
                      disabled={jobsPage === jobsTotalPages}
                      className='relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                    >
                      Next
                    </button>
                  </div>
                  <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
                    <div>
                      <p className='text-sm text-gray-700'>
                        Page <span className='font-medium'>{jobsPage}</span> of <span className='font-medium'>{jobsTotalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className='isolate inline-flex -space-x-px rounded-md shadow-sm' aria-label='Pagination'>
                        <button
                          onClick={() => setJobsPage(Math.max(1, jobsPage - 1))}
                          disabled={jobsPage === 1}
                          className='relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50'
                        >
                          Previous
                        </button>
                        {[...Array(jobsTotalPages)].slice(0,10).map((_, i) => {
                          const page = i + 1
                          return (
                            <button
                              key={page}
                              onClick={() => setJobsPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                jobsPage === page
                                  ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                              }`}
                            >
                              {page}
                            </button>
                          )
                        })}
                        <button
                          onClick={() => setJobsPage(Math.min(jobsTotalPages, jobsPage + 1))}
                          disabled={jobsPage === jobsTotalPages}
                          className='relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50'
                        >
                          Next
                        </button>
                      </nav>
                </div>
              </div>
            </div>
          )}
            </div>
          } />
          <Route path='/jobs/:jobId' element={<JobDetailsPage />} />

          <Route path='/candidates' element={
            <div>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-gray-900'>
                  Candidates
                </h2>
                <div className='flex space-x-2 items-center'>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    className='border border-gray-300 rounded-lg px-3 py-2 w-64'
                    value={candidateSearch}
                    onChange={(e) => setCandidateSearch(e.target.value)}
                  />
                  <select
                    value={candidateFilter}
                    onChange={(e) => setCandidateFilter(e.target.value)}
                    className='border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  >
                    <option value="all">All Stages</option>
                    <option value="Applied">Applied</option>
                    <option value="Screening">Screening</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <Link to='/candidates/kanban' className='ml-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700'>Kanban</Link>
                </div>
              </div>
              
              {/* Candidates Grid with Pagination */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6'>
                {candidates.map((candidate) => (
                  <div key={candidate.id} className='bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 p-4'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center'>
                        <span className='text-blue-600 dark:text-blue-400 font-semibold text-xs'>
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-base font-medium text-gray-900 dark:text-gray-100 truncate'>{candidate.name}</h3>
                        <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>{candidate.email}</p>
                        <p className='text-xs text-blue-600 dark:text-blue-400 truncate'>{candidate.jobTitle}</p>
                      </div>
                    </div>
                    <div className='mt-3 flex items-center justify-between'>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        candidate.stage === 'Hired' ? 'bg-green-100 text-green-800' :
                        candidate.stage === 'Offer' ? 'bg-purple-100 text-purple-800' :
                        candidate.stage === 'Interview' ? 'bg-blue-100 text-blue-800' :
                        candidate.stage === 'Screening' ? 'bg-yellow-100 text-yellow-800' :
                        candidate.stage === 'Applied' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {candidate.stage}
                      </span>
                      <Link to={`/candidates/${candidate.id}`} className='text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-xs'>
                        View Profile
                      </Link>
                    </div>
                    <div className='mt-2'>
                      <div className='flex flex-wrap gap-1'>
                        {candidate.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className='px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-[10px] rounded'>
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 3 && (
                          <span className='px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] rounded'>
                            +{candidate.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {candidatesTotalPages > 1 && (
                <div className='flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6'>
                  <div className='flex flex-1 justify-between sm:hidden'>
                    <button
                      onClick={() => setCandidatesPage(Math.max(1, candidatesPage - 1))}
                      disabled={candidatesPage === 1}
                      className='relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCandidatesPage(Math.min(candidatesTotalPages, candidatesPage + 1))}
                      disabled={candidatesPage === candidatesTotalPages}
                      className='relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                    >
                      Next
                    </button>
                  </div>
                  <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
                    <div>
                      <p className='text-sm text-gray-700'>Page <span className='font-medium'>{candidatesPage}</span> of <span className='font-medium'>{candidatesTotalPages}</span></p>
                    </div>
                    <div>
                      <nav className='isolate inline-flex -space-x-px rounded-md shadow-sm' aria-label='Pagination'>
                        <button
                          onClick={() => setCandidatesPage(Math.max(1, candidatesPage - 1))}
                          disabled={candidatesPage === 1}
                          className='relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50'
                        >
                          Previous
                        </button>
                        {[...Array(Math.min(10, candidatesTotalPages))].map((_, i) => {
                          const page = i + 1
                          return (
                            <button
                              key={page}
                              onClick={() => setCandidatesPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                candidatesPage === page
                                  ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                              }`}
                            >
                              {page}
                            </button>
                          )
                        })}
                        <button
                          onClick={() => setCandidatesPage(Math.min(candidatesTotalPages, candidatesPage + 1))}
                          disabled={candidatesPage === candidatesTotalPages}
                          className='relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50'
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
              
              <div className='mt-4 text-sm text-gray-500 text-center'>
                Total seeded: {totalApplications.toLocaleString()} candidates
              </div>
            </div>
          } />
          <Route path='/candidates/:id' element={<CandidateProfilePage />} />
          <Route path='/candidates/kanban' element={<CandidatesKanbanPage />} />

          <Route path='/assessments' element={<AssessmentsListPage />} />
          {/* IMPROVEMENT: Added new route for creating an assessment */}
          <Route path='/assessments/new' element={<CreateAssessmentPage />} />
          <Route path='/assessments/:jobId' element={<AssessmentBuilderPage />} />
          </Routes>
        </div>
      </main>

      <JobFormModal
        isOpen={jobFormModal.isOpen}
        onClose={() => setJobFormModal({ isOpen: false, job: null })}
        job={jobFormModal.job}
        onSave={handleJobSave}
      />
    </div>
  )
}

export default App

// Job Details Page


function JobDetailsPage() {


  const { jobId } = useParams()
  const [job, setJob] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let mounted = true
    const fetchJob = async () => {
      try {
        const data = await api.getJob(jobId)
        if (mounted) setJob(data)
      } catch (e) {
        if (mounted) setError('Failed to load job')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchJob()
    return () => { mounted = false }
  }, [jobId])

  if (loading) return <div className='max-w-7xl mx-auto p-6'>Loading...</div>
  if (error || !job) return <div className='max-w-7xl mx-auto p-6 text-red-600'>{error || 'Job not found'}</div>

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='mb-4'>
        <Link to='/jobs' className='text-blue-600 hover:underline'>&larr; Back to Jobs</Link>
      </div>
      <div className='bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 p-6'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{job.title}</h2>
        <div className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
          <span className='mr-3'>Status: <span className='font-medium'>{job.status}</span></span>
          <span className='mr-3'>Location: <span className='font-medium'>{job.location || '—'}</span></span>
          <span>Salary: <span className='font-medium'>{job.salary || '—'}</span></span>
        </div>
        <div className='mt-4'>
          <p className='text-gray-700 dark:text-gray-200'>{job.description || 'No description provided.'}</p>
        </div>
        {Array.isArray(job.tags) && job.tags.length > 0 && (
          <div className='mt-4 flex flex-wrap gap-2'>
            {job.tags.map((t, i) => (
              <span key={i} className='px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs'>{t}</span>
            ))}
            </div>
          )}
      </div>
    </div>
  )
}

// Candidate Profile Page with timeline
function CandidateProfilePage() {
  const { id } = useParams()
  const [candidate, setCandidate] = React.useState(null)
  const [timeline, setTimeline] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        const c = await api.getCandidate(id)
        if (!c) {
          if (mounted) setError('Candidate not found')
          return
        }
        
        // Try to get timeline, but don't fail if it's empty
        let t = []
        try {
          t = await api.getCandidateTimeline(id)
        } catch (e) {
          console.warn('Timeline not available:', e)
          t = []
        }
        
        if (mounted) {
          setCandidate(c)
          setTimeline(t)
        }
      } catch (e) {
        if (mounted) setError('Failed to load candidate')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()
    return () => { mounted = false }
  }, [id])

  if (loading) return <div className='max-w-7xl mx-auto p-6'>Loading...</div>
  if (error || !candidate) return <div className='max-w-7xl mx-auto p-6 text-red-600'>{error || 'Candidate not found'}</div>

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='mb-4'>
        <Link to='/candidates' className='text-blue-600 hover:underline'>&larr; Back to Candidates</Link>
              </div>
      <div className='bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 p-6'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{candidate.name}</h2>
        <div className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
          <span className='mr-4'>{candidate.email}</span>
          <span className='mr-4'>{candidate.phone || ''}</span>
          <span>Stage: <span className='font-medium'>{candidate.stage}</span></span>
        </div>
        <div className='mt-6'>
          <h3 className='text-lg font-semibold mb-2'>Timeline</h3>
          <ol className='relative border-s border-gray-200 dark:border-gray-800 ml-2'>
            {timeline.map(item => (
              <li key={item.id} className='mb-6 ms-4'>
                <div className='absolute w-3 h-3 bg-blue-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900'></div>
                <time className='mb-1 text-xs font-normal leading-none text-gray-400'>
                  {new Date(item.timestamp).toLocaleString()}
                </time>
                <p className='text-sm text-gray-700 dark:text-gray-200'>
                  Moved to <span className='font-medium'>{item.stage}</span> — {item.notes}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

// Kanban board for candidate stages using native DnD
function CandidatesKanbanPage() {
  const stages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected']
  const [columns, setColumns] = React.useState(() => stages.reduce((acc, s) => ({...acc, [s]: []}), {}))
  const [loading, setLoading] = React.useState(true)
  const [dragged, setDragged] = React.useState(null)
  const [error, setError] = React.useState('')
  // IMPROVEMENT: State to handle drop zone highlighting
  const [dragOverStage, setDragOverStage] = React.useState(null);


  React.useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        // Load first page per stage for demo; could be virtualized
        const results = await Promise.all(
          stages.map(stage => 
            // FIX: Use mapStageToApi to fetch candidates with the correct stage name
            api.getCandidates({ page: 1, pageSize: 50, stage: mapStageToApi(stage) })
          )
        )
        if (!mounted) return
        const next = {}
        stages.forEach((s, i) => { next[s] = results[i].candidates })
        setColumns(next)
      } catch (e) {
        if(mounted) setError('Failed to load candidates. Please check API and network.')
      } finally {
        if(mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const onDragStart = (candidate) => setDragged(candidate)
  const onDropOnStage = async (toStage) => {
    if (!dragged) return
    const fromStage = dragged.stage
    if (fromStage === toStage) return
    // Optimistic update
    setColumns(prev => {
      const fromColumn = prev[fromStage] || []
      const toColumn = prev[toStage] || []
      const removeFrom = fromColumn.filter(c => c.id !== dragged.id)
      const addTo = [{ ...dragged, stage: toStage }, ...toColumn]
      return { ...prev, [fromStage]: removeFrom, [toStage]: addTo }
    })
    try {
      await api.updateCandidate(dragged.id, { stage: mapStageToApi(toStage) })
    } catch (e) {
      // rollback
      setColumns(prev => {
        const fromColumn = prev[fromStage] || []
        const toColumn = prev[toStage] || []
        const removeFrom = toColumn.filter(c => c.id !== dragged.id)
        const addBack = [{ ...dragged }, ...fromColumn]
        return { ...prev, [toStage]: removeFrom, [fromStage]: addBack }
      })
      setError('Stage update failed. Rolled back.')
    } finally {
      setDragged(null)
    }
  }

  if (loading) return <div className='max-w-7xl mx-auto p-6'>Loading...</div>
  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='mb-4 flex items-center justify-between'>
        <Link to='/candidates' className='text-blue-600 hover:underline'>&larr; Back to Candidates</Link>
        {error && <span className='text-sm text-orange-600'>{error}</span>}
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'>
        {stages.map(stage => (
          <div key={stage}
            // IMPROVEMENT: Added drag-over handlers for visual feedback
            className={`bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 p-3 min-h-[300px] transition-colors ${dragOverStage === stage ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
            onDragOver={(e) => {
                e.preventDefault();
                setDragOverStage(stage);
            }}
            onDragLeave={() => setDragOverStage(null)}
            onDrop={() => {
                onDropOnStage(stage)
                setDragOverStage(null)
            }}
          >
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-sm font-semibold'>{stage}</h3>
              <span className='text-xs text-gray-500'>{columns[stage]?.length || 0}</span>
                    </div>
                    <div className='space-y-2'>
              {(columns[stage] || []).map(c => (
                <div key={c.id}
                  draggable
                  onDragStart={() => onDragStart(c)}
                  className='p-3 bg-gray-50 dark:bg-gray-800 rounded border dark:border-gray-700 cursor-grab active:cursor-grabbing'
                >
                  <div className='text-sm font-medium truncate'>{c.name}</div>
                  <div className='text-xs text-gray-500 truncate'>{c.email}</div>
                      </div>
              ))}
                      </div>
                      </div>
        ))}
                    </div>
    </div>
  )
}

// Assessments List Page
function AssessmentsListPage() {
  const [assessments, setAssessments] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const list = await api.getAssessments()
        if (mounted) setAssessments(list)
      } catch (e) {
        if (mounted) setError('Failed to load assessments')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  if (loading) return <div className='max-w-7xl mx-auto p-6'>Loading...</div>
  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>Assessments</h2>
        {/* IMPROVEMENT: Button to create a new assessment */}
        <Link to='/assessments/new' className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'>
          Create Assessment
        </Link>
      </div>
      {error && <div className='text-red-600 mb-3 text-sm'>{error}</div>}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {assessments.map(a => (
          <div key={a.id} className='bg-white dark:bg-gray-900 rounded-lg shadow-sm border p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium text-gray-900'>{a.title}</h3>
              <span className='text-2xl'>📝</span>
            </div>
            <p className='text-sm text-gray-600 line-clamp-2'>{a.description}</p>
            <div className='mt-3 text-sm text-gray-500'>Questions: {a.questions?.length || 0}</div>
                    <div className='mt-4 flex space-x-2'>
              <Link to={`/assessments/${a.jobId}`} className='flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm text-center hover:bg-blue-700'>
                        Edit
              </Link>
              <Link to={`/assessments/${a.jobId}`} className='flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm text-center hover:bg-gray-50'>
                        Preview
              </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
  )
}

// IMPROVEMENT: New component to handle the creation flow for an assessment
function CreateAssessmentPage() {
    const [jobs, setJobs] = React.useState([]);
    const [selectedJob, setSelectedJob] = React.useState('');
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetch all active jobs to choose from
                const result = await api.getJobs({ page: 1, pageSize: 100, status: 'active' });
                setJobs(result.jobs);
            } catch (e) {
                console.error("Failed to load jobs", e);
            }
        };
        fetchJobs();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedJob) {
            navigate(`/assessments/${selectedJob}`);
        }
    };

    return (
        <div className='max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800'>
            <h2 className='text-xl font-bold mb-4'>Create New Assessment</h2>
            <p className='text-sm text-gray-600 mb-4'>
                Assessments must be linked to a job. Please select a job to create an assessment for.
            </p>
            <form onSubmit={handleSubmit}>
                <label className='form-label mb-2'>Select a Job</label>
                <select
                    className='form-input'
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    required
                >
                    <option value='' disabled>-- Choose a job --</option>
                    {jobs.map(job => (
                        <option key={job.id} value={job.id}>{job.title}</option>
                    ))}
                </select>
                <div className='mt-4 flex gap-3'>
                     <button type='submit' className='btn btn-primary' disabled={!selectedJob}>
                        Continue to Builder
                    </button>
                    <Link to='/assessments' className='btn btn-secondary'>
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}


// Minimal Assessment Builder + Preview shell
function AssessmentBuilderPage() {
  const { jobId } = useParams()
  const [assessment, setAssessment] = React.useState({ title: '', questions: [] })
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const list = await api.getAssessments(jobId)
        const existing = Array.isArray(list) ? list[0] : list
        if (mounted && existing) setAssessment(existing)
      } catch (e) {}
    }
    load()
    return () => { mounted = false }
  }, [jobId])

  const addQuestion = (type) => {
    setAssessment(a => ({
      ...a,
      questions: [...(a.questions || []), { id: Date.now(), type, question: '', required: false }]
    }))
  }

  const updateQuestion = (id, updates) => {
    setAssessment(a => ({
      ...a,
      questions: a.questions.map(q => q.id === id ? { ...q, ...updates } : q)
    }))
  }

  const removeQuestion = (id) => {
    setAssessment(a => ({ ...a, questions: a.questions.filter(q => q.id !== id) }))
  }

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      await api.updateAssessment(jobId, assessment)
    } catch (e) {
      setError('Failed to save assessment')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6'>
      <div className='bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 p-6'>
        <h2 className='text-xl font-bold mb-4'>Builder</h2>
        <input
          className='form-input mb-3'
          placeholder='Assessment title'
          value={assessment.title || ''}
          onChange={(e)=> setAssessment(a => ({...a, title: e.target.value}))}
        />
        <div className='flex gap-2 mb-3'>
          {['single-choice','multi-choice','text','textarea','number','file'].map(t => (
            <button key={t} onClick={()=>addQuestion(t)} className='px-2 py-1 text-xs rounded border'>+ {t}</button>
          ))}
        </div>
        <div className='space-y-3'>
          {(assessment.questions || []).map(q => (
            <div key={q.id} className='p-3 rounded border dark:border-gray-700'>
              <div className='flex items-center gap-2'>
                <select className='border rounded px-2 py-1 text-sm' value={q.type} onChange={e=>updateQuestion(q.id,{type:e.target.value})}>
                  {['single-choice','multi-choice','text','textarea','number','file'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input className='flex-1 border rounded px-2 py-1 text-sm' placeholder='Question' value={q.question} onChange={e=>updateQuestion(q.id,{question:e.target.value})} />
                <label className='text-xs flex items-center gap-1'>
                  <input type='checkbox' checked={q.required || false} onChange={e=>updateQuestion(q.id,{required:e.target.checked})} /> required
                </label>
                <button className='text-red-600 text-xs' onClick={()=>removeQuestion(q.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className='mt-4 flex items-center gap-3'>
          <button onClick={save} disabled={saving} className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50'>Save</button>
          {error && <span className='text-sm text-red-600'>{error}</span>}
        </div>
      </div>

      <div className='bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 p-6'>
        <h2 className='text-xl font-bold mb-4'>Preview</h2>
        <AssessmentPreview assessment={assessment} />
      </div>
    </div>
  )
}

function AssessmentPreview({ assessment }) {
  if (!assessment) return null
  return (
    <form className='space-y-4'>
      <div className='text-lg font-semibold'>{assessment.title}</div>
      {(assessment.questions || []).map(q => (
        <div key={q.id} className='space-y-1'>
          <label className='text-sm font-medium'>{q.question}{q.required ? ' *' : ''}</label>
          {q.type === 'text' && <input className='form-input' />}
          {q.type === 'textarea' && <textarea className='form-input' rows={3} />}
          {q.type === 'number' && <input type='number' className='form-input' />}
          {q.type === 'file' && <input type='file' className='form-input' />}
          {(q.type === 'single-choice' || q.type === 'multi-choice') && (
            <div className='space-y-1'>
              {(q.options || ['Option A','Option B','Option C']).map((opt, i) => (
                <label key={i} className='flex items-center gap-2 text-sm'>
                  <input type={q.type === 'single-choice' ? 'radio' : 'checkbox'} name={`q-${q.id}`} />
                  {opt}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
      <button type='button' className='bg-gray-800 text-white px-4 py-2 rounded'>Submit (stub)</button>
    </form>
  )
}