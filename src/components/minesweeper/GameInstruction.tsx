export const GameInstructions: React.FC = () => {
  return (
    <div className="bg-blue-50 rounded-lg p-3 md:p-4 mb-4 md:mb-6 text-xs md:text-sm text-blue-800">
      <p className="mb-2">
        <strong>How to play:</strong> Left-click/tap to reveal cells, right-click or long-press to flag suspected mines.
      </p>
      <p className="mb-2">
        <strong>Keyboard controls:</strong> Arrow keys to navigate, Space/Enter to reveal, F to flag, Escape to exit navigation.
      </p>
      <p>
        Numbers show how many mines are adjacent to that cell. Clear all safe cells to win!
      </p>
    </div>
  );
};
