const CHECKPOINTS_KEY = "checkpoints";

class CheckpointsStateHelper {
  static setCheckpoints(checkpoints) {
    localStorage.setItem(CHECKPOINTS_KEY, JSON.stringify(checkpoints));
  }

  static getCheckpoints() {
    const checkpoints = localStorage.getItem(CHECKPOINTS_KEY);
    return checkpoints ? JSON.parse(checkpoints) : [];
  }

  static deleteCheckpoints() {
    localStorage.removeItem(CHECKPOINTS_KEY);
  }
}

export default CheckpointsStateHelper;
