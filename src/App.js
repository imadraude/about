import { Github, Send } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const MatrixBackground = ({ show, children }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!show) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    const katakana =
      'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン'
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const nums = '0123456789'
    const alphabet = katakana + latin + nums

    const fontSize = 16
    const columns = canvas.width / fontSize

    const rainDrops = Array(Math.floor(columns)).fill(1)

    const draw = () => {
      context.fillStyle = 'rgba(0, 0, 0, 0.05)'
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.fillStyle = '#0F0'
      context.font = fontSize + 'px monospace'

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(
          Math.floor(Math.random() * alphabet.length),
        )
        context.fillText(text, i * fontSize, rainDrops[i] * fontSize)

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0
        }
        rainDrops[i]++
      }
    }

    const interval = setInterval(draw, 30)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [show])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: show ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
        }}
      />
      {children}
    </>
  )
}

const Console = ({ onComplete }) => {
  const [lines, setLines] = useState([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const commandIndexRef = useRef(0)
  const isRunningCommandRef = useRef(false)

  const consoleCommands = [
    {
      command: 'nmap -sV -p- 192.168.1.1',
      output:
        'Starting Nmap scan...\nPort 22/tcp open  ssh\nPort 80/tcp open  http\nPort 443/tcp open  https\nNmap done: 1 IP address (1 host up) scanned',
    },
    {
      command: 'sqlmap -u "http://192.168.1.1/login.php" --forms --batch --dbs',
      output:
        "sqlmap identified the following injection point(s):\nParameter: username (POST)\n    Type: boolean-based blind\n    Title: AND boolean-based blind - WHERE or HAVING clause\n    Payload: username=admin' AND 1=1--&password=\n\navailable databases [2]:\n[*] information_schema\n[*] users",
    },
    {
      command:
        'hydra -l admin -P /usr/share/wordlists/rockyou.txt 192.168.1.1 ssh',
      output:
        '[22][ssh] host: 192.168.1.1   login: admin   password: password123\n1 of 1 target successfully completed, 1 valid password found',
    },
    {
      command: 'ssh admin@192.168.1.1',
      output:
        "admin@192.168.1.1's password: \nLast login: Fri Jul 12 10:23:18 2024 from 192.168.1.100\nadmin@server:~$ ",
    },
    {
      command: 'sudo su',
      output: '[sudo] password for admin: \nroot@server:/home/admin# ',
    },
    {
      command: 'cat /etc/shadow',
      output:
        'root:$6$tRbL...:19003:0:99999:7:::\ndaemon:*:18375:0:99999:7:::\nbin:*:18375:0:99999:7:::\nsys:*:18375:0:99999:7:::',
    },
    {
      command: 'echo "Mission accomplished. Exfiltrating data..."',
      output: 'Mission accomplished. Exfiltrating data...',
    },
  ]

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const typeCommand = async (command) => {
    setIsTyping(true)
    for (let i = 0; i < command.length; i++) {
      await sleep(30)
      setCurrentCommand((prev) => prev + command[i])
    }
    setIsTyping(false)
  }

  const runNextCommand = async () => {
    if (isRunningCommandRef.current) return
    isRunningCommandRef.current = true

    if (commandIndexRef.current >= consoleCommands.length) {
      onComplete()
      isRunningCommandRef.current = false
      return
    }

    const { command, output } = consoleCommands[commandIndexRef.current]

    setCurrentCommand('')
    await typeCommand(command)
    await sleep(500)

    setLines((prev) => [...prev, { type: 'command', text: command }])
    setCurrentCommand('')
    await sleep(500)

    setLines((prev) => [...prev, { type: 'output', text: output }])
    commandIndexRef.current++

    await sleep(1000)
    isRunningCommandRef.current = false
    runNextCommand()
  }

  useEffect(() => {
    runNextCommand()
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        right: '20px',
        fontFamily: "'Ubuntu Mono', monospace",
        fontSize: '14px',
        color: '#0F0',
        textAlign: 'left',
      }}
    >
      {lines.map((line, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          {line.type === 'command' && '> '}
          <span>{line.text}</span>
        </div>
      ))}
      {currentCommand && (
        <div>
          {'> '}
          <span>{currentCommand}</span>
          {isTyping && <span className='cursor-blink'>_</span>}
        </div>
      )}
    </div>
  )
}

const Banner = ({ show, onComplete }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#0F0',
        textShadow: '0 0 10px #0F0',
        animation: 'blink 0.5s infinite alternate',
        border: '3px solid #0F0',
        padding: '20px',
        textAlign: 'center',
        boxShadow: '0 0 10px #0F0',
      }}
    >
      ACCESS GRANTED
    </div>
  )
}

