import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Code2, User, Briefcase, HelpCircle, X, Github, Mail, Globe, MapPin } from 'lucide-react';

interface Command {
  name: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [showCommands, setShowCommands] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const welcomeMessage = [
    'Welcome to my interactive portfolio! 👋',
    'Type \'help\' to see available commands.',
    ''
  ];

  const commands: Command[] = [
    {
      name: 'about',
      description: 'Display information about me',
      icon: <User className="w-4 h-4" />,
      action: () => {
        addOutput([
          '=== About Me ===',
          '👋 Hi, I\'m Jorge!',
          '💻 Full Stack Developer passionate about creating innovative web solutions',
          '🎮 Game Development Enthusiast',
          '🌟 Specialized in:',
          '  - Frontend Development (React, Vue)',
          '  - Backend Development (Node.js, Python)',
          '  - Game Development (Unity, WebGL)',
          '',
          '📍 Based in Spain',
          '📧 Contact: jorge@example.com'
        ]);
      }
    },
    {
      name: 'skills',
      description: 'List my technical skills',
      icon: <Code2 className="w-4 h-4" />,
      action: () => {
        addOutput([
          '=== Technical Skills ===',
          '🔹 Frontend:',
          '  ▪️ React/Next.js     ████████░░ 80%',
          '  ▪️ Vue.js           ███████░░░ 70%',
          '  ▪️ TypeScript       ████████░░ 80%',
          '',
          '🔹 Backend:',
          '  ▪️ Node.js          ███████░░░ 70%',
          '  ▪️ Python           ████████░░ 80%',
          '  ▪️ PostgreSQL       ██████░░░░ 60%',
          '',
          '🔹 Other:',
          '  ▪️ WebGL            ████████░░ 80%',
          '  ▪️ Unity            ███████░░░ 70%',
          '  ▪️ Git              ████████░░ 80%'
        ]);
      }
    },
    {
      name: 'experience',
      description: 'Show my work experience',
      icon: <Briefcase className="w-4 h-4" />,
      action: () => {
        addOutput([
          '=== Work Experience ===',
          '🏢 Senior Game Developer @ PixelForge (2022 - Present)',
          '  • Led development of 3 successful browser-based games',
          '  • Implemented optimized WebGL rendering pipelines',
          '  • Mentored junior developers in game development practices',
          '',
          '🏢 WebGL Engineer @ TechNova (2020 - 2022)',
          '  • Developed 15+ interactive web experiences',
          '  • Optimized 3D rendering performance',
          '  • Collaborated with designers for seamless UX integration',
          '',
          '🏢 Frontend Developer @ WebSolutions (2018 - 2020)',
          '  • Built responsive web applications using React',
          '  • Implemented CI/CD pipelines',
          '  • Reduced load times by 40%'
        ]);
      }
    },
    {
      name: 'help',
      description: 'Show available commands',
      icon: <HelpCircle className="w-4 h-4" />,
      action: () => {
        addOutput([
          '=== Available Commands ===',
          'Type any of these commands or click the icons:',
          '',
          '📌 about      - Display information about me',
          '📌 skills     - List my technical skills',
          '📌 experience - Show my work experience',
          '📌 help       - Show this help message',
          '📌 clear      - Clear the terminal'
        ]);
      }
    }
  ];

