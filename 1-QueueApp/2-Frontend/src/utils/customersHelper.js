// All functions from ChatGPT

export const calculateWaitingTime = (joiningTime, processStartTime) => {
  if (!joiningTime || !processStartTime) {
    return 0;
  }

  const joiningDate = new Date(`${joiningTime.date}T${joiningTime.hour}:00Z`);
  const processStartDate = new Date(processStartTime);

  const waitingTimeInMinutes = Math.floor((processStartDate - joiningDate) / (1000 * 60));

  return waitingTimeInMinutes;
};

export const calculateProcessingTime = (processStartTime, doneTime) => {
    if (!processStartTime) {
      return "Not in process yet";
    }

    const processStartDate = new Date(processStartTime);
    const endDate = doneTime ? new Date(doneTime) : new Date();

    const processingTimeInMinutes = Math.floor((endDate - processStartDate) / (1000 * 60));
    const hours = Math.floor(processingTimeInMinutes / 60);
    const minutes = processingTimeInMinutes % 60;

    return `${hours} hours ${minutes} minutes`.replace(/^0 hours\s*/, "");
  };

export const calculateDoneTime = (doneTime) => {
    if (!doneTime) {
      return "Not completed yet";
    }

    const doneDate = new Date(doneTime);
    return doneDate.toLocaleString();
  };
