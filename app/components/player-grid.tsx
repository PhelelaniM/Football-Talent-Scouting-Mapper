import { Player } from '../types'

interface PlayerGridProps {
  players: Player[]
}

export default function PlayerGrid({ players }: PlayerGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {players.map((player, index) => (
        <div key={index} className="p-4 border rounded-lg shadow-sm">
          <h3 className="font-bold">{player.name}</h3>
          <p className="text-sm text-gray-600">{player.position}</p>
          <p className="text-sm text-gray-600">{player.club}</p>
          <p className="text-sm text-gray-600">{player.city}, {player.province}</p>
        </div>
      ))}
    </div>
  )
}
