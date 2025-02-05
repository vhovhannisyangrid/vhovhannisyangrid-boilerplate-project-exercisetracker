const exerciseForm = document.getElementById("exercise-form");
const getExerciseForm = document.getElementById("get-exercise-form");
const exerciseBlock = document.getElementById("exercise-block");

exerciseForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = document.getElementById("uid").value;
  await createExercise(userId)
});

async function createExercise(userId) {
  const description = document.getElementById('desc')?.value;
  const duration = document.getElementById('dur')?.value;
  const selectedDate = document.getElementById('date')?.value;

  if (userId && description && duration) {
    try {
      const response = await fetch(`/api/exercises/${userId}/exercise`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          duration: duration,
          date: selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        })
      });

      if (response.ok) {
        alert('Exercise is created successfully')
      } else {
        const res = await response.json()
        alert(`Exercise is not created, ${res.error}`);
      }
    } catch (e) {
      console.error('Error:', e);
    }
  } else {
    alert('Please fill in all required fields.');
  }
}

getExerciseForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = document.getElementById("euid").value;
  await getExercise(userId)
});

async function getExercise(userId) {
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const limit = document.getElementById('limit').value;
  const div = document.createElement("div");
  try {
    const response = await fetch(`/api/exercises/${userId}/logs?from=${from}&to=${to}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    if (response.ok) {
      const result = await response.json();
      const { username, log: logs, count } = result;
      exerciseBlock.innerHTML = '';
      if (logs?.length > 0) {
        logs.forEach(log => {
          div.textContent = `Username: ${username}, Date: ${log.date}, Duration: ${log.duration}`;
          exerciseBlock.appendChild(div);

        })
      } else {
        const div = document.createElement("div");
        div.textContent = "Oops! No exercise found. Please create an exercise.";
        exerciseBlock.appendChild(div);
      }
    } else {
      const error = await response.json();
      div.textContent = `${error}`;
      exerciseBlock.appendChild(div);
    }
  } catch {
    div.textContent = "Oops! No exercise found. Please create an exercise.";
    exerciseBlock.appendChild(div);
  }
}