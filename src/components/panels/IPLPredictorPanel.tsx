import React, { useState } from 'react';
import { Trophy, ArrowRight } from 'lucide-react';

interface Team {
  name: string;
  city: string;
  stadium: string;
  captain: string;
}

const teams: Team[] = [
  { name: 'Chennai Super Kings', city: 'Chennai', stadium: 'M. A. Chidambaram Stadium', captain: 'Ruturaj Gaikwad' },
  { name: 'Delhi Capitals', city: 'New Delhi', stadium: 'Arun Jaitley Stadium', captain: 'Axar Patel' },
  { name: 'Gujarat Titans', city: 'Ahmedabad', stadium: 'Narendra Modi Stadium', captain: 'Shubman Gill' },
  { name: 'Kolkata Knight Riders', city: 'Kolkata', stadium: 'Eden Gardens', captain: 'Ajinkya Rahane' },
  { name: 'Lucknow Super Giants', city: 'Lucknow', stadium: 'BRSABV Ekana Stadium', captain: 'Rishabh Pant' },
  { name: 'Mumbai Indians', city: 'Mumbai', stadium: 'Wankhede Stadium', captain: 'Hardik Pandya' },
  { name: 'Punjab Kings', city: 'Mohali', stadium: 'Maharaja Yadavindra Singh Stadium', captain: 'Shreyas Iyer' },
  { name: 'Rajasthan Royals', city: 'Jaipur', stadium: 'Sawai Mansingh Stadium', captain: 'Sanju Samson' },
  { name: 'Royal Challengers Bengaluru', city: 'Bengaluru', stadium: 'M. Chinnaswamy Stadium', captain: 'Rajat Patidar' },
  { name: 'Sunrisers Hyderabad', city: 'Hyderabad', stadium: 'Rajiv Gandhi Stadium', captain: 'Pat Cummins' },
];

const IPLPredictorPanel: React.FC = () => {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [venue, setVenue] = useState('');
  const [prediction, setPrediction] = useState<{
    winner: string;
    firstInningsScore: number;
    description: string;
  } | null>(null);

  const handleTeam1Change = (value: string) => {
    setTeam1(value);
    // If team2 is the same as new team1, clear team2
    if (value === team2) {
      setTeam2('');
    }
    // Update venue to team1's home ground if team1 is selected
    if (value) {
      const team = teams.find(t => t.name === value);
      if (team) {
        setVenue(team.stadium);
      }
    }
  };

  const handleTeam2Change = (value: string) => {
    setTeam2(value);
    // If team1 is the same as new team2, clear team1
    if (value === team1) {
      setTeam1('');
    }
  };

  const generatePrediction = () => {
    if (!team1 || !team2 || !venue) return;

    const isHighScoring = Math.random() > 0.5;
    const firstInningsScore = isHighScoring ? 
      Math.floor(200 + Math.random() * 40) : 
      Math.floor(140 + Math.random() * 60);
    
    const winner = Math.random() > 0.5 ? team1 : team2;
    const margin = Math.floor(Math.random() * 40) + 10;
    
    const descriptions = [
      `At ${venue}`,
      `In a ${isHighScoring ? 'high-scoring thriller' : 'tactical battle'}`,
      firstInningsScore > 200 ? 'Batters dominated the game' : 'Bowlers kept things tight',
      `First innings total: ${firstInningsScore} (${firstInningsScore > 200 ? 'Above' : 'Below'} 200)`
    ];

    setPrediction({
      winner,
      firstInningsScore,
      description: `${descriptions.join(', ')}, ${winner} emerges victorious by ${margin} runs.`
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-6">
        <Trophy className="text-yellow-400 mr-2" size={24} />
        <h2 className="text-xl font-bold text-yellow-300">IPL Score Predictor</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-yellow-400">Team 1 (Batting First)</label>
            <select
              value={team1}
              onChange={(e) => handleTeam1Change(e.target.value)}
              className="w-full bg-black/30 border border-yellow-900/50 rounded-lg px-4 py-2 text-yellow-300 focus:outline-none focus:border-yellow-500"
            >
              <option value="">Select Team 1</option>
              {teams.map(team => (
                <option 
                  key={team.name} 
                  value={team.name}
                  disabled={team.name === team2}
                >
                  {team.name}
                </option>
              ))}
            </select>
            {team1 && (
              <p className="text-xs text-yellow-600">
                Captain: {teams.find(t => t.name === team1)?.captain}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-yellow-400">Team 2 (Chasing)</label>
            <select
              value={team2}
              onChange={(e) => handleTeam2Change(e.target.value)}
              className="w-full bg-black/30 border border-yellow-900/50 rounded-lg px-4 py-2 text-yellow-300 focus:outline-none focus:border-yellow-500"
            >
              <option value="">Select Team 2</option>
              {teams.map(team => (
                <option 
                  key={team.name} 
                  value={team.name}
                  disabled={team.name === team1}
                >
                  {team.name}
                </option>
              ))}
            </select>
            {team2 && (
              <p className="text-xs text-yellow-600">
                Captain: {teams.find(t => t.name === team2)?.captain}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-yellow-400">Venue</label>
            <select
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full bg-black/30 border border-yellow-900/50 rounded-lg px-4 py-2 text-yellow-300 focus:outline-none focus:border-yellow-500"
            >
              <option value="">Select Venue</option>
              {teams.map(team => (
                <option key={team.stadium} value={team.stadium}>{team.stadium}</option>
              ))}
            </select>
            {venue && (
              <p className="text-xs text-yellow-600">
                City: {teams.find(t => t.stadium === venue)?.city}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={generatePrediction}
          disabled={!team1 || !team2 || !venue}
          className="w-full bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Predict Match Outcome
        </button>

        {prediction && (
          <div className="mt-8 p-6 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg border border-yellow-900/50">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-bold text-yellow-300">{team1}</div>
              <ArrowRight className="text-yellow-500" />
              <div className="text-xl font-bold text-yellow-300">{team2}</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">First Innings Score:</span>
                <span className="text-yellow-300 font-bold">
                  {prediction.firstInningsScore} runs
                  <span className="ml-2 text-sm">
                    ({prediction.firstInningsScore > 200 ? '> 200' : '< 200'})
                  </span>
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Predicted Winner:</span>
                <span className="text-yellow-300 font-bold">{prediction.winner}</span>
              </div>
              
              <div className="mt-4 text-yellow-400 text-sm italic">
                {prediction.description}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPLPredictorPanel;