import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import PoliceStation from './components/PoliceStation'
import Courtroom from './components/Courtroom'
import { PHASES, PAGES } from './utils/constants'
import { storage } from './utils/storage'

const initialNewCase = { title: '', accused: '', description: '', evidence: '' }

export default function App() {
  const [wallet, setWallet] = useState(null)
  const [points, setPoints] = useState(0)
  const [cases, setCases] = useState([])
  const [activeCaseId, setActiveCaseId] = useState(null)
  const [currentPhase, setCurrentPhase] = useState(PHASES.NEW_CASE)
  const [timeRemaining, setTimeRemaining] = useState(3600)
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [votes, setVotes] = useState({})
  const [currentPage, setCurrentPage] = useState(PAGES.POLICE)
  const [sirenActive, setSirenActive] = useState(true)
  const [newCase, setNewCase] = useState(initialNewCase)

  useEffect(() => {
    loadData()
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) return calculateNextPhaseTime()
        return prev - 1
      })
    }, 1000)

    const sirenTimer = setInterval(() => setSirenActive(prev => !prev), 1000)

    return () => {
      clearInterval(timer)
      clearInterval(sirenTimer)
    }
  }, [])

  const loadData = async () => {
    try {
      const storedCases = await storage.list('case:')
      if (storedCases?.keys) {
        const loadedCases = await Promise.all(storedCases.keys.map(async key => {
          const result = await storage.get(key)
          return result ? JSON.parse(result.value) : null
        }))
        setCases(loadedCases.filter(Boolean))
      }

      const pointsResult = await storage.get('user-points')
      if (pointsResult) setPoints(parseInt(pointsResult.value))

      const activeResult = await storage.get('active-case')
      if (activeResult) setActiveCaseId(activeResult.value)
    } catch (error) {
      console.log('First time loading', error)
    }
  }

  const calculateNextPhaseTime = () => {
    if (currentPhase === PHASES.INVESTIGATION) {
      setCurrentPhase(PHASES.DELIBERATION)
      return 21600
    } else if (currentPhase === PHASES.DELIBERATION) {
      setCurrentPhase(PHASES.VERDICT)
      return 18000
    } else if (currentPhase === PHASES.VERDICT) {
      setCurrentPhase(PHASES.NEW_CASE)
      return 3600
    } else {
      setCurrentPhase(PHASES.INVESTIGATION)
      return 43200
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        if (chainId !== '0xa86a') {
          try {
            await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xa86a' }] })
          } catch (switchError) {
            if (switchError.code === 4902) {
              await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId: '0xa86a', chainName: 'Avalanche C-Chain', nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 }, rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'], blockExplorerUrls: ['https://snowtrace.io/'] }] })
            }
          }
        }
        setWallet(accounts[0])
        await awardPoints(50, 'Wallet Connected')
      } catch (error) {
        console.error('Wallet connection failed:', error)
      }
    } else {
      alert('Please install MetaMask or another Web3 wallet!')
    }
  }

  const awardPoints = async (amount, reason) => {
    const newPoints = points + amount
    setPoints(newPoints)
    try { await storage.set('user-points', newPoints.toString()) } catch (error) { console.error('Failed to save points:', error) }
  }

  const submitCase = async () => {
    if (!wallet) { alert('Please connect your wallet first!'); return }
    if (!newCase.title || !newCase.accused || !newCase.description) { alert('Please fill in all required fields!'); return }

    const caseData = { id: `case_${Date.now()}`, ...newCase, submittedBy: wallet, timestamp: Date.now(), votes: 0, evidence: [], status: 'pending' }
    try {
      await storage.set(`case:${caseData.id}`, JSON.stringify(caseData))
      setCases([...cases, caseData])
      setNewCase(initialNewCase)
      setShowSubmitForm(false)
      await awardPoints(100, 'Case Submitted')
    } catch (error) { console.error('Failed to submit case:', error) }
  }

  const voteForCase = async (caseId) => {
    if (!wallet) { alert('Please connect your wallet first!'); return }
    if (votes[caseId]) { alert('You already voted for this case!'); return }

    const updatedCases = cases.map(c => c.id === caseId ? { ...c, votes: c.votes + 1 } : c)
    setCases(updatedCases)
    setVotes({ ...votes, [caseId]: true })

    try {
      const caseToUpdate = updatedCases.find(c => c.id === caseId)
      await storage.set(`case:${caseId}`, JSON.stringify(caseToUpdate))
      await awardPoints(25, 'Voted on Case')
    } catch (error) { console.error('Failed to save vote:', error) }
  }

  const activateCase = async (caseId) => {
    setActiveCaseId(caseId)
    setCurrentPhase(PHASES.INVESTIGATION)
    setTimeRemaining(43200)
    setCurrentPage(PAGES.COURT)
    try {
      await storage.set('active-case', caseId)
      const updatedCases = cases.map(c => c.id === caseId ? { ...c, status: 'active' } : c)
      setCases(updatedCases)
      await awardPoints(50, 'Case Activated')
    } catch (error) { console.error('Failed to activate case:', error) }
  }

  const castVerdict = async (verdict) => {
    if (!wallet || !activeCaseId) return
    await awardPoints(75, `Verdict Cast: ${verdict}`)
    alert(`You voted: ${verdict.toUpperCase()}`)
  }

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h}h ${m}m ${s}s`
  }

  const getPhaseInfo = () => {
    switch(currentPhase) {
      case PHASES.INVESTIGATION: return { title: 'INVESTIGATION PHASE', icon: ({className}) => <span className={className}>🔍</span> }
      case PHASES.DELIBERATION: return { title: 'DELIBERATION PHASE', icon: ({className}) => <span className={className}>📄</span> }
      case PHASES.VERDICT: return { title: 'VERDICT PHASE', icon: ({className}) => <span className={className}>⚖️</span> }
      case PHASES.NEW_CASE: return { title: 'NEW CASE SELECTION', icon: ({className}) => <span className={className}>🛡️</span> }
      default: return { title: 'PENDING', icon: ({className}) => <span className={className}>⏱️</span> }
    }
  }

  const phaseInfo = getPhaseInfo()
  const activeCase = cases.find(c => c.id === activeCaseId)
  const pendingCases = cases.filter(c => c.status === 'pending').sort((a,b) => b.votes - a.votes)

  return (
    <div className="min-h-screen bg-white">
      <Header points={points} wallet={wallet} onConnect={connectWallet} currentPage={currentPage} setCurrentPage={setCurrentPage} sirenActive={sirenActive} />

      {currentPage === PAGES.POLICE && (
        <PoliceStation pendingCases={pendingCases} showSubmitForm={showSubmitForm} setShowSubmitForm={setShowSubmitForm} newCase={newCase} setNewCase={setNewCase} submitCase={submitCase} votes={votes} voteForCase={voteForCase} sirenActive={sirenActive} />
      )}

      {currentPage === PAGES.COURT && (
        <Courtroom phaseInfo={phaseInfo} timeRemaining={timeRemaining} activeCase={activeCase} activeCaseId={activeCaseId} currentPhase={currentPhase} pendingCases={pendingCases} onActivateCase={activateCase} onGoToPolice={() => setCurrentPage(PAGES.POLICE)} castVerdict={castVerdict} formatTime={formatTime} />
      )}
    </div>
  )
}
