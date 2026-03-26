#include <cstdint>
#include <cstring>
#include <random>
#include <vector>
#include <algorithm>
#include <unordered_map>

// Constants
const int WIDTH = 7;
const int HEIGHT = 6;
const int CELLS = WIDTH * HEIGHT;
using Bitboard = uint64_t;

#include "solver/position.h"
#include "solver/settings.h"
#include "solver/solver.h"

#include "solver/position.cpp"
#include "solver/solver.cpp"
#include "solver/table.cpp"
#include "solver/entry.cpp"
#include "solver/util/writer.cpp"

Position pos{};
Solver solver{};

/* emcc -s EXPORT_ES6=1 -s ENVIRONMENT=worker -s EXPORTED_FUNCTIONS="['_init','_getBestMove','_playMove','_resetBoard','_getBoardState','_isGameOver']" -s EXPORTED_RUNTIME_METHODS="['cwrap']" -o connect4_solver.js connect4_solver.cpp */


// ----------------------------------------------------------------------
// WebAssembly Exported Functions (C-style for JavaScript)
// ----------------------------------------------------------------------
extern "C" {

    // Initialize the solver

    // Reset the game board
    void resetBoard() {
        Position newPos{};
        pos = newPos;
        // solver.clear_state();
    }

    void init() {
        resetBoard();
    }

    // Play a move (0-6 columns) for given player (0 or 1)
    // Returns: 1 if move was valid, 0 otherwise
    int playMove(int col, int player) {
        pos.move(col);
        return 1;
    }

    // Get the best move for given player (0 or 1)
    int getBestMove(int player) {
        int score = solver.solve(pos);
        return solver.get_best_move(pos, score);
    }
}
