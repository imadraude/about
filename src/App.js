import { Binary, Github, Send } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const MatrixBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const katakana =
      'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン'
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const nums = '0123456789'
    const alphabet = katakana + latin + nums

    const fontSize = 16
    const columns = canvas.width / fontSize

    const rainDrops = []

    for (let x = 0; x < columns; x++) {
      rainDrops[x] = 1
    }

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

    return () => clearInterval(interval)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  )
}

const TypingEffect = ({ words }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(53)
  const [isWaiting, setIsWaiting] = useState(false)

  useEffect(() => {
    const word = words[currentWordIndex]

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
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length)
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
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed])

  return (
    <span>
      {'> '}
      {currentText}
      <span className={isWaiting ? 'cursor-blink' : 'cursor-static'}>_</span>
    </span>
  )
}

const TiltCard = ({ children, style }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [tiltStyle, setTiltStyle] = useState({})
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const card = cardRef.current
    const cardRect = card.getBoundingClientRect()
    const cardCenterX = cardRect.left + cardRect.width / 2
    const cardCenterY = cardRect.top + cardRect.height / 2
    const mouseX = e.clientX - cardCenterX
    const mouseY = e.clientY - cardCenterY
    const rotateX = -(mouseY / cardRect.height) * 10
    const rotateY = (mouseX / cardRect.width) * 10

    setTiltStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'transform 0.1s ease-out',
    })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTiltStyle({
      transform: 'rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.3s ease-out',
    })
  }

  const combinedStyle = {
    ...style,
    ...tiltStyle,
    boxShadow: `0 4px 6px rgba(0, 255, 0, 0.1), 0 0 20px rgba(0, 255, 0, 0.05) inset, 
                ${
                  isHovered
                    ? '0 0 40px rgba(0, 255, 0, 0.2)'
                    : '0 0 0 rgba(0, 255, 0, 0)'
                }`,
    transition: 'box-shadow 0.5s ease-out, transform 0.1s ease-out',
  }

  return (
    <div
      ref={cardRef}
      style={combinedStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

const BusinessCard = () => {
  const styles = {
    container: {
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      perspective: '1000px',
      fontFamily: "'Ubuntu Mono', monospace",
    },
    card: {
      position: 'relative',
      zIndex: 2,
      textAlign: 'center',
      padding: '3rem',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '20px',
      maxWidth: '80%',
      width: '400px',
      transformStyle: 'preserve-3d',
      border: '1px solid rgba(0, 255, 0, 0.3)',
    },
    heading: {
      margin: '0 0 1rem',
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#0F0',
      textShadow: '2px 2px 4px rgba(0,255,0,0.3)',
      fontFamily: "'Ubuntu Mono', monospace",
    },
    paragraph: {
      margin: '0 0 1.5rem',
      fontSize: '1rem',
      lineHeight: '1.6',
      color: '#0F0',
      textShadow: '1px 1px 2px rgba(0,255,0,0.2)',
      height: '3em',
    },
    accent: {
      position: 'absolute',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: 'linear-gradient(45deg, #0F0, #00FF00, #00FF00)',
      top: '-25px',
      left: '-25px',
      boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
    },
    button: {
      padding: '0.5rem 1rem',
      borderRadius: '50px',
      border: 'none',
      background: 'rgba(0, 255, 0, 0.1)',
      color: '#0F0',
      fontSize: '1rem',
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
    'loved by %undefined%',
  ]

  const handleLinkClick = (url) => (e) => {
    e.preventDefault()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={styles.container}>
      <MatrixBackground />
      <TiltCard style={styles.card}>
        <div style={styles.accent}>
          <Binary size={30} color='#000' />
        </div>
        <h1 style={styles.heading}>imadraude</h1>
        <p style={styles.paragraph}>
          <TypingEffect words={typingWords} />
        </p>
        <div style={styles.buttonContainer}>
          <a
            href='https://github.com/imadraude'
            onClick={handleLinkClick('https://github.com/imadraude')}
            style={styles.button}
            className='hover-glow'
          >
            <Github size={20} />
            GitHub
          </a>
          <a
            href='https://imadraude.t.me'
            onClick={handleLinkClick('https://imadraude.t.me')}
            style={styles.button}
            className='hover-glow'
          >
            <Send size={20} />
            Telegram
          </a>
        </div>
      </TiltCard>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap');

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
          animation: blink 0.7s ease-in-out infinite;
        }

        .cursor-static {
          opacity: 1;
        }

        .hover-glow {
          transition: all 0.3s ease;
        }

        .hover-glow:hover {
          background: rgba(0, 255, 0, 0.15) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.3) !important;
        }
      `}</style>
    </div>
  )
}

export default BusinessCard
