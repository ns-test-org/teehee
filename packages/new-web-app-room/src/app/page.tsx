'use client';

import { useEffect, useState, useRef } from 'react';

const dadJokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "I invented a new word: Plagiarism!",
  "Why don't eggs tell jokes? They'd crack each other up!",
  "I'm reading a book about anti-gravity. It's impossible to put down!",
  "Why did the scarecrow win an award? He was outstanding in his field!",
  "What do you call a fake noodle? An impasta!",
  "How does a penguin build its house? Igloos it together!",
  "Why don't skeletons fight each other? They don't have the guts!",
  "What do you call a dinosaur that crashes his car? Tyrannosaurus Wrecks!",
  "I told my wife she was drawing her eyebrows too high. She looked surprised!",
  "Why did the math book look so sad? Because it had too many problems!",
  "What's the best thing about Switzerland? I don't know, but the flag is a big plus!",
  "Why can't a bicycle stand up by itself? It's two tired!",
  "What do you call a bear with no teeth? A gummy bear!",
  "Why did the coffee file a police report? It got mugged!",
  "How do you organize a space party? You planet!",
  "What do you call a sleeping bull? A bulldozer!",
  "Why don't oysters donate? Because they are shellfish!",
  "What did the ocean say to the beach? Nothing, it just waved!",
  "Why did the cookie go to the doctor? Because it felt crumbly!",
  "What do you call a fish wearing a crown? A king fish!",
  "Why did the banana go to the doctor? It wasn't peeling well!",
  "What's orange and sounds like a parrot? A carrot!",
  "Why don't programmers like nature? It has too many bugs!",
  "What do you call a cow with no legs? Ground beef!",
  "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
  "What do you call a factory that makes okay products? A satisfactory!",
  "Why did the tomato turn red? Because it saw the salad dressing!",
  "What do you call a belt made of watches? A waist of time!",
  "Why don't scientists trust stairs? Because they're always up to something!"
];

const commands = {
  help: "Available commands: joke, random, clear, about, exit",
  about: "Dad Jokes Terminal v1.0 - The ultimate source of groan-worthy humor!",
  joke: () => dadJokes[Math.floor(Math.random() * dadJokes.length)],
  random: () => dadJokes[Math.floor(Math.random() * dadJokes.length)],
  clear: "CLEAR_SCREEN",
  exit: "Thanks for using Dad Jokes Terminal! Keep spreading the dad humor! 👨‍👧‍👦"
};

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

export default function DadJokesTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to Dad Jokes Terminal! 👨‍👧‍👦', timestamp: new Date() },
    { type: 'output', content: 'Type "help" for available commands or "joke" for a dad joke!', timestamp: new Date() },
    { type: 'output', content: '', timestamp: new Date() }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCommand = (input: string) => {
    const command = input.toLowerCase().trim();
    
    // Add user input to terminal
    setLines(prev => [...prev, { type: 'input', content: `$ ${input}`, timestamp: new Date() }]);
    
    if (command === '') {
      return;
    }

    if (command === 'clear') {
      setLines([
        { type: 'output', content: 'Welcome to Dad Jokes Terminal! 👨‍👧‍👦', timestamp: new Date() },
        { type: 'output', content: 'Type "help" for available commands or "joke" for a dad joke!', timestamp: new Date() },
        { type: 'output', content: '', timestamp: new Date() }
      ]);
      return;
    }

    // Simulate typing delay
    setIsTyping(true);
    setTimeout(() => {
      let response: string;
      
      if (commands[command as keyof typeof commands]) {
        const cmd = commands[command as keyof typeof commands];
        response = typeof cmd === 'function' ? cmd() : cmd;
      } else {
        response = `Command not found: ${command}. Type "help" for available commands.`;
      }

      setLines(prev => [...prev, { 
        type: response.startsWith('Command not found') ? 'error' : 'output', 
        content: response, 
        timestamp: new Date() 
      }]);
      setIsTyping(false);
    }, 500 + Math.random() * 1000); // Random delay between 0.5-1.5s
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim() && !isTyping) {
      handleCommand(currentInput);
      setCurrentInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      handleCommand('clear');
    }
  };

  return (
    <div className="h-screen bg-black text-green-400 font-mono overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between border-b border-gray-600">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="ml-2 text-sm">Dad Jokes Terminal</span>
        </div>
        <div className="text-xs text-gray-400">
          Press Ctrl+L to clear
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="h-full overflow-y-auto p-4 pb-20"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, index) => (
          <div key={index} className={`mb-1 ${
            line.type === 'input' ? 'text-white' : 
            line.type === 'error' ? 'text-red-400' : 'text-green-400'
          }`}>
            {line.content}
          </div>
        ))}
        
        {isTyping && (
          <div className="text-green-400 flex items-center gap-1">
            <span>Processing</span>
            <span className="animate-pulse">...</span>
          </div>
        )}

        {/* Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center mt-2">
          <span className="text-white mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent text-white outline-none flex-1 caret-green-400"
            placeholder="Type a command..."
            disabled={isTyping}
            autoComplete="off"
            spellCheck="false"
          />
          <span className="text-green-400 animate-pulse ml-1">|</span>
        </form>
      </div>

      {/* Help Panel */}
      <div className="absolute bottom-4 right-4 bg-gray-900 border border-gray-600 rounded p-3 text-xs text-gray-300">
        <div className="font-bold mb-1">Quick Commands:</div>
        <div>• joke - Get a random dad joke</div>
        <div>• help - Show all commands</div>
        <div>• clear - Clear terminal</div>
      </div>
    </div>
  );
}