const BusinessCard = ({ show }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(53)
  const [isWaiting, setIsWaiting] = useState(false)

  const styles = {
    container: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      opacity: show ? 1 : 0,
      transition: 'opacity 1s ease-in-out',
      zIndex: 2,
      textAlign: 'center',
      padding: 'clamp(1.5rem, 5vw, 2rem)',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '20px',
      width: 'clamp(280px, 90%, 400px)',
      border: '1px solid rgba(0, 255, 0, 0.3)',
    },
    heading: {
      margin: '0 0 1rem',
      fontSize: 'clamp(2rem, 7vw, 2.5rem)',
      fontWeight: '700',
      color: '#0F0',
      textShadow: '2px 2px 4px rgba(0,255,0,0.3)',
      fontFamily: "'Ubuntu Mono', monospace",
    },
    paragraph: {
      margin: '0 0 1.5rem',
      fontSize: 'clamp(1rem, 4vw, 1.2rem)',
      lineHeight: '1.6',
      color: '#0F0',
      textShadow: '1px 1px 2px rgba(0,255,0,0.2)',
      minHeight: '4.8em',
      fontFamily: "'Ubuntu Mono', monospace",
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      flexWrap: 'wrap',
    },
    button: {
      padding: '0.7rem 1.2rem',
      borderRadius: '50px',
      border: 'none',
      background: 'rgba(0, 255, 0, 0.1)',
      color: '#0F0',
      fontSize: 'clamp(1rem, 3.5vw, 1.2rem)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      textDecoration: 'none',
      fontFamily: "'Ubuntu Mono', monospace",
    },
  }

  const typingWords = [
    'neo-nazi banderivets',
    'motherhacker',
    'beloved by %undefined%',
  ]

  useEffect(() => {
    if (!show) return

    const word = typingWords[currentWordIndex]

    if (!isDeleting && currentText === word) {
      setIsWaiting(true)
      setTimeout(() => {
        setIsWaiting(false)
        setIsDeleting(true)
      }, 2000)
      return
    }

    if (isDeleting && currentText === '') {
      setIsWaiting(false)
      setTimeout(() => {
        setIsDeleting(false)
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % typingWords.length)
      }, 333)
      return
    }

    const timeout = setTimeout(() => {
      setCurrentText((prevText) => {
        if (isDeleting) {
          setTypingSpeed(27)
          return prevText.slice(0, -1)
        } else {
          setTypingSpeed(53)
          return word.slice(0, prevText.length + 1)
        }
      })
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [
    currentText,
    isDeleting,
    currentWordIndex,
    typingWords,
    show,
    isWaiting,
    typingSpeed,
  ])

  const handleLinkClick = (url) => (e) => {
    e.preventDefault()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>imadraude</h1>
      <p style={styles.paragraph}>
        {'> '}
        {currentText}
        <span className={isWaiting ? 'cursor-blink' : 'cursor-static'}>_</span>
      </p>
      <div style={styles.buttonContainer}>
        <a
          href='https://github.com/imadraude'
          onClick={handleLinkClick('https://github.com/imadraude')}
          style={styles.button}
          className='hover-glow'
        >
          <Github size={24} />
          GitHub
        </a>
        <a
          href='https://imadraude.t.me'
          onClick={handleLinkClick('https://imadraude.t.me')}
          style={styles.button}
          className='hover-glow'
        >
          <Send size={24} />
          Telegram
        </a>
      </div>
    </div>
  )
}

const App = () => {
  const [stage, setStage] = useState(0)

  const handleConsoleComplete = () => setStage(1)
  const handleBannerComplete = () => setStage(2)

  return (
    <MatrixBackground show={stage >= 2}>
      {stage === 0 && <Console onComplete={handleConsoleComplete} />}
      <Banner show={stage === 1} onComplete={handleBannerComplete} />
      <BusinessCard show={stage === 2} />
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap');

        body {
          margin: 0;
          padding: 0;
          background-color: black;
          overflow: hidden;
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        .cursor-blink {
          animation: blink 0.7s infinite;
        }

        .cursor-static {
          opacity: 1;
        }

        .hover-glow:hover {
          background: rgba(0, 255, 0, 0.15) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.3) !important;
        }

        @media (max-width: 600px) {
          .hover-glow:hover {
            transform: none !;
          }
        }
      `}</style>
    </MatrixBackground>
  )
}

export default App
