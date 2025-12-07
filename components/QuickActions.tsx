import React from 'react';
import { Mic2, Music4, Zap, Layers, AlertTriangle, HardDrive, KeyRound } from 'lucide-react';

interface QuickActionsProps {
  onSelect: (text: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onSelect }) => {
  const actions = [
    {
      icon: <Music4 size={18} />,
      label: "Logic Pro: Audio Unit Falhou",
      prompt: "Meu plugin não está validando no Plugin Manager do Logic Pro X. Como forçar a validação?"
    },
    {
      icon: <AlertTriangle size={18} />,
      label: "Logic: System Overload",
      prompt: "Estou recebendo o erro 'System Overload' (Disk is too slow) no Logic Pro. Como resolvo isso?"
    },
    {
      icon: <Mic2 size={18} />,
      label: "Latência / Atraso na Voz",
      prompt: "Estou ouvindo minha voz com atraso (eco) na gravação. Como ajusto o Buffer Size e Low Latency Mode?"
    },
    {
      icon: <KeyRound size={18} />,
      label: "Erro de Licença / iLok",
      prompt: "Meus plugins pararam de abrir e pedem ativação do iLok ou Cloud Session. O que fazer?"
    },
    {
      icon: <HardDrive size={18} />,
      label: "HD Externo 'Somente Leitura'",
      prompt: "Conectei meu HD externo no Mac mas não consigo gravar arquivos nele. Como resolver problemas de permissão ou formato?"
    },
    {
      icon: <Zap size={18} />,
      label: "Otimizar Mac para Áudio",
      prompt: "Quais são as configurações essenciais do macOS (Energy Saver, Spotlight, etc) para evitar clicks e pops no áudio?"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 px-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Problemas Comuns</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => onSelect(action.prompt)}
            className="flex items-center gap-3 p-3 bg-gray-900/40 hover:bg-gray-800 border border-gray-800 hover:border-blue-500/30 rounded-xl transition-all text-left group"
          >
            <div className="p-2 rounded-lg bg-gray-900 text-gray-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors border border-gray-800 group-hover:border-blue-500/20">
              {action.icon}
            </div>
            <span className="text-sm font-medium text-gray-300 group-hover:text-white">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;