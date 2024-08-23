// script.js

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (name === '' || email === '') {
        alert('Please fill in all fields.');
    } else {
        alert('Form submitted successfully!');
        // Here, you can add more actions, like sending data to a server.
    }
});
