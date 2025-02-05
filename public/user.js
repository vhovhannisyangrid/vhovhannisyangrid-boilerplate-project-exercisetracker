const usersForm = document.getElementById("users-form");
const usersBlock = document.getElementById("users-block");

usersForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const uname = document.getElementById('uname').value;

  if (uname.trim() === '') {
    alert('Username is required!');
    return;
  }

  const data = {
    username: uname
  };

  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      await response.json();
      getAllUsers()
    } else {
      const error = await response.json();
      console.error('Error:', error);
      alert('Error creating user!');
    }
  } catch (error) {
    console.error('Request failed', error);
    alert('Request failed!');
  }
});



async function getAllUsers() {
  try {
    const response = await fetch('/api/users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const result = await response.json();
      const { users } = result;

      usersBlock.innerHTML = "";

      if (users?.length > 0) {
        users.forEach(user => {
          const div = document.createElement("div");
          div.textContent = `ID: ${user.id}, Username: ${user.username}`;
          usersBlock.appendChild(div);
        });
      } else {
        const div = document.createElement("div");
        div.textContent = "Oops! No users found. Please create a user.";
        usersBlock.appendChild(div);
      }

    } else {
      const error = await response.json();
      console.error('Error:', error);
    }
  } catch (error) {
    console.error('Request failed', error);
    alert('Request failed!');
  }
}