  const addOutput = (lines: string[]) => {
    setOutput(prev => [...prev, ...lines]);
    setTimeout(() => {
      terminalRef.current?.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    setOutput(prev => [...prev, `> ${cmd}`]);
    
    if (trimmedCmd === 'clear') {
      setOutput([...welcomeMessage]); // Keep welcome message after clear
      return;
    }

    const command = commands.find(c => c.name === trimmedCmd);
    if (command) {
      command.action();
    } else if (trimmedCmd) {
      addOutput([`Command not found: ${trimmedCmd}. Type 'help' for available commands.`]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input) {
      handleCommand(input);
      setInput('');
    }
  };

  useEffect(() => {
    setOutput(welcomeMessage);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        e.preventDefault();
        setShowCommands(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowCommands(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-4 font-mono relative">
      <div className="max-w-7xl mx-auto flex gap-4 h-[calc(100vh-2rem)]">
        {/* Profile Column */}
        <div className="w-80 bg-black/50 rounded-lg border border-green-500/20 shadow-lg backdrop-blur-sm p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Profile Image */}
          <div className="relative w-48 h-48 mx-auto">
            <img
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop"
              alt="Profile"
              className="rounded-lg object-cover border-2 border-green-500/20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
          </div>

          {/* Name and Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-400 mb-2">Jorge Developer</h1>
            <p className="text-green-400/80">Full Stack & Game Developer</p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-green-400/80">
            <MapPin className="w-4 h-4" />
            <span>Spain</span>
          </div>

          {/* Quick Info */}
          <div className="space-y-4">
            <div className="border-t border-green-500/20 pt-4">
              <h2 className="text-lg font-semibold text-green-400 mb-2">About Me</h2>
              <p className="text-green-400/80 text-sm leading-relaxed">
                Passionate developer specializing in web and game development. Creating immersive experiences with modern technologies.
              </p>
            </div>

            <div className="border-t border-green-500/20 pt-4">
              <h2 className="text-lg font-semibold text-green-400 mb-2">Skills</h2>
              <div className="space-y-2">
                {['React', 'TypeScript', 'WebGL', 'Unity', 'Node.js'].map((skill) => (
                  <div key={skill} className="text-sm text-green-400/80">{skill}</div>
                ))}
              </div>
            </div>

            <div className="border-t border-green-500/20 pt-4">
              <h2 className="text-lg font-semibold text-green-400 mb-2">Contact & Links</h2>
              <div className="space-y-2">
                <a
                  href="mailto:jorge@example.com"
                  className="flex items-center gap-2 text-green-400/80 hover:text-green-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">jorge@example.com</span>
                </a>
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-400/80 hover:text-green-400 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span className="text-sm">GitHub</span>
                </a>
                <a
                  href="https://itch.io/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-400/80 hover:text-green-400 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">itch.io</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal Section */}
        <div className="flex-1 bg-black/50 rounded-lg border border-green-500/20 shadow-lg backdrop-blur-sm overflow-hidden">
          {/* Terminal Header */}
          <div className="border-b border-green-500/20 p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-green-400" />
              <span className="text-sm text-green-400">portfolio.exe</span>
            </div>
            <button
              onClick={() => setShowCommands(prev => !prev)}
              className="text-xs border border-green-500/20 px-2 py-1 rounded hover:bg-green-500/10 transition-colors text-green-400"
            >
              Commands (⌘K)
            </button>
          </div>

          {/* Terminal Output */}
          <div
            ref={terminalRef}
            className="h-[calc(100%-3rem)] overflow-y-auto p-4 space-y-1 text-green-400"
          >
            {output.map((line, i) => (
              <pre key={i} className="whitespace-pre-wrap">{line}</pre>
            ))}
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <span className="text-green-500">❯</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-green-400"
                autoFocus
              />
            </form>
          </div>
        </div>

        {/* Command Palette */}
        {showCommands && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-gray-800 w-full max-w-md rounded-lg border border-green-500/20 shadow-xl">
              <div className="p-4 border-b border-green-500/20 flex items-center justify-between">
                <h2 className="text-lg text-green-400">Available Commands</h2>
                <button
                  onClick={() => setShowCommands(false)}
                  className="hover:text-green-300 transition-colors text-green-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-2">
                {commands.map((cmd) => (
                  <button
                    key={cmd.name}
                    onClick={() => {
                      handleCommand(cmd.name);
                      setShowCommands(false);
                    }}
                    className="w-full p-2 flex items-center gap-3 hover:bg-green-500/10 rounded transition-colors text-green-400"
                  >
                    {cmd.icon}
                    <div className="flex-1 text-left">
                      <div className="font-medium">{cmd.name}</div>
                      <div className="text-xs text-green-400/70">{cmd.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;