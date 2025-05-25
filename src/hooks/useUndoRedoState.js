import { useState, useCallback, useRef } from "react";

/**
 * Custom hook that enhances useState with undo/redo functionality
 * @param {any} initialState - The initial state value or function
 * @returns {[any, Function, Object]} - Returns [state, setState, controls]
 */
const useUndoRedoState = (initialState) => {
  // Initialize the current state
  const [state, setState] = useState(initialState);

  // Use refs to maintain history outside of render cycles
  const historyRef = useRef({
    past: [],
    future: [],
    present: typeof initialState === "function" ? initialState() : initialState,
  });

  // Reference to track if we're currently performing an undo/redo operation
  const operationInProgress = useRef(false);

  // Update state and history
  const updateState = useCallback((action) => {
    const { past, present } = historyRef.current;

    // If this is an undo/redo operation, don't add to history
    if (operationInProgress.current) {
      setState(action);
      return;
    }

    // If action is a function, get the new state by calling it with present state
    const newPresent = typeof action === "function" ? action(present) : action;

    // Don't update history if the state is the same (using shallow equality)
    if (JSON.stringify(newPresent) === JSON.stringify(present)) {
      return;
    }

    // Update history
    historyRef.current = {
      past: [...past, present],
      present: newPresent,
      future: [],
    };

    // Update React state
    setState(newPresent);
  }, []);

  // Undo action
  const undo = useCallback(() => {
    const { past, present, future } = historyRef.current;

    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    operationInProgress.current = true;
    historyRef.current = {
      past: newPast,
      present: previous,
      future: [present, ...future],
    };
    setState(previous);
    operationInProgress.current = false;
  }, []);

  // Redo action
  const redo = useCallback(() => {
    const { past, present, future } = historyRef.current;

    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    operationInProgress.current = true;
    historyRef.current = {
      past: [...past, present],
      present: next,
      future: newFuture,
    };
    setState(next);
    operationInProgress.current = false;
  }, []);

  // Check if undo is available
  const canUndo = historyRef.current.past.length > 0;

  // Check if redo is available
  const canRedo = historyRef.current.future.length > 0;

  // Every time state changes, update our history ref's present value
  // This ensures the historyRef always has the current state
  historyRef.current.present = state;

  return [
    state,
    updateState,
    {
      undo,
      redo,
      canUndo,
      canRedo,
      history: historyRef.current, // Expose history for debugging if needed
    },
  ];
};

export default useUndoRedoState;
